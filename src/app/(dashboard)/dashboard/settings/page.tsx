"use client";

import { useState } from "react";
import { Settings, User, Bell, Lock, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Lock },
  { id: "account", label: "Conta", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "Usuário", email: "usuario@email.com" });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Configurações salvas!");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Sidebar */}
        <nav className="space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === id
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="rounded-2xl border border-border bg-card p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-foreground">Informações do perfil</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-xl font-bold text-white">
                  U
                </div>
                <div>
                  <Button variant="outline" size="sm">Alterar foto</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG — Máx 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>

              <Button onClick={handleSave} loading={saving}>Salvar alterações</Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-foreground">Segurança</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha atual</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nova senha</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmar nova senha</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>Alterar senha</Button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-foreground">Conta</h2>
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
                <h3 className="font-semibold text-destructive mb-1">Zona de perigo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Deletar sua conta é uma ação irreversível. Todos os dados serão apagados.
                </p>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Deletar conta
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-foreground">Notificações</h2>
              <div className="space-y-4">
                {[
                  { label: "Geração concluída", desc: "Quando uma imagem é gerada" },
                  { label: "Créditos baixos", desc: "Quando seus créditos ficam abaixo de 5" },
                  { label: "Novos recursos", desc: "Quando lançarmos novas funcionalidades" },
                  { label: "Resumo semanal", desc: "Relatório do seu uso semanal" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <button className="w-10 h-6 rounded-full bg-brand-500 relative">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
