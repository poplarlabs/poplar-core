import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RootBalance } from './RootBalance'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-[#556B2F] font-medium' : 'text-gray-600 hover:text-[#556B2F]';
  };

  return (
    <header className="sticky top-0 bg-[#F7F7F2]/95 backdrop-blur-sm z-50 h-16">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <img src="/images/logo-transparent.png" alt="Poplar Labs" className="h-8 w-8" />
                <span className="text-2xl font-bold text-[#556B2F]">Poplar Labs</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors`}>
              Submit Property
            </Link>
            <Link to="/properties" className={`${isActive('/properties')} transition-colors`}>
              View Properties
            </Link>
            <Link to="/request-validation" className={`${isActive('/request-validation')} transition-colors`}>
              Request Validation
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <RootBalance />
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
