// app/nitro/[slug]/page.tsx
// Server Component con Motor Multi-Tenant para máxima velocidad, SEO y resolución cloud

import { supabase } from '../../../context/supabase';
import { initialDB } from '../../../config/initialDB';

export default async function NitroStorefront({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();

  let storeName = "Tienda Oficial Axis Nitro";
  let storeBio = "Catálogo oficial del ecosistema Axis Nitro & KFS OS.";
  let storeLogo = "https://cdn-icons-png.flaticon.com/512/3063/3063822.png";
  let storeBanner = "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60";
  let themeColor = "#C5A184";
  let productsData: any[] = [];
  let found = false;

  // 1. Intentar resolver desde 'axis_nitro_hubs'
  try {
    const { data: hubData } = await supabase
      .from('axis_nitro_hubs')
      .select('*')
      .eq('slug', cleanSlug)
      .single();

    if (hubData) {
      found = true;
      storeName = hubData.store_name || storeName;
      
      const { data: nitroProds } = await supabase
        .from('axis_nitro_products')
        .select('*')
        .eq('hub_id', hubData.id);
      
      if (nitroProds) {
        productsData = nitroProds.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description || "",
          image_url: p.image_url || ""
        }));
      }

      if (hubData.owner_id) {
        const { data: clientData } = await supabase
          .from('kfs_clients')
          .select('id, raw_data')
          .eq('raw_data->>auth_user_id', hubData.owner_id)
          .single();

        if (clientData) {
          const raw = clientData.raw_data || {};
          if (raw.storeSettings) {
            storeBio = raw.storeSettings.bioText || storeBio;
            themeColor = raw.storeSettings.themeColor || themeColor;
            storeLogo = raw.storeSettings.profilePicUrl || storeLogo;
            storeBanner = raw.storeSettings.coverPhotoUrl || storeBanner;
          }

          const { data: kfsProducts } = await supabase
            .from('kfs_products')
            .select('*')
            .eq('client_id', clientData.id);

          if (kfsProducts && kfsProducts.length > 0) {
            const mappedKfs = kfsProducts.map((kp: any) => ({
              id: kp.id,
              name: kp.name,
              price: kp.price_usd,
              description: kp.raw_data?.description || "",
              image_url: kp.image_url || kp.raw_data?.photoUrl || kp.raw_data?.image_url || ""
            }));

            const existing = new Set(productsData.map((p: any) => p.name.toLowerCase()));
            const unique = mappedKfs.filter((kp: any) => !existing.has(kp.name.toLowerCase()));
            productsData = [...productsData, ...unique];
          }
        }
      }
    }
  } catch (err) {
    // Continuar con resolución de respaldo
  }

  // 2. Intentar resolver desde 'kfs_clients' si aún no se encontró
  if (!found) {
    try {
      const { data: clients } = await supabase.from('kfs_clients').select('*');
      if (clients && clients.length > 0) {
        const target = clients.find((c: any) => {
          const raw = c.raw_data || {};
          const s = raw.slug || (raw.company || raw.name || c.id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return s === cleanSlug || c.id?.toLowerCase() === cleanSlug;
        });

        if (target) {
          found = true;
          const raw = target.raw_data || {};
          storeName = raw.company || raw.name || "Comercio KFS";
          if (raw.storeSettings) {
            storeBio = raw.storeSettings.bioText || storeBio;
            themeColor = raw.storeSettings.themeColor || themeColor;
            storeLogo = raw.storeSettings.profilePicUrl || storeLogo;
            storeBanner = raw.storeSettings.coverPhotoUrl || storeBanner;
          }

          const { data: kfsProducts } = await supabase
            .from('kfs_products')
            .select('*')
            .eq('client_id', target.id);

          if (kfsProducts) {
            productsData = kfsProducts.map((kp: any) => ({
              id: kp.id,
              name: kp.name,
              price: kp.price_usd,
              description: kp.raw_data?.description || "",
              image_url: kp.image_url || kp.raw_data?.photoUrl || kp.raw_data?.image_url || ""
            }));
          }
        }
      }
    } catch (err) {
      // Continuar a fallback local
    }
  }

  // 3. Fallback a catálogo inicial / tienda oficial (kfs-express)
  if (!found && (cleanSlug === "kfs-express" || cleanSlug === "oficial" || cleanSlug === "axis-nitro")) {
    found = true;
    const client = initialDB.clients[0];
    storeName = client.company;
    storeBio = client.storeSettings?.bioText || storeBio;
    themeColor = client.storeSettings?.themeColor || themeColor;
    storeLogo = client.storeSettings?.profilePicUrl || storeLogo;
    productsData = initialDB.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.priceUSD,
      description: p.description,
      image_url: p.image
    }));
  }

  if (!found) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-950/30 border border-red-800/40 rounded-full flex items-center justify-center mx-auto text-red-500 text-2xl">
            🏬
          </div>
          <h1 className="text-2xl font-black text-white">Nodo Comercial No Encontrado</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            La tienda bajo el enlace <strong className="text-amber-400 font-mono">/nitro/{cleanSlug}</strong> no está registrada en el sistema o está en proceso de activación.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white hover:bg-neutral-200 text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 no-underline"
          >
            Volver al Ecosistema Axis Nitro
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Banner de Portada de la Tienda */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full bg-neutral-900 overflow-hidden">
        <img 
          src={storeBanner} 
          alt={storeName} 
          className="w-full h-full object-cover opacity-60 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
      </div>

      {/* Header y Perfil de la Tienda */}
      <header className="max-w-6xl mx-auto px-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Logo */}
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-2 border-2 border-neutral-700 bg-neutral-950 flex items-center justify-center shrink-0 shadow-xl overflow-hidden"
            style={{ borderColor: themeColor }}
          >
            <img 
              src={storeLogo} 
              alt={storeName} 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{storeName}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ✓ Tienda Verificada
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {storeBio}
            </p>
          </div>

          {/* Acceso a Checkout / Login */}
          <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
            <a 
              href="/#core"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all active:scale-95 no-underline shadow-lg"
            >
              Acceso POS
            </a>
            <span className="text-[10px] text-neutral-500 font-mono">
              Red Axis Nitro • KFS OS
            </span>
          </div>
        </div>
      </header>

      {/* Catálogo de Productos del Tenant */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛍️ Catálogo Disponible
          </h2>
          <span className="text-xs text-neutral-400 font-mono bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
            {productsData.length} productos
          </span>
        </div>

        {productsData.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 space-y-4 max-w-xl mx-auto mt-6 shadow-xl">
            <div className="text-5xl">📦</div>
            <h3 className="text-xl font-bold text-white">Inventario en Actualización</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Esta tienda virtual ya está activada en la red Axis Nitro, pero su catálogo se está renovando.
            </p>
            <div className="pt-2">
              <a 
                href="/#login" 
                className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider no-underline transition-transform active:scale-95"
              >
                Ingresar al Panel de Comercio
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.map((product: any) => (
              <div 
                key={product.id} 
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/80 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl"
              >
                {/* Imagen del Producto */}
                <div className="h-48 bg-neutral-800/80 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="text-neutral-600 text-xs font-bold uppercase">
                      Axis Nitro Product
                    </div>
                  )}
                </div>

                {/* Info y Precio */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold">Precio</p>
                      <p className="text-lg font-black text-amber-400 font-mono">
                        ${Number(product.price).toFixed(2)} <span className="text-[10px] text-neutral-400">USD</span>
                      </p>
                    </div>

                    <a 
                      href={`/pos?tenant=${cleanSlug}&product=${product.id}`}
                      className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-xl transition-all shadow active:scale-95 no-underline"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
