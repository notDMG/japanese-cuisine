'use client'

import { deleteIngredient } from '@/actions/ingredient/delete-ingredient'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
  id: string
  variant?: 'table' | 'card'
}

export function DeleteIngredientButton({ id, variant = 'card' }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteIngredient(id)

      if (result && 'error' in result) {
        toast.error(result.error, { duration: 6000, icon: '💢' })
        router.refresh()
      }
    })
  }

  const className =
    variant === 'card'
      ? 'flex h-10 w-full items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50'
      : 'rounded-xl px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50'

  return (
    <button className={className} onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
