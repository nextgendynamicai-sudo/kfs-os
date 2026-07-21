import { supabase } from '../context/supabase';

const cleanBase64 = (obj: any): any => {
  if (!obj) return obj;
  if (typeof obj === 'string' && obj.startsWith('data:image')) {
    return '[BASE64_IMAGE_STRIPPED_FOR_EGRESS_QUOTA]';
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanBase64);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = cleanBase64(obj[key]);
    }
    return newObj;
  }
  return obj;
};

export const syncToRelational = async (db: any) => {
  if (!supabase) return;
  try {
    // Sync Clients
    if (db.clients && db.clients.length > 0) {
      const clientsPayload = db.clients.map((c: any) => ({
        id: c.id,
        business_name: c.company || c.name || "KFS Business",
        wallet_balance_usd: c.walletBalanceUSD || 0,
        k_points_balance: 0,
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_clients').upsert(clientsPayload, { onConflict: 'id' });
    }
    
    // Sync Customers
    if (db.customers && db.customers.length > 0) {
      const customersPayload = db.customers.map((c: any) => ({
        id: c.id,
        phone: c.phone || "",
        name: c.name || "Customer",
        wallet_balance_usd: c.walletUSD || 0,
        k_points_balance: c.k_points_balance || 0,
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_customers').upsert(customersPayload, { onConflict: 'id' });
    }

    // Sync Promotoras
    if (db.promotoras && db.promotoras.length > 0) {
      const promoPayload = db.promotoras.map((c: any) => ({
        id: c.id,
        name: c.name || "Promotora",
        passive_earnings_eur: c.passiveEarningsEUR || 0,
        pending_payout_eur: c.pendingPayoutEUR || 0,
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_promotoras').upsert(promoPayload, { onConflict: 'id' });
    }

    // Sync Riders
    if (db.riders && db.riders.length > 0) {
      const ridersPayload = db.riders.map((c: any) => ({
        id: c.id,
        name: c.name || "Rider",
        wallet_balance_usd: c.walletBalanceUSD || 0,
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_riders').upsert(ridersPayload, { onConflict: 'id' });
    }

    // Sync Transactions (only recent ones)
    if (db.transactions && db.transactions.length > 0) {
      const txPayload = db.transactions.slice(-50).map((c: any) => ({
        id: c.id,
        client_id: c.clientId || null,
        customer_id: c.customerId || null,
        amount_usd: c.amount || 0,
        fee_collected_usd: 0.04, // Default per your spec
        k_points_burned: 0,
        type: c.type || "standard",
        status: c.status || "completed",
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_transactions').upsert(txPayload, { onConflict: 'id' });
    }

    // Products
    if (db.products && db.products.length > 0) {
      const prodPayload = db.products.map((c: any) => ({
        id: c.id,
        client_id: c.clientId || null,
        name: c.name || "Producto",
        price_usd: c.price || 0,
        image_url: c.photoUrl || "",
        stock: c.stock || 0,
        raw_data: cleanBase64(c)
      }));
      await supabase.from('kfs_products').upsert(prodPayload, { onConflict: 'id' });
    }

    console.log('[Supabase Relational Sync] Tablas normalizadas kfs_ actualizadas con éxito.');
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
      { data: riders },
      { data: transactions },
      { data: products }
    ] = await Promise.all([
      supabase.from('kfs_clients').select('raw_data'),
      supabase.from('kfs_customers').select('raw_data'),
      supabase.from('kfs_promotoras').select('raw_data'),
      supabase.from('kfs_riders').select('raw_data'),
      supabase.from('kfs_transactions').select('raw_data'),
      supabase.from('kfs_products').select('raw_data')
    ]);

    const remoteDb: any = {};
    if (clients) remoteDb.clients = clients.map((r: any) => r.raw_data);
    if (customers) remoteDb.customers = customers.map((r: any) => r.raw_data);
    if (promotoras) remoteDb.promotoras = promotoras.map((r: any) => r.raw_data);
    if (riders) remoteDb.riders = riders.map((r: any) => r.raw_data);
    if (transactions) remoteDb.transactions = transactions.map((r: any) => r.raw_data);
    if (products) remoteDb.products = products.map((r: any) => r.raw_data);

    return remoteDb;
  } catch (error) {
    console.error('[Supabase Relational Sync] Error bajando datos kfs_:', error);
    return null;
  }
};

export const syncSingleTransaction = async (tx: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: tx.id || `tx_${Date.now()}`,
      client_id: tx.clientId || null,
      customer_id: tx.customerId || null,
      amount_usd: tx.amountUSD || tx.amount || tx.subtotalUSD || 0,
      fee_collected_usd: tx.kfsFeeUSD || tx.kfsFee || 0.04,
      k_points_burned: tx.kPointsBurned || 0,
      type: tx.type || 'sale',
      status: tx.status || 'completed',
      raw_data: cleanBase64(tx)
    };
    await supabase.from('kfs_transactions').upsert([payload], { onConflict: 'id' });
    console.log('[Supabase Write-Through] Transacción espejo sincronizada con éxito:', tx.id);
  } catch (e) {
    console.warn('[Supabase Write-Through Bypass] Error en sync de transacción:', e);
  }
};

export const syncSingleClient = async (client: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: client.id,
      business_name: client.company || client.name || 'KFS Business',
      wallet_balance_usd: client.walletBalanceUSD || client.wallet_balance || 0,
      k_points_balance: client.kPoints || 0,
      raw_data: cleanBase64(client)
    };
    await supabase.from('kfs_clients').upsert([payload], { onConflict: 'id' });
    console.log('[Supabase Write-Through] Cliente espejo sincronizado con éxito:', client.id);
  } catch (e) {
    console.warn('[Supabase Write-Through Bypass] Error en sync de cliente:', e);
  }
};

export const syncSingleCustomer = async (customer: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: customer.id,
      phone: customer.phone || '',
      name: customer.name || 'Customer',
      wallet_balance_usd: customer.real_balance || customer.walletUSD || 0,
      k_points_balance: customer.k_points_balance || customer.kPoints || 0,
      raw_data: cleanBase64(customer)
    };
    await supabase.from('kfs_customers').upsert([payload], { onConflict: 'id' });
    console.log('[Supabase Write-Through] Consumidor espejo sincronizado con éxito:', customer.id);
  } catch (e) {
    console.warn('[Supabase Write-Through Bypass] Error en sync de consumidor:', e);
  }
};

export const syncSingleProduct = async (product: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: product.id,
      client_id: product.clientId || null,
      name: product.name || 'Producto',
      price_usd: typeof product.price === 'number' ? product.price : parseFloat(product.price || 0),
      image_url: product.photoUrl || product.image || '',
      stock: product.stock || 0,
      raw_data: cleanBase64(product)
    };
    await supabase.from('kfs_products').upsert([payload], { onConflict: 'id' });
    console.log('[Supabase Write-Through] Producto espejo sincronizado con éxito:', product.id);
  } catch (e) {
    console.warn('[Supabase Write-Through Bypass] Error en sync de producto:', e);
  }
};
