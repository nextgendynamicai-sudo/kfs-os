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

export const RegisterCustomerForm = ({ onCancel, defaultReferralCode }: { onCancel: () => void, defaultReferralCode?: string }) => {
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+58");
  const [phoneBody, setPhoneBody] = useState("");
  const [password, setPassword] = useState("");
  const [kycPhoto, setKycPhoto] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [kycAddress, setKycAddress] = useState("");
  const { registerCustomer } = useKFS() as any;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomer(`${phonePrefix}${phoneBody}`, password, name, defaultReferralCode, kycPhoto, kycCedula, kycAddress);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file, 200, 0.6);
      setter(base64);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let rawBody = phoneBody.replace(/[^0-9]/g, '');
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    const fullPhone = phonePrefix + rawBody;
    registerCustomer(fullPhone, password, name, defaultReferralCode || undefined, kycPhoto, kycCedula, kycAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="relative">
        <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
        <div className="relative">
          <UserCheck className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required type="text" placeholder="Ej: Juan Pérez" value={name} onChange={e => setName(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" />
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">Teléfono Móvil</label>
        <div className="flex gap-2">
          <select
            value={phonePrefix}
            onChange={e => setPhonePrefix(e.target.value)}
            className="bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 focus:outline-none focus:border-sky-400 text-sm cursor-pointer"
          >
            <option value="+58">VE (+58)</option>
            <option value="+57">CO (+57)</option>
            <option value="+507">PA (+507)</option>
            <option value="+34">ES (+34)</option>
            <option value="+56">CL (+56)</option>
            <option value="+593">EC (+593)</option>
            <option value="+51">PE (+51)</option>
            <option value="+54">AR (+54)</option>
            <option value="+1">US/CA (+1)</option>
            <option value="+1809">DO (+1-809)</option>
          </select>
          <div className="relative flex-1">
            <Smartphone className="absolute left-4 top-3.5 text-sky-400" size={20} />
            <input required type="text" placeholder="Ej: 4141234567" value={phoneBody} onChange={e => setPhoneBody(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-2">
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50/50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycPhoto)} required />
          {kycPhoto ? (
            <img src={kycPhoto} className="w-full h-full object-cover" alt="Selfie" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Selfie (Obligatorio)</span>
            </div>
          )}
        </label>
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50/50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycCedula)} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover" alt="Cédula" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <FileText size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">Dirección Exacta</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-sky-400" size={20} />
          <textarea required placeholder="Calle, Av, Edificio, Casa..." value={kycAddress} onChange={e => setKycAddress(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all text-sm h-20 resize-none" />
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1 ml-1">Contraseña de Acceso</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl pl-12 pr-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all cursor-pointer">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-sky-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 border-none cursor-pointer">Crear Cuenta</button>
      </div>
    </form>
  )
}
