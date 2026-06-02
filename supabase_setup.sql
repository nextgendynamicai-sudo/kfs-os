-- 1. Crear la tabla principal de estados (si no existe)
CREATE TABLE IF NOT EXISTS kfs_store_states (
  id text PRIMARY KEY,
  db_state jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Desactivar RLS para permitir lectura/escritura pública temporalmente (MVP)
-- En producción, deberías usar Row Level Security (RLS) con políticas estrictas.
ALTER TABLE kfs_store_states DISABLE ROW LEVEL SECURITY;

-- 3. Activar Supabase Realtime para esta tabla
-- Esto permite que los cambios se transmitan instantáneamente a todos los dispositivos (Teléfonos, PCs, Vercel)
BEGIN;
  -- Si supabase_realtime no existe, esto fallará silenciosamente, pero normalmente ya existe.
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

-- O alternativamente, para asegurar específicamente esta tabla:
ALTER PUBLICATION supabase_realtime ADD TABLE kfs_store_states;
