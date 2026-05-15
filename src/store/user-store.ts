import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateCredits: (credits: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      updateCredits: (credits) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits } : null,
        })),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "fashionai-user",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
