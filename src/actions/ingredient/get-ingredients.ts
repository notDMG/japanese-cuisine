'use server'

import { auth } from '@/auth/auth'
import { prisma } from '@/utils/prisma'

export async function getIngredient() {
  const session = await auth()

  if (!session || !session.user) {
    return { success: false, error: 'Access denied. Please log in.' }
  }

  try {
    const ingredients = await prisma.ingredient.findMany()
    return { success: true, ingredients }
  } catch (error) {
    console.error('Error retrieving ingredients', error)
    return { error: 'Error retrieving ingredients' }
  }
}
