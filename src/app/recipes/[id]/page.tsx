'use client'

import RecipeForm from '@/components/forms/RecipeForm'
import { useRecipeStore } from '@/store/use-recipe-store'
import { useParams } from 'next/navigation'

export default function EditRecipePage() {
	const { id } = useParams<{ id: string }>()
	const { recipes, error, isLoading, hasLoaded } = useRecipeStore()

	const currentRecipe = recipes.find(r => r.id === id)

	if (isLoading || !hasLoaded) {
		return <p className="text-gray-500 text-center text-xl">Loading...</p>
	}

	if (error) {
		return <p className="text-red-600 text-center">{error}</p>
	}

	if (!currentRecipe) {
		return (
			<div className="flex justify-center items-center h-150">
				<p className="text-gray-500 text-xl shadow-2xl p-10">Recipe not found :(</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center p-6">
				<h1 className='text-orange-600 text-4xl font-bold shadow-2xl px-5'>{currentRecipe.name.toUpperCase()}</h1>
			<RecipeForm initialRecipe={currentRecipe} />
		</div>
	)
}