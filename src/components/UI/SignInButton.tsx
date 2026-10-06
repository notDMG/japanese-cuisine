'use client'

import LoginPage from '@/components/forms/LoginForm'
import { useState } from 'react'
import Modal from './common/Modal'

export function SignInButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-22 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-orange-600"
      >
        Log in
      </button>

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <LoginPage
            onClose={() => {
              setIsModalOpen(false)
            }}
          />
        </Modal>
      )}
    </>
  )
}
