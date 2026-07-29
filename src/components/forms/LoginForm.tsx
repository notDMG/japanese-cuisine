'use client'

import { signInCredentials } from '@/actions/auth/sign-in'
import Logo from '@/components/UI/Logo'
import { IFormUser } from '@/types/user-form-data'
import { SubmitHandler, useForm } from 'react-hook-form'
import { notyf } from '../UI/toast/notifications'
import { getSession } from 'next-auth/react'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'

interface LoginProps {
	onClose?: () => void
}

export default function LoginPage({ onClose }: LoginProps) {
	const {setAuthState} = useAuthStore()
	const router = useRouter()
	
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors }
	} = useForm<IFormUser>({
		mode: 'onBlur'
	})


	const onSubmit: SubmitHandler<IFormUser> = async (
		data: IFormUser
	): Promise<void> => {
		const dataClone = {
			email: String(data.email).trim(),
			password: String(data.password).trim()
		}
		
		const result = await signInCredentials(dataClone)
		if (result?.error) {
			notyf.error(result.error)
			return
		}

		const updatedSession = await getSession()
		setAuthState('authenticated', updatedSession)
		router.refresh()

		reset()
		if (onClose) onClose()
		notyf.success('Welcome back!')
	}

	return (
		<div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
			<Logo />

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="space-y-4"
			>
				<div>
					<label className="block text-black mb-1 text-[14px]">Email</label>
					<input
						type="email"
						required
						title=""
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm"
						{...register('email', {
							required: 'Please enter your email',
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: 'Invalid email address'
							}
						})}
					/>
					{errors.email && (
						<p className="text-red-500 text-xs font-bold">
							{errors.email.message}
						</p>
					)}
				</div>

				<div>
					<label className="block text-black mb-1 text-[14px]">Password</label>
					<input
						type="password"
						required
						title=""
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-color duration-200 text-black text-sm"
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
					{errors.password && (
						<p className="text-red-500 text-xs font-bold">
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="flex flex-col items-center gap-1">
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 font-bold rounded-lg border-2 border-orange-400 text-black hover:bg-orange-400 hover:text-white transition-all duration-200 shadow-md"
					>
						{isSubmitting ? 'LOADING...' : 'LOG IN'}
					</button>
				</div>
			</form>
		</div>
	)
}
