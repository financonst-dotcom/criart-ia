"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FolderOpen, Search, MoreHorizontal, Camera, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeDate } from "@/lib/utils";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Coleção Verão 2026",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop",
    generationsCount: 24,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Campanha Dia das Mães",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
    generationsCount: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Lookbook Outono",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
    generationsCount: 8,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = MOCK_PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize suas gerações por coleção ou campanha
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo projeto
        </Button>
      </div>

      {/* New project modal inline */}
      {showNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5"
        >
          <h3 className="font-semibold text-foreground mb-3">Novo projeto</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Nome do projeto..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && newName && setShowNew(false)}
            />
            <Button onClick={() => newName && setShowNew(false)} disabled={!newName}>
              Criar
            </Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <Input
        placeholder="Buscar projetos..."
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="font-semibold text-foreground">Nenhum projeto encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Tente outro termo de busca" : "Crie seu primeiro projeto acima"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate mb-1">{project.name}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {project.generationsCount} imagens
                  </span>
                  <span>{formatRelativeDate(project.updatedAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
