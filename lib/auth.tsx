'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const stored = localStorage.getItem('menoeaze_auth');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('menoeaze_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual backend authentication
    // For now, accept any email/password combination
    try {
      // Simulate API call - replace with actual backend call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   localStorage.setItem('auth_token', data.data.token);
      //   setUser(data.data.user);
      //   localStorage.setItem('menoeaze_auth', JSON.stringify(data.data.user));
      //   return true;
      // }
      
      // Temporary: local storage only
      if (email && password) {
        const userData = { email, name: email.split('@')[0] };
        setUser(userData);
        localStorage.setItem('menoeaze_auth', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'temp_token_' + Date.now()); // TODO: Replace with real token
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual backend authentication
    try {
      // Simulate API call - replace with actual backend call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   localStorage.setItem('auth_token', data.data.token);
      //   setUser(data.data.user);
      //   localStorage.setItem('menoeaze_auth', JSON.stringify(data.data.user));
      //   return true;
      // }
      
      // Temporary: local storage only
      if (email && password && password.length >= 6) {
        const userData = { email, name: email.split('@')[0] };
        setUser(userData);
        localStorage.setItem('menoeaze_auth', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'temp_token_' + Date.now()); // TODO: Replace with real token
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('menoeaze_auth');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

