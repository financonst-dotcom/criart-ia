"use client";

import { useState } from "react";
import { Sparkles, Zap, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PRESET_BACKGROUNDS = [
  { id: "studio_white", label: "Studio Branco" },
  { id: "studio_black", label: "Studio Preto" },
  { id: "sunset_beach", label: "Pôr do Sol" },
  { id: "luxury_marble", label: "Mármore Luxo" },
  { id: "urban_street", label: "Rua Urbana" },
  { id: "forest_nature", label: "Floresta" },
  { id: "modern_office", label: "Escritório" },
  { id: "pastel_pink", label: "Rosa Pastel" },
];

export default function BackgroundSwapPage() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    if (!inputImage) return toast.error("Adicione uma imagem");
    if (!selectedPreset && !customPrompt) return toast.error("Escolha um fundo ou descreva um");
    setStatus("generating");
    try {
      const res = await fetch("/api/generate/background-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputImage, preset: selectedPreset, customPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.image);
      setStatus("done");
      toast.success("Fundo trocado! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na troca de fundo");
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Troca de Fundo Inteligente</h1>
          <p className="text-sm text-muted-foreground">Substitua o fundo com IA de alta qualidade</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />1 crédito</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* Input */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Imagem original</span>
            <ImageUploader value={inputImage} onChange={setInputImage} label="Upload da imagem" hint="Pessoa, produto ou objeto" aspectRatio="square" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Escolha o fundo</span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button key={bg.id} onClick={() => { setSelectedPreset(bg.id); setCustomPrompt(""); }}
                  className={cn("py-2 px-3 rounded-xl text-xs font-medium border transition-all",
                    selectedPreset === bg.id ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Ou descreva o fundo</span>
            <Input placeholder="Ex: praia tropical ao pôr do sol, palmeiras..." value={customPrompt}
              onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPreset(null); }} />
          </div>

          <Button className="w-full h-12 gap-2 bg-yellow-600 hover:bg-yellow-500 text-white"
            onClick={handleGenerate} loading={status === "generating"}
            disabled={!inputImage || (!selectedPreset && !customPrompt)}>
            <Sparkles className="w-4 h-4" />
            {status === "generating" ? "Trocando fundo..." : "Trocar Fundo"}
          </Button>
        </div>

        <div className="flex items-center justify-center py-8">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="font-semibold text-sm">Resultado</span>
          {status === "done" && result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden border border-border">
                <img src={result} alt="Fundo trocado" className="w-full h-full object-cover" />
              </div>
              <Button size="sm" className="w-full gap-2" onClick={() => { const a = document.createElement("a"); a.href = result!; a.download = "bg-swap.jpg"; a.click(); }}>
                <Download className="w-4 h-4" /> Baixar
              </Button>
            </motion.div>
          ) : (
            <div className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Resultado aparecerá aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
