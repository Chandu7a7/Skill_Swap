import React, { useState } from 'react';
import { User, Search, Menu, X, LogOut, Settings, Users, MessageSquare } from 'lucide-react';
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
    if (isAuthenticated) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SkillSwap</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search skills or users..."
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleAuthAction}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-700 hover:text-gray-900 p-2"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="text-base font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleAuthAction}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors w-full mx-3"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Header;