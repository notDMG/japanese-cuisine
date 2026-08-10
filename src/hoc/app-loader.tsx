'use client'
import { useAuthStore } from '@/store/use-auth-store'
import { useIngredientStore } from '@/store/use-ingredient-store'
import { useRecipeStore } from '@/store/use-recipe-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface IProps {
  children: React.ReactNode
}

export const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession()
  const { setAuthState, isAuth } = useAuthStore()
  const { loadIngredients } = useIngredientStore()
  const { loadRecipes } = useRecipeStore()

  useEffect(() => {
    setAuthState(status, session || null)
  }, [status, session, setAuthState])

  useEffect(() => {
    if (isAuth) {
      loadIngredients()
    }
  }, [isAuth, loadIngredients])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  return <>{children}</>
}
