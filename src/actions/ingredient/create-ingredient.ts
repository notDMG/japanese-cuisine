'use server'

import { auth } from '@/auth/auth'
import { ingredientSchema } from '@/schema/ingredient'
import { prisma } from '@/utils/prisma'

export async function createIngredient(formData: unknown) {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: 'Access denied. Please log in.' }
  }

  const parsed = ingredientSchema.safeParse(formData)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input data'
    return { success: false, error: firstError }
  }

  try {
    const ingredient = await prisma.ingredient.create({
      data: parsed.data,
    })

    return { success: true, ingredient }
  } catch (error) {
    console.error('Error creating ingredient', error)
    return { success: false, error: 'Failed to save the ingredient.' }
  }
}
