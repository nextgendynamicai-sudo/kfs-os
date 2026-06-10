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
    const { product, paymentMethod, applyIva, customerPhone, clientId, vendedorId } = await req.json();

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
    const client = db.clients.find((c: any) => c.id === clientId);
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // Lógica de cálculo B2B (Mantenemos la regla de gamificación)
    let kfsFeePercentage = client.kfsFeePercentage || 0.05;
    if ((client.onboardedUsers || 0) >= 50) {
      kfsFeePercentage = 0.03;
    }

    const itemPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const priceUSD = applyIva ? itemPrice * 1.16 : itemPrice;
    
    const isDigital = product.category === 'Digital';
    const isCombo = product.category === 'Combos';
    const usesLoyalty = false; // Simplified

    let subTotalUSD = priceUSD;
    let kfsFee = subTotalUSD * kfsFeePercentage;

    let transaction = {
      id: `tx${Date.now()}`,
      clientId,
      vendedorId: vendedorId || "online",
      productName: product.name,
      priceUSD: subTotalUSD,
      kfsFeeUSD: kfsFee,
      netStoreUSD: subTotalUSD - kfsFee,
      date: new Date().toISOString(),
      customerPhone: customerPhone || "",
      paymentMethod,
      type: "sale",
      zReported: false
    };

    // Agregar comisión de la Promotora (Guardián de Cartera)
    let updatedPromotoras = [...db.promotoras];
    if (customerPhone && client.promotoraId) {
      const pIdx = updatedPromotoras.findIndex((p: any) => p.id === client.promotoraId);
      if (pIdx !== -1) {
        const royalty = subTotalUSD * 0.005; // 0.5%
        updatedPromotoras[pIdx] = { 
          ...updatedPromotoras[pIdx], 
          passiveEarningsEUR: (updatedPromotoras[pIdx].passiveEarningsEUR || 0) + royalty
        };
      }
    }

    let updatedClients = db.clients.map((c: any) => {
      if (c.id === clientId) {
        return {
          ...c,
          salesUSD: (c.salesUSD || 0) + subTotalUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kfsFee
        };
      }
      return c;
    });

    const updatedCore = {
      ...db.kreatekCore,
      totalTransactions: (db.kreatekCore?.totalTransactions || 0) + 1,
      netEarningsEUR: (db.kreatekCore?.netEarningsEUR || 0) + kfsFee
    };

    const newDb = {
      ...db,
      transactions: [...db.transactions, transaction],
      clients: updatedClients,
      promotoras: updatedPromotoras,
      kreatekCore: updatedCore
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

    return NextResponse.json({ success: true, transaction });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
