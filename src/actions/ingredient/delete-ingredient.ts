'use server'

import { auth } from '@/auth/auth'
import { prisma } from '@/utils/prisma'

export async function deleteIngredient(id: string) {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: 'Access denied. Please log in.' }
  }

  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Invalid ingredient ID' }
  }

  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id },
    })
    return { success: true, ingredient }
  } catch (error) {
    console.error('Error deleting ingredient', error)
    return { success: false, error: 'Error deleting ingredient' }
  }
}
