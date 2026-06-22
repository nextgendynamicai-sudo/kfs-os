-- Tabla para los Nodos Comerciales (Tiendas de los clientes)
CREATE TABLE IF NOT EXISTS axis_nitro_hubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id), -- El dueño que pagó los $20
    store_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL amigable ej: mi-tienda
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el Inventario de esas tiendas
CREATE TABLE IF NOT EXISTS axis_nitro_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hub_id UUID REFERENCES axis_nitro_hubs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
