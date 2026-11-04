"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useKFS } from "../context/KFSContext";
import { usePreset } from "../context/PresetContext";
import { 
  ShoppingCart, Search, Barcode, Camera, Calculator, KeyRound, ArrowLeft, 
  Trash2, Plus, Minus, CheckCircle2, DollarSign, Sparkles, Sliders, 
  ChevronDown, ChevronUp, ShieldAlert, Coins, RefreshCw, X, Receipt, 
  Layers, Package, Check, Phone, UserCheck, Flame, Scale, Calendar, TableProperties, Binary
} from "lucide-react";
import { SmartChangeCalculator } from "./SmartChangeCalculator";
import { QuickCashierPinModal } from "./QuickCashierPinModal";
import { BlindCashCountModal } from "./BlindCashCountModal";
import { ReceiptModal } from "./ReceiptModal";
import { ZeroHardwareBarcodeScanner } from "./pos/ZeroHardwareBarcodeScanner";
import { 
  playCashDrawerSound, 
  announcePaymentVoice, 
  playScannerBeep, 
  playSyncChime 
} from "../lib/utils";
import { DEMO_COMMERCE_ID, DEMO_COMMERCE_PRODUCTS } from "../config/demoCommerceDB";

export interface CartItem {
  product: any;
  qty: number;
}

export interface AxisNitroPOSProps {
  setView?: (view: string) => void;
  initialMerchantId?: string;
  presetMetadata?: any;
}

export function AxisNitroPOS({ setView: setViewProp, initialMerchantId }: AxisNitroPOSProps = {}) {
  const { 
    db, 
    formatUSD, 
    rates, 
    showToast, 
    processPurchase, 
    setView: contextSetView, 
    currentUser, 
    processBlindCashCount 
  } = useKFS() as any;

  const setView = setViewProp || contextSetView;

  const { businessPreset, presetMetadata } = usePreset();

  // Active cashier
  const [activeCashier, setActiveCashier] = useState<any>(() => {
    if (currentUser?.role === "vendedor") return currentUser;
    const demoCashier = (db?.vendedores || []).find((v: any) => v.clientId === DEMO_COMMERCE_ID);
    return demoCashier || (currentUser ? { ...currentUser, name: currentUser.name || "Cajero Principal" } : { name: "Cajero Mostrador" });
  });

  // Modals
  const [showChangeCalculator, setShowChangeCalculator] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showBlindCountModal, setShowBlindCountModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showMobileCartDrawer, setShowMobileCartDrawer] = useState(false);
  const [showFeatureDrawer, setShowFeatureDrawer] = useState(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<any | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Multi-Item Cart
  const getProductKey = (p: any): string => {
    if (!p) return "";
    return String(p.id || p.barcode || p.name || "");
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const cartMap = useMemo(() => {
    const map = new Map<string, CartItem>();
    cart.forEach(i => {
      const key = getProductKey(i.product);
      if (key) map.set(key, i);
    });
    return map;
  }, [cart]);

  // Checkout Options
  const [paymentMethod, setPaymentMethod] = useState("cash_usd");
  const [applyIva, setApplyIva] = useState(false);
  const [quickCashUSD, setQuickCashUSD] = useState<number | null>(null);
  const [axisPointsToBurn, setAxisPointsToBurn] = useState(0);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  // Feature Flags
  const [demoFeatures, setDemoFeatures] = useState({
    escandallos: presetMetadata?.features?.escandallos || false,
    serial_tracking: presetMetadata?.features?.serial_tracking || false,
    room_management: presetMetadata?.features?.room_management || false,
    weight_scale: presetMetadata?.features?.weight_scale || false,
    booking_system: presetMetadata?.features?.booking_system || false,
  });

  // Effective merchant identifier
  const activeMerchantId = useMemo(() => {
    if (
      currentUser?.id === DEMO_COMMERCE_ID ||
      currentUser?.clientId === DEMO_COMMERCE_ID ||
      currentUser?.merchantId === DEMO_COMMERCE_ID ||
      currentUser?.isDemoUser
    ) {
      return DEMO_COMMERCE_ID;
    }
    return currentUser?.merchantId || currentUser?.clientId || currentUser?.id || DEMO_COMMERCE_ID;
  }, [currentUser]);

  // Merchant info
  const merchantInfo = useMemo(() => {
    return (db?.clients || []).find((c: any) => c.id === activeMerchantId) || {
      company: "Bodegón & Market Gourmet Caracas",
      paymentMethods: {
        pagoMovil: { bank: "Banesco (0134)", phone: "0412-5551234", idCard: "J-408192841" }
      }
    };
  }, [db?.clients, activeMerchantId]);

  // Catalog products (with guaranteed unique IDs to prevent badge bleed)
  const storeProducts = useMemo(() => {
    const rawList = (db?.products || []).filter((p: any) => p.clientId === activeMerchantId);
    const sourceList = rawList.length > 0 ? rawList : DEMO_COMMERCE_PRODUCTS;

    const seenIds = new Set<string>();
    return sourceList.map((p: any, idx: number) => {
      let uniqueId = p.id;
      if (!uniqueId || seenIds.has(uniqueId)) {
        uniqueId = p.barcode ? `prod_${p.barcode}` : `prod_${idx}_${p.name ? p.name.replace(/\s+/g, '_') : 'sku'}`;
      }
      seenIds.add(uniqueId);
      return uniqueId !== p.id ? { ...p, id: uniqueId } : p;
    });
  }, [db?.products, activeMerchantId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("Todos");
    storeProducts.forEach((p: any) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [storeProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p: any) => {
      const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        p.name?.toLowerCase().includes(q) || 
        (p.barcode && p.barcode.includes(q)) || 
        (p.brand && p.brand.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [storeProducts, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (product: any) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast(`Producto sin stock: ${product.name}`, "error");
      return;
    }

    if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
      try { (window.navigator as any).vibrate(15); } catch (_) {}
    }
    playScannerBeep();

    const targetKey = getProductKey(product);
    setCart(prev => {
      const idx = prev.findIndex(item => getProductKey(item.product) === targetKey);
      if (idx !== -1) {
        const updated = [...prev];
        const newQty = updated[idx].qty + 1;
        if (product.stock !== undefined && newQty > product.stock) {
          showToast(`Stock máximo disponible alcanzado (${product.stock} u.)`, "warning");
          return prev;
        }
        updated[idx] = { ...updated[idx], qty: newQty };
        return updated;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (getProductKey(item.product) === productId || item.product.id === productId) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null;
          if (item.product.stock !== undefined && newQty > item.product.stock) {
            showToast(`Máximo disponible: ${item.product.stock} u.`, "warning");
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => getProductKey(item.product) !== productId && item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setQuickCashUSD(null);
    setPaymentReference("");
    setCustomerPhone("");
    setCustomerName("");
  };

  // Hardware Scanner Listener (USB/Bluetooth Barcode Guns)
  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();
    let timeoutId: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 60) {
        barcodeBuffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter" && barcodeBuffer.length > 3) {
        e.preventDefault();
        const code = barcodeBuffer.trim();
        barcodeBuffer = "";

        const found = storeProducts.find((p: any) => p.barcode === code);
        if (found) {
          addToCart(found);
          showToast(`Escaneado: ${found.name}`, "success");
        } else {
          showToast(`Código no encontrado: ${code}`, "warning");
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { barcodeBuffer = ""; }, 120);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [storeProducts]);

  // Financial Calculations
  const bcvRate = rates?.USD || 36.45;
  const cartSubtotalUSD = useMemo(() => {
    return cart.reduce((acc, item) => acc + ((item.product.priceUSD || 0) * item.qty), 0);
  }, [cart]);

  const ivaUSD = applyIva ? cartSubtotalUSD * 0.16 : 0;
  const isForeign = ['cash_usd', 'cash_eur', 'zinli', 'binance', 'zelle'].includes(paymentMethod);
  const igtfUSD = isForeign && applyIva ? (cartSubtotalUSD + ivaUSD) * 0.03 : 0;

  const orderGrossUSD = cartSubtotalUSD + ivaUSD + igtfUSD;
  const maxPointsAllowed = Math.floor((orderGrossUSD * 0.5) / 0.001);
  const effectivePointsToBurn = Math.min(axisPointsToBurn, maxPointsAllowed);
  const pointsDiscountUSD = effectivePointsToBurn * 0.001;

  const totalDueUSD = Math.max(0, orderGrossUSD - pointsDiscountUSD);
  const totalDueBs = totalDueUSD * bcvRate;
  const totalItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Paste reference helper
  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const match = text.match(/\b\d{4,12}\b/);
          const refToSet = match ? match[0] : text.trim().slice(0, 20);
          setPaymentReference(refToSet);
          showToast(`Referencia pegada: ${refToSet}`, "success");
        }
      }
    } catch (_) {
      showToast("Pega la referencia manualmente en el campo.", "info");
    }
  };

  // Charge submission
  const handleConfirmSale = () => {
    if (cart.length === 0) {
      showToast("Agrega al menos un producto al carrito para cobrar.", "warning");
      return;
    }

    if (paymentMethod === "vale_credit") {
      if (!customerPhone) {
        showToast("Ingresa el teléfono o nombre del cliente para registrar el vale/fiado.", "warning");
        return;
      }
    }

    // 1. Audio and voice feedback
    playCashDrawerSound();
    playSyncChime();
    announcePaymentVoice(totalDueUSD, paymentMethod === "cash_bs" ? "pago_movil" : "cash_usd");

    // 2. Build multi-item cart payload
    const cartPayload = {
      id: `pos_cart_${Date.now()}`,
      name: cart.length === 1 ? cart[0].product.name : `Venta Mostrador (${totalItemCount} items)`,
      priceUSD: cartSubtotalUSD,
      clientId: activeMerchantId,
      cartItems: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        priceUSD: item.product.priceUSD || 0,
        quantity: item.qty
      }))
    };

    // 3. Process purchase in central ledger
    let tx: any = null;
    try {
      tx = processPurchase(
        cartPayload,
        paymentMethod,
        applyIva,
        customerPhone,
        customerName || (activeCashier ? `Cliente de ${activeCashier.name.split(" ")[0]}` : "Cliente Mostrador"),
        "", // customerRif
        effectivePointsToBurn
      );
    } catch (err: any) {
      console.error("[POS Sale Error]", err);
    }

    // Fallback transaction object if needed
    if (!tx) {
      tx = {
        id: `pos_tx_${Date.now()}`,
        receiptNumber: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: Date.now(),
        clientName: merchantInfo?.company || currentUser?.company || "Bodegón & Market Gourmet Caracas",
        productName: cartPayload.name,
        amountUSD: totalDueUSD,
        subtotalUSD: cartSubtotalUSD,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        exchangeRateBCV: bcvRate,
        date: new Date().toISOString(),
        status: "APPROVED",
        cashierName: activeCashier ? activeCashier.name : "Cajero Mostrador",
        cartItems: cartPayload.cartItems
      };
    } else {
      tx = {
        ...tx,
        clientName: merchantInfo?.company || currentUser?.company || "Bodegón & Market Gourmet Caracas",
        cartItems: cartPayload.cartItems,
        cashierName: activeCashier ? activeCashier.name : "Cajero Mostrador"
      };
    }

    // 4. Reset cart & open thermal ticket modal
    clearCart();
    setShowMobileCartDrawer(false);
    setActiveReceiptTx(tx);
    showToast(`¡Venta procesada con éxito! Recibo #${tx.receiptNumber || 'POS'}`, "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-28 md:pb-12 animate-fade-in relative selection:bg-violet-500 selection:text-white w-full max-w-[100vw] overflow-x-clip">
      
      {/* ========================================================= */}
      {/* TOP HEADER: CASHIER & SYSTEM TELEMETRY                     */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 w-full max-w-[100vw] overflow-x-clip box-border bg-slate-950/95 backdrop-blur-xl border-b border-violet-900/40 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
          
          {/* Back button & Brand */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.location.pathname === "/pos") {
                  window.location.href = "/comercio";
                } else if (setView) {
                  setView("client");
                } else if (typeof window !== "undefined") {
                  window.location.hash = "#client";
                }
              }}
              className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-violet-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
              title="Volver al panel principal"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Volver</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <h1 className="text-xs sm:text-base font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent truncate">
                  Axis Nitro POS
                </h1>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/30 hidden md:inline-block shrink-0">
                  100% Offline
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-xs">
                {merchantInfo?.company || "Bodegón & Market Gourmet Caracas"}
              </p>
            </div>
          </div>

          {/* Quick Actions: BCV Badge, Cashier Switcher, Z-Report */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* BCV Live Badge - visible across all mobile & desktop viewports */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 border border-amber-500/40 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono text-amber-300 shrink-0">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-400/80">BCV:</span>
              <span className="font-black">Bs. {bcvRate.toFixed(2)}</span>
            </div>

            {/* Zero-Hardware Camera Scanner Button */}
            <button
              type="button"
              onClick={() => setShowBarcodeScanner(true)}
              aria-label="Escanear con cámara"
              className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
              title="Abrir lector óptico con cámara"
            >
              <Camera size={15} className="text-amber-400" />
              <span className="hidden md:inline">Escanear</span>
            </button>

            {/* Cashier PIN Switcher */}
            <button
              type="button"
              data-testid="pos-pin-btn"
              onClick={() => setShowPinModal(true)}
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-violet-500/30 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1 sm:gap-1.5 shrink-0"
              title="Cambiar cajero con PIN de 4 dígitos"
            >
              <KeyRound size={14} className="text-violet-400" />
              <div className="text-left text-[11px]">
                <span className="text-slate-200 font-bold max-w-[65px] sm:max-w-[110px] truncate block">
                  {activeCashier ? activeCashier.name.split(" ")[0] : "Cajero"}
                </span>
              </div>
            </button>

            {/* Cierre Z / Arqueo */}
            <button
              type="button"
              onClick={() => setShowBlindCountModal(true)}
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0"
              title="Realizar Cierre de Caja (Z) y Arqueo Ciego"
            >
              <ShieldAlert size={14} />
              <span className="hidden lg:inline text-[11px]">Cierre Z</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN LAYOUT: CATALOG (LEFT) + CART & PAYMENTS (RIGHT)      */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================= */}
        {/* LEFT COLUMN: CATALOG SEARCH & PRODUCT GRID              */}
        {/* ======================================================= */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Search Bar + Barcode Input */}
          <div className="bg-slate-900/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-violet-900/30 shadow-md space-y-3">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-violet-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca o código de barras (Enter para agregar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredProducts.length > 0) {
                    e.preventDefault();
                    addToCart(filteredProducts[0]);
                    setSearchQuery("");
                  }
                }}
                className="w-full bg-black/60 border border-violet-800/40 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30 scale-[1.02]"
                      : "bg-slate-950/70 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
            {filteredProducts.map((p: any) => {
              const inCartItem = cartMap.get(getProductKey(p));
              const priceBs = (p.priceUSD || 0) * bcvRate;
              const hasStock = p.stock === undefined || p.stock > 0;

              return (
                <div
                  key={getProductKey(p)}
                  data-testid={`pos-product-${p.id}`}
                  onClick={() => hasStock && addToCart(p)}
                  className={`relative p-3 rounded-2xl border transition-all flex flex-col justify-between group active:scale-95 ${
                    hasStock
                      ? "bg-slate-900/70 hover:bg-slate-900 border-violet-950 hover:border-violet-600/50 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-violet-950/50"
                      : "bg-slate-950/50 border-slate-900 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Cart count badge */}
                  {inCartItem && (
                    <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md animate-scale-in z-10">
                      {inCartItem.qty}
                    </span>
                  )}

                  {/* Image or Icon */}
                  <div className="w-full h-24 sm:h-28 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center relative mb-2 border border-white/5">
                    {p.imgUrl || p.image ? (
                      <img 
                        src={p.imgUrl || p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package size={32} className="text-violet-500/40" />
                    )}
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/75 text-slate-400">
                      {p.category || "General"}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    {p.barcode && (
                      <span className="text-[9px] font-mono text-slate-500 block truncate mt-0.5">
                        {p.barcode}
                      </span>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-end justify-between">
                    <div>
                      <span className="text-sm sm:text-base font-black text-emerald-400 block font-mono">
                        {formatUSD(p.priceUSD || 0)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                        Bs. {priceBs.toFixed(2)}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      hasStock 
                        ? (p.stock && p.stock < 5 ? "bg-amber-950/50 text-amber-400" : "bg-emerald-950/40 text-emerald-400")
                        : "bg-red-950/50 text-red-400"
                    }`}>
                      {hasStock ? `${p.stock ?? '∞'} u.` : "Agotado"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-slate-900/40 border border-dashed border-violet-900/30 rounded-2xl p-10 text-center space-y-2">
              <Search size={32} className="mx-auto text-violet-500/40" />
              <p className="text-sm font-bold text-slate-400">No se encontraron productos con ese término.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 text-xs font-bold transition-all"
              >
                Limpiar Filtros
              </button>
            </div>
          )}

          {/* Collapsible Feature Flags Drawer */}
          <div className="bg-slate-900/40 border border-violet-900/25 rounded-2xl p-3.5 space-y-2.5">
            <button
              type="button"
              onClick={() => setShowFeatureDrawer(!showFeatureDrawer)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders size={14} className="text-violet-400" />
                <span>Módulos de Negocio Activos (Preset: {businessPreset})</span>
              </div>
              {showFeatureDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showFeatureDrawer && (
              <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-fade-in">
                {Object.keys(demoFeatures).map((key) => {
                  const name = key as keyof typeof demoFeatures;
                  const isEnabled = demoFeatures[name];
                  return (
                    <div 
                      key={name}
                      onClick={() => setDemoFeatures(prev => ({ ...prev, [name]: !prev[name] }))}
                      className="p-2 rounded-xl bg-black/40 border border-violet-950 flex items-center justify-between cursor-pointer hover:border-violet-700/50"
                    >
                      <span className="text-[11px] font-bold text-slate-300 capitalize">{name.replace("_", " ")}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                        {isEnabled ? "ACTIVO" : "OFF"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </section>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: MULTI-ITEM CART & SPEED CHECKOUT          */}
        {/* (Visible as side panel on desktop, bottom sheet on mobile)*/}
        {/* ======================================================= */}
        <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
          <CartPanel 
            cart={cart}
            totalItemCount={totalItemCount}
            cartSubtotalUSD={cartSubtotalUSD}
            applyIva={applyIva}
            setApplyIva={setApplyIva}
            ivaUSD={ivaUSD}
            igtfUSD={igtfUSD}
            effectivePointsToBurn={effectivePointsToBurn}
            maxPointsAllowed={maxPointsAllowed}
            setAxisPointsToBurn={setAxisPointsToBurn}
            pointsDiscountUSD={pointsDiscountUSD}
            totalDueUSD={totalDueUSD}
            totalDueBs={totalDueBs}
            bcvRate={bcvRate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            quickCashUSD={quickCashUSD}
            setQuickCashUSD={setQuickCashUSD}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerName={customerName}
            setCustomerName={setCustomerName}
            paymentReference={paymentReference}
            setPaymentReference={setPaymentReference}
            handlePasteClipboard={handlePasteClipboard}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            handleConfirmSale={handleConfirmSale}
            setShowChangeCalculator={setShowChangeCalculator}
            formatUSD={formatUSD}
            merchantInfo={merchantInfo}
          />
        </aside>

      </main>

      {/* ========================================================= */}
      {/* MOBILE STICKY FLOATING CART BAR (Samsung S25 Ultra Optimized) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30 pointer-events-auto safe-pb pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-violet-500/40 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3">
          <div 
            onClick={() => setShowMobileCartDrawer(true)}
            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
          >
            <div className="relative p-2.5 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/40 shrink-0">
              <ShoppingCart size={18} />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white font-mono">{formatUSD(totalDueUSD)}</span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">(Bs. {totalDueBs.toFixed(2)})</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {cart.length === 0 ? "Carrito vacío (toca para ver)" : `${totalItemCount} items • Toca para cobrar`}
              </span>
            </div>
          </div>

          <button
            type="button"
            data-testid="mobile-open-cart-btn"
            disabled={cart.length === 0}
            onClick={() => {
              if (cart.length > 0) setShowMobileCartDrawer(true);
            }}
            className="px-4 py-2.5 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer border border-emerald-300 shrink-0"
          >
            Cobrar Caja
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FULL DRAWER MODAL FOR CART (Samsung S25 Ultra)      */}
      {/* ========================================================= */}
      {showMobileCartDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-violet-500/40 rounded-t-[2rem] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl safe-pb pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-violet-400" />
                <h3 className="text-base font-black text-white">Carrito & Cobro ({totalItemCount} items)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileCartDrawer(false)}
                className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="overflow-y-auto p-4 flex-1">
              <CartPanel 
                cart={cart}
                totalItemCount={totalItemCount}
                cartSubtotalUSD={cartSubtotalUSD}
                applyIva={applyIva}
                setApplyIva={setApplyIva}
                ivaUSD={ivaUSD}
                igtfUSD={igtfUSD}
                effectivePointsToBurn={effectivePointsToBurn}
                maxPointsAllowed={maxPointsAllowed}
                setAxisPointsToBurn={setAxisPointsToBurn}
                pointsDiscountUSD={pointsDiscountUSD}
                totalDueUSD={totalDueUSD}
                totalDueBs={totalDueBs}
                bcvRate={bcvRate}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                quickCashUSD={quickCashUSD}
                setQuickCashUSD={setQuickCashUSD}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerName={customerName}
                setCustomerName={setCustomerName}
                paymentReference={paymentReference}
                setPaymentReference={setPaymentReference}
                handlePasteClipboard={handlePasteClipboard}
                updateCartQty={updateCartQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                handleConfirmSale={handleConfirmSale}
                setShowChangeCalculator={setShowChangeCalculator}
                formatUSD={formatUSD}
                merchantInfo={merchantInfo}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: RECEIPT, PIN, BLIND COUNT, SCANNER, CALCULATOR    */}
      {/* ========================================================= */}
      
      {/* Receipt Thermal & WhatsApp Modal */}
      {activeReceiptTx && (
        <ReceiptModal
          tx={activeReceiptTx}
          product={{ name: activeReceiptTx.productName, clientName: activeReceiptTx.clientName }}
          onClose={() => setActiveReceiptTx(null)}
          formatUSD={formatUSD}
          showToast={showToast}
          currentUser={activeCashier || currentUser}
        />
      )}

      {/* Cashier PIN Switcher Modal */}
      {showPinModal && (
        <QuickCashierPinModal
          vendedores={db?.vendedores || []}
          currentUser={activeCashier}
          onSelectCashier={(vendedor) => {
            setActiveCashier(vendedor);
            setShowPinModal(false);
            showToast(`Cajero activo: ${vendedor.name}`, "success");
          }}
          onClose={() => setShowPinModal(false)}
          showToast={showToast}
        />
      )}

      {/* Blind Cash Count & Z-Report Modal */}
      {showBlindCountModal && (
        <BlindCashCountModal
          isOpen={showBlindCountModal}
          onClose={() => setShowBlindCountModal(false)}
          onConfirm={(auditData) => {
            if (processBlindCashCount) {
              processBlindCashCount({
                vendedorId: activeCashier?.id || currentUser?.id,
                clientId: activeMerchantId,
                terminalName: "POS Terminal Mostrador",
                ...auditData
              });
            }
            setShowBlindCountModal(false);
            playCashDrawerSound();
            showToast("Cierre de caja (Z) registrado con éxito.", "success");
          }}
          bcvRate={bcvRate}
          terminalName="POS Terminal Mostrador"
          cashierName={activeCashier?.name || "Cajero Mostrador"}
        />
      )}

      {/* Zero Hardware Optical Barcode Scanner (Camera) */}
      {showBarcodeScanner && (
        <ZeroHardwareBarcodeScanner
          products={storeProducts}
          onScan={(scannedCodeOrName) => {
            const found = storeProducts.find(
              (p: any) => p.name === scannedCodeOrName || p.barcode === scannedCodeOrName || p.id === scannedCodeOrName
            );
            if (found) {
              addToCart(found);
              showToast(`Escaneado: ${found.name}`, "success");
            } else {
              showToast(`Código no coincide con inventario: ${scannedCodeOrName}`, "warning");
            }
            setShowBarcodeScanner(false);
          }}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Smart Change Calculator Modal */}
      {showChangeCalculator && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <SmartChangeCalculator
            totalDueUSD={totalDueUSD}
            bcvRate={bcvRate}
            onClose={() => setShowChangeCalculator(false)}
            onApplyChange={(chUSD, chVES) => {
              showToast(`Vuelto registrado: $${chUSD.toFixed(2)} USD (Bs. ${chVES.toFixed(2)})`, "success");
              setShowChangeCalculator(false);
            }}
          />
        </div>
      )}

    </div>
  );
}

// ===============================================================
// REUSABLE CART & CHECKOUT PANEL COMPONENT (Used in desktop & mobile)
// ===============================================================
interface CartPanelProps {
  cart: CartItem[];
  totalItemCount: number;
  cartSubtotalUSD: number;
  applyIva: boolean;
  setApplyIva: (val: boolean) => void;
  ivaUSD: number;
  igtfUSD: number;
  effectivePointsToBurn: number;
  maxPointsAllowed: number;
  setAxisPointsToBurn: (val: number) => void;
  pointsDiscountUSD: number;
  totalDueUSD: number;
  totalDueBs: number;
  bcvRate: number;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  quickCashUSD: number | null;
  setQuickCashUSD: (val: number | null) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  paymentReference: string;
  setPaymentReference: (val: string) => void;
  handlePasteClipboard: () => void;
  updateCartQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  handleConfirmSale: () => void;
  setShowChangeCalculator: (val: boolean) => void;
  formatUSD: (val: number) => string;
  merchantInfo: any;
}

function CartPanel({
  cart,
  totalItemCount,
  cartSubtotalUSD,
  applyIva,
  setApplyIva,
  ivaUSD,
  igtfUSD,
  effectivePointsToBurn,
  maxPointsAllowed,
  setAxisPointsToBurn,
  pointsDiscountUSD,
  totalDueUSD,
  totalDueBs,
  bcvRate,
  paymentMethod,
  setPaymentMethod,
  quickCashUSD,
  setQuickCashUSD,
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
  paymentReference,
  setPaymentReference,
  handlePasteClipboard,
  updateCartQty,
  removeFromCart,
  clearCart,
  handleConfirmSale,
  setShowChangeCalculator,
  formatUSD,
  merchantInfo
}: CartPanelProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-violet-900/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* Header Carrito */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-violet-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Ticket de Venta
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-mono">
            {totalItemCount} u.
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Vaciar todos los productos del carrito"
          >
            <Trash2 size={12} />
            <span>Vaciar</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
        {cart.map((item) => {
          const itemTotal = (item.product.priceUSD || 0) * item.qty;
          return (
            <div 
              key={item.product.id}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>{formatUSD(item.product.priceUSD || 0)} c/u</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{formatUSD(itemTotal)}</span>
                </div>
              </div>

              {/* Quantity Controls (Minimum 44x44px Touch Targets) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQty(item.product.id, -1)}
                  className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black active:scale-90 cursor-pointer"
                  title="Restar unidad"
                >
                  <Minus size={15} />
                </button>
                <span className="min-w-[24px] text-center text-xs font-black font-mono text-white px-0.5">
                  {item.qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQty(item.product.id, 1)}
                  className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center font-black active:scale-90 cursor-pointer"
                  title="Sumar unidad"
                >
                  <Plus size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 active:scale-90 cursor-pointer ml-0.5"
                  title="Eliminar producto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {cart.length === 0 && (
          <div className="p-8 text-center text-slate-500 space-y-1">
            <ShoppingCart size={28} className="mx-auto text-slate-600 opacity-50" />
            <p className="text-xs font-bold">Carrito vacío</p>
            <p className="text-[10px] text-slate-600">Toca productos o escanea código de barras</p>
          </div>
        )}
      </div>

      {/* Financial Summary & Tax Controls */}
      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs font-medium">
        <div className="flex justify-between text-slate-400 text-xs">
          <span>Subtotal</span>
          <span className="font-mono text-white font-bold">{formatUSD(cartSubtotalUSD)}</span>
        </div>

        {/* SENIAT Fiscal Checkbox */}
        <label className="flex items-center justify-between text-[11px] cursor-pointer py-1 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <input 
              type="checkbox" 
              checked={applyIva} 
              onChange={(e) => setApplyIva(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-violet-600 cursor-pointer"
            />
            <span>Factura Fiscal (IVA 16%)</span>
          </div>
          {applyIva && <span className="font-mono text-amber-400">+{formatUSD(ivaUSD)}</span>}
        </label>

        {igtfUSD > 0 && (
          <div className="flex justify-between text-[11px] text-red-400 font-mono">
            <span>IGTF Divisas (3%)</span>
            <span>+{formatUSD(igtfUSD)}</span>
          </div>
        )}

        {/* Axis Points Redemption */}
        {maxPointsAllowed > 0 && (
          <div className="pt-1.5 border-t border-white/5 space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-violet-300">Puntos Axis Points</span>
              <span className="text-slate-400">Máx: {maxPointsAllowed} AP</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxPointsAllowed}
              step="50"
              value={effectivePointsToBurn}
              onChange={(e) => setAxisPointsToBurn(parseInt(e.target.value) || 0)}
              className="w-full accent-violet-500 h-1.5"
            />
            {pointsDiscountUSD > 0 && (
              <div className="flex justify-between text-[10px] text-violet-400 font-black">
                <span>{effectivePointsToBurn} AP quemados</span>
                <span>-{formatUSD(pointsDiscountUSD)}</span>
              </div>
            )}
          </div>
        )}

        {/* Total Highlight */}
        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Total a Cobrar</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatUSD(totalDueUSD)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Tasa BCV:</span>
            <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
              Bs. {totalDueBs.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
          Forma de Pago
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "cash_usd", label: "💵 Efectivo $" },
            { id: "cash_bs", label: "📱 Pago Móvil Bs" },
            { id: "pos_integrated", label: "💳 Débito / Tarjeta" },
            { id: "zelle", label: "⚡ Zelle" },
            { id: "vale_credit", label: "🎫 Vale / Fiado" },
            { id: "split_currency", label: "🔀 Pago Mixto" }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setPaymentMethod(m.id);
                setQuickCashUSD(null);
              }}
              className={`p-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                paymentMethod === m.id
                  ? "bg-violet-600 text-white border-violet-400 shadow-sm"
                  : "bg-black/40 text-slate-300 border-white/5 hover:bg-black/60"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Details Section */}
      {/* 1. EFECTIVO USD: Calculadora rápida de vueltos */}
      {paymentMethod === "cash_usd" && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
              <Coins size={12} className="text-amber-400" /> Billetes Recibidos
            </span>
            {quickCashUSD !== null && (
              <button 
                type="button" 
                onClick={() => setQuickCashUSD(null)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                playCashDrawerSound();
                setQuickCashUSD(totalDueUSD);
              }}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              Exacto
            </button>
            {[1, 5, 10, 20, 50, 100].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  playCashDrawerSound();
                  setQuickCashUSD(b);
                }}
                className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-black border flex items-center justify-center cursor-pointer active:scale-95 transition-all ${
                  quickCashUSD === b
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 scale-105"
                    : "bg-slate-900 text-slate-200 border-white/10 hover:bg-slate-800"
                }`}
              >
                ${b}
              </button>
            ))}
          </div>

          {quickCashUSD !== null && (
            <div className={`p-2 rounded-xl border text-xs font-mono flex items-center justify-between ${
              quickCashUSD >= totalDueUSD ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300" : "bg-red-950/60 border-red-500/50 text-red-300"
            }`}>
              <div>
                <span className="text-[9px] uppercase font-bold block text-slate-400">
                  {quickCashUSD >= totalDueUSD ? "Vuelto a Entregar:" : "Faltante:"}
                </span>
                <span className="text-sm font-black">
                  {quickCashUSD >= totalDueUSD ? `$${(quickCashUSD - totalDueUSD).toFixed(2)} USD` : `$${(totalDueUSD - quickCashUSD).toFixed(2)} USD`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold block text-slate-400">En Bolívares:</span>
                <span className="text-xs font-bold text-white">
                  Bs. {Math.abs((quickCashUSD - totalDueUSD) * bcvRate).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PAGO MÓVIL: Datos bancarios del comercio & Pegar Ref */}
      {paymentMethod === "cash_bs" && (
        <div className="bg-slate-950/70 border border-violet-800/30 p-3 rounded-2xl space-y-2 animate-fade-in text-xs">
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p>Banco: <strong className="text-white">{merchantInfo?.paymentMethods?.pagoMovil?.bank || "Banesco (0134)"}</strong></p>
            <p>Teléfono: <strong className="text-white">{merchantInfo?.paymentMethods?.pagoMovil?.phone || "0412-5551234"}</strong></p>
            <p>RIF: <strong className="text-white">{merchantInfo?.paymentMethods?.pagoMovil?.idCard || "J-408192841"}</strong></p>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Referencia (4 a 12 dígitos)..."
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[10px] font-bold active:scale-95 shrink-0"
              title="Pegar referencia del portapapeles"
            >
              Pegar
            </button>
          </div>
        </div>
      )}

      {/* Customer Info (Phone & Name for WhatsApp Receipt & Loyalty) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <input
          type="tel"
          placeholder="WhatsApp (0414...)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 font-mono"
        />
        <input
          type="text"
          placeholder="Nombre Cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Action Buttons: Confirm & Smart Vueltos */}
      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowChangeCalculator(true)}
          className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
          title="Calculadora avanzada de vueltos mixtos en dólares y bolívares"
        >
          <Calculator size={16} />
        </button>

        <button
          type="button"
          data-testid="pos-cobrar-btn"
          disabled={cart.length === 0}
          onClick={handleConfirmSale}
          className="flex-1 py-3.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer border border-emerald-300 uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Cobrar {formatUSD(totalDueUSD)}</span>
          <span className="text-[10px] font-mono font-black opacity-85 px-1 py-0.5 rounded bg-emerald-600/30">
            Bs. {totalDueBs.toFixed(2)}
          </span>
        </button>
      </div>

    </div>
  );
}

export default AxisNitroPOS;
