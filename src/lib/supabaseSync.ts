import { supabase } from '../context/supabase';

export const syncToRelational = async (db: any) => {
  if (!supabase) return;
  try {
    // Sync Clients
    if (db.clients && db.clients.length > 0) {
      const clientsPayload = db.clients.map((c: any) => ({
        id: c.id,
        promotoraId: c.promotoraId,
        company: c.company,
        name: c.name,
        email: c.email,
        phone: c.phone,
        walletBalanceUSD: c.walletBalanceUSD,
        salesUSD: c.salesUSD,
        raw_data: c
      }));
      await supabase.from('clients').upsert(clientsPayload);
    }
    
    // Sync Customers
    if (db.customers && db.customers.length > 0) {
      const customersPayload = db.customers.map((c: any) => ({
        id: c.id,
        phone: c.phone,
        name: c.name,
        email: c.email,
        walletUSD: c.walletUSD,
        k_points_balance: c.k_points_balance,
        raw_data: c
      }));
      await supabase.from('customers').upsert(customersPayload);
    }

    // Sync Promotoras
    if (db.promotoras && db.promotoras.length > 0) {
      const promoPayload = db.promotoras.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        passiveEarningsEUR: c.passiveEarningsEUR,
        pendingPayoutEUR: c.pendingPayoutEUR,
        raw_data: c
      }));
      await supabase.from('promotoras').upsert(promoPayload);
    }

    // Sync Transactions (only recent ones to avoid massive payload)
    if (db.transactions && db.transactions.length > 0) {
      const txPayload = db.transactions.slice(-50).map((c: any) => ({
        id: c.id,
        clientId: c.clientId,
        vendedorId: c.vendedorId,
        customerId: c.customerId,
        type: c.type,
        amount: c.amount,
        status: c.status,
        raw_data: c
      }));
      await supabase.from('transactions').upsert(txPayload);
    }

    // Products
    if (db.products && db.products.length > 0) {
      const prodPayload = db.products.map((c: any) => ({
        id: c.id,
        clientId: c.clientId,
        name: c.name,
        price: c.price,
        raw_data: c
      }));
      await supabase.from('products').upsert(prodPayload);
    }

    console.log('[Supabase Relational Sync] Tablas actualizadas con éxito.');
  } catch (error) {
    console.error('[Supabase Relational Sync] Error sincronizando tablas:', error);
  }
};

export const fetchFromRelational = async () => {
  if (!supabase) return null;
  try {
    const [
      { data: clients },
      { data: customers },
      { data: promotoras },
      { data: transactions },
      { data: products }
    ] = await Promise.all([
      supabase.from('clients').select('raw_data'),
      supabase.from('customers').select('raw_data'),
      supabase.from('promotoras').select('raw_data'),
      supabase.from('transactions').select('raw_data'),
      supabase.from('products').select('raw_data')
    ]);

    const remoteDb: any = {};
    if (clients) remoteDb.clients = clients.map((r: any) => r.raw_data);
    if (customers) remoteDb.customers = customers.map((r: any) => r.raw_data);
    if (promotoras) remoteDb.promotoras = promotoras.map((r: any) => r.raw_data);
    if (transactions) remoteDb.transactions = transactions.map((r: any) => r.raw_data);
    if (products) remoteDb.products = products.map((r: any) => r.raw_data);

    return remoteDb;
  } catch (error) {
    console.error('[Supabase Relational Sync] Error bajando datos:', error);
    return null;
  }
};
