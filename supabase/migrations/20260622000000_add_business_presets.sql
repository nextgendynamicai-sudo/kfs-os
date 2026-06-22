-- 1. Añadir columnas de Preset de forma segura a merchants (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'merchants') THEN
        ALTER TABLE public.merchants
        ADD COLUMN IF NOT EXISTS business_preset VARCHAR(50) DEFAULT 'RETAIL-QUICK',
        ADD COLUMN IF NOT EXISTS preset_metadata JSONB DEFAULT '{
          "ui_mode": "standard",
          "features": {
            "escandallos": false,
            "serial_tracking": false,
            "room_management": false,
            "weight_scale": false,
            "booking_system": false
          },
          "custom_labels": {
            "inventory_unit": "Item",
            "checkout_btn": "Cobrar"
          }
        }'::jsonb;
        
        CREATE INDEX IF NOT EXISTS idx_merchant_preset_metadata ON public.merchants USING GIN (preset_metadata);
    END IF;
END $$;

-- 2. Añadir columnas de Preset de forma segura a kfs_merchants (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_merchants') THEN
        ALTER TABLE public.kfs_merchants
        ADD COLUMN IF NOT EXISTS business_preset VARCHAR(50) DEFAULT 'RETAIL-QUICK',
        ADD COLUMN IF NOT EXISTS preset_metadata JSONB DEFAULT '{
          "ui_mode": "standard",
          "features": {
            "escandallos": false,
            "serial_tracking": false,
            "room_management": false,
            "weight_scale": false,
            "booking_system": false
          },
          "custom_labels": {
            "inventory_unit": "Item",
            "checkout_btn": "Cobrar"
          }
        }'::jsonb;
        
        CREATE INDEX IF NOT EXISTS idx_kfs_merchant_preset_metadata ON public.kfs_merchants USING GIN (preset_metadata);
    END IF;
END $$;

-- 3. Añadir columnas de Preset de forma segura a kfs_clients (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kfs_clients') THEN
        ALTER TABLE public.kfs_clients
        ADD COLUMN IF NOT EXISTS business_preset VARCHAR(50) DEFAULT 'RETAIL-QUICK',
        ADD COLUMN IF NOT EXISTS preset_metadata JSONB DEFAULT '{
          "ui_mode": "standard",
          "features": {
            "escandallos": false,
            "serial_tracking": false,
            "room_management": false,
            "weight_scale": false,
            "booking_system": false
          },
          "custom_labels": {
            "inventory_unit": "Item",
            "checkout_btn": "Cobrar"
          }
        }'::jsonb;
        
        CREATE INDEX IF NOT EXISTS idx_kfs_clients_preset_metadata ON public.kfs_clients USING GIN (preset_metadata);
    END IF;
END $$;
