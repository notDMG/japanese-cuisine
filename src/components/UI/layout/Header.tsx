'use client'
import Link from 'next/link';
import { SiteConf } from '@/config/site.conf';
import  Menu  from '@/components/UI/Menu'
import { useState } from 'react';
import SignUpButton from '../SignUpButton';
import RegisterButton from '../RegistrButton';
import Logo from '../Logo';
import { useSession } from 'next-auth/react';
import { LogOut } from '../LogOut';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const {data: session, status} = useSession();

  const isAuth = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <Logo/>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {SiteConf.navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {!isAuth ? 
            <div className="hidden md:flex items-center space-x-4">
              <SignUpButton />
              <RegisterButton />
            </div> 
          : <div className="hidden md:flex items-center space-x-4"> 
              <LogOut />
            </div>}

          <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div> 
    </div>
  </header>
  );
}