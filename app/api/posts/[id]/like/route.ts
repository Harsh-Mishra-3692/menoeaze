import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization');
    
    const response = await fetch(`${API_BASE}/api/posts/${params.id}/like`, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
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

