import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, role, amountUSD, bankDetails } = body;

    // Strict SUDEBAN Closed-Loop RBAC Check: B2C / Customers are strictly prohibited from cashing out
    if (role === 'customer' || role === 'b2c' || role === 'consumer') {
      return NextResponse.json(
        { error: 'Closed-Loop Regulation Violation. B2C Cashout is strictly prohibited.' },
        { status: 403 }
      );
    }

    if (!userId || !role || typeof amountUSD !== 'number' || isNaN(amountUSD) || amountUSD <= 0) {
      return NextResponse.json({ error: 'Monto de retiro o datos de usuario inválidos' }, { status: 400 });
    }

    if (!['dueño', 'client', 'comercio', 'b2b', 'promotora'].includes(role)) {
      return NextResponse.json({ error: 'Rol no autorizado para liquidación de fondos.' }, { status: 403 });
    }

    if (!supabase) {
      // In local/mock mode without Supabase, acknowledge success with ledger compliance
      const payoutId = `vault_payout_${Date.now()}`;
      return NextResponse.json({
        success: true,
        payoutId,
        type: 'Liquidación Comercial de Ventas',
        message: 'Liquidación comercial registrada en el libro mayor Axis OS.'
      });
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
      const db = storeData.db_state;
      let checkSuccess = false;

      if (role === 'dueño' || role === 'client' || role === 'comercio' || role === 'b2b') {
        const idx = db.clients?.findIndex((c: any) => c.id === userId);
        const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
        const totalToDeduct = amountUSD + withdrawalFee;

        if (idx !== -1 && (db.clients[idx].walletBalanceUSD >= totalToDeduct || db.clients[idx].salesUSD >= amountUSD)) {
          db.clients[idx] = {
            ...db.clients[idx],
            walletBalanceUSD: Math.max(0, (db.clients[idx].walletBalanceUSD || 0) - totalToDeduct),
            salesUSD: Math.max(0, (db.clients[idx].salesUSD || 0) - amountUSD),
            pendingPayoutUSD: (db.clients[idx].pendingPayoutUSD || 0) + amountUSD
          };
          checkSuccess = true;
        }
      } else if (role === 'promotora') {
        const idx = db.promotoras?.findIndex((p: any) => p.id === userId);
        const withdrawalFee = amountUSD * 0.02; // 2% Withdrawal Fee
        const totalToDeduct = amountUSD + withdrawalFee;

        if (idx !== -1 && (db.promotoras[idx].passiveEarningsEUR >= totalToDeduct || db.promotoras[idx].earnings >= totalToDeduct)) { 
          db.promotoras[idx] = {
            ...db.promotoras[idx],
            passiveEarningsEUR: Math.max(0, (db.promotoras[idx].passiveEarningsEUR || 0) - totalToDeduct),
            pendingPayoutEUR: (db.promotoras[idx].pendingPayoutEUR || 0) + amountUSD
          };
          checkSuccess = true;
        }
      }

      if (!checkSuccess) {
        return NextResponse.json({ error: 'Fondos insuficientes o usuario no encontrado' }, { status: 400 });
      }

      payoutId = `vault_payout_${Date.now()}`;
      const newPayout = {
        id: payoutId,
        userId,
        role,
        amountUSD,
        bankDetails,
        status: 'pending',
        type: 'Liquidación Comercial de Ventas',
        ledgerCategory: 'COMMERCIAL_SETTLEMENT',
        createdAt: new Date().toISOString()
      };

      const ledgerEntry = {
        id: `ledger_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "COMMERCIAL_PAYOUT",
        description: "Liquidación Comercial de Ventas",
        amountUSD,
        userId,
        role,
        bankDetails
      };

      const auditLog = {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor: userId,
        action: "COMMERCIAL_PAYOUT_REQUESTED",
        details: `Liquidación Comercial de Ventas por $${amountUSD} USD solicitada para ${role} ${userId}.`
      };
      
      const newDb = {
        ...db,
        payouts: [...(db.payouts || []), newPayout],
        kfsNetworkLedger: [...(db.kfsNetworkLedger || []), ledgerEntry],
        auditLogs: [...(db.auditLogs || []), auditLog]
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
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para vault payout de ${userId}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!writeSuccess) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      payoutId,
      type: 'Liquidación Comercial de Ventas'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
