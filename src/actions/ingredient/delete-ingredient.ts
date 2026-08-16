'use server'

import { auth } from '@/auth/auth'
import { ActionIngredientResult } from '@/types/action-result'
import { prisma } from '@/utils/prisma'

export async function deleteIngredient(
  id: string
): Promise<ActionIngredientResult> {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Access denied. Please log in.' }
  }

  if (!id) {
    return { error: 'Invalid ingredient ID' }
  }

  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id },
    })
    return { success: true, ingredient }
  } catch (error) {
    console.error('Error deleting ingredient', error)
    return { error: 'Error deleting ingredient' }
  }
}
