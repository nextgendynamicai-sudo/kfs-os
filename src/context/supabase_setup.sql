-- =======================================================
-- KREATEK FLOW SYSTEMS OS (KFS OS) - SUPABASE INITIAL SCHEMA
-- Ejecuta este script en el editor SQL de tu Supabase
-- =======================================================

-- 1. Crear la tabla de estados del comercio
CREATE TABLE IF NOT EXISTS kfs_store_states (
    id TEXT PRIMARY KEY,
    db_state JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar seguridad a nivel de filas (RLS)
ALTER TABLE kfs_store_states ENABLE ROW LEVEL SECURITY;

-- 3. Crear política de acceso público (Lectura/Escritura) para simplificación del POS
DROP POLICY IF EXISTS "Permitir acceso total a KFS OS" ON kfs_store_states;
CREATE POLICY "Permitir acceso total a KFS OS" 
ON kfs_store_states 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Crear la tabla del catálogo de productos global de Venezuela (Catálogo Nacional)
CREATE TABLE IF NOT EXISTS kfs_global_products_catalog (
    barcode TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    brand TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Habilitar seguridad a nivel de filas (RLS) para el catálogo global
ALTER TABLE kfs_global_products_catalog ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de acceso para el catálogo global (Lectura y Escritura Públicas para compatibilidad total POS offline/online)
DROP POLICY IF EXISTS "Permitir lectura pública del catálogo global" ON kfs_global_products_catalog;
CREATE POLICY "Permitir lectura pública del catálogo global" 
ON kfs_global_products_catalog 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Permitir escritura pública del catálogo global" ON kfs_global_products_catalog;
CREATE POLICY "Permitir escritura pública del catálogo global" 
ON kfs_global_products_catalog 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 7. Pre-poblar el catálogo global con productos icónicos de Venezuela (25+ códigos de barra 759 reales)
INSERT INTO kfs_global_products_catalog (barcode, name, image_url, category, brand) VALUES
('7591006000016', 'Harina PAN Blanca (1kg)', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591005000574', 'Margarina Mavesa Común (500g)', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591005001151', 'Mayonesa Mavesa Tradicional (445g)', 'https://images.unsplash.com/photo-1571266028243-e4bb33394de9?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591001000219', 'Malta Polar Botella (250ml)', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60', 'Bebidas', 'Cervecería Polar'),
('7591001000110', 'Cerveza Polar Pilsen (Tercio 295ml)', 'https://images.unsplash.com/photo-1608270176050-12ec0f24ee3d?w=500&auto=format&fit=crop&q=60', 'Bebidas', 'Cervecería Polar'),
('7591395000147', 'Pirulin Original (Lata 190g)', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60', 'Dulces', 'Nucita Venezolana'),
('7591016205722', 'Galleta Savoy Cocosette (50g)', 'https://images.unsplash.com/photo-1558961312-503d216d5813?w=500&auto=format&fit=crop&q=60', 'Dulces', 'Nestlé Savoy'),
('7591016205708', 'Galleta Savoy Susy (50g)', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60', 'Dulces', 'Nestlé Savoy'),
('7591016035251', 'Chocolate Savoy de Leche (130g)', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=60', 'Dulces', 'Nestlé Savoy'),
('7591016035404', 'Bombón Savoy Toronto (Bolsa 36u)', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60', 'Dulces', 'Nestlé Savoy'),
('7591005001229', 'Queso Fundido Rikesa Cheddar (300g)', 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591041000675', 'Queso Fundido Cheez Whiz (300g)', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Kraft'),
('7591005002042', 'Toddy Chocolate en Polvo (400g)', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60', 'Bebidas', 'Alimentos Polar'),
('7591018000547', 'Salsa de Tomate Pampero (397g)', 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Pampero'),
('7591642000678', 'Arroz Mary Dorado Extra (1kg)', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Mary'),
('7591024001019', 'Café Molido Fama de América (250g)', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Fama de América'),
('7591006001044', 'Pasta Primor Spaghetti (1kg)', 'https://images.unsplash.com/photo-1612966608997-30d211b2e1c4?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591060000120', 'Diablitos Underwood Jamón (115g)', 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Diablitos Underwood'),
('7591021000107', 'Atún Margarita en Aceite (140g)', 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('759104101405', 'Salsa Inglesa Kraft (150ml)', 'https://images.unsplash.com/photo-1589135306090-e555e09fbeb6?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Kraft'),
('7591005000758', 'Vinagre Blanco Mavesa (1L)', 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Alimentos Polar'),
('7591005002905', 'Detergente Polvo Las Llaves (1kg)', 'https://images.unsplash.com/photo-1607834306387-3ec72cc274b7?w=500&auto=format&fit=crop&q=60', 'Limpieza', 'Alimentos Polar'),
('7591005001601', 'Jabón Azul Las Llaves Bebé (250g)', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=60', 'Limpieza', 'Alimentos Polar'),
('7591142100014', 'Harina de Trigo Robin Hood (1kg)', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60', 'Alimentos', 'Monaca'),
('7591736000454', 'Suavizante Ensueño Floral (1L)', 'https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?w=500&auto=format&fit=crop&q=60', 'Limpieza', 'Corimon')
ON CONFLICT (barcode) DO UPDATE SET 
    name = EXCLUDED.name, 
    image_url = EXCLUDED.image_url, 
    category = EXCLUDED.category, 
    brand = EXCLUDED.brand;


-- 4. Storage Bucket Setup (kfs-assets)
INSERT INTO storage.buckets (id, name, public) VALUES ('kfs-assets', 'kfs-assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'kfs-assets' );
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'kfs-assets' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'kfs-assets' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'kfs-assets' );
