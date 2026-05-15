"use client";

import { useState } from "react";
import { Scissors, Sparkles, Zap, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RemoveBgPage() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    if (!inputImage) return toast.error("Adicione uma imagem");
    setStatus("generating");
    try {
      const res = await fetch("/api/generate/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputImage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.image);
      setStatus("done");
      toast.success("Fundo removido! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na remoção");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Remover Fundo</h1>
          <p className="text-sm text-muted-foreground">Remoção automática com IA de alta precisão</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />1 crédito</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="text-sm font-semibold text-foreground">Imagem original</span>
          <ImageUploader value={inputImage} onChange={setInputImage} label="Upload da imagem" hint="Produto, pessoa ou objeto" aspectRatio="square" />
          <Button className="w-full gap-2" onClick={handleGenerate} loading={status === "generating"} disabled={!inputImage}>
            <Scissors className="w-4 h-4" />
            {status === "generating" ? "Removendo..." : "Remover fundo"}
          </Button>
        </div>

        <div className="flex items-center justify-center py-8">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="text-sm font-semibold text-foreground">Resultado</span>
          {status === "done" && result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='0' width='10' height='10' fill='%23fff'/%3E%3Crect x='0' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")" }}>
                <img src={result} alt="Sem fundo" className="w-full h-full object-contain" />
              </div>
              <Button size="sm" className="w-full gap-2" onClick={() => { const a = document.createElement("a"); a.href = result!; a.download = "sem-fundo.png"; a.click(); }}>
                <Download className="w-4 h-4" /> Baixar PNG
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
