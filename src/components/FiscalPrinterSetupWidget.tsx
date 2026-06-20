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

export const FiscalPrinterSetupWidget = () => {
  const { showToast } = useKFS();
  const [proxyUrl, setProxyUrl] = useState("http://localhost:8080");
  const [status, setStatus] = useState("disconnected");
  const [details, setDetails] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await fetch(`${proxyUrl}/status`);
      const data = await res.json();
      if (data.status === "connected") {
        setStatus("connected");
        setDetails(data);
        showToast("Sincro-Shield Fiscal conectado al proxy local con éxito.", "success");
      } else {
        setStatus("disconnected");
        setDetails(null);
        showToast("Proxy local respondió pero la tiquetera fiscal está desconectada.", "error");
      }
    } catch (err) {
      setStatus("disconnected");
      setDetails(null);
      showToast("Proxy local fuera de línea en " + proxyUrl + ". Ejecuta 'node fiscal-proxy.js'.", "error");
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const downloadProxyScript = () => {
    const link = document.createElement("a");
    link.href = "/fiscal-proxy.js";
    link.download = "fiscal-proxy.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Descargando script fiscal-proxy.js...", "success");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-black text-sm text-violet-900 uppercase tracking-wider">🛡️ Sincro-Shield Fiscal (SENIAT)</h3>
            <p className="text-[10px] text-gray-500 mt-1">Conexión con impresoras fiscales de Venezuela en red local.</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[8px] uppercase tracking-wider border ${status === "connected" ? "bg-green-50 text-green-700 border-green-200 animate-pulse" : "bg-red-50 text-red-700 border-red-200"}`}>
          {status === "connected" ? "CONECTADO" : "DESCONECTADO"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Dirección IP del Proxy Local</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-2 text-xs text-gray-900 focus:outline-none font-mono placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={testConnection}
                disabled={testing}
                className="bg-violet-900 text-white px-4 rounded-xl font-bold text-xs hover:bg-gray-800 disabled:opacity-50 flex-shrink-0 cursor-pointer"
              >
                {testing ? "Probando..." : "Probar"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-[9px] text-gray-500 space-y-1">
            <p className="font-bold text-violet-900 uppercase tracking-wider text-[8px]">Telemetría Local:</p>
            {details ? (
              <>
                <p>• Impresora: <span className="text-green-600 font-bold">{details.model}</span></p>
                <p>• Puerto COM: <span className="text-green-600 font-bold">{details.port}</span></p>
                <p>• Registro Fiscal: <span className="text-green-600 font-bold">{details.machineSerial}</span></p>
              </>
            ) : (
              <p className="text-red-500 italic">No se detectó el Spooler de impresión fiscal local en el equipo.</p>
            )}
          </div>
        </div>

        <div className="bg-violet-900 text-white p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Descarga el script `fiscal-proxy.js` y ejecútalo en la PC que tenga la impresora fiscal física conectada por serial.
          </p>
          <button
            type="button"
            onClick={downloadProxyScript}
            className="w-full mt-2 py-2 bg-violet-600 hover:bg-[#b08e72] text-violet-900 font-black rounded-lg text-xs transition-colors cursor-pointer text-center"
          >
            Descargar fiscal-proxy.js
          </button>
        </div>
      </div>
    </div>
  );
}
