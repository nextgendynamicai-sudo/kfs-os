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
('7591006000016', 'Harina PAN Blanca (1kg)', '', 'Alimentos', 'Alimentos Polar'),
('7591005000574', 'Margarina Mavesa Común (500g)', '', 'Alimentos', 'Alimentos Polar'),
('7591005001151', 'Mayonesa Mavesa Tradicional (445g)', '', 'Alimentos', 'Alimentos Polar'),
('7591001000219', 'Malta Polar Botella (250ml)', '', 'Bebidas', 'Cervecería Polar'),
('7591001000110', 'Cerveza Polar Pilsen (Tercio 295ml)', '', 'Bebidas', 'Cervecería Polar'),
('7591395000147', 'Pirulin Original (Lata 190g)', '', 'Dulces', 'Nucita Venezolana'),
('7591016205722', 'Galleta Savoy Cocosette (50g)', '', 'Dulces', 'Nestlé Savoy'),
('7591016205708', 'Galleta Savoy Susy (50g)', '', 'Dulces', 'Nestlé Savoy'),
('7591016035251', 'Chocolate Savoy de Leche (130g)', '', 'Dulces', 'Nestlé Savoy'),
('7591016035404', 'Bombón Savoy Toronto (Bolsa 36u)', '', 'Dulces', 'Nestlé Savoy'),
('7591005001229', 'Queso Fundido Rikesa Cheddar (300g)', '', 'Alimentos', 'Alimentos Polar'),
('7591041000675', 'Queso Fundido Cheez Whiz (300g)', '', 'Alimentos', 'Kraft'),
('7591005002042', 'Toddy Chocolate en Polvo (400g)', '', 'Bebidas', 'Alimentos Polar'),
('7591018000547', 'Salsa de Tomate Pampero (397g)', '', 'Alimentos', 'Pampero'),
('7591642000678', 'Arroz Mary Dorado Extra (1kg)', '', 'Alimentos', 'Alimentos Mary'),
('7591024001019', 'Café Molido Fama de América (250g)', '', 'Alimentos', 'Fama de América'),
('7591006001044', 'Pasta Primor Spaghetti (1kg)', '', 'Alimentos', 'Alimentos Polar'),
('7591060000120', 'Diablitos Underwood Jamón (115g)', '', 'Alimentos', 'Diablitos Underwood'),
('7591021000107', 'Atún Margarita en Aceite (140g)', '', 'Alimentos', 'Alimentos Polar'),
('759104101405', 'Salsa Inglesa Kraft (150ml)', '', 'Alimentos', 'Kraft'),
('7591005000758', 'Vinagre Blanco Mavesa (1L)', '', 'Alimentos', 'Alimentos Polar'),
('7591005002905', 'Detergente Polvo Las Llaves (1kg)', '', 'Limpieza', 'Alimentos Polar'),
('7591005001601', 'Jabón Azul Las Llaves Bebé (250g)', '', 'Limpieza', 'Alimentos Polar'),
('7591142100014', 'Harina de Trigo Robin Hood (1kg)', '', 'Alimentos', 'Monaca'),
('7591736000454', 'Suavizante Ensueño Floral (1L)', '', 'Limpieza', 'Corimon')
ON CONFLICT (barcode) DO UPDATE SET 
    name = EXCLUDED.name, 
    image_url = EXCLUDED.image_url, 
    category = EXCLUDED.category, 
    brand = EXCLUDED.brand;
