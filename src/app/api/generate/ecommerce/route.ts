import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  productImage: z.string().url(),
  bgStyle: z.enum(["white", "lifestyle", "premium", "gradient", "marketplace", "outdoor"]).default("white"),
  format: z.enum(["square", "portrait", "landscape"]).default("square"),
  description: z.string().max(300).optional().default(""),
  numImages: z.number().min(1).max(4).default(1),
});

const FORMAT_SIZES: Record<string, [number, number]> = {
  square: [1024, 1024],
  portrait: [864, 1080],
  landscape: [1280, 720],
};

const BG_PROMPTS: Record<string, string> = {
  white: "pure white background, clean studio lighting, product photography",
  lifestyle: "natural lifestyle setting, home or outdoor environment",
  premium: "dark luxury background, premium product photography, dramatic lighting",
  gradient: "soft gradient background, pastel colors, clean design",
  marketplace: "clean white background, marketplace style, product listing photo",
  outdoor: "outdoor natural setting, sunlight, nature background",
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { productImage, bgStyle, format, description, numImages } = parsed.data;
    const cost = GENERATION_COSTS.PRODUCT_PHOTO * numImages;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: `Créditos insuficientes. Necessário: ${cost}` }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "PRODUCT_PHOTO",
        status: "PROCESSING",
        settings: { bgStyle, format, numImages },
        inputImages: [productImage],
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const [width, height] = FORMAT_SIZES[format];
    const bgPrompt = BG_PROMPTS[bgStyle] || BG_PROMPTS.white;

    const outputImages: string[] = [];

    for (let i = 0; i < numImages; i++) {
      try {
        const result = await falGenerate(FAL_MODELS.BACKGROUND_REPLACE, {
          image_url: productImage,
          prompt: `${bgPrompt}${description ? `, ${description}` : ""}`,
          image_size: { width, height },
          negative_prompt: "blurry, distorted, deformed",
        });

        const url = (result.images && result.images[0]?.url) || result.image?.url;
        if (url) outputImages.push(url);
      } catch (err) {
        console.error(`E-commerce photo ${i + 1} failed:`, err);
      }
    }

    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: outputImages.length > 0 ? "COMPLETED" : "FAILED",
        outputImages,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ generationId: generation.id, images: outputImages });
  } catch (error) {
    return NextResponse.json({ error: "Erro na geração" }, { status: 500 });
  }
}
