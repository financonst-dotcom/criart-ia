"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Zap, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CATALOG_STYLES = [
  { id: "ecommerce_clean", label: "E-commerce Clean" },
  { id: "luxury_editorial", label: "Editorial Luxo" },
  { id: "lifestyle_casual", label: "Lifestyle Casual" },
  { id: "marketplace_simple", label: "Marketplace" },
];

const LAYOUTS = [
  { id: "single", label: "Individual", desc: "1 produto por foto" },
  { id: "duo", label: "Duplo", desc: "2 produtos" },
  { id: "grid", label: "Grade 4", desc: "4 produtos" },
];

type ProductItem = { id: string; image: string | null; name: string; price: string };

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: "1", image: null, name: "", price: "" },
  ]);
  const [catalogStyle, setCatalogStyle] = useState("ecommerce_clean");
  const [layout, setLayout] = useState("single");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [results, setResults] = useState<string[]>([]);

  function addProduct() {
    if (products.length >= 4) return;
    setProducts((prev) => [...prev, { id: Date.now().toString(), image: null, name: "", price: "" }]);
  }

  function removeProduct(id: string) {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function updateProduct(id: string, field: keyof ProductItem, value: string | null) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function handleGenerate() {
    const validProducts = products.filter((p) => p.image);
    if (validProducts.length === 0) return toast.error("Adicione ao menos um produto com imagem");
    setStatus("generating");
    setResults([]);
    try {
      const res = await fetch("/api/generate/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: validProducts,
          catalogStyle,
          layout,
          brandName,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.images || []);
      setStatus("done");
      toast.success(`${data.images?.length || 0} páginas de catálogo criadas! ✨`);
    } catch (err: unknown) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Erro na geração");
    }
  }

  const creditCost = products.filter((p) => p.image).length * 2;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Catálogo de Produtos</h1>
          <p className="text-sm text-muted-foreground">Crie páginas de catálogo profissionais com IA</p>
        </div>
        <Badge variant="default" className="ml-auto"><Zap className="w-3 h-3" />2 créditos / produto</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Produtos ({products.length}/4)</span>
              {products.length < 4 && (
                <button onClick={addProduct} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              )}
            </div>

            <div className="space-y-4">
              {products.map((product, i) => (
                <div key={product.id} className="rounded-xl border border-border p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Produto {i + 1}</span>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(product.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <ImageUploader
                    value={product.image}
                    onChange={(v) => updateProduct(product.id, "image", v)}
                    label="Foto do produto"
                    hint="Foto em fundo branco"
                    aspectRatio="square"
                  />
                  <Input placeholder="Nome do produto" value={product.name}
                    onChange={(e) => updateProduct(product.id, "name", e.target.value)} className="h-8 text-xs" />
                  <Input placeholder="Preço (ex: R$ 99,90)" value={product.price}
                    onChange={(e) => updateProduct(product.id, "price", e.target.value)} className="h-8 text-xs" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Estilo do Catálogo</span>
            <div className="grid grid-cols-2 gap-2">
              {CATALOG_STYLES.map((s) => (
                <button key={s.id} onClick={() => setCatalogStyle(s.id)}
                  className={cn("py-2 px-3 rounded-xl text-xs font-medium border transition-all",
                    catalogStyle === s.id ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Layout</span>
            <div className="grid grid-cols-3 gap-2">
              {LAYOUTS.map((l) => (
                <button key={l.id} onClick={() => setLayout(l.id)}
                  className={cn("flex flex-col items-center py-2.5 rounded-xl border transition-all",
                    layout === l.id ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  <span className="font-bold text-xs">{l.label}</span>
                  <span className="text-xs opacity-60 mt-0.5">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <span className="font-semibold text-sm">Info da Marca</span>
            <Input placeholder="Nome da marca / loja" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            <Textarea placeholder="Descrição ou slogan (opcional)" value={description}
              onChange={(e) => setDescription(e.target.value)} className="h-20 text-sm" />
          </div>

          <Button className="w-full h-14 gap-3 bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleGenerate} loading={status === "generating"}
            disabled={!products.some((p) => p.image)}>
            <BookOpen className="w-5 h-5" />
            {status === "generating" ? "Criando catálogo..." : "Gerar Catálogo"}
            <span className="text-sm opacity-75 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{creditCost} cr</span>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold">Catálogos prontos para vender</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Adicione seus produtos e a IA cria páginas de catálogo profissionais e prontas para uso.
                </p>
              </div>
            </div>
          )}

          {status === "generating" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center"><BookOpen className="w-6 h-6 text-indigo-400" /></div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Montando catálogo...</h3>
                <p className="text-sm text-muted-foreground mt-1">Organizando produtos e aplicando estilo</p>
              </div>
            </div>
          )}

          {status === "done" && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{results.length} páginas criadas ✨</h3>
              <div className="grid gap-4">
                {results.map((url, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} className="relative group rounded-2xl overflow-hidden border border-border">
                    <img src={url} alt={`Catálogo ${i + 1}`} className="w-full" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => { const a = document.createElement("a"); a.href = url; a.download = `catalogo-${i+1}.jpg`; a.click(); }}
                        className="w-10 h-10 rounded-xl bg-indigo-500/80 flex items-center justify-center text-white">
                        <Download className="w-5 h-5" />
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
