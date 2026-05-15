import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  imageUrl: z.string().url(),
  motionStyle: z.string().default("zoom_in"),
  duration: z.number().min(3).max(10).default(5),
  prompt: z.string().max(300).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { imageUrl, motionStyle, duration, prompt } = parsed.data;
    const cost = GENERATION_COSTS.VIDEO;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "VIDEO",
        status: "PROCESSING",
        inputImages: [imageUrl],
        settings: { motionStyle, duration },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const videoPrompt = [
      prompt,
      motionStyle.replace("_", " "),
      "smooth motion, cinematic, high quality fashion video",
    ].filter(Boolean).join(", ");

    const result = await falGenerate(FAL_MODELS.VIDEO_GEN, {
      image_url: imageUrl,
      motion_bucket_id: 127,
      fps: 25,
      augmentation_level: 0,
      prompt: videoPrompt,
    });

    const videoUrl = result.video?.url || (typeof result.output === "string" ? result.output : null);
    if (!videoUrl) throw new Error("Sem resultado de vídeo");

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputVideo: videoUrl, completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, video: videoUrl });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: "Erro na geração de vídeo" }, { status: 500 });
  }
}
