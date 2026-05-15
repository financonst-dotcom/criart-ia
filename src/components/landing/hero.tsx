"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Shirt,
  User,
  Camera,
  Wand2,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop",
];

const STATS = [
  { label: "Imagens geradas", value: "2M+", icon: Camera },
  { label: "Marcas ativas", value: "8K+", icon: TrendingUp },
  { label: "Mais rápido", value: "10x", icon: Zap },
  { label: "Avaliação", value: "4.9★", icon: Star },
];

const FEATURES_PILLS = [
  { icon: Shirt, label: "Troca de Roupa" },
  { icon: User, label: "Avatar Creator" },
  { icon: Wand2, label: "Virtual Try-On" },
  { icon: Camera, label: "Fotos Pro" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark noise-bg" />
      <div className="absolute inset-0 bg-mesh-gradient" />

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] animate-pulse_slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-[100px] animate-pulse_slow delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="premium" className="w-fit text-sm px-4 py-1.5 gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                IA Especializada em Moda & E-commerce
                <span className="text-brand-500/60">•</span>
                Novo
              </Badge>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="gradient-text-white">Vista seus</span>
                <br />
                <span className="gradient-text">produtos</span>
                <br />
                <span className="gradient-text-white">com IA.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Troque roupas em modelos, crie avatares hiper-realistas, gere fotos
                profissionais para e-commerce e automatize campanhas para Instagram,
                Shopee e Mercado Livre — em segundos.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {FEATURES_PILLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-400" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="xl" className="group">
                <Link href="/register">
                  <Sparkles className="w-5 h-5" />
                  Começar grátis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="glass"
                size="xl"
                className="group border-border/50"
                asChild
              >
                <Link href="#showcase">
                  <Play className="w-4 h-4" />
                  Ver demonstração
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xl font-bold gradient-text">{value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <HeroGallery />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function HeroGallery() {
  return (
    <div className="relative w-full max-w-lg h-[600px]">
      {/* Main large image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute left-8 top-4 w-56 h-80 rounded-2xl overflow-hidden border border-white/10 shadow-glass-lg glow-brand"
        style={{ animationDelay: "0s" }}
      >
        <img
          src={HERO_IMAGES[0]}
          alt="Modelo com roupa IA"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="glass rounded-xl p-2 flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="text-xs text-foreground font-medium truncate">
              Troca de roupa aplicada
            </span>
          </div>
        </div>
      </motion.div>

      {/* Second image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute right-4 top-16 w-48 h-64 rounded-2xl overflow-hidden border border-white/10 shadow-glass-lg animate-float"
      >
        <img
          src={HERO_IMAGES[1]}
          alt="Avatar criado por IA"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="success" className="text-xs">IA</Badge>
        </div>
      </motion.div>

      {/* Third image — bottom left */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute left-0 bottom-8 w-44 h-56 rounded-2xl overflow-hidden border border-white/10 shadow-glass"
        style={{ animationDelay: "1.5s" }}
      >
        <img
          src={HERO_IMAGES[2]}
          alt="Foto e-commerce IA"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Fourth image — bottom right */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute right-0 bottom-0 w-52 h-60 rounded-2xl overflow-hidden border border-white/10 shadow-glass animate-float"
        style={{ animationDelay: "0.8s" }}
      >
        <img
          src={HERO_IMAGES[3]}
          alt="Campanha automática IA"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="glass rounded-xl p-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-xs text-foreground font-medium">
              Gerado em 8s
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute top-0 right-28 glass-gold rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-brand animate-float"
      >
        <Sparkles className="w-4 h-4 text-brand-400" />
        <div>
          <div className="text-xs font-semibold text-brand-300">Virtual Try-On</div>
          <div className="text-xs text-muted-foreground">Ultra realista</div>
        </div>
      </motion.div>

      {/* Generation indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-1/3 glass rounded-full px-4 py-2 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-muted-foreground font-medium">
          Gerando imagem...
        </span>
      </motion.div>
    </div>
  );
}
