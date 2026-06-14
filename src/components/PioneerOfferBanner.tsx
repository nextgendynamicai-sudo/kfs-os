import React, { useState, useEffect } from 'react';
import { supabase } from '../context/supabase'; // Ajuste a la ruta correcta del cliente de supabase en el proyecto

export const PioneerOfferBanner = () => {
  const [remainingNodes, setRemainingNodes] = useState(100);

  useEffect(() => {
    const fetchActiveNodes = async () => {
      // Usamos kfs_clients o la tabla principal de comercios
      const { count, error } = await supabase
        .from('kfs_clients') 
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (!error && count !== null) setRemainingNodes(100 - count);
    };
    fetchActiveNodes();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border border-yellow-600/50 rounded-2xl p-8 text-center shadow-2xl my-8">
      <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-4 tracking-tighter">Oferta Pioneros Chacao</h2>
      <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
        Gobernanza Total (Software POS, PWA, Marketing IA y Red de Clientes) por un Setup único de $30 USD y solo el 2% de tu facturación. Sin mensualidades.
      </p>
      <div className="inline-block bg-black border-2 border-red-500 rounded-lg px-6 py-3 animate-pulse">
        <p className="text-red-500 font-mono text-xl font-bold">
          CUPOS RESTANTES TASA FUNDADOR (2%): <span className="text-4xl">{remainingNodes > 0 ? remainingNodes : 0}</span>
        </p>
      </div>
    </div>
  );
};
