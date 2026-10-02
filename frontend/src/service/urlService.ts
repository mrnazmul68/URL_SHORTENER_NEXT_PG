import { api } from "@/api/api";
import { ShortUrlResponse } from "./uelResponseType";

export const shortUrl = async (fullUrl: string, customUrl?: string) => {
  const response = await api.post<ShortUrlResponse>("/short-url", {
    fullUrl,
    customUrl,
  });
  return response.data;
};
