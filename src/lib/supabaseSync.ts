import { supabase, isSupabaseConfigured } from '../context/supabase';

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

// Enterprise Multi-Layer Relational Sync Engine
export const syncToRelational = async (db: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    // 1. Sync Clients (Both tables for universal compatibility)
    if (db.clients && db.clients.length > 0) {
      const standardClients = db.clients.map((c: any) => ({
        id: c.id,
        promotoraId: c.promotoraId || null,
        company: c.company || c.name || "KFS Business",
        name: c.name || c.company || "KFS Business",
        email: c.email || `${c.id}@kfs.com`,
        phone: c.phone || "",
        password: c.password || "000",
        address: c.address || "N/A",
        rating: c.rating || 5.0,
        reviewCount: c.reviewCount || 0,
        kfsFeePercentage: c.kfsFeePercentage || 0.05,
        fee_tier: c.fee_tier || "5%",
        is_founder: !!c.is_founder,
        kfsFeesOwedUSD: c.kfsFeesOwedUSD || 0,
        isOnboarded: !!c.isOnboarded,
        walletBalanceUSD: c.walletBalanceUSD || 0,
        salesUSD: c.salesUSD || 0,
        pendingPayoutUSD: c.pendingPayoutUSD || 0,
        subscription: c.subscription || null,
        storeSettings: c.storeSettings || {},
        created_at: c.created_at || new Date().toISOString(),
        raw_data: cleanBase64(c)
      }));

      await supabase.from('clients').upsert(standardClients, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] clients table upsert notice:', e.message));

      const kfsClients = db.clients.map((c: any) => ({
        id: c.id,
        business_name: c.company || c.name || "KFS Business",
        wallet_balance_usd: c.walletBalanceUSD || 0,
        k_points_balance: c.k_points_balance || 0,
        subscription: c.subscription || null,
        raw_data: cleanBase64(c),
        created_at: c.created_at || new Date().toISOString()
      }));
      await supabase.from('kfs_clients').upsert(kfsClients, { onConflict: 'id' }).catch(() => {});
    }
    
    // 2. Sync Customers
    if (db.customers && db.customers.length > 0) {
      const standardCustomers = db.customers.map((c: any) => ({
        id: c.id,
        phone: c.phone || "",
        name: c.name || "Cliente KFS",
        email: c.email || `${c.id}@kfs.com`,
        password: c.password || "000",
        walletUSD: c.walletUSD || c.walletBalanceUSD || 0,
        k_points_balance: c.kpointsBalance || c.k_points_balance || 0,
        referralCode: c.referralCode || "",
        referredBy: c.referredBy || "",
        avatar: typeof c.avatar === 'string' && c.avatar.startsWith('data:') ? '[BASE64]' : (c.avatar || ""),
        created_at: c.created_at || new Date().toISOString(),
        raw_data: cleanBase64(c)
      }));
      await supabase.from('customers').upsert(standardCustomers, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] customers table upsert notice:', e.message));

      const kfsCustomers = db.customers.map((c: any) => ({
        id: c.id,
        name: c.name || "Cliente KFS",
        email: c.email || `${c.id}@kfs.com`,
        phone: c.phone || "",
        referred_by: c.referredBy || "",
        kpoints_balance: c.kpointsBalance || c.k_points_balance || 0,
        created_at: c.created_at || new Date().toISOString()
      }));
      await supabase.from('kfs_customers').upsert(kfsCustomers, { onConflict: 'id' }).catch(() => {});
    }

    // 3. Sync Products
    if (db.products && db.products.length > 0) {
      const standardProducts = db.products.map((p: any) => ({
        id: p.id,
        clientId: p.clientId || p.seller_id || "kfs-express",
        name: p.name || "Producto KFS",
        price: p.priceUSD || p.price || 0,
        cost: p.costUSD || p.cost || 0,
        stock: p.stock ?? 0,
        category: p.category || "General",
        barcode: p.barcode || "",
        image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
        isDigital: !!p.isDigital,
        isFeatured: !!p.isFeatured,
        created_at: p.created_at || new Date().toISOString(),
        raw_data: cleanBase64(p)
      }));
      await supabase.from('products').upsert(standardProducts, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] products table upsert notice:', e.message));

      const kfsProducts = db.products.map((p: any) => ({
        id: p.id,
        seller_id: p.clientId || p.seller_id || "kfs-express",
        name: p.name || "Producto KFS",
        price_usd: p.priceUSD || p.price || 0,
        stock: p.stock ?? 0,
        description: p.description || "",
        image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
        category: p.category || "General",
        cost_usd: p.costUSD || p.cost || 0,
        created_at: p.created_at || new Date().toISOString()
      }));
      await supabase.from('kfs_products').upsert(kfsProducts, { onConflict: 'id' }).catch(() => {});
    }

    // 4. Sync Promotoras
    if (db.promotoras && db.promotoras.length > 0) {
      const standardPromos = db.promotoras.map((p: any) => ({
        id: p.id,
        name: p.name || "Promotora KFS",
        email: p.email || `${p.id}@kfs.com`,
        phone: p.phone || "",
        password: p.password || "000",
        kycStatus: p.kycStatus || "approved",
        kycCedula: p.kycCedula || "",
        kycPhoto: typeof p.avatar === 'string' && p.avatar.startsWith('data:') ? '[BASE64]' : (p.avatar || ""),
        passiveEarningsEUR: p.passiveEarningsEUR || p.earnings || 0,
        pendingPayoutEUR: p.pendingPayoutEUR || 0,
        created_at: p.created_at || new Date().toISOString(),
        raw_data: cleanBase64(p)
      }));
      await supabase.from('promotoras').upsert(standardPromos, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] promotoras table upsert notice:', e.message));
    }

    // 5. Sync Riders
    if (db.riders && db.riders.length > 0) {
      const standardRiders = db.riders.map((r: any) => ({
        id: r.id,
        name: r.name || "Rider KFS",
        email: r.email || `${r.id}@kfs.com`,
        phone: r.phone || "",
        password: r.password || "000",
        vehicleType: r.vehicleType || "Moto",
        status: r.status || "available",
        walletBalanceUSD: r.earningsUSD || r.walletBalanceUSD || 0,
        assignedToBusiness: r.assignedToBusiness || null,
        currentLocation: r.currentLocation || null,
        created_at: r.created_at || new Date().toISOString(),
        raw_data: cleanBase64(r)
      }));
      await supabase.from('riders').upsert(standardRiders, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] riders table upsert notice:', e.message));
    }

    // 6. Sync Transactions
    if (db.transactions && db.transactions.length > 0) {
      const standardTx = db.transactions.map((t: any) => ({
        id: t.id,
        clientId: t.clientId || t.senderId || "System",
        vendedorId: t.vendedorId || null,
        customerId: t.customerId || null,
        type: t.type || "SALE",
        amount: t.amountUSD || t.amount || 0,
        paymentMethod: t.paymentMethod || t.currency || "USD",
        status: t.status || "COMPLETED",
        timestamp: t.date || t.timestamp || new Date().toISOString(),
        items: cleanBase64(t.items || []),
        raw_data: cleanBase64(t)
      }));
      await supabase.from('transactions').upsert(standardTx, { onConflict: 'id' }).catch((e: any) => console.warn('[Supabase Sync] transactions table upsert notice:', e.message));
    }
  } catch (error) {
    console.warn("[Supabase Sync] syncToRelational general error:", error);
  }
};

export const syncSingleTransaction = async (t: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: t.id,
      clientId: t.clientId || t.senderId || "System",
      vendedorId: t.vendedorId || null,
      customerId: t.customerId || null,
      type: t.type || "SALE",
      amount: t.amountUSD || t.amount || 0,
      paymentMethod: t.paymentMethod || t.currency || "USD",
      status: t.status || "COMPLETED",
      timestamp: t.date || t.timestamp || new Date().toISOString(),
      items: cleanBase64(t.items || []),
      raw_data: cleanBase64(t)
    };
    await supabase.from('transactions').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn("[Supabase Sync] syncSingleTransaction notice:", err);
  }
};

export const syncSingleClient = async (c: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: c.id,
      promotoraId: c.promotoraId || null,
      company: c.company || c.name || "KFS Business",
      name: c.name || c.company || "KFS Business",
      email: c.email || `${c.id}@kfs.com`,
      phone: c.phone || "",
      password: c.password || "000",
      address: c.address || "N/A",
      rating: c.rating || 5.0,
      reviewCount: c.reviewCount || 0,
      kfsFeePercentage: c.kfsFeePercentage || 0.05,
      fee_tier: c.fee_tier || "5%",
      is_founder: !!c.is_founder,
      kfsFeesOwedUSD: c.kfsFeesOwedUSD || 0,
      isOnboarded: !!c.isOnboarded,
      walletBalanceUSD: c.walletBalanceUSD || 0,
      salesUSD: c.salesUSD || 0,
      pendingPayoutUSD: c.pendingPayoutUSD || 0,
      subscription: c.subscription || null,
      storeSettings: c.storeSettings || {},
      created_at: c.created_at || new Date().toISOString(),
      raw_data: cleanBase64(c)
    };
    await supabase.from('clients').upsert(payload, { onConflict: 'id' });

    // Also sync to kfs_clients for multi-system compatibility
    await supabase.from('kfs_clients').upsert({
      id: c.id,
      business_name: c.company || c.name || "KFS Business",
      wallet_balance_usd: c.walletBalanceUSD || 0,
      k_points_balance: c.k_points_balance || 0,
      subscription: c.subscription || null,
      raw_data: cleanBase64(c),
      created_at: c.created_at || new Date().toISOString()
    }, { onConflict: 'id' }).catch(() => {});
  } catch (err) {
    console.warn("[Supabase Sync] syncSingleClient notice:", err);
  }
};

export const syncSingleCustomer = async (c: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: c.id,
      phone: c.phone || "",
      name: c.name || "Cliente KFS",
      email: c.email || `${c.id}@kfs.com`,
      password: c.password || "000",
      walletUSD: c.walletUSD || c.walletBalanceUSD || 0,
      k_points_balance: c.kpointsBalance || c.k_points_balance || 0,
      referralCode: c.referralCode || "",
      referredBy: c.referredBy || "",
      avatar: typeof c.avatar === 'string' && c.avatar.startsWith('data:') ? '[BASE64]' : (c.avatar || ""),
      created_at: c.created_at || new Date().toISOString(),
      raw_data: cleanBase64(c)
    };
    await supabase.from('customers').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn("[Supabase Sync] syncSingleCustomer notice:", err);
  }
};

export const syncSingleProduct = async (p: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: p.id,
      clientId: p.clientId || p.seller_id || "kfs-express",
      name: p.name || "Producto KFS",
      price: p.priceUSD || p.price || 0,
      cost: p.costUSD || p.cost || 0,
      stock: p.stock ?? 0,
      category: p.category || "General",
      barcode: p.barcode || "",
      image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
      isDigital: !!p.isDigital,
      isFeatured: !!p.isFeatured,
      created_at: p.created_at || new Date().toISOString(),
      raw_data: cleanBase64(p)
    };
    await supabase.from('products').upsert(payload, { onConflict: 'id' });

    // Also sync to kfs_products
    await supabase.from('kfs_products').upsert({
      id: p.id,
      seller_id: p.clientId || p.seller_id || "kfs-express",
      name: p.name || "Producto KFS",
      price_usd: p.priceUSD || p.price || 0,
      stock: p.stock ?? 0,
      description: p.description || "",
      image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
      category: p.category || "General",
      cost_usd: p.costUSD || p.cost || 0,
      created_at: p.created_at || new Date().toISOString()
    }, { onConflict: 'id' }).catch(() => {});
  } catch (err) {
    console.warn("[Supabase Sync] syncSingleProduct notice:", err);
  }
};

export const syncSinglePromotora = async (p: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: p.id,
      name: p.name || "Promotora KFS",
      email: p.email || `${p.id}@kfs.com`,
      phone: p.phone || "",
      password: p.password || "000",
      kycStatus: p.kycStatus || "approved",
      kycCedula: p.kycCedula || "",
      kycPhoto: typeof p.avatar === 'string' && p.avatar.startsWith('data:') ? '[BASE64]' : (p.avatar || ""),
      passiveEarningsEUR: p.passiveEarningsEUR || p.earnings || 0,
      pendingPayoutEUR: p.pendingPayoutEUR || 0,
      created_at: p.created_at || new Date().toISOString(),
      raw_data: cleanBase64(p)
    };
    await supabase.from('promotoras').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn("[Supabase Sync] syncSinglePromotora notice:", err);
  }
};

export const syncSingleRider = async (r: any) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: r.id,
      name: r.name || "Rider KFS",
      email: r.email || `${r.id}@kfs.com`,
      phone: r.phone || "",
      password: r.password || "000",
      vehicleType: r.vehicleType || "Moto",
      status: r.status || "available",
      walletBalanceUSD: r.earningsUSD || r.walletBalanceUSD || 0,
      assignedToBusiness: r.assignedToBusiness || null,
      currentLocation: r.currentLocation || null,
      created_at: r.created_at || new Date().toISOString(),
      raw_data: cleanBase64(r)
    };
    await supabase.from('riders').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn("[Supabase Sync] syncSingleRider notice:", err);
  }
};

export const forceDirectCloudSync = async (database: any) => {
  if (!supabase || !isSupabaseConfigured || !database) return;
  const syncId = "kfs-general-db-prod";
  try {
    const compressed = {
      ...database,
      transactions: database.transactions?.slice(-50) || [],
      auditLogs: database.auditLogs?.slice(-50) || [],
      zReports: database.zReports?.slice(-50) || [],
      ghostLogs: database.ghostLogs?.slice(-50) || [],
      orders: database.orders?.slice(-50) || [],
      expenses: database.expenses?.slice(-50) || []
    };
    
    await supabase.from('kfs_store_states').upsert({
      id: syncId,
      db_state: compressed,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    // Also trigger relational sync in background
    syncToRelational(database);
  } catch (err) {
    console.warn("[Supabase Sync] forceDirectCloudSync error:", err);
  }
};
