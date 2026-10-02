import { Router } from "express";
import { redirect, shortUrl } from "@modules/urlShortener/url.controller.js";

export const urlRoute = Router();

urlRoute.post("/short-url", shortUrl);
urlRoute.get("/:shortUrl", redirect);
