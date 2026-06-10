-- =======================================================
-- KREATEK FLOW SYSTEMS OS (KFS OS) - OVERDRIVE EXTENSIONS
-- =======================================================

-- 1. Extend Users/Wallets (simulated relational schema or direct columns)
-- In our PWA codebase, customers are stored inside db_state JSON.
-- Below is the SQL representing these entities for reference/relational sync.

-- Table for customer details (Users/Wallets)
ALTER TABLE IF EXISTS kfs_customers 
  ADD COLUMN IF NOT EXISTS k_points_balance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS k_points_expiry TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS real_balance NUMERIC(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS referred_by_promoter_id UUID,
  ADD COLUMN IF NOT EXISTS referred_by_merchant_id TEXT;

-- 2. Extend Merchants (Clients)
ALTER TABLE IF EXISTS kfs_merchants 
  ADD COLUMN IF NOT EXISTS fee_tier VARCHAR(10) DEFAULT '5%',
  ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT FALSE;

-- 3. Extend Transactions
ALTER TABLE IF EXISTS kfs_transactions 
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'real_balance', -- real_balance, k_points, hybrid
  ADD COLUMN IF NOT EXISTS cashback_awarded INTEGER DEFAULT 0;
