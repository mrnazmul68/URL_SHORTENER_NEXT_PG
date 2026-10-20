import { api } from "@/lib/api";
import { ShortUrlResponse } from "./urlResponseType";

export const shortUrl = async (fullUrl: string, customUrl?: string) => {
  const response = await api.post<ShortUrlResponse>("/short-url", {
    fullUrl,
    customUrl,
  });
  return response.data;
};
