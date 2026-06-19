import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email("Неверный формат почты")
    .min(1, "Email обязателен"),
    
  password: z
    .string()
    .min(8, "Пароль должен быть не менее 8 символов")
    .regex(/[0-9]/, "Нужна цифра"),
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  
  category: z.enum(["VEGETABLES", "FRUITS", "MEAT", "DAIRY", "SPICES", "OTHER"]),
  
  unit: z.enum(["GRAMS", "KILOGRAMS", "MILLILITERS", "LITERS", "PIECES"]),
  
  pricePerUnit: z.number().min(1, "Укажите цену за штуку"),
    
  description: z.string().optional()
})