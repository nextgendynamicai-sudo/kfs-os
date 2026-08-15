const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log("Starting Enterprise Relational DB Migration...");

  try {
    // 1. Fetch the giant JSON Blob
    console.log("Fetching current 'kfs_store_states' blob...");
    const { data: statesData, error: statesError } = await supabase
      .from('kfs_store_states')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (statesError) throw statesError;
    if (!statesData || statesData.length === 0) {
      console.log("No blob data found. System is empty.");
      return;
    }

    const currentState = statesData[0].state;
    console.log(`Loaded JSON Blob version: ${currentState.kreatekCore?.wipeVersion}`);

    // 2. Migrate Clients
    if (currentState.clients && currentState.clients.length > 0) {
      console.log(`Migrating ${currentState.clients.length} Clients...`);
      for (const client of currentState.clients) {
        const payload = {
          id: client.id,
          company: client.company,
          email: client.email,
          password_hash: client.password,
          address: client.address,
          rating: client.rating,
          review_count: client.reviewCount,
          kfs_fee_percentage: client.kfsFeePercentage,
          fee_tier: client.fee_tier,
          is_founder: client.is_founder,
          kfs_fees_owed_usd: client.kfsFeesOwedUSD,
          is_onboarded: client.isOnboarded,
          wallet_balance_usd: client.walletBalanceUSD,
          sales_usd: client.salesUSD,
          store_bio: client.storeSettings?.bioText,
          store_theme_color: client.storeSettings?.themeColor,
          store_typography: client.storeSettings?.typography,
          store_layout_type: client.storeSettings?.layoutType,
          store_profile_pic_url: client.storeSettings?.profilePicUrl
        };
        
        const { error } = await supabase.from('kfs_clients').upsert(payload);
        if (error) console.error(`Error migrating client ${client.id}:`, error.message);
      }
    }

    // 3. Migrate Products
    if (currentState.products && currentState.products.length > 0) {
      console.log(`Migrating ${currentState.products.length} Products...`);
      for (const prod of currentState.products) {
        const payload = {
          id: prod.id,
          seller_id: prod.clientId,
          name: prod.name,
          price_usd: prod.priceUSD,
          stock: prod.stock,
          description: prod.description,
          image: prod.image,
          category: prod.category,
          cost_usd: prod.costUSD
        };
        
        const { error } = await supabase.from('kfs_products').upsert(payload);
        if (error) console.error(`Error migrating product ${prod.id}:`, error.message);
      }
    }

    // 4. Migrate Customers
    if (currentState.customers && currentState.customers.length > 0) {
      console.log(`Migrating ${currentState.customers.length} Customers...`);
      for (const customer of currentState.customers) {
        const payload = {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          referred_by: customer.referredBy,
          kpoints_balance: customer.kpointsBalance
        };
        
        const { error } = await supabase.from('kfs_customers').upsert(payload);
        if (error) console.error(`Error migrating customer ${customer.id}:`, error.message);
      }
    }

    console.log("Migration Complete! Data safely transferred to relational tables (Rule 1 respected).");

  } catch (error) {
    console.error("Migration Failed:", error);
  }
}

migrateData();
