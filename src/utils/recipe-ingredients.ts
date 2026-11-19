import { prisma } from '@/utils/prisma'

export async function ownsRecipeIngredients(
  authorId: string,
  ingredients: { ingredientId: string }[]
): Promise<boolean> {
  const ingredientIds = [
    ...new Set(ingredients.map((item) => item.ingredientId)),
  ]
  const count = await prisma.ingredient.count({
    where: { id: { in: ingredientIds }, authorId },
  })

  return count === ingredientIds.length
}
