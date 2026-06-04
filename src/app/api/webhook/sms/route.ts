import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/context/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sms, secret } = body;

    if (secret !== 'kfs-admin-token') {
      return NextResponse.json({ error: 'Unauthorized. Invalid token.' }, { status: 401 });
    }

    if (!sms || typeof sms !== 'string') {
      return NextResponse.json({ error: 'No SMS body provided.' }, { status: 400 });
    }

    let reference = "";
    let amount = 0;
    
    const refMatch = sms.match(/(?:ref[A-Za-z\.]*\s*:?\s*|referencia\s*:?\s*)(\d{6,12})/i) || sms.match(/(\d{6,12})/);
    if (refMatch && refMatch[1]) {
      reference = refMatch[1];
    } else if (refMatch && refMatch[0]) {
      reference = refMatch[0];
    }

    const amountMatch = sms.match(/(?:bs[A-Za-z\.]*\s*:?\s*|monto\s*:?\s*|pago movil.*?)(\d+(?:[.,]\d+)?)/i);
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(',', '.'));
    }

    if (!reference) {
      return NextResponse.json({ success: false, message: 'No reference detected.', raw: sms }, { status: 422 });
    }

    // Connect to DB and apply business logic
    if (isSupabaseConfigured) {
      const { data: dbData, error: dbError } = await supabase.from('kfs_store_states').select('*').eq('id', 'kfs-general-db-v2').single();
      
      if (dbData && dbData.db_state) {
        let state = dbData.db_state;
        let modified = false;

        // 1. Process Subscription Renewals ($6)
        const clientToRenew = state.clients?.find((c: any) => 
          c.subscription?.status === 'pending_verification' && 
          c.subscription?.lastPaymentRef === reference
        );

        if (clientToRenew) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          clientToRenew.subscription.status = 'active';
          clientToRenew.subscription.nextBillingDate = nextMonth.toISOString();
          
          // Royalty to Promotora (50% of $6 = $3)
          const costEUR = (6 * 1.0) / 1.08; // approx conversion
          const promoCut = costEUR * 0.5;
          const promotora = state.promotoras?.find((p: any) => p.id === clientToRenew.promotoraId);
          if (promotora) {
            promotora.passiveEarningsEUR = (promotora.passiveEarningsEUR || 0) + promoCut;
          }
          
          if (!state.kreatekCore) state.kreatekCore = { netEarningsEUR: 0, adBudgetEUR: 0 };
          state.kreatekCore.netEarningsEUR += promoCut;

          modified = true;
        }

        // 2. Process Pending Online Orders
        const pendingOrderIndex = state.orders?.findIndex((o: any) => 
          o.status === 'pending' && 
          o.paymentReference === reference
        );

        if (pendingOrderIndex !== -1 && pendingOrderIndex !== undefined) {
          const order = state.orders[pendingOrderIndex];
          const client = state.clients?.find((c: any) => c.id === order.clientId);
          
          const receiptNumber = `ONL-AUTO-${Date.now().toString().slice(-4)}`;
          const kfsFeePercentage = client?.kfsFeePercentage || 0.03;
          const kreatekTotalFeeUSD = order.subtotalUSD * kfsFeePercentage;
          const kreatekTotalFeeEUR = kreatekTotalFeeUSD / 1.08; // approx conversion USD to EUR
          
          const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20;
          const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
          const adBudgetEUR = kreatekNetEUR * 0.20;
          const finalNetEUR = kreatekNetEUR - adBudgetEUR;

          // Update client sales and fees
          if (client) {
            client.salesUSD = (client.salesUSD || 0) + order.subtotalUSD;
            client.kfsFeesOwedUSD = (client.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD;
          }

          // Update promotora earnings
          const promotora = state.promotoras?.find((p: any) => p.id === client?.promotoraId);
          if (promotora) {
            promotora.passiveEarningsEUR = (promotora.passiveEarningsEUR || 0) + promotoraFeeEUR;
          }

          const transactionObj = {
            id: `tx${Date.now()}`,
            productId: order.productId,
            amountUSD: order.amountUSD,
            subtotalUSD: order.subtotalUSD,
            ivaUSD: order.ivaUSD,
            igtfUSD: order.igtfUSD,
            paymentMethod: order.paymentMethod,
            receiptNumber,
            kreatekFeeEUR: kreatekTotalFeeEUR,
            reference: order.paymentReference,
            customerPhone: order.customerPhone,
            clientId: order.clientId,
            timestamp: new Date().toISOString(),
            shippingStatus: 'pending'
          };

          // Handle CRM
          const pointsEarned = client?.loyaltyProgramActive ? order.amountUSD * 0.5 : 0;
          if (!state.crm) state.crm = [];
          if (order.customerPhone) {
            const existingCrm = state.crm.find((c: any) => c.phone === order.customerPhone);
            if (existingCrm) {
              existingCrm.totalSpent = (existingCrm.totalSpent || 0) + order.amountUSD;
              existingCrm.purchasesCount = (existingCrm.purchasesCount || 0) + 1;
              existingCrm.lastPurchase = new Date().toISOString();
              existingCrm.kfsPoints = (existingCrm.kfsPoints || 0) + pointsEarned;
            } else {
              state.crm.push({
                id: `crm${Date.now()}`,
                phone: order.customerPhone,
                totalSpent: order.amountUSD,
                purchasesCount: 1,
                lastPurchase: new Date().toISOString(),
                kfsPoints: pointsEarned
              });
            }
          }

          // Remove order from pending orders list
          state.orders = state.orders.filter((o: any) => o.id !== order.id);
          
          // Append transaction
          if (!state.transactions) state.transactions = [];
          state.transactions.push(transactionObj);

          // Update kreatek core stats
          if (!state.kreatekCore) {
            state.kreatekCore = { totalTransactions: 0, earningsEUR: 0, netEarningsEUR: 0, adBudgetEUR: 0 };
          }
          state.kreatekCore.totalTransactions = (state.kreatekCore.totalTransactions || 0) + 1;
          state.kreatekCore.earningsEUR = (state.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR;
          state.kreatekCore.netEarningsEUR = (state.kreatekCore.netEarningsEUR || 0) + finalNetEUR;
          state.kreatekCore.adBudgetEUR = (state.kreatekCore.adBudgetEUR || 0) + adBudgetEUR;

          modified = true;
        }

        if (modified) {
          await supabase.from('kfs_store_states').upsert({ id: 'kfs-general-db-v2', db_state: state, updated_at: new Date().toISOString() });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SMS processed.',
      data: { reference, amount }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
