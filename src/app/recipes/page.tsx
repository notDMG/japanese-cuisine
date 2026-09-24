import { auth } from '@/auth/auth'
import { CreateRecipeButton } from '@/components/UI/common/CreateRecipeButton'
import RecipeCard from '@/components/UI/common/RecipeCard'
import { SignUpButton } from '@/components/UI/SignUpButton'
import { prisma } from '@/utils/prisma'

export default async function RecipesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="flex h-90 flex-col items-center justify-center px-4">
        <h2 className="text-md mb-2 text-xl font-bold text-orange-500">
          Access restricted
        </h2>
        <p className="mb-2 text-gray-500">
          Log in to your account to view recipes
        </p>
        <SignUpButton />
      </div>
    )
  }

  const recipes = await prisma.recipe.findMany({
    where: { authorId: userId },
    include: { ingredients: { include: { ingredient: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-2 flex flex-col items-center gap-1">
        <CreateRecipeButton />
        <p className="text-xs text-gray-400">
          🌐 Recipes are public and visible to everyone
        </p>
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
