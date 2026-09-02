"use client";

import React, { useState } from "react";
import { AlertTriangle, Package, Plus, RefreshCw, Check, ArrowRight, ShieldAlert } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { Product } from "../types/core";

interface LowStockAlertsWidgetProps {
  products?: Product[];
  onRestock?: (productId: string, newStock: number) => void;
  isCompact?: boolean;
}

export const LowStockAlertsWidget: React.FC<LowStockAlertsWidgetProps> = ({
  products,
  onRestock,
  isCompact = false
}) => {
  const { db, setDb, showToast, activeTenant } = useKFS() as any;
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [addQty, setAddQty] = useState<number>(10);

  // Lista de productos a evaluar
  const sourceProducts: Product[] = products || db.products || [];
  
  // Filtrar si pertenecen al tenant activo o si es super admin
  const tenantProducts = activeTenant?.id
    ? sourceProducts.filter((p: any) => p.clientId === activeTenant.id || p.sellerId === activeTenant.id)
    : sourceProducts;

  // Filtrar productos con stock <= minStockAlert (default 5)
  const lowStockItems = tenantProducts.filter((p: any) => {
    const threshold = p.minStockAlert !== undefined ? p.minStockAlert : 5;
    return (p.stock || 0) <= threshold;
  });

  const handleQuickAdd = (prod: Product, amount: number) => {
    const updatedStock = (prod.stock || 0) + amount;
    
    if (onRestock) {
      onRestock(prod.id, updatedStock);
    } else {
      setDb((prev: any) => ({
        ...prev,
        products: (prev.products || []).map((p: any) =>
          p.id === prod.id ? { ...p, stock: updatedStock } : p
        )
      }));
    }

    showToast(`📦 Stock de '${prod.name}' repuesto a ${updatedStock} unidades.`, "success");
    setRestockingId(null);
  };

  if (lowStockItems.length === 0) {
    if (isCompact) return null;
    return (
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-emerald-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check size={16} />
          </div>
          <div>
            <p className="text-xs font-black">Inventario en Nivel Óptimo</p>
            <p className="text-[10px] text-emerald-400/80">Todos los productos cuentan con existencias de seguridad suficientes.</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-500/20 px-2.5 py-1 rounded-full">
          0 Críticos
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              Alertas de Stock Crítico
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {lowStockItems.length}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Productos con existencia menor al umbral de seguridad
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Productos Críticos */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {lowStockItems.map((prod: Product) => {
          const threshold = prod.minStockAlert !== undefined ? prod.minStockAlert : 5;
          const isOut = (prod.stock || 0) <= 0;

          return (
            <div
              key={prod.id}
              className={`p-3 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                isOut
                  ? "bg-red-950/30 border-red-500/40 text-red-200"
                  : "bg-amber-950/20 border-amber-500/30 text-amber-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-white/10" />
                ) : (
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                    <Package size={18} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Precio: <span className="font-mono text-amber-300 font-bold">${prod.priceUSD || prod.price || 0} USD</span> • Mínimo sugerido: {threshold} u.
                  </p>
                </div>
              </div>

              {/* Estado de Stock y Acciones */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl border ${
                    isOut
                      ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {isOut ? "AGOTADO (0)" : `${prod.stock} restantes`}
                </span>

                {restockingId === prod.id ? (
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <input
                      type="number"
                      min="1"
                      value={addQty}
                      onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 bg-slate-900 text-white font-mono text-xs font-bold text-center rounded px-1 py-1 border border-slate-600"
                    />
                    <button
                      onClick={() => handleQuickAdd(prod, addQty)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded cursor-pointer border-none"
                    >
                      ✓ Sumar
                    </button>
                    <button
                      onClick={() => setRestockingId(null)}
                      className="px-1.5 py-1 text-slate-400 hover:text-white text-[10px] cursor-pointer border-none bg-transparent"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleQuickAdd(prod, 10)}
                      className="px-2 py-1 bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white text-[10px] font-bold rounded-lg transition-all border border-violet-500/30 cursor-pointer"
                      title="Sumar +10 unidades"
                    >
                      +10 u.
                    </button>
                    <button
                      onClick={() => {
                        setRestockingId(prod.id);
                        setAddQty(10);
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all border border-slate-700 cursor-pointer"
                      title="Personalizar reposición"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
