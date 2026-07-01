'use server'

import { prisma } from '@/utils/prisma'

export async function deleteIngredient(id: string) {
	try {
		const ingredient = await prisma.ingredient.delete({
			where: { id }
		})
		return { success: true, ingredient }
	} catch(error) {
		console.error("Ошибка удаления ингредиента", error)
		return { error: "Ошибка при удалении ингредиента" }
	}
}