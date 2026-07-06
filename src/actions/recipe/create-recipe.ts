'use server'

import { IngredientType } from '@/types/ingredient'
import { IRecipeFormData } from '@/types/recipe'
import { prisma } from '@/utils/prisma'

export async function createRecipe(formData: IRecipeFormData) {
	try {
		const { name, description, imageUrl, ingredients } = formData

		if (!name || !description || !ingredients || ingredients.length === 0) {
			return { 
				success: false,
				error: "Name and at least one ingredients are required"
			}
		}

		const recipe = await prisma.recipe.create({
			data: {
				name,
				description,
				imageUrl,
				ingredients: {
					create: ingredients.map(({ ingredientId, quantity }: IngredientType) => ({
						ingredient: { connect: { id: ingredientId } },
						quantity
					}))
				}
			},
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				}
			}
		})

		return { success: true, recipe }

	} catch(error) {
		console.error("Recipe creating error: ", error)
		return { success: false, error: "Recipe creating error" }
	}
}