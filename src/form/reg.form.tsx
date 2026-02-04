'use client';

import Logo from '@/components/UI/Logo';
import { useState } from 'react';
import registerUser from '@/actions/register';
import { useRouter } from 'next/navigation'; // Для перенаправления

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Вызов серверного экшена
    const result = await registerUser(form);

    // Если сервер вернул ошибку
    if (result?.error) {
      alert(result.error);
      return;
    }

    // Если регистрация прошла успешно
    if (result?.success) {
      alert("Регистрация успешно завершена!");
      router.push('/login'); // Перенаправляем на страницу входа
    }
  };

  return (
    <div className='w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg'>
      <Logo/>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Поля ввода остаются без изменений */}
        <div>
          <label className='block text-black mb-1 text-[14px]'>Email</label> 
          <input 
            name='email'
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
          />
        </div>

        <div>
          <label className='block text-black mb-1 text-[14px]'>Password</label> 
          <input 
            name='password'
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
          />
        </div>

        <div>
          <label className='block text-black mb-1 text-[14px]'>Confirm password</label> 
          <input 
            name='confirmPassword'
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
          />
        </div>

        <div className='flex justify-center'>
          <button
            type='submit'
            className='px-4 py-2 font-bold rounded-lg border-2 border-orange-400 text-black hover:bg-orange-400 hover:text-white transition-all duration-200 shadow-md'>
              SIGN UP
          </button>
        </div>
      </form>
    </div>
  );
}