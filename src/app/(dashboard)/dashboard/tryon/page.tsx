"use client";

import { useState } from "react";
import { Wand2, Sparkles, Zap, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "upper_body", label: "Superior" },
  { id: "lower_body", label: "Inferior" },
  { id: "dresses", label: "Vestido" },
  { id: "full_body", label: "Look Completo" },
];

export default function VirtualTryOnPage() {
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [category, setCategory] = useState("upper_body");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    if (!garmentImage) return toast.error("Adicione a foto da roupa");
    if (!modelImage) return toast.error("Adicione a foto do modelo");

    setStatus("generating");
    try {
      const res = await fetch("/api/generate/virtual-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garmentImage, modelImage, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.image);
      setStatus("done");
      toast.success("Virtual Try-On gerado! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Virtual Try-On</h1>
          <p className="text-sm text-muted-foreground">Prove roupas em modelos com IA fotorrealista</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />3 créditos</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Garment */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white">1</div>
            <span className="font-semibold text-sm">Foto da Roupa</span>
            <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">Obrigatório</span>
          </div>
          <ImageUploader value={garmentImage} onChange={setGarmentImage} label="Upload da roupa" hint="Fundo branco recomendado" aspectRatio="portrait" />
        </div>

        {/* Model */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white">2</div>
            <span className="font-semibold text-sm">Foto do Modelo</span>
            <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">Obrigatório</span>
          </div>
          <ImageUploader value={modelImage} onChange={setModelImage} label="Upload do modelo" hint="Pose frontal ou de perfil" aspectRatio="portrait" />
        </div>

        {/* Config + Result */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="text-sm font-semibold">Categoria</span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={cn("py-2 px-3 rounded-xl text-xs font-medium border transition-all",
                    category === cat.id ? "bg-pink-500/15 border-pink-500/40 text-pink-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4 flex gap-2">
            <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Para melhores resultados use foto frontal do modelo sem roupa de cima (para categoria Superior).
            </p>
          </div>

          <Button className="w-full h-12 gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500"
            onClick={handleGenerate} loading={status === "generating"}
            disabled={!garmentImage || !modelImage}>
            <Wand2 className="w-4 h-4" />
            {status === "generating" ? "Processando..." : "Gerar Try-On"}
          </Button>

          {status === "done" && result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden border border-border group">
              <img src={result} alt="Virtual Try-On" className="w-full object-cover" />
              <div className="p-3 flex gap-2">
                <Button size="sm" className="flex-1 gap-1" onClick={() => { const a = document.createElement("a"); a.href = result!; a.download = "tryon.jpg"; a.click(); }}>
                  <Download className="w-3.5 h-3.5" /> Baixar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
