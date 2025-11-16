'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLogin(initialMode === 'login');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Add PHI scrubbing and consent check
    // TODO: Connect to authentication service (NextAuth.js, Firebase, etc.)
    
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
          setLoading(false);
          return;
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const success = await signup(email, password);
        if (!success) {
          setError('Unable to create account. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onClose();
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-sm opacity-90 mt-1">
            {isLogin
              ? 'Log in to continue your journey'
              : 'Join MenoEaze and start tracking your health'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Log In' : 'Sign Up'
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={switchMode}
            className="w-full text-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
          >
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <span className="text-purple-600 font-semibold">Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="text-purple-600 font-semibold">Log in</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            {/* TODO: Add links to Terms and Privacy Policy */}
          </p>
        </div>
      </div>
    </div>
  );
}

