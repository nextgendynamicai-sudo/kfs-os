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

    if (!customerId || typeof amountUSD !== 'number' || isNaN(amountUSD) || amountUSD <= 0) {
      return NextResponse.json({ error: 'Monto o cliente inválido' }, { status: 400 });
    }

    const syncId = "kfs-general-db-prod";
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let finalBalance = 0;

    while (attempts < maxAttempts && !success) {
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
            passiveEarningsEUR: (updatedPromotoras[pIdx].passiveEarningsEUR || 0) + 0.50
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
        success = true;
        finalBalance = updatedCustomers[customerIdx].real_balance;
      } else {
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para fund de ${customerId}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    return NextResponse.json({ success: true, newBalance: finalBalance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
