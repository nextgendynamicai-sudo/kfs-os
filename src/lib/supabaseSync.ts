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

// Enterprise Phase 4: Sync Logic updated to map to strict Relational Schema
export const syncToRelational = async (db: any) => {
  if (!supabase) return;
  try {
    // 1. Sync Clients
    if (db.clients && db.clients.length > 0) {
      const clientsPayload = db.clients.map((c: any) => ({
        id: c.id,
        company: c.company || c.name || "KFS Business",
        email: c.email || `${c.id}@kfs.com`,
        password_hash: c.password || "000",
        address: c.address || "N/A",
        rating: c.rating || 5.0,
        review_count: c.reviewCount || 0,
        kfs_fee_percentage: c.kfsFeePercentage || 0.05,
        fee_tier: c.fee_tier || "5%",
        is_founder: !!c.is_founder,
        kfs_fees_owed_usd: c.kfsFeesOwedUSD || 0,
        is_onboarded: !!c.isOnboarded,
        wallet_balance_usd: c.walletBalanceUSD || 0,
        sales_usd: c.salesUSD || 0,
        store_bio: c.storeSettings?.bioText || "",
        store_theme_color: c.storeSettings?.themeColor || "",
        store_typography: c.storeSettings?.typography || "",
        store_layout_type: c.storeSettings?.layoutType || "",
        store_profile_pic_url: c.storeSettings?.profilePicUrl || "",
        created_at: new Date().toISOString()
      }));
      await supabase.from('kfs_clients').upsert(clientsPayload, { onConflict: 'id' });
    }
    
    // 2. Sync Customers
    if (db.customers && db.customers.length > 0) {
      const customersPayload = db.customers.map((c: any) => ({
        id: c.id,
        name: c.name || "Cliente KFS",
        email: c.email || `${c.id}@kfs.com`,
        phone: c.phone || "",
        referred_by: c.referredBy || "",
        kpoints_balance: c.kpointsBalance || c.k_points_balance || 0,
        created_at: new Date().toISOString()
      }));
      await supabase.from('kfs_customers').upsert(customersPayload, { onConflict: 'id' });
    }

    // 3. Sync Products
    if (db.products && db.products.length > 0) {
      const productsPayload = db.products.map((p: any) => ({
        id: p.id,
        seller_id: p.clientId,
        name: p.name || "Producto KFS",
        price_usd: p.priceUSD || 0,
        stock: p.stock || 0,
        description: p.description || "",
        image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
        category: p.category || "General",
        cost_usd: p.costUSD || 0,
        created_at: new Date().toISOString()
      }));
      await supabase.from('kfs_products').upsert(productsPayload, { onConflict: 'id' });
    }

    // 4. Sync Promotoras
    if (db.promotoras && db.promotoras.length > 0) {
      const promosPayload = db.promotoras.map((p: any) => ({
        id: p.id,
        name: p.name || "Promotora KFS",
        email: p.email || `${p.id}@kfs.com`,
        pago_movil: p.pagoMovil || "",
        binance_id: p.binanceId || "",
        avatar: typeof p.avatar === 'string' && p.avatar.startsWith('data:') ? '[BASE64]' : (p.avatar || ""),
        kyc_cedula: p.kycCedula || "",
        kyc_address: p.kycAddress || "",
        referred_by: p.referredBy || "",
        earnings: p.passiveEarningsEUR || 0,
        referrals_count: p.setups || 0,
        created_at: new Date().toISOString()
      }));
      await supabase.from('kfs_promotoras').upsert(promosPayload, { onConflict: 'id' });
    }

    // 5. Sync Riders
    if (db.riders && db.riders.length > 0) {
      const ridersPayload = db.riders.map((r: any) => ({
        id: r.id,
        name: r.name || "Rider KFS",
        email: r.email || `${r.id}@kfs.com`,
        phone: r.phone || "",
        vehicle_type: r.vehicleType || "Moto",
        cedula_img: r.kycCedula || "",
        pago_movil_banco: r.pagoMovilBanco || "",
        pago_movil_telefono: r.pagoMovilTelefono || "",
        pago_movil_cedula: r.pagoMovilCedula || "",
        referred_by: r.referredBy || "",
        deliveries: r.deliveries || 0,
        earnings: r.earningsUSD || 0,
        kpoints_balance: r.kpointsBalance || 0,
        created_at: new Date().toISOString()
      }));
      await supabase.from('kfs_riders').upsert(ridersPayload, { onConflict: 'id' });
    }

    // 6. Sync Transactions
    if (db.transactions && db.transactions.length > 0) {
      const txPayload = db.transactions.map((t: any) => ({
        id: t.id,
        type: t.type || "SALE",
        amount_usd: t.amountUSD || t.amount || 0,
        currency: t.currency || "USD",
        status: t.status || "COMPLETED",
        sender_id: t.senderId || t.clientId || t.customerId || "System",
        receiver_id: t.receiverId || t.clientId || "System",
        metadata: cleanBase64(t),
        created_at: t.date || new Date().toISOString()
      }));
      await supabase.from('kfs_transactions').upsert(txPayload, { onConflict: 'id' });
    }
  } catch (error) {
    console.warn("syncToRelational failed:", error);
  }
};

export const syncSingleTransaction = async (t: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: t.id,
      type: t.type || "SALE",
      amount_usd: t.amountUSD || t.amount || 0,
      currency: t.currency || "USD",
      status: t.status || "COMPLETED",
      sender_id: t.senderId || t.clientId || t.customerId || "System",
      receiver_id: t.receiverId || t.clientId || "System",
      metadata: cleanBase64(t),
      created_at: t.date || new Date().toISOString()
    };
    await supabase.from('kfs_transactions').upsert(payload);
  } catch (err) {
    console.warn("syncSingleTransaction bypass:", err);
  }
};

export const syncSingleClient = async (c: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: c.id,
      company: c.company || c.name || "KFS Business",
      email: c.email || `${c.id}@kfs.com`,
      password_hash: c.password || "000",
      address: c.address || "N/A",
      rating: c.rating || 5.0,
      review_count: c.reviewCount || 0,
      kfs_fee_percentage: c.kfsFeePercentage || 0.05,
      fee_tier: c.fee_tier || "5%",
      is_founder: !!c.is_founder,
      kfs_fees_owed_usd: c.kfsFeesOwedUSD || 0,
      is_onboarded: !!c.isOnboarded,
      wallet_balance_usd: c.walletBalanceUSD || 0,
      sales_usd: c.salesUSD || 0,
      store_bio: c.storeSettings?.bioText || "",
      created_at: new Date().toISOString()
    };
    await supabase.from('kfs_clients').upsert(payload);
  } catch (err) {
    console.warn("syncSingleClient bypass:", err);
  }
};

export const syncSingleCustomer = async (c: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: c.id,
      name: c.name || "Cliente KFS",
      email: c.email || `${c.id}@kfs.com`,
      phone: c.phone || "",
      referred_by: c.referredBy || "",
      kpoints_balance: c.kpointsBalance || c.k_points_balance || 0,
      created_at: new Date().toISOString()
    };
    await supabase.from('kfs_customers').upsert(payload);
  } catch (err) {
    console.warn("syncSingleCustomer bypass:", err);
  }
};

export const syncSingleProduct = async (p: any) => {
  if (!supabase) return;
  try {
    const payload = {
      id: p.id,
      seller_id: p.clientId,
      name: p.name || "Producto KFS",
      price_usd: p.priceUSD || 0,
      stock: p.stock || 0,
      description: p.description || "",
      image: typeof p.image === 'string' && p.image.startsWith('data:') ? '[BASE64]' : (p.image || ""),
      category: p.category || "General",
      cost_usd: p.costUSD || 0,
      created_at: new Date().toISOString()
    };
    await supabase.from('kfs_products').upsert(payload);
  } catch (err) {
    console.warn("syncSingleProduct bypass:", err);
  }
};
