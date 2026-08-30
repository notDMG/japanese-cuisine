'use client'

import { useRecipeStore } from '@/store/use-recipe-store'
import Link from 'next/link'
import { useTransition } from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/store/use-auth-store'
import { IRecipe } from '@/types/recipe'
import { UNIT_OPTIONS } from '@/constants/selectOptions'

interface RecipeCardProps {
  recipe: IRecipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { removeRecipe } = useRecipeStore()
  const { isAuth } = useAuthStore()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeRecipe(recipe.id)
      } catch (error) {
        console.error('Ошибка при удалении рецепта:', error)
      }
    })
  }

  const getUnitLabel = (unit: string) => {
    const unitOption = UNIT_OPTIONS.find((option) => option.value === unit)
    return unitOption ? unitOption.label : unit.toLowerCase()
  }

  return (
    <div className="flex h-120 w-full max-w-md min-w-70 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
      <div className="h-48 overflow-hidden p-4 pb-0">
        {recipe.imageUrl ? (
          <div className="group relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-sm font-semibold text-gray-400">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 pt-6 text-black">
        <h2 className="truncate text-xl font-bold">{recipe.name}</h2>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-8 py-4 text-black">
        <p className="line-clamp-3 shrink-0 text-sm text-gray-600">
          {recipe.description || 'Без описания'}
        </p>

        <div className="flex min-h-0 flex-1 flex-col">
          <h3 className="mb-1 text-sm font-semibold text-gray-700">
            Ingredients:
          </h3>
          <ul className="list-disc space-y-1 overflow-y-auto pr-1 pl-5 text-sm text-gray-600">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.ingredient.name}: {ing.quantity}{' '}
                {getUnitLabel(ing.ingredient.unit)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAuth && (
        <div className="mt-auto flex justify-end gap-2 p-6 pt-0">
          <Link href={`/recipes/${recipe.id}`}>
            <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-black transition-colors duration-300 hover:bg-gray-50">
              Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
