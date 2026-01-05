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
