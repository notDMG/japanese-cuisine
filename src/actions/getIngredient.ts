'use server'

import { prisma } from '@/utils/prisma'

export async function getIngredient() {
	try {
		const ingredients = await prisma.ingredient.findMany()
		return { success: true, ingredients }
	} catch(error) {
		console.error("Ошибка получения ингредиентов", error)
		return { error: "Ошибка при получении ингредиентов" }
	}
}