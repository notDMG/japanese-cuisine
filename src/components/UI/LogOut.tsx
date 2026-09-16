'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LogOut() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.refresh()

      toast.success('You have logged out of your account', {
        duration: 4000,
        icon: '💮',
      })
    } catch (error) {
      toast.error('Error on exit', { duration: 6000, icon: '💢' })
      console.error('Ошибка при выходе:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="transition-color rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm duration-300 hover:bg-orange-400 hover:text-white hover:shadow"
    >
      Log out
    </button>
  )
}
