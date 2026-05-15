import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  productImage: z.string().url(),
  campaignText: z.string().max(500).optional().default(""),
  callToAction: z.string().max(100).optional().default(""),
  platforms: z.array(z.string()).min(1),
  style: z.string().default("Moderno"),
});

const PLATFORM_SIZES: Record<string, { width: number; height: number }> = {
  instagram_post: { width: 1080, height: 1080 },
  instagram_stories: { width: 1080, height: 1920 },
  shopee: { width: 800, height: 800 },
  mercadolivre: { width: 1200, height: 1200 },
  youtube: { width: 1280, height: 720 },
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "NÃ£o autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { productImage, campaignText, callToAction, platforms, style } = parsed.data;
    const cost = GENERATION_COSTS.CAMPAIGN * platforms.length;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: `CrÃ©ditos insuficientes. NecessÃ¡rio: ${cost}` }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "CAMPAIGN",
        status: "PROCESSING",
        settings: { platforms, style, campaignText, callToAction },
        inputImages: [productImage],
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const images: Array<{ platform: string; url: string }> = [];

    for (const platform of platforms) {
      try {
        const sizes = PLATFORM_SIZES[platform] || { width: 1080, height: 1080 };

        const prompt = [
          `professional marketing creative for ${platform}`,
          campaignText,
          callToAction && `call to action: "${callToAction}"`,
          `${style.toLowerCase()} style`,
          "high quality, professional design, marketing material",
          "vibrant colors, clean layout, product focused",
        ].filter(Boolean).join(", ");

        const result = await falGenerate(FAL_MODELS.FLUX_KONTEXT, {
          prompt,
          image_url: productImage,
          image_size: sizes,
          guidance_scale: 3.5,
          num_inference_steps: 25,
        });

        const url = (result.images && result.images[0]?.url) || result.image?.url;
        if (url) images.push({ platform, url });
      } catch (err) {
        console.error(`Campaign generation for ${platform} failed:`, err);
      }
    }

    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: images.length > 0 ? "COMPLETED" : "FAILED",
        outputImages: images.map((i) => i.url),
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ generationId: generation.id, images });
  } catch (error) {
    console.error("Campaign generation error:", error);
    return NextResponse.json({ error: "Erro na geraÃ§Ã£o de campanha" }, { status: 500 });
  }
}
