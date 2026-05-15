import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as string;

        if (!userId || !planId) break;

        const monthlyCredits = PLAN_CREDITS[planId] || 10;

        await prisma.$transaction([
          prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan: planId as any,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription as string,
              monthlyCredits,
            },
            update: {
              plan: planId as any,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription as string,
              monthlyCredits,
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              credits: { increment: monthlyCredits },
              totalCreditsEarned: { increment: monthlyCredits },
            },
          }),
          prisma.creditTransaction.create({
            data: {
              userId,
              type: "SUBSCRIPTION_RENEWAL",
              amount: monthlyCredits,
              balance: 0,
              description: `Assinatura ${planId} ativada`,
            },
          }),
        ]);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          const credits = PLAN_CREDITS[dbSub.plan] || 10;

          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: {
                credits: { increment: credits },
                totalCreditsEarned: { increment: credits },
              },
            }),
            prisma.creditTransaction.create({
              data: {
                userId,
                type: "SUBSCRIPTION_RENEWAL",
                amount: credits,
                balance: 0,
                description: `Renovação mensal - ${credits} créditos`,
              },
            }),
          ]);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "CANCELED", plan: "FREE" },
        });
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
