"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  User2,
  Wand2,
  ImageIcon,
  Megaphone,
  Scissors,
  ZoomIn,
  Play,
  Sparkles,
} from "lucide-react";

const ACTIONS = [
  {
    label: "Trocar Roupa",
    desc: "Vista modelos",
    href: "/dashboard/outfit-swap",
    icon: Shirt,
    color: "from-brand-500/20 to-brand-600/5 hover:border-brand-500/40",
    iconBg: "bg-brand-500/20 text-brand-400",
    badge: "2 créditos",
  },
  {
    label: "Criar Avatar",
    desc: "Modelo por IA",
    href: "/dashboard/avatar",
    icon: User2,
    color: "from-purple-500/20 to-purple-600/5 hover:border-purple-500/40",
    iconBg: "bg-purple-500/20 text-purple-400",
    badge: "3 créditos",
  },
  {
    label: "Virtual Try-On",
    desc: "Provador virtual",
    href: "/dashboard/tryon",
    icon: Wand2,
    color: "from-pink-500/20 to-pink-600/5 hover:border-pink-500/40",
    iconBg: "bg-pink-500/20 text-pink-400",
    badge: "3 créditos",
  },
  {
    label: "Foto E-commerce",
    desc: "Produto profissional",
    href: "/dashboard/ecommerce",
    icon: ImageIcon,
    color: "from-emerald-500/20 to-emerald-600/5 hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    badge: "2 créditos",
  },
  {
    label: "Campanha IA",
    desc: "Stories & Banners",
    href: "/dashboard/campaigns",
    icon: Megaphone,
    color: "from-blue-500/20 to-blue-600/5 hover:border-blue-500/40",
    iconBg: "bg-blue-500/20 text-blue-400",
    badge: "4 créditos",
  },
  {
    label: "Remover Fundo",
    desc: "Remoção automática",
    href: "/dashboard/remove-bg",
    icon: Scissors,
    color: "from-red-500/20 to-red-600/5 hover:border-red-500/40",
    iconBg: "bg-red-500/20 text-red-400",
    badge: "1 crédito",
  },
  {
    label: "Upscaling",
    desc: "Melhorar qualidade",
    href: "/dashboard/upscale",
    icon: ZoomIn,
    color: "from-indigo-500/20 to-indigo-600/5 hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/20 text-indigo-400",
    badge: "1 crédito",
  },
  {
    label: "Gerar Vídeo",
    desc: "Reels e TikTok",
    href: "/dashboard/video",
    icon: Play,
    color: "from-teal-500/20 to-teal-600/5 hover:border-teal-500/40",
    iconBg: "bg-teal-500/20 text-teal-400",
    badge: "5 créditos",
  },
];

export function QuickActions() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-400" />
        <h2 className="text-lg font-semibold text-foreground">Ações rápidas</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-gradient-to-br transition-all duration-200 hover:-translate-y-1 hover:shadow-glass group ${action.color}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconBg} transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-foreground leading-tight">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{action.badge}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
