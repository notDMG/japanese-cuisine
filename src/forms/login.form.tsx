'use client';

import Logo from '@/components/UI/Logo';
import { signInCredentials } from '@/actions/signIn';
import { SubmitHandler, useForm } from 'react-hook-form'
import { IForm } from '@/types/form-data'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null)

  const { 
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors} 
    } = useForm<IForm>({
      mode: 'onBlur',
    })

    useEffect(() => {
      if (isSubmitSuccessful) return reset()
    }, [reset, isSubmitSuccessful])

    const onSubmit: SubmitHandler<IForm> = async (data: IForm): Promise<void> => {
      const { email, password } = data

      const result = await signInCredentials({ email, password })
      if (result?.error ) {
        setLoginError(result.error)
        return
      }
    }

  return (
      <div className='w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg'>
        <Logo/>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-4'>
          <div>
           <label className='block text-black mb-1 text-[14px]'>Email</label> 
           <input 
            type="email"
            required
            title=''
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
            {...register('email', {
              required: 'Please enter your email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address'
              }
            })}
          />
          { errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p> }
          </div>

          <div>
            <label className='block text-black mb-1 text-[14px]'>Password</label> 
            <input
              type="password"
              required
              title=''
              className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
              {...register('password', {
              required: 'Please enter a password',
              minLength: {
                value: 6, 
                message: 'Password must be at least 6 characters long'
              },
              maxLength: {
                value: 20,
                message: 'Password can be a maximum of 20 characters long'
              },
              pattern: {
                value: /[a-zA-Zа-яА-ЯёЁ]/,
                message: 'Password must contain at least one letter'
              }
            })}
            />
            { errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p> }
          </div>

        <div className='flex flex-col items-center gap-1'>
          <button
            type='submit'
            className='px-4 py-2 font-bold rounded-lg border-2 border-orange-400 text-black hover:bg-orange-400 hover:text-white transition-all duration-200 shadow-md'>
              {isSubmitting ? 'LOADING...' : 'LOG IN'}
          </button>
          <p className="text-red-500 text-xs font-bold">{loginError}</p>
        </div>

        </form>
      </div>
  );
}