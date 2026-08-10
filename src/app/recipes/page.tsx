'use client'

import { useRecipeStore } from '@/store/use-recipe-store'
import { useAuthStore } from '@/store/use-auth-store'
import Link from 'next/link'
import RecipeCard from '@/components/UI/common/RecipeCard'
import SignUpButton from '@/components/UI/SignUpButton'

export default function RecipesPage() {
  const { recipes, isLoading, error } = useRecipeStore()
  const { isAuth } = useAuthStore()

  if (!isAuth) {
    return (
      <div className="flex h-96 flex-col items-center justify-center px-4 text-black">
        <h2 className="mb-2 text-xl font-bold">Access restricted</h2>
        <p className="mb-6 text-center text-gray-500">
          Log in to your account to view recipes
        </p>
        <SignUpButton />
      </div>
    )
  }

  if (isLoading) {
    return <p className="py-12 text-center text-gray-500">loading...</p>
  }

  if (error) {
    return <p className="py-12 text-center text-red-600">{error}</p>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 grid grid-cols-1 gap-3 border-b border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-black">Recipes</h1>
        <Link href="/recipes/new">
          <button className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-orange-600">
            + CREATE RECIPE
          </button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          The list of recipes is currently empty
        </p>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
