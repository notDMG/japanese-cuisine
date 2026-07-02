'use client'

import { useForm, type SubmitHandler } from "react-hook-form"
import { useEffect } from "react"
import { OPTIONS_CATEGORY, UNIT_OPTIONS } from "@/constans/selectOptions"
import { useIngredientStore } from '@/store/ingredient.store'

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
    formState: { isSubmitSuccessful, isSubmitting, errors } 
  } = useForm<IIngredientFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      pricePerUnit: null,
      description: ''
    }
  })
  const { addIngredient } = useIngredientStore()

  const onSubmit: SubmitHandler<IIngredientFormData> = async (formData) => {
    await addIngredient(formData)

    const currentError = useIngredientStore.getState().error
    if (currentError) {
      alert(currentError)
      return
    }

    alert('Ingredient added to the DB')
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div className="min-w-90 bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-orange-500 pb-2">
        New Ingredient
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Ingredient Name</label>
          <input
            type="text"
            placeholder="Banana"
            className="w-full px-4 py-2 mb-1 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            {...register('name', {
              required: 'Ingredient name is required',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/,
                message: 'Name must consist of letters only'
              },
              minLength: { value: 2, message: 'Minimum 2 characters' }
            })}
          />
          {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Category</label>
            <select
              className="w-full px-4 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all py-4"
              {...register('category', {
                required: 'Please select a category'
              })}
            >
              <option value="">Select</option>
              {OPTIONS_CATEGORY.map(category =>
                <option key={category.value} value={category.value}>{category.label}</option>
              )}
            </select>
            {errors.category && <p className="text-red-500 text-xs font-bold">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">Unit</label>
            <select
              className="w-full px-4 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all py-4"
              {...register('unit', {
                required: 'Please select a unit'
              })}
            >
              <option value="">Select</option>
              {UNIT_OPTIONS.map(unit =>
                <option key={unit.value} value={unit.value}>{unit.label}</option>
              )}
            </select>
            {errors.unit && <p className="text-red-500 text-xs font-bold">{errors.unit.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">Price per unit</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-black outline-none"
              {...register('pricePerUnit', {
                required: 'Price is required',
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: 'Price cannot be less than 0.01$'
                }
              })}
            />
          </div>
          {errors.pricePerUnit && <p className="text-red-600 text-xs  font-bold">{errors.pricePerUnit.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="Add description..."
            {...register('description')}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-orange-600 shadow-md uppercase tracking-wider text-sm duration-500 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Adding...' : 'Add Ingredient'}
        </button>
      </form>
    </div>
  )
}