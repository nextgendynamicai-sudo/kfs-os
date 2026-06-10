-- =========================================================================================
-- KFS OS - ENTERPRISE RELATIONAL SCHEMA
-- Este script crea las tablas relacionales para respaldar el estado JSON en tiempo real.
-- Ejecutar en el SQL Editor de Supabase.
-- =========================================================================================

-- 1. Usuarios (Auth extendido)
CREATE TABLE IF NOT EXISTS public.kfs_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role VARCHAR(50) NOT NULL, -- 'core', 'promotora', 'dueño', 'vendedor', 'rider', 'customer'
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Clientes (Dueños de Comercio)
CREATE TABLE IF NOT EXISTS public.kfs_merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.kfs_users(id),
    company_name VARCHAR(255) NOT NULL,
    kfs_tier VARCHAR(50) DEFAULT 'monopoly',
    kfs_fee_percentage DECIMAL(5,4) DEFAULT 0.05, -- 5% base, baja a 3%
    sales_usd DECIMAL(12,2) DEFAULT 0.0,
    kfs_fees_owed_usd DECIMAL(12,2) DEFAULT 0.0,
    pending_payout_usd DECIMAL(12,2) DEFAULT 0.0,
    onboarded_users_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Consumidores Finales (Customers con Billetera y K-Points)
CREATE TABLE IF NOT EXISTS public.kfs_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.kfs_users(id),
    real_balance_usd DECIMAL(12,2) DEFAULT 0.0,
    k_points_balance INTEGER DEFAULT 0,
    k_points_expiry TIMESTAMP WITH TIME ZONE,
    referred_by_promoter_id UUID,
    referred_by_merchant_id UUID,
    referred_by_customer_id UUID,
    has_recharged BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Transacciones (Pagos y Consumos)
CREATE TABLE IF NOT EXISTS public.kfs_transactions (
    id VARCHAR(100) PRIMARY KEY,
    merchant_id UUID REFERENCES public.kfs_merchants(id),
    vendedor_id VARCHAR(100), -- Opcional, referencia al vendedor
    customer_phone VARCHAR(50),
    amount_usd DECIMAL(12,2) NOT NULL,
    subtotal_usd DECIMAL(12,2) NOT NULL,
    kfs_fee_usd DECIMAL(12,2) NOT NULL,
    net_store_usd DECIMAL(12,2) NOT NULL,
    k_points_burned INTEGER DEFAULT 0,
    k_points_discount_usd DECIMAL(12,2) DEFAULT 0.0,
    payment_method VARCHAR(50) NOT NULL,
    receipt_number VARCHAR(100),
    is_fiscal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Solicitudes de Liquidación (Payouts)
CREATE TABLE IF NOT EXISTS public.kfs_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.kfs_merchants(id),
    promotora_id UUID, -- Solo uno de los dos se llena
    amount_usd DECIMAL(12,2) NOT NULL,
    bank_details TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 6. Recargas de Billetera (Webhooks Log)
CREATE TABLE IF NOT EXISTS public.kfs_wallet_fundings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.kfs_customers(id),
    amount_usd DECIMAL(12,2) NOT NULL,
    gateway VARCHAR(50) NOT NULL, -- 'binance', 'zinli', 'pago_movil'
    reference_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seguridad RLS Básica
ALTER TABLE public.kfs_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_payouts ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own data" ON public.kfs_users FOR SELECT USING (auth.uid() = id);
-- Agrega políticas adicionales según sea necesario...
