import { createPortal } from 'react-dom' 
import { type ReactNode } from 'react'
import { useEffect } from 'react';

interface Props {
  children: ReactNode;
  onClose: () => void
}

export default function Modal({ children, onClose}: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])


return createPortal (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex
  items-center justify-center">
    <div className="relative w-[90%] max-w-sm bg-white/20 
    text-white p-3 rounded-2xl shadow-lg animate-fadeIn
    max-[320px]:top-2 max-[320px]:right-2 max-[320px]:w-64">
      <button
        onClick={onClose}
        className="absolute top-8 right-10
        text-black text-2xl
        hover:text-orange-600 transition"
        aria-label="Close modal"
        >
        ✕
        </button>
      {children}
    </div>
  </div>,
  document.body
)
}