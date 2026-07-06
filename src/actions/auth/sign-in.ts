'use server'
import { signIn } from "@/auth/auth"
import { IForm } from "@/types/form-data"

export async function signInCredentials({ email, password }: IForm) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false 
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error('Authorization error', error);
    return { error: "Invalid email or password" };
  }
}