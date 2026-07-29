"use client";

import { useRecipeStore } from '@/store/use-recipe-store';
import Link from "next/link";
import { useTransition } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/use-auth-store";
import { IRecipe } from '@/types/recipe';
import { UNIT_OPTIONS } from '@/constants/selectOptions'

interface RecipeCardProps {
  recipe: IRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { removeRecipe } = useRecipeStore();
  const { isAuth } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeRecipe(recipe.id);
      } catch (error) {
        console.error("Ошибка при удалении рецепта:", error);
      }
    });
  };

  const getUnitLabel = (unit: string) => {
    const unitOption = UNIT_OPTIONS.find(
      (option) => option.value === unit
    );
    return unitOption ? unitOption.label : unit.toLowerCase();
  };

  return (
    <div className="w-full min-w-63.5 max-w-md h-120 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      <div className="h-48 overflow-hidden p-4 pb-0">
        {recipe.imageUrl ? (
          <div className="relative h-full group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm font-semibold">No image</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-black px-8 pt-6">
        <h2 className="text-xl font-bold truncate">{recipe.name}</h2>
      </div>

      <div className="flex-1 text-black px-8 py-4 flex flex-col gap-3 overflow-hidden">
        <p className="text-gray-600 line-clamp-3 text-sm shrink-0">
          {recipe.description || "Без описания"}
        </p>
        
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-semibold mb-1 text-gray-700">Ingredients:</h3>
          <ul className="list-disc pl-5 overflow-y-auto pr-1 text-sm text-gray-600 space-y-1">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.ingredient.name}: {ing.quantity}{" "}
                {getUnitLabel(ing.ingredient.unit)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAuth && (
        <div className="flex justify-end gap-2 p-6 pt-0 mt-auto">
          <Link href={`/recipes/${recipe.id}`}>
            <button className="px-4 py-2 text-sm font-bold text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-300">
              Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-bold text-red-500 border border-transparent rounded-md hover:bg-red-50 transition-colors duration-300 disabled:text-gray-400"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}