import { create } from 'zustand'
import { createRecipe } from '@/actions/recipe/create-recipe'
import { deleteRecipe } from '@/actions/recipe/delete-recipe'
import { getRecipes } from '@/actions/recipe/get-recipes'
import { updateRecipe } from '@/actions/recipe/update-recipe'
import type { RecipeInput } from '@/schema/recipe'
import type { Recipe } from '@/generated/prisma'

type RecipeWithIngredients = Exclude<
  Awaited<ReturnType<typeof getRecipes>>,
  { error: string }
>['recipes'][number]

type RecipeActionResult =
  { success: true; recipe: Recipe } | { success: false; error: string }

interface IRecipeState {
  recipes: RecipeWithIngredients[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  loadRecipes: () => Promise<void>
  addRecipe: (formData: RecipeInput) => Promise<RecipeActionResult>
  updateRecipe: (
    id: string,
    formData: RecipeInput
  ) => Promise<RecipeActionResult>
  removeRecipe: (id: string) => Promise<void>
}

export const useRecipeStore = create<IRecipeState>((set) => ({
  recipes: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  loadRecipes: async () => {
    set({ isLoading: true, error: null })

    try {
      const result = await getRecipes()

      if ('success' in result) {
        set({
          recipes: result.recipes,
          isLoading: false,
          hasLoaded: true,
        })
      } else {
        set({ error: result.error, isLoading: false, hasLoaded: true })
      }
    } catch (error) {
      console.error('Error: ', error)
      set({
        error: 'Error loading recipes',
        isLoading: false,
        hasLoaded: true,
      })
    }
  },

  addRecipe: async (data) => {
    set({ isLoading: true, error: null })

    try {
      const result = await createRecipe(data)

      if ('success' in result) {
        const reloadResult = await getRecipes()
        if ('success' in reloadResult) {
          set({
            recipes: reloadResult.recipes,
            isLoading: false,
          })
        } else {
          set({ error: reloadResult.error, isLoading: false })
        }
        return { success: true, recipe: result.recipe }
      } else {
        set({ error: result.error, isLoading: false })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error: ', error)
      set({ isLoading: false, error: 'Error adding recipe' })
      return { success: false, error: 'Error adding recipe' }
    }
  },

  updateRecipe: async (id, formData) => {
    set({ isLoading: true, error: null })

    try {
      const result = await updateRecipe(id, formData)

      if ('success' in result) {
        const reloadResult = await getRecipes()
        if ('success' in reloadResult) {
          set({
            recipes: reloadResult.recipes,
            isLoading: false,
          })
        } else {
          set({ error: reloadResult.error, isLoading: false })
        }
        return { success: true, recipe: result.recipe }
      } else {
        set({ isLoading: false, error: result.error })
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error: ', error)
      set({ error: 'Error updating recipe', isLoading: false })
      return { success: false, error: 'Error updating recipe' }
    }
  },

  removeRecipe: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const result = await deleteRecipe(id)

      if ('success' in result) {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false, error: result.error })
      }
    } catch (error) {
      console.error('Error: ', error)
      set({ isLoading: false, error: 'Error deleting recipe' })
    }
  },
}))
