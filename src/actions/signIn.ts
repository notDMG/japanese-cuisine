'use server'
import { signIn } from "@/auth/auth"
import { IForm } from "@/types/form-data"

export async function signInCredentials({ email, password }: Pick<IForm, 'email' | 'password'>) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false 
    });

    if (result?.error) {
       return { error: "Неверный логин или пароль" };
    }

    return { success: true };
  } catch (error) {
    console.error('Authorization error', error);
    return { error: "Произошла ошибка при входе" };
  }
}