const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonUpsert() {
  console.log("Testing ANON_KEY upsert to kfs_store_states...");
  
  const payload = {
    id: "prod_sync_10", // the syncId used in KFSContext
    db_state: { test: "data" },
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('kfs_store_states').upsert(payload);
  
  if (error) {
    console.error("UPSERT FAILED with ANON_KEY:", error.message, error.details, error.hint, error.code);
  } else {
    console.log("UPSERT SUCCESS with ANON_KEY:", data);
  }
}

testAnonUpsert();
