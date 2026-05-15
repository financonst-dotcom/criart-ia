// Cloudflare R2 / AWS S3 storage utility

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  // Use AWS SDK pattern with fetch for R2 compatibility
  const url = `${endpoint}/${R2_BUCKET}/${key}`;

  // For production, use @aws-sdk/client-s3 with R2 endpoint
  // This is a simplified version
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
    },
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(`Storage upload failed: ${response.statusText}`);
  }

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function downloadAndUpload(
  sourceUrl: string,
  key: string
): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error("Failed to fetch source image");

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return uploadToR2(buffer, key, contentType);
}

export function generateStorageKey(
  userId: string,
  type: string,
  filename: string
): string {
  const timestamp = Date.now();
  const ext = filename.split(".").pop() || "jpg";
  return `users/${userId}/${type}/${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`;
}
