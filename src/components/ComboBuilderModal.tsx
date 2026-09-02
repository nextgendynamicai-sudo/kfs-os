"use client";

import React, { useState, useMemo } from "react";
import { Gift, Plus, Trash2, Package, Sparkles, X, Check, DollarSign } from "lucide-react";
import { Product, BundleItem } from "../types/core";
import { useKFS } from "../context/KFSContext";
import { syncSingleProduct } from "../lib/supabaseSync";

interface ComboBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

export const ComboBuilderModal: React.FC<ComboBuilderModalProps> = ({
  isOpen,
  onClose,
  clientId
}) => {
  const { db, setDb, showToast, activeTenant } = useKFS() as any;

  const targetClientId = clientId || activeTenant?.id || "kfs-express";

  // Productos disponibles del tenant para armar el combo
  const availableProducts: Product[] = useMemo(() => {
    return (db.products || []).filter((p: any) =>
      (p.clientId === targetClientId || p.sellerId === targetClientId) && !p.isBundle
    );
  }, [db.products, targetClientId]);

  // Combos ya existentes
  const existingCombos: Product[] = useMemo(() => {
    return (db.products || []).filter((p: any) =>
      (p.clientId === targetClientId || p.sellerId === targetClientId) && p.isBundle
    );
  }, [db.products, targetClientId]);

  const [comboName, setComboName] = useState("");
  const [comboPriceUSD, setComboPriceUSD] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboImage, setComboImage] = useState("");
  const [selectedItems, setSelectedItems] = useState<BundleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemQty, setItemQty] = useState(1);

  // Cálculo de precio original de los componentes sumados
  const componentsRegularSum = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      const prod = availableProducts.find(p => p.id === item.productId);
      const price = prod?.priceUSD || prod?.price || 0;
      return acc + (price * item.qty);
    }, 0);
  }, [selectedItems, availableProducts]);

  // Ahorro que recibe el cliente
  const discountSavings = useMemo(() => {
    const promo = parseFloat(comboPriceUSD) || 0;
    if (promo > 0 && componentsRegularSum > promo) {
      return componentsRegularSum - promo;
    }
    return 0;
  }, [componentsRegularSum, comboPriceUSD]);

  const handleAddItemToCombo = () => {
    if (!selectedProductId) return;
    const prod = availableProducts.find(p => p.id === selectedProductId);
    if (!prod) return;

    const existingIndex = selectedItems.findIndex(i => i.productId === selectedProductId);
    if (existingIndex >= 0) {
      const updated = [...selectedItems];
      updated[existingIndex].qty += itemQty;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: prod.id,
          qty: itemQty,
          name: prod.name,
          priceUSD: prod.priceUSD || prod.price || 0
        }
      ]);
    }

    setSelectedProductId("");
    setItemQty(1);
  };

  const handleRemoveItemFromCombo = (prodId: string) => {
    setSelectedItems(selectedItems.filter(i => i.productId !== prodId));
  };

  const handleSaveCombo = () => {
    if (!comboName.trim()) {
      showToast("Por favor ingresa el nombre del combo.", "error");
      return;
    }
    const priceNum = parseFloat(comboPriceUSD);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Por favor ingresa un precio válido en USD.", "error");
      return;
    }
    if (selectedItems.length === 0) {
      showToast("Por favor añade al menos 1 producto al combo.", "error");
      return;
    }

    const newComboProduct: Product = {
      id: "bundle_" + Date.now(),
      sellerId: targetClientId,
      clientId: targetClientId,
      tenantId: targetClientId,
      name: comboName.trim(),
      price: priceNum,
      priceUSD: priceNum,
      costUSD: componentsRegularSum * 0.7, // Estimado de costo
      stock: 999, // El stock se calcula en base a sus componentes
      category: "Combos & Promociones",
      description: comboDescription.trim() || `Incluye: ${selectedItems.map(i => `${i.qty}x ${i.name}`).join(", ")}`,
      image: comboImage.trim() || "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=60",
      createdAt: new Date().toISOString(),
      isBundle: true,
      bundleItems: selectedItems
    };

    setDb((prev: any) => ({
      ...prev,
      products: [newComboProduct, ...(prev.products || [])]
    }));

    syncSingleProduct(newComboProduct);

    showToast(`🎁 ¡Combo '${comboName}' creado y publicado en la tienda!`, "success");
    // Reset
    setComboName("");
    setComboPriceUSD("");
    setComboDescription("");
    setComboImage("");
    setSelectedItems([]);
    onClose();
  };

  const handleDeleteCombo = (comboId: string) => {
    if (confirm("¿Eliminar este paquete promocional?")) {
      setDb((prev: any) => ({
        ...prev,
        products: (prev.products || []).filter((p: any) => p.id !== comboId)
      }));
      showToast("Combo eliminado.", "success");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-violet-500/40 rounded-[2.5rem] w-full max-w-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-xl shadow-lg">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Creador de Combos & Paquetes <Sparkles size={16} className="text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Agrupa productos con descuento. El stock se descuenta en cascada automáticamente.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda: Formulario */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              1. Datos del Nuevo Combo
            </h4>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Nombre del Combo
              </label>
              <input
                type="text"
                value={comboName}
                onChange={e => setComboName(e.target.value)}
                placeholder="Ej: Mega Combo Familiar Burger + Refresco"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                  Precio Promo ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={comboPriceUSD}
                  onChange={e => setComboPriceUSD(e.target.value)}
                  placeholder="Ej: 9.99"
                  className="w-full bg-slate-800 border border-violet-500/40 rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-amber-400 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                  URL de Imagen (Opcional)
                </label>
                <input
                  type="url"
                  value={comboImage}
                  onChange={e => setComboImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Descripción / Beneficios
              </label>
              <textarea
                value={comboDescription}
                onChange={e => setComboDescription(e.target.value)}
                placeholder="Explica qué incluye y cuánto ahorra el cliente..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* Selector de Productos Componentes */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-violet-400">
                2. Agregar Productos al Combo
              </h4>

              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">-- Seleccionar producto individual --</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.priceUSD || p.price || 0} USD) • Stock: {p.stock}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={e => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs font-bold text-center text-white"
                  title="Cantidad"
                />

                <button
                  onClick={handleAddItemToCombo}
                  disabled={!selectedProductId}
                  className="px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border-none flex items-center gap-1"
                >
                  <Plus size={14} /> Añadir
                </button>
              </div>

              {/* Lista de Componentes Añadidos */}
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{item.qty}x</span> {item.name}
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">
                        (${(item.priceUSD || 0) * item.qty} USD)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItemFromCombo(item.productId)}
                      className="text-red-400 hover:text-red-300 p-1 border-none bg-transparent cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {selectedItems.length === 0 && (
                  <p className="text-[11px] text-slate-500 italic text-center py-3">
                    Añade al menos 1 producto usando el selector superior.
                  </p>
                )}
              </div>
            </div>

            {/* Resumen Financiero del Combo */}
            {selectedItems.length > 0 && (
              <div className="bg-gradient-to-r from-violet-950/40 to-slate-900 border border-violet-500/30 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Suma Regular por separado:</span>
                  <span className="font-mono font-bold line-through text-slate-400">
                    ${componentsRegularSum.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400 font-bold">Precio Especial Combo:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    ${(parseFloat(comboPriceUSD) || 0).toFixed(2)} USD
                  </span>
                </div>
                {discountSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold text-[11px] pt-1 border-t border-white/5">
                    <span>🎉 Ahorro para el cliente:</span>
                    <span>-${discountSavings.toFixed(2)} USD ({Math.round((discountSavings / componentsRegularSum) * 100)}% OFF)</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSaveCombo}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all border-none cursor-pointer"
            >
              ✓ Guardar y Publicar Combo
            </button>
          </div>

          {/* Columna Derecha: Combos Existentes */}
          <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
              Combos Activos en Tienda
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                {existingCombos.length}
              </span>
            </h4>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {existingCombos.map(combo => (
                <div
                  key={combo.id}
                  className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 space-y-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                        🎁 COMBO PACK
                      </span>
                      <h5 className="font-bold text-sm text-white mt-1">{combo.name}</h5>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        ${combo.priceUSD || combo.price} USD
                      </span>
                      <button
                        onClick={() => handleDeleteCombo(combo.id)}
                        className="block text-red-400 hover:text-red-300 text-[10px] mt-1 ml-auto border-none bg-transparent cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {combo.bundleItems && combo.bundleItems.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-2 text-[10px] text-slate-300 space-y-0.5">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">
                        Artículos incluidos:
                      </span>
                      {combo.bundleItems.map((bi, i) => (
                        <div key={i} className="flex justify-between">
                          <span>• {bi.qty}x {bi.name || bi.productId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {existingCombos.length === 0 && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-8 text-center space-y-2 text-slate-400">
                  <Gift size={32} className="mx-auto text-slate-600" />
                  <p className="text-xs font-bold">No hay combos creados aún</p>
                  <p className="text-[10px] text-slate-500">
                    Crea tu primer paquete promocional en el formulario de la izquierda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
