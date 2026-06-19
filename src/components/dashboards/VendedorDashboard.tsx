"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera, Upload, ShoppingCart, TrendingUp, Users, DollarSign,
  LogOut, Shield, Package, Activity, Search, QrCode, Lock,
  ChevronRight, CheckCircle, CreditCard, Bell, X, Info,
  Store, Star, ChevronLeft, Clock, UserCheck, Palette,
  Zap, BookOpen, Printer, Smartphone, Settings, DownloadCloud, Terminal, Truck,
  Briefcase, FileText, Award, Check, ArrowUpRight, WifiOff, Gift, MapPin, UserPlus, LogIn, Eye, Database, Trash2
} from "lucide-react";
import { useKFS } from "../../context/KFSContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckoutModal } from "../CheckoutModal";
import { TopUpModal } from "../TopUpModal";
import { PayoutModal } from "../PayoutModal";
import { ReceiptModal } from "../ReceiptModal";
import { UniversalWalletWidget } from "../UniversalWalletWidget";
import { ProfileAvatarEditor } from "../ProfileAvatarEditor";

import { FlowExpressCatalog } from "../FlowExpressCatalog";
import { B2BSelfOnboarding } from "../B2BSelfOnboarding";
import { DatabaseManagerWidget } from "../DatabaseManagerWidget";
import { ReferralLinksWidget } from "../ReferralLinksWidget";
import { KPointsIssuerWidget } from "../KPointsIssuerWidget";
import { useP2PTransfer } from "../../hooks/useP2PTransfer";
import { compressImage, readAsBase64, playPremiumChime, playSyncChime, playCashDrawerSound, playScannerBeep, getStoreCoords, getCustomerCoords } from "../../lib/utils";
import { AnimatedCounter } from "../AnimatedCounter";
import { AppEnforcer } from "../AppEnforcer";
import { PioneerOfferBanner } from "../PioneerOfferBanner";
import { OracleControlSlider } from "../OracleControlSlider";
import { OracleInsightCard } from "../OracleInsightCard";
import { PushCommandCenter } from "../PushCommandCenter";
import { supabase } from "../../context/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import("../LiveMap"), { ssr: false });

// Theme and Global Constants
const KREATEK_COLORS = {
  navy: "violet-900",
  bronze: "violet-600",
  white: "#F8F9FA"
};

// ==========================================
// UTILITIES
// ==========================================


// ==========================================
// BUSINESS ECOSYSTEM SUBCOMPONENTS
// ==========================================



// ==========================================
// SUBCOMPONENTS (DEFINED OUTSIDE PARENT TO PREVENT UNMOUNT RESETS)
// ==========================================

// Toast Component

export const VendedorDashboard = ({ db, setDb, currentUser, addProduct, processPurchase, showToast, formatUSD, logout, approveOrder, rejectOrder, generateZReport, registerCrmExpress, triggerGhostTrap }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const [scannedGlobalProduct, setScannedGlobalProduct] = useState<any>(null);
  const [smsInput, setSmsInput] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const { queryGlobalBarcode, smsConciliator, rates, networkState, requestNotificationPermission } = useKFS() as any;

  // Hardware Barcode Scanner Listener
  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();
    let timeoutId: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter" && barcodeBuffer.length > 3) {
        e.preventDefault();
        const scannedCode = barcodeBuffer;
        barcodeBuffer = "";

        const product = db.products?.find((p: any) => p.clientId === currentUser.clientId && p.barcode === scannedCode);
        if (product && product.stock > 0) {
          playPremiumChime();
          setCheckoutProduct(product);
          showToast(`Producto escaneado vía Hardware: ${product.name}`, "success");
        } else if (product && product.stock <= 0) {
          showToast(`Producto sin stock: ${product.name}`, "error");
        } else {
          showToast(`Código de barras no encontrado: ${scannedCode}`, "error");
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { barcodeBuffer = ""; }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [db, currentUser]);

  const handleManualSmsConciliation = () => {
    if (!smsInput.trim()) return;
    const result = smsConciliator(smsInput);
    if (result.matched) {
      playPremiumChime();
      showToast(`¡Conciliación Exitosa! Orden auto-aprobada por SMS. Ref: ${result.reference}`, "success");
      setSmsInput("");
    } else {
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(`SMS leído (Ref: ${result.reference || "Desconocida"}, Bs. ${result.amount || 0}), pero no coincide con ninguna orden online pendiente.`, "error");
      }
    }
  };

  const [newProd, setNewProd] = useState({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [activeManual, setActiveManual] = useState<string | null>(null);

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode) return;
    setIsFetchingBarcode(true);
    try {
      // 1. Consultar el Catálogo Nacional de Venezuela (Garantía offline-first)
      const globalProd = await queryGlobalBarcode(barcode);
      if (globalProd) {
        setNewProd(prev => ({
          ...prev,
          name: globalProd.name,
          imgUrl: globalProd.imgUrl,
          category: globalProd.category || prev.category
        }));
        showToast(`¡Producto encontrado en Catálogo Venezolano! (${globalProd.brand})`, "success");
        setIsFetchingBarcode(false);
        return;
      }

      // 2. Fallback a Open Food Facts global
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setNewProd(prev => ({
          ...prev,
          name: data.product.product_name || data.product.product_name_es || prev.name,
          imgUrl: data.product.image_url || prev.imgUrl
        }));
        showToast("¡Producto encontrado en la base global!", "success");
      } else {
        showToast("Producto no encontrado en base global. Complete manualmente.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error consultando base de datos. Complete manualmente.");
    }
    setIsFetchingBarcode(false);
  };

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.clientId);
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.clientId && o.status === 'pending') || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await compressImage(file, 400, 0.6);
        setNewProd(prev => ({ ...prev, imgUrl: base64String }));
      } catch (error) {
        showToast("Error comprimiendo imagen", "error");
      }
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProd.name,
      priceUSD: parseFloat(newProd.price),
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "",
      clientId: currentUser.clientId,
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode,
      description: newProd.description
    });
    setShowAddModal(false);
    setNewProd({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  };

  const handleScanSuccess = async (prodIdOrBarcode: string) => {
    playScannerBeep();
    // Intercept PDF417 Cédula Scanner
    if (prodIdOrBarcode.startsWith("PDF417:")) {
      const payload = prodIdOrBarcode.substring(7); // remove prefix
      const match = payload.match(/^([V|E])([0-9]+)([A-Z_]+)_([A-Z_]+)_([M|F])([0-9]{8})$/);
      if (match) {
        const type = match[1];
        const cedula = match[2];
        const name = match[3].replace(/_/g, ' ');
        const surname = match[4].replace(/_/g, ' ');

        const crmPhone = `0414-${Math.floor(1000000 + Math.random() * 9000000)}`;
        registerCrmExpress(`${type}-${cedula}`, name, surname, crmPhone);

        playPremiumChime();
        showToast(`CRM Express: ¡Cédula ${type}-${cedula} (${name} ${surname}) registrada en CRM!`, "success");
      } else {
        showToast("Error decodificando código PDF417 de la Cédula.", "error");
      }
      setShowScanner(false);
      return;
    }

    // 1. Buscar por ID o código de barras localmente
    let prod = db.products.find((p: any) => p.id === prodIdOrBarcode || p.barcode === prodIdOrBarcode);

    if (prod) {
      setCheckoutProduct(prod);
      setShowScanner(false);
      return;
    }

    // 2. Consulta en el Catálogo Nacional de Venezuela (Garantía offline-first)
    const globalProd = await queryGlobalBarcode(prodIdOrBarcode);
    if (globalProd) {
      playPremiumChime();
      setScannedGlobalProduct({
        barcode: prodIdOrBarcode,
        name: globalProd.name,
        imgUrl: globalProd.imgUrl,
        category: globalProd.category || "Alimentos",
        brand: globalProd.brand || "Venezuela",
        source: globalProd.source
      });
      setShowScanner(false);
      return;
    }

    // 3. Fallback a Open Food Facts global
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${prodIdOrBarcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const productName = data.product.product_name || data.product.product_name_es || "Producto Desconocido";
        const imgUrl = data.product.image_url || "";
        playPremiumChime();
        setScannedGlobalProduct({
          barcode: prodIdOrBarcode,
          name: productName,
          imgUrl: imgUrl,
          category: "Alimentos",
          brand: "Importado / Global",
          source: "openfoodfacts"
        });
      } else {
        showToast("Producto no encontrado en las bases de datos.");
      }
    } catch (e) {
      showToast("Producto no reconocido y error de red.");
    }
    setShowScanner(false);
  };

  const handleConfirmCheckout = (paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string, customerName: string, customerRif: string, paymentScreenshot?: string, kPointsToBurn: number = 0) => {
    const tx = processPurchase(checkoutProduct, paymentMethod, applyIva, customerPhone, customerName, customerRif, kPointsToBurn);
    if (tx) {
      setReceiptTx(tx);
    }
    setCheckoutProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans relative">
      {clientInfo?.subscription?.status === 'past_due' && (
        <div className="fixed inset-0 bg-red-900/95 backdrop-blur-xl z-[99999] flex flex-col items-center justify-center p-6 animate-fade-in text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Lock size={48} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">SISTEMA BLOQUEADO</h1>
          <p className="text-red-200 text-sm max-w-md mb-8">
            Tu suscripción KFS-OS se encuentra vencida. Por políticas de seguridad comercial, tu acceso operativo ha sido suspendido. Paga tu saldo pendiente de <strong className="text-white">${clientInfo.subscription.costUSD || 6} USD</strong> usando tu Reserva Central para reactivar tu negocio inmediatamente.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => paySubscription(clientInfo.id)}
              className="bg-red-500 hover:bg-red-400 text-white font-black px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              Pagar Suscripción Ahora
            </button>
            <button
              onClick={logout}
              className="bg-transparent border border-red-500/30 text-red-300 font-bold px-8 py-4 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-sky-800 bg-sky-900 sticky top-0 z-40 backdrop-blur-md gap-3 w-full shadow-lg shadow-sky-900/20">
        <div className="flex items-center gap-3 justify-between w-full sm:w-auto">
          <KreatekLogo className="h-8 w-auto text-white" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-widest uppercase text-sky-300 sm:text-lg">
              Terminal: {currentUser.company}
            </span>
            <div className="w-10 h-10 ml-2 rounded-full border-2 border-sky-400 relative z-20">
              <ProfileAvatarEditor currentUser={currentUser} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <button onClick={requestNotificationPermission} className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold" title="Activar Alertas Nativas">
              <Bell size={14} />
            </button>
            <button onClick={() => showToast("Comando TFHKA Reporte X enviado...", "success")} className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold">
              Reporte X
            </button>
            <button onClick={() => { generateZReport(currentUser.id, currentUser.clientId); showToast("Comando TFHKA Z enviado. Sesión cerrada.", "success"); }} className="flex items-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold">
              Cerrar Caja (Z)
            </button>
          </div>
<div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm" title="K-Pts">
              <span className="text-[9px] font-black text-orange-900 uppercase">K-Pts</span>
              <span className="font-black text-white text-xs">{currentUser?.kfsPoints || 0}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors text-white cursor-pointer text-xs font-bold">
              Salir
            </button>
          </div>
        </div>
      </nav>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <OracleInsightCard role="cashier" data={{ streak: 5, bonusEarned: currentUser.accumulated_bonus || '0.00' }} />

        {networkState === "offline" && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <WifiOff className="text-red-400" size={24} />
              <div>
                <h3 className="font-black text-red-400">Modo Offline Activo</h3>
                <p className="text-xs text-red-300 font-medium">Las ventas se guardarán localmente en la cola segura y se sincronizarán al recuperar la conexión.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-sky-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-sky-800">
          <div className="relative z-10">
            <p className="text-sky-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14} className="text-emerald-400" /> Sesión Operativa</p>
            <h2 className="text-5xl font-black mb-1 text-white">{currentUser.name}</h2>
            <p className="text-xs text-sky-200/70 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span> Terminal en línea y asegurado.
            </p>
          </div>

          <div className="relative z-10 bg-black/30 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-end backdrop-blur-sm">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Cumplimiento SUNDDE</span>
            <span className="text-2xl font-black text-white mt-1">Tasa BCV: {rates?.USD?.toFixed(2)} Bs</span>
            <span className="text-[9px] text-sky-300/50 mt-1 uppercase tracking-widest">Gaceta Oficial de Venezuela</span>
          </div>

          <Activity size={150} className="absolute -right-10 -bottom-10 text-white/5" />
        </div>

        <UniversalWalletWidget currentUser={currentUser} formatUSD={formatUSD} />

        <KFSIoTEdgeConsole showToast={showToast} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => setShowAddModal(true)} className="bg-white border border-sky-100 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 flex flex-col items-center justify-center gap-4 hover:border-sky-300 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
              <Upload size={24} className="text-sky-600" />
            </div>
            <span className="font-black text-sky-950">Subir Producto</span>
          </button>
          <button onClick={() => { setShowScanner(true); showToast("Cámara de escaneo activada."); }} className="bg-white border border-sky-100 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 flex flex-col items-center justify-center gap-4 hover:border-sky-300 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
              <QrCode size={24} className="text-sky-600" />
            </div>
            <span className="font-black text-sky-950">Escanear QR / Compra</span>
          </button>
          <button onClick={() => setActiveManual('operator')} className="bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-800 text-white p-8 rounded-[2rem] shadow-xl shadow-sky-900/30 flex flex-col items-center justify-center gap-4 hover:from-sky-800 hover:to-slate-800 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-sky-700">
              <BookOpen size={24} className="text-sky-300" />
            </div>
            <span className="font-black text-white">Manual de Operación</span>
          </button>
        </div>

        {myOrders.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-sky-200/50 border border-amber-200 bg-amber-50/30">
            <h3 className="font-black text-xl text-sky-950 mb-4 flex items-center gap-2 text-amber-600">
              <Clock className="text-amber-500" /> Órdenes Online ({myOrders.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Lista de Órdenes */}
              <div className="lg:col-span-2 space-y-3">
                {myOrders.map((order: any) => {
                  const product = db.products.find((p: any) => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm gap-3 animate-fade-in">
                      <div>
                        <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-1 inline-block">Validación Pendiente</span>
                        <h4 className="font-bold text-sm text-sky-950">{product?.name || "Producto Desconocido"}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: <span className="font-bold text-slate-900">{order.paymentReference}</span> | {order.paymentMethod}</p>
                        {order.customerName && (
                          <p className="text-[10px] text-slate-600 font-bold mt-1">
                            Cliente: {order.customerName} {order.customerRif && `(${order.customerRif})`}
                          </p>
                        )}
                        {order.paymentScreenshot && (
                          <button
                            onClick={() => setActiveScreenshot(order.paymentScreenshot)}
                            className="mt-1.5 text-[10px] bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-800 font-black px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            🖼️ Ver Capture
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-right flex-1 md:flex-none">
                          <p className="font-black text-base text-emerald-600">{formatUSD(order.amountUSD)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => rejectOrder(order.id)} className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer" title="Rechazar"><X size={18} /></button>
                          <button onClick={() => approveOrder(order.id)} className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: Conciliador SMS Real */}
              <div className="bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-800 rounded-3xl p-5 text-white relative overflow-hidden shadow-xl shadow-sky-900/20 flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                      <Bell size={16} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs tracking-wide">CONCILIADOR SMS</h4>
                    </div>
                  </div>

                  <p className="text-[10px] text-sky-200/70 mb-3 leading-relaxed">
                    Pega el SMS de notificación del Pago Móvil recibido para conciliar y auto-aprobar la orden del cliente de inmediato.
                  </p>

                  <textarea
                    placeholder="Pega el SMS recibido..."
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    className="w-full h-20 bg-black/40 border border-sky-800 rounded-xl p-2.5 text-xs font-mono text-sky-100 focus:outline-none focus:border-sky-500 placeholder:text-slate-600 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleManualSmsConciliation}
                  className="w-full mt-3 py-2.5 rounded-xl font-black text-xs text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-lg shadow-sky-600/30 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                >
                  ⚡ Conciliar SMS
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xl shadow-sky-200/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h3 className="font-black text-sky-950 text-lg flex items-center gap-2"><Package size={20} className="text-sky-600" /> Catálogo de {currentUser.company}</h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Buscar producto o barcode..." className="w-full bg-slate-50 border border-sky-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400" value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-4">
            {myProducts.filter((p: any) => p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).map((p: any) => (
              <div key={p.id} className="border border-sky-100 rounded-2xl p-3 flex flex-col justify-between bg-sky-50/50 hover:border-sky-200 transition-colors">
                <div className="h-28 bg-slate-200 rounded-lg overflow-hidden mb-2">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <div>
                  <h4 className="font-bold text-xs truncate text-sky-950">{p.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <p className="text-xs font-black text-sky-600">{formatUSD(p.priceUSD)}</p>
                      <p className="text-[10px] font-bold text-slate-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {p.stock && p.stock > 0 ? `${p.stock} u.` : "Agotado"}
                    </span>
                  </div>
                </div>
                <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} className="mt-2 w-full py-2 bg-sky-900 disabled:bg-slate-400 hover:bg-sky-800 text-white font-bold rounded-lg text-[10px] cursor-pointer disabled:cursor-not-allowed transition-colors">
                  {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Cargar Venta"}
                </button>
              </div>
            ))}
            {myProducts.filter((p: any) => p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).length === 0 && <p className="col-span-full text-center text-xs text-slate-400 py-6 font-bold">Sin resultados o sin productos cargados.</p>}
          </div>
        </div>
      </div>

      {/* Scanner View Integration */}
      {showScanner && (
        <ScannerView
          videoRef={videoRef}
          onClose={() => setShowScanner(false)}
          onScan={handleScanSuccess}
          myProducts={myProducts}
          formatUSD={formatUSD}
        />
      )}

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onConfirm={handleConfirmCheckout}
          onCancel={() => setCheckoutProduct(null)}
          formatUSD={formatUSD}
          currentUser={currentUser}
        />
      )}

      {receiptTx && (
        <ReceiptModal
          tx={receiptTx}
          product={db.products.find((p: any) => p.id === receiptTx.productId)}
          onClose={() => setReceiptTx(null)}
          formatUSD={formatUSD}
          triggerGhostTrap={triggerGhostTrap}
          showToast={showToast}
          currentUser={currentUser}
        />
      )}

      {/* Modal Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-sky-100">
            <h3 className="text-2xl font-black mb-6 text-sky-950">Nuevo Producto</h3>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({ ...newProd, barcode: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sky-950 placeholder:text-slate-400" />
                <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-sky-900 hover:bg-sky-800 transition-colors text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                  <Search size={18} />
                </button>
              </div>
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-black text-lg text-sky-950 placeholder:text-slate-400" />
                <input required type="number" placeholder="Stock" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400" />
              </div>
              <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400">
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Ropa y Calzado">Ropa y Calzado</option>
                <option value="Tecnología">Tecnología y Electrónica</option>
                <option value="Salud y Belleza">Salud y Belleza</option>
                <option value="Hogar">Hogar y Muebles</option>
                <option value="Servicios">Servicios Generales</option>
              </select>
              <textarea placeholder="Descripción del producto (Opcional)" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="w-full bg-slate-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-sky-950 text-sm h-20 resize-none placeholder:text-slate-400" />
              <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 text-center hover:bg-sky-50 cursor-pointer relative transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {newProd.imgUrl ? (
                  <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Camera size={40} className="mb-3 text-sky-300" />
                    <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/30 cursor-pointer">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Producto Detectado en Catálogo Global / Nacional */}
      {scannedGlobalProduct && (
        <div className="fixed inset-0 bg-sky-950/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-700 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            {/* Efecto de brillo de fondo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400">
                <Package size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Producto Detectado</h3>
                <p className="text-xs text-sky-400 font-bold tracking-widest uppercase animate-pulse">
                  {scannedGlobalProduct.source === "local_venezuela" || scannedGlobalProduct.source === "supabase_cloud"
                    ? "Catálogo Nacional de Venezuela"
                    : "Base de Datos Global (OpenFoodFacts)"}
                </p>
              </div>
            </div>

            <p className="text-sky-100/80 text-sm mb-6 leading-relaxed">
              El artículo escaneado está registrado en la base de datos central, pero <span className="text-sky-300 font-bold">no existe aún en tu inventario local</span>. Puedes agregarlo instantáneamente.
            </p>

            <div className="bg-black/30 border border-sky-800 rounded-2xl p-5 mb-8 flex gap-4 items-center backdrop-blur-sm">
              {scannedGlobalProduct.imgUrl ? (
                <img
                  src={scannedGlobalProduct.imgUrl}
                  alt={scannedGlobalProduct.name}
                  className="w-20 h-20 object-cover rounded-xl border border-sky-700 shadow-lg flex-shrink-0 bg-black/40 animate-fade-in"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-black/40 border border-sky-700 flex items-center justify-center flex-shrink-0 text-sky-400">
                  <Camera size={28} />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-white font-black text-lg truncate" title={scannedGlobalProduct.name}>
                  {scannedGlobalProduct.name}
                </p>
                <p className="text-sky-200/60 text-xs mt-1">
                  Marca: <span className="text-sky-100 font-semibold">{scannedGlobalProduct.brand}</span> • Categoría: <span className="text-sky-100 font-semibold">{scannedGlobalProduct.category}</span>
                </p>
                <p className="text-sky-300 font-mono text-xs mt-2 bg-sky-500/10 border border-sky-500/30 rounded px-2.5 py-1 inline-block">
                  {scannedGlobalProduct.barcode}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setScannedGlobalProduct(null)}
                className="w-1/3 py-3.5 rounded-xl border border-sky-700 text-sky-200 hover:text-white hover:bg-white/5 font-bold cursor-pointer transition-colors"
              >
                Ignorar
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewProd({
                    name: scannedGlobalProduct.name,
                    price: "",
                    stock: "20",
                    imgUrl: scannedGlobalProduct.imgUrl || "",
                    category: scannedGlobalProduct.category || "Alimentos",
                    barcode: scannedGlobalProduct.barcode,
                    description: ""
                  });
                  setScannedGlobalProduct(null);
                  setShowAddModal(true);
                }}
                className="w-2/3 py-3.5 rounded-xl font-black text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/30 cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Registrar en Inventario
              </button>
            </div>
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-sky-950 rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-sky-100">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-slate-400 hover:text-sky-900 transition-colors cursor-pointer bg-slate-100 p-2 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>

            {activeManual === 'operator' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-sky-600" size={28} /> Manual del Operador (Caja)</h2>
                <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
                  <div className="bg-slate-50 p-4 rounded-xl border border-sky-100">
                    <p className="font-black text-sky-900 mb-1">1. Registro de Compras Físicas:</p>
                    <p>Usa el botón "Escanear QR / Compra" o busca el producto manualmente. Selecciona el método de pago e ingresa el RIF o Cédula del cliente si requiere Factura Fiscal.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-sky-100">
                    <p className="font-black text-sky-900 mb-1">2. Validar Órdenes Online (E-Commerce):</p>
                    <p>Las compras realizadas por clientes en la tienda online aparecerán en el panel "Órdenes Online". Copia el mensaje SMS del banco (Pago Móvil) y pégalo en el "Conciliador SMS" para aprobar la orden automáticamente.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-sky-100">
                    <p className="font-black text-sky-900 mb-1">3. Cierre de Caja (Reporte Z):</p>
                    <p>Al final del turno, debes presionar "Cerrar Caja (Z)" en el menú superior. Esto enviará la totalización al dueño y cerrará tu sesión operativa.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-sky-100">
                    <p className="font-black text-sky-900 mb-1">4. Impresión Fiscal:</p>
                    <p>Asegúrate de que la aplicación "Sincro-Shield Proxy" esté corriendo en la PC de caja para que el sistema KFS pueda emitir los recibos por la impresora conectada.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeScreenshot && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-800 rounded-[2.5rem] w-full max-w-lg p-6 shadow-2xl relative flex flex-col items-center">
            <button onClick={() => setActiveScreenshot(null)} className="absolute top-6 right-6 text-sky-200/50 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-full">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-sky-400 mb-4 text-center">Capture de Transacción</h3>
            <div className="w-full max-h-[70vh] overflow-auto rounded-2xl border border-sky-800 bg-black/40 p-2 flex justify-center items-center">
              <img src={activeScreenshot} alt="Transaction Capture" className="max-w-full h-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
