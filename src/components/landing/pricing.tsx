"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, Sparkles, Zap, Building2, Rocket, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    icon: Zap,
    monthlyPrice: 4700,
    yearlyPrice: 3900,
    credits: 100,
    description: "Para quem está começando",
    features: [
      "100 créditos / mês",
      "Troca de roupa básica",
      "Remoção de fundo",
      "Upscaling",
      "Suporte por email",
      "Exportar em JPG/PNG",
    ],
    color: "border-border",
    btnVariant: "outline" as const,
  },
  {
    id: "PRO",
    name: "Pro",
    icon: Rocket,
    monthlyPrice: 14700,
    yearlyPrice: 11700,
    credits: 500,
    description: "Para criadores e e-commerces",
    highlighted: true,
    badge: "Mais popular",
    features: [
      "500 créditos / mês",
      "Todos os recursos de IA",
      "Virtual Try-On avançado",
      "Avatar creator completo",
      "Campanhas automáticas",
      "Geração de vídeos",
      "Suporte prioritário",
      "API de acesso",
      "Exportar em alta resolução",
    ],
    color: "border-brand-500/50",
    btnVariant: "default" as const,
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: Building2,
    monthlyPrice: 39700,
    yearlyPrice: 33700,
    credits: 2000,
    description: "Para agências e times",
    features: [
      "2.000 créditos / mês",
      "Todos os recursos Pro",
      "White label",
      "Multi usuários (até 10)",
      "Marca customizada",
      "Suporte dedicado",
      "SLA garantido",
      "API ilimitada",
      "Treinamento de equipe",
    ],
    color: "border-border",
    btnVariant: "outline" as const,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    icon: Crown,
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 10000,
    description: "Para grandes operações",
    features: [
      "Créditos customizados",
      "Todos os recursos Business",
      "Modelos de IA exclusivos",
      "Integração personalizada",
      "Usuários ilimitados",
      "Suporte 24/7",
      "SLA premium",
      "Onboarding dedicado",
      "Contrato anual",
    ],
    color: "border-border",
    btnVariant: "glass" as const,
  },
];

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="pricing" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400">
            <Sparkles className="w-4 h-4" />
            Planos transparentes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text-white">Comece grátis,</span>
            <br />
            <span className="gradient-text">escale quando precisar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            10 créditos grátis para testar. Sem cartão de crédito necessário.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                billing === "monthly"
                  ? "bg-brand-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                billing === "yearly"
                  ? "bg-brand-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Anual
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Todos os planos incluem 10 créditos grátis para teste. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  billing,
  index,
  inView,
}: {
  plan: (typeof PLANS)[0];
  billing: "monthly" | "yearly";
  index: number;
  inView: boolean;
}) {
  const Icon = plan.icon;
  const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border p-6 flex flex-col gap-5",
        "transition-all duration-300 hover:-translate-y-1",
        plan.highlighted
          ? "bg-gradient-to-b from-brand-500/10 to-transparent border-brand-500/50 shadow-brand"
          : "bg-card hover:border-border/80"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-xs font-semibold bg-brand-500 text-white px-3 py-1 rounded-full shadow-brand">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              plan.highlighted ? "bg-brand-500/20 text-brand-400" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground">{plan.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{plan.description}</p>
        </div>
      </div>

      {/* Price */}
      <div>
        {plan.monthlyPrice === 0 ? (
          <div className="text-3xl font-bold text-foreground">Custom</div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold gradient-text">
              R$ {(price / 100).toFixed(0)}
            </span>
            <span className="text-muted-foreground text-sm mb-1">/mês</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {plan.credits.toLocaleString("pt-BR")} créditos / mês
        </div>
      </div>

      {/* CTA */}
      <Button
        variant={plan.btnVariant}
        className={cn("w-full", plan.highlighted && "shadow-brand")}
        asChild
      >
        <Link href={plan.monthlyPrice === 0 ? "/contact" : "/register"}>
          {plan.monthlyPrice === 0 ? "Falar com vendas" : "Começar agora"}
        </Link>
      </Button>

      {/* Features */}
      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <Check
              className={cn(
                "w-4 h-4 shrink-0",
                plan.highlighted ? "text-brand-400" : "text-muted-foreground"
              )}
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
