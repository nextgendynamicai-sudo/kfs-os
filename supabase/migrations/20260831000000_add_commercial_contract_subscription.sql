-- ====================================================================
-- KFS OS - Migración de Suscripción Comercial ($100 USD / 90 Días)
-- Regla de Preservación Absoluta: 100% Idempotente y No Destructiva
-- ====================================================================

-- 1. Añadir columnas de suscripción a kfs_clients (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_clients') THEN
        ALTER TABLE public.kfs_clients
        ADD COLUMN IF NOT EXISTS subscription JSONB DEFAULT '{
            "plan_type": "contract_b2b_chacao",
            "monthly_fee_usd": 100.00,
            "contract_duration_days": 90,
            "billing_day_of_month": 5,
            "contract_start_date": null,
            "contract_end_date": null,
            "is_trial_active": true,
            "payment_status": "settled",
            "cancellation_pending": false
        }'::jsonb;

        CREATE INDEX IF NOT EXISTS idx_kfs_clients_subscription ON public.kfs_clients USING GIN (subscription);
    END IF;
END $$;

-- 2. Añadir columnas de suscripción a clients (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
        ALTER TABLE public.clients
        ADD COLUMN IF NOT EXISTS subscription JSONB DEFAULT '{
            "plan_type": "contract_b2b_chacao",
            "monthly_fee_usd": 100.00,
            "contract_duration_days": 90,
            "billing_day_of_month": 5,
            "contract_start_date": null,
            "contract_end_date": null,
            "is_trial_active": true,
            "payment_status": "settled",
            "cancellation_pending": false
        }'::jsonb;

        CREATE INDEX IF NOT EXISTS idx_clients_subscription ON public.clients USING GIN (subscription);
    END IF;
END $$;

-- 3. Añadir columna tag a kfs_support_tickets si aplica
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_support_tickets') THEN
        ALTER TABLE public.kfs_support_tickets
        ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT NULL;
    END IF;
END $$;
