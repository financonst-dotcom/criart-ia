"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Generation, PaginatedResponse } from "@/types";

interface UseGenerationsOptions {
  page?: number;
  pageSize?: number;
  type?: string;
  projectId?: string;
  favorited?: boolean;
}

async function fetchGenerations(opts: UseGenerationsOptions = {}): Promise<PaginatedResponse<Generation>> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.pageSize) params.set("pageSize", String(opts.pageSize));
  if (opts.type) params.set("type", opts.type);
  if (opts.projectId) params.set("projectId", opts.projectId);
  if (opts.favorited) params.set("favorited", "true");

  const res = await fetch(`/api/generations?${params}`);
  if (!res.ok) throw new Error("Failed to fetch generations");
  return res.json();
}

async function toggleFavorite(id: string): Promise<void> {
  const res = await fetch(`/api/generations/${id}/favorite`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to toggle favorite");
}

async function deleteGeneration(id: string): Promise<void> {
  const res = await fetch(`/api/generations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}

export function useGenerations(opts: UseGenerationsOptions = {}) {
  return useQuery({
    queryKey: ["generations", opts],
    queryFn: () => fetchGenerations(opts),
    staleTime: 30 * 1000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}

export function useDeleteGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}
