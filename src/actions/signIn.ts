import { signIn } from "@/auth/auth"
import { IForm } from "@/types/form-data"

export async function signInCredentials({email, password}: IForm) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })
    return result
  } catch (error) {
    console.error('Authorization error', error)
    throw error
  }
}