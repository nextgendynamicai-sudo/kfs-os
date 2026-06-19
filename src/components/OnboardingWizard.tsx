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

export const OnboardingWizard = ({ currentUser, finishOnboarding }: any) => {
  const { addProduct } = useKFS();
  const [step, setStep] = useState(1);
  const [kycDoc, setKycDoc] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productName, setProductName] = useState("");

  const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 500, 0.6);
      setKycDoc(base64String);
    }
  };

  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 400, 0.6);
      setProductImage(base64String);
    }
  };

  const saveOnboardingProduct = () => {
    if (productImage || productName) {
      addProduct({
        name: productName || "Mi Primer Producto",
        priceUSD: 10.00,
        stock: 50,
        image: productImage || "",
        clientId: currentUser.id,
        clientName: currentUser.company,
        category: "General"
      });
    }
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[violet-900] flex flex-col items-center justify-center p-4 text-white animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[violet-900] via-[violet-600]/10 to-[violet-900] opacity-50"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-2xl flex flex-col items-center text-center">
        <KreatekLogo className="h-16 sm:h-20 w-auto mb-6" />
        <h2 className="text-3xl font-black mb-2 text-[violet-600]">Setup Inicial</h2>
        <p className="text-gray-300 mb-8 font-light">Vamos a preparar tu ecosistema {currentUser.company} para la nueva era digital en 3 simples pasos.</p>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-[violet-600]' : 'bg-white/10'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-xl font-bold">1. Cumplimiento Legal (KYC)</h3>
            <p className="text-sm text-gray-400">Por normativas internacionales anti-lavado de dinero (AML), debes adjuntar una foto de tu RIF o Documento de Identidad Fiscal.</p>
            <label className="border-2 border-dashed border-[violet-600]/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleKycUpload} />
              {kycDoc ? (
                <div className="text-green-400 font-bold flex items-center gap-2"><CheckCircle size={20} /> Documento Cargado</div>
              ) : (
                <div className="text-center text-gray-400">
                  <Camera size={32} className="mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-bold uppercase tracking-widest">Subir Foto KYC</span>
                </div>
              )}
            </label>
            <button disabled={!kycDoc} onClick={() => setStep(2)} className="w-full bg-[violet-600] text-[violet-900] py-4 rounded-xl font-black mt-6 shadow-lg shadow-[violet-600]/20 hover:scale-[1.02] disabled:opacity-50 transition-transform cursor-pointer">Siguiente Paso →</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-xl font-bold">2. Sube un Producto</h3>
            <p className="text-sm text-gray-400">Personaliza tu inventario ahora mismo. Sube una foto de tu producto directamente desde la galería.</p>

            <input type="text" placeholder="Nombre de tu producto (Ej. Refresco)" value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[violet-600]" />

            <label className="border-2 border-dashed border-[violet-600]/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleProductUpload} />
              {productImage ? (
                <img src={productImage} alt="Preview" className="h-32 object-contain rounded-lg" />
              ) : (
                <div className="text-center text-gray-400">
                  <Camera size={32} className="mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-bold uppercase tracking-widest">Tocar para Galería</span>
                </div>
              )}
            </label>
            <button onClick={saveOnboardingProduct} className="w-full bg-[violet-600] text-[violet-900] py-4 rounded-xl font-black mt-6 shadow-lg shadow-[violet-600]/20 hover:scale-[1.02] transition-transform cursor-pointer">Guardar y Continuar →</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-slide-up text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 text-green-400 rounded-full mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold">3. ¡Todo Listo!</h3>
            <p className="text-sm text-gray-400 mb-6">El sistema base de datos, el POS y la tienda online están desplegados y 100% enlazados en tiempo real.</p>
            <button onClick={() => finishOnboarding(currentUser.id, kycDoc)} className="w-full bg-[violet-600] text-[violet-900] py-4 rounded-xl font-black shadow-lg shadow-[violet-600]/20 hover:scale-[1.02] transition-transform cursor-pointer">Ir a mi Panel de Control</button>
          </div>
        )}
      </div>
    </div>
  );
}
