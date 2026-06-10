import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Zinli Webhook (Estructura Mock para el Demo y listos para prod)
export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    const payload = await req.json();
    // Ejemplo de payload esperado de un servicio de scraping de Zinli o API no oficial
    const { referenceId, amountUSD, customerPhone, status } = payload;
    
    if (status !== 'COMPLETED') {
      return NextResponse.json({ success: true, message: 'Ignored or pending' });
    }

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
    // Buscamos al cliente por teléfono (ya que Zinli se asocia al teléfono)
    const customerIdx = db.customers?.findIndex((c: any) => c.phone === customerPhone);
    
    if (customerIdx === undefined || customerIdx === -1) {
      return NextResponse.json({ error: 'Customer not found by phone' }, { status: 404 });
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
      k_points_balance: (customer.k_points_balance || 0) + kPointsBonus,
      hasRecharged: true
    };

    if (isFirstRecharge && customer.referred_by_customer_id) {
       const refId = customer.referred_by_customer_id;
       const cIdx = updatedCustomers.findIndex((c: any) => c.id === refId);
       if (cIdx !== -1) {
           updatedCustomers[cIdx] = {
               ...updatedCustomers[cIdx],
               k_points_balance: (updatedCustomers[cIdx].k_points_balance || 0) + 500,
               k_points_expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
           };
       }
    }

    const newDb = { ...db, customers: updatedCustomers };

    const { error: updateError } = await supabase
      .from('kfs_store_states')
      .upsert({ id: syncId, db_state: newDb, updated_at: new Date().toISOString() });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Zinli funds added" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
