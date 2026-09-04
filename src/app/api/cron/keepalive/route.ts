import { NextResponse } from 'next/server';

// Supabase free tier pauses projects after ~7 days of inactivity.
// This cron endpoint runs daily via Vercel Cron to keep the project alive.
// Uses raw fetch instead of supabase-js client for maximum reliability.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cleanEnv = (val?: string) => val ? val.replace(/[\uFEFF\u200B]/g, '').trim() : '';

export async function GET(request: Request) {
  // Verify the request comes from Vercel Cron (optional security)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If CRON_SECRET is set, validate it. Otherwise allow (for testing).
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      status: 'skipped', 
      reason: 'Supabase not configured' 
    });
  }

  const timestamp = new Date().toISOString();

  try {
    // Direct REST API call — no client library needed, maximum compatibility
    const res = await fetch(`${supabaseUrl}/rest/v1/clients?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn(`[KFS Keepalive] ${timestamp} - HTTP ${res.status}: ${body}`);
      return NextResponse.json({ 
        status: 'warning', 
        httpStatus: res.status,
        message: body.substring(0, 200),
        timestamp 
      });
    }

    const data = await res.json();
    console.log(`[KFS Keepalive] ${timestamp} - Ping OK, rows: ${Array.isArray(data) ? data.length : 0}`);
    return NextResponse.json({ 
      status: 'alive', 
      rows: Array.isArray(data) ? data.length : 0, 
      timestamp 
    });
  } catch (err: any) {
    console.error(`[KFS Keepalive] ${timestamp} - Error:`, err.message);
    return NextResponse.json({ 
      status: 'error', 
      message: err.message, 
      timestamp 
    }, { status: 200 }); // Return 200 so Vercel Cron doesn't flag it as failure
  }
}
