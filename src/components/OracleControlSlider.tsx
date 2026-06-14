import React, { useState } from 'react';
import { supabase } from '../context/supabase';

export const OracleControlSlider = ({ merchantId, merchantName, currentFee, setDb }: any) => {
  const [fee, setFee] = useState(currentFee || 2.0);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateFee = async (newFee: number) => {
    setFee(newFee);
    setIsSaving(true);
    
    // Update Supabase
    const { error } = await supabase
      .from('kfs_clients')
      .update({ oracle_fee_percentage: newFee })
      .eq('id', merchantId);
    
    if (error) {
      console.error("Oracle Update Error:", error);
    } else if (setDb) {
      // Update local state if provided
      setDb((prev: any) => ({
        ...prev,
        clients: prev.clients.map((c: any) => 
          c.id === merchantId ? { ...c, oracle_fee_percentage: newFee } : c
        )
      }));
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-5 bg-gray-900 border-l-4 border-yellow-500 rounded-r-lg shadow-lg mb-4">
      <h3 className="text-yellow-500 font-bold mb-1">👁️ ORÁCULO: Control de Tasa Interno</h3>
      <p className="text-xs text-gray-400 mb-3">Nodo: {merchantName}</p>
      <div className="flex items-center gap-4">
        <span className="text-white text-xs font-mono">0.1%</span>
        <input 
          type="range" 
          min="0.1" max="10.0" step="0.1" 
          value={fee} 
          onChange={(e) => handleUpdateFee(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <span className="text-white text-xs font-mono">10.0%</span>
      </div>
      <div className="mt-3 text-center text-2xl text-green-400 font-mono font-bold tracking-widest">
        {fee.toFixed(1)}% {isSaving && <span className="text-xs text-gray-500 ml-2 animate-pulse">Guardando...</span>}
      </div>
    </div>
  );
};
