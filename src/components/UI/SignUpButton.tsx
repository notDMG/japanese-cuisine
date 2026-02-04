import { useState } from "react"
import Modal from "./modal/Modal"
import LoginPage from "@/form/login.form"

export default function SignUpButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <>
      <button
        type='button'
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200">
          Log in
      </button>



      {isModalOpen && (
      <Modal 
        onClose={() => {
          setIsModalOpen(false)
        }}>
        <LoginPage/>
      </Modal>
      )}
    </>
  )
}