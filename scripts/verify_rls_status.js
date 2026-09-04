const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ALL_TABLES = [
  'clients',
  'customers',
  'promotoras',
  'riders',
  'products',
  'transactions',
  'candidates',
  'merchants',
  'kfs_merchants',
  'kfs_support_tickets',
  'axis_nitro_hubs',
  'axis_nitro_products',
  'kfs_clients',
  'kfs_customers',
  'kfs_promotoras',
  'kfs_riders',
  'kfs_products',
  'kfs_transactions',
  'kfs_store_states',
  'kfs_global_products_catalog',
  'kfs_reward_tasks',
  'kfs_reward_submissions'
];

async function verifyAllTables() {
  console.log("=================================================");
  console.log("KFS OS - Supabase RLS & Integrity Audit Engine");
  console.log("Testing with NEXT_PUBLIC_SUPABASE_ANON_KEY");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  for (const table of ALL_TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ [FAIL] ${table.padEnd(28)}: ${error.message} (${error.code})`);
        failed++;
      } else {
        console.log(`✅ [OK]   ${table.padEnd(28)}: Accessible by anon (Count: ${count ?? 0})`);
        passed++;
      }
    } catch (err) {
      console.error(`❌ [CRASH] ${table.padEnd(27)}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n=================================================");
  console.log(`Audit Results: ${passed} Passed | ${failed} Failed`);
  console.log("=================================================");
}

verifyAllTables();
