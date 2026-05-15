"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  FolderOpen,
  History,
  Shirt,
  User2,
  ImageIcon,
  Megaphone,
  Scissors,
  ZoomIn,
  Play,
  Package,
  Share2,
  Wand2,
  LayoutTemplate,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Projetos", href: "/dashboard/projects", icon: FolderOpen },
      { label: "Histórico", href: "/dashboard/history", icon: History },
    ],
  },
  {
    title: "Ferramentas IA",
    items: [
      { label: "Troca de Roupa", href: "/dashboard/outfit-swap", icon: Shirt, badge: "Popular" },
      { label: "Avatar Creator", href: "/dashboard/avatar", icon: User2 },
      { label: "Virtual Try-On", href: "/dashboard/tryon", icon: Wand2, badge: "Novo" },
      { label: "Fotos E-commerce", href: "/dashboard/ecommerce", icon: ImageIcon },
      { label: "Campanhas IA", href: "/dashboard/campaigns", icon: Megaphone },
      { label: "Troca de Fundo", href: "/dashboard/background", icon: Sparkles },
      { label: "Remover Fundo", href: "/dashboard/remove-bg", icon: Scissors },
      { label: "Upscaling", href: "/dashboard/upscale", icon: ZoomIn },
      { label: "Gerador de Vídeo", href: "/dashboard/video", icon: Play, badge: "Beta" },
      { label: "Mockups", href: "/dashboard/mockups", icon: Package },
      { label: "Pack Social", href: "/dashboard/social-pack", icon: Share2 },
    ],
  },
  {
    title: "Conta",
    items: [
      { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
      { label: "Assinatura", href: "/dashboard/subscription", icon: CreditCard },
      { label: "API", href: "/dashboard/api", icon: Key },
      { label: "Configurações", href: "/dashboard/settings", icon: Settings },
      { label: "Suporte", href: "/dashboard/support", icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col border-r border-border bg-card shrink-0 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base font-bold"
          >
            <span className="text-foreground">fashion</span>
            <span className="gradient-text">ai</span>
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", active && "text-brand-400")} />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 }}
                          className="flex-1 truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-medium shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Credits widget */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-2 mb-2 p-3 rounded-xl glass-gold"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-foreground">Créditos</span>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-2xl font-bold gradient-text">10</span>
            <span className="text-xs text-muted-foreground">/ 10</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-gradient-brand rounded-full h-1.5 w-full" />
          </div>
          <Link
            href="/dashboard/subscription"
            className="mt-2 flex items-center justify-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Comprar créditos
          </Link>
        </motion.div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-brand-500/30 transition-all z-10 shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
