'use server'

import { prisma } from '@/utils/prisma'

export async function deleteRecipe(id: string) {
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
    return { success: false, error: 'Deleting recipe error' }
  }
}
