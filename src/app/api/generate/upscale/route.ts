import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  imageUrl: z.string().url(),
  scale: z.number().min(2).max(4).default(4),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { imageUrl, scale } = parsed.data;
    const cost = GENERATION_COSTS.UPSCALE;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "UPSCALE",
        status: "PROCESSING",
        inputImages: [imageUrl],
        settings: { scale },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const result = await falGenerate(FAL_MODELS.UPSCALE, {
      image_url: imageUrl,
      upscaling_factor: scale,
      overlapping_tiles: true,
      checkpoint: "v0/v0.1",
    });

    const outputUrl = result.image?.url || (result.images && result.images[0]?.url);
    if (!outputUrl) throw new Error("Sem resultado");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: [outputUrl], completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, image: outputUrl });
  } catch (error) {
    console.error("Upscale error:", error);
    return NextResponse.json({ error: "Erro no upscaling" }, { status: 500 });
  }
}
