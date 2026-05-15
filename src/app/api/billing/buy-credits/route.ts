import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

const CREDIT_PACKS = {
  pack_100: { credits: 100, price: 1990, label: "100 créditos" },
  pack_300: { credits: 300, price: 4990, label: "300 créditos" },
  pack_700: { credits: 700, price: 9990, label: "700 créditos" },
  pack_1500: { credits: 1500, price: 17990, label: "1500 créditos" },
} as const;

const schema = z.object({
  packId: z.enum(["pack_100", "pack_300", "pack_700", "pack_1500"]),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Pack inválido" }, { status: 400 });

    const { packId } = parsed.data;
    const pack = CREDIT_PACKS[packId];

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { email: true, stripeCustomerId: true },
    });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await prisma.user.update({ where: { id: session.userId }, data: { stripeCustomerId: customerId } });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: pack.price,
            product_data: {
              name: pack.label,
              description: `${pack.credits} créditos para usar nas ferramentas de IA`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=credits`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=1`,
      metadata: {
        userId: session.userId,
        type: "credit_pack",
        packId,
        credits: String(pack.credits),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Buy credits error:", error);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
