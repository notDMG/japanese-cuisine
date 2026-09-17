import Image from 'next/image'
import Link from 'next/link'
import { getUnitLabel } from '@/constants/selectOptions'
import { DeleteRecipeButton } from './DeleteRecipeButton'
import { calculateRecipeCost } from '@/utils/recipe-cost'

interface FeedRecipeCardProps {
  recipe: {
    id: string
    name: string
    description: string
    imageUrl: string | null
    authorId: string
    author: { name: string | null; email: string } | null
    ingredients: {
      id: string
      quantity: number
      ingredient: { name: string; unit: string; pricePerUnit: number | null }
    }[]
  }
  isOwner: boolean
}

export function FeedRecipeCard({ recipe, isOwner }: FeedRecipeCardProps) {
  const cost = calculateRecipeCost(recipe)

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

      <div className="flex items-center justify-between px-8 pt-6">
        <h2 className="w-full truncate text-left text-xl font-bold text-orange-600">
          {recipe.name}
        </h2>

        <div className="flex shrink-0 items-baseline gap-1.5">
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
      </div>

      {recipe.author && (
        <p className="px-8 pt-1 text-left text-sm text-gray-400">
          by {recipe.author.name ?? recipe.author.email}
        </p>
      )}

      <div className="my-2 px-8 py-6">
        <p className="line-clamp-3 text-center text-sm text-gray-600">
          {recipe.description || 'No description'}
        </p>
      </div>

      <div className="mb-2 flex flex-1 flex-col items-start overflow-hidden px-8 text-left text-black">
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <h3 className="mb-2 w-full border-b border-orange-600 pb-1 text-xs font-bold tracking-wider text-gray-700">
            INGREDIENTS
          </h3>
          <ul className="scrollbar-visible list-disc space-y-1 overflow-y-auto pr-2 pl-5 text-sm text-gray-600">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.ingredient.name}: {ing.quantity}{' '}
                {getUnitLabel(ing.ingredient.unit)}
                {ing.ingredient.pricePerUnit != null && (
                  <span className="text-gray-400">
                    {' '}
                    · {(ing.quantity * ing.ingredient.pricePerUnit).toFixed(
                      2
                    )}{' '}
                    ${' '}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-2 p-6 pt-0">
        <Link
          href={`/recipes/${recipe.id}`}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-black transition-colors duration-300 hover:bg-gray-50"
        >
          View
        </Link>
        {isOwner && <DeleteRecipeButton recipeId={recipe.id} />}
      </div>
    </div>
  )
}
