"use client";
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
import { QRCodeSVG } from "qrcode.react";
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

export const CoreDashboard = ({ db, setDb, approvePromotora, rejectPromotora, settlePromotoraEarnings, showToast, formatUSD, formatEUR, currentUser, logout, approveSubscription }: any) => {
  const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, deleteCustomer, deletePromotora, deleteVendedor, deleteRider, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints, updateStoreSettings } = useKFS() as any;
  const [searchPromotora, setSearchPromotora] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchVendedor, setSearchVendedor] = useState("");
  const [viewingCandidateCv, setViewingCandidateCv] = useState<any | null>(null);
  const [viewingKycPhoto, setViewingKycPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("panel"); // panel | red | soporte | auditoria
  const { isSupabaseConfigured } = useKFS() as any;
  const pendingTopUps = db.topups?.filter((t: any) => t.status === 'pending') || [];
  const pendingCandidates = db.candidates?.filter((c: any) => c.status === 'pending') || [];
  const pendingRiders = db.riders?.filter((r: any) => r.status === 'pending') || [];

  const handleWipeDatabase = async () => {
    if (confirm("🚨 ¿ESTÁS SEGURO? Esta acción borrará permanentemente todos los comercios, promotoras, transacciones, y restablecerá todo a $0.00 en Supabase y localmente.")) {
      const cleared = {
        promotoras: [],
        clients: [],
        vendedores: [],
        products: [],
        transactions: [],
        orders: [],
        expenses: [],
        crm: [],
        vales: [],
        posTerminals: [],
        zReports: [],
        buyers: [],
        customers: [],
        kreatekCore: {
          totalTransactions: 0,
          earningsEUR: 0,
          netEarningsEUR: 0,
          adBudgetEUR: 0,
          wipeVersion: 4
        },
        ghostLogs: [],
        notifications: [],
        auditLogs: [],
        supportTickets: [],
        candidates: [],
        unlockedContacts: [],
        riders: [],
        topups: []
      };
      setDb(cleared);
      localStorage.setItem("kfs_os_db_prod", JSON.stringify(cleared));

      if (isSupabaseConfigured) {
        try {
          const { supabase } = await import("../../context/supabase");
          const syncId = "kfs-general-db-prod";
          const { error } = await supabase.from("kfs_store_states").upsert({
            id: syncId,
            db_state: cleared,
            updated_at: new Date().toISOString()
          });
          if (error) throw error;
          showToast("Base de datos borrada a 0 en Supabase y local.", "success");
        } catch (err) {
          showToast("Error al sincronizar con Supabase", "error");
        }
      } else {
        showToast("Base de datos local borrada a 0.", "success");
      }
    }
  };

  // ── Customizing state for Arquitecto ──────────────────────────────────────
  const [customizingClient, setCustomizingClient] = useState<any>(null);

  // Feature 1: Clear all demo records
  const handleClearDemos = () => {
    if (confirm('¿Eliminar todos los registros de demo del sistema?')) {
      setDb((prev: any) => ({
        ...prev,
        clients:    prev.clients.filter((c: any)    => !String(c.id).includes('demo')),
        promotoras: prev.promotoras.filter((p: any) => !String(p.id).includes('demo')),
        vendedores: prev.vendedores.filter((v: any) => !String(v.id).includes('demo')),
        customers:  prev.customers.filter((c: any)  => !String(c.id).includes('demo')),
      }));
      showToast('✅ Demos eliminados correctamente.', 'success');
    }
  };

  // Feature 5: Inject KFS Points to any user
  const handleInjectPoints = (collection: string, userId: string) => {
    const raw = prompt('Cantidad de KFS Points a inyectar (ej: 500 = $0.50 USD):', '500');
    if (!raw || isNaN(Number(raw))) return;
    const amount = parseInt(raw, 10);
    setDb((prev: any) => ({
      ...prev,
      [collection]: prev[collection].map((u: any) =>
        u.id === userId ? { ...u, kfsPoints: (u.kfsPoints || 0) + amount } : u
      ),
    }));
    showToast(`🎁 ${amount} K-Points inyectados.`, 'success');
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const clearClientDebt = (clientId: string) => {
    if(confirm("¿Estás seguro de perdonar/eliminar la deuda de cobranza de este comercio?")) {
      setDb((prev: any) => ({
        ...prev,
        clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, kfsFeesOwedUSD: 0 } : c)
      }));
      showToast("Deuda eliminada del registro.", "success");
    }
  };

  // Assign Promotora State
  const [targetClientId, setTargetClientId] = useState("");
  const [targetPromotoraId, setTargetPromotoraId] = useState("");

  // Assign Rider to Business State
  const [assignRiderModal, setAssignRiderModal] = useState<{ riderId: string; riderName: string } | null>(null);
  const [assignRiderBusinessId, setAssignRiderBusinessId] = useState("");

  // Global Product State
  const [globalProdName, setGlobalProdName] = useState("");
  const [globalProdPrice, setGlobalProdPrice] = useState("");
  const [globalProdCategory, setGlobalProdCategory] = useState("");

  // Notification State
  const [notifTarget, setNotifTarget] = useState("all");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");

  useEffect(() => {
    const handleGlobalSale = (e: any) => {
      showToast(`⚡ KFS Network: Venta reportada de ${e.detail.name} por ${formatUSD(e.detail.priceUSD)}`, "success");
    };
    const handlePaymentAlert = (e: any) => {
      showToast(`🔔 ALERTA DE PAGO: ${e.detail.company} reportó transferencia por ${formatUSD(e.detail.amount)}`, "success");
    };
    window.addEventListener("kfs-purchase", handleGlobalSale);
    window.addEventListener("kfs-payment-alert", handlePaymentAlert);
    return () => {
      window.removeEventListener("kfs-purchase", handleGlobalSale);
      window.removeEventListener("kfs-payment-alert", handlePaymentAlert);
    };
  }, [showToast, formatUSD]);

  const totalPromotoras = db.promotoras.length;
  const totalSetups = db.promotoras.reduce((acc: number, p: any) => acc + (p.setups || 0), 0);
  const totalDueños = db.clients.length;
  const globalSalesUSD = db.clients.reduce((acc: number, c: any) => acc + (c.salesUSD || 0), 0);
  const globalDebtUSD = db.clients.reduce((acc: number, c: any) => acc + (c.kfsFeesOwedUSD || 0), 0);
  const totalKPoints = db.customers?.reduce((acc: number, c: any) => acc + (c.kPoints || 0), 0) || 0;
  const usdFloat = db.customers?.reduce((acc: number, c: any) => acc + (c.walletUSD || 0), 0) || 0;

  const chartData = db.transactions.map((t: any, index: number) => ({
    name: `TX-${index + 1}`,
    kreatekFee: t.kreatekFeeEUR
  })).slice(-15);

  return (
    <div className="min-h-screen bg-[#EEF2F5] pb-24 font-sans text-violet-900 relative">
      {/* Wavy Header */}
      <div className="bg-[#EEF2F5] rounded-b-[3rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none pt-6 pb-12 px-6 text-violet-900 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 p-2 rounded-xl text-violet-600 shadow-inner"><Shield size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS OS (Arquitecto)</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white shadow-sm rounded-xl hover:text-red-500 transition-colors cursor-pointer text-gray-500 border-none">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white shadow-sm border border-sky-100 rounded-full flex items-center justify-center text-sky-600 font-black text-2xl flex-shrink-0 relative z-20 placeholder:text-slate-400">
              <ProfileAvatarEditor currentUser={currentUser} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight truncate text-sky-950">Control Matriz KFS</h2>
              <p className="text-sky-700 font-mono text-xs mt-1 bg-sky-100 shadow-sm inline-block px-2 py-0.5 rounded-md border border-sky-200">Vista de Dios • Arquitectura de Red</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto -mt-6 relative z-20 flex flex-col gap-8 animate-fade-in">
        {activeTab === "panel" && (
          <div className="space-y-8 flex flex-col">
            <ReferralLinksWidget userId={currentUser.id} showToast={showToast} />
            <KPointsIssuerWidget db={db} transferKFSPoints={transferKFSPoints} />
            <OracleControlSlider merchantId={db.clients?.[0]?.id} merchantName={db.clients?.[0]?.company || "N/A"} currentFee={db.clients?.[0]?.oracle_fee_percentage} setDb={setDb} />
            {/* Global Metrics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-6 rounded-[2rem] relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <span className="text-sky-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Nodos Globales</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-sky-950">{totalDueños}</h2>
                    <span className="text-xs text-slate-500 font-bold">comercios</span>
                  </div>
                </div>
                <Activity size={80} className="absolute -right-5 -bottom-5 text-sky-100" />
              </div>
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-6 rounded-[2rem] relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <span className="text-sky-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Fuerza de Ventas</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-sky-950">{totalPromotoras}</h2>
                    <span className="text-xs text-slate-500 font-bold">promotoras</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-2 block">{totalSetups} setups históricos</span>
                </div>
                <Users size={80} className="absolute -right-5 -bottom-5 text-sky-100" />
              </div>
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-6 rounded-[2rem] relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <span className="text-sky-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Facturación Global</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-emerald-500"><AnimatedCounter value={globalSalesUSD} format={formatUSD} /></h2>
                  </div>
                </div>
                <TrendingUp size={80} className="absolute -right-5 -bottom-5 text-sky-100" />
              </div>
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-6 rounded-[2rem] relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1 block">Deuda Total x Cobrar</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-red-500"><AnimatedCounter value={globalDebtUSD} format={formatUSD} /></h2>
                  </div>
                </div>
                <Activity size={80} className="absolute -right-5 -bottom-5 text-red-50" />
              </div>
            </div>

            {/* Push Notifications Command Center */}
            <PushCommandCenter currentUser={currentUser} />

            {/* Core Approvals Panel */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-6 space-y-6">
              <h3 className="font-black text-sky-950 text-xl flex items-center gap-2 border-b border-sky-100 pb-4">
                <CheckCircle size={24} className="text-sky-600" /> Aprobaciones Pendientes del KFS Core
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidates */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest flex justify-between">
                    Candidatos RRHH 
                    <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">{pendingCandidates.length}</span>
                  </h4>
                  {pendingCandidates.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No hay candidatos pendientes.</p>
                  ) : (
                    pendingCandidates.map((cand: any) => (
                      <div key={cand.id} className="bg-sky-50/50 p-4 rounded-xl shadow-sm border border-sky-100 flex flex-col gap-3 hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-black text-sm text-sky-950">{cand.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{cand.phone}</p>
                            <p className="text-[10px] text-slate-400 uppercase mt-1">Ref: {cand.registrationPaymentRef}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase">PAGADO $1 USD</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveCandidateRegistration(cand.id)} className="flex-1 bg-emerald-500 text-white text-xs font-black py-2 rounded-lg hover:bg-emerald-600 cursor-pointer transition-colors shadow-md border-none">
                            Aprobar Perfil
                          </button>
                          <button onClick={() => rejectCandidateRegistration(cand.id)} className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-100 cursor-pointer transition-colors border border-red-200">
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Riders */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest flex justify-between">
                    Riders (Logística)
                    <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">{pendingRiders.length}</span>
                  </h4>
                  {pendingRiders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No hay riders pendientes.</p>
                  ) : (
                    pendingRiders.map((rider: any) => (
                      <div key={rider.id} className="bg-sky-50/50 p-4 rounded-xl shadow-sm border border-sky-100 flex flex-col gap-3 hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-black text-sm text-sky-950">{rider.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{rider.phone}</p>
                            <p className="text-[10px] text-slate-400 uppercase mt-1">Vehículo: {rider.vehicleType}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveRider(rider.id)} className="flex-1 bg-emerald-500 text-white text-xs font-black py-2 rounded-lg hover:bg-emerald-600 cursor-pointer transition-colors shadow-md border-none">
                            Aprobar Rider
                          </button>
                          <button onClick={() => rejectRider(rider.id)} className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-100 cursor-pointer transition-colors border border-red-200">
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* BCV Rate Manual Update */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sky-950 text-lg">Tasa Oficial Banco Central</h3>
                <p className="text-xs text-slate-500">Actualización manual / forzada en el sistema</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-32">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tasa USD (Bs)</label>
                  <input type="number" id="manualUsdRate" placeholder="Tasa USD" defaultValue={rates.USD} step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" />
                </div>
                <div className="flex-1 md:w-32">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tasa EUR (Bs)</label>
                  <input type="number" id="manualEurRate" placeholder="Tasa EUR" defaultValue={rates.EUR} step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" />
                </div>
                <button onClick={() => {
                  const usd = parseFloat((document.getElementById('manualUsdRate') as HTMLInputElement).value);
                  const eur = parseFloat((document.getElementById('manualEurRate') as HTMLInputElement).value);
                  if (usd > 0 && eur > 0) updateBcvRates(usd, eur);
                }} className="bg-sky-600 text-white rounded-xl px-6 py-2 h-10 mt-5 font-black hover:bg-sky-700 transition-colors shadow-md shadow-sky-600/30 border-none">
                  Fijar
                </button>
              </div>
            </div>

            {/* Net Earnings and Ad Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> Ganancia Neta KFS</p>
                  <h2 className="text-5xl font-black mb-1 text-emerald-500">{formatEUR(db.kreatekCore?.netEarningsEUR || 0)}</h2>
                  <p className="text-xs text-slate-500 mt-2">Libre de pago a promotoras y fondos.</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-emerald-50" />
              </div>

              {/* Float & Liquidez (Phase E) */}
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sky-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-sky-500" /> Float Liquidez (USD)</p>
                  <h2 className="text-5xl font-black mb-1 text-sky-500">{formatUSD(usdFloat)}</h2>
                  <p className="text-xs text-slate-500 mt-2">Dinero real pre-pagado por usuarios, listo para invertir.</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-sky-50" />
              </div>

              {/* K-Points Emitidos (Phase E) */}
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-purple-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14} className="text-purple-500" /> Total K-Points Emitidos</p>
                  <h2 className="text-5xl font-black mb-1 text-purple-500">{totalKPoints} K-Pts</h2>
                  <p className="text-xs text-slate-500 mt-2">Deuda interna en la economía. {(totalKPoints * 0.001).toFixed(2)} USD (Ref).</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-purple-50" />
              </div>

              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 text-sky-950 p-8 rounded-[2rem] flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sky-600 text-xs font-black uppercase tracking-widest mb-2">Fondo Publicidad KFS</p>
                  <h2 className="text-5xl font-black text-sky-950">{formatEUR(db.kreatekCore?.adBudgetEUR || 0)}</h2>
                  <p className="text-xs text-slate-500 mt-2">Fondo sugerido para inyección días 13-17 y 28-2.</p>
                </div>
              </div>
            </div>

            <KFSFinancialSplitCalculator formatUSD={formatUSD} formatEUR={formatEUR} />

            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2"><TrendingUp className="text-sky-600" /> Flujo de Comisiones KFS</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorKreatekFee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e0f2fe', boxShadow: '0 10px 15px -3px rgb(14 165 233 / 0.1)' }} />
                    <Area type="monotone" dataKey="kreatekFee" stroke="#0ea5e9" strokeWidth={4} fill="url(#colorKreatekFee)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "red" && (
          <div className="space-y-8 flex flex-col">
            {/* Tactical Buttons Row for RED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button onClick={() => setActiveModal('store')} className="bg-white shadow-lg shadow-sky-200/40 border border-sky-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer hover:border-sky-200 hover:shadow-xl hover:shadow-sky-200/50">
                <div className="bg-sky-600 text-white p-3 rounded-xl shadow-md shadow-sky-600/30 group-hover:scale-110 transition-transform"><Store size={24} /></div>
                <span className="font-black text-sky-950 text-sm text-center">Alta de Comercio</span>
              </button>
              <button onClick={() => setActiveModal('assign')} className="bg-white shadow-lg shadow-sky-200/40 border border-sky-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer hover:border-sky-200 hover:shadow-xl hover:shadow-sky-200/50">
                <div className="bg-sky-900 text-white p-3 rounded-xl shadow-md shadow-sky-900/30 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                <span className="font-black text-sky-950 text-sm text-center">Asignar Promotora</span>
              </button>
              <button onClick={() => setAssignRiderModal({ riderId: "", riderName: "" })} className="bg-white shadow-lg shadow-sky-200/40 border border-sky-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer hover:border-sky-200 hover:shadow-xl hover:shadow-sky-200/50">
                <div className="bg-amber-500 text-white p-3 rounded-xl shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform"><Truck size={24} /></div>
                <span className="font-black text-sky-950 text-sm text-center">Asignar Rider a Negocio</span>
              </button>
            </div>

            {/* Control y Gobernanza de Promotoras */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2"><Shield className="text-sky-600" /> Control y Gobernanza de Promotoras</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar promotora..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-sky-950 placeholder:text-slate-400" value={searchPromotora} onChange={e => setSearchPromotora(e.target.value)} />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Promotora</th>
                      <th className="py-4 px-4">Accesos</th>
                      <th className="py-4 px-4">Datos de Pago</th>
                      <th className="py-4 px-4 text-center">Estado / Métricas</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {db.promotoras.filter((p: any) => p.name.toLowerCase().includes(searchPromotora.toLowerCase()) || p.email.toLowerCase().includes(searchPromotora.toLowerCase())).map((p: any) => (
                      <tr key={p.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-sky-950">{p.name}</td>
                        <td className="py-4 px-4 text-slate-500"><span className="text-xs font-mono block">{p.email}</span><span className="text-xs font-mono">P: {p.password}</span></td>
                        <td className="py-4 px-4 text-slate-500"><span className="text-xs font-mono block">BIN: {p.binanceId || "N/A"}</span><span className="text-xs font-mono block">PM: {p.pagoMovil || "N/A"}</span></td>
                        <td className="py-4 px-4 text-center">
                          {p.status === 'pending' ? (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Pendiente</span>
                          ) : (
                            <div>
                              <span className="font-black text-sky-950 block">{p.setups || 0} Setups</span>
                              <span className="font-black text-emerald-500 block">{formatEUR(p.earningsEUR || 0)}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {p.status === 'pending' ? (
                            <>
                              <button onClick={() => approvePromotora(p.id)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-600 cursor-pointer border-none shadow-sm">Aprobar</button>
                              <button onClick={() => rejectPromotora(p.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-600 cursor-pointer border-none shadow-sm">Denegar</button>
                            </>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-2 rounded-lg uppercase tracking-wider flex items-center">Habilitada</span>
                              {(p.passiveEarningsEUR || 0) > 0 && (
                                <button onClick={() => settlePromotoraEarnings(p.id)} className="bg-sky-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-md shadow-sky-600/30 hover:bg-sky-700 border-none cursor-pointer inline-flex items-center gap-1">
                                  <CheckCircle size={14} /> Liquidar Regalías
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {db.promotoras.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-bold">No hay promotoras en la red.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estado de Cobranza Diaria (BOS) */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2"><DollarSign className="text-red-500" /> Estado de Cobranza Diaria (BOS)</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar comercio..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-sky-950 placeholder:text-slate-400" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                      <th className="py-4 px-4">Teléfono (WhatsApp)</th>
                      <th className="py-4 px-4">Facturación Bruta USD</th>
                      <th className="py-4 px-4">Deuda Actual USD</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones de Cobro</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {db.clients.filter((c: any) => c.company.toLowerCase().includes(searchClient.toLowerCase()) || c.name.toLowerCase().includes(searchClient.toLowerCase())).map((c: any) => {
                      const isBlocked = c.subscription?.status === 'past_due';
                      return (
                        <tr key={c.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-bold text-sky-950 block">{c.company}</span>
                            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${isBlocked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                              {isBlocked ? '🔴 Bloqueado' : '🟢 Activo'}
                            </span>
                            {c.promotoraId && (
                              <span className="block mt-2 text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-200 px-2 py-1 rounded-md inline-block">
                                Ref: {db.promotoras?.find((p: any) => p.id === c.promotoraId)?.name || c.promotoraId}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-500 font-mono">{c.phone}</td>
                          <td className="py-4 px-4 font-black text-green-600">{formatUSD(c.salesUSD || 0)}</td>
                          <td className="py-4 px-4 font-black text-red-500">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <button onClick={() => impersonateClient(c)} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                👁️ Ver Panel
                              </button>

                              {isBlocked ? (
                                <button onClick={() => releaseClient(c.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                  🔓 Liberar
                                </button>
                              ) : (
                                <button onClick={() => blockClient(c.id)} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-600 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                  🔒 Bloquear
                                </button>
                              )}

                              <button onClick={() => {
                                deleteClient(c.id);
                              }} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-red-700 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Eliminar Comercio">
                                🗑️ Comercio
                              </button>

                              <button onClick={() => {
                                clearClientDebt(c.id);
                              }} className="bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-red-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Limpiar Deuda (Registro)">
                                🗑️ Deuda
                              </button>

                              <button onClick={() => {
                                const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                                const targetPhone = cleanPhone.startsWith('04') ? `58${cleanPhone.substring(1)}` : cleanPhone;
                                window.open(`https://wa.me/${targetPhone}?text=Hola ${c.name}, te escribimos de *Kreatek*. Te recordamos realizar el pago de tu mantenimiento BOS diario por un monto de *${formatUSD(c.kfsFeesOwedUSD || 0)}*. Puedes usar el botón en tu panel de control para reportar la transferencia. ¡Gracias!`, '_blank');
                              }} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-1">
                                💬 Cobro WA
                              </button>

                              <button onClick={() => handleInjectPoints('clients', c.id)} className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                🎁 K-Pts
                              </button>

                              <button onClick={() => setCustomizingClient(c)} className="bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-violet-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                🎨 Diseño
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {db.clients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay comercios en la red para cobrar.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fuerza Laboral (Vendedores) */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2"><UserCheck className="text-sky-600" /> Fuerza Laboral (Vendedores)</h3>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar vendedor..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-950 transition-all placeholder:text-slate-400" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto max-h-96 rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black sticky top-0">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Vendedor</th>
                      <th className="py-4 px-4">Comercio</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Credenciales</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {(db.vendedores || []).filter((v: any) => v.name.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email.toLowerCase().includes(searchVendedor.toLowerCase())).map((vend: any) => {
                      const client = db.clients.find((c: any) => c.id === vend.clientId);
                      return (
                        <tr key={vend.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-sky-950">{vend.name}</td>
                          <td className="py-4 px-4 text-slate-500 text-xs">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-right text-slate-500">
                            <span className="text-[10px] font-mono block">{vend.email}</span>
                            <span className="text-[10px] font-mono block">P: {vend.password}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {(db.vendedores || []).length === 0 && <tr><td colSpan={3} className="text-center py-10 text-slate-400 font-bold">No hay vendedores registrados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Riders de Delivery */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-sky-100">
                <div>
                  <h2 className="text-xl font-black text-sky-950 flex items-center gap-2">
                    <Truck size={20} className="text-sky-600" /> Riders de Delivery
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Aprobación, revisión de documentos y gestión de riders</p>
                </div>
                <div className="flex gap-2 items-center">
                  {(db.riders?.filter((r: any) => r.status === "pending") || []).length > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm border-none">
                      {(db.riders?.filter((r: any) => r.status === "pending") || []).length} pendientes
                    </span>
                  )}
                  <span className="bg-sky-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border-none">
                    {(db.riders || []).length} total
                  </span>
                </div>
              </div>

              {/* Metrics Banner */}
              <div className="bg-sky-50/50 border-b border-sky-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-sky-100 p-4 rounded-xl flex items-center justify-between placeholder:text-slate-400">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Entregas</p>
                    <p className="text-xl font-black text-sky-950">
                      {(db.riders || []).reduce((acc: number, r: any) => acc + (r.deliveriesCompleted || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Truck size={20} /></div>
                </div>
                <div className="bg-white border border-sky-100 p-4 rounded-xl flex items-center justify-between placeholder:text-slate-400">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ganancias Generadas</p>
                    <p className="text-xl font-black text-emerald-500">
                      {formatUSD((db.riders || []).reduce((acc: number, r: any) => acc + (r.totalEarningsUSD || 0), 0))}
                    </p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><DollarSign size={20} /></div>
                </div>
                <div className="bg-white border border-sky-100 p-4 rounded-xl flex items-center justify-between placeholder:text-slate-400">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Riders Activos</p>
                    <p className="text-xl font-black text-sky-950">
                      {(db.riders || []).filter((r: any) => r.status === "approved").length}
                    </p>
                  </div>
                  <div className="bg-sky-100 text-sky-600 p-2 rounded-lg"><Users size={20} /></div>
                </div>
              </div>

              {(db.riders || []).length === 0 ? (
                <div className="p-10 text-center">
                  <Truck size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 font-bold">No hay riders registrados aún.</p>
                  <p className="text-xs text-slate-300 mt-1">Los riders se registran desde el panel de login.</p>
                </div>
              ) : (
                <div className="divide-y divide-sky-50 bg-white">
                  {(db.riders || []).map((rider: any) => {
                    const businessNames = (rider.associatedBusinesses || []).map((bId: string) =>
                      db.clients?.find((c: any) => c.id === bId)?.company
                    ).filter(Boolean);
                    return (
                      <div key={rider.id} className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 ${rider.status === "approved" ? "border-emerald-400 bg-emerald-50" : "border-amber-400 bg-amber-50"}`}>
                            🛵
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-sky-950">{rider.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${rider.status === "approved" ? "bg-emerald-100 text-emerald-700" : rider.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {rider.status === "approved" ? "✅ Aprobado" : rider.status === "rejected" ? "❌ Rechazado" : "⏳ Pendiente"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono">{rider.email} · {rider.phone}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {businessNames.length > 0 ? `Negocios: ${businessNames.join(", ")}` : "Sin negocios asociados"}
                            </p>
                            {rider.pagoMovil?.banco && (
                              <p className="text-[10px] text-green-600 font-bold mt-0.5">
                                💳 PM: {rider.pagoMovil.banco} · {rider.pagoMovil.telefono} · CI {rider.pagoMovil.cedula}
                              </p>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-300 flex-shrink-0">{new Date(rider.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* Documents Preview */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Cédula", key: "cedulaImg", icon: "🪪" },
                            { label: "Cert. Médico", key: "medCertImg", icon: "🏥" },
                            { label: "Licencia", key: "licenseImg", icon: "🚗" }
                          ].map(({ label, key, icon }) => (
                            <div key={key} className={`rounded-xl p-2 text-center border ${rider[key] ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                              {rider[key] ? (
                                <img src={rider[key]} alt={label} className="w-full aspect-square object-cover rounded-lg mb-1 cursor-pointer" onClick={() => window.open(rider[key], "_blank")} title="Click para ampliar" />
                              ) : (
                                <div className="w-full aspect-square flex items-center justify-center text-2xl mb-1 bg-gray-100 rounded-lg">{icon}</div>
                              )}
                              <p className={`text-[8px] font-black uppercase ${rider[key] ? "text-green-600" : "text-red-400"}`}>
                                {rider[key] ? "✅ " : "⚠️ "}{label}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        {rider.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => approveRider(rider.id)} className="flex-1 py-2.5 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 active:scale-95 transition-all text-xs cursor-pointer">
                              ✅ Aprobar Rider
                            </button>
                            <button onClick={() => rejectRider(rider.id)} className="flex-1 py-2.5 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 active:scale-95 transition-all text-xs cursor-pointer">
                              ❌ Rechazar y Eliminar
                            </button>
                          </div>
                        )}
                        {rider.status === "approved" && (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <div className="flex-1 py-2 bg-green-50 border border-green-200 rounded-xl text-center">
                                <p className="text-[10px] font-black text-green-600">🏁 {rider.deliveriesCompleted || 0} entregas realizadas</p>
                              </div>
                              <button
                                onClick={() => { setAssignRiderModal({ riderId: rider.id, riderName: rider.name }); setAssignRiderBusinessId(""); }}
                                className="px-4 py-2 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 text-xs border border-orange-400 cursor-pointer flex items-center gap-1"
                              >
                                <Truck size={12} /> Asignar Negocio
                              </button>
                              <button onClick={() => rejectRider(rider.id)} className="px-4 py-2 bg-red-50 text-red-500 font-black rounded-xl hover:bg-red-100 text-xs border border-red-200 cursor-pointer">
                                Revocar
                              </button>
                            </div>
                            {/* Businesses assigned – with remove option */}
                            {(rider.associatedBusinesses || []).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(rider.associatedBusinesses || []).map((bId: string) => {
                                  const biz = db.clients?.find((c: any) => c.id === bId);
                                  return biz ? (
                                    <span key={bId} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-full border border-orange-200">
                                      🏪 {biz.company}
                                      <button onClick={() => removeRiderFromBusiness(rider.id, bId)} className="hover:text-red-500 transition-colors cursor-pointer ml-0.5">✕</button>
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "soporte" && (
          <div className="space-y-8 flex flex-col">
            {/* Help Desk */}
            <div className="bg-sky-950 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-800 p-8 text-white mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-sky-400"><Bell className="text-sky-400" /> Help Desk (Tickets de Soporte Global)</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {(db.supportTickets || []).slice().reverse().map((ticket: any) => {
                  const client = db.clients.find((c: any) => c.id === ticket.clientId);
                  return (
                    <div key={ticket.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-200">[{ticket.status === 'open' ? '🔴 ABIERTO' : '🟢 CERRADO'}] {client?.company || "Comercio"} - {ticket.subject}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-sky-500/30">
                        {ticket.messages.map((m: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-sky-400">{m.author}:</span> <span className="text-slate-300">{m.text}</span>
                          </div>
                        ))}
                      </div>
                      {ticket.status === 'open' && (
                        <div className="flex gap-2 mt-2">
                          <input type="text" id={`reply-${ticket.id}`} placeholder="Respuesta Kreatek..." className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500" />
                          <button onClick={() => {
                            const input = document.getElementById(`reply-${ticket.id}`) as HTMLInputElement;
                            if (input && input.value) {
                              replyTicket(ticket.id, "Kreatek Core", input.value);
                              input.value = "";
                            }
                          }} className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer hover:bg-sky-700 shadow-md shadow-sky-600/30">Responder</button>
                          <button onClick={() => {
                            closeTicket(ticket.id);
                          }} className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 cursor-pointer">Cerrar Ticket</button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {(!db.supportTickets || db.supportTickets.length === 0) && (
                  <p className="text-slate-500 text-sm font-bold text-center py-4">No hay tickets de soporte.</p>
                )}
              </div>
            </div>

            {/* Suscripciones Pendientes */}
            {db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').length > 0 && (
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 mb-8">
                <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2"><CreditCard className="text-emerald-500" /> Suscripciones por Aprobar ($6)</h3>
                <div className="space-y-4">
                  {db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').map((c: any) => (
                    <div key={c.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm gap-4">
                      <div>
                        <h4 className="font-bold text-sky-950">{c.company}</h4>
                        <p className="text-sm text-slate-500 font-mono mt-1">Ref Bancaria Enviada: <span className="font-black text-emerald-600">{c.subscription.lastPaymentRef}</span></p>
                      </div>
                      <button onClick={() => approveSubscription(c.id)} className="w-full md:w-auto px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md shadow-emerald-500/30">
                        <CheckCircle size={18} /> Aprobar Pago y Reactivar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registros de Candidatos Pendientes ($1) */}
            {db.candidates?.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').length > 0 && (
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 mb-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2">
                  <Briefcase className="text-emerald-500" /> Registraciones de Bolsa de Empleo por Aprobar ($1)
                </h3>
                <div className="space-y-4">
                  {db.candidates.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').map((cand: any) => (
                    <div key={cand.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm gap-4">
                      <div>
                        <h4 className="font-black text-sky-950">Candidato: {cand.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Cargo: <strong>{cand.role}</strong> | Teléfono: <strong>{cand.phone}</strong>
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          Referencia de Activación ($1): <span className="font-black text-emerald-600">{cand.registrationPaymentRef}</span>
                        </p>
                        <div className="flex gap-4 mt-2">
                          {(cand.cvFile || cand.useKfsCvBuilder) && (
                            <button
                              onClick={() => {
                                if (cand.useKfsCvBuilder) {
                                  setViewingCandidateCv(cand);
                                } else {
                                  window.open(cand.cvFile, '_blank');
                                }
                              }}
                              className="text-[10px] font-black text-sky-600 underline cursor-pointer flex items-center gap-1 hover:text-sky-700 transition-colors"
                            >
                              👁️ {cand.useKfsCvBuilder ? "Ver CV Digital KFS" : `Abrir Currículum (${cand.cvFileType?.includes('pdf') ? 'PDF' : 'Imagen'})`}
                            </button>
                          )}
                          {cand.registrationPaymentProof && (
                            <button
                              onClick={() => window.open(cand.registrationPaymentProof, '_blank')}
                              className="text-[10px] font-black text-emerald-600 underline cursor-pointer flex items-center gap-1 hover:text-emerald-700 transition-colors"
                            >
                              👁️ Ver Capture de Pago
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <button
                          onClick={() => approveCandidateRegistration(cand.id)}
                          className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md shadow-emerald-500/30 text-xs"
                        >
                          <CheckCircle size={14} /> Aprobar Registro
                        </button>
                        <button
                          onClick={() => rejectCandidateRegistration(cand.id)}
                          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md shadow-red-500/30 text-xs"
                        >
                          <X size={14} /> Rechazar Registro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desbloqueos de Contactos Pendientes ($10) */}
            {db.unlockedContacts?.filter((u: any) => u.status === 'pending_approval').length > 0 && (
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 mb-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2">
                  <CreditCard className="text-emerald-500" /> Desbloqueos de Bolsa de Empleo por Aprobar ($10)
                </h3>
                <div className="space-y-4">
                  {db.unlockedContacts.filter((u: any) => u.status === 'pending_approval').map((u: any) => {
                    const candidate = db.candidates?.find((cand: any) => cand.id === u.candidateId);
                    const client = db.clients?.find((c: any) => c.id === u.clientId);
                    return (
                      <div key={u.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm gap-4">
                        <div>
                          <h4 className="font-black text-sky-950">Comercio: {client?.company || "Desconocido"}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Candidato Target: <strong>{candidate?.name || "Desconocido"}</strong> ({candidate?.role})
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-1">
                            Referencia Bancaria: <span className="font-black text-emerald-600">{u.reference}</span>
                          </p>
                          {u.screenshot && (
                            <div className="mt-2">
                              <button
                                onClick={() => window.open(u.screenshot, '_blank')}
                                className="text-[10px] font-black text-emerald-600 underline cursor-pointer hover:text-emerald-700 transition-colors"
                              >
                                👁️ Ver Capture de Pago
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                          <button
                            onClick={() => approveUnlock(u.id)}
                            className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md shadow-emerald-500/30 text-xs"
                          >
                            <CheckCircle size={14} /> Aprobar Desbloqueo
                          </button>
                          <button
                            onClick={() => rejectUnlock(u.id)}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md shadow-red-500/30 text-xs"
                          >
                            <X size={14} /> Rechazar Pago
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verificaciones y Respaldo de Candidatos */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 mb-8 animate-fade-in">
              <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2">
                <Award className="text-amber-500" /> Verificaciones de Bolsa de Empleo
              </h3>
              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Candidato</th>
                      <th className="py-4 px-4">Cargo & Habilidades</th>
                      <th className="py-4 px-4">Contacto</th>
                      <th className="py-4 px-4 text-center">Estado KFS</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {db.candidates?.map((cand: any) => (
                      <tr key={cand.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-bold text-sky-950">{cand.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {cand.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-black text-sky-950 block">{cand.role}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cand.skills?.map((s: string) => (
                              <span key={s} className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                          <span className="block">{cand.phone}</span>
                          <span className="block">{cand.email}</span>
                          {(cand.cvFile || cand.useKfsCvBuilder) && (
                            <button
                              onClick={() => {
                                if (cand.useKfsCvBuilder) {
                                  setViewingCandidateCv(cand);
                                } else {
                                  window.open(cand.cvFile, '_blank');
                                }
                              }}
                              className="text-[9px] font-black text-sky-600 hover:text-sky-700 transition-colors underline cursor-pointer block mt-1 text-left"
                            >
                              👁️ {cand.useKfsCvBuilder ? "Ver CV Digital" : "Ver CV Adjunto"}
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {cand.status === 'backed' ? (
                            <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                              🏆 Respaldado
                            </span>
                          ) : (
                            <span className="bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => toggleCandidateBacking(cand.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors shadow-sm ${cand.status === 'backed' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-amber-400 text-amber-950 hover:bg-amber-500 border-none'}`}
                          >
                            {cand.status === 'backed' ? "Quitar Aval KFS" : "Otorgar Aval KFS"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!db.candidates || db.candidates.length === 0) && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 font-bold">
                          No hay candidatos registrados en la bolsa de empleo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auditoria" && (
          <div className="space-y-8 flex flex-col">
            {/* Tactical Buttons Row for Auditoría & Control */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              <button onClick={() => setActiveModal('product')} className="bg-sky-50 border border-sky-100 hover:bg-sky-100 hover:border-sky-200 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-sky-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-sky-600/30"><Package size={24} /></div>
                <span className="font-black text-sky-950 text-sm text-center font-bold">Catálogo Global KFS</span>
              </button>
              <button onClick={() => setActiveModal('push')} className="bg-red-50 border border-red-100 hover:bg-red-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer hover:border-red-200">
                <div className="bg-red-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-red-500/30"><Bell size={24} /></div>
                <span className="font-black text-red-950 text-sm text-center font-bold">Alerta Push Network</span>
              </button>
              <button onClick={handleWipeDatabase} className="bg-red-100 border border-red-200 hover:bg-red-200 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-red-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-red-600/30"><Shield size={24} /></div>
                <span className="font-black text-red-800 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>
              </button>
              <button onClick={handleClearDemos} className="bg-orange-50 border border-orange-200 hover:bg-orange-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-orange-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-orange-500/30"><Trash2 size={24} /></div>
                <span className="font-black text-orange-800 text-sm text-center font-bold">🗑️ Limpiar Demos</span>
              </button>
            </div>

            {/* Validaciones Financieras */}
            {pendingTopUps.length > 0 && (
              <div className="bg-green-50/50 rounded-[2rem] shadow-sm border border-green-200 p-8 mb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-green-900 flex items-center gap-2"><DollarSign className="text-green-500" /> Validaciones Financieras Pendientes</h3>
                </div>
                <div className="space-y-4">
                  {pendingTopUps.map((t: any) => {
                    const user = t.userType === 'client' ? db.clients?.find((c: any) => c.id === t.userId) : db.customers?.find((c: any) => c.id === t.userId);
                    const name = t.userType === 'client' ? user?.company : user?.name;
                    return (
                      <div key={t.id} className="bg-white border border-green-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          {t.screenshotBase64 && (
                            <a href={t.screenshotBase64} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 block hover:scale-105 transition-transform shrink-0 shadow-sm">
                              <img src={t.screenshotBase64} alt="Comprobante" className="w-full h-full object-cover" />
                            </a>
                          )}
                          <div>
                            <p className="font-bold text-sm text-violet-900">{name} <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 uppercase ml-2">{t.userType}</span></p>
                            <p className="text-xs text-gray-500 font-mono mt-1">Ref: {t.paymentReference} | {new Date(t.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="text-right flex-1 md:flex-none">
                            <p className="text-[10px] text-gray-400 uppercase font-black">Monto a Acreditar</p>
                            <p className="text-xl font-black text-green-600">${t.amountUSD.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => validateTopUp(t.id, 'rejected', currentUser.id)} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors cursor-pointer border border-red-200">
                              <X size={18} />
                            </button>
                            <button onClick={() => validateTopUp(t.id, 'approved', currentUser.id)} className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-500 hover:text-white text-green-600 flex items-center justify-center transition-colors cursor-pointer border border-green-200">
                              <CheckCircle size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ghost Trap Forensics */}
            <div className="bg-red-50/30 rounded-[2rem] shadow-sm border border-red-100 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-red-900 flex items-center gap-2"><Lock className="text-red-500" /> Ghost Trap Forensics (Alertas de Anulación Silenciosa)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-red-100/50 text-red-800 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">ID Fraude</th>
                      <th className="py-4 px-4">Vendedor / Comercio</th>
                      <th className="py-4 px-4">Fecha de Detonación</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Monto Absorbido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.ghostLogs || []).map((log: any) => {
                      const vendedor = db.vendedores?.find((v: any) => v.id === log.vendedorId);
                      const client = db.clients?.find((c: any) => c.id === vendedor?.clientId);
                      return (
                        <tr key={log.id} className="border-b border-red-100/50 hover:bg-red-50 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-red-900 font-bold">{log.id}</td>
                          <td className="py-4 px-4 font-bold text-red-900">
                            {vendedor?.name || "Desconocido"} <span className="text-xs font-normal opacity-70">({client?.company || "N/A"})</span>
                          </td>
                          <td className="py-4 px-4 text-red-800 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-black text-red-600">+{formatUSD(log.amountUSD)}</td>
                        </tr>
                      );
                    })}
                    {(db.ghostLogs || []).length === 0 && <tr><td colSpan={4} className="text-center py-6 text-green-700 font-bold">No se han detectado intentos de anulación. Sistema blindado.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Auditoría de Cierre */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-sky-950 flex items-center gap-2"><Lock className="text-sky-600" /> Auditoría de Cierre (Reportes Z Globales)</h3>
                <div className="flex gap-2">
                  <button onClick={() => showToast("Comando TFHKA Z (SENIAT) enviado al Spooler...", "success")} className="bg-amber-100 text-amber-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-2 border border-amber-300">
                    Emitir Z Fiscal
                  </button>
                  <button onClick={() => window.print()} className="bg-sky-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-sky-950 transition-colors cursor-pointer flex items-center gap-2 shadow-md">
                    Imprimir Listado
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                      <th className="py-4 px-4">Fecha / Vendedor</th>
                      <th className="py-4 px-4">Operaciones</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Total USD</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {(db.zReports || []).map((z: any) => {
                      const client = db.clients.find((c: any) => c.id === z.clientId);
                      const vendedor = db.vendedores?.find((v: any) => v.id === z.vendedorId);
                      return (
                        <tr key={z.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-sky-950">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-slate-500">
                            <span className="block font-mono text-xs">{new Date(z.timestamp).toLocaleString()}</span>
                            <span className="block font-bold text-sky-950 text-xs">Operador: {vendedor?.name || "N/A"}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-500">{z.txCount} TXs</td>
                          <td className="py-4 px-4 text-right font-black text-emerald-600">{formatUSD(z.totalUSD)}</td>
                        </tr>
                      );
                    })}
                    {(db.zReports || []).length === 0 && <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-bold">No hay reportes Z emitidos aún.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registro Inmutable de Auditoría */}
            <div className="bg-sky-950 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-800 p-8 text-white mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Shield className="text-sky-400" /> Registro Inmutable de Auditoría (Logs)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(db.auditLogs || []).slice().reverse().map((log: any) => (
                  <div key={log.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-sky-600/20 text-sky-400 p-2 rounded-lg border border-sky-500/30">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">[{log.action}] <span className="text-slate-400 font-normal">por {log.actor}</span></p>
                      <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{new Date(log.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!db.auditLogs || db.auditLogs.length === 0) && (
                  <p className="text-slate-500 text-sm font-bold text-center py-4">No hay registros de auditoría recientes.</p>
                )}
              </div>
            </div>

            {/* Catálogo Global de Productos */}
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2"><Store className="text-sky-600" /> Catálogo Global de Productos</h3>
              <div className="overflow-x-auto max-h-96 rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black sticky top-0">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Producto</th>
                      <th className="py-4 px-4">Comercio</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {db.products.map((prod: any) => {
                      const client = db.clients.find((c: any) => c.id === prod.clientId);
                      return (
                        <tr key={prod.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-sky-950">{prod.name}</td>
                          <td className="py-4 px-4 text-slate-500 text-xs">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-slate-500 font-mono">{prod.stock}</td>
                          <td className="py-4 px-4 text-right font-black text-emerald-600">{formatUSD(prod.price)}</td>
                        </tr>
                      );
                    })}
                    {db.products.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-bold">No hay productos en el ecosistema.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="space-y-8 flex flex-col">
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2"><FileText className="text-sky-600" /> Bóveda KYC (Know Your Customer)</h3>
              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Usuario / Entidad</th>
                      <th className="py-4 px-4">Rol</th>
                      <th className="py-4 px-4">Dirección Fiscal/Residencial</th>
                      <th className="py-4 px-4 text-center">Docs</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Estado KYC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* Clientes */}
                    {db.clients?.map((client: any) => (
                      <tr key={client.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-sky-950">{client.name} <span className="text-xs text-slate-500 font-normal block">{client.company}</span></td>
                        <td className="py-4 px-4 text-xs font-bold text-sky-600">Dueño</td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs truncate" title={client.kyc_address || client.address}>{client.kyc_address || client.address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {client.kyc_photo || client.avatar ? <img src={client.kyc_photo || client.avatar} onClick={() => setViewingKycPhoto(client.kyc_photo || client.avatar)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Selfie" title="Ver Selfie/Logo" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><Camera size={16} /></span>}
                            {client.kyc_id_card_img ? <img src={client.kyc_id_card_img} onClick={() => setViewingKycPhoto(client.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Cédula" title="Ver Cédula/RIF" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${client.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{client.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                    {/* Promotoras */}
                    {db.promotoras?.map((promo: any) => (
                      <tr key={promo.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-sky-950">{promo.name}</td>
                        <td className="py-4 px-4 text-xs font-bold text-sky-600">Promotora</td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs truncate" title={promo.kyc_address}>{promo.kyc_address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {promo.kyc_photo || promo.avatar ? <img src={promo.kyc_photo || promo.avatar} onClick={() => setViewingKycPhoto(promo.kyc_photo || promo.avatar)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Selfie" title="Ver Selfie" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><Camera size={16} /></span>}
                            {promo.kyc_id_card_img ? <img src={promo.kyc_id_card_img} onClick={() => setViewingKycPhoto(promo.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Cédula" title="Ver Cédula" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${promo.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700' : promo.kyc_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{promo.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                    {/* Customers */}
                    {db.customers?.map((cust: any) => (
                      <tr key={cust.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-sky-950">{cust.name} <span className="text-xs text-slate-500 font-normal block">{cust.phone}</span></td>
                        <td className="py-4 px-4 text-xs font-bold text-slate-600">Usuario</td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs truncate" title={cust.kyc_address}>{cust.kyc_address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {cust.kyc_photo ? <img src={cust.kyc_photo} onClick={() => setViewingKycPhoto(cust.kyc_photo)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Selfie" title="Ver Selfie" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><Camera size={16} /></span>}
                            {cust.kyc_id_card_img ? <img src={cust.kyc_id_card_img} onClick={() => setViewingKycPhoto(cust.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-slate-200" alt="Cédula" title="Ver Cédula" /> : <span className="p-2.5 text-slate-300 border border-dashed border-slate-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${cust.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{cust.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "nodos" && (
          <div className="space-y-8 flex flex-col">
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 animate-fade-in">
              <h3 className="text-xl font-black mb-6 text-sky-950 flex items-center gap-2"><QrCode className="text-sky-600" /> Creador de Nodos KFS (Invitaciones)</h3>
              <p className="text-sm text-slate-500 mb-6">Genera enlaces QR oficiales para registrar nuevos actores en la economía KFS como tus referidos.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { role: 'registerCustomer', title: 'Invitar Cliente' },
                  { role: 'registerPromo', title: 'Invitar Promotora' },
                  { role: 'register', title: 'Invitar Comercio' },
                  { role: 'registerRider', title: 'Invitar Delivery' }
                ].map((invite, idx) => {
                  let host = '';
                  if (typeof window !== 'undefined') {
                    host = window.location.origin + window.location.pathname;
                  }
                  const url = `${host}?role=${invite.role}&ref=arquitecto`;
                  return (
                    <div key={idx} className="bg-sky-50/50 border border-sky-100 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm placeholder:text-slate-400">
                      <h4 className="font-black text-sky-950 mb-4">{invite.title}</h4>
                      <div className="w-full h-16 bg-sky-100 flex items-center justify-center rounded-xl mb-4 text-sky-600 shadow-sm border border-sky-200">
                        <Users size={32} />
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-sky-100 shadow-sm mb-4">
                        <QRCodeSVG value={url} size={128} bgColor="#ffffff" fgColor="#0c4a6e" level="Q" />
                      </div>
                      <input type="text" readOnly value={url} className="w-full text-[10px] bg-white border border-sky-200 rounded p-2 text-slate-500 mb-2 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                      <button onClick={() => { navigator.clipboard.writeText(url); showToast('Enlace copiado', 'success'); }} className="w-full py-2 bg-sky-600 text-white font-bold text-xs rounded hover:bg-sky-700 transition-colors shadow-md shadow-sky-600/30 cursor-pointer">Copiar Enlace</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tactical Actions Modals */}
        {activeModal === 'store' && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-2 shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black"><X size={24} /></button>
              <RegisterClientForm onRegister={(data: any, promoId: string, fee: number) => { registerClient(data, promoId, fee); setActiveModal(null); }} onCancel={() => setActiveModal(null)} />
            </div>
          </div>
        )}

        {activeModal === 'assign' && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6 border border-sky-100">
              <div className="flex justify-between items-center border-b border-sky-100 pb-4">
                <h3 className="text-xl font-black text-sky-950">Asignar Promotora</h3>
                <button onClick={() => setActiveModal(null)} className="cursor-pointer text-slate-400 hover:text-sky-950 transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Comercio (Target)</label>
                  <select value={targetClientId} onChange={e => setTargetClientId(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400">
                    <option value="">Seleccione Comercio...</option>
                    {db.clients.map((c: any) => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nueva Promotora</label>
                  <select value={targetPromotoraId} onChange={e => setTargetPromotoraId(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400">
                    <option value="">Seleccione Promotora...</option>
                    <option value="none">Sin Promotora (100% KFS)</option>
                    {db.promotoras.filter((p: any) => p.status !== 'pending').map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button onClick={() => { if (targetClientId && targetPromotoraId) { assignPromotoraToClient(targetClientId, targetPromotoraId === 'none' ? '' : targetPromotoraId); setActiveModal(null); } }} className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-black shadow-lg shadow-sky-600/30 transition-colors cursor-pointer">Aplicar Reasignación</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Storefront Customizer Modal (Arquitecto) ───────────────────── */}
      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setCustomizingClient(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-violet-900 transition-colors cursor-pointer z-10 border-none bg-transparent">
              <X size={24} />
            </button>
            <StorefrontCustomizer
              client={customizingClient}
              updateStoreSettings={(id: string, settings: any) => {
                updateStoreSettings(id, settings);
                setCustomizingClient(null);
                showToast('✅ Diseño de tienda actualizado.', 'success');
              }}
            />
          </div>
        </div>
      )}

      {activeModal === 'product' && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6 border border-sky-100">
              <div className="flex justify-between items-center border-b border-sky-100 pb-4">
                <h3 className="text-xl font-black text-sky-950">Catálogo Global</h3>
                <button onClick={() => setActiveModal(null)} className="cursor-pointer text-slate-400 hover:text-sky-950 transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre del Producto" value={globalProdName} onChange={e => setGlobalProdName(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400" />
                <input type="number" placeholder="Precio ($ USD)" value={globalProdPrice} onChange={e => setGlobalProdPrice(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400" />
                <input type="text" placeholder="Categoría" value={globalProdCategory} onChange={e => setGlobalProdCategory(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400" />
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer p-3 border border-sky-200 rounded-xl bg-sky-50">
                  <input type="checkbox" id="globalKPoints" className="w-5 h-5 accent-sky-600 rounded" defaultChecked={true} />
                  Permitir pago mixto con K-Points (Lealtad)
                </label>
                <button onClick={() => { 
                  if (globalProdName && globalProdPrice) { 
                    const allowKPoints = (document.getElementById('globalKPoints') as HTMLInputElement)?.checked;
                    addGlobalProduct({ name: globalProdName, priceUSD: parseFloat(globalProdPrice), category: globalProdCategory, allowKPoints }); 
                    setActiveModal(null); 
                  } 
                }} className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-black shadow-lg shadow-sky-600/30 transition-colors cursor-pointer">
                  Inyectar a la Red KFS
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'push' && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6 border border-sky-100">
              <div className="flex justify-between items-center border-b border-sky-100 pb-4">
                <h3 className="text-xl font-black text-red-600">Alerta Push Network</h3>
                <button onClick={() => setActiveModal(null)} className="cursor-pointer text-slate-400 hover:text-red-600 transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Audiencia Destino</label>
                  <select value={notifTarget} onChange={e => setNotifTarget(e.target.value)} className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all placeholder:text-slate-400">
                    <option value="all">Toda la Red KFS</option>
                    <option value="dueño">Comercios Afiliados</option>
                    <option value="promotora">Fuerza de Promotoras</option>
                    <option value="vendedor">Terminales (Vendedores)</option>
                  </select>
                </div>
                <input type="text" placeholder="Título Breve" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} className="w-full bg-white border border-red-200 rounded-xl p-3 font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all placeholder:text-red-300" />
                <textarea placeholder="Mensaje de impacto..." value={notifMsg} onChange={e => setNotifMsg(e.target.value)} className="w-full bg-white border border-red-200 rounded-xl p-3 font-bold text-red-600 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all placeholder:text-red-300" />
                <button onClick={() => { if (notifTitle && notifMsg) { sendNotification(notifTarget, notifTitle, notifMsg); setActiveModal(null); } }} className="w-full bg-red-600 text-white py-4 rounded-xl font-black shadow-lg shadow-red-600/30 flex justify-center gap-2 items-center hover:bg-red-700 transition-colors cursor-pointer"><Bell size={20} /> Broadcast Instantáneo</button>
              </div>
            </div>
          </div>
        )}

        {viewingKycPhoto && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            <div className="relative max-w-3xl w-full flex flex-col items-center">
              <button onClick={() => setViewingKycPhoto(null)} className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors cursor-pointer"><X size={32} /></button>
              <img src={viewingKycPhoto} alt="Visor KYC" className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-white/5" />
              <div className="mt-6 flex gap-4 w-full max-w-sm">
                {currentUser?.role === 'core' && (
                  <a href={viewingKycPhoto} download="kfs_kyc_document.jpg" className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-black text-center shadow-md shadow-sky-600/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer hover:bg-sky-700">
                    <DownloadCloud size={20} /> Descargar Documento
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {assignRiderModal !== null && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6 border border-sky-100">
              <div className="flex justify-between items-center border-b border-sky-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-sky-950 flex items-center gap-2"><Truck className="text-orange-500" size={22} /> Asignar Rider a Negocio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Máx. 2 negocios por rider • Máx. 2 riders por negocio</p>
                </div>
                <button onClick={() => { setAssignRiderModal(null); setAssignRiderBusinessId(""); }}><X size={24} className="text-slate-400 hover:text-sky-950 cursor-pointer transition-colors" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Rider Aprobado</label>
                  <select
                    value={assignRiderModal.riderId}
                    onChange={e => {
                      const r = db.riders?.find((r: any) => r.id === e.target.value);
                      setAssignRiderModal({ riderId: e.target.value, riderName: r?.name || "" });
                    }}
                    className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all placeholder:text-slate-400"
                  >
                    <option value="">Seleccione un Rider...</option>
                    {(db.riders || []).filter((r: any) => r.status === "approved").map((r: any) => (
                      <option key={r.id} value={r.id} disabled={(r.associatedBusinesses || []).length >= 2}>
                        🛵 {r.name} {(r.associatedBusinesses || []).length >= 2 ? "(Máx. negocios)" : `(${(r.associatedBusinesses || []).length}/2 negocios)`}
                      </option>
                    ))}
                  </select>
                  {(db.riders || []).filter((r: any) => r.status === "approved").length === 0 && (
                    <p className="text-xs text-amber-500 font-bold mt-1">⚠️ No hay riders aprobados. Aprueba un rider primero en la sección de abajo.</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Negocio Destino</label>
                  <select
                    value={assignRiderBusinessId}
                    onChange={e => setAssignRiderBusinessId(e.target.value)}
                    className="w-full bg-white border border-sky-200 rounded-xl p-3 font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all placeholder:text-slate-400"
                  >
                    <option value="">Seleccione un Comercio...</option>
                    {db.clients.map((c: any) => {
                      const bizRiderCount = (db.riders || []).filter((r: any) => (r.associatedBusinesses || []).includes(c.id)).length;
                      const alreadyAssigned = assignRiderModal.riderId && (db.riders || []).find((r: any) => r.id === assignRiderModal.riderId)?.associatedBusinesses?.includes(c.id);
                      return (
                        <option key={c.id} value={c.id} disabled={bizRiderCount >= 2 || !!alreadyAssigned}>
                          🏪 {c.company} {alreadyAssigned ? "(Ya asignado)" : bizRiderCount >= 2 ? "(Máx. riders)" : `(${bizRiderCount}/2 riders)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {assignRiderModal.riderId && (() => {
                  const r = db.riders?.find((r: any) => r.id === assignRiderModal.riderId);
                  const bizNames = (r?.associatedBusinesses || []).map((bId: string) => db.clients?.find((c: any) => c.id === bId)?.company).filter(Boolean);
                  return r ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <p className="text-xs font-black text-orange-700">🛵 {r.name}</p>
                      <p className="text-[10px] text-orange-500 mt-0.5">
                        {bizNames.length > 0 ? `Ya en: ${bizNames.join(", ")}` : "Sin negocios asignados aún"}
                      </p>
                      {r.pagoMovil?.banco && (
                        <p className="text-[10px] text-green-600 font-bold mt-0.5">💳 PM: {r.pagoMovil.banco} · {r.pagoMovil.telefono}</p>
                      )}
                    </div>
                  ) : null;
                })()}
                <button
                  onClick={() => {
                    if (assignRiderModal.riderId && assignRiderBusinessId) {
                      assignRiderToBusiness(assignRiderModal.riderId, assignRiderBusinessId);
                      setAssignRiderModal(null);
                      setAssignRiderBusinessId("");
                    }
                  }}
                  disabled={!assignRiderModal.riderId || !assignRiderBusinessId}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck size={18} /> Confirmar Asignación
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vista_dios" && (
          <div className="space-y-8 flex flex-col animate-fade-in">
            <div className="bg-gradient-to-r from-slate-900 to-sky-950 rounded-[2rem] p-8 shadow-2xl text-white border border-sky-800">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-white"><Eye className="text-sky-400" /> Vista de Dios (Read-Only)</h3>
              <p className="text-sm text-sky-200 mb-8">Acceso directo a la capa de datos. Todo el ecosistema unificado.</p>
              
              <div className="space-y-8">
                {/* Tabla de Z-Reports (Flujos de Caja) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-sky-400 font-black uppercase tracking-widest text-sm mb-4">Flujos de Caja Consolidados (Z-Reports)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="pb-2">Fecha</th>
                          <th className="pb-2">Comercio</th>
                          <th className="pb-2">Bruto</th>
                          <th className="pb-2">Comisiones KFS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.zReports?.slice().reverse().slice(0, 50).map((z: any) => (
                          <tr key={z.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-slate-300">{new Date(z.timestamp).toLocaleDateString()}</td>
                            <td className="py-3 text-white font-bold">{z.clientName}</td>
                            <td className="py-3 text-emerald-400 font-bold">{formatUSD(z.totalSalesUSD)}</td>
                            <td className="py-3 text-sky-300 font-bold">{formatUSD(z.kfsFeesOwedUSD)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla de Usuarios Activos */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-sky-400 font-black uppercase tracking-widest text-sm mb-4">Usuarios Activos en Red</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase">Dueños</span>
                      <span className="text-2xl font-black text-white">{db.clients?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase">Promotoras</span>
                      <span className="text-2xl font-black text-white">{db.promotoras?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase">Delivery</span>
                      <span className="text-2xl font-black text-white">{db.riders?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase">Consumidores</span>
                      <span className="text-2xl font-black text-white">{db.customers?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tabla de Últimas Transacciones */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-sky-400 font-black uppercase tracking-widest text-sm mb-4">Pipeline de Transacciones</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="pb-2">Fecha</th>
                          <th className="pb-2">Comprador</th>
                          <th className="pb-2">Tienda</th>
                          <th className="pb-2">Total USD</th>
                          <th className="pb-2">Método</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.transactions?.slice().reverse().slice(0, 50).map((t: any) => (
                          <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-slate-300">{new Date(t.timestamp).toLocaleTimeString()}</td>
                            <td className="py-3 text-slate-400">{t.customerName || t.customerPhone}</td>
                            <td className="py-3 text-white">{t.clientName}</td>
                            <td className="py-3 text-emerald-400 font-bold">{formatUSD(t.totalUSD)}</td>
                            <td className="py-3 text-slate-500 text-[10px] uppercase">{t.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewingCandidateCv && (
          <CvViewerModal
            isOpen={!!viewingCandidateCv}
            onClose={() => setViewingCandidateCv(null)}
            candidate={viewingCandidateCv}
          />
        )}


        {activeTab === "db_manager" && (
          <DatabaseManagerWidget 
            db={db}
            deleteClient={deleteClient}
            deleteCustomer={deleteCustomer}
            deletePromotora={deletePromotora}
            deleteVendedor={deleteVendedor}
            rejectRider={rejectRider}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tienda_oficial" && (
          <div className="space-y-8 flex flex-col animate-fade-in relative">
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-sky-600 to-sky-400 rounded-[2rem] shadow-lg shadow-sky-600/30 flex items-center justify-center mb-6">
                <Store className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-sky-950 mb-2">Tienda Oficial KFS</h2>
              <p className="text-slate-500 font-bold mb-8 max-w-md">
                Administra el inventario del Marketplace Global (Flow Express). Los productos aquí subidos forzarán el consumo de K-Points.
              </p>
              
              <button 
                onClick={() => {
                  const oficialStore = db.clients?.find((c: any) => c.id === "kfs-express");
                  if (oficialStore) {
                    impersonateClient(oficialStore);
                  } else {
                    showToast("Error: No se encontró la tienda matriz en la DB.", "error");
                  }
                }}
                className="bg-sky-950 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-black transition-all cursor-pointer shadow-xl hover:-translate-y-1 border-none"
              >
                <Database className="w-6 h-6 text-sky-400" />
                Acceder como Dueño de Tienda
              </button>
            </div>
          </div>
        )}
      </div>


      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-sky-100 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-around items-center relative">
          {[
            { id: "panel", icon: Activity, label: "Panel" },
            { id: "red", icon: Store, label: "Red KFS", badge: (db.riders?.filter((r: any) => r.status === "pending") || []).length },
            { id: "soporte", icon: Bell, label: "Soporte", badge: (db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').length + (db.candidates?.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').length || 0) + (db.unlockedContacts?.filter((u: any) => u.status === 'pending_approval').length || 0) + (db.supportTickets || []).filter((t: any) => t.status === 'open').length) },
            { id: "auditoria", icon: Shield, label: "Auditoría" },
            { id: "kyc", icon: FileText, label: "Bóveda KYC" },
            { id: "nodos", icon: QrCode, label: "Nodos KFS" },
            { id: "vista_dios", icon: Eye, label: "Vista Dios" },
            { id: "db_manager", icon: Database, label: "Gestión DB" },
            { id: "tienda_oficial", icon: Store, label: "Tienda KFS" }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
              >
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-sky-600 rounded-b-full shadow-[0_4px_10px_rgba(2,132,199,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-sky-600' : 'text-slate-400 group-hover:text-sky-500'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse shadow-sm">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-sky-950' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
