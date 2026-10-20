import { z } from "zod";

// Full URL
const fullUrlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(2048, "URL cannot exceed 2048 characters")
  .pipe(
    z.url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      error: "Please provide a valid HTTP or HTTPS URL",
    }),
  );

// Custom URL slug
const customUrlSchema = z
  .string()
  .trim()
  .min(3, "Custom alias must be at least 3 characters")
  .max(200, "Custom alias cannot exceed 200 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Custom alias can contain only letters, numbers, hyphens and underscores",
  );

// Create URL
export const createUrlSchema = z.strictObject({
  fullUrl: fullUrlSchema,
  customUrl: z.union([customUrlSchema, z.literal("")]).optional(),
  shortUrl: z.union([customUrlSchema, z.literal("")]).optional(),
});

export type CreateUrlInput = z.output<typeof createUrlSchema>;

// Update URL
// export const updateUrlSchema = z
//   .strictObject({
//     fullUrl: fullUrlSchema.optional(),
//     shortUrl: shortUrlSchema.optional(),
//   })
//   .refine((data) => data.fullUrl !== undefined || data.shortUrl !== undefined, {
//     message: "At least one field must be provided",
//   });

// export type UpdateUrlInput = z.output<typeof updateUrlSchema>;
