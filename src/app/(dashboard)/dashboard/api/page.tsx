"use client";

import { useState } from "react";
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const API_ENDPOINTS = [
  { method: "POST", path: "/v1/generate/outfit-swap", desc: "Troca de roupa em modelo" },
  { method: "POST", path: "/v1/generate/avatar", desc: "Criação de avatar por IA" },
  { method: "POST", path: "/v1/generate/virtual-tryon", desc: "Virtual Try-On" },
  { method: "POST", path: "/v1/generate/ecommerce", desc: "Foto profissional de produto" },
  { method: "POST", path: "/v1/generate/campaign", desc: "Geração de campanha" },
  { method: "POST", path: "/v1/generate/remove-bg", desc: "Remover fundo" },
  { method: "POST", path: "/v1/generate/upscale", desc: "Upscaling de imagem" },
  { method: "GET", path: "/v1/generations", desc: "Listar gerações" },
];

export default function ApiPage() {
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Produção", key: "sk_live_••••••••••••••••••••••••", created: "2026-05-01", lastUsed: "2026-05-15" },
  ]);
  const [showKey, setShowKey] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);

  async function createKey() {
    if (!newKeyName) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 600));
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Nunca",
    };
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName("");
    setCreating(false);
    toast.success("API Key criada!");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <Key className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">API de Integração</h1>
          <p className="text-sm text-muted-foreground">Integre a IA diretamente no seu sistema</p>
        </div>
        <Badge variant="default" className="ml-auto">Plano Pro necessário</Badge>
      </div>

      {/* API Keys */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Chaves de API</h2>

        <div className="flex gap-3">
          <Input placeholder="Nome da chave (ex: Produção)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="flex-1" />
          <Button onClick={createKey} loading={creating} disabled={!newKeyName} className="gap-2">
            <Plus className="w-4 h-4" /> Criar
          </Button>
        </div>

        {apiKeys.map((k) => (
          <div key={k.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm">{k.name}</div>
              <div className="font-mono text-xs text-muted-foreground mt-0.5 truncate">
                {showKey.has(k.id) ? k.key : k.key.replace(/sk_live_.+/, "sk_live_••••••••••••••••••••••••")}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Criada {k.created}</div>
            <div className="flex gap-1">
              <button onClick={() => { const n = new Set(showKey); n.has(k.id) ? n.delete(k.id) : n.add(k.id); setShowKey(n); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
                {showKey.has(k.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success("Copiado!"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-brand-400">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => setApiKeys((prev) => prev.filter((x) => x.id !== k.id))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Code example */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Code className="w-4 h-4" /> Exemplo de uso</h2>
        <div className="rounded-2xl bg-[#0d1117] border border-border p-5 font-mono text-sm overflow-x-auto">
          <pre className="text-emerald-400">{`curl -X POST https://fashionai.studio/api/v1/generate/outfit-swap \\
  -H "Authorization: Bearer sk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "garmentImage": "https://example.com/dress.jpg",
    "style": "photorealistic",
    "format": "square",
    "numImages": 2
  }'`}</pre>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Endpoints disponíveis</h2>
        <div className="rounded-2xl border border-border overflow-hidden">
          {API_ENDPOINTS.map((ep, i) => (
            <div key={ep.path} className={`flex items-center gap-4 px-4 py-3 text-sm ${i > 0 ? "border-t border-border" : ""}`}>
              <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md ${ep.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {ep.method}
              </span>
              <code className="text-brand-400 flex-1 truncate">{ep.path}</code>
              <span className="text-muted-foreground text-xs hidden sm:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
