'use client'

import RecipeForm from '@/components/forms/RecipeForm'
import { useRecipeStore } from '@/store/use-recipe-store'
import { useParams } from 'next/navigation'

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>()
  const { recipes, error, isLoading, hasLoaded } = useRecipeStore()

  const currentRecipe = recipes.find((r) => r.id === id)

  if (isLoading || !hasLoaded) {
    return <p className="text-center text-xl text-gray-500">Loading...</p>
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>
  }

  if (!currentRecipe) {
    return (
      <div className="flex h-150 items-center justify-center">
        <p className="p-10 text-xl text-gray-500 shadow-2xl">
          Recipe not found :(
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="px-5 text-4xl font-bold text-orange-600 shadow-2xl">
        {currentRecipe.name.toUpperCase()}
      </h1>
      <RecipeForm initialRecipe={currentRecipe} />
    </div>
  )
}
