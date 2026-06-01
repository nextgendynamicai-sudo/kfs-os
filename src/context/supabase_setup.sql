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
-- Permite que los terminales de tu local comercial lean y guarden su estado de forma directa
DROP POLICY IF EXISTS "Permitir acceso total a KFS OS" ON kfs_store_states;

CREATE POLICY "Permitir acceso total a KFS OS" 
ON kfs_store_states 
FOR ALL 
USING (true) 
WITH CHECK (true);
