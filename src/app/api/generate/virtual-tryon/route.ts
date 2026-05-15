import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  garmentImage: z.string().url(),
  modelImage: z.string().url(),
  category: z.enum(["upper_body", "lower_body", "dresses", "full_body"]).default("upper_body"),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "NÃ£o autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados invÃ¡lidos" }, { status: 400 });

    const { garmentImage, modelImage, category } = parsed.data;
    const cost = GENERATION_COSTS.VIRTUAL_TRYON;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "CrÃ©ditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "VIRTUAL_TRYON",
        status: "PROCESSING",
        inputImages: [garmentImage, modelImage],
        settings: { category },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const result = await falGenerate(FAL_MODELS.VIRTUAL_TRYON, {
      model_image: modelImage,
      garment_image: garmentImage,
      category,
      with_auto_mask: true,
      with_parsing_model: true,
    });

    const outputUrl = result.image?.url || (result.images && result.images[0]?.url);
    if (!outputUrl) throw new Error("Sem resultado da IA");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages: [outputUrl], completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, image: outputUrl });
  } catch (error) {
    console.error("Virtual try-on error:", error);
    return NextResponse.json({ error: "Erro no Virtual Try-On" }, { status: 500 });
  }
}
