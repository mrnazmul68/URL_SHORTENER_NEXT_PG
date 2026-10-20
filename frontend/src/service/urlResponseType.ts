export type ShortUrlResponse = {
  success: boolean;
  data: {
    shortUrl: string;
    fullUrl: string;
  };
};
