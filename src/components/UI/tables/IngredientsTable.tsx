import { auth } from '@/auth/auth'
import { prisma } from '@/utils/prisma'
import { siteConf } from '@/config/site.conf'
import { SignUpButton } from '@/components/UI/SignUpButton'
import { DeleteIngredientButton } from '../common/DeleteIngredientButton'

export async function IngredientsList() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="flex h-45 flex-col items-center justify-center px-4 text-black">
        <p className="mb-6 text-center text-gray-500">
          Log in to your account to view your ingredients
        </p>
        <SignUpButton />
      </div>
    )
  }

  const ingredients = await prisma.ingredient.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
  })

  if (ingredients.length === 0) {
    return (
      <div className="mt-5 min-w-80 rounded-xl border bg-white p-8 text-center shadow-2xl">
        <p className="font-medium text-mist-400">
          The list of ingredients is empty
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 w-full px-2 md:px-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-8 md:hidden">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex flex-col justify-between rounded-2xl bg-white p-2 shadow-xl"
          >
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.name}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600 uppercase">
                  {ingredient.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.category}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600">
                  {ingredient.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.unit}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600">
                  {ingredient.unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.pricePerUnit}
                </span>
                <span className="text-[16px] font-bold text-gray-950 italic">
                  {ingredient.pricePerUnit ? (
                    `${ingredient.pricePerUnit} $`
                  ) : (
                    <span className="text-[14px] font-normal text-gray-500 not-italic">
                      Price not listed
                    </span>
                  )}
                </span>
              </div>
            </div>

            <DeleteIngredientButton id={ingredient.id} variant="card" />
          </div>
        ))}
      </div>

      <div className="hidden min-w-full overflow-x-auto rounded-2xl bg-white text-center shadow-xl md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="border-b border-orange-400 bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.name}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.category}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.unit}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.pricePerUnit}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
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
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 uppercase lg:px-6">
                  {ingredient.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 lg:px-6">
                  {ingredient.category}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 lg:px-6">
                  {ingredient.unit}
                </td>
                <td className="px-2 py-4 font-semibold whitespace-nowrap text-gray-900 italic lg:px-6">
                  {ingredient.pricePerUnit ? (
                    `${ingredient.pricePerUnit} $`
                  ) : (
                    <p className="text-[14px] text-gray-500">
                      Price not listed
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap lg:px-6">
                  <DeleteIngredientButton id={ingredient.id} variant="table" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
