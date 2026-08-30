'use client'

import { useIngredientStore } from '@/store/use-ingredient-store'
import { useRecipeStore } from '@/store/use-recipe-store'
import type { IRecipe } from '@/types/recipe'
import { recipeSchema, type RecipeInput } from '@/schema/recipe'
import { useState } from 'react'
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
  const [imageError, setImageError] = useState(false)

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

  const watchedIngredients = useWatch({
    control,
    name: 'ingredients',
  })

  const selectedIngredientIds =
    watchedIngredients?.map((item) => item.ingredientId) || []

  const isImagePreviewVisible =
    watchedImageUrl && !errors.imageUrl && !imageError

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
    <div className="min-w-90 rounded-xl border border-gray-100 bg-white p-4 shadow-xl transition-all duration-300 md:min-w-120">
      <h2 className="mb-6 border-b-2 border-orange-500 pb-2 text-xl font-bold text-black sm:text-2xl">
        {initialRecipe ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
            placeholder="Ramen"
            className="h-10 w-full rounded-md border border-gray-300 px-4 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          <div className="h-5">
            {errors.name && (
              <p className="mt-1 text-xs font-bold text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Image URL
          </label>
          <input
            {...register('imageUrl')}
            type="text"
            placeholder="https://example.com/image.jpg"
            className="h-10 w-full rounded-md border border-gray-300 px-4 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            onChange={() => setImageError(false)}
          />
          <div className="h-5">
            {errors.imageUrl && (
              <p className="mt-1 text-xs font-bold text-red-500">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {isImagePreviewVisible && (
            <div className="relative mt-2 h-48 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50 sm:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={watchedImageUrl}
                src={watchedImageUrl}
                alt="Recipe preview"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">
            Ingredients Composition
          </label>

          {fields.map((field, index) => {
            const ingredientError =
              errors.ingredients?.[index]?.ingredientId?.message
            const quantityError = errors.ingredients?.[index]?.quantity?.message
            const hasError = Boolean(ingredientError || quantityError)

            return (
              <div key={field.id} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <select
                      {...register(`ingredients.${index}.ingredientId`)}
                      className="h-10 w-full rounded-md border border-gray-300 px-3 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select ingredient</option>
                      {availableIngredients.map((ing) => {
                        const isSelected =
                          selectedIngredientIds.includes(ing.id) &&
                          watchedIngredients?.[index]?.ingredientId !== ing.id

                        return (
                          <option
                            key={ing.id}
                            value={ing.id}
                            disabled={isSelected}
                          >
                            {ing.name} {isSelected ? '(Selected)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="w-20 sm:w-24">
                    <input
                      {...register(`ingredients.${index}.quantity`, {
                        setValueAs: (v) => (v === '' ? null : Number(v)),
                      })}
                      type="number"
                      className="h-10 w-full rounded-md border border-gray-300 px-2 text-center text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {fields.length > 0 ? (
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-xl text-red-500 transition hover:bg-red-50 sm:hidden"
                        aria-label="Remove ingredient"
                      >
                        ✕
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="hidden h-10 items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 sm:flex"
                        aria-label="Remove ingredient"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="w-10 sm:w-20" />
                  )}
                </div>

                <div className="h-5">
                  {hasError && (
                    <p className="mt-1 text-xs font-bold text-red-500">
                      {ingredientError || quantityError}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {fields.length < 10 && (
            <button
              type="button"
              onClick={() => append({ ingredientId: '', quantity: 1 })}
              className="h-10 w-full rounded-md border border-dashed border-gray-300 text-sm font-semibold text-gray-600 transition duration-300 hover:border-orange-500 hover:text-orange-500"
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
            rows={4}
            placeholder="Add description..."
            className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          <div className="h-5">
            {errors.description && (
              <p className="mt-1 text-xs font-bold text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push('/recipes')}
            className="h-11 w-full rounded-md border border-gray-300 text-sm font-bold tracking-wider text-gray-700 uppercase transition-colors duration-200 hover:bg-orange-600 hover:text-white sm:w-1/2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-md bg-black text-sm font-bold tracking-wider text-white uppercase shadow-md transition-colors duration-200 hover:bg-orange-600 disabled:bg-gray-400 sm:w-1/2"
          >
            {isSubmitting
              ? 'Saving...'
              : initialRecipe
                ? 'Save Changes'
                : 'Add Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
