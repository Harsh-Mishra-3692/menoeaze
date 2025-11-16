'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import EnhancedChart from '@/components/EnhancedChart';
import SymptomForm from '@/components/SymptomForm';
import ChatWidget from '@/components/ChatWidget';
import AnalysisCard from '@/components/AnalysisCard';
import { useSymptoms } from '@/components/SymptomForm';

function DashboardContent() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const { user } = useAuth();
  const { symptoms } = useSymptoms(user?.email || 'user1');

  // Calculate stats
  const totalSymptoms = symptoms.length;
  const avgSeverity = symptoms.length
    ? Math.round(symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length * 10) / 10
    : 0;

  // Symptoms from past week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const pastWeekSymptoms = symptoms.filter(s => 
    new Date(s.timestamp) >= oneWeekAgo
  );

  // Activity level calculation (based on symptom frequency)
  const getActivityLevel = () => {
    if (pastWeekSymptoms.length === 0) return 'Excellent';
    if (pastWeekSymptoms.length <= 3) return 'Good';
    if (pastWeekSymptoms.length <= 7) return 'Moderate';
    return 'Needs Attention';
  };

  const chartData = (period === 'weekly' 
    ? symptoms.slice(-7) 
    : symptoms.slice(-30)
  ).map((s) => ({
    date: new Date(s.timestamp).toISOString(),
    value: s.severity,
  }));

  const recentSymptoms = symptoms.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-gray-600">Here's your health overview for today</p>
        </div>

        {/* Stats Cards - 4 separate cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Total Symptoms</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-4xl font-bold">{totalSymptoms}</p>
            <p className="text-sm opacity-80 mt-2">All time tracked</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Avg Severity</h3>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-4xl font-bold">{avgSeverity.toFixed(1)}/10</p>
            <p className="text-sm opacity-80 mt-2">Overall average</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Past Week</h3>
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-4xl font-bold">{pastWeekSymptoms.length}</p>
            <p className="text-sm opacity-80 mt-2">Symptoms logged</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Activity Level</h3>
              <span className="text-3xl">💪</span>
            </div>
            <p className="text-4xl font-bold">{getActivityLevel()}</p>
            <p className="text-sm opacity-80 mt-2">Based on frequency</p>
          </div>
        </div>

        {/* Period Toggle */}
        <div className="mb-6 flex gap-2 bg-white p-1 rounded-xl w-fit shadow-sm">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === 'weekly'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === 'monthly'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Symptom Analysis & Trends</h2>
              <p className="text-sm text-gray-600 mb-4">Track your progress against normal levels</p>
              {chartData.length > 0 ? (
                <EnhancedChart data={chartData} normalLevel={5} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">📊</span>
                    <p>Log symptoms to see trends</p>
                  </div>
                </div>
              )}
            </div>
            <AnalysisCard userId={user?.email || 'user1'} />
          </div>
          <SymptomForm />
        </div>

        {/* Recent Symptoms & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Symptoms</h2>
            {recentSymptoms.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentSymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">{symptom.type}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(symptom.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {symptom.description && (
                      <p className="text-sm text-gray-700 mb-2">{symptom.description}</p>
                    )}
                    {symptom.mood && (
                      <p className="text-xs text-gray-600 mb-2">Mood: {symptom.mood}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(symptom.severity / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {symptom.severity}/10
                      </span>
                    </div>
                    {symptom.notes && (
                      <p className="text-sm text-gray-600 mt-2">{symptom.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No symptoms logged yet</p>
            )}
          </div>
          <ChatWidget userId={user?.email || 'user1'} />
        </div>

        {/* Community CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-2xl shadow-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Connect with the Community</h2>
          <p className="mb-6 opacity-90">
            Share experiences, get support, and find others on similar journeys
          </p>
          <Link
            href="/community"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Visit Community →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

