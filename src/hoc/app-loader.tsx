'use client'
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from '@/store/ingredient.store'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
  children: React.ReactNode
}

export const AppLoader = ({children}: IProps) => {
  const { data: session, status } = useSession();
  const { setAuthState, isAuth } = useAuthStore();
  const { loadIngredients } = useIngredientStore()

  useEffect(() => {
    setAuthState(status, session)
  }, [status, session, setAuthState])

  useEffect(() => {
    if (isAuth) {
      loadIngredients()
    }
  }, [isAuth, loadIngredients])
  
  return <>{children}</>
}