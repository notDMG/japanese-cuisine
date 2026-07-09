import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  
  category: z.enum(["VEGETABLES", "FRUITS", "MEAT", "DAIRY", "SPICES", "OTHER"], 'Please select a category'),
  
  unit: z.enum(["GRAMS", "KILOGRAMS", "MILLILITERS", "LITERS", "PIECES"], 'Please specify a unit of measurement'),
  
  pricePerUnit: z.number().min(0, "The number must be positive"),
  
  description: z.string().optional()
})