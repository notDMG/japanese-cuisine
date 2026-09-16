'use client'

import { useIngredientStore } from '@/store/use-ingredient-store'
import { useRecipeStore } from '@/store/use-recipe-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface IProps {
  children: React.ReactNode
}

export const AppLoader = ({ children }: IProps) => {
  const { status } = useSession()

  const loadIngredients = useIngredientStore((s) => s.loadIngredients)
  const loadRecipes = useRecipeStore((s) => s.loadRecipes)
  const ingredientsLoaded = useIngredientStore((s) => s.hasLoaded)
  const recipesLoaded = useRecipeStore((s) => s.hasLoaded)
  const resetIngredients = useIngredientStore((s) => s.reset)
  const resetRecipes = useRecipeStore((s) => s.reset)

  useEffect(() => {
    if (status === 'authenticated') {
      if (!ingredientsLoaded) loadIngredients()
      if (!recipesLoaded) loadRecipes()
    }

    if (status === 'unauthenticated') {
      resetIngredients()
      resetRecipes()
    }
  }, [
    status,
    ingredientsLoaded,
    recipesLoaded,
    loadIngredients,
    loadRecipes,
    resetIngredients,
    resetRecipes,
  ])

  return <>{children}</>
}
