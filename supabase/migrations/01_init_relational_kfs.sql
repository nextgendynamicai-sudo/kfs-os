-- KFS OS Enterprise Architecture - Phase 3
-- Migrating from JSON Blob to Relational Schema

-- 1. Clients (Merchants / Businesses)
CREATE TABLE IF NOT EXISTS public.kfs_clients (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    address TEXT,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    kfs_fee_percentage NUMERIC DEFAULT 0.05,
    fee_tier TEXT DEFAULT '5%',
    is_founder BOOLEAN DEFAULT false,
    kfs_fees_owed_usd NUMERIC DEFAULT 0,
    is_onboarded BOOLEAN DEFAULT false,
    wallet_balance_usd NUMERIC DEFAULT 0,
    sales_usd NUMERIC DEFAULT 0,
    store_bio TEXT,
    store_theme_color TEXT,
    store_typography TEXT,
    store_layout_type TEXT,
    store_profile_pic_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Customers
CREATE TABLE IF NOT EXISTS public.kfs_customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    referred_by TEXT,
    kpoints_balance NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Promotoras
CREATE TABLE IF NOT EXISTS public.kfs_promotoras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pago_movil TEXT,
    binance_id TEXT,
    avatar TEXT,
    kyc_cedula TEXT,
    kyc_address TEXT,
    referred_by TEXT,
    earnings NUMERIC DEFAULT 0,
    referrals_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Riders
CREATE TABLE IF NOT EXISTS public.kfs_riders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    vehicle_type TEXT,
    cedula_img TEXT,
    med_cert_img TEXT,
    license_img TEXT,
    pago_movil_banco TEXT,
    pago_movil_telefono TEXT,
    pago_movil_cedula TEXT,
    referred_by TEXT,
    deliveries INTEGER DEFAULT 0,
    earnings NUMERIC DEFAULT 0,
    kpoints_balance NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Products
CREATE TABLE IF NOT EXISTS public.kfs_products (
    id TEXT PRIMARY KEY,
    seller_id TEXT REFERENCES public.kfs_clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_usd NUMERIC NOT NULL,
    stock INTEGER DEFAULT 0,
    description TEXT,
    image TEXT,
    category TEXT,
    cost_usd NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Transactions
CREATE TABLE IF NOT EXISTS public.kfs_transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'SALE', 'PAYOUT', 'FUND', 'TOPUP'
    amount_usd NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'COMPLETED',
    sender_id TEXT,
    receiver_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Row Level Security) - Basic Setup for V1
ALTER TABLE public.kfs_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kfs_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access for Stores" ON public.kfs_clients FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Products" ON public.kfs_products FOR SELECT USING (true);
