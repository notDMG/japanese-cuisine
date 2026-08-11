'use server'

import { prisma } from '@/utils/prisma'
import { saltAndHashPassword } from '@/utils/password'
import { registerFieldsSchema } from '@/schema/register'
import type { ActionResult } from '@/types/action-result'

export default async function registerUser(
  form: unknown
): Promise<ActionResult> {
  const parsed = registerFieldsSchema
    .pick({ email: true, password: true })
    .safeParse(form)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input data'
    return { error: firstError }
  }

  const { email, password } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'A user with this email already exists' }
    }

    const pwHash = await saltAndHashPassword(password)

    await prisma.user.create({
      data: {
        email,
        password: pwHash,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
