import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  garmentImage: z.string().url(),
  modelImage: z.string().url().nullable().optional(),
  description: z.string().max(500).optional().default(""),
  sceneOrientation: z.string().max(300).optional(),
  format: z.enum(["square", "portrait", "stories", "landscape"]).default("square"),
  style: z.string().default("photorealistic"),
  numImages: z.number().min(1).max(4).default(1),
});

const FORMAT_SIZES = {
  square: [1024, 1024],
  portrait: [864, 1080],
  stories: [608, 1080],
  landscape: [1280, 720],
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "NÃ£o autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { garmentImage, modelImage, description, sceneOrientation, format, style, numImages } = parsed.data;

    const costPerImage = GENERATION_COSTS.OUTFIT_SWAP;
    const totalCost = costPerImage * numImages;

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { credits: true },
    });

    if (!user || user.credits < totalCost) {
      return NextResponse.json(
        { error: `CrÃ©ditos insuficientes. NecessÃ¡rio: ${totalCost}, disponÃ­vel: ${user?.credits || 0}` },
        { status: 402 }
      );
    }

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "OUTFIT_SWAP",
        status: "PROCESSING",
        prompt: description,
        settings: { format, style, numImages },
        inputImages: [garmentImage, ...(modelImage ? [modelImage] : [])],
        creditsUsed: totalCost,
      },
    });

    // Deduct credits
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.userId },
        data: {
          credits: { decrement: totalCost },
          totalCreditsUsed: { increment: totalCost },
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: session.userId,
          type: "CONSUMPTION",
          amount: -totalCost,
          balance: user.credits - totalCost,
          description: `Troca de roupa - ${numImages} imagem(ns)`,
          generationId: generation.id,
        },
      }),
    ]);

    const [width, height] = FORMAT_SIZES[format];

    const prompt = [
      description,
      style !== "photorealistic" ? style : "",
      sceneOrientation || "fundo neutro, sem efeitos especiais",
      "high quality, realistic, professional fashion photography",
      "preserve garment texture, logo, pattern, and details",
    ]
      .filter(Boolean)
      .join(", ");

    // Use Flux Kontext for outfit swap (context-aware generation)
    const outputImages: string[] = [];

    for (let i = 0; i < numImages; i++) {
      try {
        let result;

        if (modelImage) {
          // Virtual try-on with provided model
          result = await falGenerate(FAL_MODELS.VIRTUAL_TRYON, {
            model_image: modelImage,
            garment_image: garmentImage,
            category: "upper_body",
          });
        } else {
          // Generate model + outfit with Flux
          result = await falGenerate(FAL_MODELS.FLUX_KONTEXT, {
            prompt,
            image_url: garmentImage,
            image_size: { width, height },
            guidance_scale: 3.5,
            num_inference_steps: 28,
          });
        }

        const imageUrl =
          (result.images && result.images[0]?.url) ||
          result.image?.url ||
          (typeof result.output === "string" ? result.output : null) ||
          (Array.isArray(result.output) ? result.output[0] : null);

        if (imageUrl) outputImages.push(imageUrl);
      } catch (err) {
        console.error(`Generation ${i + 1} failed:`, err);
      }
    }

    if (outputImages.length === 0) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "FAILED", errorMessage: "Nenhuma imagem gerada" },
      });

      // Refund credits
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.userId },
          data: {
            credits: { increment: totalCost },
            totalCreditsUsed: { decrement: totalCost },
          },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: session.userId,
            type: "REFUND",
            amount: totalCost,
            balance: user.credits,
            description: "Reembolso - falha na geraÃ§Ã£o",
            generationId: generation.id,
          },
        }),
      ]);

      return NextResponse.json(
        { error: "Falha na geraÃ§Ã£o de imagens. CrÃ©ditos reembolsados." },
        { status: 500 }
      );
    }

    // Update generation as completed
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: "COMPLETED",
        outputImages,
        completedAt: new Date(),
        creditsUsed: GENERATION_COSTS.OUTFIT_SWAP * outputImages.length,
      },
    });

    return NextResponse.json({
      generationId: generation.id,
      images: outputImages.map((url) => ({ url })),
      creditsUsed: totalCost,
    });
  } catch (error) {
    console.error("Outfit swap error:", error);
    return NextResponse.json(
      { error: "Erro interno na geraÃ§Ã£o" },
      { status: 500 }
    );
  }
}
