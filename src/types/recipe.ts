import { IIngredient } from './ingredient'

export interface IRecipeIngredientInput {
  ingredientId: string
  quantity: number
}

export interface IRecipeFormData {
  name: string
  description: string
  imageUrl?: string | null
  ingredients: IRecipeIngredientInput[]
}

export interface IRecipeIngredient {
  id: string
  recipeId: string
  ingredientId: string
  quantity: number
  ingredient: IIngredient
}

export interface IRecipe {
  id: string
  name: string
  description: string
  imageUrl?: string | null
  ingredients: IRecipeIngredient[]
}
