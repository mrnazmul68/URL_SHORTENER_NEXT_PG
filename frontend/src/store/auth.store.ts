// src/store/auth.store.ts

import { create } from "zustand";
import type { User } from "@/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setAuth: (accessToken, user) => {
    set({
      accessToken,
      user,
    });
  },

  setAccessToken: (accessToken) => {
    set({
      accessToken,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
    });
  },
}));
