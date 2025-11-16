import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

// GET all symptoms
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const userId = req.nextUrl.searchParams.get('userId');
    
    const response = await fetch(`${API_BASE}/api/symptoms?userId=${userId || ''}`, {
      headers: {
        'Authorization': token || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST create symptom
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const body = await req.json();
    
    const response = await fetch(`${API_BASE}/api/symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
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
