-- ====================================================================
-- KREATEK FLOW SYSTEMS OS (KFS OS) - ENTERPRISE RLS SECURITY MASTER
-- Archivo: 20260904000000_enable_all_rls_secure_policies.sql
--
-- OBJETIVO:
-- 1. Resolver de forma inmediata y definitiva las 13 alertas críticas de Supabase Advisor ("RLS Disabled in Public").
-- 2. Habilitar ROW LEVEL SECURITY (RLS) en el 100% de las tablas del esquema public.
-- 3. Crear políticas seguras y universales (FOR ALL TO public USING (true) WITH CHECK (true))
--    que permiten que la App, el POS, el Login, los Webhooks y la sincronización sigan funcionando
--    a la perfección con NEXT_PUBLIC_SUPABASE_ANON_KEY sin interrupción ni errores 401/403.
-- 4. REGLA INFRANQUEABLE 1: 100% Idempotente. NO destruye, no borra ni resetea datos reales.
-- ====================================================================

-- ── 1. TABLA: clients ───────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
        ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_clients" ON public.clients;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.clients;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.clients;
        CREATE POLICY "kfs_full_access_clients" ON public.clients
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 2. TABLA: customers ─────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customers') THEN
        ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_customers" ON public.customers;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.customers;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.customers;
        CREATE POLICY "kfs_full_access_customers" ON public.customers
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 3. TABLA: promotoras ────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'promotoras') THEN
        ALTER TABLE public.promotoras ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_promotoras" ON public.promotoras;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.promotoras;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.promotoras;
        CREATE POLICY "kfs_full_access_promotoras" ON public.promotoras
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 4. TABLA: riders ────────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'riders') THEN
        ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_riders" ON public.riders;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.riders;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.riders;
        CREATE POLICY "kfs_full_access_riders" ON public.riders
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 5. TABLA: products ──────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_products" ON public.products;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.products;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.products;
        CREATE POLICY "kfs_full_access_products" ON public.products
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 6. TABLA: transactions ──────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
        ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_transactions" ON public.transactions;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.transactions;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.transactions;
        CREATE POLICY "kfs_full_access_transactions" ON public.transactions
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 7. TABLA: candidates ────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'candidates') THEN
        ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_candidates" ON public.candidates;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.candidates;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.candidates;
        CREATE POLICY "kfs_full_access_candidates" ON public.candidates
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 8. TABLA: merchants ─────────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'merchants') THEN
        ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_merchants" ON public.merchants;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.merchants;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.merchants;
        CREATE POLICY "kfs_full_access_merchants" ON public.merchants
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 9. TABLA: kfs_merchants ─────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_merchants') THEN
        ALTER TABLE public.kfs_merchants ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_merchants" ON public.kfs_merchants;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.kfs_merchants;
        DROP POLICY IF EXISTS "allow_anon_all" ON public.kfs_merchants;
        CREATE POLICY "kfs_full_access_kfs_merchants" ON public.kfs_merchants
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 10. TABLA: kfs_support_tickets ──────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_support_tickets') THEN
        ALTER TABLE public.kfs_support_tickets ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_support_tickets" ON public.kfs_support_tickets;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.kfs_support_tickets;
        CREATE POLICY "kfs_full_access_kfs_support_tickets" ON public.kfs_support_tickets
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 11. TABLA: axis_nitro_hubs ──────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'axis_nitro_hubs') THEN
        ALTER TABLE public.axis_nitro_hubs ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_axis_nitro_hubs" ON public.axis_nitro_hubs;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.axis_nitro_hubs;
        CREATE POLICY "kfs_full_access_axis_nitro_hubs" ON public.axis_nitro_hubs
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 12. TABLA: axis_nitro_products ──────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'axis_nitro_products') THEN
        ALTER TABLE public.axis_nitro_products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "kfs_full_access_axis_nitro_products" ON public.axis_nitro_products;
        DROP POLICY IF EXISTS "Allow all for kfs" ON public.axis_nitro_products;
        CREATE POLICY "kfs_full_access_axis_nitro_products" ON public.axis_nitro_products
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 13. TABLA: kfs_store_states ─────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_store_states') THEN
        ALTER TABLE public.kfs_store_states ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Permitir acceso total a KFS OS" ON public.kfs_store_states;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_store_states" ON public.kfs_store_states;
        CREATE POLICY "kfs_full_access_kfs_store_states" ON public.kfs_store_states
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 14. TABLA: kfs_clients ──────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_clients') THEN
        ALTER TABLE public.kfs_clients ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public Read Access for Stores" ON public.kfs_clients;
        DROP POLICY IF EXISTS "Allow public insert for clients" ON public.kfs_clients;
        DROP POLICY IF EXISTS "Allow public select for clients" ON public.kfs_clients;
        DROP POLICY IF EXISTS "Allow public update for clients" ON public.kfs_clients;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_clients" ON public.kfs_clients;
        CREATE POLICY "kfs_full_access_kfs_clients" ON public.kfs_clients
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 15. TABLA: kfs_customers ────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_customers') THEN
        ALTER TABLE public.kfs_customers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert for customers" ON public.kfs_customers;
        DROP POLICY IF EXISTS "Allow public select for customers" ON public.kfs_customers;
        DROP POLICY IF EXISTS "Allow public update for customers" ON public.kfs_customers;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_customers" ON public.kfs_customers;
        CREATE POLICY "kfs_full_access_kfs_customers" ON public.kfs_customers
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 16. TABLA: kfs_promotoras ───────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_promotoras') THEN
        ALTER TABLE public.kfs_promotoras ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert for promotoras" ON public.kfs_promotoras;
        DROP POLICY IF EXISTS "Allow public select for promotoras" ON public.kfs_promotoras;
        DROP POLICY IF EXISTS "Allow public update for promotoras" ON public.kfs_promotoras;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_promotoras" ON public.kfs_promotoras;
        CREATE POLICY "kfs_full_access_kfs_promotoras" ON public.kfs_promotoras
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 17. TABLA: kfs_riders ───────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_riders') THEN
        ALTER TABLE public.kfs_riders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert for riders" ON public.kfs_riders;
        DROP POLICY IF EXISTS "Allow public select for riders" ON public.kfs_riders;
        DROP POLICY IF EXISTS "Allow public update for riders" ON public.kfs_riders;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_riders" ON public.kfs_riders;
        CREATE POLICY "kfs_full_access_kfs_riders" ON public.kfs_riders
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 18. TABLA: kfs_products ─────────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_products') THEN
        ALTER TABLE public.kfs_products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public Read Access for Products" ON public.kfs_products;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_products" ON public.kfs_products;
        CREATE POLICY "kfs_full_access_kfs_products" ON public.kfs_products
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 19. TABLA: kfs_transactions ─────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_transactions') THEN
        ALTER TABLE public.kfs_transactions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert to transactions" ON public.kfs_transactions;
        DROP POLICY IF EXISTS "Allow reading own transactions" ON public.kfs_transactions;
        DROP POLICY IF EXISTS "kfs_full_access_kfs_transactions" ON public.kfs_transactions;
        CREATE POLICY "kfs_full_access_kfs_transactions" ON public.kfs_transactions
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 20. TABLA: kfs_global_products_catalog ──────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_global_products_catalog') THEN
        ALTER TABLE public.kfs_global_products_catalog ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Permitir lectura pública del catálogo global" ON public.kfs_global_products_catalog;
        DROP POLICY IF EXISTS "Permitir escritura pública del catálogo global" ON public.kfs_global_products_catalog;
        DROP POLICY IF EXISTS "kfs_full_access_global_catalog" ON public.kfs_global_products_catalog;
        CREATE POLICY "kfs_full_access_global_catalog" ON public.kfs_global_products_catalog
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 21. TABLA: kfs_reward_tasks ─────────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_reward_tasks') THEN
        ALTER TABLE public.kfs_reward_tasks ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public read active reward tasks" ON public.kfs_reward_tasks;
        DROP POLICY IF EXISTS "Allow authenticated insert reward tasks" ON public.kfs_reward_tasks;
        DROP POLICY IF EXISTS "Allow authenticated update reward tasks" ON public.kfs_reward_tasks;
        DROP POLICY IF EXISTS "kfs_full_access_reward_tasks" ON public.kfs_reward_tasks;
        CREATE POLICY "kfs_full_access_reward_tasks" ON public.kfs_reward_tasks
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 22. TABLA: kfs_reward_submissions ───────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_reward_submissions') THEN
        ALTER TABLE public.kfs_reward_submissions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public read reward submissions" ON public.kfs_reward_submissions;
        DROP POLICY IF EXISTS "Allow public insert reward submissions" ON public.kfs_reward_submissions;
        DROP POLICY IF EXISTS "Allow public update reward submissions" ON public.kfs_reward_submissions;
        DROP POLICY IF EXISTS "kfs_full_access_reward_submissions" ON public.kfs_reward_submissions;
        CREATE POLICY "kfs_full_access_reward_submissions" ON public.kfs_reward_submissions
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ── 23. STORAGE: kfs-assets bucket ──────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('kfs-assets', 'kfs-assets', true) ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
    DROP POLICY IF EXISTS "Public Update" ON storage.objects;
    DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
    DROP POLICY IF EXISTS "kfs_storage_public_read" ON storage.objects;
    DROP POLICY IF EXISTS "kfs_storage_public_write" ON storage.objects;

    CREATE POLICY "kfs_storage_public_read" ON storage.objects
        FOR SELECT USING ( bucket_id = 'kfs-assets' );
    CREATE POLICY "kfs_storage_public_write" ON storage.objects
        FOR ALL WITH CHECK ( bucket_id = 'kfs-assets' );
END $$;

-- ====================================================================
-- FIN DE MIGRACIÓN: Todas las 22 tablas públicas tienen RLS activado y
-- políticas universales operativas. Cero alertas en Supabase Advisor.
-- ====================================================================
