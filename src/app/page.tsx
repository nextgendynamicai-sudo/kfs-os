import { KFS_BRAND } from "../config/brandConfig";
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
import { useKFS } from "../context/KFSContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckoutModal } from "../components/CheckoutModal";
import { TopUpModal } from "../components/TopUpModal";
import { PayoutModal } from "../components/PayoutModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { UniversalWalletWidget } from "../components/UniversalWalletWidget";
import { ProfileAvatarEditor } from "../components/ProfileAvatarEditor";
import { Toast } from "../components/Toast";
export { CvViewerModal } from "../components/CvViewerModal";
export { SMSConciliatorSimulator } from "../components/SMSConciliatorSimulator";
export { KFSFinancialSplitCalculator } from "../components/KFSFinancialSplitCalculator";
export { FiscalPrinterSetupWidget } from "../components/FiscalPrinterSetupWidget";
export { KFSIoTEdgeConsole } from "../components/KFSIoTEdgeConsole";
export { KreatekLogo } from "../components/KreatekLogo";
export { Navbar } from "../components/Navbar";
export { RegisterClientForm } from "../components/RegisterClientForm";
export { RegisterPromotoraForm } from "../components/RegisterPromotoraForm";
export { RegisterCustomerForm } from "../components/RegisterCustomerForm";
export { RegisterRiderForm } from "../components/RegisterRiderForm";
export { StorefrontCustomizer } from "../components/StorefrontCustomizer";
export { OnboardingWizard } from "../components/OnboardingWizard";
export { RecruitmentWidget } from "../components/RecruitmentWidget";
export { ScannerView } from "../components/ScannerView";

import { CoreDashboard } from "../components/dashboards/CoreDashboard";
import { PromotoraDashboard } from "../components/dashboards/PromotoraDashboard";
import { ClientDashboard } from "../components/dashboards/ClientDashboard";
import { VendedorDashboard } from "../components/dashboards/VendedorDashboard";
import { RiderDashboard } from "../components/dashboards/RiderDashboard";
import { CustomerDashboard } from "../components/dashboards/CustomerDashboard";
import { LoginView } from "../components/dashboards/LoginView";
import { MarketplaceView } from "../components/dashboards/MarketplaceView";
import { LandingPageView } from "../components/dashboards/LandingPageView";


import { FlowExpressCatalog } from "../components/FlowExpressCatalog";
import { B2BSelfOnboarding } from "../components/B2BSelfOnboarding";
import { DatabaseManagerWidget } from "../components/DatabaseManagerWidget";
import { ReferralLinksWidget } from "../components/ReferralLinksWidget";
import { KPointsIssuerWidget } from "../components/KPointsIssuerWidget";
import { useP2PTransfer } from "../hooks/useP2PTransfer";
import { compressImage, readAsBase64, playPremiumChime, playSyncChime, playCashDrawerSound, playScannerBeep, getStoreCoords, getCustomerCoords } from "../lib/utils";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AppEnforcer } from "../components/AppEnforcer";
import { PioneerOfferBanner } from '../components/PioneerOfferBanner';
import { OracleControlSlider } from '../components/OracleControlSlider';
import { OracleInsightCard } from '../components/OracleInsightCard';
import { PushCommandCenter } from "../components/PushCommandCenter";
import { supabase } from "../context/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('../components/LiveMap'), { ssr: false });

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


/* Toast EXTRACTED */

;

// CvViewerModal Component


/* CvViewerModal EXTRACTED */

;

// SMS Bank Notification Simulator (Smart Conciliator Sim with Live Terminal Logs)


/* SMSConciliatorSimulator EXTRACTED */

;

// Módulo Interactivo de Gobernanza Financiera (Split Visual Dinámico)


/* KFSFinancialSplitCalculator EXTRACTED */

;

// Sincro-Shield Fiscal Setup Widget (SENIAT)


/* FiscalPrinterSetupWidget EXTRACTED */

;

// Consola de Ajustes de Conectividad IoT Edge (WebUSB/WebBluetooth)


/* KFSIoTEdgeConsole EXTRACTED */

;

// Kreatek Logo Component (Removes white background dynamically)


/* KreatekLogo EXTRACTED */

;



// Navbar Component with state-aware interactive P2P Telemetry and profile avatar


/* Navbar EXTRACTED */

;



/* RegisterClientForm EXTRACTED */

;

// Setup Promotora Form


/* RegisterPromotoraForm EXTRACTED */

;



/* LandingPageView EXTRACTED */

;

// Login View


/* LoginView EXTRACTED */

;



/* RegisterCustomerForm EXTRACTED */


// RegisterRiderForm — Formulario de Registro para Riders de Delivery


/* RegisterRiderForm EXTRACTED */

;



/* CustomerDashboard EXTRACTED */

;

// CoreDashboard


/* CoreDashboard EXTRACTED */

;

// Promotora Dashboard


/* PromotoraDashboard EXTRACTED */

;



/* StorefrontCustomizer EXTRACTED */

;



/* OnboardingWizard EXTRACTED */

;



/* RecruitmentWidget EXTRACTED */

;



/* ClientDashboard EXTRACTED */

;

// Scanner View Component (Maintains camera and simulation logic)


/* ScannerView EXTRACTED */

;

// Vendedor Dashboard


/* VendedorDashboard EXTRACTED */

;

// {KFS_BRAND.modules.marketplace} Public View


/* MarketplaceView EXTRACTED */

;

// ==========================================
// RIDER DASHBOARD
// ==========================================


/* RiderDashboard EXTRACTED */

;

// ==========================================
// MAIN COMPONENT DEFINITION
// ==========================================
export default function Home() {
  const {
    isClient, isBooting, view, setView, currentUser, setCurrentUser,
    toast, db, setDb, formatUSD, formatEUR, showToast,
    handleLogin, logout, registerClient, registerFreeUser, upgradeToPremium, registerPromotora, approvePromotora, rejectPromotora, settlePromotoraEarnings, addProduct, addExpense, processPurchase,
    submitOnlineOrder, approveOrder, rejectOrder, dispatchOrder, generateZReport, registerCrmExpress,
    paySubscription, approveSubscription, requestPayout, requestTopUp,
    ghostTrapLocked, setGhostTrapLocked, triggerGhostTrap, logAction
  } = useKFS() as any;

  const [ghostPassword, setGhostPassword] = useState("");
  const [ghostError, setGhostError] = useState("");

  const handleUnlockGhostTrap = () => {
    const ghostPin = process.env.NEXT_PUBLIC_GHOST_TRAP_PIN || "1234";
    const corePass = process.env.NEXT_PUBLIC_CORE_PASSWORD || "199521";
    if (ghostPassword === ghostPin || ghostPassword === corePass || ghostPassword === "199521.") {
      setGhostTrapLocked(false);
      setGhostPassword("");
      setGhostError("");
      showToast("Terminal desbloqueado con éxito (Master).", "success");
      logAction("Dueño/Arquitecto", "GHOST_TRAP_UNLOCK", "El Protocolo Ghost fue desbloqueado usando Clave Maestra.");
    } else if (ghostPassword === "0000") {
      setGhostTrapLocked(false);
      setGhostPassword("");
      setGhostError("");
      showToast("Terminal desbloqueado por Supervisor.", "error");
      logAction("Supervisor", "GHOST_TRAP_OVERRIDE", "ALERTA ROJA: El Protocolo Ghost fue evadido usando el PIN de contingencia (Supervisor).");
    } else {
      setGhostError("Clave incorrecta. Acceso denegado.");
    }
  };

  const protectedViews = ["core", "client", "promotora", "vendedor", "customer", "rider"];

  let isUserValid = true;
  if (currentUser) {
    if (currentUser.role === "dueño" && db.clients?.length > 0 && !db.clients.some((c: any) => c.id === currentUser.id)) isUserValid = false;
    if (currentUser.role === "rider" && db.riders?.length > 0 && !db.riders.some((r: any) => r.id === currentUser.id)) isUserValid = false;
    if (currentUser.role === "vendedor" && db.vendedores?.length > 0 && !db.vendedores.some((v: any) => v.id === currentUser.id)) isUserValid = false;
  }

  const updatePwaStatus = async (status: boolean) => {
    if (!currentUser || currentUser.pwaInstalled === status) return;
    setCurrentUser({ ...currentUser, pwaInstalled: status });
    let table = "";
    if (currentUser.role === "dueño") table = "clients";
    else if (currentUser.role === "promotora") table = "promotoras";
    else if (currentUser.role === "customer") table = "customers";
    else if (currentUser.role === "rider") table = "riders";
    else if (currentUser.role === "vendedor") table = "vendedores";
    
    if (table && supabase) {
      await supabase.from(table).update({ pwaInstalled: status }).eq('id', currentUser.id);
    }
  };

  useEffect(() => {
    if (currentUser && !isUserValid) {
      if (currentUser.isImpersonated) {
        showToast("Sesión de comercio expirada. Retornando...", "error");
        setView("core");
        setCurrentUser({ id: "arquitecto", role: "core" }); // Fallback before actual reset
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast("Tu cuenta ya no se encuentra en el sistema.", "error");
        logout();
      }
    }
  }, [currentUser, isUserValid, logout, setView, showToast, setCurrentUser]);

  const safeView = (!currentUser || !isUserValid) && protectedViews.includes(view) ? "landing" : view;

  if (isBooting || !isClient) {
    return (
      <div className="min-h-screen bg-violet-900 flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center">
          <img src="/kfs-loading.png" className="h-28 sm:h-32 w-auto animate-pulse mb-8 object-contain" alt="KFS OS" />
          <div className="w-12 h-12 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono mt-6">Loading core vectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-900">
      <Toast toast={toast} />

      {ghostTrapLocked && (
        <div className="fixed inset-0 bg-[#0B0104]/95 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A050A] border-2 border-red-500/30 rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 animate-pulse"></div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-950/50 border border-red-500/40 rounded-full flex items-center justify-center animate-bounce text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <Lock size={36} className="animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
              🚨 GHOST TRAP ACTIVATED 🚨
            </h2>
            <p className="text-red-400 font-mono text-xs uppercase tracking-widest mb-6">
              Auditoría Criptográfica en Curso
            </p>

            <div className="bg-black/55 border border-red-500/10 rounded-2xl p-6 mb-6 text-left font-mono text-xs text-red-300 space-y-3 leading-relaxed">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ TERMINAL ]</span>
                <span className="text-white font-bold">{currentUser?.name || "Vendedor Terminal"} ({currentUser?.role || "Terminal"})</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ ACCIÓN ]</span>
                <span className="text-red-500 font-black">RECHAZO SOSPECHOSO DE ORDEN ONLINE</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ PROTOCOLO ]</span>
                <span className="text-yellow-500 font-black">BLOQUEO ANTIFRAUDE INMEDIATO</span>
              </p>
              <p className="flex justify-between">
                <span>[ TIMESTAMP ]</span>
                <span className="text-white">{new Date().toLocaleString()}</span>
              </p>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Este terminal de ventas ha sido congelado. Se requiere el ingreso de la contraseña maestra del dueño o del arquitecto para continuar.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Master Password o PIN de Supervisor"
                  value={ghostPassword}
                  onChange={(e) => setGhostPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockGhostTrap()}
                  className="w-full bg-black/60 border-2 border-red-500/20 focus:border-red-500 rounded-xl px-5 py-4 text-center font-black tracking-widest text-white text-lg focus:outline-none focus:ring-0 placeholder:text-gray-600 transition-colors"
                />
                {ghostError && <p className="text-xs text-red-500 font-bold mt-2">{ghostError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/584141234567?text=ALERTA%20DE%20SEGURIDAD%20KFS%20OS:%20Se%20ha%20detonado%20el%20Protocolo%20Ghost%20Trap%20en%20el%20terminal%20de%20ventas.%20Operador:%20${currentUser?.name || "Vendedor"}.%20Acción:%20Rechazo%20de%20Orden.%20Favor%20auditar.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-4 rounded-xl font-black text-xs text-green-400 bg-green-950/20 border border-green-500/20 hover:bg-green-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  💬 Reportar a WhatsApp
                </a>

                <button
                  onClick={handleUnlockGhostTrap}
                  className="py-4 rounded-xl font-black text-xs text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-red-600/20"
                >
                  🔓 Desbloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {safeView === "landing" && <LandingPageView setView={setView} />}
      {safeView === "b2b-onboarding" && <B2BSelfOnboarding setView={setView} />}

      {safeView === "login" && (
        <LoginView
          handleLogin={handleLogin}
          registerClient={registerClient}
          registerPromotora={registerPromotora}
          db={db}
          setView={setView}
          currentUser={currentUser}
          logout={logout}
        />
      )}
      {safeView === "marketplace" && (
        <MarketplaceView
          db={db}
          submitOnlineOrder={submitOnlineOrder}
          formatUSD={formatUSD}
          logout={logout}
          currentUser={currentUser}
        />
      )}
      {safeView === "customer" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <CustomerDashboard
            db={db}
            currentUser={currentUser}
            logout={logout}
            setView={setView}
          />
        </AppEnforcer>
      )}
      {safeView === "core" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <CoreDashboard
            db={db}
            setDb={setDb}
            approvePromotora={approvePromotora}
            rejectPromotora={rejectPromotora}
            settlePromotoraEarnings={settlePromotoraEarnings}
            showToast={showToast}
            formatUSD={formatUSD}
            formatEUR={formatEUR}
            currentUser={currentUser}
            logout={logout}
            approveSubscription={approveSubscription}
          />
        </AppEnforcer>
      )}
      
      {/* Mock function to prevent build failure since it's missing from KFSContext */}
      {(() => {
        const registerVendedor = (data: any) => showToast("Función en desarrollo.", "error");
        return safeView === "promotora" && (
          <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
            <PromotoraDashboard
              db={db}
              setDb={setDb}
              currentUser={currentUser}
              registerClient={registerClient}
              upgradeToPremium={upgradeToPremium}
              settlePromotoraEarnings={settlePromotoraEarnings}
              formatUSD={formatUSD}
              formatEUR={formatEUR}
              logout={logout}
              requestPayout={requestPayout}
              registerVendedor={registerVendedor}
            />
          </AppEnforcer>
        );
      })()}
      
      {safeView === "client" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <ClientDashboard
            db={db}
            setDb={setDb}
            currentUser={currentUser}
            addProduct={addProduct}
            addExpense={addExpense}
            showToast={showToast}
            formatUSD={formatUSD}
            formatEUR={formatEUR}
            logout={logout}
            approveOrder={approveOrder}
            rejectOrder={rejectOrder}
            dispatchOrder={dispatchOrder}
            paySubscription={paySubscription}
            requestPayout={requestPayout}
            requestTopUp={requestTopUp}
          />
        </AppEnforcer>
      )}
      {safeView === "vendedor" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <VendedorDashboard
            db={db}
            setDb={setDb}
            currentUser={currentUser}
            addProduct={addProduct}
            processPurchase={processPurchase}
            showToast={showToast}
            formatUSD={formatUSD}
            logout={logout}
            approveOrder={approveOrder}
            rejectOrder={rejectOrder}
            generateZReport={generateZReport}
            registerCrmExpress={registerCrmExpress}
          />
        </AppEnforcer>
      )}
      {safeView === "rider" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <RiderDashboard
            db={db}
            currentUser={currentUser}
            logout={logout}
          />
        </AppEnforcer>
      )}
      {null}
    </div>
  );
}
