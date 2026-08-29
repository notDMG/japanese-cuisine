'use client'

import { useIngredientStore } from '@/store/use-ingredient-store'
import { useRecipeStore } from '@/store/use-recipe-store'
import { recipeSchema, type RecipeInput } from '@/schema/recipe'
import type { IRecipe } from '@/types/recipe'
import { useRouter } from 'next/navigation'
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

interface RecipeFormProps {
  initialRecipe?: IRecipe
}

const initialState: RecipeInput = {
  name: '',
  description: '',
  imageUrl: '',
  ingredients: [{ ingredientId: '', quantity: 1 }],
}

export default function RecipeForm({ initialRecipe }: RecipeFormProps) {
  const router = useRouter()

  const { ingredients: availableIngredients } = useIngredientStore()
  const { addRecipe, updateRecipe } = useRecipeStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RecipeInput>({
    resolver: zodResolver(recipeSchema),
    mode: 'onBlur',
    defaultValues: initialRecipe
      ? {
          name: initialRecipe.name,
          description: initialRecipe.description,
          imageUrl: initialRecipe.imageUrl ?? '',
          ingredients: initialRecipe.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
          })),
        }
      : initialState,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const watchedImageUrl = useWatch({
    control,
    name: 'imageUrl',
  })
  const isImagePreviewVisible = watchedImageUrl && !errors.imageUrl

  const onSubmit: SubmitHandler<RecipeInput> = async (data) => {
    const result = initialRecipe
      ? await updateRecipe(initialRecipe.id, data)
      : await addRecipe(data)

    if (result.success === true) {
      toast.success(
        initialRecipe ? `${initialRecipe.name} updated` : 'Recipe added',
        { duration: 4000, icon: '🍜' }
      )
      if (!initialRecipe) reset(initialState)
      router.push('/recipes')
    } else {
      const errorMessage = result.error ?? 'Unknown error'
      setError('root', { message: errorMessage })
      toast.error(errorMessage, { duration: 6000, icon: '💢' })
    }
  }

  return (
    <div className="max-w-120 min-w-90 rounded-xl border border-gray-100 bg-white p-8 shadow-xl">
      <h2 className="mb-6 border-b-2 border-orange-500 pb-2 text-2xl font-bold text-black">
        {initialRecipe ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {errors.root && (
          <p className="text-center text-sm font-bold text-red-500">
            {errors.root.message}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Recipe Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Image URL
          </label>
          <input
            {...register('imageUrl')}
            type="text"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.imageUrl.message}
            </p>
          )}

          {isImagePreviewVisible && (
            <div className="relative mt-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={watchedImageUrl}
                alt="Recipe preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
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
            <div key={field.id} className="flex items-start gap-3">
              <div className="flex-1">
                <select
                  {...register(`ingredients.${index}.ingredientId`)}
                  className="h-10.5 w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select ingredient</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
                {errors.ingredients?.[index]?.ingredientId && (
                  <p className="mt-1 text-xs font-bold text-red-500">
                    {errors.ingredients[index]?.ingredientId?.message}
                  </p>
                )}
              </div>

              <div className="w-15">
                <input
                  {...register(`ingredients.${index}.quantity`, {
                    setValueAs: (v) => (v === '' ? null : Number(v)),
                  })}
                  type="number"
                  step="any"
                  className="h-10.5 w-full rounded-md border border-gray-300 text-center text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p className="mt-1 text-center text-xs font-bold text-red-500">
                    {errors.ingredients[index]?.quantity?.message}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="h-10.5 rounded-md border border-gray-300 px-3 text-xl text-red-500 transition hover:bg-red-50"
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
              className="w-full rounded-md border border-dashed border-gray-300 py-2 text-sm font-semibold text-gray-600 transition duration-300 hover:border-orange-500 hover:text-orange-500"
            >
              + Add an ingredient field
            </button>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Add recipe steps or description..."
            className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.description && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black py-3 text-sm font-bold tracking-wider text-white uppercase shadow-md transition-colors duration-300 hover:bg-orange-600 disabled:bg-gray-400"
          >
            {isSubmitting
              ? 'Saving...'
              : initialRecipe
                ? 'Save Changes'
                : 'Add Recipe'}
          </button>

          <button
            className="w-full rounded-md bg-black py-3 text-sm font-bold tracking-wider text-white uppercase shadow-md transition-colors duration-300 hover:bg-orange-600 disabled:bg-gray-400"
            type="button"
            onClick={() => router.push('/recipes')}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  )
}
