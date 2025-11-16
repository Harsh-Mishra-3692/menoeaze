'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreatePostModal from '@/components/CreatePostModal';
import PostCard from '@/components/PostCard';

interface Post {
  id: string;
  content: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
  } | null;
  comments: Array<{
    id: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    user: {
      id: string;
      name: string;
    } | null;
  }>;
}

function CommunityContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [matches, setMatches] = useState([
    { id: '1', name: 'Sarah M.', age: 48, similarity: 0.85, location: 'New York', symptoms: ['Hot flashes', 'Sleep issues'] },
    { id: '2', name: 'Jennifer L.', age: 52, similarity: 0.78, location: 'California', symptoms: ['Mood swings', 'Fatigue'] },
    { id: '3', name: 'Maria R.', age: 50, similarity: 0.82, location: 'Texas', symptoms: ['Hot flashes', 'Anxiety'] },
  ]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      // For now, show empty state if API fails
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: data.data.likes }
            : post
        ));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async (postId: string, content: string, isAnonymous: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, isAnonymous })
      });
      const data = await response.json();
      if (data.success) {
        fetchPosts(); // Refresh posts to get updated comments
      }
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with others who understand your journey. Share experiences, get support, and find your tribe.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
            <div className="text-gray-600">Messages Shared</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-rose-600 mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Matches Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Matches</h2>
          <p className="text-gray-600 mb-6">People with similar experiences</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <div
                key={match.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {match.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{match.name}</h3>
                    <p className="text-sm text-gray-600">{match.age} years old • {match.location}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(match.similarity * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${match.similarity * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Common symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community Feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              + Start a Discussion
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading discussions...</p>
            </div>
          ) : posts.length > 0 ? (
            <div>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <span className="text-5xl mb-4 block">💬</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to start a conversation and help build our supportive community!
              </p>
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Start First Discussion
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-2xl shadow-lg text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-lg mb-6 opacity-90">
            Share your story, ask questions, and support others on their journey
          </p>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Start a Discussion
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}

export default function Community() {
  return (
    <ProtectedRoute>
      <CommunityContent />
    </ProtectedRoute>
  );
}

