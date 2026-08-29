import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(2, { message: 'Minimum 2 characters' })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: 'Name must consist of letters only',
    }),

  category: z.enum(
    ['VEGETABLES', 'FRUITS', 'MEAT', 'DAIRY', 'SPICES', 'OTHER'],
    { error: 'Please select a category' }
  ),

  unit: z.enum(['GRAMS', 'KILOGRAMS', 'MILLILITERS', 'LITERS', 'PIECES'], {
    error: 'Please specify a unit of measurement',
  }),

  pricePerUnit: z
    .number({ error: 'Price is required' })
    .positive({ message: 'Price must be greater than 0' })
    .nullable(),

  description: z.string().optional(),
})

export type IngredientInput = z.infer<typeof ingredientSchema>
