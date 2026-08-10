import RegisterForm from '@/components/forms/RegisterForm'
import { useState } from 'react'
import Modal from './common/Modal'

export default function RegisterButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="transition-color rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm duration-400 hover:bg-orange-400 hover:text-white hover:shadow"
      >
        Sign up
      </button>

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <RegisterForm
            onClose={() => {
              setIsModalOpen(false)
            }}
          />
        </Modal>
      )}
    </>
  )
}
