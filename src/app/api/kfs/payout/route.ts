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

    if (!userId || !role || typeof amountUSD !== 'number' || isNaN(amountUSD) || amountUSD <= 0) {
      return NextResponse.json({ error: 'Monto de retiro o datos de usuario inválidos' }, { status: 400 });
    }

    const syncId = "kfs-general-db-prod";
    let attempts = 0;
    const maxAttempts = 3;
    let writeSuccess = false;
    let payoutId = "";

    while (attempts < maxAttempts && !writeSuccess) {
      attempts++;

      const { data: storeData, error: storeError } = await supabase
        .from('kfs_store_states')
        .select('db_state, updated_at')
        .eq('id', syncId)
        .single();

      if (storeError || !storeData) {
        return NextResponse.json({ error: 'Database state not found' }, { status: 404 });
      }

      const oldUpdatedAt = storeData.updated_at;
      let db = storeData.db_state;
      let checkSuccess = false;

      if (role === 'dueño') {
        const idx = db.clients?.findIndex((c: any) => c.id === userId);
        const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
        const totalToDeduct = amountUSD + withdrawalFee;

        if (idx !== -1 && db.clients[idx].walletBalanceUSD >= totalToDeduct) {
          db.clients[idx] = {
            ...db.clients[idx],
            walletBalanceUSD: db.clients[idx].walletBalanceUSD - totalToDeduct,
            pendingPayoutUSD: (db.clients[idx].pendingPayoutUSD || 0) + amountUSD
          };
          checkSuccess = true;
        }
      } else if (role === 'promotora') {
        const idx = db.promotoras?.findIndex((p: any) => p.id === userId);
        const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
        const totalToDeduct = amountUSD + withdrawalFee;

        if (idx !== -1 && db.promotoras[idx].passiveEarningsEUR >= totalToDeduct) { 
          db.promotoras[idx] = {
            ...db.promotoras[idx],
            passiveEarningsEUR: db.promotoras[idx].passiveEarningsEUR - totalToDeduct,
            pendingPayoutEUR: (db.promotoras[idx].pendingPayoutEUR || 0) + amountUSD
          };
          checkSuccess = true;
        }
      }

      if (!checkSuccess) {
        return NextResponse.json({ error: 'Fondos insuficientes o usuario no encontrado' }, { status: 400 });
      }

      payoutId = `payout_${Date.now()}`;
      const newPayout = {
        id: payoutId,
        userId,
        role,
        amountUSD,
        bankDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const newDb = {
        ...db,
        payouts: [...(db.payouts || []), newPayout]
      };

      const nextUpdatedAt = new Date().toISOString();
      const { data: updateData, error: updateError } = await supabase
        .from('kfs_store_states')
        .update({
          db_state: newDb,
          updated_at: nextUpdatedAt
        })
        .eq('id', syncId)
        .eq('updated_at', oldUpdatedAt)
        .select();

      if (!updateError && updateData && updateData.length > 0) {
        writeSuccess = true;
      } else {
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para payout de ${userId}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!writeSuccess) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    return NextResponse.json({ success: true, payoutId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
