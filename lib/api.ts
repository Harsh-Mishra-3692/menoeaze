import type { ApiResponse, ChatMessage, Symptom, Embedding } from './types';

const API_BASE = '/api';

// TODO: Add PHI scrubbing before sending
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function postChat(
  userId: string,
  message: string
): Promise<ApiResponse<ChatMessage>> {
  return fetchApi<ChatMessage>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function postEmbedding(
  text: string
): Promise<ApiResponse<Embedding>> {
  return fetchApi<Embedding>('/embeddings', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function getUser(userId: string): Promise<ApiResponse<{ id: string }>> {
  return fetchApi<{ id: string }>(`/user/${userId}`);
}

export async function postSymptom(
  symptom: Omit<Symptom, 'id' | 'timestamp'>
): Promise<ApiResponse<Symptom>> {
  return fetchApi<Symptom>('/symptoms', {
    method: 'POST',
    body: JSON.stringify(symptom),
  });
}

export async function getSymptoms(
  userId: string
): Promise<ApiResponse<Symptom[]>> {
  return fetchApi<Symptom[]>(`/symptoms?userId=${userId}`);
}

export async function createPost(
  content: string,
  isAnonymous: boolean
): Promise<ApiResponse<unknown>> {
  return fetchApi<unknown>('/posts', {
    method: 'POST',
    body: JSON.stringify({ content, isAnonymous }),
  });
}

export async function getPosts(): Promise<ApiResponse<unknown[]>> {
  return fetchApi<unknown[]>('/posts');
}

export async function likePost(postId: string): Promise<ApiResponse<{ likes: number }>> {
  return fetchApi<{ likes: number }>(`/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function addComment(
  postId: string,
  content: string,
  isAnonymous: boolean
): Promise<ApiResponse<unknown>> {
  return fetchApi<unknown>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, isAnonymous }),
  });
}

