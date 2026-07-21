import { KFS_BRAND } from "../../../../config/brandConfig";
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Binance Pay Webhook
export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    // 1. Verificar firma de Binance Pay (Simulada para este demo)
    const binanceSignature = req.headers.get('binancepay-signature');
    if (!binanceSignature && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    const payload = await req.json();
    const { bizType, data } = payload;
    
    // Verificamos si es un pago exitoso
    if (bizType !== 'PAY' || data?.status !== 'SUCCESS') {
      return NextResponse.json({ success: true, message: 'Ignored or pending' });
    }

    // 2. Extraemos el merchantTradeNo (debe ser el ID del cliente de KFS OS)
    // El payload de Binance incluye merchantTradeNo que podemos usar como customerId
    const customerId = data.merchantTradeNo; 
    const amountUSD = parseFloat(data.orderAmount);

    if (!customerId || isNaN(amountUSD) || amountUSD <= 0) {
      return NextResponse.json({ returnCode: "FAIL", returnMessage: "Invalid customer or amount" }, { status: 400 });
    }

    // 3. Obtener estado actual (Híbrido) con reintentos OCC
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
      const customerIdx = db.customers?.findIndex((c: any) => c.id === customerId);
      
      if (customerIdx === undefined || customerIdx === -1) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      const customer = db.customers[customerIdx];
      const isFirstRecharge = !customer.hasRecharged;
      let kPointsBonus = 0;

      // Bonos Virales de recarga ({KFS_BRAND.productAcronym} Network effect)
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

      let updatedClients = [...db.clients];
      let updatedPromotoras = [...db.promotoras];

      // Bono Viral de Primera Recarga (500 Axis Points o 0.50 EUR)
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
        writeSuccess = true;
      } else {
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para binance webhook de ${customerId}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!writeSuccess) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    // Retorno a Binance: SUCCESS
    return NextResponse.json({ returnCode: "SUCCESS", returnMessage: "" });
  } catch (err: any) {
    return NextResponse.json({ returnCode: "FAIL", returnMessage: err.message }, { status: 500 });
  }
}
