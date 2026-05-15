"use client";

import { useState } from "react";
import { ImageIcon, Sparkles, Zap, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BG_STYLES = [
  { id: "white", label: "Fundo Branco", desc: "Studio clean" },
  { id: "lifestyle", label: "Lifestyle", desc: "Ambiente real" },
  { id: "premium", label: "Premium", desc: "Fundo escuro" },
  { id: "gradient", label: "Degradê", desc: "Colorido suave" },
  { id: "marketplace", label: "Marketplace", desc: "Shopee/ML" },
  { id: "outdoor", label: "Ao Ar Livre", desc: "Natureza" },
];

const PLATFORMS = [
  { id: "square", label: "Quadrado", ratio: "1:1" },
  { id: "portrait", label: "Retrato", ratio: "4:5" },
  { id: "landscape", label: "Paisagem", ratio: "16:9" },
];

export default function EcommercePhotosPage() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [bgStyle, setBgStyle] = useState("white");
  const [format, setFormat] = useState("square");
  const [description, setDescription] = useState("");
  const [numImages, setNumImages] = useState(2);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<string[]>([]);
  const [favorited, setFavorited] = useState<Set<number>>(new Set());

  async function handleGenerate() {
    if (!productImage) return toast.error("Adicione a foto do produto");
    setStatus("generating");
    setResults([]);
    try {
      const res = await fetch("/api/generate/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productImage, bgStyle, format, description, numImages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.images || []);
      setStatus("done");
      toast.success(`${data.images?.length || 0} fotos geradas! ✨`);
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Fotos para E-commerce</h1>
          <p className="text-sm text-muted-foreground">Fotos profissionais do produto com fundo gerado por IA</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />2 créditos / imagem</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Foto do Produto</span>
            <ImageUploader value={productImage} onChange={setProductImage} label="Upload do produto" hint="Produto com ou sem fundo" aspectRatio="square" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Estilo do Fundo</span>
            <div className="grid grid-cols-2 gap-2">
              {BG_STYLES.map((s) => (
                <button key={s.id} onClick={() => setBgStyle(s.id)}
                  className={cn("flex flex-col p-3 rounded-xl border text-left transition-all",
                    bgStyle === s.id ? "bg-emerald-500/15 border-emerald-500/40 text-foreground" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  <span className={cn("font-medium text-xs", bgStyle === s.id && "text-emerald-400")}>{s.label}</span>
                  <span className="text-xs opacity-60 mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Formato</span>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => setFormat(p.id)}
                  className={cn("py-2.5 rounded-xl text-xs font-medium border transition-all text-center",
                    format === p.id ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  <div className="font-semibold">{p.label}</div>
                  <div className="opacity-60">{p.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Descrição do Produto</span>
            <Textarea placeholder="Ex: tênis branco Nike Air Max, minimalista..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-20 text-sm" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Quantidade</span>
              <span className="text-xs text-muted-foreground">{numImages * 2} créditos</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setNumImages(n)}
                  className={cn("py-2 rounded-xl text-sm font-bold border transition-all",
                    numImages === n ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full h-14 gap-3 bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleGenerate} loading={status === "generating"} disabled={!productImage}>
            <Sparkles className="w-5 h-5" />
            {status === "generating" ? "Gerando..." : "Gerar Fotos"}
            <span className="text-sm opacity-75 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{numImages * 2} cr</span>
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-emerald-400 animate-pulse_slow" />
              </div>
              <div>
                <h3 className="font-semibold">Fotos profissionais em segundos</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">Envie o produto e a IA cria o ambiente perfeito para e-commerce.</p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center"><Sparkles className="w-6 h-6 text-emerald-400" /></div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Gerando fotos profissionais...</h3>
                <p className="text-sm text-muted-foreground mt-1">IA criando o ambiente perfeito para o produto</p>
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{results.length} fotos geradas ✨</h3>
              <div className={cn("grid gap-4", results.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
                {results.map((url, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative group rounded-2xl overflow-hidden border border-border">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => { const n = new Set(favorited); n.has(i) ? n.delete(i) : n.add(i); setFavorited(n); }}
                        className={cn("w-9 h-9 rounded-xl bg-background/70 flex items-center justify-center transition-colors", favorited.has(i) ? "text-red-400" : "text-muted-foreground")}>
                        <Heart className={cn("w-4 h-4", favorited.has(i) && "fill-current")} />
                      </button>
                      <button onClick={() => { const a = document.createElement("a"); a.href = url; a.download = `ecommerce-${i+1}.jpg`; a.click(); }}
                        className="w-9 h-9 rounded-xl bg-brand-500/80 flex items-center justify-center text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
