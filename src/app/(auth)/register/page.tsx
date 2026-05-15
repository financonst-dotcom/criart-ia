"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PASSWORD_RULES = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const failedRules = PASSWORD_RULES.filter((r) => !r.test(form.password));
    if (failedRules.length > 0) {
      toast.error("Senha não atende os requisitos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao criar conta");

      toast.success("Conta criada! 10 créditos grátis adicionados 🎉");
      router.push("/onboarding");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Criar conta</h1>
        <p className="text-muted-foreground">
          Comece grátis com{" "}
          <span className="text-brand-400 font-medium">10 créditos</span> para testar.
        </p>
      </div>

      {/* Google */}
      <Button
        variant="outline"
        className="w-full gap-3 h-12"
        onClick={() => (window.location.href = "/api/auth/google")}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Cadastrar com Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome completo</label>
          <Input
            type="text"
            placeholder="Seu nome"
            icon={<User className="w-4 h-4" />}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="seu@email.com"
            icon={<Mail className="w-4 h-4" />}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Senha</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="h-12"
            required
          />

          {form.password.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {PASSWORD_RULES.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    rule.test(form.password) ? "bg-emerald-500/20" : "bg-muted"
                  }`}>
                    <Check className={`w-2.5 h-2.5 transition-colors ${
                      rule.test(form.password) ? "text-emerald-400" : "text-muted-foreground"
                    }`} />
                  </div>
                  <span className={`text-xs transition-colors ${
                    rule.test(form.password) ? "text-emerald-400" : "text-muted-foreground"
                  }`}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full h-12 text-base group" loading={loading}>
          {!loading && <Sparkles className="w-4 h-4" />}
          Criar conta grátis
          {!loading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Ao criar uma conta você concorda com nossos{" "}
        <Link href="/terms" className="text-brand-400 hover:underline">Termos de Uso</Link>{" "}
        e{" "}
        <Link href="/privacy" className="text-brand-400 hover:underline">Política de Privacidade</Link>.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Entrar
        </Link>
      </p>
    </motion.div>
  );
}
