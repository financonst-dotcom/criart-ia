"use client";

import Link from "next/link";
import { History, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentGenerations() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-foreground">Gerações recentes</h3>
        </div>
        <Link href="/dashboard/history">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Ver tudo <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-brand-400" />
        </div>
        <h4 className="font-medium text-foreground mb-1">Nenhuma geração ainda</h4>
        <p className="text-sm text-muted-foreground max-w-xs mb-4">
          Crie sua primeira imagem com IA. É rápido, fácil e grátis para começar.
        </p>
        <Button asChild size="sm">
          <Link href="/dashboard/outfit-swap">
            <Sparkles className="w-4 h-4" />
            Criar primeira imagem
          </Link>
        </Button>
      </div>
    </div>
  );
}
