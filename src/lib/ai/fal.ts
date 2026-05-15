// Fal.ai client wrapper for fashion AI operations

const FAL_BASE = "https://queue.fal.run";

export const FAL_MODELS = {
  FLUX_KONTEXT: "fal-ai/flux-kontext/max",
  FLUX_DEV: "fal-ai/flux/dev",
  STABLE_DIFFUSION: "fal-ai/stable-diffusion-xl",
  FACE_TO_STICKER: "fal-ai/face-to-sticker",
  CONSISTENT_CHARACTER: "fal-ai/consistent-character",
  CHANGE_CLOTHES: "fal-ai/change-clothes",
  VIRTUAL_TRYON: "fal-ai/cat-vton",
  VIDEO_GEN: "fal-ai/stable-video",
  BACKGROUND_REPLACE: "fal-ai/bria-background/replace",
  REMOVE_BACKGROUND: "fal-ai/imageutils/rembg",
  UPSCALE: "fal-ai/aura-sr",
  FACEPULSE: "fal-ai/facepulse",
} as const;

interface FalResponse {
  images?: Array<{ url: string; width: number; height: number }>;
  image?: { url: string };
  video?: { url: string };
  output?: string | string[];
}

export async function falGenerate(
  model: string,
  input: Record<string, unknown>
): Promise<FalResponse> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) throw new Error("FAL_KEY not configured");

  const submitRes = await fetch(`${FAL_BASE}/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({ input }),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    throw new Error(`Fal.ai error: ${err}`);
  }

  const { request_id } = await submitRes.json();

  // Poll for result
  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 2000));
    attempts++;

    const statusRes = await fetch(
      `${FAL_BASE}/${model}/requests/${request_id}`,
      {
        headers: { Authorization: `Key ${apiKey}` },
      }
    );

    if (!statusRes.ok) continue;

    const status = await statusRes.json();

    if (status.status === "COMPLETED") {
      return status.output as FalResponse;
    }

    if (status.status === "FAILED") {
      throw new Error(status.error || "Generation failed");
    }
  }

  throw new Error("Generation timed out");
}
