'use client'
import Menu from '@/components/UI/Menu'
import { siteConf } from '@/config/site.conf'
import { useAuthStore } from '@/store/use-auth-store'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '../Logo'
import { LogOut } from '../LogOut'
import RegisterButton from '../RegisterButton'
import SignUpButton from '../SignUpButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { isAuth, status } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden items-center space-x-12 md:flex">
            {siteConf.navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-orange-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden h-9 min-w-42.5 items-center justify-end md:flex">
            {status === 'loading' ? (
              <div className="mr-8 hidden h-5 w-5 animate-spin rounded-full border-3 border-solid border-orange-600 border-t-transparent md:block"></div>
            ) : !isAuth ? (
              <div className="hidden items-center space-x-4 md:flex">
                <SignUpButton />
                <RegisterButton />
              </div>
            ) : (
              <div className="hidden items-center space-x-4 md:flex">
                <LogOut />
              </div>
            )}
          </div>

          <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  )
}
