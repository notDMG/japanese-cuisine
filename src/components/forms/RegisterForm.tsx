'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerFormSchema, type RegisterFormInput } from '@/schema/register'
import Logo from '@/components/UI/Logo'
import { toast } from 'sonner'
import registerUser from '@/actions/auth/register-user'
import type { ActionResult } from '@/types/action-result'

interface RegisterProps {
  onClose?: () => void
}

export default function RegisterForm({ onClose }: RegisterProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<RegisterFormInput> = async (
    data: RegisterFormInput
  ) => {
    const { confirmPassword, ...payload } = data
    const result: ActionResult = await registerUser(payload)

    if ('error' in result) {
      toast.error(result.error, {
        duration: 6000,
        icon: '💢',
      })
      return
    }

    reset()
    if (onClose) onClose()

    toast.success(`You are welcome!`, {
      description:
        'Your account has been created. Start your culinary journey!',
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

        <div>
          <label className="mb-1 block text-[14px] text-black">
            Confirm password
          </label>
          <input
            type="password"
            className="transition-color w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black duration-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs font-bold text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg border-2 border-orange-400 px-4 py-2 font-bold text-black shadow-md transition-all duration-200 hover:bg-orange-400 hover:text-white disabled:opacity-50"
          >
            {isSubmitting ? 'LOADING...' : 'SIGN UP'}
          </button>
        </div>
      </form>
    </div>
  )
}
