// app/nitro/[slug]/page.tsx
// Server Component para máxima velocidad y SEO

import { supabase } from '../../../context/supabase';

export default async function NitroStorefront({ params }: { params: { slug: string } }) {
  // 1. Query a 'axis_nitro_hubs' donde slug == params.slug
  const { data: hubData } = await supabase.from('axis_nitro_hubs').select('*').eq('slug', params.slug).single();
  
  // 2. Query a 'axis_nitro_products' donde hub_id == hub.id
  let productsData = [];
  if (hubData) {
    const { data } = await supabase.from('axis_nitro_products').select('*').eq('hub_id', hubData.id);
    productsData = data || [];
  }

  // Mock temporal para visualización de UI inmediata si no hay DB conectada o el hub no se encuentra
  const hub = hubData || { store_name: 'Nodo Comercial Activo', slug: params.slug };
  const products = productsData.length > 0 ? productsData : [
    { id: 1, name: 'Producto de Prueba 1', price: 10 },
    { id: 2, name: 'Producto de Prueba 2', price: 15 }
  ];

  if (!hub) return <div className="p-10 text-center text-white bg-black h-screen">Nodo no encontrado o inactivo.</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header de la tienda */}
      <header className="border-b border-neutral-800 bg-black p-6 text-center">
        <h1 className="text-3xl font-bold text-yellow-500">{hub.store_name}</h1>
        <p className="text-neutral-400 text-sm mt-1">Licencia Operativa KFS Activa</p>
      </header>

      {/* Grid de Productos */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-yellow-500 transition-colors">
              <div className="h-48 bg-neutral-800 flex items-center justify-center">
                <span className="text-neutral-600">Imagen 400x400</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-yellow-500 font-bold mt-2">${product.price}</p>
                <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
