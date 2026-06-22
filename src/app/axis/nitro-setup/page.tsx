'use client';
import { useState } from 'react';
import { supabase } from '../../../context/supabase';

export default function NitroHubSetup() {
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('');

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creando tu Nodo...');
    
    // Simulate getting authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fallback ID if mock doesn't return a valid user in this standalone route
    const ownerId = user?.id || 'mock-owner-id-123';

    try {
      const { error } = await supabase.from('axis_nitro_hubs').insert([{
        owner_id: ownerId,
        store_name: storeName,
        slug: slug
      }]);

      if (error) {
        setStatus(`Error al crear: ${error.message}`);
        return;
      }
      
      setStatus('¡Axis Nitro Hub Activado! Ya puedes subir productos.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black text-white rounded-xl border border-gray-800 mt-10">
      <h1 className="text-2xl font-bold text-yellow-500 mb-2">Activación: Axis Nitro Hub</h1>
      <p className="text-gray-400 mb-6">Configura el entorno de tu nueva tienda digital.</p>
      
      <form onSubmit={handleCreateHub} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del Comercio</label>
          <input 
            type="text" 
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
            placeholder="Ej: Hamburguesas V2"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Enlace de tu Tienda (Slug)</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400 sm:text-sm">
              nitro.com/
            </span>
            <input 
              type="text" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-500 outline-none"
              placeholder="hamburguesas-v2"
              required 
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors">
          Desplegar Nodo Comercial
        </button>
        {status && <p className="text-yellow-500 text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
