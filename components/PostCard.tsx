'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

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

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string, isAnonymous: boolean) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isCommentAnonymous, setIsCommentAnonymous] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const { user } = useAuth();

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setCommenting(true);
    await onComment(post.id, commentContent, isCommentAnonymous);
    setCommentContent('');
    setIsCommentAnonymous(false);
    setCommenting(false);
    setShowComments(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
            {post.isAnonymous ? '👤' : (post.user?.name?.charAt(0) || '?')}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {post.isAnonymous ? 'Anonymous' : (post.user?.name || 'User')}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {post.isAnonymous && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            🔒 Anonymous
          </span>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <span className="text-xl">❤️</span>
          <span className="font-medium">{post.likes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <span className="text-xl">💬</span>
          <span className="font-medium">{post.comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex gap-2 mb-2">
              <textarea
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-none transition-colors resize-none text-sm"
                rows={2}
                maxLength={500}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={isCommentAnonymous}
                  onChange={e => setIsCommentAnonymous(e.target.checked)}
                  className="rounded"
                />
                <span>Comment anonymously</span>
              </label>
              <button
                type="submit"
                disabled={!commentContent.trim() || commenting}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commenting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {comment.isAnonymous ? '👤' : (comment.user?.name?.charAt(0) || '?')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.isAnonymous ? 'Anonymous' : (comment.user?.name || 'User')}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

