import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  artImage: z.string().min(1),
  mockupType: z.string().default("tshirt_front"),
  background: z.string().default("Branco"),
  numImages: z.number().min(1).max(4).default(2),
});

const MOCKUP_PROMPTS: Record<string, string> = {
  tshirt_front: "white t-shirt front view, product mockup, clean studio",
  tshirt_back: "white t-shirt back view, product mockup, clean studio",
  hoodie: "white hoodie sweatshirt, product mockup, clean studio",
  mug: "white ceramic mug, product mockup, clean studio",
  bag_tote: "white tote bag, product mockup, clean studio",
  phone_case: "white phone case, product mockup, clean studio",
  poster: "framed poster print on wall, product mockup",
  pillow: "white throw pillow, product mockup, living room setting",
  notebook: "white notebook journal, product mockup, desk setting",
  cap: "white baseball cap, product mockup, clean studio",
  packaging: "white product packaging box, product mockup, clean studio",
  bottle: "white water bottle, product mockup, clean studio",
};

const BACKGROUND_PROMPTS: Record<string, string> = {
  Branco: "pure white clean studio background",
  Preto: "dark black studio background, dramatic",
  Cinza: "neutral gray studio background",
  Madeira: "natural wood table surface background",
  Marmore: "white marble surface background",
  Colorido: "colorful gradient background, vibrant",
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });

    const { artImage, mockupType, background, numImages } = parsed.data;
    const cost = GENERATION_COSTS.MOCKUP * numImages;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Creditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "MOCKUP",
        status: "PROCESSING",
        inputImages: [artImage],
        settings: { mockupType, background, numImages },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const mockupDesc = MOCKUP_PROMPTS[mockupType] || "product mockup, clean studio";
    const bgDesc = BACKGROUND_PROMPTS[background] || BACKGROUND_PROMPTS["Branco"];
    const prompt = `${mockupDesc}, ${bgDesc}, professional product photography, high quality`;

    const images: string[] = [];

    for (let i = 0; i < numImages; i++) {
      const result = await falGenerate(FAL_MODELS.FLUX_KONTEXT, {
        image_url: artImage,
        prompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      });
      const url = result.images?.[0]?.url || result.image?.url;
      if (url) images.push(url);
    }

    if (images.length === 0) throw new Error("Sem resultado de imagens");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: images, completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, images });
  } catch (error) {
    console.error("Mockup generation error:", error);
    return NextResponse.json({ error: "Erro na geracao de mockup" }, { status: 500 });
  }
}
