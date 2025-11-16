'use client';

import { useState, useEffect } from 'react';
import { postChat } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

export default function ChatWidget({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load chat history from backend
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/chat', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      userId,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await postChat(userId, currentInput);
      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data!]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          userId,
          role: 'assistant',
          content: res.error || 'Sorry, I encountered an error. Please check your Perplexity API key configuration.',
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        userId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API configuration.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[500px]">
      <div className="p-5 border-b bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <div>
            <h3 className="font-semibold">Talk to Your Personal Support Assistant</h3>
            <p className="text-xs opacity-90">Your AI companion for guidance and support</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2 text-lg font-medium">👋 Hi! I'm here to support you.</p>
            <p className="text-sm mb-4">Ask me about:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-left max-w-md mx-auto">
              <div className="bg-white p-2 rounded-lg">• Symptom management</div>
              <div className="bg-white p-2 rounded-lg">• Treatment options</div>
              <div className="bg-white p-2 rounded-lg">• Wellness tips</div>
              <div className="bg-white p-2 rounded-lg">• Lifestyle advice</div>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-900 shadow-sm rounded-bl-sm border border-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2 mb-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            placeholder="Describe your question or concern in detail..."
            rows={2}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
}

