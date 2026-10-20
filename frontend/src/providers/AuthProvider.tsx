"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/service/userAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { accessToken } = await authService.refresh();
        useAuthStore.getState().setAccessToken(accessToken);
        const user = await authService.me();
        setAuth(accessToken, user);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [clearAuth, setAuth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
          <span className="h-24 w-24 animate-spin border-8 border-white border-t-black" />
      </div>
    );
  }

  return children;
}
