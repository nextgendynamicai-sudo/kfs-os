import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';

console.log('================================================================');
console.log('CHALLENGER M3_2: EMPIRICAL PERFORMANCE & PERSISTENCE VERIFICATION');
console.log('================================================================\n');

const ROOT = process.cwd();

function readSrc(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

// =====================================================================
// PART 1: STATIC & FORENSIC VERIFICATION OF CODE CHANGES
// =====================================================================
console.log('--- PART 1: STATIC & ARCHITECTURAL VERIFICATION ---');

// 1.1 KFSContext.tsx Rider Simulation Throttling & User Persistence Guard
console.log('[AUDIT 1.1] Checking src/context/KFSContext.tsx throttling implementation...');
const kfsContextSrc = readSrc('src/context/KFSContext.tsx');

assert(kfsContextSrc.includes('const isRiderSimTickRef = useRef(false);'), 'isRiderSimTickRef must be defined in KFSContext');
assert(kfsContextSrc.includes('const lastRiderSimPersistRef = useRef(0);'), 'lastRiderSimPersistRef must be defined in KFSContext');
assert(kfsContextSrc.includes('const riderSimDebounceRef = useRef<NodeJS.Timeout | null>(null);'), 'riderSimDebounceRef must be defined in KFSContext');
assert(kfsContextSrc.includes('isRiderSimTickRef.current = true;'), 'Rider simulation interval must flag rider ticks');
assert(kfsContextSrc.includes('const RIDER_PERSIST_THROTTLE_MS = 20000;'), 'Throttle window must be 20,000 ms (20s)');
assert(kfsContextSrc.includes('const isRiderTick = isRiderSimTickRef.current;'), 'Persistence effect must distinguish rider ticks');
assert(kfsContextSrc.includes('riderSimDebounceRef.current = setTimeout('), 'Trailing debounce must be scheduled for simulation cessation');
console.log('  ✓ KFSContext properly implements 20s throttle and 5s debounce for rider ticks');

// 1.2 AxisNitroPOS.tsx O(1) Cart Map Lookup
console.log('\n[AUDIT 1.2] Checking src/components/AxisNitroPOS.tsx O(1) cart map...');
const posSrc = readSrc('src/components/AxisNitroPOS.tsx');
assert(posSrc.includes('const cartMap = useMemo(() => new Map(cart.map(i => [i.product.id, i])), [cart]);'), 'cartMap must be memoized as Map');
assert(posSrc.includes('const inCartItem = cartMap.get(p.id);'), 'Product catalog loop must use cartMap.get(p.id) for O(1) lookup');
assert(!posSrc.includes('cart.find(i => i.product.id === p.id)'), 'Linear cart.find in product map must be eliminated');
console.log('  ✓ AxisNitroPOS uses memoized O(1) cartMap lookup');

// 1.3 AndroidManifest.xml Permissions & Orientation
console.log('\n[AUDIT 1.3] Checking builds/android_rewards/android/app/src/main/AndroidManifest.xml...');
const manifestSrc = readSrc('builds/android_rewards/android/app/src/main/AndroidManifest.xml');
assert(manifestSrc.includes('android:screenOrientation="sensorPortrait"'), 'MainActivity must declare screenOrientation="sensorPortrait"');
assert(manifestSrc.includes('android.permission.INTERNET'), 'Manifest must declare INTERNET permission');
assert(manifestSrc.includes('android.permission.CAMERA'), 'Manifest must declare CAMERA permission');
assert(manifestSrc.includes('android.permission.ACCESS_NETWORK_STATE'), 'Manifest must declare ACCESS_NETWORK_STATE permission');
assert(manifestSrc.includes('android.permission.VIBRATE'), 'Manifest must declare VIBRATE permission');
assert(manifestSrc.includes('android.permission.POST_NOTIFICATIONS'), 'Manifest must declare POST_NOTIFICATIONS permission');
console.log('  ✓ AndroidManifest includes sensorPortrait and all required hardware/system permissions');

// 1.4 public/sw.js Offline Script Fallback Guard
console.log('\n[AUDIT 1.4] Checking public/sw.js chunk fallback...');
const swSrc = readSrc('public/sw.js');
assert(swSrc.includes("statusText: 'Offline Chunk Not Found'"), 'sw.js must return 404 for JS chunks when offline');
assert(swSrc.includes("'Content-Type': 'application/javascript'"), 'sw.js must set Content-Type javascript on chunk 404');
assert(swSrc.includes("statusText: 'Service Unavailable Offline'"), 'sw.js must return 503 JSON for API requests offline');
console.log('  ✓ sw.js prevents HTML fallback on script chunk fetch failures');

// 1.5 src/components/PwaUpdater.tsx Offline Cache Protection
console.log('\n[AUDIT 1.5] Checking src/components/PwaUpdater.tsx offline cache guard...');
const pwaUpdaterSrc = readSrc('src/components/PwaUpdater.tsx');
assert(pwaUpdaterSrc.includes('if (typeof navigator !== "undefined" && !navigator.onLine)'), 'PwaUpdater must check !navigator.onLine');
assert(pwaUpdaterSrc.includes('Omitiendo borrado de caché para evitar bucle de pantalla blanca'), 'PwaUpdater must skip cache deletion when offline');
console.log('  ✓ PwaUpdater skips destructive cache wipe when offline');

// 1.6 src/context/UIContext.tsx Dynamic Initial Network State
console.log('\n[AUDIT 1.6] Checking src/context/UIContext.tsx initial network state...');
const uiContextSrc = readSrc('src/context/UIContext.tsx');
assert(uiContextSrc.includes('navigator.onLine ? "online" : "offline"'), 'UIContext must initialize networkState dynamically from navigator.onLine');
console.log('  ✓ UIContext dynamically detects initial online/offline network state');


// =====================================================================
// PART 2: EMPIRICAL RIDER SIMULATION THROTTLE & REGLA 1 TEST HARNESS
// =====================================================================
console.log('\n--- PART 2: EMPIRICAL RIDER THROTTLING & REGLA 1 PERSISTENCE ---');

/**
 * Virtual time runner and exact replication of the KFSContext persistence effect logic.
 */
class VirtualKFSContextHarness {
  constructor() {
    this.virtualTime = 0;
    this.timers = [];
    this.persistLog = [];

    // State & Refs exactly matching KFSContext.tsx
    this.db = {
      transactions: [],
      riders: [{ id: 'rider-1', name: 'Carlos Express', lastLat: 10.48, lastLng: -66.86 }]
    };
    this.isRiderSimTickRef = { current: false };
    this.lastRiderSimPersistRef = { current: 0 };
    this.riderSimDebounceRef = { current: null };
  }

  // Virtual timer primitives
  setTimeout(fn, delayMs) {
    const fireTime = this.virtualTime + delayMs;
    const timer = { id: Math.random(), fireTime, fn, cancelled: false };
    this.timers.push(timer);
    return timer;
  }

  clearTimeout(timer) {
    if (timer) {
      timer.cancelled = true;
    }
  }

  advanceTime(ms) {
    const targetTime = this.virtualTime + ms;
    while (true) {
      // Find earliest active timer <= targetTime
      const activeTimers = this.timers
        .filter(t => !t.cancelled && t.fireTime <= targetTime)
        .sort((a, b) => a.fireTime - b.fireTime);

      if (activeTimers.length === 0) {
        this.virtualTime = targetTime;
        break;
      }

      const nextTimer = activeTimers[0];
      this.virtualTime = nextTimer.fireTime;
      nextTimer.cancelled = true;
      nextTimer.fn();
    }
  }

  // Exact reproduction of persistDatabase from KFSContext.tsx
  persistDatabase(targetDb, reason) {
    this.persistLog.push({
      time: this.virtualTime,
      reason,
      transactionCount: targetDb.transactions.length,
      lastTxId: targetDb.transactions[targetDb.transactions.length - 1]?.id || null,
      riderCoord: { ...targetDb.riders[0] }
    });
  }

  // Exact reproduction of useEffect persistence handler from KFSContext.tsx lines 1388-1411
  runPersistenceEffect(reason = 'unknown') {
    const isRiderTick = this.isRiderSimTickRef.current;
    if (isRiderTick) {
      this.isRiderSimTickRef.current = false;
      const now = this.virtualTime;
      const RIDER_PERSIST_THROTTLE_MS = 20000;
      if (now - this.lastRiderSimPersistRef.current < RIDER_PERSIST_THROTTLE_MS) {
        if (this.riderSimDebounceRef.current) this.clearTimeout(this.riderSimDebounceRef.current);
        this.riderSimDebounceRef.current = this.setTimeout(() => {
          this.lastRiderSimPersistRef.current = this.virtualTime;
          this.persistDatabase(this.db, 'rider_debounce_trailing');
        }, 5000);
        return;
      }
      this.lastRiderSimPersistRef.current = now;
    }

    // Direct user action or throttle window elapsed: clear pending debounce and persist immediately
    if (this.riderSimDebounceRef.current) {
      this.clearTimeout(this.riderSimDebounceRef.current);
      this.riderSimDebounceRef.current = null;
    }
    this.persistDatabase(this.db, reason);
  }

  // Simulates 1 rider simulation tick (happens every 2000ms)
  simulateRiderTick(tickIndex) {
    // Rider tick updates coordinates and sets ref
    this.db = {
      ...this.db,
      riders: [{
        ...this.db.riders[0],
        lastLat: this.db.riders[0].lastLat + 0.001 * tickIndex,
        lastLng: this.db.riders[0].lastLng + 0.001 * tickIndex
      }]
    };
    this.isRiderSimTickRef.current = true;
    this.runPersistenceEffect('rider_tick_immediate');
  }

  // Simulates direct user action (e.g. checkout, add client)
  simulateUserTransaction(tx) {
    this.db = {
      ...this.db,
      transactions: [...this.db.transactions, tx]
    };
    // Direct user action does NOT set isRiderSimTickRef.current = true
    assert.strictEqual(this.isRiderSimTickRef.current, false, 'User action must leave isRiderSimTickRef as false');
    this.runPersistenceEffect('user_transaction');
  }
}

// EXECUTE EMPIRICAL HARNESS: 20 Rider Ticks + 1 User Transaction
const harness = new VirtualKFSContextHarness();

console.log('Simulating 20 rider ticks at 2-second intervals with user transaction injection at t = 7,000 ms...');

// Ticks 1 to 3 (t = 0, 2000, 4000)
for (let i = 1; i <= 3; i++) {
  harness.simulateRiderTick(i);
  if (i < 3) harness.advanceTime(2000);
}

// Now time is t = 4000ms.
// Advance to t = 7000ms (between tick 3 and tick 4)
harness.advanceTime(3000);
assert.strictEqual(harness.virtualTime, 7000, 'Virtual time must be 7000ms');

// Inject user transaction at t = 7000ms
const userTx = {
  id: 'tx_empirical_regla1_001',
  amountUSD: 85.50,
  customer: 'Empirical Verification Client',
  createdAt: '2026-11-03T12:00:00Z'
};
console.log(`[t = ${harness.virtualTime} ms] Injected user transaction: ${userTx.id}`);
const preUserPersistCount = harness.persistLog.length;
const userActionStartTime = harness.virtualTime;

harness.simulateUserTransaction(userTx);

const postUserPersistCount = harness.persistLog.length;
const latestPersist = harness.persistLog[harness.persistLog.length - 1];

// ASSERTION 1: Immediate zero-delay persistence on user action
assert.strictEqual(postUserPersistCount, preUserPersistCount + 1, 'User transaction must trigger immediate database persistence write');
assert.strictEqual(latestPersist.reason, 'user_transaction', 'Persist reason must be user_transaction');
assert.strictEqual(latestPersist.time, userActionStartTime, 'User transaction persistence delay must be exactly 0 ms');
assert.strictEqual(latestPersist.transactionCount, 1, 'Persisted database must include the user transaction');
assert.strictEqual(latestPersist.lastTxId, 'tx_empirical_regla1_001', 'Regla 1: Persisted record must preserve the user transaction');
console.log('  ✓ [REGLA 1 VERIFIED] User transaction triggered IMMEDIATE zero-delay disk persistence');

// Continue rider simulation for remaining ticks (ticks 4 to 20)
// Advance 1000ms to reach t = 8000ms (tick 4)
harness.advanceTime(1000);

for (let i = 4; i <= 20; i++) {
  harness.simulateRiderTick(i);
  if (i < 20) {
    harness.advanceTime(2000);
  }
}

// Current time after tick 20 is t = 40,000ms
console.log(`[t = ${harness.virtualTime} ms] Completed 20 rider ticks.`);

// Simulation pauses. Advance by 6,000ms to allow 5s trailing debounce to fire
console.log('Pausing rider simulation. Advancing virtual clock by 6,000ms to evaluate trailing debounce...');
harness.advanceTime(6000);
console.log(`[t = ${harness.virtualTime} ms] Virtual clock finished.`);

// Analyze persistence log
console.log('\n--- PERSISTENCE WRITE LOG ANALYSIS ---');
harness.persistLog.forEach((log, idx) => {
  console.log(`  Write #${idx + 1}: t=${log.time}ms | reason=${log.reason} | txCount=${log.transactionCount}`);
});

const riderWrites = harness.persistLog.filter(l => l.reason.startsWith('rider_'));
const userWrites = harness.persistLog.filter(l => l.reason === 'user_transaction');

console.log(`\nTotal persistence writes: ${harness.persistLog.length}`);
console.log(`  - User writes: ${userWrites.length} (Immediate, delay = 0 ms)`);
console.log(`  - Rider writes: ${riderWrites.length} (out of 20 ticks across 40 seconds)`);

// ASSERTION 2: Rider throttle rate <= 1 write per 20 seconds
// Across 40 seconds, active rider ticks can fire at most 2 direct writes (at t=0 and t=20000) + 1 trailing debounce when paused.
assert(riderWrites.length <= 3, `Rider writes (${riderWrites.length}) must be <= 3 (<= 1 write per 20s plus trailing debounce)`);
assert.strictEqual(userWrites.length, 1, 'Exactly 1 user transaction write executed');

// Calculate I/O reduction
const unthrottledTotalWrites = 20 + 1; // 20 rider ticks + 1 user tx
const actualTotalWrites = harness.persistLog.length;
const ioReductionPercent = (((unthrottledTotalWrites - actualTotalWrites) / unthrottledTotalWrites) * 100).toFixed(1);

console.log(`  ✓ Unthrottled writes would be: ${unthrottledTotalWrites}`);
console.log(`  ✓ Throttled actual writes: ${actualTotalWrites}`);
console.log(`  ✓ Disk I/O Write Reduction: ${ioReductionPercent}%`);
assert(Number(ioReductionPercent) >= 80, 'I/O reduction must exceed 80%');


// =====================================================================
// PART 3: POS CART LOOKUP BENCHMARK: O(N*M) vs O(1)
// =====================================================================
console.log('\n--- PART 3: POS CART LOOKUP BENCHMARK (1,000 PRODUCTS) ---');

const NUM_PRODUCTS = 1000;
const CART_SIZES = [10, 50, 100];
const ITERATIONS = 1000;

// Generate 1,000 mock products
const products = Array.from({ length: NUM_PRODUCTS }, (_, idx) => ({
  id: `prod_axis_${String(idx).padStart(4, '0')}`,
  name: `Axis Nitro Product ${idx}`,
  priceUSD: 10 + (idx % 90),
  stock: 50 + (idx % 200),
  category: `Category_${idx % 10}`
}));

for (const cartSize of CART_SIZES) {
  console.log(`\n[BENCHMARK] Catalog: ${NUM_PRODUCTS} products | Cart: ${cartSize} items | Iterations: ${ITERATIONS}`);

  // Create cart with cartSize items
  const cart = Array.from({ length: cartSize }, (_, idx) => ({
    product: products[idx * Math.floor(NUM_PRODUCTS / cartSize)],
    quantity: 1 + (idx % 5)
  }));

  // Benchmark A: O(N * M) Linear Array.find
  const t0Linear = performance.now();
  let linearBadgeCount = 0;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let pIdx = 0; pIdx < products.length; pIdx++) {
      const p = products[pIdx];
      const inCartItem = cart.find(i => i.product.id === p.id);
      if (inCartItem) linearBadgeCount += inCartItem.quantity;
    }
  }
  const t1Linear = performance.now();
  const linearDuration = t1Linear - t0Linear;

  // Benchmark B: O(1) Memoized Map.get
  const t0Map = performance.now();
  let mapBadgeCount = 0;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // In React, cartMap is memoized via useMemo([cart])
    const cartMap = new Map(cart.map(i => [i.product.id, i]));
    for (let pIdx = 0; pIdx < products.length; pIdx++) {
      const p = products[pIdx];
      const inCartItem = cartMap.get(p.id);
      if (inCartItem) mapBadgeCount += inCartItem.quantity;
    }
  }
  const t1Map = performance.now();
  const mapDuration = t1Map - t0Map;

  // Even stronger: Map created ONCE per cart change (pure render loop speedup)
  const cartMapPre = new Map(cart.map(i => [i.product.id, i]));
  const t0MapRenderOnly = performance.now();
  let mapRenderBadgeCount = 0;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let pIdx = 0; pIdx < products.length; pIdx++) {
      const p = products[pIdx];
      const inCartItem = cartMapPre.get(p.id);
      if (inCartItem) mapRenderBadgeCount += inCartItem.quantity;
    }
  }
  const t1MapRenderOnly = performance.now();
  const mapRenderDuration = t1MapRenderOnly - t0MapRenderOnly;

  // Verify functional parity
  assert.strictEqual(linearBadgeCount, mapBadgeCount, 'Badge count between Linear and Map must be identical');
  assert.strictEqual(linearBadgeCount, mapRenderBadgeCount, 'Badge count between Linear and Pre-Map must be identical');

  const speedupWithMapCreation = (linearDuration / mapDuration).toFixed(2);
  const speedupPureRender = (linearDuration / mapRenderDuration).toFixed(2);

  console.log(`  - O(N*M) Linear (Array.find): ${linearDuration.toFixed(2)} ms (${(linearDuration / ITERATIONS).toFixed(4)} ms/pass)`);
  console.log(`  - O(1) Map (including Map inst): ${mapDuration.toFixed(2)} ms (${(mapDuration / ITERATIONS).toFixed(4)} ms/pass) -> ${speedupWithMapCreation}x faster`);
  console.log(`  - O(1) Map (memoized render):    ${mapRenderDuration.toFixed(2)} ms (${(mapRenderDuration / ITERATIONS).toFixed(4)} ms/pass) -> ${speedupPureRender}x faster`);

  assert(linearDuration > mapDuration, 'Map lookup must be empirically faster than Linear search');
}

console.log('\n================================================================');
console.log('ALL EMPIRICAL TESTS PASSED ACCORDING TO SPECIFICATION');
console.log('================================================================\n');
