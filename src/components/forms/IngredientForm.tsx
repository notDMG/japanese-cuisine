'use client'

import { OPTIONS_CATEGORY, UNIT_OPTIONS } from '@/constants/selectOptions'
import { useIngredientStore } from '@/store/use-ingredient-store'
import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

export interface IIngredientFormData {
  name: string
  category: string
  unit: string
  pricePerUnit: number | null
  description?: string
}

export function IngredientForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting, errors },
  } = useForm<IIngredientFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      pricePerUnit: null,
      description: '',
    },
  })
  const { addIngredient } = useIngredientStore()

  const onSubmit: SubmitHandler<IIngredientFormData> = async (formData) => {
    await addIngredient(formData)

    const currentError = useIngredientStore.getState().error
    if (currentError) {
      toast.error(currentError, {
        duration: 6000,
        icon: '💢',
      })
      return
    }

    toast.success(`Ingredient ${formData.name} added`, {
      description: 'A fresh product has joined your pantry!',
      duration: 4000,
      icon: '🥬',
    })
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div className="min-w-90 rounded-xl border border-gray-100 bg-white p-8 shadow-xl">
      <h2 className="mb-6 border-b-2 border-orange-500 pb-2 text-2xl font-bold text-black">
        New Ingredient
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Ingredient Name
          </label>
          <input
            type="text"
            placeholder="Banana"
            className="mb-1 w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            {...register('name', {
              required: 'Ingredient name is required',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/,
                message: 'Name must consist of letters only',
              },
              minLength: { value: 2, message: 'Minimum 2 characters' },
            })}
          />
          {errors.name && (
            <p className="text-xs font-bold text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-black">
              Category
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-4 py-4 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              {...register('category', {
                required: 'Please select a category',
              })}
            >
              <option value="">Select</option>
              {OPTIONS_CATEGORY.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs font-bold text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-black">
              Unit
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-4 py-4 text-black transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              {...register('unit', {
                required: 'Please select a unit',
              })}
            >
              <option value="">Select</option>
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="text-xs font-bold text-red-500">
                {errors.unit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Price per unit
          </label>
          <div className="relative">
            <span className="absolute top-2 left-3 text-gray-500">$</span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-8 text-black outline-none focus:ring-2 focus:ring-orange-500"
              {...register('pricePerUnit', {
                required: 'Price is required',
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: 'Price cannot be less than 0.01$',
                },
              })}
            />
          </div>
          {errors.pricePerUnit && (
            <p className="text-xs font-bold text-red-600">
              {errors.pricePerUnit.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-black outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Add description..."
            {...register('description')}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-black py-3 text-sm font-bold tracking-wider text-white uppercase shadow-md transition-colors duration-500 hover:bg-orange-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Adding...' : 'Add Ingredient'}
        </button>
      </form>
    </div>
  )
}
