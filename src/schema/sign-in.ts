import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string('Email is required')
    .min(1, 'Email is required')
    .check(z.email('Invalid email format'))
    .toLowerCase(),

  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(20, 'Password can be a maximum of 20 characters long')
    .regex(/[a-zA-Zа-яА-ЯёЁ]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .trim(),
})

export type SignInInput = z.infer<typeof signInSchema>
