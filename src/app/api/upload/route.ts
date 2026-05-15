import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStorageKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "NÃ£o autenticado" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "Arquivo nÃ£o encontrado" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Arquivo muito grande (mÃ¡x 10MB)" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo nÃ£o suportado" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = generateStorageKey(session.userId, "uploads", file.name);

    // In production, upload to R2/S3
    // For development, return a data URL
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Save asset record
    const asset = await prisma.asset.create({
      data: {
        userId: session.userId,
        type: "IMAGE",
        url: dataUrl,
        key,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ url: dataUrl, assetId: asset.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
