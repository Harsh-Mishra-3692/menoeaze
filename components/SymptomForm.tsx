'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { postSymptom, getSymptoms } from '@/lib/api';
import type { Symptom } from '@/lib/types';

const STORAGE_KEY = 'menoeaze_symptoms';

export function useSymptoms(userId: string) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      setLoading(true);
      try {
        // Try to get from backend first
        const res = await getSymptoms(userId);
        if (res.success && res.data) {
          setSymptoms(res.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        } else {
          // Fallback to local storage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSymptoms(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        // Fallback to local storage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSymptoms(JSON.parse(stored));
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSymptoms();
    }
  }, [userId]);

  const addSymptom = async (symptom: Omit<Symptom, 'id' | 'timestamp'>) => {
    const newSymptom: Symptom = {
      ...symptom,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Optimistic update
    setSymptoms(prev => {
      const updated = [...prev, newSymptom];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Save to backend
    try {
      const res = await postSymptom(symptom);
      if (res.success && res.data) {
        // Update with server response
        setSymptoms(prev => {
          const updated = prev.map(s => s.id === newSymptom.id ? res.data! : s);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Error saving symptom:', error);
      // Keep optimistic update even if backend fails
    }
  };

  return { symptoms, addSymptom, loading };
}

export default function SymptomForm() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [issues, setIssues] = useState('');
  const [mood, setMood] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { addSymptom } = useSymptoms(user?.email || 'user1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await addSymptom({ 
        userId: user?.email || 'user1', 
        type, 
        description,
        issues,
        mood,
        severity, 
        notes 
      });
      
      // Reset form
      setType('');
      setDescription('');
      setIssues('');
      setMood('');
      setSeverity(5);
      setNotes('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting symptom:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const moods = ['😊 Happy', '😐 Neutral', '😔 Sad', '😰 Anxious', '😴 Tired', '😡 Irritated'];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-5 max-h-[600px] overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Log Today's Symptom</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Symptom Type *</label>
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="e.g., Hot flashes, Mood swings, Sleep issues"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Describe Symptom *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            rows={2}
            placeholder="Describe what you're experiencing..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Issues You Faced</label>
          <textarea
            value={issues}
            onChange={e => setIssues(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            rows={2}
            placeholder="What challenges did this symptom cause today?"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Mood</label>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMood(m)}
                className={`p-2 rounded-lg border-2 transition-all text-sm ${
                  mood === m
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Severity: <span className="text-purple-600 font-bold">{severity}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={e => setSeverity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            style={{
              background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${((severity - 1) / 9) * 100}%, rgb(229, 231, 235) ${((severity - 1) / 9) * 100}%, rgb(229, 231, 235) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Additional Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            rows={2}
            placeholder="Any other details you'd like to add..."
          />
        </div>
      </div>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✓ Symptom logged successfully!
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Logging...
          </span>
        ) : (
          'Log Today\'s Symptom'
        )}
      </button>
    </form>
  );
}

