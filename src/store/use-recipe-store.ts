import { createRecipe } from '@/actions/recipe/create-recipe'
import { deleteRecipe } from '@/actions/recipe/delete-recipe'
import { getRecipes } from '@/actions/recipe/get-recipes'
import { updateRecipe } from '@/actions/recipe/update-recipe'
import { IRecipe, IRecipeFormData } from '@/types/recipe'
import { create } from 'zustand'

interface IActionResult {
	success: boolean;
	recipe?: IRecipe;
	error?: string
}

interface IRecipeState {
	recipes: IRecipe[];
	isLoading: boolean;
	error: string | null; 
	loadRecipes: () => Promise<void>;
	addRecipe: (formData: IRecipeFormData) => Promise<IActionResult>;
	updateRecipe: (id: string, formData: IRecipeFormData) => Promise<IActionResult>;
	removeRecipe: (id: string) => Promise<void>
}

export const useRecipeStore = create<IRecipeState>((set) => ({
	recipes: [],
	isLoading: false,
	error: null,
	loadRecipes: async () => {
		set({ isLoading: true, error: null })
		 
		try {
			const result = await getRecipes()

			if (result.success) {
				set({ recipes: result.recipes, isLoading: false })
			} else {
				set({ error: result.error, isLoading: false,  })
			}
		} catch(error) {
			console.error("Error: ", error)
			set({ error: "Error loading recipes", isLoading: false })
		}
	},
	addRecipe: async (data: IRecipeFormData) => {
		set({ isLoading: true, error: null })

		try {
			const result = await createRecipe(data)

			if (result.success) {
				set((state) => ({
					isLoading: false,
					recipes: [...state.recipes, result.recipe!],
				}))
				return { success: true, recipe: result.recipe }
			} else {
				set({ error: result.error, isLoading: false })
				return { success: false, error: result.error }
			}

		} catch(error) {
			console.error("Error: ", error)
			set({ isLoading: false, error: "Error adding recipe" })
			return { success: false, error: "Error adding recipe" }
		}
	},
	updateRecipe: async (id: string, formData: IRecipeFormData) => {
		set({ isLoading: true, error: null })

		try {
			const result = await updateRecipe(id, formData)
			
			if (result.success) {
				set((state) => ({
					recipes: state.recipes.map((recipe) => 
						recipe.id === id ? result.recipe! : recipe
					),
					isLoading: false
				}))
				return { success: true, recipe: result.recipe }
			} else {
				set({ isLoading: false, error: result.error })
				return { success: false, error: result.error }
			}
		} catch(error) {
			console.error("Error: ", error)
			set({ error: "Error updating recipe", isLoading: false })
			return { success: false, error: "Error updating recipe" }
		}
	},
	removeRecipe: async (id: string) => {
		set({ isLoading: true, error: null })

		try {
			const result = await deleteRecipe(id)

			if (result.success) {
				set((state) => ({
					recipes: state.recipes.filter((recipe) => recipe.id !== id),
					isLoading: false
				}))			
			} else {
				set({ isLoading: false, error: result.error})
			}

		} catch(error) {
			console.error("Error: ", error)
			set({ isLoading: false, error: "Error deleting recipe" })
		}
	}
}))