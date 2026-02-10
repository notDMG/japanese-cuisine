'use server'
import { signOut } from "@/auth/auth"
import { useAuthStore } from "@/store/auth.store"

export async function signOutFunc() {
  const setAuthState = useAuthStore.getState().setAuthState;

  try {
    await signOut({ redirect: false })
    setAuthState('unauthenticated', null)
  } catch (error) {
    console.error('account logout error', error)
    throw error
  }
}