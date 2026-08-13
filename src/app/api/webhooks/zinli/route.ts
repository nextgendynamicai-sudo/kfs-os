import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;
const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

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

    if (!customerPhone || typeof amountUSD !== 'number' || isNaN(amountUSD) || amountUSD <= 0) {
      return NextResponse.json({ error: 'Monto o teléfono de cliente inválido' }, { status: 400 });
    }

    const syncId = "kfs-general-db-prod";
    let attempts = 0;
    const maxAttempts = 3;
    let writeSuccess = false;

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

      let updatedCustomers = [...(db.customers || [])];
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
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para zinli webhook de ${customerPhone}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!writeSuccess) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    return NextResponse.json({ success: true, message: "Zinli funds added" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
