import { SiteConf } from "@/config/site.conf";
import Link from "next/link";

export default function Menu({ 
  isMenuOpen, 
  setIsMenuOpen 
}: { 
  isMenuOpen: boolean; 
  setIsMenuOpen: (value: boolean) => void 
}) {
  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-50"
      >
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 border border-gray-100 bg-white rounded-lg shadow-lg py-4">
          <div className="flex flex-col space-y-2 px-4">
            {SiteConf.navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              <Link
                href="/login"
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-3 text-base font-medium text-center text-gray-700 bg-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}