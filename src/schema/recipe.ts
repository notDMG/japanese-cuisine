import { z } from 'zod'

export const recipeIngredientSchema = z.object({
  ingredientId: z
    .string({ error: 'Ingredient is required' })
    .min(1, { message: 'Please select an ingredient' }),

  quantity: z
    .number({ error: 'Quantity is required' })
    .positive({ message: 'Quantity must be greater than 0' }),
})

export const recipeSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
    .trim(),

  description: z
    .string({ error: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(2000, { message: 'Description must not exceed 2000 characters' })
    .trim(),

  imageUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Invalid URL format',
    })
    .or(z.literal('')),

  ingredients: z
    .array(recipeIngredientSchema, { error: 'Ingredients must be an array' })
    .min(1, { message: 'At least one ingredient is required' }),
})

export type RecipeInput = z.infer<typeof recipeSchema>
