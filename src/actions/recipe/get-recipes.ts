'use server'

import { auth } from '@/auth/auth'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/utils/prisma'

type GetRecipeResult =
  | {
      success: true
      recipes: Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>[]
    }
  | { error: string }

const recipeInclude = {
  ingredients: {
    include: {
      ingredient: true,
    },
  },
} as const

export async function getRecipes(): Promise<GetRecipeResult> {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Access denied. Please log in.' }
  }

  try {
    const recipes = await prisma.recipe.findMany({
      include: recipeInclude,
    })
    return { success: true, recipes }
  } catch (error) {
    console.error('Get recipes error:', error)
    return { error: 'Failed to load recipes' }
  }
}
