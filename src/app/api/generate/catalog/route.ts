import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const productSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().optional(),
  price: z.string().optional(),
});

const schema = z.object({
  products: z.array(productSchema).min(1).max(4),
  catalogStyle: z.string().default("ecommerce_clean"),
  layout: z.string().default("single"),
  brandName: z.string().optional(),
  description: z.string().max(300).optional(),
});

const STYLE_PROMPTS: Record<string, string> = {
  ecommerce_clean: "clean white background, professional e-commerce product photo, crisp lighting",
  luxury_editorial: "luxury editorial style, dark premium background, sophisticated lighting, high fashion",
  lifestyle_casual: "lifestyle casual setting, natural light, warm atmosphere, real environment",
  marketplace_simple: "simple clean marketplace listing style, neutral background, clear product visibility",
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { products, catalogStyle, brandName, description } = parsed.data;
    const validProducts = products.filter((p) => p.image);
    const cost = GENERATION_COSTS.CATALOG * validProducts.length;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const inputImages = validProducts.map((p) => p.image as string);

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "CATALOG",
        status: "PROCESSING",
        inputImages,
        settings: { catalogStyle, brandName, description, productCount: validProducts.length },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const styleDesc = STYLE_PROMPTS[catalogStyle] || STYLE_PROMPTS.ecommerce_clean;
    const images: string[] = [];

    for (const product of validProducts) {
      if (!product.image) continue;

      const parts = [
        "product catalog photo",
        styleDesc,
        product.name ? `product: ${product.name}` : "",
        brandName ? `brand: ${brandName}` : "",
        description || "",
        "high quality, professional photography",
      ].filter(Boolean);

      const result = await falGenerate(FAL_MODELS.FLUX_KONTEXT, {
        image_url: product.image,
        prompt: parts.join(", "),
        num_inference_steps: 28,
        guidance_scale: 3.5,
      });

      const url = result.images?.[0]?.url || result.image?.url;
      if (url) images.push(url);
    }

    if (images.length === 0) throw new Error("Sem resultados gerados");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: images, completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, images });
  } catch (error) {
    console.error("Catalog generation error:", error);
    return NextResponse.json({ error: "Erro na geração do catálogo" }, { status: 500 });
  }
}
