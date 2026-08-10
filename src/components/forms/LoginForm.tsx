'use client'

import { signInCredentials } from '@/actions/auth/sign-in'
import Logo from '@/components/UI/Logo'
import { IFormUser } from '@/types/user-form-data'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getSession } from 'next-auth/react'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'

interface LoginProps {
  onClose?: () => void
}

export default function LoginPage({ onClose }: LoginProps) {
  const { setAuthState } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IFormUser>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<IFormUser> = async (
    data: IFormUser
  ): Promise<void> => {
    const dataClone = {
      email: String(data.email).trim(),
      password: String(data.password).trim(),
    }

    const result = await signInCredentials(dataClone)
    if (result?.error) {
      toast.error(result.error, {
        duration: 6000,
        icon: '💢',
      })
      return
    }

    const updatedSession = await getSession()
    setAuthState('authenticated', updatedSession)
    router.refresh()

    reset()
    if (onClose) onClose()
    toast.success(`Welcome back!`, {
      description: 'Great to see you again. What are we cooking today?',
      duration: 4000,
      icon: '💮',
    })
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <Logo />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1 block text-[14px] text-black">Email</label>
          <input
            type="email"
            required
            title=""
            className="transition-color w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black duration-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('email', {
              required: 'Please enter your email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-xs font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[14px] text-black">Password</label>
          <input
            type="password"
            required
            title=""
            className="transition-color w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black duration-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('password', {
              required: 'Please enter a password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 20,
                message: 'Password can be a maximum of 20 characters long',
              },
              pattern: {
                value: /[a-zA-Zа-яА-ЯёЁ]/,
                message: 'Password must contain at least one letter',
              },
            })}
          />
          {errors.password && (
            <p className="text-xs font-bold text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg border-2 border-orange-400 px-4 py-2 font-bold text-black shadow-md transition-all duration-200 hover:bg-orange-400 hover:text-white"
          >
            {isSubmitting ? 'LOADING...' : 'LOG IN'}
          </button>
        </div>
      </form>
    </div>
  )
}
