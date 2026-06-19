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

export const RegisterPromotoraForm = ({ onRegister, onCancel, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "", avatar: "", kycCedula: "", kycAddress: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setAvatar(base64String);
      setFormData(prev => ({ ...prev, avatar: base64String }));
    }
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setKycCedula(base64String);
      setFormData(prev => ({ ...prev, kycCedula: base64String }));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister({ ...formData, referralCode: defaultReferralCode }); }} className="space-y-3 text-sky-950 animate-fade-in pb-4">
      <h3 className="text-lg font-black mb-4 border-b border-sky-100 pb-2 text-sky-700">Autogestión de Promotora</h3>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1 text-slate-500">Foto</span>
            </div>
          )}
        </label>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Foto de Perfil</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-full h-20 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Foto de Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <input required placeholder="Nombre Completo" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <textarea required placeholder="Dirección Completa (KYC)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, kycAddress: e.target.value })} />
      <input required type="email" placeholder="Correo Electrónico" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input required type="password" placeholder="Crear Clave de Acceso" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <input required placeholder="Binance ID (Ej: 184592...)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, binanceId: e.target.value })} />
      <input required placeholder="Pago Móvil (Ej: 0412...)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, pagoMovil: e.target.value })} />
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 hover:bg-sky-50 text-slate-500 font-bold transition-all text-sm cursor-pointer bg-transparent">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 cursor-pointer bg-sky-600 border-none">Registrar Perfil</button>
      </div>
    </form>
  );
}
