import React, { useState } from 'react';
import { supabase } from '../context/supabase';
import { Store, Zap, Globe, Plus, Check } from 'lucide-react';

export const OracleControlSlider = ({ db, setDb, showToast, onOpenCreateMerchantModal }: any) => {
  const clients = db?.clients || [];
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [fee, setFee] = useState(2.0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAppliedMsg, setLastAppliedMsg] = useState<string | null>(null);

  // Apply fee to single merchant or all
  const applyFeeToClient = async (targetId: string, targetFee: number) => {
    setIsSaving(true);
    try {
      if (targetId === "all") {
        // Bulk update local state
        if (setDb) {
          setDb((prev: any) => ({
            ...prev,
            clients: (prev.clients || []).map((c: any) => ({
              ...c,
              kfsFeePercentage: targetFee / 100,
              fee_tier: `${targetFee}%`,
              oracle_fee_percentage: targetFee
            }))
          }));
        }

        // Try update Supabase if configured
        try {
          await supabase
            .from('kfs_clients')
            .update({ oracle_fee_percentage: targetFee, kfsFeePercentage: targetFee / 100 });
        } catch (e) {
          // ignore offline sync
        }

        setLastAppliedMsg(`Tasa de ${targetFee.toFixed(1)}% aplicada a TODOS los comercios de la red.`);
        if (showToast) showToast(`Tasa de ${targetFee.toFixed(1)}% aplicada globalmente.`, "success");
      } else {
        // Single update
        if (setDb) {
          setDb((prev: any) => ({
            ...prev,
            clients: (prev.clients || []).map((c: any) => 
              c.id === targetId ? { ...c, kfsFeePercentage: targetFee / 100, fee_tier: `${targetFee}%`, oracle_fee_percentage: targetFee } : c
            )
          }));
        }

        try {
          await supabase
            .from('kfs_clients')
            .update({ oracle_fee_percentage: targetFee, kfsFeePercentage: targetFee / 100 })
            .eq('id', targetId);
        } catch (e) {
          // ignore offline sync
        }

        const targetClient = clients.find((c: any) => c.id === targetId);
        const clientName = targetClient?.company || targetClient?.name || targetId;
        setLastAppliedMsg(`Tasa de ${targetFee.toFixed(1)}% aplicada a '${clientName}'.`);
        if (showToast) showToast(`Tasa de ${targetFee.toFixed(1)}% actualizada para ${clientName}.`, "success");
      }
    } catch (err) {
      if (showToast) showToast("Error guardando tasa", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Bulk Apply by Filter Category
  const applyBulkCategory = async (category: "fisico" | "digital") => {
    setIsSaving(true);
    const targetFee = fee;

    const filterFn = (c: any) => {
      if (category === "fisico") {
        return c.hasPhysicalStore || c.storeSettings?.hasPhysicalStore || !c.is_digital_only;
      } else {
        return c.is_digital_only || c.account_tier === "digital" || c.storeSettings?.isNitroDigital;
      }
    };

    if (setDb) {
      setDb((prev: any) => ({
        ...prev,
        clients: (prev.clients || []).map((c: any) => 
          filterFn(c) ? { ...c, kfsFeePercentage: targetFee / 100, fee_tier: `${targetFee}%`, oracle_fee_percentage: targetFee } : c
        )
      }));
    }

    const categoryLabel = category === "fisico" ? "Comercios con Local Físico" : "Comercios AxisNitro Digitales";
    setLastAppliedMsg(`Tasa del ${targetFee.toFixed(1)}% aplicada masivamente a: ${categoryLabel}.`);
    if (showToast) showToast(`Tasa masiva aplicada a ${categoryLabel}`, "success");
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-slate-900 border-l-4 border-amber-500 rounded-3xl shadow-2xl mb-8 mt-6 text-white relative z-30 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-amber-400 font-black text-lg flex items-center gap-2">
            👁️ ORÁCULO: Control Dinámico de Tasas y Comisiones
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura la comisión porcentual por venta para comercios individuales o categorías masivas.
          </p>
        </div>

        <button 
          onClick={() => {
            if (onOpenCreateMerchantModal) {
              onOpenCreateMerchantModal(fee);
            } else if (showToast) {
              showToast(`Abre 'Crear Comercio' en Accesos Inmediatos para inscribir con ${fee.toFixed(1)}%`, "info");
            }
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer border-none flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} /> Crear Comercio con ({fee.toFixed(1)}%)
        </button>
      </div>

      {/* Target Merchant Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-[10px] text-amber-300 font-black uppercase tracking-widest mb-1.5">
            1. Seleccionar Comercio Destino
          </label>
          <select 
            value={selectedClientId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedClientId(val);
              if (val !== "all") {
                const target = clients.find((c: any) => c.id === val);
                if (target?.oracle_fee_percentage) {
                  setFee(target.oracle_fee_percentage);
                } else if (target?.kfsFeePercentage) {
                  setFee(target.kfsFeePercentage * 100);
                }
              }
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">🌐 TODOS los Comercios de la Red (Ajuste Masivo)</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                🏬 {c.company || c.name || c.id} — (Actual: {(c.oracle_fee_percentage || (c.kfsFeePercentage ? c.kfsFeePercentage * 100 : 2.0)).toFixed(1)}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">
            Estado de Selección
          </label>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-bold flex items-center justify-between">
            <span>{selectedClientId === "all" ? "Modo Global" : "Modo Individual"}</span>
            <span className="font-mono text-emerald-400">{fee.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl mb-6">
        <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
          <span>0.1% (Tarifa Mínima)</span>
          <span className="text-amber-400 font-black text-sm">Comisión Seleccionada: {fee.toFixed(1)}%</span>
          <span>10.0% (Tarifa Máxima)</span>
        </div>
        
        <input 
          type="range" 
          min="0.1" 
          max="10.0" 
          step="0.1" 
          value={fee} 
          onChange={(e) => setFee(parseFloat(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        <div className="mt-4 flex items-center justify-between">
          <button 
            onClick={() => applyFeeToClient(selectedClientId, fee)}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 border-none cursor-pointer flex items-center gap-2"
          >
            <Check size={16} /> {selectedClientId === "all" ? "Aplicar Tasa a Toda la Red" : "Aplicar Tasa a este Comercio"}
          </button>

          {isSaving && <span className="text-xs text-amber-400 animate-pulse font-mono font-bold">Guardando en Supabase...</span>}
        </div>
      </div>

      {/* Bulk Presets Section */}
      <div className="pt-2 border-t border-white/10">
        <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
          3. Accesos Rápidos de Aplicación Masiva por Categoría
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={() => applyBulkCategory("fisico")}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-all border-none cursor-pointer group"
          >
            <Store className="text-emerald-400 mb-1" size={18} />
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">🏬 Locales Físicos</p>
            <p className="text-[10px] text-slate-400">Aplicar {fee.toFixed(1)}% a tiendas físicas</p>
          </button>

          <button 
            onClick={() => applyBulkCategory("digital")}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-all border-none cursor-pointer group"
          >
            <Zap className="text-cyan-400 mb-1" size={18} />
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">⚡ AxisNitro Digitales</p>
            <p className="text-[10px] text-slate-400">Aplicar {fee.toFixed(1)}% a tiendas virtuales</p>
          </button>

          <button 
            onClick={() => applyFeeToClient("all", fee)}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-all border-none cursor-pointer group"
          >
            <Globe className="text-violet-400 mb-1" size={18} />
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">🌐 Red Completa</p>
            <p className="text-[10px] text-slate-400">Aplicar {fee.toFixed(1)}% a todos los nodos</p>
          </button>
        </div>

        {lastAppliedMsg && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono font-bold animate-fade-in flex items-center gap-2">
            <span>✅ {lastAppliedMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
