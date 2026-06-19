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
import { KreatekLogo } from "./KreatekLogo";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckoutModal } from "../components/CheckoutModal";
import { TopUpModal } from "../components/TopUpModal";
import { PayoutModal } from "../components/PayoutModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { UniversalWalletWidget } from "../components/UniversalWalletWidget";
import { ProfileAvatarEditor } from "../components/ProfileAvatarEditor";
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

export const Navbar = ({ title, showBack = false, onBack }: { title?: string, showBack?: boolean, onBack?: () => void }) => {
  const { 
    view, 
    handleLogin, 
    networkState, 
    setNetworkState, 
    showToast, 
    currentUser, 
    setCurrentUser, 
    setDb, 
    db, 
    logout, 
    setView, 
    requestPayout,
    requestTopUp 
  } = useKFS() as any;
  const [isSyncing, setIsSyncing] = useState(false);

  const handleBack = () => {
    if (onBack && onBack !== logout) {
      onBack();
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      } else {
        setView("landing");
      }
    }
  };

  const cycleNetworkState = () => {
    if (isSyncing) return;

    if (networkState === "online") {
      setNetworkState("mesh");
      showToast("Modo: RED DE MALLA LOCAL (P2P Mesh) activada. Inventarios locales vinculados.", "success");
    } else if (networkState === "mesh") {
      setNetworkState("offline");
      showToast("Modo: DESCONECTADO (Stand-alone). Guardado en LocalStorage activado.", "error");
    } else {
      setIsSyncing(true);
      showToast("Sincronizando base de datos local P2P con el servidor en la nube...", "success");

      // Simulate sync animation
      setTimeout(() => {
        setNetworkState("online");
        setIsSyncing(false);
        playSyncChime();
        showToast("¡Base de datos sincronizada! 100% de consistencia en la nube.", "success");
      }, 2000);
    }
  };

  const getNetworkDetails = () => {
    switch (networkState) {
      case "online":
        return { color: "bg-green-500 shadow-[0_0_8px_#22c55e]", border: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)] bg-green-950/20 hover:bg-green-900/30 text-green-400", label: "ONLINE (NUBE)", text: "text-green-400" };
      case "mesh":
        return { color: "bg-amber-500 shadow-[0_0_8px_#f59e0b]", border: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-amber-950/20 hover:bg-amber-900/30 text-amber-400", label: "LOCAL MESH (P2P)", text: "text-amber-400" };
      case "offline":
        return { color: "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse", border: "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] bg-red-950/20 hover:bg-red-900/30 text-red-400 animate-pulse", label: "OFFLINE (STAND-ALONE)", text: "text-red-400" };
      default:
        return { color: "bg-green-500 shadow-[0_0_8px_#22c55e]", border: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)] bg-green-950/20 hover:bg-green-900/30 text-green-400", label: "ONLINE (NUBE)", text: "text-green-400" };
    }
  };

  const net = getNetworkDetails();
  const latestNotif: any = currentUser ? [...(db.notifications || [])].filter((n: any) => n.audience === 'all' || n.audience === currentUser.role).pop() : null;

  return (
    <>
      {latestNotif && (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg z-50 animate-fade-in relative">
          <Bell size={16} className="animate-bounce" />
          <span className="uppercase tracking-widest">{latestNotif.title}:</span>
          <span className="font-normal">{latestNotif.message}</span>
        </div>
      )}
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 bg-[violet-900] sticky top-0 z-40 backdrop-blur-md gap-3 w-full">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-gray-300 font-bold transition-all cursor-pointer mr-2"
            >
              <ChevronLeft size={16} /> Atrás
            </button>
          )}
          <KreatekLogo className="h-10 sm:h-12 w-auto" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Network Telemetry Trigger */}
          <button
            onClick={cycleNetworkState}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${net.border} cursor-pointer group disabled:opacity-50`}
            title="Gestor de Conexión de Contingencia y Sincronización"
          >
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.color}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${net.color}`}></span>
            </span>
            <span className={`font-mono text-[10px] font-black ${net.text} tracking-wider`}>
              {isSyncing ? "SINCRONIZANDO..." : net.label}
            </span>
          </button>

          {title && <span className="text-white/80 text-xs sm:text-sm uppercase tracking-wider font-mono bg-white/5 px-3 py-1.5 rounded-full">{title}</span>}

          {currentUser && currentUser.role !== "marketplace" && (
            <label className="relative w-8 h-8 rounded-full border border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all shadow-inner group" title="Toca tu foto para actualizar tu imagen de perfil">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const base64String = await compressImage(file, 400);
                      setDb((prev: any) => {
                        let updated = { ...prev };
                        if (currentUser.role === "dueño") {
                          updated.clients = prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, avatar: base64String } : c);
                        } else if (currentUser.role === "promotora") {
                          updated.promotoras = prev.promotoras.map((p: any) => p.id === currentUser.id ? { ...p, avatar: base64String } : p);
                        } else if (currentUser.role === "vendedor") {
                          updated.vendedores = prev.vendedores.map((v: any) => v.id === currentUser.id ? { ...v, avatar: base64String } : v);
                        } else if (currentUser.role === "customer") {
                          updated.customers = (prev.customers || []).map((c: any) => c.id === currentUser.id ? { ...c, avatar: base64String } : c);
                        } else if (currentUser.role === "rider") {
                          updated.riders = (prev.riders || []).map((r: any) => r.id === currentUser.id ? { ...r, avatar: base64String } : r);
                        } else if (currentUser.role === "core") {
                          updated.kreatekCore = { ...updated.kreatekCore, avatar: base64String };
                        }
                        return updated;
                      });

                      setCurrentUser((prev: any) => ({ ...prev, avatar: base64String }));
                      showToast("Foto de perfil comprimida y guardada.", "success");
                    } catch (error) {
                      showToast("Error comprimiendo imagen", "error");
                    }
                  }
                }}
              />
              {currentUser.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
              ) : (
                <div className="w-full h-full bg-[violet-600] text-[violet-900] font-black text-[10px] flex items-center justify-center">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[8px] text-white font-black">⚙️</span>
              </div>
            </label>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1"
              title="Cerrar Sesión y salir del sistema"
            >
              ❌ Salir
            </button>
          )}
        </div>

      </nav>
    </>
  );
}
