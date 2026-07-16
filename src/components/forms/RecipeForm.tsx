'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm, useFieldArray, SubmitHandler, useWatch } from 'react-hook-form'
import { useIngredientStore } from '@/store/use-ingredient-store'
import { useRecipeStore } from '@/store/use-recipe-store'
import { IRecipe, IRecipeFormData } from '@/types/recipe'
import { useRouter } from 'next/navigation'

interface RecipeFormProps {
  initialRecipe?: IRecipe
}

const initialState: IRecipeFormData = {
  name: '',
  description: '',
  imageUrl: '',
  ingredients: [{ ingredientId: '', quantity: 1 }]
}

export default function RecipeForm({ initialRecipe }: RecipeFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { ingredients: availableIngredients } = useIngredientStore()
  const { addRecipe, updateRecipe } = useRecipeStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors }
  } = useForm<IRecipeFormData>({
    mode: 'onBlur',
    defaultValues: initialRecipe
      ? {
          name: initialRecipe.name,
          description: initialRecipe.description,
          imageUrl: initialRecipe.imageUrl,
          ingredients: initialRecipe.ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity
          }))
        }
      : initialState
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

  const watchedImageUrl = useWatch({
    control,
    name: 'imageUrl'
  })
  const isImagePreviewVisible = watchedImageUrl && !errors.imageUrl

  const onSubmit: SubmitHandler<IRecipeFormData> = data => {
    startTransition(async () => {
      setError(null)

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, data)
        : await addRecipe(data)

      if (result.success) {
        alert(initialRecipe ? 'Recipe updated' : 'Recipe added to the DB')
        router.push('/')
      } else {
        setError(result.error || "Couldn't save the recipe :(")
      }
    })
  }

  useEffect(() => {
    if (isSubmitSuccessful && !initialRecipe) {
      reset(initialState)
    }
  }, [isSubmitSuccessful, reset, initialRecipe])

  return (
    <div className="min-w-90 max-w-120 bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-orange-500 pb-2">
        {initialRecipe ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {error && (
          <p className="text-red-500 text-sm font-bold text-center">{error}</p>
        )}

        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Recipe Name
          </label>
          <input
            {...register('name', {
              required: 'Recipe name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' }
            })}
            type="text"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-bold mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Image URL
          </label>
          <input
            {...register('imageUrl', {
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:\?.*)?)$/i,
                message:
                  'Please enter a valid image URL (png, jpg, jpeg, gif, webp)'
              }
            })}
            type="text"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-xs font-bold mt-1">
              {errors.imageUrl.message}
            </p>
          )}

          {isImagePreviewVisible && (
            <div className="mt-3 relative w-full h-48 bg-gray-50 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={watchedImageUrl}
                alt="Recipe preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-black">
            Ingredients Composition
          </label>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 items-start"
            >
              <div className="flex-1">
                <select
                  {...register(`ingredients.${index}.ingredientId` as const, {
                    required: 'Select an ingredient'
                  })}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-10.5"
                >
                  <option value="">Select ingredient</option>
                  {availableIngredients.map(ing => (
                    <option
                      key={ing.id}
                      value={ing.id}
                    >
                      {ing.name}
                    </option>
                  ))}
                </select>
                {errors.ingredients?.[index]?.ingredientId && (
                  <p className="text-red-500 text-xs font-bold mt-1">
                    {errors.ingredients[index]?.ingredientId?.message}
                  </p>
                )}
              </div>

              <div className="w-15">
                <input
                  {...register(`ingredients.${index}.quantity` as const, {
                    required: 'Required',
                    valueAsNumber: true,
                    onChange: e => {
                      const val = e.target.value
                      if (val.startsWith('0') && val.length > 1) {
                        e.target.value = val.replace(/^0+/, '')
                      }
                    },
                    validate: {
                      positive: val => val > 0 || 'Specify the quantity'
                    }
                  })}
                  type="number"
                  step="any"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-10.5 text-center"
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p className="text-red-500 text-xs font-bold mt-1 text-center">
                    {errors.ingredients[index]?.quantity?.message}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="h-10.5 px-3 text-red-500 border border-gray-300 hover:bg-red-50 transition rounded-md text-xl"
                >
                  &times;
                </button>
              )}
            </div>
          ))}

          {fields.length < 10 && (
            <button
              type="button"
              onClick={() => append({ ingredientId: '', quantity: 1 })}
              className="w-full py-2 border border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:border-orange-500 hover:text-orange-500 transition rounded-md"
            >
              + Add Row Ingredient
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Add recipe steps or description..."
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-orange-600 shadow-md uppercase tracking-wider text-sm duration-500 transition-colors disabled:bg-gray-400"
        >
          {isPending
            ? 'Saving...'
            : initialRecipe
              ? 'Save Changes'
              : 'Add Recipe'}
        </button>
      </form>
    </div>
  )
}