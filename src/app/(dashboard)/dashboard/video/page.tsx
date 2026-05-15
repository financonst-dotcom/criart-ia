"use client";

import { useState } from "react";
import { Play, Sparkles, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const DURATIONS = [
  { id: "3", label: "3s", desc: "Story rápido" },
  { id: "5", label: "5s", desc: "Padrão" },
  { id: "10", label: "10s", desc: "Reel médio" },
];

const MOTION_STYLES = [
  { id: "zoom_in", label: "Zoom In" },
  { id: "zoom_out", label: "Zoom Out" },
  { id: "pan_left", label: "Pan Esquerda" },
  { id: "pan_right", label: "Pan Direita" },
  { id: "rotation", label: "Rotação" },
];

export default function VideoGeneratorPage() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [motionStyle, setMotionStyle] = useState("zoom_in");
  const [duration, setDuration] = useState("5");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleGenerate() {
    if (!inputImage) return toast.error("Adicione uma imagem");
    setStatus("generating");
    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputImage, motionStyle, duration: parseInt(duration), prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideoUrl(data.video);
      setStatus("done");
      toast.success("Vídeo gerado! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <Play className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Gerador de Vídeos IA</h1>
          <p className="text-sm text-muted-foreground">Transforme imagens em vídeos para Reels e TikTok</p>
        </div>
        <Badge variant="warning" className="ml-auto">Beta</Badge>
        <Badge variant="default"><Zap className="w-3 h-3" />5 créditos</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Imagem base</span>
            <ImageUploader value={inputImage} onChange={setInputImage} label="Upload da imagem" hint="Imagem que será animada" aspectRatio="portrait" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Estilo de movimento</span>
            <div className="grid grid-cols-2 gap-2">
              {MOTION_STYLES.map((s) => (
                <button key={s.id} onClick={() => setMotionStyle(s.id)}
                  className={cn("py-2 rounded-xl text-xs font-medium border transition-all",
                    motionStyle === s.id ? "bg-teal-500/15 border-teal-500/40 text-teal-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Duração</span>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button key={d.id} onClick={() => setDuration(d.id)}
                  className={cn("flex flex-col items-center py-2.5 rounded-xl border transition-all",
                    duration === d.id ? "bg-teal-500/15 border-teal-500/40 text-teal-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  <span className="font-bold text-sm">{d.label}</span>
                  <span className="text-xs opacity-60">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Descrição (opcional)</span>
            <Textarea placeholder="Ex: modelo andando na passarela, movimento suave..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-20 text-sm" />
          </div>

          <Button className="w-full h-12 gap-2 bg-teal-600 hover:bg-teal-500 text-white"
            onClick={handleGenerate} loading={status === "generating"} disabled={!inputImage}>
            <Play className="w-4 h-4" />
            {status === "generating" ? "Gerando vídeo..." : "Gerar Vídeo"}
            <span className="text-sm opacity-75 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />5 cr</span>
          </Button>
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                <Play className="w-8 h-8 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold">Anime suas imagens</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Transforme qualquer foto em um vídeo curto para Reels, TikTok e Stories.
                </p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center"><Play className="w-6 h-6 text-teal-400" /></div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Gerando vídeo...</h3>
                <p className="text-sm text-muted-foreground mt-1">Isso pode levar 30-60 segundos</p>
              </div>
            </div>
          )}

          {status === "done" && videoUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="font-semibold">Vídeo gerado! ✨</h3>
              <video src={videoUrl} controls className="w-full rounded-2xl border border-border" />
              <Button className="w-full gap-2" onClick={() => { const a = document.createElement("a"); a.href = videoUrl!; a.download = "video.mp4"; a.click(); }}>
                <Download className="w-4 h-4" /> Baixar vídeo
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
