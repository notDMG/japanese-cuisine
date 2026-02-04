'use server'
import { IForm } from '@/types/form-data'
import { saltAndHashPassword } from '@/utils/password'
import { prisma } from '@/utils/prisma'

export default async function registerUser(form: IForm) {
  const { email, password, confirmPassword } = form;

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают' };
  }

  if (password.length < 6)  return { error: 'Пароль должен содеражать не менее 6 символов' }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' };
    }

    const pwHash = await saltAndHashPassword(password);
    
    await prisma.user.create({
      data: {
        email: email,
        password: pwHash 
      }
    });
    
    return { success: true };
    
  } catch (error) { 
    console.error('Registration error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Произошла непредвиденная ошибка' 
    };
  }
}