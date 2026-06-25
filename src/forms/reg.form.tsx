'use client';

import Logo from '@/components/UI/Logo';
import registerUser from '@/actions/register';
import { SubmitHandler, useForm } from 'react-hook-form'
import { IForm } from '@/types/form-data'
import { useEffect, useState } from 'react' 

export default function RegisterForm() {
  const [signInResult, setSignInResult] = useState<null | string>(null)
  const { register, handleSubmit, reset, getValues, formState: { isSubmitSuccessful, isSubmitting, errors }} = useForm<IForm>({
    mode: 'onBlur', 
  })

  useEffect(() => {
    if (isSubmitSuccessful) return reset()
  }, [reset, isSubmitSuccessful])

  const onSubmit: SubmitHandler<IForm> = async (data: IForm): Promise<void> => {
    setSignInResult(null)

    const result = await registerUser(data);

    if (result?.error) {
      setSignInResult(result.error)
      return;
    }

    if (result?.success) {
      alert("Регистрация успешно завершена!");
    }
  };

  return (
    <div className='w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg'>
      <Logo/>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-4'>
        <div>
          <label className='block text-black mb-1 text-[14px]'>Email</label> 
          <input
            type="email"
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Некорректный email'
              }
            })}
          />
          { errors.email && <p className="text-red-500 text-xs font-bold">
            {errors.email.message}
          </p> }
        </div>

        <div>
          <label className='block text-black mb-1 text-[14px]'>Password</label> 
          <input 
            type="password"
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 6, 
                message: 'Пароль должен содержать минимум 6 символов'
              },
              maxLength: {
                value: 20,
                message: 'Пароль может содержать максимум 20 символов'
              },
              pattern: {
                value: /[a-zA-Zа-яА-ЯёЁ]/,
                message: 'Пароль должен иметь хотя бы одну букву'
              }
            })}
          />
          { errors.password && <p className="text-red-500 text-xs font-bold">
            {errors.password.message}
          </p> }
        </div>

        <div>
          <label className='block text-black mb-1 text-[14px]'>Confirm password</label> 
          <input 
            type="password"
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
            {...register('confirmPassword', {
              required: 'Повторите пароль',
              validate: (value) => {
                return value === getValues('password') || 'Пароли не совпадают'
              }
            })}
          />
          { errors.confirmPassword && <p className="text-red-500 text-xs font-bold">
            {errors.confirmPassword.message}
          </p> }
        </div>

        <div className='flex flex-col items-center gap-1'>
          <button
            type='submit'
            className='px-4 py-2 font-bold rounded-lg border-2 border-orange-400 text-black hover:bg-orange-400 hover:text-white transition-all duration-200 shadow-md'>
              { isSubmitting ? 'LOADING...' : 'SIGN UP'}    
          </button>
          <p className="text-red-500 text-xs font-bold">{signInResult}</p>
        </div>
      </form>
    </div>
  );
}