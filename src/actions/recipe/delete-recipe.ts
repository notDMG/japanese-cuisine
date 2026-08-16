'use server'

import { auth } from '@/auth/auth'
import { ActionResult } from '@/types/action-result'
import { prisma } from '@/utils/prisma'

export async function deleteRecipe(id: string): Promise<ActionResult> {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Access denied. Please log in' }
  }

  if (!id) {
    return { error: 'Invalid recipe ID' }
  }

  try {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    })

    await prisma.recipe.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Deleting recipe error', error)
    return { error: 'Failed to delete recipe' }
  }
}
