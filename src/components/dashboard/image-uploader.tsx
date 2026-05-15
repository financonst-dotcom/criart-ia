"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
}

export function ImageUploader({
  value,
  onChange,
  label = "Clique ou arraste uma imagem",
  hint,
  maxSizeMB = 10,
  accept = { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
  className,
  aspectRatio = "auto",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Tamanho máximo: ${maxSizeMB}MB`);
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Erro ao fazer upload");

        const { url } = await res.json();
        onChange(url);
        toast.success("Imagem carregada!");
      } catch {
        toast.error("Erro ao carregar imagem. Tente novamente.");
      } finally {
        setUploading(false);
      }
    },
    [onChange, maxSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading,
  });

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-video",
    auto: "min-h-[140px]",
  };

  if (value) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden group", aspectClasses[aspectRatio], className)}>
        <img src={value} alt="Upload" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onChange(null)}
            className="w-9 h-9 rounded-xl bg-destructive/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
        "flex flex-col items-center justify-center gap-3 p-6",
        aspectClasses[aspectRatio],
        isDragActive
          ? "border-brand-500 bg-brand-500/5"
          : "border-border hover:border-brand-500/50 hover:bg-accent/30",
        uploading && "pointer-events-none opacity-60",
        className
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <>
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-6 h-6 text-brand-400" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WEBP — Máx {maxSizeMB}MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
