'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            router.push('/');
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}

