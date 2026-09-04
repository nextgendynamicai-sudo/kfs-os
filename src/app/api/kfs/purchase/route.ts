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

    if (!clientId || !product || product.price === undefined || product.price === null) {
      return NextResponse.json({ error: 'Datos de producto o comercio incompletos' }, { status: 400 });
    }

    const itemPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    if (isNaN(itemPrice) || itemPrice <= 0) {
      return NextResponse.json({ error: 'Precio de producto inválido' }, { status: 400 });
    }

    const syncId = "kfs-general-db-prod";
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let transactionResult = null;

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
      const db = storeData.db_state;
      const client = db.clients?.find((c: any) => c.id === clientId);
      if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

      // Lógica de cálculo B2B
      let kfsFeePercentage = client.kfsFeePercentage || 0.05;
      if ((client.onboardedUsers || 0) >= 50) {
        kfsFeePercentage = 0.03;
      }

      const priceUSD = applyIva ? itemPrice * 1.16 : itemPrice;
      const subTotalUSD = priceUSD;
      const kfsFee = subTotalUSD * kfsFeePercentage;

      const transaction = {
        id: `tx${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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
      const updatedPromotoras = [...(db.promotoras || [])];
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

      const updatedClients = (db.clients || []).map((c: any) => {
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
        transactions: [...(db.transactions || []), transaction],
        clients: updatedClients,
        promotoras: updatedPromotoras,
        kreatekCore: updatedCore
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
        transactionResult = transaction;
      } else {
        console.warn(`[Collision Detectado] Intento ${attempts}/${maxAttempts} para guardar compra de ${clientId}. Reintentando...`);
        await new Promise(r => setTimeout(r, 50 + Math.floor(Math.random() * 100)));
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Update conflict. Please try again.' }, { status: 409 });
    }

    return NextResponse.json({ success: true, transaction: transactionResult });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
