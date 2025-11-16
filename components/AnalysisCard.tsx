'use client';

import { useEffect, useState } from 'react';

interface AnalysisData {
  patterns?: {
    frequency: number;
    avgSeverity: number;
    trend: string;
    totalSymptoms: number;
  };
  recommendations?: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
}

export default function AnalysisCard({ userId }: { userId: string }) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [userId]);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/analysis?type=insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.patterns) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Analysis</h3>
        <p className="text-gray-500">Start logging symptoms to see analysis</p>
      </div>
    );
  }

  const { patterns, recommendations } = analysis;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900">📊 Symptom Analysis</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Symptom Frequency</span>
            <span className="text-sm font-semibold text-purple-600">
              {patterns.frequency.toFixed(1)} per week
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${Math.min(patterns.frequency * 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Trend</span>
            <span className={`text-sm font-semibold ${
              patterns.trend === 'decreasing' ? 'text-green-600' :
              patterns.trend === 'increasing' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {patterns.trend === 'decreasing' ? '↓ Improving' :
               patterns.trend === 'increasing' ? '↑ Increasing' :
               '→ Stable'}
            </span>
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h4>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    rec.priority === 'high'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-blue-50 border border-blue-200 text-blue-800'
                  }`}
                >
                  <span className="font-medium">{rec.type === 'urgent' ? '⚠️' : '💡'}</span>
                  {' '}
                  {rec.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

