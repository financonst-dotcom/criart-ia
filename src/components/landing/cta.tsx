"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-orange-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full text-sm text-brand-400">
            <Zap className="w-4 h-4 animate-pulse" />
            10 créditos grátis para começar hoje
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="gradient-text-white">Transforme sua</span>
            <br />
            <span className="gradient-text">moda com IA agora</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Junte-se a 8.000+ marcas que já usam IA para criar criativos
            profissionais em segundos. Sem cartão de crédito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="group glow-brand">
              <Link href="/register">
                <Sparkles className="w-5 h-5" />
                Criar conta grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link href="#pricing">Ver planos</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Sem cartão de crédito · Cancele quando quiser · Suporte em português
          </p>
        </motion.div>
      </div>
    </section>
  );
}
