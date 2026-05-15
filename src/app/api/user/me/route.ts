import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        credits: true,
        role: true,
        totalCreditsUsed: true,
        createdAt: true,
        subscription: {
          select: { plan: true, status: true, currentPeriodEnd: true },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const { name, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      select: { id: true, name: true, email: true, avatar: true, credits: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
