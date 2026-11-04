import { NextResponse } from 'next/server';
import { initialDB, CURRENT_WIPE_VERSION } from '@/config/initialDB';
import {
  DEMO_COMMERCE_ID,
  DEMO_COMMERCE_CLIENT,
  DEMO_COMMERCE_PRODUCTS,
  DEMO_COMMERCE_VENDEDORES,
  DEMO_COMMERCE_VALES,
  DEMO_COMMERCE_RIDERS,
  DEMO_COMMERCE_TRANSACTIONS,
  DEMO_COMMERCE_CUSTOMERS
} from '@/config/demoCommerceDB';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cleanEnv = (val?: string) => (val ? val.replace(/[\uFEFF\u200B]/g, '').trim() : '');

// In-Memory Cloud State Hub (Serves all connected devices and phones across instances)
let serverCloudDb: any = null;
let serverUpdatedAt: string = new Date().toISOString();

function getInitialCloudDb() {
  const base = { ...initialDB };

  // Inject standard demo commerce baseline if not present
  if (!base.clients) base.clients = [];
  if (!base.clients.some((c: any) => c.id === DEMO_COMMERCE_ID)) {
    base.clients.push(DEMO_COMMERCE_CLIENT);
  }

  if (!base.products) base.products = [];
  DEMO_COMMERCE_PRODUCTS.forEach((p: any) => {
    if (!base.products.some((ep: any) => ep.id === p.id)) {
      base.products.push(p);
    }
  });

  if (!base.vendedores) base.vendedores = [];
  DEMO_COMMERCE_VENDEDORES.forEach((v: any) => {
    if (!base.vendedores.some((ev: any) => ev.id === v.id)) {
      base.vendedores.push(v);
    }
  });

  if (!base.vales) base.vales = [];
  DEMO_COMMERCE_VALES.forEach((v: any) => {
    if (!base.vales.some((ev: any) => ev.id === v.id)) {
      base.vales.push(v);
    }
  });

  if (!base.riders) base.riders = [];
  DEMO_COMMERCE_RIDERS.forEach((r: any) => {
    if (!base.riders.some((er: any) => er.id === r.id)) {
      base.riders.push(r);
    }
  });

  if (!base.customers) base.customers = [];
  DEMO_COMMERCE_CUSTOMERS.forEach((c: any) => {
    if (!base.customers.some((ec: any) => ec.id === c.id)) {
      base.customers.push(c);
    }
  });

  if (!base.transactions) base.transactions = [];
  if (!base.transactions.some((t: any) => t.clientId === DEMO_COMMERCE_ID)) {
    base.transactions.push(...DEMO_COMMERCE_TRANSACTIONS);
  }

  return base;
}

function ensureCloudDb() {
  if (!serverCloudDb) {
    serverCloudDb = getInitialCloudDb();
    serverUpdatedAt = new Date().toISOString();
  }
  return serverCloudDb;
}

const getItemKey = (item: any) => {
  if (!item) return null;
  return item.id || item.timestamp || item.barcode || (typeof item === 'object' ? JSON.stringify(item) : String(item));
};

function mergeAdditiveArray(existingArr: any[] = [], incomingArr: any[] = []) {
  const map = new Map();
  existingArr.forEach((item) => {
    const key = getItemKey(item);
    if (key) map.set(key, item);
  });
  incomingArr.forEach((item) => {
    const key = getItemKey(item);
    if (key) map.set(key, item);
  });
  return Array.from(map.values());
}

async function tryPushToSupabase(dbState: any) {
  const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    await fetch(`${supabaseUrl}/rest/v1/kfs_store_states`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 'kfs-general-db-prod',
        db_state: dbState,
        updated_at: serverUpdatedAt
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (_) {
    // Graceful fallback: Server Cloud Hub continues operating seamlessly
  }
}

// GET: Sincronización ultrarrápida (delta check por timestamp)
export async function GET(request: Request) {
  const db = ensureCloudDb();
  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since');

  // Si el cliente ya tiene la última marca de tiempo, responder inmediatamente con payload mínimo
  if (since && since >= serverUpdatedAt) {
    return NextResponse.json(
      {
        status: 'up_to_date',
        updated_at: serverUpdatedAt,
        server_time: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }

  // Devolver estado completo de la nube para hidratación
  return NextResponse.json(
    {
      status: 'updated',
      updated_at: serverUpdatedAt,
      db_state: db
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    }
  );
}

// POST: Recepción de eventos atómicos o estado de sincronización multidispositivo
export async function POST(request: Request) {
  const db = ensureCloudDb();

  try {
    const body = await request.json();
    const { action, payload, db_state } = body || {};

    if (action === 'FULL_SYNC' && db_state) {
      // Fusión aditiva completa preservando datos existentes
      const collections = [
        'orders', 'transactions', 'auditLogs', 'supportTickets',
        'products', 'clients', 'promotoras', 'vendedores',
        'customers', 'riders', 'expenses', 'posTerminals',
        'zReports', 'blindAudits', 'vales', 'candidates',
        'unlockedContacts', 'coupons', 'rewardTasks', 'rewardSubmissions',
        'kfsNetworkLedger', 'topups', 'fiscalLogs', 'crm', 'notifications'
      ];

      for (const col of collections) {
        if (Array.isArray(db_state[col])) {
          db[col] = mergeAdditiveArray(db[col] || [], db_state[col]);
        }
      }

      if (db_state.kreatekCore) {
        db.kreatekCore = {
          ...(db.kreatekCore || {}),
          ...db_state.kreatekCore,
          wipeVersion: CURRENT_WIPE_VERSION
        };
      }
    } else if (action === 'TRANSACTION' && payload) {
      if (!db.transactions) db.transactions = [];
      const key = getItemKey(payload);
      const exists = db.transactions.some((t: any) => getItemKey(t) === key);
      if (!exists) {
        db.transactions.push(payload);
        if (db.transactions.length > 2000) {
          db.transactions = db.transactions.slice(-2000);
        }
        // Si la transacción incluye items vendidos, descontar stock en la nube
        if (Array.isArray(payload.items)) {
          payload.items.forEach((it: any) => {
            const p = (db.products || []).find((prod: any) => prod.id === it.id);
            if (p && p.stock !== undefined) {
              p.stock = Math.max(0, p.stock - (it.qty || 1));
            }
          });
        }
      }
    } else if (action === 'PRODUCT' && payload) {
      if (!db.products) db.products = [];
      const key = getItemKey(payload);
      const idx = db.products.findIndex((p: any) => getItemKey(p) === key);
      if (idx >= 0) {
        db.products[idx] = { ...db.products[idx], ...payload };
      } else {
        db.products.push(payload);
      }
    } else if (action === 'CLIENT' && payload) {
      if (!db.clients) db.clients = [];
      const key = getItemKey(payload);
      const idx = db.clients.findIndex((c: any) => getItemKey(c) === key);
      if (idx >= 0) {
        db.clients[idx] = { ...db.clients[idx], ...payload };
      } else {
        db.clients.push(payload);
      }
    } else if (action === 'CUSTOMER' && payload) {
      if (!db.customers) db.customers = [];
      const key = getItemKey(payload);
      const idx = db.customers.findIndex((c: any) => getItemKey(c) === key);
      if (idx >= 0) {
        db.customers[idx] = { ...db.customers[idx], ...payload };
      } else {
        db.customers.push(payload);
      }
    } else if (action === 'EXPENSE' && payload) {
      if (!db.expenses) db.expenses = [];
      db.expenses.push(payload);
    } else if (action === 'Z_REPORT' && payload) {
      if (!db.zReports) db.zReports = [];
      db.zReports.push(payload);
    } else if (action === 'VALE' && payload) {
      if (!db.vales) db.vales = [];
      const key = getItemKey(payload);
      const idx = db.vales.findIndex((v: any) => getItemKey(v) === key);
      if (idx >= 0) {
        db.vales[idx] = { ...db.vales[idx], ...payload };
      } else {
        db.vales.push(payload);
      }
    } else if (action === 'PROMOTORA' && payload) {
      if (!db.promotoras) db.promotoras = [];
      const key = getItemKey(payload);
      const idx = db.promotoras.findIndex((p: any) => getItemKey(p) === key);
      if (idx >= 0) {
        db.promotoras[idx] = { ...db.promotoras[idx], ...payload };
      } else {
        db.promotoras.push(payload);
      }
    } else if (action === 'RIDER' && payload) {
      if (!db.riders) db.riders = [];
      const key = getItemKey(payload);
      const idx = db.riders.findIndex((r: any) => getItemKey(r) === key);
      if (idx >= 0) {
        db.riders[idx] = { ...db.riders[idx], ...payload };
      } else {
        db.riders.push(payload);
      }
    } else if (action === 'BATCH' && payload?.type && Array.isArray(payload?.items)) {
      const col = payload.type;
      if (!db[col]) db[col] = [];
      db[col] = mergeAdditiveArray(db[col], payload.items);
    }

    serverUpdatedAt = new Date().toISOString();
    tryPushToSupabase(db);

    return NextResponse.json({
      status: 'success',
      updated_at: serverUpdatedAt,
      action
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error processing cloud sync' },
      { status: 500 }
    );
  }
}

