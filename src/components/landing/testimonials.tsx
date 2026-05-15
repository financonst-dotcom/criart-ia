"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Mariana Costa",
    role: "Gestora de Tráfego",
    company: "Performance Digital",
    avatar: "MC",
    rating: 5,
    text: "Reduzi meu custo de produção de criativos em 80%. O que antes levava 3 dias com fotógrafo e modelo agora faço em 20 minutos. Os resultados superaram minhas expectativas.",
  },
  {
    name: "Rafael Oliveira",
    role: "Dono de E-commerce",
    company: "ModaStore",
    avatar: "RO",
    rating: 5,
    text: "A troca de roupa IA é incrível. Consigo mostrar minha coleção toda em modelos sem precisar fazer shoot. Minhas vendas no Mercado Livre aumentaram 40%.",
  },
  {
    name: "Ana Paula Lima",
    role: "Social Media Manager",
    company: "Agência Pixel",
    avatar: "AL",
    rating: 5,
    text: "A geração de campanhas automáticas salvou minha agência. Consigo entregar packs completos para 10 clientes em 1 dia. O avatar creator é simplesmente fantástico.",
  },
  {
    name: "Carlos Mendes",
    role: "CEO",
    company: "Fashion House",
    avatar: "CM",
    rating: 5,
    text: "Usamos para criar todo nosso catálogo de 200 produtos com modelos IA. Economizamos R$50.000 em produção fotográfica. Vale cada centavo da assinatura.",
  },
  {
    name: "Julia Santos",
    role: "Infoprodutora",
    company: "Moda com Propósito",
    avatar: "JS",
    rating: 5,
    text: "O Virtual Try-On mudou meu negócio completamente. Minha taxa de conversão aumentou 65% porque os clientes conseguem visualizar o produto em si mesmos.",
  },
  {
    name: "Pedro Alves",
    role: "Diretor de Marketing",
    company: "Grupo Varejo",
    avatar: "PA",
    rating: 5,
    text: "Integramos a API no nosso sistema e agora geramos criativos automaticamente para 500 produtos por dia. A qualidade é profissional e consistente.",
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/3 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text-white">Marcas que cresceram</span>
            <br />
            <span className="gradient-text">com FashionAI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Mais de 8.000 marcas e agências confiam na nossa plataforma
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-brand-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-brand-500/30" />

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t.role} · {t.company}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
