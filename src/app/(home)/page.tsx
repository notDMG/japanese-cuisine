import { auth } from '@/auth/auth'
import { CreateRecipeButton } from '@/components/UI/common/CreateRecipeButton'
import { FeedRecipeCard } from '@/components/UI/common/FeedRecipeCard'
import { prisma } from '@/utils/prisma'

export default async function HomePage() {
  const session = await auth()
  const userId = session?.user?.id

  const recipes = await prisma.recipe.findMany({
    include: {
      author: { select: { name: true, email: true } },
      ingredients: { include: { ingredient: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {recipes.length === 0 ? (
        <div className="mb-4 border-b border-gray-100 text-center">
          <h1 className="mb-4 text-2xl font-bold text-black">BE THE FIRST</h1>
          <CreateRecipeButton />

          <p className="py-12 text-center text-gray-500">
            The list of recipes is currently empty
          </p>
        </div>
      ) : (
        <div className="mb-4 flex flex-col items-center border-b border-gray-100">
          <CreateRecipeButton />

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <FeedRecipeCard
                key={recipe.id}
                recipe={recipe}
                isOwner={userId === recipe.authorId}
              />
            ))}
          </section>
        </div>
      )}
    </main>
  )
}
