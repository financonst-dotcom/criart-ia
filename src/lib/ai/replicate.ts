import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const MODELS = {
  VIRTUAL_TRYON: "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
  REMOVE_BG: "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
  UPSCALE: "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
  FLUX_DEV: "black-forest-labs/flux-dev",
  FLUX_SCHNELL: "black-forest-labs/flux-schnell",
  FLUX_FILL: "black-forest-labs/flux-fill-dev",
  CONTROLNET: "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
  IP_ADAPTER: "lucataco/ip-adapter-sdxl:c6bbd4f4bc7e40bffcb18ba8a3d0e3eaa7daa2c5c91b6fd9b30e7e2e0bcfd44c",
  INSTANT_ID: "zsxkib/instant-id:d4b0f06a2c5ad6fdb24c7ff5a8cfe7ece4c90e7f09ddaeab7f8e558d42c38e4e",
  FACE_SWAP: "lucataco/faceswap:9a4298548422074c3f57258c5d544497a19901a0",
} as const;

export async function runPrediction<T>(
  model: string,
  input: Record<string, unknown>
): Promise<T> {
  const output = await replicate.run(model as `${string}/${string}`, { input });
  return output as T;
}

export async function runPredictionStreamed(
  model: string,
  input: Record<string, unknown>,
  onOutput: (url: string) => void
): Promise<void> {
  for await (const event of replicate.stream(model as `${string}/${string}`, { input })) {
    if (event.event === "output" && typeof event.data === "string") {
      onOutput(event.data);
    }
  }
}
