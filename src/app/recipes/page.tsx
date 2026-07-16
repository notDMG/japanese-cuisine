"use client";

import { useRecipeStore } from "@/store/use-recipe-store";
import { useAuthStore } from "@/store/use-auth-store";
import Link from "next/link";
import { RecipeCard } from '@/components/UI/common/RecipeCard'
import SignUpButton from '@/components/UI/SignUpButton'

export default function RecipesPage() {
  const { recipes, isLoading, error } = useRecipeStore();
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-black px-4">
        <h2 className="text-xl font-bold mb-2">Access restricted</h2>
        <p className="text-gray-500 text-center mb-6">
          Log in to your account to view recipes
        </p>
          <SignUpButton />
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-gray-500 text-center py-12">loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-12">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-3 text-center mb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-black">Recipes</h1>
        <Link href="/recipes/new">
          <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-orange-600 transition duration-300">
            + CREATE RECIPE
          </button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500 text-center py-12">The list of recipes is currently empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}