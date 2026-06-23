"use client";

import { KFS_BRAND } from "../../config/brandConfig";
import { Toast } from "../Toast";
import { CvViewerModal } from "../CvViewerModal";
import { SMSConciliatorSimulator } from "../SMSConciliatorSimulator";
import { KFSFinancialSplitCalculator } from "../KFSFinancialSplitCalculator";
import { FiscalPrinterSetupWidget } from "../FiscalPrinterSetupWidget";
import { KFSIoTEdgeConsole } from "../KFSIoTEdgeConsole";
import { KreatekLogo } from "../KreatekLogo";
import { Navbar } from "../Navbar";
import { RegisterClientForm } from "../RegisterClientForm";
import { RegisterPromotoraForm } from "../RegisterPromotoraForm";
import { RegisterCustomerForm } from "../RegisterCustomerForm";
import { RegisterRiderForm } from "../RegisterRiderForm";
import { StorefrontCustomizer } from "../StorefrontCustomizer";
import { OnboardingWizard } from "../OnboardingWizard";
import { RecruitmentWidget } from "../RecruitmentWidget";
import { ScannerView } from "../ScannerView";

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

export const ClientDashboard = ({ db, setDb, currentUser, addProduct, addExpense, showToast, formatUSD, formatEUR, logout, approveOrder, rejectOrder, dispatchOrder, paySubscription, requestPayout, requestTopUp }: any) => {
  const { finishOnboarding } = useKFS();
  const clientInfo = db.clients?.find((c: any) => c.id === currentUser.id) || currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("resumen"); // resumen | inventario | personal | config
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddVendedor, setShowAddVendedor] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState<any>(null); // Holds vendedor obj
  const [payrollBaseSalary, setPayrollBaseSalary] = useState("");
  const [searchVendedor, setSearchVendedor] = useState("");

  const [newProd, setNewProd] = useState({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [newVendedor, setNewVendedor] = useState({ name: "", email: "", password: "", avatar: "" });
  const [newExpense, setNewExpense] = useState({ description: "", amountUSD: "" });
  const [smsInput, setSmsInput] = useState("");
  const [activeManual, setActiveManual] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { createTicket, fundWallet, processMonthlyBilling, createVale, payVale, processPayroll, queryGlobalBarcode, smsConciliator, rates, toggleLoyaltyProgram, updateStoreSettings, updatePaymentMethods, toggleProductFeatured, stopImpersonating, registerPosTerminal, deletePosTerminal, assignRiderToBusiness, removeRiderFromBusiness, assignDeliveryToOrder, toggleBusinessOpen, updateBusinessConfig } = useKFS() as any;
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(clientInfo?.deliveryRadiusKm || 5);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      if (lines.length > 1) {
        const newProducts: any[] = [];
        lines.slice(1).forEach(line => {
          if (!line.trim()) return;
          const cols = line.split(',');
          if (cols.length >= 2) {
            const name = cols[0]?.trim();
            const price = parseFloat(cols[1]?.trim());
            const stock = parseInt(cols[2]?.trim() || "0");
            const category = cols[3]?.trim() || "Importados";
            const barcode = cols[4]?.trim() || "";
            if (name && !isNaN(price)) {
              newProducts.push({
                id: `p${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                priceUSD: price,
                costUSD: price * 0.7,
                stock,
                category,
                barcode,
                image: "",
                clientId: currentUser.id,
                clientName: currentUser.company,
                timestamp: new Date().toISOString()
              });
            }
          }
        });

        if (newProducts.length > 0) {
          setDb((prev: any) => ({
            ...prev,
            products: [...prev.products, ...newProducts]
          }));
          showToast(`¡Se importaron ${newProducts.length} productos con éxito desde CSV!`, "success");
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const shieldMargin = (productId: string, newPrice: number) => {
    setDb((prev: any) => ({
      ...prev,
      products: prev.products.map((p: any) => p.id === productId ? { ...p, priceUSD: parseFloat(newPrice.toFixed(2)) } : p)
    }));
    showToast(`Margen blindado con éxito en el canal POS y ${KFS_BRAND.modules.marketplace}.`, "success");
  };

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

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.id);
  const myVendedores = db.vendedores?.filter((v: any) => v.clientId === currentUser.id) || [];
  const myExpenses = db.expenses?.filter((e: any) => e.clientId === currentUser.id) || [];
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.id && o.status === 'pending') || [];
  const myPendingDispatch = db.transactions?.filter((tx: any) => tx.clientId === currentUser.id && tx.shippingStatus === 'pending') || [];

  const totalExpensesUSD = myExpenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amountUSD), 0);
  const grossSalesUSD = clientInfo.salesUSD || 0;
  const netProfitUSD = grossSalesUSD - totalExpensesUSD;

  const myTransactions = db.transactions.filter((tx: any) =>
    db.products.find((p: any) => p.id === tx.productId)?.clientId === currentUser.id
  );
  const clientChartData = myTransactions.map((t: any, index: number) => ({
    name: `Venta ${index + 1}`,
    amount: t.amountUSD
  })).slice(-15);

  const lowStockProducts = myProducts.filter((p: any) => p.stock !== undefined && p.stock < 5);
  const stagnantProducts = myProducts.filter((p: any) => {
    if (p.stock === undefined || p.stock <= 0) return false;
    const daysSinceSold = p.lastSoldAt ? (new Date().getTime() - new Date(p.lastSoldAt).getTime()) / (1000 * 3600 * 24) : 16; // default 16 if never sold
    return daysSinceSold > 15;
  });

  // Filter CRM to this client's transactions? Wait, CRM is global right now based on phone.
  // Actually, we'll just show the global CRM filtered by those who bought from this client
  const myClientTxs = db.transactions.filter((tx: any) => tx.clientId === currentUser.id && tx.customerPhone);
  const myUniquePhones = Array.from(new Set(myClientTxs.map((tx: any) => tx.customerPhone)));
  const myCrm = db.crm?.filter((c: any) => myUniquePhones.includes(c.phone)) || [];

  const myZReports = db.zReports?.filter((z: any) => z.clientId === currentUser.id) || [];

  useEffect(() => {
    const handleStoreSale = (e: any) => {
      if (e.detail.clientId === currentUser.id) {
        showToast(`💰 Venta registrada en tu red: ${e.detail.name} (+${formatUSD(e.detail.priceUSD)})`);
      }
    };
    window.addEventListener("kfs-purchase", handleStoreSale);
    return () => window.removeEventListener("kfs-purchase", handleStoreSale);
  }, [currentUser.id, showToast, formatUSD]);

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
    const parsedPrice = parseFloat(newProd.price);
    const parsedCost = parseFloat(newProd.cost) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast("El precio de venta debe ser mayor a 0", "error");
      return;
    }
    if (parsedCost > 0 && parsedPrice <= parsedCost) {
      showToast("El precio de venta debe ser mayor al costo de insumo", "error");
      return;
    }

    addProduct({
      name: newProd.name,
      priceUSD: parsedPrice,
      costUSD: parsedCost,
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "",
      clientId: currentUser.id,
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode,
      description: newProd.description,
      timestamp: new Date().toISOString()
    });
    setNewProd({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
    setShowAddModal(false);
  };

  const changeTier = (tier: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, kfsTier: tier } : c)
    }));
    showToast(`Nivel Operativo actualizado a ${tier.toUpperCase()}`, "success");
  };

  const handleAddVendedor = (e: React.FormEvent) => {
    e.preventDefault();
    const added = { ...newVendedor, id: `v${Date.now()}`, clientId: currentUser.id, company: currentUser.company };
    setDb((prev: any) => ({ ...prev, vendedores: [...prev.vendedores, added] }));
    setNewVendedor({ name: "", email: "", password: "", avatar: "" });
    setShowAddVendedor(false);
    showToast("Vendedor autorizado y registrado.");
  };

  const isPastDue = clientInfo.subscription?.status === 'past_due' || (clientInfo.subscription?.nextBillingDate && new Date() > new Date(clientInfo.subscription.nextBillingDate));
  const isPendingVerification = clientInfo.subscription?.status === 'pending_verification';

  if (isPastDue || isPendingVerification) {
    return (
      <div className="min-h-screen bg-violet-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-10 border-t-8 border-violet-600 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-violet-600/5 z-0 pointer-events-none"></div>

          <Lock size={64} className="text-violet-600 mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-black text-violet-900 mb-2 relative z-10">
            {isPendingVerification ? "Pago en Verificación" : "Suscripción Vencida"}
          </h2>
          <p className="text-gray-600 mb-8 font-bold relative z-10 text-lg">
            {isPendingVerification
              ? "Tu comprobante de pago ha sido enviado al equipo Kreatek Core y está siendo auditado. Tu tienda se reactivará en breve."
              : `Tu membresía mensual a ${KFS_BRAND.productAcronym} OS ($6) se encuentra vencida. Tu tienda está pausada.`}
          </p>

          {!isPendingVerification && (
            <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-6 rounded-2xl mb-8 relative z-10 placeholder:text-gray-400">
              <h3 className="font-bold text-violet-900 mb-4">¿Cómo reactivar tu {KFS_BRAND.modules.marketplace}?</h3>
              <p className="text-sm text-gray-500 mb-4">Transfiere $6 USD vía Zinli, AirTM, Wally, Ubbi, Binance Pay o Pago Móvil y escribe la referencia bancaria a continuación:</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const ref = (e.target as any).reference.value;
                paySubscription(currentUser.id, ref);
              }} className="space-y-4">
                <input
                  type="text"
                  name="reference"
                  required
                  placeholder="Ej: 12345678"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-violet-600 focus:outline-none"
                />
                <button type="submit" className="w-full bg-violet-600 text-white font-black py-4 rounded-xl hover:bg-[#b08e72] transition-colors cursor-pointer flex justify-center items-center gap-2 shadow-md">
                  <Upload size={18} /> Enviar Comprobante al Core
                </button>
              </form>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-orange-300/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">Axis Pts</span>
              <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>
            </div>
            <button onClick={logout} className="text-gray-400 font-bold hover:text-red-500 transition relative z-10 cursor-pointer">
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (clientInfo.isOnboarded === false) {
    return <OnboardingWizard currentUser={currentUser} finishOnboarding={finishOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-sky-950 relative">
      {currentUser?.isImpersonated && (
        <div className="bg-amber-500 text-sky-950 px-4 py-3 font-bold text-center flex items-center justify-center gap-4 text-sm shadow-md animate-pulse sticky top-0 z-50 border-b border-amber-600">
          <span>⚠️ MODO IMPERSONACIÓN ACTIVO: Estás controlando el panel de {currentUser.company}</span>
          <button onClick={stopImpersonating} className="bg-sky-950 text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-slate-800 transition-colors shadow cursor-pointer">
            Regresar a Panel Core
          </button>
        </div>
      )}

      {/* Neumorphic / Purple Header */}
      <div className="bg-gradient-to-br from-sky-900 to-sky-950 rounded-b-[3rem] shadow-xl shadow-sky-900/20 pt-6 pb-12 px-6 text-white relative z-10 border-b border-sky-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-white"><Store size={20} /></span>
            <h1 className="font-black text-xl tracking-tight text-white">{KFS_BRAND.productAcronym} Negocio</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg border-4 border-sky-800 relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate text-white">{currentUser.company}</h2>
            <p className="text-sky-300 font-mono text-xs mt-1 truncate max-w-[200px] bg-sky-950/50 inline-block px-2 py-0.5 rounded-md border border-sky-800">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20 space-y-6 animate-fade-in">


        {activeTab === "resumen" && (
          <div className="space-y-6">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-sky-200/50 border border-sky-100 relative overflow-hidden text-sky-950">
              <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                  <p className="text-sky-600 text-xs font-black uppercase tracking-widest mb-4">Ganancia Neta (USD)</p>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-emerald-600"><AnimatedCounter value={netProfitUSD} format={formatUSD} /></h2>
                  <div className="flex gap-4 text-sm font-bold text-slate-500">
                    <span>Ventas Brutas: <span className="text-emerald-500"><AnimatedCounter value={grossSalesUSD} format={formatUSD} /></span></span>
                    <span>Gastos: <span className="text-rose-500">-<AnimatedCounter value={totalExpensesUSD} format={formatUSD} /></span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 placeholder:text-slate-400">
                      <span className="text-xs font-bold text-slate-500">Plan Base:</span>
                      <select
                        value={currentUser.kfsTier || 'matrix'}
                        onChange={(e) => changeTier(e.target.value)}
                        className="bg-transparent text-sm font-black text-sky-600 focus:outline-none cursor-pointer"
                      >
                        <option value="velocity" className="text-sky-950 bg-white">Flow Velocity (3%)</option>
                        <option value="matrix" className="text-sky-950 bg-white">Flow Matrix (5%)</option>
                        <option value="monopoly" className="text-sky-950 bg-white">Flow Monopoly (10%)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 placeholder:text-slate-400">
                      <span className="text-xs font-bold text-slate-500">Tasa {KFS_BRAND.productAcronym} Activa (Oráculo):</span>
                      <span className="text-sm font-black text-sky-600">
                        {currentUser.oracle_fee_percentage !== undefined && currentUser.oracle_fee_percentage !== null
                          ? currentUser.oracle_fee_percentage
                          : (currentUser.kfsTier === 'velocity' ? 3 : currentUser.kfsTier === 'monopoly' ? 10 : 5)}%
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setShowExpenseModal(true)} className="bg-sky-600 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-sky-600/30 hover:scale-105 transition-transform border-none cursor-pointer">
                    Registrar Gasto
                  </button>
                </div>
              </div>
              <DollarSign size={200} className="absolute -right-10 -bottom-20 text-sky-50" />
            </div>

            {/* Peaje Gamificado Progress */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 p-8 flex flex-col md:flex-row items-center gap-8 border border-sky-100">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-black text-sky-950 text-lg">Progreso de Peaje Gamificado</h3>
                  <span className="text-sm font-bold text-sky-600">{clientInfo?.onboardedUsers || 0} / 50 Usuarios</span>
                </div>
                <div className="w-full bg-sky-100 h-4 rounded-full overflow-hidden placeholder:text-slate-400">
                  <div className="bg-sky-600 h-full transition-all duration-1000" style={{ width: `${Math.min(((clientInfo?.onboardedUsers || 0) / 50) * 100, 100)}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Logra que 50 clientes se afilien usando tu código o QR y tu comisión B2B se reducirá automáticamente al 3% de forma permanente.
                </p>
              </div>
              <div className="w-32 h-32 bg-white border border-sky-200 rounded-xl flex items-center justify-center flex-shrink-0 text-center relative p-3 shadow-sm">
                <div className="text-center w-full h-full">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://kfs-os.vercel.app/#landing?ref=' + currentUser.id)}`} alt="Tu QR" className="w-full h-full object-contain rounded-lg" />
                </div>
              </div>
            </div>
            
            <OracleInsightCard role="owner" data={{ topProduct: "Combo Kreatek" }} />
          </div>
        )}

        {activeTab === 'config' && <StorefrontCustomizer client={clientInfo} updateStoreSettings={updateStoreSettings} />}

        {/* ===== OPEN / CLOSE TOGGLE + DELIVERY CONFIG ===== */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Open / Close */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 p-6 flex flex-col gap-4">
              <h4 className="font-black text-sky-950 flex items-center gap-2"><Store size={20} className="text-sky-500" /> Estado del Negocio</h4>
              <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-2xl p-4">
                <div>
                  <p className="font-black text-sm text-sky-950">{clientInfo.isOpen !== false ? '🟢 Abierto' : '🔴 Cerrado'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tus clientes verán este estado en tu tienda</p>
                </div>
                <button
                  onClick={() => toggleBusinessOpen(currentUser.id)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${clientInfo.isOpen !== false ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${clientInfo.isOpen !== false ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Horario de Atención</p>
                {['Lun-Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 w-14">{day}</span>
                    <input type="time" defaultValue="08:00" className="bg-white border border-sky-200 shadow-sm rounded-lg px-2 py-1 text-xs flex-1 text-sky-950" />
                    <span className="text-xs text-slate-400">–</span>
                    <input type="time" defaultValue="18:00" className="bg-white border border-sky-200 shadow-sm rounded-lg px-2 py-1 text-xs flex-1 text-sky-950" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery zone */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 p-6 flex flex-col gap-4">
              <h4 className="font-black text-sky-950 flex items-center gap-2"><Truck size={20} className="text-emerald-500" /> Zona de Delivery</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Radio máximo: <span className="text-emerald-500">{deliveryRadiusKm} km</span>
                  </label>
                  <input
                    type="range" min={1} max={30} value={deliveryRadiusKm}
                    onChange={e => setDeliveryRadiusKm(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                    <span>1 km</span><span>15 km</span><span>30 km</span>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 font-bold">
                  📦 Solo se aceptarán pedidos dentro de {deliveryRadiusKm} km del negocio.
                </div>
                <button
                  onClick={() => updateBusinessConfig(currentUser.id, { deliveryRadiusKm })}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black hover:scale-105 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all text-sm cursor-pointer border-none"
                >
                  Guardar Configuración de Zona
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && <FiscalPrinterSetupWidget />}

        {activeTab === 'personal' && <RecruitmentWidget db={db} currentUser={currentUser} formatUSD={formatUSD} />}

        {/* Manuals Section for Client (Owner) */}
        {activeTab === 'resumen' && (
          <div className="bg-gradient-to-r from-sky-950 to-sky-900 text-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-900/20 relative overflow-hidden border border-sky-800">
            <h3 className="text-xl font-black mb-6">Centro de Aprendizaje (Dueño de Negocio)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setActiveManual('owner')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                <BookOpen size={32} className="text-sky-300" />
                <span className="font-bold text-sm">Manual de Uso del Sistema</span>
              </button>
              <button onClick={() => setActiveManual('benefits')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                <Star size={32} className="text-amber-400" />
                <span className="font-bold text-sm">Whitepaper de Beneficios {KFS_BRAND.productAcronym}</span>
              </button>
              <a href="/presentacion_kan_cgos.pdf" download="presentacion_kan_cgos.pdf" className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10 no-underline text-white text-center">
                <FileText size={32} className="text-emerald-400" />
                <span className="font-bold text-sm">Presentación KAN CGOS (PDF)</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {activeTab === 'inventario' && (
            <>
              <button onClick={() => setShowAddModal(true)} className="bg-white border border-sky-100 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 hover:shadow-2xl hover:shadow-sky-300/50 flex flex-col items-center justify-center gap-5 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center border border-sky-200">
                  <Package size={32} className="text-sky-600" />
                </div>
                <span className="font-black text-lg text-sky-950">Subir Producto</span>
              </button>

              <div className="bg-white border border-sky-100 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 hover:shadow-2xl hover:shadow-sky-300/50 flex flex-col items-center justify-center gap-5 transition-all relative overflow-hidden">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} className="hidden" />
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                  <DownloadCloud size={32} className="text-emerald-500" />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="font-black text-lg text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer text-center leading-tight">Importar Inventario<br /><span className="text-xs font-bold text-slate-400">Desde Excel/CSV</span></button>
              </div>

              <button onClick={() => setShowTicketModal(true)} className="bg-gradient-to-br from-sky-600 to-sky-700 text-white p-8 rounded-[2rem] shadow-xl shadow-sky-600/30 border-none hover:shadow-2xl hover:shadow-sky-600/40 flex flex-col items-center justify-center gap-5 transition-all relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-white/5 animate-pulse group-hover:bg-white/10 transition-colors"></div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center relative z-10">
                  <Bell size={32} className="text-white" />
                </div>
                <span className="font-black text-lg text-white relative z-10">Help Desk (Tickets)</span>
              </button>
            </>
          )}
        </div>

        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 h-full">
              <h3 className="font-black text-xl text-sky-950 mb-6 flex items-center gap-2"><TrendingUp className="text-sky-500" /> Rendimiento de Ventas</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clientChartData}>
                    <defs>
                      <linearGradient id="colorClientSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={10} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e0f2fe', boxShadow: '0 10px 15px -3px rgba(186, 230, 253, 0.5)' }} />
                    <Area type="monotone" dataKey="amount" stroke="#0284c7" strokeWidth={4} fill="url(#colorClientSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 h-full flex flex-col">
              <h3 className="text-xl font-black text-sky-950 mb-6 flex items-center gap-2"><Star className="text-amber-400" /> Productos Estrella</h3>
              <div className="space-y-4">
                {myProducts.slice(0, 4).map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-sky-50 border border-sky-100 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-sky-200 text-sky-700 font-black h-8 w-8 rounded-full flex items-center justify-center">#{i + 1}</div>
                      <span className="font-bold text-sky-950">{p.name}</span>
                    </div>
                    <span className="font-black text-sky-600">{formatUSD(p.priceUSD)}</span>
                  </div>
                ))}
                {myProducts.length === 0 && <p className="text-slate-400 text-sm font-bold">Aún no hay productos.</p>}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'resumen' && (
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-600/30 relative overflow-hidden border border-sky-500 h-full">
              <h3 className="font-black text-xl mb-2 flex items-center gap-2"><Activity className="text-sky-200" /> Kreatek Insights (IA)</h3>
              <p className="text-xs text-sky-200 mb-6">Motor de predicción de inventario activo.</p>
              <div className="space-y-4">
                <div className="bg-white/20 border border-white/20 rounded-xl p-4 flex gap-4 shadow-sm">
                  <span className="text-2xl">🤖</span>
                  <p className="text-sm text-white">He analizado tus productos estrella. Te sugiero aumentar un 5% el precio del producto top 1, la rotación soporta el margen.</p>
                </div>
                <div className="bg-white/20 border border-white/20 rounded-xl p-4 flex gap-4 shadow-sm">
                  <span className="text-2xl">⚡</span>
                  <p className="text-sm text-white">Tus ventas en horario matutino cayeron un 12%. Te sugiero lanzar un SMS Push "Oferta Mañanera" desde {KFS_BRAND.modules.marketplace}.</p>
                </div>
              </div>
            </div>
        )}

        {activeTab === 'resumen' && (
            <UniversalWalletWidget currentUser={clientInfo} formatUSD={formatUSD}>
              <div className="flex flex-col gap-4 mt-2">
                <p className="text-xs text-gray-400 mb-2">Suscripción SaaS Activa: $6/mes. Próximo cobro: {new Date(clientInfo.subscription?.nextBillingDate).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Monto $USD" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-gray-500" />
                  <button onClick={() => { if (fundAmount) { setIsTopUpOpen(true); } }} className="w-1/2 bg-emerald-500 text-white font-black rounded-xl cursor-pointer hover:scale-105 shadow-[0_5px_15px_rgba(16,185,129,0.3)] transition-transform border-none text-xs">Recargar Saldo</button>
                  <TopUpModal
                    isOpen={isTopUpOpen}
                    onClose={() => setIsTopUpOpen(false)}
                    amount={fundAmount}
                    setAmount={setFundAmount}
                    onSubmit={(amount: number, ref: string, img: string) => {
                      requestTopUp(currentUser.id, 'client', amount, ref, img);
                    }}
                    userType="client"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowPayoutModal(true)} className="w-1/2 bg-white/10 text-white font-black py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-colors border border-white/10 text-xs">Retirar Fondos</button>
                  <button onClick={() => processMonthlyBilling(currentUser.id)} className="w-1/2 bg-red-500/20 text-red-400 font-bold py-2 rounded-xl border border-red-500/30 text-[10px] cursor-pointer hover:bg-red-500/30">Simular Cobro</button>
                </div>
              </div>
            </UniversalWalletWidget>
        )}

        {activeTab === 'personal' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 w-full">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2"><Users className="text-sky-500" /> Control de Empleados</h3>
              <div className="flex gap-4">
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar vendedor..." className="w-full bg-sky-50 border border-sky-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder:text-slate-400" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
                </div>
                <button onClick={() => setShowAddVendedor(true)} className="text-sm font-bold text-white bg-sky-900 px-4 py-2 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer">+ Añadir Vendedor</button>
              </div>
            </div>
            <div className="space-y-3">
              {myVendedores.filter((v: any) => v.name?.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email?.toLowerCase().includes(searchVendedor.toLowerCase())).map((v: any) => (
                <div key={v.id} className="flex justify-between items-center p-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <div className="flex items-center gap-3">
                    {v.avatar ? (
                      <img src={v.avatar} className="w-10 h-10 rounded-full object-cover border border-sky-200" alt="Avatar" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center border border-sky-200">
                        {v.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-sky-950">{v.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{v.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">Activo</span>
                    <button onClick={() => setShowPayrollModal(v)} className="bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                      Liquidar Nómina
                    </button>
                  </div>
                </div>
              ))}
              {myVendedores.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Sin empleados. Añada vendedores para usar los terminales móviles.</p>}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-bl-[100px] -z-10"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2"><DollarSign className="text-sky-600" /> Datos Oficiales de Liquidación {KFS_BRAND.productAcronym}</h3>
              <span className="bg-sky-50 text-sky-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-sky-100">Transferencia Directa</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Entidad Bancaria</span>
                <span className="font-black text-sm text-sky-950">Banco Nacional de Crédito (BNC)</span>
              </div>
              <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Teléfono (Pago Móvil)</span>
                <span className="font-mono font-bold text-sm text-sky-950">0412-7740041</span>
              </div>
              <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cédula de Identidad</span>
                <span className="font-mono font-bold text-sm text-sky-950">V-25.218.648</span>
              </div>
            </div>
          </div>
        )}

        {/* Widget de Cierre y Publicidad para el Dueño */}
        {activeTab === 'resumen' && (
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-sky-900/40 relative overflow-hidden border border-sky-800 animate-fade-in w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10">

              {/* Columna 1: Liquidación Obligatoria al Cierre */}
              <div className="flex-1 flex flex-col justify-between p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                <div className="space-y-2">
                  <span className="text-sky-300 text-[10px] font-black uppercase tracking-widest block font-mono">Cierre de Caja & Liquidación</span>
                  <h3 className="text-xl font-black text-white">Pago Requerido al Cierre</h3>
                  <p className="text-xs text-sky-200/70 leading-relaxed">
                    Para habilitar la sincronización en la nube de tu terminal el día de mañana, debes liquidar tu balance de comisiones BOS de la jornada actual.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-sky-300 block font-bold">TOTAL A REPORTAR:</span>
                    <span className="text-3xl font-black text-rose-400 font-mono">{formatUSD(currentUser.kfsFeesOwedUSD || 0)}</span>
                  </div>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/584127740041?text=Hola Kreatek, soy el local *${currentUser.company}*. Adjunto comprobante de pago de BOS diario correspondiente a la deuda de *${formatUSD(currentUser.kfsFeesOwedUSD || 0)}*.`, '_blank');
                      window.dispatchEvent(new CustomEvent('kfs-payment-alert', { detail: { company: currentUser.company, amount: currentUser.kfsFeesOwedUSD } }));
                      showToast(`Abriendo WhatsApp y notificando a ${KFS_BRAND.productAcronym} Core...`, "success");
                    }}
                    className="bg-sky-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-sky-600/30 hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    <CheckCircle size={14} /> Reportar Pago
                  </button>
                </div>
              </div>

              {/* Columna 2: Inversión en Publicidad del Día Siguiente */}
              <div className="flex-1 flex flex-col justify-between p-6 bg-emerald-950/40 rounded-2xl border border-emerald-500/20 relative">
                <div className="space-y-2">
                  <span className="text-emerald-300 text-[10px] font-black uppercase tracking-widest block font-mono">Plan de Tracción de Tráfico</span>
                  <h3 className="text-xl font-black text-white">Inversión en Publicidad {KFS_BRAND.productAcronym}</h3>
                  <p className="text-xs text-emerald-200/70 leading-relaxed">
                    El oráculo de {KFS_BRAND.productAcronym} OS reinyecta automáticamente el **20% de tu tarifa BOS diaria** en campañas de publicidad geolocalizada mañana.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-bold">PRESUPUESTO ASIGNADO PARA MAÑANA:</span>
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      {formatUSD((currentUser.kfsFeesOwedUSD || 0) * 0.20)}
                    </span>
                  </div>
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Tráfico Garantizado
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'config' && <KFSIoTEdgeConsole showToast={showToast} />}

        {/* Vales & Créditos Widget */}
        {activeTab === 'personal' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 space-y-6">
            <div className="flex justify-between items-center border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2 text-sky-600">
                🎫 Vales y Créditos Digitales
              </h3>
              <span className="bg-sky-50 border border-sky-100 text-sky-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Conciliación Automática
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emitir Vale Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-sky-100 space-y-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">Emitir Nuevo Vale / Crédito</span>
                <form onSubmit={e => {
                  e.preventDefault();
                  const target = e.target as any;
                  const recipientName = target.recipient.value;
                  const type = target.type.value;
                  const amountUSD = parseFloat(target.amount.value);
                  const surchargePct = parseFloat(target.surcharge.value);
                  const dueDate = target.dueDate.value;

                  createVale({
                    recipientName,
                    type,
                    amountUSD,
                    surchargePct,
                    dueDate
                  });

                  target.reset();
                }} className="space-y-3">
                  <input required name="recipient" placeholder="Telf. Cliente CRM o Nombre Vendedor" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-sky-950 focus:outline-none" />
                  <select name="type" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-sky-950 focus:outline-none font-bold">
                    <option value="credito_cliente">Crédito a Cliente (CRM)</option>
                    <option value="adelanto_nomina">Adelanto de Nómina</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="number" step="0.01" name="amount" placeholder="Monto ($)" className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-sky-950 focus:outline-none" />
                    <select name="surcharge" className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-sky-950 focus:outline-none font-bold">
                      <option value="0.00">Sin Recargo</option>
                      <option value="0.03">Recargo 3%</option>
                      <option value="0.05">Recargo 5%</option>
                      <option value="0.08">Recargo 8%</option>
                      <option value="0.10">Recargo 10%</option>
                    </select>
                  </div>
                  <input required type="date" name="dueDate" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-sky-950 focus:outline-none font-mono" />
                  <button type="submit" className="w-full py-3 bg-sky-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                    Emitir Vale Criptográfico &rarr;
                  </button>
                </form>
              </div>

              {/* List of active Vales */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">Gobernanza de Cuentas y Adelantos Pendientes</span>
                <div className="overflow-x-auto max-h-60 border border-sky-100 rounded-xl bg-slate-50/50 p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-sky-50 text-slate-500 uppercase text-[9px] font-black sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-lg border-b border-sky-100">Vale / Beneficiario</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Tipo</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Vencimiento</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Total Adeudado</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg border-b border-sky-100">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(db.vales || []).map((v: any) => (
                        <tr key={v.id} className="border-b border-sky-100/50 hover:bg-white transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-black text-sky-950 block">{v.id}</span>
                            <span className="text-[10px] text-slate-500 font-bold block">{v.recipientName}</span>
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-600">
                            {v.type === "adelanto_nomina" ? "💼 Nómina" : "🛍️ Cliente"}
                          </td>
                          <td className="py-3 px-2 font-mono text-slate-500">{v.dueDate}</td>
                          <td className="py-3 px-2">
                            <span className="font-black text-rose-500">{formatUSD(v.totalDueUSD)}</span>
                            {v.surchargePct > 0 && <span className="text-[9px] text-amber-500 font-bold block">Recargo: +{v.surchargePct * 100}%</span>}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {v.status === "pending" ? (
                              <button onClick={() => {
                                const payAmount = parseFloat(prompt("Ingrese el monto del abono en USD ($):", v.totalDueUSD.toFixed(2)) || "0");
                                if (payAmount > 0) {
                                  payVale(v.id, payAmount);
                                }
                              }} className="bg-emerald-100 text-emerald-700 font-black px-2.5 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer border border-emerald-200">
                                Abonar
                              </button>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 font-black px-2 py-1 rounded uppercase tracking-wider text-[8px] border border-slate-200">Cancelado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(db.vales || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400 font-bold">No hay vales ni créditos pendientes registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Lógica Empresarial / Analítica */}
        {activeTab === 'resumen' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 space-y-6">
            <div className="flex justify-between items-center border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2">
                📊 Inteligencia de Mercado y Metas {KFS_BRAND.productAcronym}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sky-900 text-white p-6 rounded-2xl border border-sky-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
                <h4 className="text-[10px] font-black uppercase text-sky-300 mb-2 font-mono">Caja & Ganancias Disponibles</h4>
                <p className="text-3xl font-black mb-1">${formatUSD(currentUser.salesUSD || 0)} <span className="text-sm font-light text-sky-200/70">/ $1,000</span></p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4 mb-4">
                  <div className="bg-sky-400 h-full" style={{ width: `${Math.min(100, ((currentUser.salesUSD || 0) / 1000) * 100)}%` }} />
                </div>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                >
                  Solicitar Retiro
                </button>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-sky-100">
                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 font-mono">Categorías Fuertes</h4>
                <ul className="space-y-2 mt-4 text-sm font-bold text-sky-950">
                  <li className="flex justify-between items-center"><span>Alimentos</span> <span className="text-sky-600">74%</span></li>
                  <li className="flex justify-between items-center"><span>Bebidas</span> <span className="text-sky-600">20%</span></li>
                  <li className="flex justify-between items-center"><span>Limpieza</span> <span className="text-sky-600">6%</span></li>
                </ul>
              </div>
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                <h4 className="text-[10px] font-black uppercase text-rose-500 mb-2 font-mono">Fuga de Capital Detectada</h4>
                <p className="text-xs text-rose-700 mt-2">{KFS_BRAND.productAcronym} Oracle™ ha detectado que no tienes productos en la categoría <strong>'Higiene Personal'</strong>. Estás perdiendo aproximadamente un 15% de ventas combinadas ante tu competencia local.</p>
                <button className="mt-4 text-xs font-black text-rose-600 hover:underline uppercase tracking-wider cursor-pointer">Poblar Catálogo →</button>
              </div>
            </div>
          </div>
        )}

        {/* Bóveda {KFS_BRAND.productAcronym} (Métodos de Pago del Dueño) */}
        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 space-y-6">
            <div className="flex justify-between items-center border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2">
                🏦 Bóveda Financiera (Métodos de Cobro)
              </h3>
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Verificados
              </span>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const target = e.target as any;
              updatePaymentMethods(currentUser.id, {
                zinli: target.zinli.value,
                wallyTech: target.wallyTech.value,
                airtm: target.airtm.value,
                ubbiApp: target.ubbiApp.value,
                pagoMovilPhone: target.pMovilPhone.value,
                pagoMovilId: target.pMovilId.value,
                pagoMovilBank: target.pMovilBank.value,
                binance: target.binance.value
              });
            }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono block">Zinli (Email)</label>
                <input name="zinli" defaultValue={currentUser.paymentMethods?.zinli || ""} placeholder="correo@zinli.com" className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono block">Wally Tech</label>
                <input name="wallyTech" defaultValue={currentUser.paymentMethods?.wallyTech || ""} placeholder="Usuario o Teléfono" className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono block">AirTM</label>
                <input name="airtm" defaultValue={currentUser.paymentMethods?.airtm || ""} placeholder="correo@airtm.com" className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono block">Ubbi App</label>
                <input name="ubbiApp" defaultValue={currentUser.paymentMethods?.ubbiApp || ""} placeholder="Usuario Ubbi" className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono block">Binance Pay (Pay ID)</label>
                <input name="binance" defaultValue={currentUser.paymentMethods?.binance || ""} placeholder="ID de Binance" className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="space-y-2 border border-sky-100 p-4 rounded-xl bg-slate-50">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-2 block">Pago Móvil</label>
                <input name="pMovilBank" defaultValue={currentUser.paymentMethods?.pagoMovilBank || ""} placeholder="Banco (Ej. Banesco 0134)" className="w-full bg-white border border-sky-100 shadow-sm rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 mb-2 placeholder:text-slate-400" />
                <input name="pMovilPhone" defaultValue={currentUser.paymentMethods?.pagoMovilPhone || ""} placeholder="Teléfono" className="w-full bg-white border border-sky-100 shadow-sm rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 mb-2 placeholder:text-slate-400" />
                <input name="pMovilId" defaultValue={currentUser.paymentMethods?.pagoMovilId || ""} placeholder="Cédula/RIF" className="w-full bg-white border border-sky-100 shadow-sm rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-sky-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 shadow-md">Guardar en Bóveda Criptográfica</button>
              </div>
            </form>
          </div>
        )}

        {/* Gobernanza de Puntos de Venta (Multi-POS Integrado) */}
        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 space-y-6">
            <div className="flex justify-between items-center border-b border-sky-100 pb-4">
              <h3 className="font-black text-xl text-sky-950 flex items-center gap-2 text-sky-600">
                🔌 Gobernanza de Puntos de Venta (Multi-POS Integrado)
              </h3>
              <span className="bg-sky-50 border border-sky-100 text-sky-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Sincronización Directa PCI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Formulario de Registro/Enlace POS */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-sky-100 space-y-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">Enlazar y Certificar POS Físico</span>
                <form onSubmit={e => {
                  e.preventDefault();
                  const target = e.target as any;
                  const name = target.posName.value;
                  const connectionType = target.connectionType.value;
                  const connectionInfo = target.connectionInfo.value;
                  const assignedVendedorId = target.assignedVendedorId.value || null;

                  registerPosTerminal({
                    name,
                    connectionType,
                    connectionInfo,
                    assignedVendedorId,
                    clientId: currentUser.id
                  });

                  target.reset();
                }} className="space-y-3">
                  <input required name="posName" placeholder="Nombre POS (Ej: Pax A920 - Caja 1)" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-sky-950 focus:outline-none" />

                  <div className="grid grid-cols-2 gap-2">
                    <select name="connectionType" className="w-full bg-white border border-sky-200 rounded-xl px-2 py-2.5 text-[10px] text-sky-950 focus:outline-none font-bold">
                      <option value="TCP_IP">Red Local (IP)</option>
                      <option value="SERIAL">Puerto COM (Serial)</option>
                    </select>
                    <input required name="connectionInfo" placeholder="IP (192...) o COM3" className="w-full bg-white border border-sky-200 rounded-xl px-2 py-2.5 text-[10px] text-sky-950 focus:outline-none font-mono" />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Cajero Asignado</label>
                    <select name="assignedVendedorId" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-sky-950 focus:outline-none font-bold">
                      <option value="">Sin Asignar</option>
                      {myVendedores.map((v: any) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="w-full py-3 bg-sky-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                    ⚡ Conectar POS Integrado &rarr;
                  </button>
                </form>
              </div>

              {/* Listado de POS enlazados y telemetría en vivo */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">Telemetría y Facturación Real por Punto</span>
                <div className="overflow-x-auto max-h-60 border border-sky-100 rounded-xl bg-slate-50/50 p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-sky-50 text-slate-500 uppercase text-[9px] font-black sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-lg border-b border-sky-100">POS Físico / Canal</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Cajero</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Telemetría</th>
                        <th className="py-2.5 px-2 border-b border-sky-100">Facturación Real</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg border-b border-sky-100">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).map((p: any) => {
                        const vendedor = myVendedores.find((v: any) => v.id === p.assignedVendedorId);
                        return (
                          <tr key={p.id} className="border-b border-sky-100/50 hover:bg-white transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-bold text-sky-950 block">{p.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono block uppercase">ID: {p.id} | {p.connectionType}: {p.connectionInfo}</span>
                            </td>
                            <td className="py-3 px-2 font-bold text-slate-600">
                              {vendedor ? (
                                <span className="flex items-center gap-1.5 text-sky-950">
                                  <UserCheck size={12} className="text-sky-600" /> {vendedor.name}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">No Asignado</span>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-black text-[8px] uppercase tracking-wider border border-emerald-200">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                Conectado
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-black text-emerald-600 block">{formatUSD(p.totalAmountUSD || 0)}</span>
                              <span className="text-[9px] text-slate-400 font-bold block">{p.transactionsCount || 0} TXs Directas</span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  deletePosTerminal(p.id);
                                }}
                                className="text-[9px] bg-rose-50 hover:bg-rose-100 text-rose-600 font-black px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-rose-200"
                              >
                                Retirar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400 font-bold">No hay puntos de venta integrados en este local comercial.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <div className="space-y-6">
            {(myOrders.length > 0 || myPendingDispatch.length > 0) && (
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-amber-200 bg-amber-50/30">
                <h3 className="font-black text-xl text-sky-950 mb-6 flex items-center gap-2 text-amber-600">
                  <Clock className="text-amber-500" /> Órdenes Online ({myOrders.length} por validar, {myPendingDispatch.length} por despachar)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna Izquierda: Lista de Órdenes */}
                  <div className="lg:col-span-2 space-y-4">
                    {myOrders.map((order: any) => {
                      const product = db.products.find((p: any) => p.id === order.productId);
                      return (
                        <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-2xl border border-amber-100 shadow-sm gap-4 animate-fade-in">
                          <div>
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Pendiente</span>
                            <h4 className="font-bold text-sky-950">{product?.name || "Producto Desconocido"}</h4>
                            <p className="text-sm text-slate-500 font-mono mt-1">Ref: <span className="font-bold text-slate-900">{order.paymentReference}</span> | Método: {order.paymentMethod}</p>
                            {order.customerName && (
                              <p className="text-xs text-slate-600 font-bold mt-1">
                                Cliente: {order.customerName} {order.customerRif && `(${order.customerRif})`}
                              </p>
                            )}
                            {order.paymentScreenshot && (
                              <button
                                onClick={() => setActiveScreenshot(order.paymentScreenshot)}
                                className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-black px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                🖼️ Ver Capture
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="text-right flex-1 md:flex-none">
                              <p className="font-black text-lg text-emerald-600">{formatUSD(order.amountUSD)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => rejectOrder(order.id)} className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors cursor-pointer" title="Rechazar y devolver stock"><X size={20} /></button>
                              <button onClick={() => approveOrder(order.id)} className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={20} /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Columna Centro: Órdenes por Despachar */}
                  {myPendingDispatch.length > 0 && (
                    <div className="lg:col-span-2 space-y-4 mt-8 lg:mt-0 lg:border-t-0 border-t border-amber-100 pt-8 lg:pt-0">
                      <h4 className="font-bold text-sky-950 mb-4 flex items-center gap-2">
                        <Package className="text-sky-500" /> Listo para Empacar / Despachar ({myPendingDispatch.length})
                      </h4>
                      {myPendingDispatch.map((tx: any) => {
                        const product = db.products.find((p: any) => p.id === tx.productId);
                        const assignedRider = tx.assignedRiderId ? db.riders?.find((r: any) => r.id === tx.assignedRiderId) : null;
                        return (
                          <div key={tx.id} className="flex flex-col p-5 bg-sky-50 rounded-2xl border border-sky-100 shadow-sm gap-4 animate-fade-in">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <span className="bg-sky-200 text-sky-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Pago Aprobado</span>
                                <h4 className="font-bold text-sky-950">{product?.name || "Producto Desconocido"}</h4>
                                <p className="text-sm text-slate-600 font-mono mt-1">Teléfono: <span className="font-bold">{tx.customerPhone}</span></p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { dispatchOrder(tx.id); assignDeliveryToOrder(tx.id, currentUser.id); }} className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-sm">
                                  <Truck size={16} /> Despachar + Asignar Rider
                                </button>
                              </div>
                            </div>
                            {assignedRider && (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mb-1">🛵 Rider Asignado — El cliente paga $2 directamente</p>
                                <p className="font-bold text-sm text-sky-950">{assignedRider.name}</p>
                                {assignedRider.pagoMovil?.banco && (
                                  <p className="text-xs text-slate-600 mt-0.5">💳 {assignedRider.pagoMovil.banco} · {assignedRider.pagoMovil.telefono} · CI {assignedRider.pagoMovil.cedula}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* My Riders Section */}
                      {(() => {
                        const myRiders = (db.riders || []).filter((r: any) => (r.associatedBusinesses || []).includes(currentUser.id));
                        const availableRiders = (db.riders || []).filter((r: any) => r.status === "approved" && !(r.associatedBusinesses || []).includes(currentUser.id) && (r.associatedBusinesses || []).length < 2);
                        return (
                          <div className="bg-white border border-sky-100 rounded-2xl p-5 mt-4">
                            <h4 className="font-black text-sky-950 text-sm mb-3 flex items-center gap-2">
                              <Truck size={16} className="text-sky-500" /> Mis Riders ({myRiders.length}/2)
                            </h4>
                            {myRiders.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No tienes riders asignados. Añade un rider aprobado abajo.</p>
                            ) : (
                              <div className="space-y-2 mb-3">
                                {myRiders.map((r: any) => (
                                  <div key={r.id} className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-xl p-3">
                                    <div>
                                      <p className="font-black text-sm text-sky-950">{r.name}</p>
                                      <p className="text-[10px] text-slate-500">{r.pagoMovil?.banco ? `PM: ${r.pagoMovil.banco}` : "Sin Pago Móvil"}</p>
                                    </div>
                                    <button onClick={() => removeRiderFromBusiness(r.id, currentUser.id)} className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100">Quitar</button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {myRiders.length < 2 && availableRiders.length > 0 && (
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Riders disponibles para asignar:</p>
                                <div className="space-y-1">
                                  {availableRiders.slice(0, 5).map((r: any) => (
                                    <button key={r.id} onClick={() => assignRiderToBusiness(r.id, currentUser.id)} className="w-full text-left px-3 py-2 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 hover:border-sky-200 transition-colors cursor-pointer placeholder:text-slate-400">
                                      <span className="font-bold text-sm text-sky-950">{r.name}</span>
                                      <span className="text-[10px] text-slate-500 ml-2">{r.email}</span>
                                      <span className="float-right text-[10px] text-sky-600 font-black">+ Añadir</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Columna Derecha: Conciliador SMS Real */}
                  <div className="bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-800 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl shadow-sky-900/40 flex flex-col justify-between text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-sky-800 border border-sky-700 text-sky-400">
                          <Bell size={20} className="animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm tracking-wide text-white">CONCILIADOR SMS</h4>
                          <p className="text-[9px] text-sky-400 font-mono uppercase tracking-widest">Tecnología Inteligente {KFS_BRAND.productAcronym}</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-sky-200/70 mb-4 leading-relaxed">
                        Pega el SMS de Pago Móvil, Zinli o AirTM. El motor {KFS_BRAND.productAcronym} extraerá la referencia y el monto para conciliar y liberar la orden al instante sin intervención manual.
                      </p>

                      <textarea
                        placeholder="Pega el mensaje de texto bancario recibido aquí..."
                        value={smsInput}
                        onChange={(e) => setSmsInput(e.target.value)}
                        className="w-full h-24 bg-black/20 border border-sky-800 rounded-xl p-3 text-xs font-mono text-sky-100 focus:outline-none focus:border-sky-500 placeholder:text-sky-700 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleManualSmsConciliation}
                      className="w-full mt-4 py-3 rounded-xl font-black text-xs text-white bg-sky-600 hover:bg-sky-500 border-none transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Conciliar SMS Real
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100">
              <h3 className="font-black text-xl text-sky-950 mb-6 flex items-center gap-2">Registro de Egresos Operativos</h3>
              <div className="space-y-3">
                {myExpenses.map((e: any) => (
                  <div key={e.id} className="flex justify-between items-center p-4 bg-sky-50 rounded-2xl border border-sky-100">
                    <span className="font-bold text-sky-950">{e.description}</span>
                    <span className="text-rose-500 font-black">-{formatUSD(e.amountUSD)}</span>
                  </div>
                ))}
                {myExpenses.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No hay egresos registrados.</p>}
              </div>
            </div>

            {/* Módulos Fase 15 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Low Stock Widget */}
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-rose-100 bg-rose-50/20">
                <h3 className="font-black text-xl text-sky-950 mb-6 flex items-center gap-2 text-rose-500">
                  <Activity className="text-rose-500" /> Alertas de Inventario
                </h3>
                <div className="space-y-3">
                  {lowStockProducts.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-sky-950">{p.name} <span className="text-[10px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full ml-2">Alerta Verde</span></span>
                        <span className="text-xs text-rose-500 font-black">{p.stock} unidades restantes</span>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/?text=Hola,%20necesito%20reabastecer:%20${p.name}`, '_blank')} className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer">Reabastecer</button>
                    </div>
                  ))}
                  {stagnantProducts.map((p: any) => (
                    <div key={`stg-${p.id}`} className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-sky-950">{p.name} <span className="text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full ml-2">Alerta Roja</span></span>
                        <span className="text-xs text-rose-500 font-black">Estancado (&gt;15 días sin ventas)</span>
                      </div>
                      <button onClick={() => showToast(`Iniciando campaña de Retargeting forzado para ${p.name}...`)} className="text-xs font-bold bg-rose-600 text-white px-3 py-2 rounded-lg hover:bg-rose-700 transition-colors cursor-pointer">Forzar Descuento</button>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && stagnantProducts.length === 0 && <p className="text-sm text-slate-400 font-bold">El inventario está estable.</p>}
                </div>
              </div>

              {/* CRM Widget */}
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="font-black text-xl text-sky-950 flex items-center gap-2 text-sky-600">
                    <Users className="text-sky-600" /> Clientes Frecuentes (CRM)
                  </h3>
                  <div className="flex items-center gap-3 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">
                    <span className="text-xs font-bold text-slate-600">Programa Fidelidad {KFS_BRAND.productAcronym}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={currentUser.loyaltyProgramActive || false} onChange={e => toggleLoyaltyProgram(currentUser.id, e.target.checked)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  {myCrm.map((c: any) => (
                    <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-sky-50 rounded-2xl border border-sky-100 gap-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sky-950 font-mono">{c.phone} {c.name && <span className="text-slate-500 font-sans font-medium text-xs ml-1">({c.name})</span>}</span>
                        <span className="text-xs text-slate-500">{c.purchasesCount} compras registradas</span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-emerald-600 font-black block">{formatUSD(c.totalSpent)}</span>
                          {c.kfsPoints > 0 && <span className="text-[10px] font-bold text-sky-600 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">{c.kfsPoints.toFixed(1)} Pts</span>}
                        </div>
                        <a
                          href={`https://wa.me/58${c.phone.replace(/^0+/, '').replace(/[^0-9]/g, '')}?text=Hola ${c.name || ''}, ¡Te extrañamos en ${currentUser.company}! 🎁 Tienes puntos acumulados por tus compras.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-sky-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center"
                          title="Re-Marketing (WhatsApp)"
                        >
                          <Users size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                  {myCrm.length === 0 && <p className="text-sm text-slate-400 font-bold">Sin clientes registrados con teléfono.</p>}
                </div>
              </div>
            </div>

            {/* Z-Reports Widget */}
            {myZReports.length > 0 && (
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100">
                <h3 className="font-black text-xl text-sky-950 mb-6 flex items-center gap-2">
                  <Lock className="text-sky-950" /> Cortes de Caja (Reportes Z)
                </h3>
                <div className="space-y-3">
                  {myZReports.map((z: any) => {
                    const vendedor = myVendedores.find((v: any) => v.id === z.vendedorId);
                    return (
                      <div key={z.id} className="flex justify-between items-center p-5 bg-sky-50 rounded-2xl border border-sky-100">
                        <div className="flex flex-col">
                          <span className="font-black text-sky-950 uppercase tracking-wider text-sm">{vendedor?.name || "Vendedor"} - {new Date(z.timestamp).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-500">{z.txCount} transacciones procesadas</span>
                        </div>
                        <span className="font-black text-xl text-sky-950">{formatUSD(z.totalUSD)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-black text-xl text-sky-950 mb-6 pl-2">Inventario en {KFS_BRAND.modules.marketplace}</h3>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-4">
                {myProducts.map((p: any) => {
                  const hasCost = p.costUSD !== undefined && p.costUSD > 0;
                  const margin = hasCost ? ((p.priceUSD - p.costUSD) / p.priceUSD) * 100 : 0;
                  const recPrice = hasCost ? p.costUSD / 0.65 : 0;
                  const marginVulnerable = hasCost && p.priceUSD < recPrice - 0.01;

                  return (
                    <div key={p.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${marginVulnerable ? "border-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.05)]" : "border-sky-100"}`}>
                      <div className="aspect-square bg-slate-100 w-full overflow-hidden relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        {marginVulnerable && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse shadow-md">
                            ⚠️ Margen Vulnerado
                          </span>
                        )}
                        <button
                          onClick={() => toggleProductFeatured(p.id, !p.isFeatured)}
                          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
                          title={p.isFeatured ? "Quitar de Destacados" : "Marcar como Estrella"}
                        >
                          <Star size={16} className={p.isFeatured ? "fill-amber-400 text-amber-500" : "text-slate-400"} />
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm truncate text-sky-950 mb-0.5">{p.name}</h4>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.category || "General"}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-[10px] font-mono leading-tight">
                          <div className="flex flex-col text-slate-500">
                            <span>Precio:</span>
                            <span className="text-sky-600 font-black">{formatUSD(p.priceUSD)}</span>
                          </div>
                          <div className="flex flex-col text-slate-500 text-center">
                            <span>Costo:</span>
                            <span className="text-sky-950 font-bold">{hasCost ? formatUSD(p.costUSD) : "N/D"}</span>
                          </div>
                          <div className="flex flex-col text-slate-500 text-right">
                            <span>Margen:</span>
                            <span className={`font-black ${margin >= 35 ? "text-emerald-600" : margin > 0 ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>
                              {hasCost ? `${margin.toFixed(1)}%` : "N/D"}
                            </span>
                          </div>
                        </div>

                        {marginVulnerable && (
                          <div className="bg-rose-50/50 border border-rose-100 p-2 rounded-lg text-center space-y-1.5">
                            <p className="text-[9px] font-bold text-rose-600">Sugerido {KFS_BRAND.productAcronym}: <span className="font-black text-xs">{formatUSD(recPrice)}</span></p>
                            <button
                              onClick={() => shieldMargin(p.id, recPrice)}
                              className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow transition-colors cursor-pointer"
                            >
                              🛡️ Blindar Margen
                            </button>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-1 border-t border-sky-100 mt-2">
                          <div>
                            <p className="text-sky-950 font-black text-sm">{formatUSD(p.priceUSD)}</p>
                            <p className="text-[10px] font-bold text-slate-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                            {p.stock && p.stock > 0 ? `${p.stock} unids` : "Agotado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {myProducts.length === 0 && <div className="col-span-2 md:col-span-4 text-center py-10 bg-white rounded-2xl text-slate-400 font-bold">Catálogo vacío.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Modal Agregar Producto */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-sky-950">Nuevo Producto</h3>
              <form onSubmit={submitProduct} className="space-y-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({ ...newProd, barcode: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono text-sky-950 placeholder:text-slate-400" />
                  <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-sky-900 text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                    <Search size={18} />
                  </button>
                </div>
                <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400" />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Costo Insumo</label>
                    <input required type="number" step="0.01" placeholder="Costo ($)" value={newProd.cost} onChange={e => setNewProd({ ...newProd, cost: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-3 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Precio Venta</label>
                    <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-3 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-black text-sky-950 text-center placeholder:text-slate-400" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Stock</label>
                    <input required type="number" placeholder="Cant" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-3 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold text-sky-950 text-center placeholder:text-slate-400" />
                  </div>
                </div>
                <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold text-sky-950 placeholder:text-slate-400">
                  <option value="Alimentos">Alimentos y Bebidas</option>
                  <option value="Ropa y Calzado">Ropa y Calzado</option>
                  <option value="Tecnología">Tecnología y Electrónica</option>
                  <option value="Salud y Belleza">Salud y Belleza</option>
                  <option value="Hogar">Hogar y Muebles</option>
                  <option value="Servicios">Servicios Generales</option>
                </select>
                <textarea placeholder="Descripción del producto (Opcional)" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-sky-950 text-sm h-20 resize-none placeholder:text-slate-400" />
                <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 text-center hover:bg-sky-50 cursor-pointer relative transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {newProd.imgUrl ? (
                    <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera size={40} className="mb-3" />
                      <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-sky-100 font-bold text-sky-700 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/30 cursor-pointer">Publicar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Agregar Vendedor */}
        {showAddVendedor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-sky-950">Nuevo Empleado</h3>
              <form onSubmit={handleAddVendedor} className="space-y-4">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-sky-50 transition-colors group">
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64String = await compressImage(file, 200, 0.6);
                          setNewVendedor(prev => ({ ...prev, avatar: base64String }));
                        } catch (error) {
                          // ignore error or showToast if available in scope
                        }
                      }
                    }} />
                    {newVendedor.avatar ? (
                      <img src={newVendedor.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="text-center text-slate-400 group-hover:text-sky-600 transition-colors">
                        <Camera size={20} className="mx-auto" />
                        <span className="text-[7px] font-bold block mt-0.5">Foto</span>
                      </div>
                    )}
                  </label>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Foto del Empleado</span>
                </div>

                <input required type="text" placeholder="Nombre del Vendedor" value={newVendedor.name} onChange={e => setNewVendedor({ ...newVendedor, name: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sky-950 placeholder:text-slate-400" />
                <input required type="email" placeholder="Correo (Usuario de Acceso)" value={newVendedor.email} onChange={e => setNewVendedor({ ...newVendedor, email: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sky-950 placeholder:text-slate-400" />
                <input required type="password" placeholder="Clave de Acceso" value={newVendedor.password} onChange={e => setNewVendedor({ ...newVendedor, password: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sky-950 placeholder:text-slate-400" />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddVendedor(false)} className="w-1/3 py-3 rounded-xl bg-sky-100 font-bold text-sky-700 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-sky-900 shadow-lg cursor-pointer">Crear Acceso</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Agregar Gasto */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-sky-950">Registrar Gasto (Egreso)</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                addExpense({
                  description: newExpense.description,
                  amountUSD: parseFloat(newExpense.amountUSD) || 0,
                  clientId: currentUser.id
                });
                setNewExpense({ description: "", amountUSD: "" });
                setShowExpenseModal(false);
              }} className="space-y-4">
                <input required type="text" placeholder="Concepto (Ej. Alquiler, Proveedor)" value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sky-950 placeholder:text-slate-400" />
                <input required type="number" step="0.01" placeholder="Monto Total (USD)" value={newExpense.amountUSD} onChange={e => setNewExpense({ ...newExpense, amountUSD: e.target.value })} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sky-950 placeholder:text-slate-400" />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowExpenseModal(false)} className="w-1/3 py-3 rounded-xl bg-sky-100 font-bold text-sky-700 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-lg cursor-pointer">Descontar Saldo</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeManual && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white text-sky-950 rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-sky-900">
              <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-slate-500 hover:text-sky-950 transition-colors cursor-pointer bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                <X size={20} />
              </button>

              {activeManual === 'owner' && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-sky-600" size={28} /> Manual de Uso del Dueño</h2>
                  <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">1. ¿Qué es {KFS_BRAND.productAcronym} OS?</p>
                      <p>Es tu centro de comando. Desde aquí controlas tus ventas físicas, tu E-Commerce ({KFS_BRAND.modules.marketplace} {KFS_BRAND.modules.marketplace}), empleados e inventario en un solo lugar.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">2. Control de Inventario:</p>
                      <p>Usa la sección "Inventario" para cargar tus productos. Recomendamos usar código de barras reales (EAN/UPC) para que la búsqueda en caja sea instantánea.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">3. Control de Empleados (Vendedores):</p>
                      <p>Crea usuarios y contraseñas temporales para tus cajeros. Ellos accederán desde sus propios dispositivos o la PC de la tienda al panel de Caja Registradora.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">4. Liquidación y Tarifas:</p>
                      <p>Tus ganancias netas están en la cima de este panel. La deuda {KFS_BRAND.productAcronym} se calcula basada en tu tarifa operativa y debe ser cancelada en los datos de transferencia mostrados abajo.</p>
                    </div>
                  </div>
                </div>
              )}
              {activeManual === 'benefits' && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Star className="text-sky-600" size={28} /> Whitepaper de Beneficios {KFS_BRAND.productAcronym}</h2>
                  <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
                    <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl mb-4">
                      <p className="font-black text-sky-800 text-xs uppercase tracking-widest mb-1">El Ecosistema Financiero</p>
                      <p className="text-sky-700 text-xs">Ahorros masivos al eliminar software de terceros obsoleto.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">1. E-Commerce {KFS_BRAND.modules.marketplace} Gratuito:</p>
                      <p>Tu inventario está conectado en tiempo real al marketplace {KFS_BRAND.modules.marketplace}. Cualquier cliente puede comprar online con pago móvil, Zinli, AirTM, Ubbi, Wally o Binance Pay sin comisiones adicionales.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">2. Sincro-Shield Fiscal Gratuito:</p>
                      <p>No necesitas pagar licencias anuales a intermediarios. Nuestro proxy conecta tu PC directo a la impresora fiscal bajo las normativas del SENIAT.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-black text-sky-950 mb-1">3. Conciliación Automática SMS:</p>
                      <p>Si activas la función SMS, el sistema verificará pagos móviles entrantes de forma autónoma. Se acabaron los fraudes de capturas falsas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showTicketModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 space-y-4 shadow-2xl border border-sky-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-sky-950">Crear Ticket SOS</h3>
                <button onClick={() => setShowTicketModal(false)} className="hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors"><X size={20} className="text-slate-400" /></button>
              </div>
              <p className="text-xs text-slate-500 mb-2">Nuestro equipo técnico y tu promotora asignada recibirán este reporte inmediatamente.</p>
              <input type="text" placeholder="Asunto (Ej: Lector no lee)" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-sky-500 placeholder:text-slate-400" />
              <textarea placeholder="Describe el problema..." value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-sky-500 placeholder:text-slate-400" />
              <button onClick={() => { if (ticketSubject && ticketMsg) { createTicket(currentUser.id, ticketSubject, ticketMsg); setShowTicketModal(false); } }} className="w-full bg-rose-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50" disabled={!ticketSubject || !ticketMsg}>
                Enviar a Soporte Técnico
              </button>
            </div>
          </div>
        )}
        {activeScreenshot && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-sky-900 border border-sky-600/30 rounded-[2.5rem] w-full max-w-lg p-6 shadow-2xl relative flex flex-col items-center">
              <button onClick={() => setActiveScreenshot(null)} className="absolute top-6 right-6 text-sky-200 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-full">
                <X size={20} />
              </button>
              <h3 className="text-xl font-black text-sky-400 mb-4 text-center">Capture de Transacción</h3>
              <div className="w-full max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-2 flex justify-center items-center">
                <img src={activeScreenshot} alt="Transaction Capture" className="max-w-full h-auto rounded-xl object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* FIXED BOTTOM NAVIGATION */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-sky-100 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between gap-2 items-center relative">
            {[
              { id: "resumen", icon: Activity, label: "Resumen" },
              { id: "inventario", icon: Package, label: "Inventario" },
              { id: "personal", icon: Users, label: "Personal" },
              { id: "config", icon: Settings, label: "Ajustes" }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
                >
                  {isActive && <span className="absolute -top-4 w-12 h-1 bg-sky-500 rounded-b-full shadow-[0_4px_10px_rgba(56,189,248,0.5)]" />}
                  <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-sky-950' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-sky-950' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {showPayrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999] p-4">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-md w-full animate-scale-in border border-sky-100">
            <h3 className="text-xl font-black mb-1 flex items-center gap-2 text-sky-950"><DollarSign className="text-sky-500" /> Liquidación de Nómina</h3>
            <p className="text-xs text-slate-500 mb-6">Empleado: {showPayrollModal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Salario / Comisión Base ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input type="number" step="0.01" className="w-full bg-sky-50 border border-sky-100 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400" placeholder="0.00" value={payrollBaseSalary} onChange={(e) => setPayrollBaseSalary(e.target.value)} />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest block">Vales Pendientes por Descontar</span>
                {(db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center text-xs text-amber-800">
                    <span>{v.date.slice(0, 10)} - Adelanto</span>
                    <span className="font-bold">-${v.totalDueUSD.toFixed(2)}</span>
                  </div>
                ))}
                {(db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").length === 0 && (
                  <span className="text-xs text-amber-800/60 block">No hay vales pendientes.</span>
                )}
              </div>

              <div className="flex justify-between items-center bg-sky-900 p-4 rounded-xl text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Total Neto a Pagar</span>
                <span className="text-xl font-black text-white">
                  ${Math.max(0, parseFloat(payrollBaseSalary || "0") - (db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").reduce((acc: number, v: any) => acc + v.totalDueUSD, 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowPayrollModal(null); setPayrollBaseSalary(""); }} className="flex-1 px-4 py-3 border border-sky-100 text-sky-700 text-sm font-bold rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!payrollBaseSalary) {
                    showToast("Ingresa un monto base", "error");
                    return;
                  }
                  processPayroll(showPayrollModal.id, parseFloat(payrollBaseSalary));
                  setShowPayrollModal(null);
                  setPayrollBaseSalary("");
                }}
                className="flex-1 px-4 py-3 bg-sky-900 text-white text-sm font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shadow-lg"
              >
                Aprobar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayoutModal && (
        <PayoutModal
          maxAmount={clientInfo.walletBalanceUSD || 0}
          currency="USD"
          formatMoney={formatUSD}
          onCancel={() => setShowPayoutModal(false)}
          onConfirm={(amount: number, details: string) => {
            requestPayout(amount, details);
            setShowPayoutModal(false);
          }}
        />
      )}

    </div>
  );
}
