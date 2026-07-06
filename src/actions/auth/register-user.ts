'use server'
import { IForm } from '@/types/form-data'
import { saltAndHashPassword } from '@/utils/password'
import { prisma } from '@/utils/prisma'

export default async function registerUser(form: IForm) {
  const { email, password, confirmPassword } = form;

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 6)  return { error: 'The password must contain at least 6 characters' }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return { error: 'A user with this email already exists' };
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
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}