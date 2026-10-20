import { Router } from "express";
import { redirect, shortUrl } from "@modules/urlShortener/url.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createUrlSchema } from "./url.schema.js";

export const urlRoute = Router();

urlRoute.post(
  "/short-url",
  optionalAuth,
  validate({ body: createUrlSchema }),
  shortUrl,
);
urlRoute.get("/:shortUrl", redirect);
