import { z } from 'zod'

export const registerFieldsSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Please enter your email')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email address',
    })
    .toLowerCase(),

  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(20, 'Password can be a maximum of 20 characters long')
    .regex(/[a-zA-Zа-яА-ЯёЁ]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .trim(),

  confirmPassword: z
    .string({ message: 'Please repeat your password' })
    .min(1, 'Please repeat your password'),
})

export const registerFormSchema = registerFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export type RegisterFormInput = z.infer<typeof registerFormSchema>
