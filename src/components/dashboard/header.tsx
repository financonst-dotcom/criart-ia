"use client";

import Link from "next/link";
import { Bell, Search, Settings, Sparkles, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center gap-4 px-6 shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Buscar projetos, gerações..."
          icon={<Search className="w-4 h-4" />}
          className="h-9 bg-background/50"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Credits */}
        <Link href="/dashboard/subscription">
          <div className="flex items-center gap-1.5 glass-gold px-3 py-1.5 rounded-xl cursor-pointer hover:border-brand-500/40 transition-all">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm font-semibold gradient-text">10</span>
            <span className="text-xs text-muted-foreground hidden sm:block">créditos</span>
          </div>
        </Link>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4" />
          </Link>
        </Button>

        {/* User menu */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-foreground leading-none">Usuário</div>
            <div className="text-xs text-muted-foreground mt-0.5">Plano Free</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
