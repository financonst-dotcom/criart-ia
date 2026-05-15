import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const schema = z.object({
  gender: z.enum(["feminine", "masculine", "neutral"]).default("feminine"),
  age: z.enum(["teen", "young", "adult", "mature"]).default("young"),
  ethnicity: z.string().default("caucasian"),
  style: z.string().default("fashion"),
  pose: z.string().default("standing"),
  expression: z.string().default("natural"),
  format: z.enum(["square", "portrait", "stories"]).default("portrait"),
  description: z.string().max(500).optional().default(""),
  numImages: z.number().min(1).max(4).default(1),
});

const AGE_PROMPTS: Record<string, string> = {
  teen: "18-22 years old",
  young: "25-32 years old",
  adult: "35-45 years old",
  mature: "48-55 years old",
};

const ETHNICITY_PROMPTS: Record<string, string> = {
  asian: "East Asian",
  black: "Black African",
  caucasian: "Caucasian European",
  hispanic: "Latin Hispanic",
  mixed: "mixed ethnicity",
  middle_eastern: "Middle Eastern",
};

const FORMAT_SIZES: Record<string, [number, number]> = {
  square: [1024, 1024],
  portrait: [768, 1024],
  stories: [576, 1024],
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { gender, age, ethnicity, style, pose, expression, format, description, numImages } = parsed.data;
    const totalCost = GENERATION_COSTS.AVATAR_CREATION * numImages;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { credits: true },
    });

    if (!user || user.credits < totalCost) {
      return NextResponse.json(
        { error: `Créditos insuficientes. Necessário: ${totalCost}` },
        { status: 402 }
      );
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "AVATAR_CREATION",
        status: "PROCESSING",
        settings: { gender, age, ethnicity, style, pose, expression, format, numImages },
        creditsUsed: totalCost,
      },
    });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.userId },
        data: { credits: { decrement: totalCost }, totalCreditsUsed: { increment: totalCost } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: session.userId,
          type: "CONSUMPTION",
          amount: -totalCost,
          balance: user.credits - totalCost,
          description: `Criação de avatar - ${numImages} imagem(ns)`,
          generationId: generation.id,
        },
      }),
    ]);

    const genderPrompt = gender === "feminine" ? "beautiful woman" : gender === "masculine" ? "handsome man" : "person";
    const agePrompt = AGE_PROMPTS[age] || "25-35 years old";
    const ethnicityPrompt = ETHNICITY_PROMPTS[ethnicity] || ethnicity;

    const basePrompt = [
      `highly realistic photo of a ${genderPrompt}`,
      `${agePrompt}`,
      `${ethnicityPrompt}`,
      `${style} style`,
      `${pose} pose`,
      `${expression} expression`,
      description,
      "professional model, fashion photography, sharp focus, high resolution",
      "photorealistic, 8k, ultra detailed",
    ].filter(Boolean).join(", ");

    const [width, height] = FORMAT_SIZES[format];
    const outputImages: string[] = [];

    for (let i = 0; i < numImages; i++) {
      try {
        const result = await falGenerate(FAL_MODELS.FLUX_DEV, {
          prompt: basePrompt,
          negative_prompt: "deformed, blurry, bad anatomy, cartoon, anime, painting, sketch",
          image_size: { width, height },
          guidance_scale: 7.5,
          num_inference_steps: 30,
          seed: Math.floor(Math.random() * 2147483647),
        });

        const imageUrl =
          (result.images && result.images[0]?.url) ||
          result.image?.url;

        if (imageUrl) outputImages.push(imageUrl);
      } catch (err) {
        console.error(`Avatar generation ${i + 1} failed:`, err);
      }
    }

    if (outputImages.length === 0) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Falha na criação do avatar" }, { status: 500 });
    }

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages, completedAt: new Date() },
    });

    return NextResponse.json({
      generationId: generation.id,
      images: outputImages,
      creditsUsed: totalCost,
    });
  } catch (error) {
    console.error("Avatar generation error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
