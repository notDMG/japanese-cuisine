import { createIngredient } from '@/actions/createIngredient'
import { deleteIngredient } from '@/actions/deleteIngredient'
import { getIngredient } from '@/actions/getIngredient'
import { IIngredientFormData } from '@/forms/ingredient.form'
import { IIngredient } from '@/types/ingredient'
import { create } from 'zustand'

interface IIngredientStore {
	ingredients: IIngredient[];
	isLoading: boolean;
	error: string | null;
	loadIngredients: () => Promise<void>;
	addIngredient: (data: IIngredientFormData) => Promise<void>;
	removeIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IIngredientStore>((set) => ({
	ingredients: [],
	isLoading: false,
	error: null,

	loadIngredients: async () => {
		set({ isLoading: true, error: null })
		
		try {
			const result = await getIngredient()
			
			if (result.success) {
				set({ ingredients: result.ingredients, isLoading: false })
			} else {
				set({ error: result.error, isLoading: false })
			}
		} catch(error) {
			console.error("error", error)
			set({ error: "Error loading ingredient", isLoading: false })
		}
	},
		addIngredient: async (data: IIngredientFormData) => {
			set({ isLoading: true, error: null })

			try {
				const result = await createIngredient(data)
				
				if (result.success && result.ingredient) {
					set((state) => ({
						ingredients: [...state.ingredients, result.ingredient],
						isLoading: false
					}))
				} else {
					set({ error: result.error, isLoading: false })
				}
			} catch(error) {
				console.error("error", error)
				set({ error: "Error loading ingredient", isLoading: false })
			}
		},
		removeIngredient: async (id: string) => {
			set({ isLoading: true, error: null })

			try {
				const result = await deleteIngredient(id)

				if (result.success) {
					set((state) => ({
						ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
						isLoading: false
					}))
				} else {
					set({ error: result.error, isLoading: false })
				}
			} catch(error) {
				console.error("error", error)
				set({ error: "Error loading ingredient", isLoading: false })
			}
		}
}))