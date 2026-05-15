"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHOWCASE_CATEGORIES = ["Troca de Roupa", "Avatares", "E-commerce", "Campanhas", "Virtual Try-On"];

const SHOWCASE_ITEMS = [
  {
    category: "Troca de Roupa",
    title: "Vestido Florido em Modelo Feminino",
    before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop",
    time: "7s",
  },
  {
    category: "Avatares",
    title: "Modelo Masculino Estilo Urbano",
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    time: "12s",
  },
  {
    category: "E-commerce",
    title: "Tênis com Fundo Branco Studio",
    before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&sat=-50",
    time: "5s",
  },
  {
    category: "Campanhas",
    title: "Banner Instagram para Loja de Moda",
    before: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop",
    time: "10s",
  },
  {
    category: "Virtual Try-On",
    title: "Jaqueta de Couro em Avatar",
    before: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1520975916090-f36b4244f0ad?w=400&h=600&fit=crop",
    time: "9s",
  },
];

export function ShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState("Troca de Roupa");
  const [showAfter, setShowAfter] = useState<Record<number, boolean>>({});
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const filtered = SHOWCASE_ITEMS.filter((item) =>
    activeCategory === "Todos" ? true : item.category === activeCategory
  );

  return (
    <section id="showcase" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400">
            <Sparkles className="w-4 h-4" />
            Resultados reais da plataforma
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text-white">Veja o que a IA</span>
            <br />
            <span className="gradient-text">é capaz de criar</span>
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {SHOWCASE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-brand-500 text-white shadow-brand"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Showcase grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-brand-500/30 transition-all duration-300 hover:shadow-glass-lg"
              onMouseEnter={() => setShowAfter((p) => ({ ...p, [i]: true }))}
              onMouseLeave={() => setShowAfter((p) => ({ ...p, [i]: false }))}
            >
              <div className="relative aspect-[4/5] bg-card">
                <img
                  src={showAfter[i] ? item.after : item.before}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Before/After badges */}
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300",
                    showAfter[i]
                      ? "bg-brand-500 text-white shadow-brand"
                      : "glass text-muted-foreground"
                  )}>
                    {showAfter[i] ? "Depois ✨" : "Antes"}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold glass px-2.5 py-1 rounded-full text-brand-400">
                    ⚡ {item.time}
                  </span>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-xs text-brand-400 font-medium mb-1">{item.category}</div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Passe o mouse sobre as imagens para ver o resultado da IA
        </p>
      </div>
    </section>
  );
}
