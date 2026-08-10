'use server'
import { signIn } from '@/auth/auth'
import { IFormUser } from '@/types/user-form-data'

export async function signInCredentials({ email, password }: IFormUser) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Invalid email or password' }
    }

    return { success: true }
  } catch (error) {
    console.error('Authorization error', error)
    return { error: 'Invalid email or password' }
  }
}
