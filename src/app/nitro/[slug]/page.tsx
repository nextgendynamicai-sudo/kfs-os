// app/nitro/[slug]/page.tsx
// Server Component para máxima velocidad y SEO

import { supabase } from '../../../context/supabase';

export default async function NitroStorefront({ params }: { params: { slug: string } }) {
  // 1. Query a 'axis_nitro_hubs' donde slug == params.slug
  const { data: hubData } = await supabase.from('axis_nitro_hubs').select('*').eq('slug', params.slug).single();
  
  // 2. Query a 'axis_nitro_products' y 'kfs_products' de forma interconectada
  let productsData: any[] = [];
  if (hubData) {
    // A. Query axis_nitro_products
    const { data: nitroProds } = await supabase.from('axis_nitro_products').select('*').eq('hub_id', hubData.id);
    productsData = nitroProds || [];
    
    // B. Query kfs_clients y kfs_products para buscar productos del catálogo principal
    if (hubData.owner_id) {
      try {
        const { data: clientData } = await supabase
          .from('kfs_clients')
          .select('id')
          .eq('raw_data->>auth_user_id', hubData.owner_id)
          .single();
        
        if (clientData) {
          const { data: kfsProducts } = await supabase
            .from('kfs_products')
            .select('*')
            .eq('client_id', clientData.id);
          
          if (kfsProducts && kfsProducts.length > 0) {
            const mappedKfsProducts = kfsProducts.map((kp: any) => ({
              id: kp.id,
              name: kp.name,
              price: kp.price_usd,
              image_url: kp.image_url || kp.raw_data?.photoUrl || kp.raw_data?.image_url || ""
            }));
            
            // Unir sin duplicar nombres de productos
            const existingNames = new Set(productsData.map((p: any) => p.name.toLowerCase()));
            const uniqueKfsProds = mappedKfsProducts.filter((kp: any) => !existingNames.has(kp.name.toLowerCase()));
            productsData = [...productsData, ...uniqueKfsProds];
          }
        }
      } catch (err) {
        console.error("Error al consultar productos del catálogo principal:", err);
      }
    }
  }

  if (!hubData) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] space-y-6">
          <div className="w-16 h-16 bg-red-950/20 border border-red-800/40 rounded-full flex items-center justify-center mx-auto text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Nodo Comercial No Encontrado</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            La tienda bajo el enlace <strong className="text-yellow-500">/nitro/{params.slug}</strong> no está registrada en el sistema KFS o ha sido inhabilitada temporalmente.
          </p>
          <a href="/" className="inline-block bg-white text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-transform active:scale-95 no-underline">
            Volver al Ecosistema KFS
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header de la tienda */}
      <header className="border-b border-neutral-800 bg-black p-6 text-center">
        <h1 className="text-3xl font-bold text-yellow-500">{hubData.store_name}</h1>
        <p className="text-neutral-400 text-sm mt-1">Licencia Operativa KFS Activa</p>
      </header>

      {/* Grid de Productos */}
      <main className="max-w-6xl mx-auto p-6">
        {productsData.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 space-y-4 max-w-xl mx-auto mt-10">
            <div className="text-4xl">📦</div>
            <h2 className="text-xl font-bold text-white">Sin productos en catálogo</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Esta tienda virtual ya está activada en la red transaccional, pero su inventario de venta está vacío.
            </p>
            <div className="pt-2">
              <a href="/#login" className="inline-block bg-yellow-600 hover:bg-yellow-500 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider no-underline">
                Iniciar Sesión para Cargar Inventario
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.map((product: any) => (
              <div key={product.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-yellow-500 transition-colors">
                <div className="h-48 bg-neutral-800 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600">Imagen del Producto</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-yellow-500 font-bold mt-2">${product.price}</p>
                  <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 cursor-pointer">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
