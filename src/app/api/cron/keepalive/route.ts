import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase free tier pauses projects after ~7 days of inactivity.
// This cron endpoint runs daily via Vercel Cron to keep the project alive.
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

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Simple lightweight query to keep the database active
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    const timestamp = new Date().toISOString();

    if (error) {
      console.warn(`[KFS Keepalive] ${timestamp} - Query error:`, error.message);
      return NextResponse.json({ 
        status: 'error', 
        message: error.message, 
        timestamp 
      });
    }

    console.log(`[KFS Keepalive] ${timestamp} - Ping OK, rows: ${data?.length ?? 0}`);
    return NextResponse.json({ 
      status: 'alive', 
      rows: data?.length ?? 0, 
      timestamp 
    });
  } catch (err: any) {
    const timestamp = new Date().toISOString();
    console.error(`[KFS Keepalive] ${timestamp} - Fatal:`, err.message);
    return NextResponse.json({ 
      status: 'error', 
      message: err.message, 
      timestamp 
    }, { status: 500 });
  }
}
