'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const { isAuthenticated } = useAuth();
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
              <span className="text-5xl md:text-7xl text-red-500">❤️</span>
              <h1 className="text-5xl md:text-7xl font-bold">
                MenoEaze
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-95 font-medium">
              Your trusted companion for navigating menopause with confidence
            </p>
            <p className="text-lg mb-4 opacity-90">
              Track symptoms, gain insights, and connect with a supportive community
            </p>
            <p className="text-base mb-8 opacity-85 flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>HIPAA Compliant • Privacy First • Trusted by 1,000+ Women</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </button>
              <Link
                href="/community"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all text-center"
              >
                Explore Community
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-12 md:h-20">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Your Complete Wellness Companion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to navigate your menopause journey with confidence and support
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Symptom Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comprehensive daily tracking with detailed insights and pattern recognition to help you understand your body better.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Personalized AI Chat Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get instant, personalized guidance from our AI assistant, available 24/7 to answer your questions and provide support.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl border border-rose-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with a supportive community of women sharing similar experiences, advice, and encouragement.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Privacy First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your health data is encrypted and secure. We're HIPAA compliant and committed to protecting your privacy.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access your dashboard, chat with our AI assistant, and connect with the community anytime, anywhere.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Healthcare Integration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Share your insights with healthcare providers and get evidence-based recommendations tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Your Personal Health Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your symptoms, view insights, and monitor your progress all in one place
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Total Symptoms</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Avg Severity</p>
                <p className="text-3xl font-bold">5.2/10</p>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-4 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Activity Level</p>
                <p className="text-3xl font-bold">Good</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 mb-4">
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📈</span>
                  <p>Symptom Trends Chart</p>
                </div>
              </div>
            </div>
            {!isAuthenticated && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Get Started to Access Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Join Our Supportive Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with women who understand your journey. Share experiences, get advice, and find your tribe.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { name: 'Sarah M.', match: '85%', location: 'New York' },
                { name: 'Jennifer L.', match: '78%', location: 'California' },
                { name: 'Maria R.', match: '82%', location: 'Texas' },
              ].map((member, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Match Score</span>
                    <span className="text-sm font-bold text-purple-600">{member.match}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: member.match }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Sign Up to Join Community
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Women Everywhere</h2>
            <p className="text-lg opacity-95">Join thousands of women taking control of their health journey</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-4xl mb-2">🔒</div>
              <p className="font-semibold">HIPAA Compliant</p>
              <p className="text-sm opacity-90">Your privacy is our priority</p>
            </div>
            <div>
              <div className="text-4xl mb-2">✅</div>
              <p className="font-semibold">Evidence-Based</p>
              <p className="text-sm opacity-90">Backed by medical research</p>
            </div>
            <div>
              <div className="text-4xl mb-2">💝</div>
              <p className="font-semibold">Compassionate Care</p>
              <p className="text-sm opacity-90">Support when you need it most</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
              <div className="text-gray-600">Symptoms Logged</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to take control?</h2>
          <p className="text-xl mb-4 opacity-95">
            Join thousands of women managing their menopause journey with confidence
          </p>
          <p className="text-base mb-8 opacity-90">
            Start tracking your symptoms today and discover insights about your health
          </p>
          <button
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
      <Footer />
    </main>
  );
}

