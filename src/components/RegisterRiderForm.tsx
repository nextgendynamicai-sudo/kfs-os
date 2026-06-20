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

export const RegisterRiderForm = ({ onCancel, defaultReferralCode = "" }: { onCancel: () => void, defaultReferralCode?: string }) => {
  const { registerRider, showToast } = useKFS() as any;
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    cedulaImg: "", medCertImg: "", licenseImg: "",
    pagoMovil: { banco: "", telefono: "", cedula: "" }
  });
  const [uploading, setUploading] = useState({ cedula: false, med: false, license: false });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "cedulaImg" | "medCertImg" | "licenseImg", key: "cedula" | "med" | "license") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const base64 = await compressImage(file, 500, 0.6);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    } catch {
      showToast("Error al subir documento", "error");
    }
    setUploading(prev => ({ ...prev, [key]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cedulaImg) { showToast("Debes subir tu Cédula de Identidad.", "error"); return; }
    if (!formData.medCertImg) { showToast("Debes subir tu Certificado Médico.", "error"); return; }
    if (!formData.licenseImg) { showToast("Debes subir tu Licencia de Conducir.", "error"); return; }
    if (!formData.pagoMovil.banco || !formData.pagoMovil.telefono || !formData.pagoMovil.cedula) {
      showToast("Completa todos los datos de Pago Móvil.", "error"); return;
    }
    registerRider({ ...formData, referredBy: defaultReferralCode });
  };

  const DocUploadField = ({ label, icon, field, fileKey, uploaded }: { label: string; icon: string; field: "cedulaImg" | "medCertImg" | "licenseImg"; fileKey: "cedula" | "med" | "license"; uploaded: boolean }) => (
    <label className={`relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${uploaded ? "border-green-400 bg-green-50" : "border-sky-200 bg-sky-50/50 hover:bg-sky-100"}`}>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleDocUpload(e, field, fileKey)} />
      <span className="text-3xl">{uploaded ? "✅" : icon}</span>
      <span className={`text-[11px] font-bold text-center ${uploaded ? "text-green-600" : "text-sky-700 group-hover:text-sky-800"}`}>
        {uploading[fileKey] ? "Subiendo..." : uploaded ? "¡Cargado!" : label}
      </span>
      {uploaded && <span className="text-[8px] text-green-500 font-mono">Toca para cambiar</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in w-full pb-4">
      <div className="text-center pb-2 border-b border-sky-100">
        <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-sky-200">
          <Truck className="text-sky-600" size={24} />
        </div>
        <h3 className="text-base font-black text-sky-700 uppercase tracking-wider">Registro Rider Delivery</h3>
        <p className="text-[10px] text-slate-400 mt-1">Sujeto a aprobación del Arquitecto {KFS_BRAND.productAcronym}</p>
      </div>

      {/* Personal Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Nombre Completo" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="tel" placeholder="Teléfono (Ej: 04141234567)" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="email" placeholder="Correo Electrónico" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="password" placeholder="Crear Contraseña" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
      </div>

      {/* Document Uploads */}
      <div className="space-y-1 mt-2">
        <p className="text-[10px] font-black text-sky-700 uppercase tracking-widest">Documentos Requeridos</p>
        <p className="text-[9px] text-slate-500">Sube fotos directas desde tu galería o cámara</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <DocUploadField label="Cédula" icon="🪪" field="cedulaImg" fileKey="cedula" uploaded={!!formData.cedulaImg} />
        <DocUploadField label="Cert. Médico" icon="🏥" field="medCertImg" fileKey="med" uploaded={!!formData.medCertImg} />
        <DocUploadField label="Licencia" icon="🚗" field="licenseImg" fileKey="license" uploaded={!!formData.licenseImg} />
      </div>

      {/* Pago Móvil */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-sky-700 uppercase tracking-widest">Pago Móvil (Cobro de Delivery $2)</p>
        <p className="text-[9px] text-slate-500">Los clientes te pagarán directamente aquí</p>
      </div>
      <select required value={formData.pagoMovil.banco} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, banco: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all cursor-pointer">
        <option value="">— Selecciona Banco —</option>
        {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input required type="tel" placeholder="Teléfono PM (04xx...)" value={formData.pagoMovil.telefono} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, telefono: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required placeholder="Cédula Titular" value={formData.pagoMovil.cedula} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, cedula: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">⚠️ Tu solicitud será revisada por el Arquitecto {KFS_BRAND.productAcronym}. Recibirás notificación de aprobación antes de poder operar.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all text-sm cursor-pointer">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-sky-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2 border-none shadow-md shadow-sky-600/30">
          <Truck size={16} /> Enviar Solicitud
        </button>
      </div>
    </form>
  );
}
