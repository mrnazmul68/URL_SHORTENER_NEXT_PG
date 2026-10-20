// src/services/auth.service.ts

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type {
  ApiResponse,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
  User,
} from "@/types/auth.types";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });

    const result = response.data.data;
    useAuthStore.getState().setAuth(result.accessToken, result.user);

    return result;
  },

  async refresh() {
    const response = await api.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh-token",
    );

    return response.data.data;
  },

  async me() {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      useAuthStore.getState().clearAuth();
    }
  },
};

export const login = (email: string, password: string) =>
  authService.login(email, password);

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    { name, email, password },
  );

  const result = response.data.data;
  useAuthStore.getState().setAuth(result.accessToken, result.create);

  return result;
};
