export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface Symptom {
  id: string;
  userId: string;
  type: string;
  severity: number;
  description?: string;
  issues?: string;
  mood?: string;
  notes?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Embedding {
  vector: number[];
  text: string;
  metadata?: Record<string, unknown>;
}

