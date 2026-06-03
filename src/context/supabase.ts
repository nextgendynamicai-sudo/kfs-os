import { createClient } from "@supabase/supabase-js";

const cleanEnv = (val?: string) => val ? val.replace(/[\uFEFF\u200B]/g, '').trim() : undefined;

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-project-id") && 
  !supabaseAnonKey.includes("your-anon-public-key")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : {
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          }),
          single: () => Promise.resolve({ data: null, error: null })
        }),
        upsert: (data: any) => {
          console.log(`[Supabase Mock Sync] Guardando en tabla ${table}:`, data);
          return Promise.resolve({ data, error: null });
        }
      })
    } as any;
