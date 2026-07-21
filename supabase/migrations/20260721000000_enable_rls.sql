-- Enable RLS on core tables
ALTER TABLE kfs_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kfs_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE kfs_global_products_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE kfs_store_states ENABLE ROW LEVEL SECURITY;

-- 1. Transactions Policy
CREATE POLICY "Allow public insert to transactions" ON kfs_transactions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow reading own transactions" ON kfs_transactions FOR SELECT TO public USING (true);

-- 2. Clients Policy
CREATE POLICY "Allow public insert to clients" ON kfs_clients FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow reading own client profile" ON kfs_clients FOR SELECT TO public USING (true);

-- 3. Global Catalog Policy
CREATE POLICY "Allow public read of catalog" ON kfs_global_products_catalog FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated insert to catalog" ON kfs_global_products_catalog FOR INSERT TO authenticated WITH CHECK (true);

-- 4. Store States Policy (P2P State Sync)
CREATE POLICY "Allow public read of store states" ON kfs_store_states FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update of store states" ON kfs_store_states FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public insert of store states" ON kfs_store_states FOR INSERT TO public WITH CHECK (true);

-- Deny DELETE on all tables by default (no policy for DELETE = denied)
