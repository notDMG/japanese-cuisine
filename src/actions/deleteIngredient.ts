'use server'

import { auth } from '@/auth/auth'
import { prisma } from '@/utils/prisma'

export async function deleteIngredient(id: string) {
	const session = await auth()

	if (!session || !session.user) {
		return { success: false, error: 'Access denied. Please log in.' }
	}

	try {
		const ingredient = await prisma.ingredient.delete({
			where: { id }
		})
		return { success: true, ingredient }
	} catch(error) {
		console.error("Error deleting ingredient", error)
		return { error: "Error deleting ingredient" }
	}
}