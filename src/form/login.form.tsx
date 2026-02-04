'use client';
import { useState } from 'react';
import Logo from '@/components/UI/Logo';
import { signInCredentials } from '@/actions/signIn';

export default function LoginPage() {
  const [form, setForm] = useState({ 
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = form;
    const result = await signInCredentials({ email, password });

    console.log('result', result)
    console.log('Form submitted:', form);
  };

  return (
      <div className='w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg'>
        <Logo/>
        
        <form onSubmit={handleSubmit} className='space-y-4 fle'>
          <div>
           <label className='block text-black mb-1 text-[14px]'>Email</label> 
           <input 
            name='email'
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            title=''
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
              title=''
              className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm'
            />
          </div>

        <div className='flex justify-center'>
          <button
            type='submit'
            className='px-4 py-2 font-bold rounded-lg border-2 border-orange-400 text-black hover:bg-orange-400 hover:text-white transition-all duration-200 shadow-md'>
              Log in
          </button>
        </div>

        </form>
      </div>
  );
}