import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uplgtylqjkxallwtnehj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const supabase = createClient(supabaseUrl, serviceRoleKey);

function base64ToBuffer(base64Str: string): { buffer: Buffer; mimeType: string } | null {
  try {
    const parts = base64Str.split(";base64,");
    if (parts.length !== 2) return null;
    const mimeType = parts[0].split(":")[1];
    const buffer = Buffer.from(parts[1], "base64");
    return { buffer, mimeType };
  } catch {
    return null;
  }
}

async function uploadBase64ToStorage(base64: string, path: string): Promise<string> {
  const converted = base64ToBuffer(base64);
  if (!converted) return base64; // Si falla, retorna el original

  const { error } = await supabase.storage
    .from("kfs-assets")
    .upload(path, converted.buffer, {
      upsert: true,
      contentType: converted.mimeType
    });

  if (error) {
    console.error("Error subiendo", path, error.message);
    return base64;
  }

  const { data } = supabase.storage.from("kfs-assets").getPublicUrl(path);
  return data.publicUrl;
}

async function migrateProducts() {
  console.log("Migrando imágenes Base64 de Productos...");
  
  const { data: products, error } = await supabase.from("products").select("id, image, raw_data");
  if (error) {
    console.error("Error fetch products:", error);
    return;
  }

  let migrated = 0;
  for (const product of products || []) {
    if (product.image && typeof product.image === "string" && product.image.startsWith("data:image")) {
      console.log(`[Producto] Migrando imagen para ${product.id}`);
      const newUrl = await uploadBase64ToStorage(product.image, `migrated/products/${product.id}_${Date.now()}.png`);
      
      if (newUrl !== product.image) {
        let newRawData = product.raw_data;
        if (newRawData && newRawData.image === product.image) {
          newRawData.image = newUrl;
        }

        await supabase.from("products").update({
          image: newUrl,
          raw_data: newRawData
        }).eq("id", product.id);

        await supabase.from("kfs_products").update({
          image: newUrl
        }).eq("id", product.id);
        
        migrated++;
      }
    }
  }
  console.log(`✅ Productos migrados: ${migrated}`);
}

async function run() {
  console.log("Iniciando migración Base64 -> Storage...");
  await migrateProducts();
  console.log("¡Migración completada!");
}

run();
