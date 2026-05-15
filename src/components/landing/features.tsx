"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Shirt,
  User2,
  ImageIcon,
  Megaphone,
  RefreshCcw,
  ZoomIn,
  Scissors,
  Play,
  Package,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Shirt,
    title: "Troca de Roupa IA",
    description:
      "Vista qualquer roupa em modelos com textura real, logo original e caimento perfeito. A IA preserva todos os detalhes do tecido.",
    color: "from-brand-500/20 to-orange-500/10",
    border: "border-brand-500/20 hover:border-brand-500/40",
    iconBg: "bg-brand-500/20 text-brand-400",
    badge: "Mais popular",
  },
  {
    icon: User2,
    title: "Criação de Avatares",
    description:
      "Crie modelos humanos hiper-realistas por IA: escolha sexo, idade, etnia, pose e expressão para cada campanha.",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    iconBg: "bg-purple-500/20 text-purple-400",
  },
  {
    icon: Wand2,
    title: "Virtual Try-On",
    description:
      "Provador virtual para moda e acessórios. O usuário vê como a roupa fica no modelo antes de comprar.",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20 hover:border-pink-500/40",
    iconBg: "bg-pink-500/20 text-pink-400",
  },
  {
    icon: ImageIcon,
    title: "Fotos para E-commerce",
    description:
      "Gere fotos de produto com fundo branco, lifestyle, studio premium ou marketplace para Shopee e Mercado Livre.",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: Megaphone,
    title: "Campanhas Automáticas",
    description:
      "Crie campanhas completas para Instagram, Stories, banners e anúncios com uma única foto do produto.",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    iconBg: "bg-blue-500/20 text-blue-400",
  },
  {
    icon: RefreshCcw,
    title: "Troca de Fundo",
    description:
      "Substitua qualquer fundo por ambientes profissionais, neutros, coloridos ou de lifestyle com IA.",
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    iconBg: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: Scissors,
    title: "Remoção de Fundo",
    description:
      "Remova fundos automaticamente com precisão cirúrgica. Suporte a produtos, pessoas e objetos.",
    color: "from-red-500/20 to-orange-500/10",
    border: "border-red-500/20 hover:border-red-500/40",
    iconBg: "bg-red-500/20 text-red-400",
  },
  {
    icon: ZoomIn,
    title: "Upscaling 4K",
    description:
      "Melhore a qualidade de imagens em até 4x com IA, mantendo nitidez e detalhes originais.",
    color: "from-indigo-500/20 to-purple-500/10",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/20 text-indigo-400",
  },
  {
    icon: Play,
    title: "Geração de Vídeos",
    description:
      "Transforme imagens geradas em vídeos curtos para Reels, TikTok e YouTube Shorts automaticamente.",
    color: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-500/20 hover:border-teal-500/40",
    iconBg: "bg-teal-500/20 text-teal-400",
    badge: "Novo",
  },
  {
    icon: Package,
    title: "Mockups Automáticos",
    description:
      "Crie mockups realistas de camisetas, canecas, embalagens e outros produtos com sua arte.",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/20 hover:border-orange-500/40",
    iconBg: "bg-orange-500/20 text-orange-400",
  },
  {
    icon: Share2,
    title: "Pack para Redes Sociais",
    description:
      "Gere um pack completo de imagens otimizadas para cada rede social com um único clique.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconBg: "bg-violet-500/20 text-violet-400",
  },
  {
    icon: Sparkles,
    title: "Fotos de Catálogo",
    description:
      "Produza catálogos completos de moda com modelos IA, diferentes poses e fundos profissionais.",
    color: "from-brand-500/20 to-amber-500/10",
    border: "border-brand-500/20 hover:border-brand-500/40",
    iconBg: "bg-brand-500/20 text-brand-300",
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="features" className="py-24 relative" ref={ref}>
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400">
            <Sparkles className="w-4 h-4" />
            15+ ferramentas de IA para moda
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text-white">Tudo que sua marca</span>
            <br />
            <span className="gradient-text">precisa em um lugar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Da foto do produto à campanha completa, nossa IA especializada em moda
            entrega resultados profissionais em segundos.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
  inView: boolean;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        "relative group rounded-2xl border p-5 cursor-pointer",
        "bg-gradient-to-br transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-glass-lg",
        feature.color,
        feature.border
      )}
    >
      {feature.badge && (
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
            {feature.badge}
          </span>
        </div>
      )}

      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", feature.iconBg)}>
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">
        {feature.title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}
