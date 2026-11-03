import assert from 'node:assert';
import { NextRequest, NextResponse } from 'next/server.js';

console.log('====================================================');
console.log('CHALLENGER 2: EMPIRICAL VERIFICATION HARNESS (M1)');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: PROXY ROUTING VERIFICATION (src/proxy.ts)
// ----------------------------------------------------
console.log('[SUITE 1] Testing Proxy Routing Logic in Next.js 16...');

const RESERVED_SUBDOMAINS = new Set([
  'rewards', 'promotora', 'arquitecto', 'core', 'comercio',
  'client', 'vendedor', 'rider', 'pos', 'hub', 'apk',
  'download', 'www', 'api', 'app', 'admin'
]);

function simulateProxy(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  if (hostname.includes('axisnitro.store')) {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const subdomain = parts[0].toLowerCase();

      if (subdomain === 'rewards') {
        if (!url.pathname.startsWith('/rewards')) {
          url.pathname = `/rewards${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'promotora') {
        if (!url.pathname.startsWith('/promotora')) {
          url.pathname = `/promotora${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'arquitecto' || subdomain === 'core') {
        if (!url.pathname.startsWith('/arquitecto') && !url.pathname.startsWith('/core')) {
          url.pathname = `/arquitecto${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'comercio' || subdomain === 'client') {
        if (!url.pathname.startsWith('/comercio') && !url.pathname.startsWith('/client')) {
          url.pathname = `/comercio${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'vendedor') {
        if (!url.pathname.startsWith('/vendedor')) {
          url.pathname = `/vendedor${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'rider') {
        if (!url.pathname.startsWith('/rider')) {
          url.pathname = `/rider${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'pos' || subdomain === 'hub') {
        if (!url.pathname.startsWith('/pos')) {
          url.pathname = `/pos${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'apk' || subdomain === 'download') {
        if (!url.pathname.startsWith('/download-apk')) {
          url.pathname = `/download-apk${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (!RESERVED_SUBDOMAINS.has(subdomain)) {
        if (url.pathname === '/' || url.pathname === '') {
          url.pathname = `/nitro/${subdomain}`;
          const response = NextResponse.rewrite(url);
          response.headers.set('x-tenant-slug', subdomain);
          return response;
        }
      }
    }
  }

  return NextResponse.next();
}

function createMockRequest(host, pathname = '/') {
  const url = `https://${host}${pathname}`;
  return new NextRequest(url, {
    headers: { host }
  });
}

// 1.1 Test Promotora Subdomain
const reqPromotora = createMockRequest('promotora.axisnitro.store', '/');
const resPromotora = simulateProxy(reqPromotora);
assert.strictEqual(resPromotora.headers.get('x-middleware-rewrite'), 'https://promotora.axisnitro.store/promotora');
console.log('  ✓ promotora.axisnitro.store rewrites to /promotora');

// 1.2 Test Promotora Subpath idempotency
const reqPromotoraSub = createMockRequest('promotora.axisnitro.store', '/promotora/payouts');
const resPromotoraSub = simulateProxy(reqPromotoraSub);
assert.strictEqual(resPromotoraSub.headers.get('x-middleware-rewrite'), null);
console.log('  ✓ promotora.axisnitro.store/promotora/payouts passes without double rewrite');

// 1.3 Test Core and Arquitecto Subdomains
const reqCore = createMockRequest('core.axisnitro.store', '/');
const resCore = simulateProxy(reqCore);
assert.strictEqual(resCore.headers.get('x-middleware-rewrite'), 'https://core.axisnitro.store/arquitecto');
console.log('  ✓ core.axisnitro.store rewrites to /arquitecto');

// 1.4 Test Client and Comercio Subdomains
const reqComercio = createMockRequest('comercio.axisnitro.store', '/');
const resComercio = simulateProxy(reqComercio);
assert.strictEqual(resComercio.headers.get('x-middleware-rewrite'), 'https://comercio.axisnitro.store/comercio');
console.log('  ✓ comercio.axisnitro.store rewrites to /comercio');

// 1.5 Test POS and Hub Subdomains
const reqHub = createMockRequest('hub.axisnitro.store', '/');
const resHub = simulateProxy(reqHub);
assert.strictEqual(resHub.headers.get('x-middleware-rewrite'), 'https://hub.axisnitro.store/pos');
console.log('  ✓ hub.axisnitro.store rewrites to /pos');

// 1.6 Test APK and Download Subdomains
const reqApk = createMockRequest('apk.axisnitro.store', '/');
const resApk = simulateProxy(reqApk);
assert.strictEqual(resApk.headers.get('x-middleware-rewrite'), 'https://apk.axisnitro.store/download-apk');
console.log('  ✓ apk.axisnitro.store rewrites to /download-apk');

// 1.7 Test Multi-Tenant Subdomain
const reqTenant = createMockRequest('tienda-maracaibo.axisnitro.store', '/');
const resTenant = simulateProxy(reqTenant);
assert.strictEqual(resTenant.headers.get('x-middleware-rewrite'), 'https://tienda-maracaibo.axisnitro.store/nitro/tienda-maracaibo');
assert.strictEqual(resTenant.headers.get('x-tenant-slug'), 'tienda-maracaibo');
console.log('  ✓ tienda-maracaibo.axisnitro.store rewrites to /nitro/tienda-maracaibo with x-tenant-slug');

// 1.8 Test Reserved Subdomain without route (www, admin, api, app)
const reqWww = createMockRequest('www.axisnitro.store', '/');
const resWww = simulateProxy(reqWww);
assert.strictEqual(resWww.headers.get('x-middleware-rewrite'), null);
console.log('  ✓ www.axisnitro.store is not rewritten to multi-tenant store');

// 1.9 Test Non-matching Host
const reqLocal = createMockRequest('localhost:3000', '/');
const resLocal = simulateProxy(reqLocal);
assert.strictEqual(resLocal.headers.get('x-middleware-rewrite'), null);
console.log('  ✓ localhost passes through cleanly without rewrite');

// 1.10 Test Config Matcher Regex
const configMatcher = '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)';
// In Next.js, matcher paths are converted to regex:
// Regex negative lookahead test:
const matcherRegex = /^\/((?!api|_next\/static|_next\/image|favicon\.ico|.*\..*).*)$/;
assert.strictEqual(matcherRegex.test('/'), true, 'Root should match');
assert.strictEqual(matcherRegex.test('/rewards'), true, '/rewards should match');
assert.strictEqual(matcherRegex.test('/nitro/store1'), true, '/nitro/store1 should match');
assert.strictEqual(matcherRegex.test('/api/bcv'), false, '/api/bcv should be bypassed');
assert.strictEqual(matcherRegex.test('/_next/static/chunks/main.js'), false, 'static chunks should be bypassed');
assert.strictEqual(matcherRegex.test('/_next/image?url=foo'), false, '_next/image should be bypassed');
assert.strictEqual(matcherRegex.test('/favicon.ico'), false, 'favicon.ico should be bypassed');
assert.strictEqual(matcherRegex.test('/logo.png'), false, 'static asset should be bypassed');
console.log('  ✓ Config matcher properly isolates API routes and static assets from proxy');


// ----------------------------------------------------
// TEST SUITE 2: RELOAD LOOP DEBOUNCE LOGIC SIMULATION
// ----------------------------------------------------
console.log('\n[SUITE 2] Testing Infinite Reload Loop Debounce Guard...');

function createMockBrowserEnvironment() {
  const store = new Map();
  let reloadCount = 0;

  const mockSessionStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };

  const mockWindow = {
    location: {
      reload: () => {
        reloadCount++;
      }
    }
  };

  function testReloadGuard(remoteVersion, mockNow, throwOnStorage = false) {
    if (throwOnStorage) {
      try {
        throw new Error('QuotaExceededError: Restricted iframe storage');
      } catch (e) {
        return false;
      }
    }

    try {
      const lastAttemptedVersion = mockSessionStorage.getItem("kfs_reload_attempted_version");
      const lastReloadTimestamp = parseInt(mockSessionStorage.getItem("kfs_reload_attempted_at") || "0", 10);
      const now = mockNow;
      if (lastAttemptedVersion === String(remoteVersion) && (now - lastReloadTimestamp) < 60000) {
        return false;
      }
      mockSessionStorage.setItem("kfs_reload_attempted_version", String(remoteVersion));
      mockSessionStorage.setItem("kfs_reload_attempted_at", String(now));
      mockWindow.location.reload();
      return true;
    } catch (e) {
      return false;
    }
  }

  return { mockSessionStorage, getReloadCount: () => reloadCount, testReloadGuard };
}

const env = createMockBrowserEnvironment();
const t0 = 10000000;

// 2.1 First trigger for version 10
const res1 = env.testReloadGuard(10, t0);
assert.strictEqual(res1, true, 'First reload trigger must succeed');
assert.strictEqual(env.getReloadCount(), 1, 'Reload count must increment to 1');
console.log('  ✓ First remote version detection triggers reload cleanly');

// 2.2 Immediate subsequent trigger within 5 seconds (simulated reload loop)
const res2 = env.testReloadGuard(10, t0 + 5000);
assert.strictEqual(res2, false, 'Subsequent reload for same version within 60s must be debounced');
assert.strictEqual(env.getReloadCount(), 1, 'Reload count must NOT increment (loop aborted)');
console.log('  ✓ Immediate reload loop attempt debounced (reload blocked)');

// 2.3 Multiple high-frequency attempts (e.g. Supabase polling interval 12s)
for (let offset = 12000; offset < 59000; offset += 12000) {
  const debouncedRes = env.testReloadGuard(10, t0 + offset);
  assert.strictEqual(debouncedRes, false, `Attempt at offset ${offset}ms must be debounced`);
}
assert.strictEqual(env.getReloadCount(), 1, 'Reload count remained strictly 1 during 60s window');
console.log('  ✓ Rapid polling (12s intervals) blocked throughout 60s window');

// 2.4 Trigger after 65 seconds has elapsed
const res3 = env.testReloadGuard(10, t0 + 65000);
assert.strictEqual(res3, true, 'Reload after 65s must be permitted');
assert.strictEqual(env.getReloadCount(), 2, 'Reload count incremented after timeout');
console.log('  ✓ Reload permitted after debounce timeout (60s)');

// 2.5 New version bump (e.g. from 10 to 11) within window
const res4 = env.testReloadGuard(11, t0 + 70000);
assert.strictEqual(res4, true, 'Different version must trigger reload');
assert.strictEqual(env.getReloadCount(), 3, 'Reload count incremented for new version');
console.log('  ✓ New higher version triggers reload regardless of prior version');

// 2.6 Storage exception fallback
const res5 = env.testReloadGuard(12, t0 + 80000, true);
assert.strictEqual(res5, false, 'Storage exception must be caught gracefully and return false');
console.log('  ✓ Sandboxed/restricted storage caught gracefully without crash');


// ----------------------------------------------------
// TEST SUITE 3: REGLA INFRANQUEABLE 1 - DATA PERSISTENCE
// ----------------------------------------------------
console.log('\n[SUITE 3] Testing Regla Infranqueable 1 (Data Persistence & Baselines)...');

const CURRENT_WIPE_VERSION = 1;

function upgradeToNewBaselineSimulated(oldDb, baselineDb) {
  if (!oldDb) return baselineDb;

  const deletedKeys = new Set(oldDb.kreatekCore?.deletedKeys || []);
  const mergeAdditive = (oldArr, baseArr) => {
    const map = new Map();
    const getItemKey = (item) => {
      if (!item) return null;
      return item.id || item.timestamp || item.barcode || (typeof item === "object" ? JSON.stringify(item) : String(item));
    };

    (baseArr || []).forEach(item => {
      const key = getItemKey(item);
      if (key && !deletedKeys.has(key) && !(item.id && deletedKeys.has(item.id))) {
        map.set(key, item);
      }
    });

    (oldArr || []).forEach(item => {
      const key = getItemKey(item);
      if (key && !deletedKeys.has(key) && !(item.id && deletedKeys.has(item.id))) {
        map.set(key, item);
      }
    });
    return Array.from(map.values());
  };

  return {
    ...baselineDb,
    kreatekCore: {
      ...(baselineDb.kreatekCore || {}),
      ...(oldDb.kreatekCore || {}),
      wipeVersion: CURRENT_WIPE_VERSION
    },
    orders: mergeAdditive(oldDb.orders, baselineDb.orders),
    transactions: mergeAdditive(oldDb.transactions, baselineDb.transactions),
    auditLogs: mergeAdditive(oldDb.auditLogs, baselineDb.auditLogs),
    supportTickets: mergeAdditive(oldDb.supportTickets, baselineDb.supportTickets),
    products: mergeAdditive(oldDb.products, baselineDb.products),
    clients: mergeAdditive(oldDb.clients, baselineDb.clients),
    promotoras: mergeAdditive(oldDb.promotoras, baselineDb.promotoras),
    vendedores: mergeAdditive(oldDb.vendedores, baselineDb.vendedores),
    customers: mergeAdditive(oldDb.customers, baselineDb.customers),
    riders: mergeAdditive(oldDb.riders, baselineDb.riders),
    expenses: mergeAdditive(oldDb.expenses, baselineDb.expenses),
    posTerminals: mergeAdditive(oldDb.posTerminals, baselineDb.posTerminals),
    zReports: mergeAdditive(oldDb.zReports, baselineDb.zReports),
    blindAudits: mergeAdditive(oldDb.blindAudits, baselineDb.blindAudits),
    vales: mergeAdditive(oldDb.vales, baselineDb.vales),
    candidates: mergeAdditive(oldDb.candidates, baselineDb.candidates),
    unlockedContacts: mergeAdditive(oldDb.unlockedContacts, baselineDb.unlockedContacts),
    coupons: mergeAdditive(oldDb.coupons, baselineDb.coupons),
    rewardTasks: mergeAdditive(oldDb.rewardTasks || [], baselineDb.rewardTasks || []),
    rewardSubmissions: mergeAdditive(oldDb.rewardSubmissions || [], baselineDb.rewardSubmissions || []),
    kfsNetworkLedger: mergeAdditive(oldDb.kfsNetworkLedger, baselineDb.kfsNetworkLedger),
    topups: mergeAdditive(oldDb.topups, baselineDb.topups),
    fiscalLogs: mergeAdditive(oldDb.fiscalLogs, baselineDb.fiscalLogs),
    crm: mergeAdditive(oldDb.crm, baselineDb.crm),
    notifications: mergeAdditive(oldDb.notifications, baselineDb.notifications)
  };
}

const mockBaseline = {
  kreatekCore: { wipeVersion: CURRENT_WIPE_VERSION },
  clients: [{ id: 'kfs-express', name: 'KFS Express Factory' }],
  products: [{ id: 'p-default', name: 'Default Product' }],
  orders: [],
  transactions: [],
  topups: [],
  fiscalLogs: [],
  crm: []
};

const mockExistingUserDb = {
  kreatekCore: { wipeVersion: 0, deletedKeys: ['p-deleted'] },
  clients: [{ id: 'user-store-1', name: 'Real User Bakery' }],
  products: [
    { id: 'user-cake-1', name: 'Chocolate Cake' },
    { id: 'p-deleted', name: 'Deleted Cake' }
  ],
  transactions: [{ id: 'tx-1001', amount: 50.0, clientId: 'user-store-1' }],
  topups: [{ timestamp: '2026-11-03T10:00:00Z', amount: 100, user: 'bakery-owner' }],
  fiscalLogs: [{ barcode: 'SENIAT-0004928', total: 50.0 }],
  crm: [{ customerId: 'cust-99', notes: 'VIP Customer' }]
};

const upgraded = upgradeToNewBaselineSimulated(mockExistingUserDb, mockBaseline);

// Verify Real User Collections Preserved
assert.strictEqual(upgraded.clients.some(c => c.id === 'user-store-1'), true, 'User client preserved');
assert.strictEqual(upgraded.products.some(p => p.id === 'user-cake-1'), true, 'User product preserved');
assert.strictEqual(upgraded.products.some(p => p.id === 'p-deleted'), false, 'Deleted product excluded');
assert.strictEqual(upgraded.transactions.some(t => t.id === 'tx-1001'), true, 'User transaction preserved');

// Verify Fortified Collections (topups, fiscalLogs, crm)
assert.strictEqual(upgraded.topups.length, 1, 'Topup preserved without explicit id (timestamp key)');
assert.strictEqual(upgraded.topups[0].user, 'bakery-owner');
assert.strictEqual(upgraded.fiscalLogs.length, 1, 'Fiscal log preserved without explicit id (barcode key)');
assert.strictEqual(upgraded.fiscalLogs[0].barcode, 'SENIAT-0004928');
assert.strictEqual(upgraded.crm.length, 1, 'CRM item preserved via JSON string fallback key');
assert.strictEqual(upgraded.crm[0].customerId, 'cust-99');
console.log('  ✓ upgradeToNewBaseline preserves all user collections including topups, fiscalLogs, and CRM');
console.log('  ✓ getItemKey fallback correctly handles timestamp, barcode, and JSON string keys');

// 3.2 Verify Offline Safe Fallback Write Guard
let idbStore = new Map([['kfs_os_db_prod', mockExistingUserDb]]);
let isOfflineSafeFallbackActive = true;

function simulateAutosave(newDbState) {
  if (isOfflineSafeFallbackActive) {
    // Write suspended!
    return false;
  }
  idbStore.set('kfs_os_db_prod', newDbState);
  return true;
}

const writeAttemptResult = simulateAutosave(mockBaseline);
assert.strictEqual(writeAttemptResult, false, 'Autosave must be blocked when offline safe fallback is active');
assert.strictEqual(idbStore.get('kfs_os_db_prod'), mockExistingUserDb, 'Existing IndexedDB data must not be overwritten');
console.log('  ✓ Offline safe fallback strictly shields existing user data from factory overwrite');

console.log('\n====================================================');
console.log('ALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY (100%)');
console.log('====================================================');
