'use server'

import { IngredientType } from '@/types/ingredient'
import { IRecipeFormData } from '@/types/recipe'
import { prisma } from '@/utils/prisma'

export async function updateRecipe(id: string, formData: IRecipeFormData) {
	try {
		const { name, description, imageUrl, ingredients } = formData

		if (!name || !description || !ingredients || ingredients.length === 0) {
			return {
				success: false, 
				error: "Name, description, and at least one ingredient are required"
			}
		}

		const recipe = await prisma.recipe.update({
			where: { id },
			data: {
				name,
				description,
				imageUrl,
				ingredients: {
					deleteMany: {},
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
		console.error("Updating recipe error: ", error)
		return { success: false, error: "Updating recipe error: " }
	}
}