import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  imageUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "URL inválida" }, { status: 400 });

    const { imageUrl } = parsed.data;
    const cost = GENERATION_COSTS.REMOVE_BG;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "REMOVE_BG",
        status: "PROCESSING",
        inputImages: [imageUrl],
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const result = await falGenerate(FAL_MODELS.REMOVE_BACKGROUND, {
      image_url: imageUrl,
    });

    const outputUrl = result.image?.url || (result.images && result.images[0]?.url);
    if (!outputUrl) throw new Error("Sem resultado");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: [outputUrl], completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, image: outputUrl });
  } catch (error) {
    console.error("Remove BG error:", error);
    return NextResponse.json({ error: "Erro na remoção de fundo" }, { status: 500 });
  }
}
