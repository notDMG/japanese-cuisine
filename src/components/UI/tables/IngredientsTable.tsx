'use client'

import { siteConf } from '@/config/site.conf'
import { useAuthStore } from '@/store/auth.store'
import { useIngredientStore } from '@/store/ingredient.store'

export function IngredientsTable() {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore()
  const { isAuth } = useAuthStore()

  const handleDelete = async (id: string) => {
      await removeIngredient(id)  
  }

  if (!isAuth) {
    return (
      <div className="w-min-80 mt-5 bg-white p-8 rounded-xl shadow-2xl border text-center">
        <p className="text-mist-400 font-medium">Log in to your accounts to see the list of ingredients</p>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="w-min-80 mt-5 bg-white p-8 rounded-xl shadow-2xl border text-center">
        <p className="text-mist-400 font-medium">The list of ingredients is empty</p>
      </div>
    )
  }
	
  return (
    <div className="w-full mt-5">
      <div className="grid grid-cols-1 mx-2 sm:grid-cols-2 gap-3 md:hidden">
        {ingredients.map((ingredient) => (
          <div 
            key={ingredient.id} 
            className="bg-white rounded-2xl p-2 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">{siteConf.tableContent.name}</span>
                <span className="text-gray-600 uppercase text-[14px]">{ingredient.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">{siteConf.tableContent.category}</span>
                <span className="text-gray-600 text-[14px]">{ingredient.category}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">{siteConf.tableContent.unit}</span>
                <span className="text-gray-600 text-[14px]">{ingredient.unit}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">{siteConf.tableContent.pricePerUnit}</span>
                <span className="text-gray-950 font-bold text-[16px] italic">{ingredient.pricePerUnit} $</span>
              </div>
            </div>

            {isAuth && (
              <button
                onClick={() => handleDelete(ingredient.id)}
                disabled={isLoading}
                className="mt-4 bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-10 rounded-xl border border-red-200 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}       
          </div>
        ))}
      </div>

      <div className="hidden md:block min-w-full text-center shadow-xl rounded-2xl overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-orange-400">
            <tr>
              <th scope="col" className="text-black px-6 py-3 font-bold">{siteConf.tableContent.name}</th>
              <th scope="col" className="text-black px-6 py-3 font-bold">{siteConf.tableContent.category}</th>
              <th scope="col" className="text-black px-6 py-3 font-bold">{siteConf.tableContent.unit}</th>
              <th scope="col" className="text-black px-6 py-3 font-bold">{siteConf.tableContent.pricePerUnit}</th>
              <th scope="col" className="text-black px-6 py-3 font-bold">{siteConf.tableContent.action}</th>
            </tr>
          </thead>
        
          <tbody className="divide-y divide-gray-200 bg-white">
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors">
                <td className="text-gray-500 px-6 py-4 whitespace-nowrap uppercase">{ingredient.name}</td>
                <td className="text-gray-500 px-6 py-4 whitespace-nowrap">{ingredient.category}</td>
                <td className="text-gray-500 px-6 py-4 whitespace-nowrap">{ingredient.unit}</td>
                <td className="text-gray-900 px-6 py-4 whitespace-nowrap font-semibold italic">{ingredient.pricePerUnit} $</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isAuth && (
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      disabled={isLoading}
                      className="text-red-600 rounded-xl px-3 py-2 font-bold hover:bg-red-600 hover:text-white transition-colors"
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