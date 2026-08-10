'use client'

import { signInCredentials } from '@/actions/auth/sign-in'
import Logo from '@/components/UI/Logo'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getSession } from 'next-auth/react'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@/schema/sign-in'

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
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    const result = await signInCredentials(data)

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

    toast.success('Welcome back!', {
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
            className="transition-color w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black duration-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('email')}
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
            className="transition-color w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black duration-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('password')}
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
