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

export const RegisterClientForm = ({ onRegister, onCancel, standalone = true, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", idCard: "", company: "", avgBilling: "", phone: "", email: "", password: "", address: "", kfsFeePercentage: 0.03, avatar: "", kycCedula: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [acceptedToS, setAcceptedToS] = useState(false);

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
    <form onSubmit={(e) => { e.preventDefault(); if (acceptedToS) onRegister(formData, defaultReferralCode, 0.03); else alert("Debes aceptar los Términos de Servicio y Privacidad."); }} className={`space-y-3 ${standalone ? "text-sky-950 animate-fade-in" : "text-sky-950"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-sky-700 border-sky-100" : "text-sky-900 border-sky-100"}`}>Setup de Nuevo Comercio</h3>

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
        <span className={`text-[10px] font-bold uppercase tracking-wider ${standalone ? "text-slate-400" : "text-slate-500"}`}>Logo / Foto Comercio</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className={`relative w-full h-20 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center transition-colors group ${standalone ? "bg-sky-50 hover:bg-sky-100" : "bg-sky-50/50 hover:bg-sky-100"}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className={`text-center transition-colors ${standalone ? "text-sky-400 group-hover:text-sky-600" : "text-sky-500 group-hover:text-sky-700"}`}>
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Cédula del Representante (KYC)</span>
            </div>
          )}
        </label>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Nombre Completo</label>
        <div className="relative">
          <UserCheck className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required placeholder="Ej: Juan Pérez" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Cédula / RIF</label>
        <div className="relative">
          <FileText className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required placeholder="Ej: V-12345678 o J-12345678" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, idCard: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Nombre de la Empresa / Comercio</label>
        <div className="relative">
          <Store className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required placeholder="Ej: Inversiones El Sol C.A." className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, company: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Dirección Comercial Exacta</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-sky-400" size={20} />
          <textarea required placeholder="Calle, Avenida, Centro Comercial, Local..." className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all h-20 resize-none ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Facturación Promedio Diaria ($)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required type="number" placeholder="Ej: 500" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, avgBilling: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col mb-2">
        <label className={`text-xs font-black mb-1 ml-1 uppercase tracking-widest ${standalone ? "text-sky-700" : "text-sky-800"}`}>Tarifa BOS (Comisión Kreatek)</label>
        <select required value={formData.kfsFeePercentage} onChange={e => setFormData({ ...formData, kfsFeePercentage: parseFloat(e.target.value) })} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all font-bold cursor-pointer ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`}>
          <option value={0.03}>Plan Base (3%)</option>
          <option value={0.05}>Plan Estándar (5%)</option>
          <option value={0.10}>Plan Premium (10%)</option>
        </select>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Teléfono Personal</label>
        <div className="relative">
          <Smartphone className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required placeholder="Ej: 04141234567" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </div>
      
      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Correo Electrónico</label>
        <div className="relative">
          <Info className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required type="email" placeholder="ejemplo@correo.com" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
      </div>
      
      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-sky-700" : "text-sky-800"}`}>Crear Clave de Acceso</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-sky-400" size={20} />
          <input required type="password" placeholder="Mínimo 6 caracteres" className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2 mb-2">
        <input type="checkbox" required checked={acceptedToS} onChange={(e) => setAcceptedToS(e.target.checked)} className="mt-1 cursor-pointer" />
        <span className={`text-[10px] leading-tight ${standalone ? "text-slate-500" : "text-slate-500"}`}>
          He leído y acepto los <strong className="text-sky-600 cursor-pointer hover:underline">Términos de Servicio (ToS)</strong>. Entiendo que {KFS_BRAND.productAcronym} cobra $6 mensuales por mantenimiento, y que Kreatek no asume responsabilidad financiera sobre el comercio frente al cliente final.
        </span>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 cursor-pointer border-none bg-sky-600">Aprobar Setup</button>
      </div>
    </form>
  );
}
