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
				className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-orange-400 hover:text-white transition-color duration-400 shadow-sm hover:shadow"
			>
				Sign up
			</button>

			{isModalOpen && (
				<Modal
					onClose={() => {
						setIsModalOpen(false)
					}}
				>
					<RegisterForm />
				</Modal>
			)}
		</>
	)
}
