'use client'

import { siteConf } from '@/config/site.conf'
import { useAuthStore } from '@/store/use-auth-store'
import { useIngredientStore } from '@/store/use-ingredient-store'

export function IngredientsTable() {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore()
  const { isAuth } = useAuthStore()

  const handleDelete = async (id: string) => {
    await removeIngredient(id)
  }

  if (!isAuth) {
    return (
      <div className="w-min-80 mt-5 rounded-xl border bg-white p-8 text-center shadow-2xl">
        <p className="font-medium text-mist-400">
          Log in to your accounts to see the list of ingredients
        </p>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="w-min-80 mt-5 rounded-xl border bg-white p-8 text-center shadow-2xl">
        <p className="font-medium text-mist-400">
          The list of ingredients is empty
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 w-full">
      <div className="mx-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-8 md:hidden">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex flex-col justify-between rounded-2xl bg-white p-2 shadow-xl"
          >
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.name}
                </span>
                <span className="text-[14px] text-gray-600 uppercase">
                  {ingredient.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.category}
                </span>
                <span className="text-[14px] text-gray-600">
                  {ingredient.category}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.unit}
                </span>
                <span className="text-[14px] text-gray-600">
                  {ingredient.unit}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.pricePerUnit}
                </span>
                <span className="text-[16px] font-bold text-gray-950 italic">
                  {ingredient.pricePerUnit} $
                </span>
              </div>
            </div>

            {isAuth && (
              <button
                onClick={() => handleDelete(ingredient.id)}
                disabled={isLoading}
                className="h-10 items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="hidden min-w-full overflow-hidden rounded-2xl bg-white text-center shadow-xl md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="border-b border-orange-400 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold text-black">
                {siteConf.tableContent.name}
              </th>
              <th scope="col" className="px-6 py-3 font-bold text-black">
                {siteConf.tableContent.category}
              </th>
              <th scope="col" className="px-6 py-3 font-bold text-black">
                {siteConf.tableContent.unit}
              </th>
              <th scope="col" className="px-6 py-3 font-bold text-black">
                {siteConf.tableContent.pricePerUnit}
              </th>
              <th scope="col" className="px-6 py-3 font-bold text-black">
                {siteConf.tableContent.action}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 uppercase">
                  {ingredient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {ingredient.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {ingredient.unit}
                </td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900 italic">
                  {ingredient.pricePerUnit} $
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  {isAuth && (
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      disabled={isLoading}
                      className="rounded-xl px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
