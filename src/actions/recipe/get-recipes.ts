'use server'

import { prisma } from '@/utils/prisma'

export async function getRecipes() {
	try {
		const recipes = await prisma.recipe.findMany({
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				}
			}
		})
		return { success: true, recipes }
	} catch(error) {
		console.error("Get recipes error: ", error)
		return { success: false, error: "Get recipes error" }
	}
}