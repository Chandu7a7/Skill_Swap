import React, { useState } from 'react';
import {
  User,
  Search,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../Auth/AuthModal';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthAction = () => {
    if (isAuthenticated) logout();
    else setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="./src/assids/Skillsawp.png"
                alt="SkillSwap Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-indigo-600 tracking-tight">SkillSwap</span>
            </a>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 text-sm"
                  placeholder="Search skills or users..."
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={handleAuthAction}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
              <button
  onClick={handleAuthAction}
  className="bg-gray-100 text-indigo-600 px-4 py-2 rounded-md text-sm font-medium 
             hover:bg-indigo-600 hover:text-white transition-colors duration-200"
>
  Login / Sign Up
</button>


              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden mt-2 pb-4 border-t border-gray-200 space-y-4">
              <div className="px-3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 text-sm"
                    placeholder="Search skills or users..."
                  />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="px-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-base font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleAuthAction}
                    className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-gray-900 text-base font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-3">
                  <button
                    onClick={handleAuthAction}
                    className="bg-indigo-600 w-full text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition"
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Header;
