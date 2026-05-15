"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, Check, Building2, TrendingUp, ShoppingCart,
  BookOpen, Share2, MapPin, Shirt, User2, ImageIcon, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PROFILES = [
  { id: "agency", label: "Agência", icon: Building2, desc: "Gerencio clientes e campanhas" },
  { id: "traffic", label: "Gestor de Tráfego", icon: TrendingUp, desc: "Crio criativos para anúncios" },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, desc: "Vendo produtos online" },
  { id: "infoprodutor", label: "Infoprodutor", icon: BookOpen, desc: "Crio conteúdo digital" },
  { id: "social_media", label: "Social Media", icon: Share2, desc: "Gerencio redes sociais" },
  { id: "local", label: "Negócio Local", icon: MapPin, desc: "Tenho um negócio físico" },
];

const FEATURES = [
  { id: "outfit_swap", label: "Troca de Roupa", icon: Shirt },
  { id: "avatar", label: "Criação de Avatares", icon: User2 },
  { id: "ecommerce_photos", label: "Fotos E-commerce", icon: ImageIcon },
  { id: "campaigns", label: "Campanhas Automáticas", icon: Megaphone },
];

const STEPS = [
  { title: "Qual é o seu perfil?", desc: "Personalizamos a experiência para você" },
  { title: "O que você quer criar?", desc: "Selecione seus principais casos de uso" },
  { title: "Tudo pronto! 🎉", desc: "Sua conta está configurada e pronta para usar" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, features }),
      });
    } catch {}
    toast.success("Bem-vindo ao FashionAI Studio! 🎉");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-foreground">fashion</span>
              <span className="gradient-text">ai</span>
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={i} className={cn(
                "flex items-center gap-2 transition-all",
                i > 0 && "ml-2"
              )}>
                {i > 0 && <div className={cn("w-8 h-px", i <= step ? "bg-brand-500" : "bg-border")} />}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i < step ? "bg-brand-500 text-white" :
                  i === step ? "bg-brand-500/20 text-brand-400 border border-brand-500/40" :
                  "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-foreground">{STEPS[step].title}</h1>
          <p className="text-muted-foreground mt-2">{STEPS[step].desc}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFILES.map((p) => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setProfile(p.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 text-center",
                      profile === p.id
                        ? "bg-brand-500/15 border-brand-500/40 shadow-brand"
                        : "border-border bg-card hover:border-brand-500/30 hover:bg-accent"
                    )}>
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center",
                      profile === p.id ? "bg-brand-500/20 text-brand-400" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{p.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                    </div>
                    {profile === p.id && (
                      <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                const selected = features.includes(f.id);
                return (
                  <button key={f.id} onClick={() => setFeatures((prev) => selected ? prev.filter((x) => x !== f.id) : [...prev, f.id])}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                      selected ? "bg-brand-500/15 border-brand-500/40 shadow-brand" : "border-border bg-card hover:border-brand-500/30"
                    )}>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      selected ? "bg-brand-500/20 text-brand-400" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{f.label}</span>
                    {selected && <Check className="w-4 h-4 text-brand-400 ml-auto" />}
                  </button>
                );
              })}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-brand-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-brand-400 animate-pulse_slow" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Conta configurada!</h2>
                <p className="text-muted-foreground mt-2">
                  Você recebeu <span className="text-brand-400 font-bold">10 créditos grátis</span> para começar.
                </p>
              </div>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground pt-2">
                <span>✅ Troca de roupa IA</span>
                <span>✅ Avatar creator</span>
                <span>✅ Virtual Try-On</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
            Voltar
          </Button>
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !profile}
              className="gap-2">
              Continuar <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={loading} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Ir para o Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
