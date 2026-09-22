import Link from 'next/link'

export function CreateRecipeButton() {
  return (
    <div className="mb-2 flex items-center">
      <Link
        href="/recipes/new"
        className="text-md mb-1 rounded-md bg-black px-4 py-2 font-bold text-white transition duration-300 hover:bg-orange-600"
      >
        + CREATE RECIPE
      </Link>
    </div>
  )
}
