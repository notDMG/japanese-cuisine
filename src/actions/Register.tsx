'use server'
import {IForm} from '@/types/form-data'
import { prisma } from '@/utils/prisma'

export default async function registerUser(form: IForm) {
  const { email, password, confirmPassword } = form
   
  if (password !== confirmPassword) {
    throw new Error('Пароли не совпадают')
  }
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })
  
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует')
  }
  
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: password 
      }
    })
    
    console.log('Пользователь создан:', user)
    return user
    
  } catch (error) { 
    throw new Error(`Ошибка регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}