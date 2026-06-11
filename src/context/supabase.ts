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

function base64ToBlob(base64: string): { blob: Blob; mimeType: string } | null {
  const parts = base64.split(";base64,");
  if (parts.length !== 2) return null;
  const mimeType = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return { blob: new Blob([byteArray], { type: mimeType }), mimeType };
}

export async function uploadAsset(filePath: string, base64OrFile: string | File): Promise<string> {
  if (!isSupabaseConfigured) return typeof base64OrFile === "string" ? base64OrFile : "";

  try {
    let fileToUpload: File | Blob;
    let contentType: string | undefined;

    if (typeof base64OrFile === "string") {
      if (!base64OrFile.startsWith("data:")) {
        return base64OrFile;
      }
      const converted = base64ToBlob(base64OrFile);
      if (!converted) return base64OrFile;
      fileToUpload = converted.blob;
      contentType = converted.mimeType;
    } else {
      fileToUpload = base64OrFile;
      contentType = base64OrFile.type;
    }

    const bucket = "kfs-assets";

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        upsert: true,
        contentType: contentType
      });

    if (error) {
      console.warn("[Supabase Storage] Error de subida:", error.message);
      return typeof base64OrFile === "string" ? base64OrFile : "";
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl || (typeof base64OrFile === "string" ? base64OrFile : "");
  } catch (err) {
    console.warn("[Supabase Storage] Fallo de subida:", err);
    return typeof base64OrFile === "string" ? base64OrFile : "";
  }
}
