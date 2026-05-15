"use client";

import { useState } from "react";
import { Megaphone, Sparkles, Zap, Instagram, ShoppingBag, Youtube, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PLATFORMS = [
  { id: "instagram_post", label: "Instagram Post", icon: Instagram, size: "1080×1080" },
  { id: "instagram_stories", label: "Stories", icon: Instagram, size: "1080×1920" },
  { id: "shopee", label: "Shopee", icon: ShoppingBag, size: "800×800" },
  { id: "mercadolivre", label: "Mercado Livre", icon: ShoppingBag, size: "1200×1200" },
  { id: "youtube", label: "YouTube Thumb", icon: Youtube, size: "1280×720" },
];

const STYLES = ["Moderno", "Minimalista", "Colorido", "Elegante", "Jovem", "Corporativo"];

export default function CampaignsPage() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [campaignText, setCampaignText] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram_post"]);
  const [style, setStyle] = useState("Moderno");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<Array<{ platform: string; url: string }>>([]);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleGenerate() {
    if (!productImage) return toast.error("Adicione a foto do produto");
    if (selectedPlatforms.length === 0) return toast.error("Selecione ao menos uma plataforma");

    setStatus("generating");
    try {
      const res = await fetch("/api/generate/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productImage, campaignText, callToAction, platforms: selectedPlatforms, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.images || []);
      setStatus("done");
      toast.success(`${data.images?.length || 0} artes criadas! ✨`);
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  const cost = selectedPlatforms.length * 2;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Campanhas Automáticas IA</h1>
          <p className="text-sm text-muted-foreground">Gere artes para todas as plataformas de uma vez</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />{cost} créditos</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Foto do Produto / Arte</span>
            <ImageUploader value={productImage} onChange={setProductImage} label="Upload do produto" hint="Principal imagem da campanha" aspectRatio="square" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Texto da Campanha</span>
            <Textarea placeholder="Ex: PROMOÇÃO! Vestido floral com 30% OFF apenas hoje..." value={campaignText} onChange={(e) => setCampaignText(e.target.value)} className="h-20 text-sm" />
            <Input placeholder="Call to Action: Ex: 'Compre agora'" value={callToAction} onChange={(e) => setCallToAction(e.target.value)} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Plataformas</span>
            <div className="space-y-2">
              {PLATFORMS.map((p) => {
                const Icon = p.icon;
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all",
                      selected ? "bg-blue-500/10 border-blue-500/40 text-foreground" : "border-border text-muted-foreground hover:bg-accent"
                    )}>
                    <Icon className={cn("w-4 h-4", selected && "text-blue-400")} />
                    <span className="flex-1 text-left font-medium">{p.label}</span>
                    <span className="text-xs opacity-60">{p.size}</span>
                    {selected && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><Zap className="w-3 h-3 text-white" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Estilo Visual</span>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className={cn("py-2 rounded-xl text-xs font-medium border transition-all",
                    style === s ? "bg-blue-500/15 border-blue-500/40 text-blue-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full h-14 gap-3 bg-blue-600 hover:bg-blue-500 text-white"
            onClick={handleGenerate} loading={status === "generating"} disabled={!productImage}>
            <Megaphone className="w-5 h-5" />
            {status === "generating" ? "Criando campanhas..." : "Gerar Campanhas"}
            <span className="text-sm opacity-75 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{cost} cr</span>
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Megaphone className="w-8 h-8 text-blue-400 animate-pulse_slow" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Crie campanhas para todas as plataformas</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Selecione as plataformas e clique em Gerar para criar artes otimizadas para cada uma.
                </p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Criando campanhas...</h3>
                <p className="text-sm text-muted-foreground mt-1">Gerando artes para {selectedPlatforms.length} plataforma(s)</p>
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{results.length} artes criadas ✨</h3>
              <div className="grid grid-cols-2 gap-4">
                {results.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-border group">
                    <img src={r.url} alt={r.platform} className="w-full object-cover" />
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{PLATFORMS.find((p) => p.id === r.platform)?.label}</span>
                      <button onClick={() => { const a = document.createElement("a"); a.href = r.url; a.download = `campaign-${r.platform}.jpg`; a.click(); }}
                        className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/30">
                        <Download className="w-3.5 h-3.5" />
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
