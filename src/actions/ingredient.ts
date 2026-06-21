'use server'

import { IIngredientFormData } from '@/forms/ingredient.form'
import { ingredientSchema } from '@/schema/zod'
import { prisma } from '@/utils/prisma'
import { ZodError } from 'zod'

export async function createIngredient(formData: IIngredientFormData) {
	try {
		const data = {
			name: formData.name,
			category: formData.category,
			unit: formData.unit,
			pricePerUnit: formData.pricePerUnit,
			description: formData.description
		}
	 
		const validatedData = ingredientSchema.parse(data)

		const ingredient = await prisma.ingredient.create({
			data: {
				name: validatedData.name,
				category: validatedData.category,
				unit: validatedData.unit,
				pricePerUnit: validatedData.pricePerUnit,
				description: validatedData.description
			}
		})
		return { success: true, ingredient: ingredient}
	} catch (error) {
		if (error instanceof ZodError) {
			return { error: error.issues.map((er) => er.message).join(', ') }
		}
		console.error('Ошибка при создании ингредиента', error)
		return { success: false, error: 'Не удалось сохранить ингредиент'}
	}
}