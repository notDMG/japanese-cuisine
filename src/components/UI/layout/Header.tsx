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
		<header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/95">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link href="/">
						<Logo />
					</Link>

					<nav className="hidden md:flex items-center space-x-12">
						{siteConf.navItems.map(item => (
							<Link
								key={item.label}
								href={item.href}
								className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="hidden md:flex items-center justify-end min-w-42.5 h-9">
						{status === 'loading' ? (
							<div className="hidden md:block h-5 w-5 animate-spin rounded-full border-3 border-solid border-orange-600 border-t-transparent mr-8"></div>
						) : !isAuth ? (
							<div className="hidden md:flex items-center space-x-4">
								<SignUpButton />
								<RegisterButton />
							</div>
						) : (
							<div className="hidden md:flex items-center space-x-4">
								<LogOut />
							</div>
						)}
					</div>

					<Menu
						isMenuOpen={isMenuOpen}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</div>
			</div>
		</header>
	)
}
