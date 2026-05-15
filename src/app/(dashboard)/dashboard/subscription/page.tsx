"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Zap, Check, Crown, Rocket, Building2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    icon: Sparkles,
    price: 0,
    credits: 10,
    features: ["10 créditos totais", "Remoção de fundo", "Upscaling básico", "Exportar JPG/PNG"],
    current: true,
  },
  {
    id: "STARTER",
    name: "Starter",
    icon: Zap,
    price: 4700,
    credits: 100,
    features: ["100 créditos / mês", "Troca de roupa", "Todos os formatos", "Suporte por email"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
  },
  {
    id: "PRO",
    name: "Pro",
    icon: Rocket,
    price: 14700,
    credits: 500,
    highlighted: true,
    badge: "Mais popular",
    features: ["500 créditos / mês", "Todos os recursos", "API de acesso", "Suporte prioritário", "Geração de vídeos", "Campanhas automáticas"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: Building2,
    price: 39700,
    credits: 2000,
    features: ["2.000 créditos / mês", "Tudo do Pro", "White label", "Multi usuários", "SLA garantido"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
  },
];

const CREDIT_PACKS = [
  { credits: 50, price: 2500, label: "50 créditos", priceLabel: "R$ 25,00" },
  { credits: 150, price: 6900, label: "150 créditos", priceLabel: "R$ 69,00", badge: "Popular" },
  { credits: 500, price: 19900, label: "500 créditos", priceLabel: "R$ 199,00", badge: "Melhor valor" },
  { credits: 1000, price: 34900, label: "1.000 créditos", priceLabel: "R$ 349,00" },
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  }

  async function handleBuyCredits(pack: typeof CREDIT_PACKS[0]) {
    setLoading(`pack-${pack.credits}`);
    try {
      const res = await fetch("/api/billing/buy-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: pack.credits, price: pack.price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Assinatura & Créditos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu plano e créditos</p>
        </div>
      </div>

      {/* Current plan widget */}
      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-brand-400" />
          </div>
          <div>
            <div className="font-bold text-foreground text-lg">Plano Free</div>
            <div className="text-sm text-muted-foreground">
              <span className="text-brand-400 font-bold text-xl">10</span> créditos restantes
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="glass-brand" asChild>
            <a href="#plans">Fazer upgrade</a>
          </Button>
        </div>
      </div>

      {/* Plans */}
      <div id="plans">
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <Crown className="w-5 h-5 text-brand-400" />
          Planos de assinatura
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "rounded-2xl border p-5 flex flex-col gap-4 transition-all hover:-translate-y-0.5",
                  plan.highlighted
                    ? "border-brand-500/50 bg-brand-500/5 shadow-brand"
                    : plan.current
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-card"
                )}
              >
                {plan.badge && (
                  <div className="absolute -mt-8 left-1/2">
                    <span className="text-xs font-semibold bg-brand-500 text-white px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center",
                      plan.highlighted ? "bg-brand-500/20 text-brand-400" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{plan.name}</span>
                  </div>
                  {plan.current && <Badge variant="success" className="text-xs">Atual</Badge>}
                </div>

                <div>
                  {plan.price === 0 ? (
                    <div className="text-2xl font-bold text-foreground">Grátis</div>
                  ) : (
                    <div className="text-2xl font-bold gradient-text">
                      R$ {(plan.price / 100).toFixed(0)}
                      <span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {plan.credits.toLocaleString("pt-BR")} créditos
                  </div>
                </div>

                {!plan.current && (
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    loading={loading === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Assinar {plan.name}
                  </Button>
                )}

                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Credit packs */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-400" />
          Comprar créditos avulsos
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack, i) => (
            <motion.div
              key={pack.credits}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "rounded-2xl border bg-card p-5 text-center hover:border-brand-500/30 hover:-translate-y-0.5 transition-all cursor-pointer",
                pack.badge === "Melhor valor" ? "border-brand-500/40" : "border-border"
              )}
              onClick={() => handleBuyCredits(pack)}
            >
              {pack.badge && (
                <div className="mb-2">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    pack.badge === "Popular" ? "bg-brand-500/20 text-brand-400" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {pack.badge}
                  </span>
                </div>
              )}
              <div className="text-2xl font-bold gradient-text mb-1">{pack.credits}</div>
              <div className="text-xs text-muted-foreground mb-3">créditos</div>
              <div className="font-bold text-foreground">{pack.priceLabel}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                R$ {((pack.price / pack.credits) / 100).toFixed(2)} / crédito
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
