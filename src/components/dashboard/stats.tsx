"use client";

import { motion } from "framer-motion";
import { Camera, FolderOpen, Zap, TrendingUp } from "lucide-react";

const STATS = [
  {
    label: "Imagens geradas",
    value: "0",
    icon: Camera,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    change: null,
  },
  {
    label: "Projetos ativos",
    value: "0",
    icon: FolderOpen,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    change: null,
  },
  {
    label: "Créditos usados",
    value: "0",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    change: null,
  },
  {
    label: "Esta semana",
    value: "0",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    change: null,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-border bg-card p-5 hover:border-border/80 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
