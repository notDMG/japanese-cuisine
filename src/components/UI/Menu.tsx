'use client'

import { siteConf } from '@/config/site.conf'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LogOut } from './LogOut'
import RegisterButton from './RegisterButton'
import { SignUpButton } from './SignUpButton'

export default function Menu({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean
  setIsMenuOpen: (value: boolean) => void
}) {
  const { status } = useSession()
  const pathname = usePathname()

  const isAuth = status === 'authenticated'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="rounded-md p-2 text-gray-700 hover:bg-gray-50 hover:text-orange-600"
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full right-0 left-0 rounded-lg border border-gray-300 bg-white py-4 shadow-lg">
          <div className="flex flex-col space-y-2 px-4">
            {siteConf.navItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'rounded-lg bg-gray-50 px-4 py-3 text-base font-semibold text-orange-600'
                      : 'rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-600'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}

            <div
              onClick={() => setIsMenuOpen(false)}
              className={isAuth ? '' : 'w-full'}
            >
              {isAuth ? (
                <div className="text-right">
                  <LogOut />
                </div>
              ) : (
                <div className="flex w-full flex-col space-y-3 rounded-lg border-gray-100 bg-gray-100 p-4">
                  <SignUpButton />
                  <RegisterButton />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
