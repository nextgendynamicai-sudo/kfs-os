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

export const CustomerDashboard = ({ db, currentUser, logout, setView }: any) => {
  const { formatUSD, registerCandidate, showToast, markNotificationsAsRead, requestTopUp, claimFlowMaster } = useKFS() as any;
  const [subTab, setSubTab] = useState("profile"); // profile | jobs
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const { transferP2P } = useP2PTransfer();
  const [p2pRecipient, setP2pRecipient] = useState("");
  const [p2pAmount, setP2pAmount] = useState("");
  const [p2pType, setP2pType] = useState<"real_balance" | "k_points_balance">("real_balance");

  const handleP2PTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(p2pAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("Por favor ingresa un monto válido.", "error");
      return;
    }
    const success = transferP2P(currentUser.phone, p2pRecipient, amountNum, p2pType);
    if (success) {
      setP2pRecipient("");
      setP2pAmount("");
    }
  };

  if (!currentUser) return null;

  // Aggregate CRM points
  const crmEntry = db.crm?.find((c: any) => c.phone === currentUser.phone);
  const totalPoints = crmEntry?.kfsPoints || 0;

  // Aggregate transactions by store
  const userTransactions = db.transactions?.filter((tx: any) => tx.customerPhone === currentUser.phone) || [];
  const historyByStore = userTransactions.reduce((acc: any, tx: any) => {
    if (!acc[tx.clientId]) {
      acc[tx.clientId] = {
        clientId: tx.clientId,
        purchasesCount: 0,
        totalSpent: 0
      };
    }
    acc[tx.clientId].purchasesCount += 1;
    acc[tx.clientId].totalSpent += tx.amountUSD;
    return acc;
  }, {});
  const historyEntries = Object.values(historyByStore) as any[];

  const activeOrders = db.orders?.filter((o: any) => o.customerPhone === currentUser.phone && o.status === 'pending') || [];
  const logisticsTxs = db.transactions?.filter((tx: any) => tx.customerPhone === currentUser.phone && (tx.shippingStatus === 'pending' || tx.shippingStatus === 'dispatched')) || [];

  // FlowMaster Gamification Logic
  const txCount = userTransactions.length;
  const uniqueMerchants = historyEntries.length;
  const volumeUSD = userTransactions.reduce((acc: number, tx: any) => acc + (tx.amountUSD || 0), 0);
  const volumeKPoints = volumeUSD * 1000;
  
  const meetsFlowMaster = txCount >= 10 && uniqueMerchants >= 4 && volumeKPoints >= 50000;

  // Candidate Form States
  const currentCandidate = db.candidates?.find((c: any) => c.phone === currentUser.phone);
  const unreadNotifsCount = currentCandidate?.notifications?.filter((n: any) => !n.read).length || 0;

  const [bio, setBio] = useState(currentCandidate?.bio || "");
  const [email, setEmail] = useState(currentCandidate?.email || "");
  const [selectedRole, setSelectedRole] = useState(currentCandidate?.role || "Cajero");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentCandidate?.skills || []);
  const [answers, setAnswers] = useState<Record<string, string>>(currentCandidate?.answers || {
    availability: "full-time",
    location: "Caracas - Centro",
    experienceYears: "1-3",
    hasVehicle: "no"
  });
  const [isActive, setIsActive] = useState(currentCandidate ? (currentCandidate.active !== false) : true);

  // CV Upload States
  const [cvFile, setCvFile] = useState(currentCandidate?.cvFile || "");
  const [cvFileType, setCvFileType] = useState(currentCandidate?.cvFileType || "");
  const [cvFileName, setCvFileName] = useState(currentCandidate?.cvFileName || "");

  // Registration Payment $1 USD States
  const [regRefNum, setRegRefNum] = useState("");
  const [regScreenshot, setRegScreenshot] = useState("");

  const [useKfsCvBuilder, setUseKfsCvBuilder] = useState(currentCandidate?.useKfsCvBuilder || false);
  const [showCvModal, setShowCvModal] = useState(false);

  const availableSkills = [
    "Cuadre de caja", "Uso de POS", "Atención al cliente",
    "Lector de código de barras", "Control de inventario",
    "Ventas retail", "Facturación fiscal", "Manejo de delivery"
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio.trim() || !email.trim()) {
      showToast("Por favor completa los campos obligatorios (Correo y Presentación).", "error");
      return;
    }
    if (!useKfsCvBuilder && !cvFile) {
      showToast(`Debe cargar su Currículum Vitae en PDF/Imagen o activar el CV Digital ${KFS_BRAND.productAcronym}.`, "error");
      return;
    }

    const isPaid = currentCandidate?.registrationPaymentStatus === "approved";
    let nextStatus = currentCandidate?.registrationPaymentStatus || "unpaid";
    
    // Check for $1 USD if not paid
    if (!isPaid) {
      if (!regRefNum || !regScreenshot) {
        showToast("Debes subir tu comprobante de Pago Móvil de $1.00 USD para activar tu perfil.", "error");
        return;
      }
      nextStatus = "pending_approval";
    }

    registerCandidate({
      id: currentCandidate?.id || `cand_${Date.now()}`,
      phone: currentUser.phone,
      name: currentUser.name,
      email,
      bio,
      role: selectedRole,
      skills: selectedSkills,
      answers,
      status: currentCandidate?.status || "pending",
      active: isActive,
      cvFile: useKfsCvBuilder ? "" : cvFile,
      cvFileType: useKfsCvBuilder ? "" : cvFileType,
      cvFileName: useKfsCvBuilder ? "" : cvFileName,
      useKfsCvBuilder,
      registrationPaymentStatus: nextStatus,
      registrationPaymentRef: regRefNum || currentCandidate?.registrationPaymentRef || "N/A",
      registrationPaymentProof: regScreenshot || currentCandidate?.registrationPaymentProof || "N/A",
      hiringState: currentCandidate?.hiringState || "available",
      interviewingClientId: currentCandidate?.interviewingClientId || null
    }, currentUser.id);
  };

  return (
    <div className="min-h-screen bg-sky-50 text-sky-950 font-sans pb-24 relative">
      {/* Wavy Header */}
      <div className="bg-sky-600 rounded-b-[3rem] shadow-lg shadow-sky-600/20 pt-6 pb-12 px-6 text-white relative z-10 border-b border-sky-400">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-white"><UserCheck size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">{KFS_BRAND.productAcronym} Customer</h1>
          </div>
          <div className="flex items-center gap-2">
              <div className="bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/30 backdrop-blur-md" title="Billetera Axis Points">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-100">Axis Pts</span>
                <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>
              </div>
              <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">
                <LogOut size={16} />
              </button>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 font-black text-2xl flex-shrink-0 shadow-md border-4 border-sky-100 relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{currentUser.name}</h2>
            <p className="text-sky-100 font-mono text-xs mt-1 bg-sky-700 inline-block px-2 py-0.5 rounded-md">{currentUser.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 space-y-6 animate-fade-in">
        <OracleInsightCard role="customer" data={{ walletBalance: currentUser.walletUSD || 0 }} />

        {subTab === "profile" ? (
          <>
            {/* Universal Wallet Widget */}
            <UniversalWalletWidget currentUser={currentUser} formatUSD={formatUSD}>
              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4 mt-2">
                <div>
                  <h4 className="text-sm font-black text-gray-200">Recarga Express</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Acredita saldo Fiat al instante.</p>
                </div>
                <button
                  onClick={() => { setTopUpAmount("5"); setIsTopUpOpen(true); }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer border-none shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                >
                  Recargar Ahora
                </button>
              </div>
            </UniversalWalletWidget>

            {/* FlowMaster Gamification Tracker */}
            <div className="bg-white border border-sky-100 rounded-[2.5rem] p-5 shadow-2xl shadow-sky-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center border border-sky-200 shadow-sm">
                  <Star className={currentUser.isFlowMaster ? "text-yellow-400" : "text-sky-300"} size={20} />
                </div>
                <div>
                  <h4 className="text-sky-950 font-black text-sm">Rango FlowMaster</h4>
                  <p className="text-slate-500 text-[10px] mt-0.5">{currentUser.isFlowMaster ? "¡Eres FlowMaster! AOF exento." : "Completa los hitos para exentar el AOF y subir de rango."}</p>
                </div>
              </div>

              {!currentUser.isFlowMaster && (
                <div className="space-y-3 mb-4 relative z-10">
                  <div className="bg-sky-50/50 rounded-lg p-2.5 flex justify-between items-center border border-sky-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">10 Transacciones</span>
                    <span className={`text-xs font-black ${txCount >= 10 ? 'text-sky-600' : 'text-slate-400'}`}>{txCount}/10</span>
                  </div>
                  <div className="bg-sky-50/50 rounded-lg p-2.5 flex justify-between items-center border border-sky-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">4 Comercios Distintos</span>
                    <span className={`text-xs font-black ${uniqueMerchants >= 4 ? 'text-sky-600' : 'text-slate-400'}`}>{uniqueMerchants}/4</span>
                  </div>
                  <div className="bg-sky-50/50 rounded-lg p-2.5 flex justify-between items-center border border-sky-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">50K Puntos ($50) Movidos</span>
                    <span className={`text-xs font-black ${volumeKPoints >= 50000 ? 'text-sky-600' : 'text-slate-400'}`}>{volumeKPoints.toLocaleString()}/50,000 Axis Points</span>
                  </div>
                </div>
              )}

              {!currentUser.isFlowMaster && meetsFlowMaster && (
                <button
                  onClick={() => claimFlowMaster(currentUser.id)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black py-3 rounded-xl transition-all shadow-[0_5px_15px_rgba(234,179,8,0.3)] border-none animate-bounce cursor-pointer relative z-10"
                >
                  ¡Reclamar Rango FlowMaster!
                </button>
              )}
            </div>

            <TopUpModal
              isOpen={isTopUpOpen}
              onClose={() => setIsTopUpOpen(false)}
              amount={topUpAmount}
              setAmount={setTopUpAmount}
              onSubmit={(amount: number, ref: string, img: string) => {
                requestTopUp(currentUser.id, 'customer', amount, ref, img);
              }}
              userType="customer"
            />

            {/* P2P Transfer Form */}
            <div className="bg-white border border-sky-100 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-sky-200/50 space-y-5">
              <div>
                <h3 className="text-xl font-black text-sky-700 flex items-center gap-2">
                  <Users size={24} /> Transferencias P2P Instantáneas
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Envía Saldo Real o {KFS_BRAND.economy.currency} a cualquier contacto registrado en la red {KFS_BRAND.productAcronym} OS al instante.
                </p>
              </div>

              {/* Bono Viral Embajador — QR Real Escaneable */}
              <div className="bg-sky-50 border border-sky-100 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 bg-white rounded-xl p-1.5 border border-sky-200 shadow-sm flex-shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id)}`}
                    alt="QR Referido"
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Gift size={18} className="text-sky-600" />
                    <h4 className="font-black text-sky-950 text-base">Bono Viral Embajador</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    Escanea o comparte tu QR. Cuando tu referido haga su primera recarga de <strong className="text-sky-600">$5.00+</strong>, recibirás <strong className="text-sky-600">+500 {KFS_BRAND.economy.currency} ($0.50)</strong> automáticos.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-mono bg-white border border-sky-200 px-2 py-1 rounded-lg text-sky-700 text-xs">ID: {currentUser.id}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); showToast('📋 Enlace copiado.', 'success'); }}
                      className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      📋 Copiar Enlace
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleP2PTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Destinatario (Teléfono o Nombre)</label>
                    <input
                      type="text"
                      placeholder="Ej: 04121234567 o Nombre"
                      value={p2pRecipient}
                      onChange={(e) => setP2pRecipient(e.target.value)}
                      className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-950 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Monto a Enviar</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ej: 5.00 o 500"
                      value={p2pAmount}
                      onChange={(e) => setP2pAmount(e.target.value)}
                      className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-950 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setP2pType("real_balance")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p2pType === "real_balance" ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/30" : "bg-sky-50 border-sky-100 text-slate-500 hover:border-sky-200"}`}
                    >
                      Saldo Real (USD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setP2pType("k_points_balance")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p2pType === "k_points_balance" ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/30" : "bg-sky-50 border-sky-100 text-slate-500 hover:border-sky-200"}`}
                    >
                      {KFS_BRAND.economy.currency}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-100 text-sky-600 rounded-xl px-6 py-2.5 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm self-end sm:self-auto font-sans"
                  >
                    Transferir Balance <ArrowUpRight size={14} />
                  </button>
                </div>
              </form>
            </div>

            {/* Overdrive Digital Catalog */}
            <FlowExpressCatalog currentUser={currentUser} formatUSD={formatUSD} />

            {/* Logistics Tracking */}
            {(activeOrders.length > 0 || logisticsTxs.length > 0) && (
              <div className="bg-white border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-sky-200/50">
                <h3 className="text-xl font-black mb-6 text-sky-700 flex items-center gap-2"><Truck size={24} /> Rastreo de Envíos Activos</h3>
                <div className="space-y-4">
                  {activeOrders.map((o: any) => {
                    const p = db.products.find((prod: any) => prod.id === o.productId);
                    return (
                      <div key={o.id} className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-orange-600">{p?.name || "Producto Online"}</h4>
                          <p className="text-xs text-orange-500/70 mt-1">Ref: {o.paymentReference} | Pendiente de Aprobación por el Vendedor</p>
                        </div>
                        <Clock className="text-orange-400 animate-pulse" />
                      </div>
                    );
                  })}
                  {logisticsTxs.map((tx: any) => {
                    const p = db.products.find((prod: any) => prod.id === tx.productId);
                    const isDispatched = tx.shippingStatus === 'dispatched';
                    const isPickedUp = tx.shippingStatus === 'picked_up';
                    const isDelivered = tx.shippingStatus === 'delivered';
                    return (
                      <div key={tx.id} className={`${isDelivered ? 'bg-slate-50 border-slate-200' : isPickedUp ? 'bg-purple-50 border-purple-100' : isDispatched ? 'bg-emerald-50 border-emerald-100' : 'bg-sky-50 border-sky-100'} border p-5 rounded-2xl space-y-4 relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                          <div>
                            <h4 className={`font-bold ${isDelivered ? 'text-slate-600' : isPickedUp ? 'text-purple-600' : isDispatched ? 'text-emerald-600' : 'text-sky-600'}`}>{p?.name || "Producto Online"}</h4>
                            <p className={`text-xs mt-1 ${isDelivered ? 'text-slate-500' : isPickedUp ? 'text-purple-500/70' : isDispatched ? 'text-emerald-500/70' : 'text-sky-500/70'}`}>
                              {isDelivered ? '✅ Entregado' : isPickedUp ? '🛵 Tu Rider recogió el pedido y va en camino.' : isDispatched ? '📦 Tu paquete fue asignado a un Rider y está esperando recolección.' : '⏳ Pago Aprobado. Vendedor empacando'}
                            </p>
                          </div>
                          {isDelivered ? <CheckCircle className="text-slate-400" /> : isPickedUp ? <MapPin className="text-purple-500 animate-bounce" /> : isDispatched ? <Truck className="text-emerald-500 animate-pulse" /> : <Package className="text-sky-500 animate-pulse" />}
                        </div>

                        {/* Live Map */}
                        {isPickedUp && (
                          <div className="mt-4">
                            <LiveMap
                              role="customer"
                              storePos={getStoreCoords(tx.clientId)}
                              customerPos={getCustomerCoords(tx.customerPhone || "default_cust")}
                              riderPos={
                                (() => {
                                  const r = db.riders?.find((r: any) => r.id === tx.assignedRiderId);
                                  return r?.lastLat && r?.lastLng ? { lat: r.lastLat, lng: r.lastLng } : getStoreCoords(tx.clientId);
                                })()
                              }
                              className="h-48"
                            />
                            <div className="flex justify-between items-center mt-3 bg-white/60 rounded-lg px-3 py-2 border border-purple-200 backdrop-blur-md">
                              <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5"><Clock size={12} className="text-purple-500" /> ETA Estimado</p>
                              <p className="text-xs font-black text-purple-900">~ 12 min</p>
                            </div>
                          </div>
                        )}
                        {tx.assignedRiderName && (
                          <div className="bg-white/50 rounded-xl p-3 flex items-center justify-between border border-white/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-black">
                                🛵
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tu Rider</p>
                                <p className="text-sm font-black text-slate-700">{tx.assignedRiderName}</p>
                              </div>
                            </div>
                            {/* Rating Widget if Delivered */}
                            {isDelivered && !tx.riderRating && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => {
                                      const { rateRider } = useKFS() as any;
                                      rateRider(tx.id, star);
                                    }}
                                    className="text-slate-300 hover:text-yellow-400 transition-colors text-lg"
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            )}
                            {tx.riderRating && (
                              <div className="text-yellow-500 text-sm font-black flex items-center gap-1">
                                {tx.riderRating} ★
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchase History */}
            <div className="bg-white border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-sky-200/50">
              <h3 className="text-xl font-black mb-6 text-sky-700 flex items-center gap-2"><Activity size={24} /> Historial de Tiendas Visitadas</h3>
              {historyEntries.length === 0 ? (
                <div className="text-center py-10 opacity-70">
                  <Package size={48} className="mx-auto mb-4 text-sky-300" />
                  <p className="font-bold text-sky-900">Aún no tienes historial de compras.</p>
                  <p className="text-xs text-slate-500 mt-1">Visita tiendas {KFS_BRAND.productAcronym} o compra en {KFS_BRAND.modules.marketplace}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyEntries.map((c: any, i: number) => {
                    const store = db.clients.find((cl: any) => cl.id === c.clientId);
                    return (
                      <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-sky-50/50 rounded-xl border border-sky-100 hover:border-sky-300 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-600 shadow-sm border border-sky-100">
                            <Store size={18} />
                          </div>
                          <div>
                            <p className="font-black text-sky-950 text-lg">{store?.company || `${KFS_BRAND.modules.marketplace} Desconocida`}</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold">{c.purchasesCount} Compras Registradas</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg shadow-sm sm:shadow-none border border-sky-100 sm:border-none">
                          <p className="text-[10px] text-slate-400 font-mono">Volumen Gastado</p>
                          <p className="text-sky-600 font-black text-xl">{formatUSD(c.totalSpent)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Jobs Tab Container */
          <div className="space-y-6">
            {/* Candidate Notifications Section */}
            {currentCandidate?.notifications && currentCandidate.notifications.length > 0 && (
              <div className="bg-white border border-sky-100 rounded-[2rem] p-6 space-y-4 animate-fade-in shadow-xl shadow-sky-200/50">
                <div className="flex justify-between items-center border-b border-sky-100 pb-3">
                  <h4 className="text-sm font-black text-sky-700 uppercase tracking-wider flex items-center gap-2">
                    <Bell size={16} /> Notificaciones de Empleo
                  </h4>
                  {unreadNotifsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markNotificationsAsRead(currentCandidate.id)}
                      className="text-[10px] text-slate-500 hover:text-sky-600 underline cursor-pointer"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {[...currentCandidate.notifications].reverse().map((n: any) => (
                    <div key={n.id} className={`p-4 rounded-xl border transition-all text-xs ${n.read ? 'bg-sky-50 border-sky-100 text-slate-500' : 'bg-sky-100/50 border-sky-300 text-sky-950 font-bold shadow-sm'}`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="uppercase tracking-wider font-black text-sky-700">{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">{new Date(n.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className={`mt-1 font-normal leading-relaxed ${n.read ? 'text-slate-500' : 'text-sky-900'}`}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentCandidate?.registrationPaymentStatus === "pending_approval" ? (
              <div className="bg-white border border-yellow-200 rounded-[2rem] p-8 shadow-xl shadow-yellow-200/30 text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
                <div className="w-20 h-20 bg-yellow-50 rounded-full border border-yellow-300 flex items-center justify-center mx-auto shadow-sm">
                  <Clock size={36} className="text-yellow-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-sky-950">Postulación en Espera de Verificación</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hemos recibido tu postulación laboral y tu reporte de pago de **$1.00 USD**. Nuestro equipo de soporte técnico de {KFS_BRAND.productAcronym} OS está verificando la transferencia y auditando tu CV.
                  </p>
                  <p className="text-xs text-sky-700 font-mono mt-1">
                    Referencia de pago de activación: <span className="font-bold">{currentCandidate.registrationPaymentRef}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-sky-100 text-xs text-slate-500">
                  Tu perfil se activará en la bolsa de trabajo tan pronto como el pago sea conciliado.
                </div>
              </div>
            ) : (
              /* Jobs Tab Form Container */
              <div className="bg-white border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-sky-200/50 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-sky-100 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-sky-700 flex items-center gap-2">
                      <Briefcase size={26} /> Mi Perfil Laboral
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Configura tu perfil profesional para ser visible ante dueños de comercios {KFS_BRAND.productAcronym} OS.</p>
                  </div>

                  {currentCandidate ? (
                    currentCandidate.status === "backed" ? (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black shadow-sm shadow-yellow-200/30 animate-pulse">
                        <Award size={16} className="text-yellow-500" />
                        <span>Perfil Respaldado por {KFS_BRAND.productAcronym} OS</span>
                      </div>
                    ) : (
                      <div className="bg-sky-50 border border-sky-200 text-sky-600 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                        <Clock size={16} className="animate-spin" />
                        <span>Perfil en Evaluación {KFS_BRAND.productAcronym}</span>
                      </div>
                    )
                  ) : (
                    <span className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">Sin postularse</span>
                  )}
                </div>

                <form onSubmit={handleSaveCandidate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 block">Nombre Completo</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 block">Teléfono (WhatsApp)</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.phone}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 block">Correo Electrónico (Obligatorio)</label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 block">Cargo de Interés</label>
                      <select
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                        className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Cajero">Cajero / Cajera</option>
                        <option value="Vendedor">Vendedor de {KFS_BRAND.modules.marketplace}</option>
                        <option value="Almacenista">Almacenista / Despachador</option>
                        <option value="Administrador">Administrador de Local</option>
                        <option value="Delivery">Delivery / Mensajero</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 block">Presentación y Experiencia Laboral (Obligatorio)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe detalladamente tu experiencia, referencias y por qué eres un excelente candidato..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-950 placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block">Currículum Vitae (Obligatorio)</label>
                      <button
                        type="button"
                        onClick={() => setUseKfsCvBuilder(!useKfsCvBuilder)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${useKfsCvBuilder ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "bg-sky-50 border border-sky-100 text-slate-500 hover:text-sky-700 hover:bg-sky-100"}`}
                      >
                        {useKfsCvBuilder ? `⚡ Usando CV Digital ${KFS_BRAND.productAcronym}` : `📄 Usar CV Digital ${KFS_BRAND.productAcronym}`}
                      </button>
                    </div>

                    {useKfsCvBuilder ? (
                      <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <p className="text-xs text-sky-700 font-bold">✨ CV Digital Autogenerado {KFS_BRAND.productAcronym} OS</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Se generará un currículum formateado profesionalmente con tu Bio, Habilidades y Respuestas.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCvModal(true)}
                          className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-all cursor-pointer shadow-md shadow-sky-600/30 border-none"
                        >
                          Previsualizar / Imprimir CV
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-sky-50 border border-sky-100 p-5 rounded-2xl">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setCvFileName(file.name);
                                setCvFileType(file.type);
                                const base64 = await readAsBase64(file);
                                setCvFile(base64);
                                showToast("Currículum cargado.", "success");
                              } catch (err) {
                                showToast("Error al leer el archivo.", "error");
                              }
                            }
                          }}
                          className="text-xs text-slate-500 block w-full sm:w-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer"
                        />
                        {cvFileName && (
                          <div className="flex items-center gap-2 text-xs font-bold text-sky-600">
                            <span>📄 {cvFileName}</span>
                            <button
                              type="button"
                              onClick={() => window.open(cvFile, '_blank')}
                              className="text-[10px] text-sky-400 underline cursor-pointer hover:text-sky-700"
                            >
                              (Ver actual)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {showCvModal && (
                      <CvViewerModal
                        isOpen={showCvModal}
                        onClose={() => setShowCvModal(false)}
                        candidate={{
                          name: currentUser.name,
                          phone: currentUser.phone,
                          email: email || currentCandidate?.email || "correo@ejemplo.com",
                          bio: bio || currentCandidate?.bio || "Bio...",
                          role: selectedRole || currentCandidate?.role || "Cajero",
                          skills: selectedSkills || currentCandidate?.skills || [],
                          answers: answers || currentCandidate?.answers || {},
                          id: currentCandidate?.id || "cand_demo"
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3 block">Habilidades Técnicas</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "bg-sky-50 border border-sky-100 text-slate-500 hover:text-sky-700 hover:bg-sky-100"}`}
                          >
                            {isSelected && <Check size={12} />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl space-y-4">
                    <h4 className="text-sky-700 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Shield size={14} /> Micro-Encuesta de Compatibilidad
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Disponibilidad</label>
                        <select
                          value={answers.availability}
                          onChange={e => setAnswers(prev => ({ ...prev, availability: e.target.value }))}
                          className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 cursor-pointer"
                        >
                          <option value="full-time">Tiempo Completo (Full-time)</option>
                          <option value="part-time">Medio Tiempo (Part-time)</option>
                          <option value="weekends">Fines de Semana</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ubicación (Residencia)</label>
                        <select
                          value={answers.location}
                          onChange={e => setAnswers(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 cursor-pointer"
                        >
                          <option value="Caracas - Este">Caracas - Este</option>
                          <option value="Caracas - Oeste">Caracas - Oeste</option>
                          <option value="Caracas - Centro">Caracas - Centro</option>
                          <option value="Fuera de Caracas">Fuera de Caracas</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Años de Experiencia</label>
                        <select
                          value={answers.experienceYears}
                          onChange={e => setAnswers(prev => ({ ...prev, experienceYears: e.target.value }))}
                          className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 cursor-pointer"
                        >
                          <option value="0-1">Menos de 1 año</option>
                          <option value="1-3">1 a 3 años</option>
                          <option value="3+">Más de 3 años</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">¿Posee Transporte Propio?</label>
                        <select
                          value={answers.hasVehicle}
                          onChange={e => setAnswers(prev => ({ ...prev, hasVehicle: e.target.value }))}
                          className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 cursor-pointer"
                        >
                          <option value="no">No posee</option>
                          <option value="moto">Moto propia</option>
                          <option value="carro">Carro propio</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {currentCandidate?.registrationPaymentStatus !== "approved" && (
                    <div className="bg-sky-50 border border-sky-100 p-6 rounded-[2rem] space-y-4 shadow-sm">
                      <h4 className="text-sm font-black text-sky-700 uppercase tracking-wider border-b border-sky-200 pb-2">
                        Pago de Activación de Perfil ($1.00 USD)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Para activar tu perfil en la Bolsa de Trabajo de {KFS_BRAND.productAcronym} OS y ser visible ante dueños de locales, debes realizar un pago único de <strong className="text-sky-900">$1.00 USD</strong>.
                      </p>

                      <div className="bg-white border border-sky-200 p-4 rounded-xl space-y-2 font-mono text-xs text-slate-600">
                        <p><strong className="text-sky-700">Banco:</strong> Banco Nacional de Crédito (BNC)</p>
                        <p><strong className="text-sky-700">Teléfono:</strong> 0414-0000000</p>
                        <p><strong className="text-sky-700">Cédula:</strong> V-25.218.648</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Referencia de Pago Móvil</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: 12345678"
                            value={regRefNum}
                            onChange={(e) => setRegRefNum(e.target.value)}
                            className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Comprobante de Pago</label>
                          {regScreenshot ? (
                            <div className="relative group rounded-xl overflow-hidden border border-sky-200 aspect-video">
                              <img src={regScreenshot} alt="Comprobante" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => setRegScreenshot("")} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-black py-2 px-4 rounded-lg cursor-pointer">Borrar Imagen</button>
                              </div>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-sky-200 hover:border-sky-400 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition-colors bg-white">
                              <Camera size={24} className="text-sky-400 mb-2" />
                              <span className="text-sm font-bold text-sky-700">Subir Captura</span>
                              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG (Máx. 5MB)</span>
                              <input type="file" required accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const { compressImage } = await import('../../lib/utils');
                                    const base64 = await compressImage(file, 800, 0.7);
                                    setRegScreenshot(base64 as string);
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }
                              }} />
                            </label>
                          )}
                        </div>
                      </div>

                      {currentCandidate?.registrationPaymentStatus === "rejected" && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold animate-pulse">
                          ⚠️ Tu perfil fue RECHAZADO por el administrador. Modifica tus datos y vuelve a intentarlo.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-center bg-sky-50 border border-sky-100 p-5 rounded-2xl gap-4">
                    <div>
                      <h4 className="text-sm font-black text-sky-950">Estado de Búsqueda Activa</h4>
                      <p className="text-xs text-slate-500">Si lo desactivas, los comercios no verán tu perfil en las búsquedas hasta que decidas reactivarlo.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none ${isActive ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 hover:bg-slate-300 text-slate-500"}`}
                    >
                      {isActive ? "🟢 Visible (Buscando Trabajo)" : "🔴 Pausado (Oculto)"}
                    </button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-sky-600 text-white border-none px-8 py-4 rounded-xl font-black hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-600/30"
                    >
                      <FileText size={18} /> {currentCandidate ? "Actualizar Perfil Laboral" : "Publicar Perfil Profesional"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-sky-100 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(14,165,233,0.05)] pb-safe">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-center gap-10 items-center relative">
          {[
            { id: "profile", icon: Activity, label: "Mi Cuenta" },
            { id: "jobs", icon: Briefcase, label: "Empleos", badge: unreadNotifsCount }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group border-none bg-transparent"
              >
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-sky-500 rounded-b-full shadow-[0_4px_10px_rgba(14,165,233,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-sky-900' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  );
}
