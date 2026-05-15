"use client";

import { useState } from "react";
import { LayoutTemplate, Search, Sparkles, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = ["Todos", "Moda", "E-commerce", "Joias", "Tênis", "Cosméticos", "Restaurante", "Eletrônicos", "Fitness"];

const MOCK_TEMPLATES = [
  { id: "1", name: "Vestido Studio Branco", category: "Moda", thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop", type: "OUTFIT_SWAP", isPremium: false, usageCount: 1240 },
  { id: "2", name: "Produto Fundo Premium", category: "E-commerce", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", type: "PRODUCT_PHOTO", isPremium: false, usageCount: 890 },
  { id: "3", name: "Campanha Instagram Fashion", category: "Moda", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop", type: "CAMPAIGN", isPremium: true, usageCount: 2100 },
  { id: "4", name: "Avatar Modelo Feminino", category: "Moda", thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop", type: "AVATAR_CREATION", isPremium: false, usageCount: 3400 },
  { id: "5", name: "Joias Fundo Preto", category: "Joias", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop", type: "PRODUCT_PHOTO", isPremium: true, usageCount: 560 },
  { id: "6", name: "Tênis Lifestyle", category: "Tênis", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", type: "PRODUCT_PHOTO", isPremium: false, usageCount: 780 },
  { id: "7", name: "Stories Promoção", category: "E-commerce", thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=700&fit=crop", type: "CAMPAIGN", isPremium: false, usageCount: 4200 },
  { id: "8", name: "Virtual Try-On Verão", category: "Moda", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop", type: "VIRTUAL_TRYON", isPremium: true, usageCount: 1100 },
];

const TYPE_ROUTES: Record<string, string> = {
  OUTFIT_SWAP: "/dashboard/outfit-swap",
  PRODUCT_PHOTO: "/dashboard/ecommerce",
  CAMPAIGN: "/dashboard/campaigns",
  AVATAR_CREATION: "/dashboard/avatar",
  VIRTUAL_TRYON: "/dashboard/tryon",
};

export default function TemplatesPage() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = MOCK_TEMPLATES.filter((t) => {
    const matchCat = category === "Todos" || t.category === category;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <LayoutTemplate className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Templates</h1>
          <p className="text-sm text-muted-foreground">Comece mais rápido com templates prontos</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Input placeholder="Buscar templates..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                category === c ? "bg-brand-500/15 border-brand-500/40 text-brand-400" : "border-border text-muted-foreground hover:bg-accent"
              )}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((template, i) => (
          <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-brand-500/30 hover:-translate-y-1 transition-all cursor-pointer">
            <div className="relative aspect-[4/5] bg-muted overflow-hidden">
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {template.isPremium && (
                <div className="absolute top-2 left-2">
                  <Badge variant="premium" className="text-xs">Pro</Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <Button size="sm" className="w-full gap-1 text-xs" asChild>
                  <Link href={TYPE_ROUTES[template.type] || "/dashboard"}>
                    <Sparkles className="w-3 h-3" /> Usar template
                  </Link>
                </Button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-foreground truncate">{template.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{template.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />{template.usageCount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
