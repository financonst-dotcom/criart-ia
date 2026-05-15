import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Conta sem senha definida" }, { status: 400 });
    }

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: session.userId }, data: { passwordHash: newHash } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao alterar senha" }, { status: 500 });
  }
}
