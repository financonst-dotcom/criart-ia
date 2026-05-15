import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  imageUrl: z.string().url(),
  preset: z.string().optional(),
  customPrompt: z.string().max(300).optional(),
});

const PRESET_PROMPTS: Record<string, string> = {
  studio_white: "pure white clean studio background, professional photography",
  studio_black: "dark black studio background, dramatic lighting, premium",
  sunset_beach: "tropical beach sunset, golden hour, warm light, palm trees",
  luxury_marble: "luxury white marble background, elegant, modern interior",
  urban_street: "modern urban street, city background, bokeh, golden hour",
  forest_nature: "lush green forest nature background, sunlight through trees",
  modern_office: "modern minimalist office interior, clean professional setting",
  pastel_pink: "soft pastel pink background, feminine, elegant, gradient",
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { imageUrl, preset, customPrompt } = parsed.data;
    const cost = GENERATION_COSTS.BACKGROUND_SWAP;

    if (!preset && !customPrompt) {
      return NextResponse.json({ error: "Informe um preset ou prompt" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const bgPrompt = preset ? PRESET_PROMPTS[preset] : customPrompt!;

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "BACKGROUND_SWAP",
        status: "PROCESSING",
        inputImages: [imageUrl],
        settings: { preset, customPrompt },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const result = await falGenerate(FAL_MODELS.BACKGROUND_REPLACE, {
      image_url: imageUrl,
      prompt: bgPrompt,
    });

    const outputUrl = result.image?.url || (result.images && result.images[0]?.url);
    if (!outputUrl) throw new Error("Sem resultado");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: [outputUrl], completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, image: outputUrl });
  } catch (error) {
    return NextResponse.json({ error: "Erro na troca de fundo" }, { status: 500 });
  }
}
