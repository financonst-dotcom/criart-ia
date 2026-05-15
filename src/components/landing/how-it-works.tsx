"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Upload, Sliders, Sparkles, Download } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Envie suas fotos",
    description:
      "Faça upload da foto da roupa, do produto ou do modelo. Suportamos JPG, PNG, WEBP e HEIC.",
    color: "from-brand-500/30 to-brand-600/10",
  },
  {
    number: "02",
    icon: Sliders,
    title: "Configure a geração",
    description:
      "Escolha o tipo de criativo, formato, estilo visual e plataforma de destino.",
    color: "from-purple-500/30 to-purple-600/10",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "IA gera em segundos",
    description:
      "Nossa IA especializada em moda processa e entrega imagens fotorrealistas em segundos.",
    color: "from-pink-500/30 to-pink-600/10",
  },
  {
    number: "04",
    icon: Download,
    title: "Exporte e publique",
    description:
      "Baixe em alta resolução ou exporte diretamente para suas redes sociais e marketplaces.",
    color: "from-emerald-500/30 to-emerald-600/10",
  },
];

export function HowItWorksSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="how-it-works" className="py-24 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/3 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400">
            <Sparkles className="w-4 h-4" />
            Simples como o Canva
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text-white">Crie em</span>
            <span className="gradient-text"> 4 passos simples</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center border border-white/10 shadow-glass`}>
                <step.icon className="w-7 h-7 text-foreground/80" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white shadow-brand">
                  {i + 1}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
