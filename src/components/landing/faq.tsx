"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "O que é um crédito?",
    a: "1 crédito equivale a 1 geração básica (remoção de fundo, upscaling). Operações mais complexas como troca de roupa ou Virtual Try-On consomem 2-3 créditos. Cada plano inclui uma quantidade mensal de créditos.",
  },
  {
    q: "A IA preserva os detalhes da roupa?",
    a: "Sim! Nossa IA é especializada em moda e foi treinada para preservar texturas, logos, estampas, botões e detalhes do tecido. O resultado mantém 100% da fidelidade visual da roupa original.",
  },
  {
    q: "Posso usar para múltiplos e-commerces?",
    a: "Sim, no plano Business você gerencia múltiplas marcas e lojas. No plano Enterprise, você tem acesso ilimitado com white label para revender para seus clientes.",
  },
  {
    q: "Qual é a qualidade das imagens geradas?",
    a: "As imagens são geradas em alta resolução (até 2048x2048px no plano Pro, 4K no Business). Você pode usar o Upscaling para aumentar ainda mais a qualidade.",
  },
  {
    q: "Existe API disponível?",
    a: "Sim! A partir do plano Pro você tem acesso à nossa API REST para integrar a geração de imagens diretamente em seus sistemas, lojas e aplicativos.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, você pode cancelar a assinatura a qualquer momento sem multas. Você mantém acesso até o fim do período pago.",
  },
  {
    q: "Como funciona o Virtual Try-On?",
    a: "Você envia a foto da roupa e uma foto do modelo (ou cria um avatar IA). Nossa IA veste a roupa no modelo de forma fotorrealista, adaptando o caimento, a iluminação e as sombras.",
  },
  {
    q: "Os dados e imagens são seguros?",
    a: "Suas imagens são armazenadas com criptografia em servidores seguros (Cloudflare R2). Você tem controle total sobre seus dados e pode deletá-los quando quiser.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400">
            <Sparkles className="w-4 h-4" />
            Dúvidas frequentes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Perguntas</span>
            <span className="gradient-text-white"> frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={cn(
                "rounded-2xl border border-border overflow-hidden transition-all duration-200",
                open === i ? "border-brand-500/30" : "hover:border-border/80"
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-accent/30 transition-colors"
              >
                <span className="font-medium text-foreground text-sm">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                    open === i && "rotate-180 text-brand-400"
                  )}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 pb-4"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
