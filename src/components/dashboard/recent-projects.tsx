"use client";

import Link from "next/link";
import { FolderOpen, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentProjects() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-foreground">Projetos recentes</h3>
        </div>
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Ver tudo <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
          <FolderOpen className="w-7 h-7 text-purple-400" />
        </div>
        <h4 className="font-medium text-foreground mb-1">Nenhum projeto ainda</h4>
        <p className="text-sm text-muted-foreground max-w-xs mb-4">
          Organize suas gerações em projetos para cada coleção ou campanha.
        </p>
        <Button variant="outline" asChild size="sm">
          <Link href="/dashboard/projects?new=true">
            <Plus className="w-4 h-4" />
            Novo projeto
          </Link>
        </Button>
      </div>
    </div>
  );
}
