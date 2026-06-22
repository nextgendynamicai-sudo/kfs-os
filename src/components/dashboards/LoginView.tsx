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

export const LoginView = ({ handleLogin, registerClient, registerPromotora, db, setView, currentUser, logout }: any) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRole = searchParams.get('role');
      if (urlRole) return urlRole;
      
      const saved = localStorage.getItem("kfs_pending_tab");
      if (saved) {
        localStorage.removeItem("kfs_pending_tab");
        return saved;
      }
    }
    return "marketplace";
  });
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('ref') || "";
    }
    return "";
  });

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl shadow-sky-200/50 border border-sky-100 rounded-[2.5rem] p-8 animate-fade-in">
          {currentUser ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 bg-sky-100 rounded-full border-2 border-sky-200 flex items-center justify-center mx-auto shadow-inner overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
                ) : (
                  <span className="text-sky-600 font-black text-xl">{currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}</span>
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-sky-950">Sesión Activa Detectada</h2>
                <p className="text-sm text-slate-500">
                  Ya has iniciado sesión como <strong className="text-sky-950">{currentUser.name || currentUser.company}</strong> (<span className="capitalize">{currentUser.role}</span>).
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const role = currentUser.role;
                    if (role === "dueño") setView("client");
                    else if (role === "vendedor") setView("vendedor");
                    else if (role === "promotora") setView("promotora");
                    else if (role === "core") setView("core");
                    else if (role === "customer") setView("customer");
                    else if (role === "rider") setView("rider");
                    else setView("landing");
                  }}
                  className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-600/30 border-none text-white bg-sky-600 cursor-pointer text-sm"
                >
                  Ir a mi Panel de Control <ChevronRight size={18} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-3.5 rounded-xl font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-sm bg-transparent"
                >
                  Cerrar Sesión (Cambiar Cuenta)
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-sm">
                  <Shield className="text-sky-600" size={32} />
                </div>
                <h1 className="text-2xl font-black text-sky-950 tracking-tight">{KFS_BRAND.productAcronym} Core <span className="text-sky-600">Access</span></h1>
                <p className="text-sm text-slate-500 mt-2 font-mono">Seleccione su vector de entrada</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button onClick={() => setActiveTab("marketplace")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "marketplace" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Nitro Market</button>
                <button onClick={() => setActiveTab("customer")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "customer" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Cliente</button>
                <button onClick={() => setActiveTab("dueño")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "dueño" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Dueño</button>
                <button onClick={() => setActiveTab("vendedor")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "vendedor" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Vendedor</button>
                <button onClick={() => setActiveTab("promotora")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "promotora" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Promotora</button>
                <button onClick={() => setActiveTab("rider")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "rider" ? "bg-sky-600 text-white shadow-md" : "bg-sky-50 text-sky-600 hover:text-sky-800"}`}>Delivery</button>
                <button onClick={() => setActiveTab("core")} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer ${activeTab === "core" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:text-slate-800"}`}>Arquitecto</button>
              </div>

              {activeTab === "marketplace" && (
                <button onClick={() => handleLogin("marketplace", "")} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-600/30 border-none text-white bg-sky-600 cursor-pointer">
                  <ShoppingCart size={20} /> Entrar a Nitro Market
                </button>
              )}

              {(activeTab === "core" || activeTab === "promotora" || activeTab === "dueño" || activeTab === "vendedor" || activeTab === "customer" || activeTab === "rider") && (
                <div className="space-y-4">
                  {(activeTab === "dueño" || activeTab === "vendedor" || activeTab === "promotora" || activeTab === "customer" || activeTab === "rider") && (
                    <div className="relative">
                      <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">
                        {activeTab === "customer" ? "Teléfono Móvil Registrado" : "Correo Electrónico de Acceso"}
                      </label>
                      <div className="relative">
                        {activeTab === "customer" ? <Smartphone className="absolute left-4 top-4 text-sky-400" size={20} /> : <Info className="absolute left-4 top-4 text-sky-400" size={20} />}
                        <input type="text" placeholder={activeTab === "customer" ? "Ej: +584141234567" : "usuario@correo.com"} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-4 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all" />
                      </div>
                    </div>
                  )}
                  <div className="relative">
                    <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">Contraseña de Acceso</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 text-sky-400" size={20} />
                      <input type="password" placeholder="Ingresa tu clave de seguridad" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-4 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all" />
                    </div>
                    {password === "000" && (
                      <p className="text-[10px] text-amber-600 font-bold mt-2 bg-amber-50 p-2 rounded-lg border border-amber-100">
                        <Info size={12} className="inline mr-1" /> Modo Demostración activado. Puedes dejar el correo vacío y entrar directo.
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleLogin(activeTab, password, email)} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-600/30 border-none text-white bg-sky-600 cursor-pointer">
                    Entrar a mi Panel <ChevronRight size={20} />
                  </button>
                  {activeTab === "dueño" && (
                    <button onClick={() => setActiveTab("register")} className="w-full text-center text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Comercio nuevo? Iniciar Setup
                    </button>
                  )}
                  {activeTab === "promotora" && (
                    <button onClick={() => setActiveTab("registerPromo")} className="w-full text-center text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nueva Promotora? Registrarse
                    </button>
                  )}
                  {activeTab === "customer" && (
                    <button onClick={() => setActiveTab("registerCustomer")} className="w-full text-center text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nuevo Cliente? Crea tu cuenta
                    </button>
                  )}
                  {activeTab === "rider" && (
                    <button onClick={() => setActiveTab("registerRider")} className="w-full text-center text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nuevo Rider? Regístrate como Delivery
                    </button>
                  )}
                </div>
              )}

              {activeTab === "register" && <RegisterClientForm onRegister={registerClient} onCancel={() => setActiveTab("dueño")} defaultReferralCode={referralCode} />}
              {activeTab === "registerPromo" && <RegisterPromotoraForm onRegister={registerPromotora} onCancel={() => setActiveTab("promotora")} defaultReferralCode={referralCode} />}
              {activeTab === "registerCustomer" && <RegisterCustomerForm onCancel={() => setActiveTab("customer")} defaultReferralCode={referralCode} />}
              {activeTab === "registerRider" && <RegisterRiderForm onCancel={() => setActiveTab("rider")} defaultReferralCode={referralCode} />}
            </>
          )}

          <div className="mt-8 pt-6 border-t border-sky-100 text-center">
            <button onClick={() => setView("landing")} className="text-sm font-black text-sky-600 hover:text-sky-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto border-none bg-transparent">
              <Star size={16} /> Ver Landing de Ventas - {KFS_BRAND.modules.marketplace} & Axis Points
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
