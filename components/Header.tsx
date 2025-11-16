'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, logout, user } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-red-500 text-2xl">❤️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              MenoEaze
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Dashboard
            </Link>
            {isAuthenticated ? (
              <Link 
                href="/community" 
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/community' 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Community
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Community
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

