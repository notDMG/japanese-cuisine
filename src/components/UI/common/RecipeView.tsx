import { getUnitLabel } from '@/constants/selectOptions'
import type { IRecipe } from '@/types/recipe'
import { calculateRecipeCost } from '@/utils/recipe-cost'
import Image from 'next/image'
import Link from 'next/link'

interface RecipeViewProps {
  recipe: IRecipe
}

export default function RecipeView({ recipe }: RecipeViewProps) {
  const cost = calculateRecipeCost(recipe)

  return (
    <div className="min-w-90 rounded-xl border border-gray-100 bg-white p-4 shadow-2xl md:min-w-120 lg:min-w-140">
      <div className="mb-6 flex items-center justify-between border-b-2 border-orange-500 pb-2">
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          Recipe Details
        </h2>
        <p className="rounded-xl border border-orange-500 px-2 py-1 text-xs text-gray-500">
          VIEWING
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-1 block text-sm font-semibold text-black">Image</p>
          {recipe.imageUrl ? (
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50 sm:h-64">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                className="object-cover"
                fill
              />
            </div>
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 sm:h-64">
              <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                No image
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="block text-sm font-semibold text-black">
              Ingredients
            </p>
            {recipe.ingredients.length > 0 ? (
              <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-xl border border-orange-400 text-black">
                <span className="text-sm text-orange-500">
                  {recipe.ingredients.length}
                </span>
              </div>
            ) : null}
          </div>

          {recipe.ingredients.length > 0 ? (
            <div className="rounded-md border border-gray-300 px-4 py-3">
              <ul className="list-disc space-y-1 pl-4 text-sm text-gray-600 sm:text-base">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="marker:text-orange-400">
                    <div className="flex items-baseline gap-2">
                      <span className="min-w-0">
                        <span className="font-bold text-gray-700">
                          {ing.ingredient.name}
                        </span>
                        <span className="text-gray-400">: </span>
                        {ing.quantity} {getUnitLabel(ing.ingredient.unit)}
                      </span>
                      {ing.ingredient.pricePerUnit != null && (
                        <>
                          <span className="min-w-4 flex-1 border-b-2 border-dotted border-gray-300" />
                          <span className="shrink-0 whitespace-nowrap text-gray-400">
                            {(
                              ing.quantity * ing.ingredient.pricePerUnit
                            ).toFixed(2)}{' '}
                            $
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-orange-500 pt-2">
                <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Total cost
                </span>
                {!cost.isPartial || cost.total > 0 ? (
                  <span className="font-bold text-gray-950 italic">
                    {cost.total.toFixed(2)} $
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    Price not listed
                  </span>
                )}
              </div>
              {cost.isPartial && cost.total > 0 && (
                <p className="mt-1 text-right text-xs text-gray-400">
                  Some ingredient prices are not listed
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ingredients</p>
          )}
        </div>

        <div>
          <p className="mb-1 block text-sm font-semibold text-black">
            Description
          </p>
          <p className="min-h-26 w-full rounded-md border border-gray-300 px-4 py-2 whitespace-pre-line text-black">
            {recipe.description || 'No description'}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center rounded-md border border-gray-300 text-sm font-bold tracking-wider text-black transition-colors duration-200 hover:bg-orange-600 hover:text-white"
          >
            BACK
          </Link>
        </div>
      </div>
    </div>
  )
}
