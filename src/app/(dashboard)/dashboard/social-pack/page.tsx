"use client";

import { useState } from "react";
import { Share2, Sparkles, Zap, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PLATFORMS = [
  { id: "instagram_feed", label: "Instagram Feed", icon: "📷", size: "1080×1080" },
  { id: "instagram_stories", label: "Stories", icon: "📱", size: "1080×1920" },
  { id: "instagram_reels", label: "Reels", icon: "🎬", size: "1080×1920" },
  { id: "facebook_post", label: "Facebook", icon: "👥", size: "1200×630" },
  { id: "twitter_post", label: "Twitter/X", icon: "🐦", size: "1600×900" },
  { id: "pinterest", label: "Pinterest", icon: "📌", size: "1000×1500" },
  { id: "tiktok_cover", label: "TikTok", icon: "🎵", size: "1080×1920" },
  { id: "whatsapp_status", label: "WhatsApp", icon: "💬", size: "1080×1920" },
];

const STYLES = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "luxury", label: "Luxo" },
  { id: "colorful", label: "Colorido" },
];

type ResultItem = { platform: string; label: string; url: string };

export default function SocialPackPage() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram_feed", "instagram_stories"]);
  const [style, setStyle] = useState("minimal");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<ResultItem[]>([]);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleGenerate() {
    if (!inputImage) return toast.error("Adicione uma imagem");
    if (selectedPlatforms.length === 0) return toast.error("Selecione ao menos uma plataforma");
    setStatus("generating");
    setResults([]);
    try {
      const res = await fetch("/api/generate/social-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputImage, platforms: selectedPlatforms, style, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results || []);
      setStatus("done");
      toast.success(`${data.results?.length || 0} artes criadas! ✨`);
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  const creditCost = selectedPlatforms.length * 2;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Pack de Redes Sociais</h1>
          <p className="text-sm text-muted-foreground">Gere artes otimizadas para cada plataforma</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />2 créditos / arte</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Imagem base</span>
            <ImageUploader value={inputImage} onChange={setInputImage} label="Upload da imagem" hint="Foto do produto ou modelo" aspectRatio="square" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Plataformas</span>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left",
                      selected ? "bg-pink-500/15 border-pink-500/40" : "border-border hover:bg-accent"
                    )}>
                    <span className="text-base">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-xs font-medium truncate", selected ? "text-pink-400" : "text-foreground")}>
                        {p.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.size}</div>
                    </div>
                    {selected && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Estilo visual</span>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={cn("py-2 rounded-xl text-xs font-medium border transition-all",
                    style === s.id ? "bg-pink-500/15 border-pink-500/40 text-pink-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Texto / Chamada (opcional)</span>
            <Input placeholder="Ex: 20% OFF — Só hoje!" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <Button className="w-full h-14 gap-3 bg-pink-600 hover:bg-pink-500 text-white"
            onClick={handleGenerate} loading={status === "generating"}
            disabled={!inputImage || selectedPlatforms.length === 0}>
            <Sparkles className="w-5 h-5" />
            {status === "generating" ? "Gerando artes..." : "Gerar Pack"}
            <span className="text-sm opacity-75 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />{creditCost} cr
            </span>
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Share2 className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold">Um clique, todas as redes</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Selecione as plataformas e a IA cria artes otimizadas para cada formato automaticamente.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {PLATFORMS.slice(0, 4).map((p) => (
                  <span key={p.id} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-pink-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Criando artes...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerando {selectedPlatforms.length} formato{selectedPlatforms.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{results.length} artes criadas ✨</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }} className="space-y-2">
                    <div className="relative group rounded-xl overflow-hidden border border-border bg-muted">
                      <img src={item.url} alt={item.label} className="w-full object-cover" />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = item.url;
                            a.download = `${item.platform}.jpg`;
                            a.click();
                          }}
                          className="w-9 h-9 rounded-xl bg-pink-500/80 flex items-center justify-center text-white">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full gap-2"
                onClick={() => {
                  results.forEach((item, i) => {
                    setTimeout(() => {
                      const a = document.createElement("a");
                      a.href = item.url;
                      a.download = `${item.platform}.jpg`;
                      a.click();
                    }, i * 300);
                  });
                }}>
                <Download className="w-4 h-4" /> Baixar todas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
