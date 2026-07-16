'use client'

import RecipeForm from '@/components/forms/RecipeForm'
import { useRecipeStore } from '@/store/use-recipe-store'
import { useParams } from 'next/navigation'

export function EditRecipePage() {
  const { id } = useParams<{ id: string }>()
  const { recipes, error, isLoading } = useRecipeStore()

  const currentRecipe = recipes.find((r) => r.id === id)

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading...</p>
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>
  }

  if (!currentRecipe) {
    return <p className="text-red-600 text-center">Recipe not found</p>
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold mb-4 text-black">
        Redactor recipe: {currentRecipe.name}
      </h1>
      <RecipeForm initialRecipe={currentRecipe} />
    </div>
  )
}