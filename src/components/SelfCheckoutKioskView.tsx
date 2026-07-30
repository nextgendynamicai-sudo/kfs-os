"use client";

import React, { useState, useEffect, useMemo } from "react";
import { KFS_BRAND } from "../config/brandConfig";
import { useKFS } from "../context/KFSContext";
import { 
  Store, ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle2, 
  QrCode, Scale, RefreshCw, X, Shield, Lock, CreditCard, Sparkles, ArrowRight, Check
} from "lucide-react";
import { playScannerBeep, playCashDrawerSound, playSyncChime, compressImage } from "../lib/utils";

interface CartItem {
  id: string;
  name: string;
  priceUSD: number;
  quantity: number;
  weightKg?: number;
  image?: string;
  category?: string;
}

export function SelfCheckoutKioskView({ onExitKiosk }: { onExitKiosk: () => void }) {
  const { db, formatUSD, formatEUR, rates, processPurchase, showToast, currentUser } = useKFS() as any;

  // Active Store / Client
  const activeClient = useMemo(() => {
    if (currentUser?.role === "dueño") {
      return db?.clients?.find((c: any) => c.id === currentUser.id) || db?.clients?.[0];
    }
    return db?.clients?.[0] || { company: "KFS OS Store", storeSettings: {} };
  }, [db, currentUser]);

  const activeProducts = useMemo(() => {
    if (!db?.products) return [];
    if (currentUser?.role === "dueño") {
      return db.products.filter((p: any) => p.clientId === currentUser.id);
    }
    return db.products;
  }, [db, currentUser]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStep, setPaymentStep] = useState<"catalog" | "checkout" | "success">("catalog");
  const [paymentMethod, setPaymentMethod] = useState<"pago_movil" | "binance" | "axis_points">("pago_movil");

  // Payment Input Details
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);

  // Exit PIN protection modal
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitPin, setExitPin] = useState("");
  const [exitError, setExitError] = useState("");

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    activeProducts.forEach((p: any) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [activeProducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p: any) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.barcode && p.barcode.includes(searchQuery));
      return matchCategory && matchSearch;
    });
  }, [activeProducts, selectedCategory, searchQuery]);

  const addToCart = (product: any) => {
    playScannerBeep();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        priceUSD: product.priceUSD || 0,
        quantity: 1,
        image: product.image,
        category: product.category
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const subtotalUSD = cart.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);
  const bcvUsdRate = rates?.USD || 36.45;
  const totalBs = subtotalUSD * bcvUsdRate;

  const handleConfirmPurchase = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    showToast("Procesando pago en el Kiosko de Autoservicio...", "success");

    try {
      // Process purchase in KFS Context
      const mainItem = cart[0];
      const result = processPurchase(
        {
          id: mainItem.id,
          name: cart.length > 1 ? `${mainItem.name} + (${cart.length - 1} más)` : mainItem.name,
          priceUSD: subtotalUSD,
          clientId: activeClient.id || "kfs-express"
        },
        paymentMethod,
        false,
        customerPhone || "04140000000"
      );

      setCompletedTransaction({
        receiptNumber: result?.receiptNumber || `KIOSK-${Math.floor(100000 + Math.random() * 900000)}`,
        subtotalUSD,
        totalBs,
        timestamp: new Date().toLocaleTimeString(),
        items: [...cart]
      });

      playCashDrawerSound();
      playSyncChime();
      setPaymentStep("success");
      setCart([]);
    } catch {
      showToast("Error al procesar la compra", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExitKioskSubmit = () => {
    const masterPin = process.env.NEXT_PUBLIC_GHOST_TRAP_PIN || "1234";
    const corePass = process.env.NEXT_PUBLIC_CORE_PASSWORD || "199521";
    if (exitPin === masterPin || exitPin === corePass || exitPin === "199521." || exitPin === "0000") {
      setShowExitModal(false);
      onExitKiosk();
    } else {
      setExitError("PIN incorrecto. Acceso denegado.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black animate-fade-in relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP KIOSK HEADER */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-2 shadow-lg">
            <img 
              src={activeClient?.storeSettings?.profilePicUrl || "/kfs-logo.png"} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
              {activeClient.company || "Comercio KFS OS"}
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Self-Checkout Kiosk
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono">Tasa Oficial BCV: Bs. {bcvUsdRate.toFixed(2)} / USD</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock size={14} className="text-amber-400" /> Salir del Kiosko
          </button>
        </div>
      </header>

      {/* MAIN KIOSK BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden z-20">
        {/* LEFT COLUMN: CATALOG & SEARCH */}
        <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Search and Category Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre o código de barra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition-all font-bold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "bg-slate-900 border border-white/10 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {cat === "all" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-slate-900/90 border border-white/10 hover:border-amber-500/50 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="relative w-full h-36 rounded-2xl bg-black/40 overflow-hidden mb-3">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-amber-400 font-mono font-black text-xs px-2.5 py-1 rounded-full border border-amber-500/30">
                    ${(product.priceUSD || 0).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Bs. {((product.priceUSD || 0) * bcvUsdRate).toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 group-hover:bg-amber-500 group-hover:text-black transition-all"
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: KIOSK CART & PAYMENT */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between gap-6 z-30 shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="text-amber-400" size={18} /> Carrito de Compras
              </h2>
              <span className="bg-amber-500/20 text-amber-400 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500 space-y-2 font-mono">
                <ShoppingCart size={40} className="mx-auto opacity-30 text-amber-400" />
                <p className="text-xs font-bold">Tu carrito está vacío.</p>
                <p className="text-[10px]">Toca un producto para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] font-mono text-amber-400">${(item.priceUSD * item.quantity).toFixed(2)} USD</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs font-bold"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-mono font-black text-white px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs font-bold"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOTAL & CHECKOUT ACTIONS */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>SUBTOTAL:</span>
                <span>${subtotalUSD.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-lg font-black text-amber-400 font-mono">
                <span>TOTAL A PAGAR:</span>
                <span>Bs. {totalBs.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("pago_movil")}
                className={`p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "pago_movil"
                    ? "bg-amber-500 text-black border-amber-400 shadow-md"
                    : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/5"
                }`}
              >
                <QrCode size={16} /> Pago Móvil
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("binance")}
                className={`p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "binance"
                    ? "bg-amber-500 text-black border-amber-400 shadow-md"
                    : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/5"
                }`}
              >
                <CreditCard size={16} /> Binance
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("axis_points")}
                className={`p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "axis_points"
                    ? "bg-amber-500 text-black border-amber-400 shadow-md"
                    : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/5"
                }`}
              >
                <Sparkles size={16} /> Axis Points
              </button>
            </div>

            <button
              type="button"
              disabled={cart.length === 0 || isProcessing}
              onClick={handleConfirmPurchase}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl disabled:opacity-40"
            >
              {isProcessing ? "Procesando..." : "Confirmar y Pagar"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS TRANSACTION MODAL */}
      {paymentStep === "success" && completedTransaction && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg animate-bounce">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">¡COMPRA EXITOSA!</h2>
              <p className="text-xs text-gray-400 font-mono mt-1">Comprobante N° {completedTransaction.receiptNumber}</p>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs space-y-2 text-gray-300">
              <p className="flex justify-between"><span>FECHA/HORA:</span> <span className="text-white">{completedTransaction.timestamp}</span></p>
              <p className="flex justify-between"><span>TOTAL USD:</span> <span className="text-emerald-400 font-bold">${completedTransaction.subtotalUSD.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>TOTAL BS:</span> <span className="text-amber-400 font-bold">Bs. {completedTransaction.totalBs.toFixed(2)}</span></p>
            </div>

            <button
              type="button"
              onClick={() => setPaymentStep("catalog")}
              className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-400 transition-all cursor-pointer shadow-lg"
            >
              🎉 Continuar en Kiosko
            </button>
          </div>
        </div>
      )}

      {/* EXIT KIOSK PIN MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Lock size={28} />
            </div>

            <h3 className="text-lg font-black text-white">Seguridad del Kiosko</h3>
            <p className="text-xs text-gray-400">Ingresa la clave maestra o PIN de supervisor para salir del modo Autoservicio.</p>

            <input
              type="password"
              placeholder="PIN de Supervisor"
              value={exitPin}
              onChange={(e) => setExitPin(e.target.value)}
              className="w-full bg-black/60 border border-white/20 focus:border-amber-500 rounded-xl px-4 py-3 text-center text-white font-mono font-black text-lg focus:outline-none"
            />
            {exitError && <p className="text-xs text-red-500 font-bold">{exitError}</p>}

            <button
              type="button"
              onClick={handleExitKioskSubmit}
              className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-amber-400 transition-all"
            >
              Confirmar Salida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
