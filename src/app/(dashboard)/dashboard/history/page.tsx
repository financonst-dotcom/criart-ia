"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter, Download, Heart, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  OUTFIT_SWAP: "Troca de Roupa",
  AVATAR_CREATION: "Avatar",
  VIRTUAL_TRYON: "Virtual Try-On",
  PRODUCT_PHOTO: "Foto Produto",
  CAMPAIGN: "Campanha",
  REMOVE_BG: "Remover Fundo",
  UPSCALE: "Upscaling",
  VIDEO: "Vídeo",
};

const FILTER_OPTIONS = ["Todos", "Troca de Roupa", "Avatar", "Virtual Try-On", "Foto Produto", "Campanha"];

const MOCK_HISTORY = [
  {
    id: "1",
    type: "OUTFIT_SWAP",
    status: "COMPLETED",
    outputImages: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
    ],
    creditsUsed: 2,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    processingTime: 8200,
  },
  {
    id: "2",
    type: "AVATAR_CREATION",
    status: "COMPLETED",
    outputImages: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop",
    ],
    creditsUsed: 3,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    processingTime: 12500,
  },
  {
    id: "3",
    type: "REMOVE_BG",
    status: "COMPLETED",
    outputImages: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    ],
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    processingTime: 3100,
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favorited, setFavorited] = useState<Set<string>>(new Set());

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <History className="w-6 h-6 text-brand-400" />
          Histórico de Gerações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Todas as suas imagens geradas em um lugar
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar no histórico..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                activeFilter === f
                  ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History grid */}
      {MOCK_HISTORY.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="font-semibold text-foreground">Nenhuma geração ainda</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Crie sua primeira imagem com IA
          </p>
          <Button asChild>
            <a href="/dashboard/outfit-swap">Começar agora</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_HISTORY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-4 hover:border-border/80 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Images */}
                <div className="flex gap-2 shrink-0">
                  {item.outputImages.slice(0, 3).map((url, j) => (
                    <div key={j} className="w-16 h-20 rounded-xl overflow-hidden border border-border bg-muted">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {item.outputImages.length > 3 && (
                    <div className="w-16 h-20 rounded-xl border border-border bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      +{item.outputImages.length - 3}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="default" className="text-xs">
                      {TYPE_LABELS[item.type] || item.type}
                    </Badge>
                    <Badge variant="success" className="text-xs">
                      Concluído
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatRelativeDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>{item.outputImages.length} imagens</span>
                    <span>{item.creditsUsed} créditos</span>
                    {item.processingTime && (
                      <span>⚡ {(item.processingTime / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      const n = new Set(favorited);
                      n.has(item.id) ? n.delete(item.id) : n.add(item.id);
                      setFavorited(n);
                    }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      favorited.has(item.id) ? "text-red-400" : "text-muted-foreground hover:text-red-400"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", favorited.has(item.id) && "fill-current")} />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-brand-400 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
