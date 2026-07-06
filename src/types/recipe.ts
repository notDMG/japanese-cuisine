import { IIngredient } from './ingredient'

export interface IRecipeIngredientInput {
	id: string;
	ingredientId: string;
	quantity: number;
	ingredient: IIngredient
}

export interface IRecipeFormData {
	id?: string;
	name: string;
	description: string;
	imageUrl?: string | null;
	ingredients: IRecipeIngredientInput[]
}