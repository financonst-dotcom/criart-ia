"use client";

import { useState } from "react";
import { ZoomIn, Zap, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UpscalePage() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [scale, setScale] = useState(4);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleUpscale() {
    if (!inputImage) return toast.error("Adicione uma imagem");
    setStatus("generating");
    try {
      const res = await fetch("/api/generate/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputImage, scale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.image);
      setStatus("done");
      toast.success("Imagem melhorada! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro no upscaling");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <ZoomIn className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Upscaling de Imagem</h1>
          <p className="text-sm text-muted-foreground">Aumente a resolução e qualidade com IA</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />1 crédito</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <span className="text-sm font-semibold">Imagem original</span>
          <ImageUploader value={inputImage} onChange={setInputImage} label="Upload da imagem" hint="Qualquer imagem para melhorar" aspectRatio="square" />

          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Escala de aumento</span>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((s) => (
                <button key={s} onClick={() => setScale(s)}
                  className={cn("py-2 rounded-xl text-sm font-bold border transition-all",
                    scale === s ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleUpscale} loading={status === "generating"} disabled={!inputImage}>
            <ZoomIn className="w-4 h-4" />
            {status === "generating" ? "Processando..." : `Upscale ${scale}x`}
          </Button>
        </div>

        <div className="flex items-center justify-center py-8">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="text-sm font-semibold">Resultado {scale}x</span>
          {status === "done" && result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden border border-border">
                <img src={result} alt="Upscaled" className="w-full h-full object-cover" />
              </div>
              <Button size="sm" className="w-full gap-2" onClick={() => { const a = document.createElement("a"); a.href = result!; a.download = `upscaled-${scale}x.jpg`; a.click(); }}>
                <Download className="w-4 h-4" /> Baixar {scale}x
              </Button>
            </motion.div>
          ) : (
            <div className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <ZoomIn className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Resultado aparecerá aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
