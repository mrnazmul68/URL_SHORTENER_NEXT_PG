import { z } from "zod";

// Reusable field schemas
const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name cannot exceed 100 characters");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email cannot exceed 254 characters")
  .pipe(z.email("Please provide a valid email address"))
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(128, "Password cannot exceed 128 characters");

// Register
export const registerSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

//register input type
export type RegisterInput = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password cannot exceed 128 characters"),
});

//loign input type
export type LoginInput = z.infer<typeof loginSchema>;

// Update profile
// export const updateProfileSchema = z
//   .strictObject({
//     name: nameSchema.optional(),
//     email: emailSchema.optional(),
//   })
//   .refine((data) => data.name !== undefined || data.email !== undefined, {
//     message: "At least one field must be provided",
//   });

// export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
