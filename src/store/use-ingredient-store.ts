import { createIngredient } from '@/actions/ingredient/create-ingredient'
import { deleteIngredient } from '@/actions/ingredient/delete-ingredient'
import { getIngredients } from '@/actions/ingredient/get-ingredients'
import { Ingredient } from '@/generated/prisma'
import { IngredientInput } from '@/schema/ingredient'
import { ActionIngredientResult } from '@/types/action-result'
import { create } from 'zustand'

interface IIngredientStore {
  ingredients: Ingredient[]
  isLoading: boolean
  isAdding: boolean
  deletingId: string | null
  hasLoaded: boolean
  error: string | null
  clearError: () => void
  reset: () => void
  loadIngredients: () => Promise<void>
  addIngredient: (data: IngredientInput) => Promise<ActionIngredientResult>
  removeIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IIngredientStore>((set) => ({
  ingredients: [],
  isLoading: false,
  isAdding: false,
  deletingId: null,
  hasLoaded: false,
  error: null,

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ingredients: [],
      isLoading: false,
      isAdding: false,
      deletingId: null,
      hasLoaded: false,
      error: null,
    }),

  loadIngredients: async () => {
    set({ isLoading: true, error: null })

    try {
      const result = await getIngredients()

      if ('success' in result) {
        set({
          ingredients: result.ingredients,
          isLoading: false,
          hasLoaded: true,
        })
      } else {
        set({ error: result.error, isLoading: false, hasLoaded: true })
      }
    } catch (error) {
      console.error('error', error)
      set({
        error: 'Error loading ingredient',
        isLoading: false,
        hasLoaded: true,
      })
    }
  },

  addIngredient: async (data: IngredientInput) => {
    set({ isAdding: true, error: null })
    try {
      const result = await createIngredient(data)
      if ('success' in result && result.ingredient) {
        set((state) => ({
          ingredients: [result.ingredient!, ...state.ingredients],
          isAdding: false,
        }))
        return { success: true, ingredient: result.ingredient }
      }

      set({ isAdding: false })
      return {
        success: false,
        error: 'error' in result ? result.error : 'Error adding ingredient',
      }
    } catch (error) {
      console.error('error', error)
      set({ isAdding: false })
      return { success: false, error: 'Error adding ingredient' }
    }
  },

  removeIngredient: async (id: string) => {
    set({ deletingId: id, error: null })

    try {
      const result = await deleteIngredient(id)

      if ('success' in result) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
          deletingId: null,
        }))
      } else {
        set({ error: result.error, deletingId: null })
      }
    } catch (error) {
      console.error('error', error)
      set({ error: 'Error removing ingredient', deletingId: null })
    }
  },
}))
