"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User2, Sparkles, Zap, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GENDER_OPTIONS = [
  { id: "feminine", label: "Feminino" },
  { id: "masculine", label: "Masculino" },
  { id: "neutral", label: "Neutro" },
];

const AGE_OPTIONS = [
  { id: "teen", label: "18-25" },
  { id: "young", label: "26-35" },
  { id: "adult", label: "36-45" },
  { id: "mature", label: "46-55" },
];

const ETHNICITY_OPTIONS = [
  { id: "asian", label: "Asiático" },
  { id: "black", label: "Negro" },
  { id: "caucasian", label: "Caucasiano" },
  { id: "hispanic", label: "Latino" },
  { id: "mixed", label: "Misto" },
  { id: "middle_eastern", label: "Médio Oriente" },
];

const STYLE_OPTIONS = [
  { id: "fashion", label: "Fashion" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "influencer", label: "Influencer" },
  { id: "professional", label: "Profissional" },
  { id: "casual", label: "Casual" },
  { id: "editorial", label: "Editorial" },
];

const POSE_OPTIONS = [
  { id: "standing", label: "Em pé" },
  { id: "sitting", label: "Sentado" },
  { id: "walking", label: "Caminhando" },
  { id: "dynamic", label: "Dinâmico" },
];

const EXPRESSION_OPTIONS = [
  { id: "natural", label: "Natural" },
  { id: "smiling", label: "Sorrindo" },
  { id: "serious", label: "Sério" },
  { id: "confident", label: "Confiante" },
];

const FORMAT_OPTIONS = [
  { id: "square", label: "1:1" },
  { id: "portrait", label: "4:5" },
  { id: "stories", label: "9:16" },
];

export default function AvatarCreatorPage() {
  const [gender, setGender] = useState("feminine");
  const [age, setAge] = useState("young");
  const [ethnicity, setEthnicity] = useState("caucasian");
  const [style, setStyle] = useState("fashion");
  const [pose, setPose] = useState("standing");
  const [expression, setExpression] = useState("natural");
  const [format, setFormat] = useState("portrait");
  const [description, setDescription] = useState("");
  const [numImages, setNumImages] = useState(2);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<string[]>([]);

  async function handleGenerate() {
    setStatus("generating");
    setResults([]);
    try {
      const res = await fetch("/api/generate/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, age, ethnicity, style, pose, expression, format, description, numImages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.images || []);
      setStatus("done");
      toast.success("Avatares criados! ✨");
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro ao criar avatar");
    }
  }

  const SelectGroup = ({
    label, options, value, onChange
  }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
              value === opt.id
                ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <User2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Avatar Creator</h1>
          <p className="text-sm text-muted-foreground">Crie modelos humanos hiper-realistas por IA</p>
        </div>
        <Badge variant="default" className="ml-auto">
          <Zap className="w-3 h-3" />3 créditos / geração
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
            <SelectGroup label="Gênero" options={GENDER_OPTIONS} value={gender} onChange={setGender} />
            <SelectGroup label="Faixa etária" options={AGE_OPTIONS} value={age} onChange={setAge} />
            <SelectGroup label="Etnia" options={ETHNICITY_OPTIONS} value={ethnicity} onChange={setEthnicity} />
            <SelectGroup label="Estilo" options={STYLE_OPTIONS} value={style} onChange={setStyle} />
            <SelectGroup label="Pose" options={POSE_OPTIONS} value={pose} onChange={setPose} />
            <SelectGroup label="Expressão" options={EXPRESSION_OPTIONS} value={expression} onChange={setExpression} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição adicional</label>
            <Textarea
              placeholder="Ex: cabelo longo loiro, olhos verdes, roupa casual moderna..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 text-sm"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formato</label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => setFormat(opt.id)}
                  className={cn("py-2 rounded-xl text-sm font-medium border transition-all",
                    format === opt.id ? "bg-brand-500/15 border-brand-500/40 text-brand-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantidade</label>
              <span className="text-xs text-muted-foreground">{numImages * 3} créditos</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setNumImages(n)}
                  className={cn("py-2 rounded-xl text-sm font-semibold border transition-all",
                    numImages === n ? "bg-brand-500/15 border-brand-500/40 text-brand-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full h-14 text-base gap-3 shadow-brand" onClick={handleGenerate} loading={status === "generating"}>
            {status !== "generating" && <Sparkles className="w-5 h-5" />}
            {status === "generating" ? "Criando avatar..." : "Criar Avatar"}
            {status !== "generating" && (
              <span className="text-sm opacity-75 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />{numImages * 3} cr
              </span>
            )}
          </Button>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <User2 className="w-8 h-8 text-purple-400 animate-pulse_slow" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Configure e gere avatares</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Selecione as características do modelo e clique em Criar Avatar.
                </p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
                <div className="absolute inset-3 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <User2 className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Criando seu avatar...</h3>
                <p className="text-sm text-muted-foreground mt-1">IA gerando modelo hiper-realista</p>
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">{results.length} avatares criados ✨</h3>
              <div className={cn("grid gap-4", results.length <= 2 ? "grid-cols-2" : "grid-cols-3")}>
                {results.map((url, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative group rounded-2xl overflow-hidden border border-border">
                    <img src={url} alt={`Avatar ${i + 1}`} className="w-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="w-9 h-9 rounded-xl bg-background/70 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button onClick={() => { const a = document.createElement("a"); a.href = url; a.download = `avatar-${i+1}.jpg`; a.click(); }}
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
