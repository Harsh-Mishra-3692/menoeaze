import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'MenoEaze - Your Trusted Menopause Companion',
  description: 'Track symptoms, get AI-powered insights, and connect with a supportive community. Privacy-first, HIPAA compliant, and designed for women.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

