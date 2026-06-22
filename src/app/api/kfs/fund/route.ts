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
    const { customerId, amountUSD, gateway } = await req.json();

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
    const customerIdx = db.customers?.findIndex((c: any) => c.id === customerId);
    
    if (customerIdx === undefined || customerIdx === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = db.customers[customerIdx];
    const isFirstRecharge = !customer.hasRecharged;
    let kPointsBonus = 0;

    if (amountUSD >= 5 && amountUSD < 10) kPointsBonus = 100;
    else if (amountUSD >= 10 && amountUSD < 20) kPointsBonus = 300;
    else if (amountUSD >= 20) kPointsBonus = 800;

    let updatedCustomers = [...db.customers];
    updatedCustomers[customerIdx] = {
      ...customer,
      real_balance: (customer.real_balance || 0) + amountUSD,
      k_point_bonus_balance: (customer.k_point_bonus_balance || 0) + kPointsBonus,
      hasRecharged: true
    };

    let updatedClients = [...db.clients];
    let updatedPromotoras = [...db.promotoras];

    // Lógica del Bono Viral (500 Axis Points al referidor)
    if (isFirstRecharge && customer.referralCode) {
      const refCode = customer.referralCode;
      
      const pIdx = updatedPromotoras.findIndex((p: any) => p.id === refCode);
      if (pIdx !== -1) {
        updatedPromotoras[pIdx] = {
          ...updatedPromotoras[pIdx],
          passiveEarningsEUR: (updatedPromotoras[pIdx].passiveEarningsEUR || 0) + 0.50 // 500 Axis Points equiv.
        };
      } else {
        const cIdx = updatedClients.findIndex((c: any) => c.id === refCode);
        if (cIdx !== -1) {
          updatedClients[cIdx] = {
            ...updatedClients[cIdx],
            kfsFeesOwedUSD: Math.max(0, (updatedClients[cIdx].kfsFeesOwedUSD || 0) - 0.50)
          };
        } else {
          const custIdx = updatedCustomers.findIndex((c: any) => c.id === refCode);
          if (custIdx !== -1) {
            updatedCustomers[custIdx] = {
              ...updatedCustomers[custIdx],
              k_point_bonus_balance: (updatedCustomers[custIdx].k_point_bonus_balance || 0) + 500
            };
          }
        }
      }
    }

    const newDb = {
      ...db,
      customers: updatedCustomers,
      clients: updatedClients,
      promotoras: updatedPromotoras
    };

    const { error: updateError } = await supabase
      .from('kfs_store_states')
      .upsert({
        id: syncId,
        db_state: newDb,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, newBalance: updatedCustomers[customerIdx].walletUSD });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
