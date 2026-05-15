import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.userId },
      select: { id: true, name: true, prefix: true, lastUsedAt: true, createdAt: true, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(keys);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

const createSchema = z.object({ name: z.string().min(1).max(64) });

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Nome inválido" }, { status: 400 });

    const existingCount = await prisma.apiKey.count({ where: { userId: session.userId, isActive: true } });
    if (existingCount >= 5) {
      return NextResponse.json({ error: "Máximo de 5 chaves ativas" }, { status: 400 });
    }

    const rawKey = `fai_${nanoid(40)}`;
    const prefix = rawKey.substring(0, 12);

    const key = await prisma.apiKey.create({
      data: {
        userId: session.userId,
        name: parsed.data.name,
        keyHash: rawKey,
        prefix,
      },
    });

    return NextResponse.json({
      id: key.id,
      name: key.name,
      prefix,
      key: rawKey,
      createdAt: key.createdAt,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao criar chave" }, { status: 500 });
  }
}
