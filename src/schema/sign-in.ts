import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .min(1, { message: 'Email is required' })
    .pipe(z.email({ message: 'Invalid email format' })),

  password: z
    .string({ error: 'Password is required' })
    .trim()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password can be a maximum of 20 characters long' })
    .regex(/[a-zA-Zа-яА-ЯёЁ]/, {
      message: 'Password must contain at least one letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
})

export type SignInInput = z.infer<typeof signInSchema>
