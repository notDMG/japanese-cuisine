'use server'

import { prisma } from '@/utils/prisma'
import { saltAndHashPassword } from '@/utils/password'
import { IFormUser } from '@/types/user-form-data'
import { ActionResult } from '@/types/action-result'

export default async function registerUser(
  form: IFormUser
): Promise<ActionResult> {
  const { email, password } = form

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
