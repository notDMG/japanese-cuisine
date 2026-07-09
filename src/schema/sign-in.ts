import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email("Invalid email format")
    .min(1, "Email is required"),
    
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "A digit is required"),
});