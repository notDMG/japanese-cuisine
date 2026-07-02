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

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  
  category: z.enum(["VEGETABLES", "FRUITS", "MEAT", "DAIRY", "SPICES", "OTHER"], 'Please select a category'),
  
  unit: z.enum(["GRAMS", "KILOGRAMS", "MILLILITERS", "LITERS", "PIECES"], 'Please specify a unit of measurement'),
  
  pricePerUnit: z.number().min(0, "The number must be positive"),
  
  description: z.string().optional()
})