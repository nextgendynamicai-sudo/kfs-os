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
