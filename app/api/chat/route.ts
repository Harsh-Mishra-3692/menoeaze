import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

// GET chat history
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE}/api/chat`, {
      headers: {
        'Authorization': token,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST send message
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const { message } = await req.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
