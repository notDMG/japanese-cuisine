'use server'

import { signIn } from '@/auth/auth'
import type { ActionResult } from '@/types/action-result'
import { signInSchema } from '@/schema/sign-in'

export async function signInCredentials(form: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(form)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input data'
    return { error: firstError }
  }

  const { email, password } = parsed.data

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
