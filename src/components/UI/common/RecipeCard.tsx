'use client'

import Link from 'next/link'
import Image from 'next/image'
import { IRecipe } from '@/types/recipe'
import { useSession } from 'next-auth/react'
import { DeleteRecipeButton } from './DeleteRecipeButton'
import { getUnitLabel } from '@/constants/selectOptions'

interface RecipeCardProps {
  recipe: IRecipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { status } = useSession()

  const isAuth = status === 'authenticated'

  return (
    <div className="flex w-full max-w-85 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
      <div className="h-48 px-4 pt-4">
        {recipe.imageUrl ? (
          <div className="group relative h-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2
          className="truncate text-xl font-bold text-orange-600"
          title={recipe.name}
        >
          {recipe.name}
        </h2>

        <p className="mt-2 line-clamp-3 text-left text-sm text-gray-600">
          {recipe.description || 'No description'}
        </p>

        <div className="my-4 flex min-h-0 flex-1 flex-col">
          <h3 className="mb-2 border-b border-orange-600 pb-1 text-xs font-bold tracking-wider text-gray-700 uppercase">
            Ingredients
          </h3>
          <div className="scrollbar-visible max-h-25 overflow-y-auto pr-3 text-sm text-gray-600">
            <ul className="list-disc space-y-1 pl-4">
              {recipe.ingredients.map((ing) => (
                <li key={ing.id} className="marker:text-orange-400">
                  <span className="font-medium text-gray-700">
                    {ing.ingredient.name}
                  </span>
                  <span className="text-gray-400">: </span>
                  {ing.quantity} {getUnitLabel(ing.ingredient.unit)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isAuth && (
          <div className="mt-auto flex justify-end gap-2 pt-4">
            <Link
              href={`/recipes/${recipe.id}`}
              className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-orange-600 hover:text-white"
            >
              Edit
            </Link>
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
        )}
      </div>
    </div>
  )
}
