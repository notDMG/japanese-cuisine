'use client'

import { signOutFunc } from '@/actions/auth/sign-out'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LogOut() {
	const router = useRouter()
	const setAuthState = useAuthStore(state => state.setAuthState)

	const handleLogout = async () => {
		try {
			await signOutFunc()
			setAuthState('unauthenticated', null)
			router.refresh()
			toast.success('You have logged out of your account', {
				duration: 4000,
				icon: '💮'
			})
		} catch (error) {
			toast.error('Error on exit', {
				duration: 6000,
				icon: '💢'
			})
			console.error('Ошибка при выходе:', error)
		}
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-400 hover:text-white transition-color duration-300 shadow-sm hover:shadow"
		>
			Log out
		</button>
	)
}
