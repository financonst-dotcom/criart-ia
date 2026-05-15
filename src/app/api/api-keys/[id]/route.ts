import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { id } = await params;

    const key = await prisma.apiKey.findUnique({ where: { id } });
    if (!key || key.userId !== session.userId) {
      return NextResponse.json({ error: "Chave não encontrada" }, { status: 404 });
    }

    await prisma.apiKey.update({ where: { id }, data: { isActive: false } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao revogar chave" }, { status: 500 });
  }
}
