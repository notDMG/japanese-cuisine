import { Ingredient } from '@/generated/prisma'

export type ActionResult = { success: true } | { error: string }
export type ActionIngredientResult =
  { success: true; ingredient: Ingredient } | { error: string }
