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

export const StorefrontCustomizer = ({ client, updateStoreSettings }: { client: any, updateStoreSettings: any }) => {
  const [settings, setSettings] = useState(client.storeSettings || {
    profilePicUrl: "",
    coverPhotoUrl: "",
    bioText: "",
    themeColor: "violet-600",
    typography: "font-sans",
    layoutType: "grid",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryReference: ""
  });

  const handleSave = () => {
    updateStoreSettings(client.id, settings);
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file, 200, 0.6);
        setSettings((prev: any) => ({ ...prev, profilePicUrl: base64 }));
      } catch (err) {
        alert("Error al comprimir/subir imagen");
      }
    }
  };

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file, 600, 0.6);
        setSettings((prev: any) => ({ ...prev, coverPhotoUrl: base64 }));
      } catch (err) {
        alert("Error al comprimir/subir imagen");
      }
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-6 h-full">
      <h4 className="font-black text-[violet-900] text-lg flex items-center gap-2"><Palette className="text-[violet-600]" /> Personalizar Tienda</h4>
      <p className="text-xs text-gray-500">Ajusta la apariencia visual de tu vitrina pública en Flow Express.</p>

      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo / Foto de Perfil</label>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-250 p-4 rounded-2xl relative overflow-hidden">
              <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                {settings.profilePicUrl ? (
                  <img src={settings.profilePicUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <Camera size={20} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </label>
              <div className="flex-grow">
                <p className="text-xs font-bold text-[violet-900]">Subir desde Galería</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Se guardará directamente en tu base de datos KFS.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Banner de Portada</label>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-250 p-4 rounded-2xl relative overflow-hidden">
              <label className="relative w-24 h-16 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoUpload} />
                {settings.coverPhotoUrl ? (
                  <img src={settings.coverPhotoUrl} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <Camera size={20} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </label>
              <div className="flex-grow">
                <p className="text-xs font-bold text-[violet-900]">Subir desde Galería</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Banner panorámico para tu Flow Express.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Biografía o Eslogan (Max 150 char)</label>
          <textarea maxLength={150} value={settings.bioText} onChange={e => setSettings({ ...settings, bioText: e.target.value })} placeholder="Los mejores productos..." className="w-full h-16 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[violet-600] resize-none placeholder:text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Color Principal</label>
            <div className="flex flex-wrap items-center gap-2">
              <input type="color" value={settings.themeColor} onChange={e => setSettings({ ...settings, themeColor: e.target.value })} className="h-10 w-10 rounded-full cursor-pointer border-none shadow-sm p-0 overflow-hidden" title="Elegir color personalizado" />
              <div className="flex gap-1 border-l pl-2 border-gray-200">
                {["violet-900", "#4F46E5", "#10B981", "#F59E0B", "#EF4444", "violet-600"].map(c => (
                  <button key={c} onClick={() => setSettings({ ...settings, themeColor: c })} className={`w-8 h-8 rounded-full border-2 ${settings.themeColor === c ? 'border-gray-900 shadow-md' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tipografía</label>
            <select value={settings.typography} onChange={e => setSettings({ ...settings, typography: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none placeholder:text-gray-400">
              <option value="font-sans">Moderna (Sans)</option>
              <option value="font-serif">Clásica (Serif)</option>
              <option value="font-mono">Técnica (Mono)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Disposición (Layout)</label>
          <select value={settings.layoutType} onChange={e => setSettings({ ...settings, layoutType: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none placeholder:text-gray-400">
            <option value="grid">Grilla de Tarjetas (Recomendado)</option>
            <option value="list">Lista Compacta</option>
          </select>
        </div>

        {/* ===== DELIVERY ADDRESS SECTION ===== */}
        <div className="border-t border-gray-100 pt-6 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <Truck size={18} />
            </div>
            <div>
              <h5 className="font-black text-[violet-900] text-sm">Dirección de Delivery</h5>
              <p className="text-[10px] text-gray-400">Esta dirección se enviará al rider cuando despaches un pedido.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Calle y Número / Local</label>
              <input
                type="text"
                value={settings.deliveryAddress || ""}
                onChange={e => setSettings({ ...settings, deliveryAddress: e.target.value })}
                placeholder="Ej: Av. Principal, Edificio Torre Norte, Local 4"
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Ciudad / Municipio</label>
              <input
                type="text"
                value={settings.deliveryCity || ""}
                onChange={e => setSettings({ ...settings, deliveryCity: e.target.value })}
                placeholder="Ej: Caracas, Miranda"
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Referencia (para el rider)</label>
              <input
                type="text"
                value={settings.deliveryReference || ""}
                onChange={e => setSettings({ ...settings, deliveryReference: e.target.value })}
                placeholder="Ej: Frente al banco, puerta azul"
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
            {settings.deliveryAddress && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([settings.deliveryAddress, settings.deliveryCity].filter(Boolean).join(", "))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                <Truck size={13} /> Verificar en Google Maps ↗
              </a>
            )}
          </div>
        </div>

        <button onClick={handleSave} className="w-full mt-4 bg-[violet-900] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Guardar Diseño y Dirección
        </button>
      </div>
    </div>
  );
}
