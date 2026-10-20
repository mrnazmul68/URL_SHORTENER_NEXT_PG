// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
});

// শুধু refresh-এর জন্য: কোনো interceptor নেই
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
];

// Request: token বসাও
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// একসাথে একটাই refresh
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh-token")
      .then((res) => {
        const token = res.data.data.accessToken as string;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null; // promise settle হলে একবারই reset
      });
  }
  return refreshPromise;
}

// Response: 401 হলে refresh + retry
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((e) =>
      original?.url?.includes(e),
    );

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    // Stale token check: ইতিমধ্যে refresh হয়ে গেলে নতুন করে refresh না করে retry
    const currentToken = useAuthStore.getState().accessToken;
    if (
      currentToken &&
      original.headers.Authorization !== `Bearer ${currentToken}`
    ) {
      original.headers.Authorization = `Bearer ${currentToken}`;
      return api(original);
    }

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      const status = (refreshError as AxiosError).response?.status;
      // শুধু auth failure হলে logout; network error হলে নয়
      if (status === 401 || status === 403) {
        useAuthStore.getState().clearAuth();
      }
      return Promise.reject(refreshError);
    }
  },
);
