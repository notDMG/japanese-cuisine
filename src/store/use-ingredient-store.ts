import { createIngredient } from '@/actions/ingredient/create-ingredient'
import { deleteIngredient } from '@/actions/ingredient/delete-ingredient'
import { getIngredients } from '@/actions/ingredient/get-ingredients'
import { Ingredient } from '@/generated/prisma'
import { IngredientInput } from '@/schema/ingredient'
import { create } from 'zustand'

interface IIngredientStore {
  ingredients: Ingredient[]
  isLoading: boolean
  error: string | null
  loadIngredients: () => Promise<void>
  addIngredient: (data: IngredientInput) => Promise<void>
  removeIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IIngredientStore>((set) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  loadIngredients: async () => {
    set({ isLoading: true, error: null })

    try {
      const result = await getIngredients()

      if ('success' in result) {
        set({ ingredients: result.ingredients, isLoading: false })
      } else {
        set({ error: result.error, isLoading: false })
      }
    } catch (error) {
      console.error('error', error)
      set({ error: 'Error loading ingredient', isLoading: false })
    }
  },
  addIngredient: async (data: IngredientInput) => {
    set({ isLoading: true, error: null })

    try {
      const result = await createIngredient(data)

      if ('success' in result && result.ingredient) {
        set((state) => ({
          ingredients: [...state.ingredients, result.ingredient],
          isLoading: false,
        }))
      } else if ('error' in result) {
        set({ error: result.error, isLoading: false })
      }
    } catch (error) {
      console.error('error', error)
      set({ error: 'Error loading ingredient', isLoading: false })
    }
  },
  removeIngredient: async (id: string) => {
    set({ isLoading: true, error: null })

    try {
      const result = await deleteIngredient(id)

      if ('success' in result) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
          isLoading: false,
        }))
      } else {
        set({ error: result.error, isLoading: false })
      }
    } catch (error) {
      console.error('error', error)
      set({ error: 'Error loading ingredient', isLoading: false })
    }
  },
}))
