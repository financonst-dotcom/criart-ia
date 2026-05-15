"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shirt,
  Sparkles,
  Zap,
  Download,
  RotateCcw,
  Heart,
  Share2,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FORMAT_OPTIONS = [
  { id: "square", label: "Quadrado", ratio: "1:1", width: 1024, height: 1024 },
  { id: "portrait", label: "Retrato", ratio: "4:5", width: 864, height: 1080 },
  { id: "stories", label: "Stories", ratio: "9:16", width: 608, height: 1080 },
  { id: "landscape", label: "YouTube", ratio: "16:9", width: 1280, height: 720 },
];

const STYLE_OPTIONS = [
  { id: "photorealistic", label: "Fotorrealista" },
  { id: "fashion", label: "Fashion" },
  { id: "editorial", label: "Editorial" },
  { id: "studio", label: "Studio" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "catalog", label: "Catálogo" },
];

type GenerationStatus = "idle" | "generating" | "done" | "error";

interface GeneratedImage {
  url: string;
  seed?: number;
}

export default function OutfitSwapPage() {
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [sceneOrientation, setSceneOrientation] = useState(
    "fundo neutro, sem efeitos especiais, pouco brilho"
  );
  const [format, setFormat] = useState("square");
  const [style, setStyle] = useState("photorealistic");
  const [numImages, setNumImages] = useState(2);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [favorited, setFavorited] = useState<Set<number>>(new Set());

  async function handleGenerate() {
    if (!garmentImage) {
      toast.error("Adicione a foto da roupa");
      return;
    }

    setStatus("generating");
    setResults([]);

    try {
      const res = await fetch("/api/generate/outfit-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garmentImage,
          modelImage,
          description,
          sceneOrientation,
          format,
          style,
          numImages,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na geração");
      }

      const data = await res.json();
      setResults(data.images || []);
      setStatus("done");
      toast.success(`${data.images?.length || 0} imagens geradas! ✨`);
    } catch (err: unknown) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Erro ao gerar imagens");
    }
  }

  function handleDownload(url: string, index: number) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `outfit-swap-${Date.now()}-${index}.jpg`;
    a.click();
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <Shirt className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Troca de Roupa IA</h1>
          <p className="text-sm text-muted-foreground">
            Vista qualquer roupa em modelos com perfeição fotorrealista
          </p>
        </div>
        <Badge variant="default" className="ml-auto">
          <Zap className="w-3 h-3" />
          2 créditos / geração
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* Left — Controls */}
        <div className="space-y-5">
          {/* Garment upload */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">1</div>
              <h3 className="font-semibold text-sm text-foreground">Foto da Roupa</h3>
              <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Obrigatório</span>
            </div>
            <ImageUploader
              value={garmentImage}
              onChange={setGarmentImage}
              label="Upload da roupa"
              hint="Foto da frente, fundo branco recomendado"
              aspectRatio="portrait"
            />
          </div>

          {/* Model upload */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">2</div>
              <h3 className="font-semibold text-sm text-foreground">Foto do Modelo</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Opcional</span>
            </div>
            <ImageUploader
              value={modelImage}
              onChange={setModelImage}
              label="Upload do modelo"
              hint="Deixe vazio para IA criar o modelo"
              aspectRatio="portrait"
            />
            {!modelImage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-brand-500/5 border border-brand-500/20">
                <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Sem foto de modelo, a IA criará um automaticamente baseado no estilo selecionado.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Descrição da Arte</h3>
            <Textarea
              placeholder="Ex: vestido florido manga curta em modelo feminino, fundo branco studio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24 text-sm"
            />
          </div>

          {/* Scene */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Orientação de Cena</h3>
            <Textarea
              value={sceneOrientation}
              onChange={(e) => setSceneOrientation(e.target.value)}
              className="h-20 text-sm"
            />
          </div>

          {/* Style */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Estilo Visual</h3>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStyle(opt.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200",
                    style === opt.id
                      ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Formato</h3>
            <div className="grid grid-cols-4 gap-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all duration-200",
                    format === opt.id
                      ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "border-2 rounded transition-colors",
                      format === opt.id ? "border-brand-400" : "border-current",
                      opt.id === "square" && "w-6 h-6",
                      opt.id === "portrait" && "w-4 h-6",
                      opt.id === "stories" && "w-3.5 h-6",
                      opt.id === "landscape" && "w-6 h-4"
                    )}
                  />
                  <span className="text-xs font-medium">{opt.label}</span>
                  <span className="text-xs opacity-60">{opt.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">Quantidade</h3>
              <span className="text-xs text-muted-foreground">{numImages * 2} créditos</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumImages(n)}
                  className={cn(
                    "py-2 rounded-xl text-sm font-semibold border transition-all",
                    numImages === n
                      ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <Button
            className="w-full h-14 text-base gap-3 shadow-brand"
            onClick={handleGenerate}
            loading={status === "generating"}
            disabled={!garmentImage || status === "generating"}
          >
            {status !== "generating" && <Sparkles className="w-5 h-5" />}
            {status === "generating" ? "Gerando..." : "Gerar Imagens"}
            {status !== "generating" && (
              <span className="flex items-center gap-1 text-sm opacity-75">
                <Zap className="w-4 h-4" />
                {numImages * 2} cr
              </span>
            )}
          </Button>
        </div>

        {/* Right — Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-brand-400 animate-pulse_slow" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Pronto para criar</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Adicione a foto da roupa e clique em Gerar para criar imagens fotorrealistas.
                </p>
              </div>

              {/* Tips */}
              <div className="w-full max-w-sm space-y-2 text-left mt-4">
                {[
                  "Use fotos da roupa em fundo branco para melhores resultados",
                  "Adicione foto do modelo para preservar a identidade",
                  "Descreva o estilo visual desejado no campo de descrição",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ChevronRight className="w-3 h-3 text-brand-400 shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-brand-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
                <div className="absolute inset-3 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">IA gerando imagens...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vestindo a roupa no modelo com perfeição fotorrealista
                </p>
              </div>
              <div className="flex gap-2">
                {["Analisando roupa", "Preparando modelo", "Gerando imagens"].map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs text-muted-foreground"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {results.length} imagens geradas ✨
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
                  <RotateCcw className="w-4 h-4" />
                  Nova geração
                </Button>
              </div>

              <div className={cn(
                "grid gap-4",
                results.length === 1 ? "grid-cols-1" :
                results.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
              )}>
                {results.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group rounded-2xl overflow-hidden border border-border"
                  >
                    <img
                      src={img.url}
                      alt={`Geração ${i + 1}`}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          const n = new Set(favorited);
                          n.has(i) ? n.delete(i) : n.add(i);
                          setFavorited(n);
                        }}
                        className={cn(
                          "w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center transition-colors",
                          favorited.has(i)
                            ? "bg-red-500/80 text-white"
                            : "bg-background/70 text-muted-foreground hover:text-red-400"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", favorited.has(i) && "fill-current")} />
                      </button>
                      <button
                        onClick={() => handleDownload(img.url, i + 1)}
                        className="w-9 h-9 rounded-xl bg-brand-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-brand-500 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="w-4 h-4" />
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
