import { auth } from '@/auth/auth'
import { prisma } from '@/utils/prisma'
import RecipeForm from '@/components/forms/RecipeForm'
import { SignUpButton } from '@/components/UI/SignUpButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params

  const session = await auth()
  const authorId = session?.user?.id

  if (!authorId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center px-4">
        <h2 className="mb-2 text-xl font-bold">Access restricted</h2>
        <p className="mb-6 text-center text-gray-500">
          Log in to your account to edit recipes
        </p>
        <SignUpButton />
      </div>
    )
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { ingredients: { include: { ingredient: true } } },
  })

  if (!recipe) {
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
        {recipe.name.toUpperCase()}
      </h1>
      <RecipeForm initialRecipe={recipe} />
    </div>
  )
}
