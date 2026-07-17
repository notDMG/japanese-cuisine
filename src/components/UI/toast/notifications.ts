import { Notyf } from 'notyf'

let notyfInstance: Notyf | null = null

export const getNotyf = () => {
	if (typeof window !== 'undefined' && !notyfInstance) {
		notyfInstance = new Notyf({
			duration: 2000, 
			position: { x: 'center', y: 'top' }
		})
	}
	return notyfInstance
}

export const notyf = {
	success: (msg: string) => getNotyf()?.success(msg),
	error: (msg: string) => getNotyf()?.error(msg)
}
