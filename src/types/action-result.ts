import { Ingredient, Recipe } from '@/generated/prisma'

export type ActionResult = { success: true } | { error: string }
export type ActionIngredientResult =
  { success: true; ingredient: Ingredient } | { error: string }
export type ActionRecipeResult =
  { success: true; recipes: Recipe } | { error: string }
