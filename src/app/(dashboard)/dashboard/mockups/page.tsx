"use client";

import { useState } from "react";
import { Package, Sparkles, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MOCKUP_TYPES = [
  { id: "tshirt_front", label: "Camiseta Frente", icon: "👕" },
  { id: "tshirt_back", label: "Camiseta Costas", icon: "👕" },
  { id: "hoodie", label: "Moletom", icon: "🧥" },
  { id: "mug", label: "Caneca", icon: "☕" },
  { id: "bag_tote", label: "Sacola", icon: "👜" },
  { id: "phone_case", label: "Capa Celular", icon: "📱" },
  { id: "poster", label: "Poster", icon: "🖼️" },
  { id: "pillow", label: "Almofada", icon: "🛋️" },
  { id: "notebook", label: "Caderno", icon: "📓" },
  { id: "cap", label: "Boné", icon: "🧢" },
  { id: "packaging", label: "Embalagem", icon: "📦" },
  { id: "bottle", label: "Garrafa", icon: "🍶" },
];

const BACKGROUNDS = ["Branco", "Preto", "Cinza", "Madeira", "Mármore", "Colorido"];

export default function MockupsPage() {
  const [artImage, setArtImage] = useState<string | null>(null);
  const [mockupType, setMockupType] = useState("tshirt_front");
  const [background, setBackground] = useState("Branco");
  const [numImages, setNumImages] = useState(2);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<string[]>([]);

  async function handleGenerate() {
    if (!artImage) return toast.error("Adicione a arte para o mockup");
    setStatus("generating");
    setResults([]);
    try {
      const res = await fetch("/api/generate/mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artImage, mockupType, background, numImages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.images || []);
      setStatus("done");
      toast.success(`${data.images?.length || 0} mockups criados! ✨`);
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Gerador de Mockups</h1>
          <p className="text-sm text-muted-foreground">Aplique sua arte em produtos realistas</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />2 créditos / mockup</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Sua Arte / Estampa</span>
            <ImageUploader value={artImage} onChange={setArtImage} label="Upload da arte" hint="PNG transparente para melhor resultado" aspectRatio="square" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Tipo de Produto</span>
            <div className="grid grid-cols-3 gap-2">
              {MOCKUP_TYPES.map((t) => (
                <button key={t.id} onClick={() => setMockupType(t.id)}
                  className={cn("flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-center",
                    mockupType === t.id ? "bg-orange-500/15 border-orange-500/40" : "border-border hover:bg-accent"
                  )}>
                  <span className="text-xl">{t.icon}</span>
                  <span className={cn("text-xs font-medium", mockupType === t.id ? "text-orange-400" : "text-muted-foreground")}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Fundo</span>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button key={bg} onClick={() => setBackground(bg)}
                  className={cn("py-2 rounded-xl text-xs font-medium border transition-all",
                    background === bg ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {bg}
                </button>
              ))}
            </div>
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
                    numImages === n ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full h-14 gap-3 bg-orange-600 hover:bg-orange-500 text-white"
            onClick={handleGenerate} loading={status === "generating"} disabled={!artImage}>
            <Package className="w-5 h-5" />
            {status === "generating" ? "Criando mockup..." : "Criar Mockup"}
            <span className="text-sm opacity-75 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{numImages * 2} cr</span>
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Package className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Mockups profissionais em segundos</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Envie sua arte e escolha o produto. A IA aplica a estampa de forma realista.
                </p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center"><Package className="w-6 h-6 text-orange-400" /></div>
              </div>
              <div className="text-center"><h3 className="font-semibold">Criando mockups...</h3></div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{results.length} mockups criados ✨</h3>
              <div className={cn("grid gap-4", results.length <= 2 ? "grid-cols-2" : "grid-cols-3")}>
                {results.map((url, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative group rounded-2xl overflow-hidden border border-border">
                    <img src={url} alt={`Mockup ${i + 1}`} className="w-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => { const a = document.createElement("a"); a.href = url; a.download = `mockup-${i+1}.jpg`; a.click(); }}
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
