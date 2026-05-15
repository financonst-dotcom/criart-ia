import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { falGenerate, FAL_MODELS } from "@/lib/ai/fal";
import { GENERATION_COSTS } from "@/lib/utils";

const PLATFORM_SPECS: Record<string, { width: number; height: number; label: string }> = {
  instagram_feed: { width: 1080, height: 1080, label: "Instagram Feed" },
  instagram_stories: { width: 1080, height: 1920, label: "Instagram Stories" },
  instagram_reels: { width: 1080, height: 1920, label: "Instagram Reels" },
  facebook_post: { width: 1200, height: 630, label: "Facebook Post" },
  twitter_post: { width: 1600, height: 900, label: "Twitter/X Post" },
  pinterest: { width: 1000, height: 1500, label: "Pinterest" },
  tiktok_cover: { width: 1080, height: 1920, label: "TikTok Cover" },
  whatsapp_status: { width: 1080, height: 1920, label: "WhatsApp Status" },
};

const schema = z.object({
  imageUrl: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  style: z.string().default("minimal"),
  brandColor: z.string().optional(),
  text: z.string().max(150).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { imageUrl, platforms, style, text } = parsed.data;
    const cost = GENERATION_COSTS.SOCIAL_PACK;

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { credits: true } });
    if (!user || user.credits < cost) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "SOCIAL_PACK",
        status: "PROCESSING",
        inputImages: [imageUrl],
        settings: { platforms, style, text },
        creditsUsed: cost,
      },
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: cost }, totalCreditsUsed: { increment: cost } },
    });

    const STYLE_PROMPTS: Record<string, string> = {
      minimal: "minimalist clean design, white background, elegant typography",
      bold: "bold vibrant design, strong colors, impactful layout",
      luxury: "luxury premium design, gold accents, dark background, sophisticated",
      colorful: "colorful playful design, bright gradient, energetic",
    };

    const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS.minimal;
    const results: Array<{ platform: string; label: string; url: string }> = [];

    for (const platformId of platforms) {
      const spec = PLATFORM_SPECS[platformId];
      if (!spec) continue;

      const prompt = [
        `social media post for ${spec.label}`,
        styleDesc,
        text ? `with text: "${text}"` : "",
        "professional social media design, high quality",
      ].filter(Boolean).join(", ");

      const result = await falGenerate(FAL_MODELS.FLUX_KONTEXT, {
        image_url: imageUrl,
        prompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      });

      const url = result.images?.[0]?.url || result.image?.url;
      if (url) {
        results.push({ platform: platformId, label: spec.label, url });
      }
    }

    if (results.length === 0) throw new Error("Sem resultados gerados");

    const outputImages = results.map((r) => r.url);

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED", outputImages, completedAt: new Date() },
    });

    return NextResponse.json({ generationId: generation.id, results });
  } catch (error) {
    console.error("Social pack generation error:", error);
    return NextResponse.json({ error: "Erro na geração do pack social" }, { status: 500 });
  }
}
