import { ApiResponse } from "@utils/apiResponse.js";
import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { UrlService } from "./url.service.js";
import { ApiError } from "@utils/apiError.js";

const urlService = new UrlService();
//todo:short url
export const shortUrl = asyncHandler(async (req: Request, res: Response) => {
  const { fullUrl, customUrl } = req.body;

  const response = await urlService.shortUrl(fullUrl, customUrl);
  response.shortUrl = `${process.env.FRONTEND_URL}/${response.shortUrl}`;
  return new ApiResponse(200, response, "Url shorted successfully").send(res);
});

//todo: redirect to full url
export const redirect = asyncHandler(async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  if (!shortUrl || typeof shortUrl !== "string") {
    throw new ApiError(200, "Url not found");
  }
  const response = await urlService.redirect(shortUrl);

  res.redirect(response.fullUrl);
});
