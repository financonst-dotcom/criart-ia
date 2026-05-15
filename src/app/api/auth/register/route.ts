import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email jÃ¡ cadastrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        credits: 10,
        totalCreditsEarned: 10,
        subscription: {
          create: {
            plan: "FREE",
            status: "ACTIVE",
            monthlyCredits: 10,
          },
        },
      },
    });

    // Log initial credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        type: "BONUS",
        amount: 10,
        balance: 10,
        description: "BÃ´nus de boas-vindas",
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      { message: "Conta criada com sucesso", userId: user.id },
      { status: 201 }
    );

    response.cookies.set(setAuthCookie(token));
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
