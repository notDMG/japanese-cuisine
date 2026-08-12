import { z } from 'zod'

export const registerFieldsSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .min(1, { message: 'Please enter your email' })
    .pipe(z.email({ message: 'Invalid email address' })),

  password: z
    .string({ error: 'Password is required' })
    .trim()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password can be a maximum of 20 characters long' })
    .regex(/[a-zA-Zа-яА-ЯёЁ]/, {
      message: 'Password must contain at least one letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),

  confirmPassword: z
    .string({ error: 'Please repeat your password' })
    .min(1, { message: 'Please repeat your password' }),
})

export const registerFormSchema = registerFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export type RegisterFormInput = z.infer<typeof registerFormSchema>
