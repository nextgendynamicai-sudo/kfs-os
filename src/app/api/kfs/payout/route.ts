import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    const { userId, role, amountUSD, bankDetails } = await req.json();

    const syncId = "kfs-general-db-prod";
    const { data: storeData, error: storeError } = await supabase
      .from('kfs_store_states')
      .select('db_state')
      .eq('id', syncId)
      .single();

    if (storeError || !storeData) {
      return NextResponse.json({ error: 'Database state not found' }, { status: 404 });
    }

    let db = storeData.db_state;
    let success = false;

    if (role === 'dueño') {
      const idx = db.clients?.findIndex((c: any) => c.id === userId);
      const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
      const totalToDeduct = amountUSD + withdrawalFee;

      if (idx !== -1 && db.clients[idx].walletBalanceUSD >= totalToDeduct) {
        db.clients[idx].walletBalanceUSD -= totalToDeduct;
        db.clients[idx].pendingPayoutUSD = (db.clients[idx].pendingPayoutUSD || 0) + amountUSD;
        success = true;
      }
    } else if (role === 'promotora') {
      const idx = db.promotoras?.findIndex((p: any) => p.id === userId);
      const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
      const totalToDeduct = amountUSD + withdrawalFee;

      if (idx !== -1 && db.promotoras[idx].passiveEarningsEUR >= totalToDeduct) { 
        db.promotoras[idx].passiveEarningsEUR -= totalToDeduct;
        db.promotoras[idx].pendingPayoutEUR = (db.promotoras[idx].pendingPayoutEUR || 0) + amountUSD;
        success = true;
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Fondos insuficientes o usuario no encontrado' }, { status: 400 });
    }

    // Registrar la solicitud en la lista de payouts globales (Dashboard Core)
    const newPayout = {
      id: `payout_${Date.now()}`,
      userId,
      role,
      amountUSD,
      bankDetails, // Should contain { banco, telefono, cedula } stringified or object
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.payouts = [...(db.payouts || []), newPayout];

    const { error: updateError } = await supabase
      .from('kfs_store_states')
      .upsert({ id: syncId, db_state: db, updated_at: new Date().toISOString() });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payoutId: newPayout.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
