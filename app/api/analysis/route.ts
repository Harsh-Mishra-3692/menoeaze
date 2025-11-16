import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

// GET analysis and insights
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type'); // 'insights', 'trends', 'report'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let endpoint = '/api/ml/insights';
    if (type === 'trends') endpoint = '/api/ml/trends';
    if (type === 'report') endpoint = `/api/ml/report?startDate=${startDate || ''}&endDate=${endDate || ''}`;

    const response = await fetch(`${API_BASE}${endpoint}`, {
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

