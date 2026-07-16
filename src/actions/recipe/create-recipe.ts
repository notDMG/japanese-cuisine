'use server'

import { IRecipeFormData } from '@/types/recipe'
import { prisma } from '@/utils/prisma'

export async function createRecipe(formData: IRecipeFormData) {
  try {
    const { name, description, imageUrl, ingredients } = formData

    if (!name || !description || !ingredients || ingredients.length === 0) {
      return { 
        success: false,
        error: "Name, description and at least one ingredient are required"
      }
    }

    const cleanImageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : null

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        imageUrl: cleanImageUrl,
        ingredients: {
          create: ingredients.map((ing) => {
            const parsedQuantity = Number(ing.quantity)
            
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
              throw new Error(`Invalid quantity for ingredient ${ing.ingredientId}`)
            }

            return {
              ingredient: { connect: { id: ing.ingredientId } },
              quantity: parsedQuantity 
            }
          })
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

  } catch (error: unknown) {
    console.error("Recipe creating error details:", error)

		const errorMessage = error instanceof Error ? error.message : "Recipe creating error"
    return { success: false, error: errorMessage }
  }
}