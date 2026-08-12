import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(1, { message: 'Name is required' }),

  category: z.enum(
    ['VEGETABLES', 'FRUITS', 'MEAT', 'DAIRY', 'SPICES', 'OTHER'],
    { error: 'Please select a category' }
  ),

  unit: z.enum(['GRAMS', 'KILOGRAMS', 'MILLILITERS', 'LITERS', 'PIECES'], {
    error: 'Please specify a unit of measurement',
  }),

  pricePerUnit: z
    .number({ error: 'Price is required' })
    .nonnegative({ message: 'Price cannot be negative' }),

  description: z.string().optional(),
})

export type IngredientInput = z.infer<typeof ingredientSchema>
