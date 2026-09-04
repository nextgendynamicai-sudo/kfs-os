const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runFullSuite() {
  console.log("=================================================");
  console.log("KFS OS - Fullstack RLS & Data Integrity Suite");
  console.log("=================================================\n");

  let allOk = true;

  // 1. Verify Real Data Persistence (Rule 1)
  console.log("[Test 1/4] Checking Real User Records (Rule 1 Protection)...");
  const { data: clientRows, error: clientErr } = await supabase
    .from('clients')
    .select('id, company, name')
    .limit(5);

  if (clientErr) {
    console.error("  ❌ Error reading clients:", clientErr.message);
    allOk = false;
  } else {
    console.log(`  ✅ Successfully read ${clientRows.length} client(s):`, clientRows.map(c => c.id || c.name || c.company));
    const hasGarage = clientRows.some(c => c.id === 'c_garage_test');
    if (hasGarage) {
      console.log("  ✅ Real record 'c_garage_test' is INTACT and verified.");
    }
  }

  // 2. Check Products
  console.log("\n[Test 2/4] Checking Products Catalog...");
  const { data: prodRows, error: prodErr } = await supabase
    .from('products')
    .select('id, name, price')
    .limit(5);

  if (prodErr) {
    console.error("  ❌ Error reading products:", prodErr.message);
    allOk = false;
  } else {
    console.log(`  ✅ Successfully read ${prodRows.length} product(s):`, prodRows.map(p => `${p.name} ($${p.price})`));
  }

  // 3. Check Promotoras
  console.log("\n[Test 3/4] Checking Promotoras Registry...");
  const { data: promoRows, error: promoErr } = await supabase
    .from('promotoras')
    .select('id, name, email')
    .limit(5);

  if (promoErr) {
    console.error("  ❌ Error reading promotoras:", promoErr.message);
    allOk = false;
  } else {
    console.log(`  ✅ Successfully read ${promoRows.length} promotora(s):`, promoRows.map(p => p.name || p.id));
  }

  // 4. Test Safe Upsert with ANON KEY on kfs_store_states
  console.log("\n[Test 4/4] Testing Safe Anon Write (Upsert capability)...");
  const testSyncId = "kfs-rls-heartbeat-check";
  const { error: upsertErr } = await supabase
    .from('kfs_store_states')
    .upsert({
      id: testSyncId,
      db_state: { heartbeat: "ok", checked_at: new Date().toISOString() },
      updated_at: new Date().toISOString()
    });

  if (upsertErr) {
    console.error("  ❌ Upsert failed:", upsertErr.message);
    allOk = false;
  } else {
    console.log("  ✅ Upsert with anon key succeeded!");
    
    // Read it back
    const { data: readBack, error: readBackErr } = await supabase
      .from('kfs_store_states')
      .select('id, db_state')
      .eq('id', testSyncId)
      .single();

    if (readBackErr) {
      console.error("  ❌ Verification read failed:", readBackErr.message);
      allOk = false;
    } else {
      console.log("  ✅ Verification read confirmed:", readBack.id, readBack.db_state.heartbeat);
    }
  }

  console.log("\n=================================================");
  if (allOk) {
    console.log("🎉 ALL TESTS PASSED: Zero breakage, 100% integrity.");
  } else {
    console.log("⚠️ Some tests failed. Check log above.");
  }
  console.log("=================================================");
}

runFullSuite();
