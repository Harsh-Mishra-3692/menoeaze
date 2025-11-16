'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim(),
          isAnonymous
        })
      });

      const data = await response.json();

      if (data.success) {
        setContent('');
        setIsAnonymous(false);
        onPostCreated();
        onClose();
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Start a Discussion</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Share your thoughts, ask questions, or support others
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
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              rows={6}
              placeholder="Share your experience, ask a question, or offer support..."
              maxLength={2000}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {content.length}/2000 characters
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Post as
                </label>
                <p className="text-xs text-gray-600">
                  {isAnonymous ? 'Your post will be anonymous' : `Posting as ${user?.name || user?.email?.split('@')[0] || 'You'}`}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{isAnonymous ? '🔒' : '👤'}</span>
              <span>
                {isAnonymous
                  ? 'Your identity will be hidden from other members'
                  : 'Your name will be visible to the community'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Posting...
                </span>
              ) : (
                'Post Discussion'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

