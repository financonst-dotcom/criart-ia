"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import type { User } from "@/types";

async function fetchCurrentUser(): Promise<User> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  return data.user;
}

export function useUser() {
  const { user, setUser, isLoading } = useUserStore();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    if (query.error) setUser(null);
  }, [query.data, query.error, setUser]);

  return {
    user: query.data || user,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    refetch: query.refetch,
  };
}
