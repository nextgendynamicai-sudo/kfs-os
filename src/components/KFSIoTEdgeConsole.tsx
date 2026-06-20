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

export const KFSIoTEdgeConsole = ({ showToast }: { showToast: any }) => {
  const [devices, setDevices] = useState<string[]>(["Tiquetera Virtual {KFS_BRAND.productAcronym} (Loopback)"]);
  const [isScanningUSB, setIsScanningUSB] = useState(false);
  const [isScanningBT, setIsScanningBT] = useState(false);

  const handleScanUSB = async () => {
    setIsScanningUSB(true);
    showToast("Buscando tiqueteras térmicas WebUSB...");
    try {
      const nav = navigator as any;
      if (nav.usb) {
        const device = await nav.usb.requestDevice({ filters: [] });
        if (device) {
          setDevices(prev => [...prev, `${device.productName || "Impresora Genérica"} (USB)`]);
          showToast(`¡Tiquetera USB Vinculada: ${device.productName}!`, "success");
          playCashDrawerSound();
        }
      } else {
        setTimeout(() => {
          setDevices(prev => [...prev, "Xprinter XP-80 (USB Emulada)"]);
          showToast("WebUSB emulado: ¡Xprinter XP-80 vinculada con éxito!", "success");
          playCashDrawerSound();
        }, 1500);
      }
    } catch (e) {
      setTimeout(() => {
        setDevices(prev => [...prev, "Xprinter XP-80 (USB Emulada)"]);
        showToast("WebUSB emulado: ¡Xprinter XP-80 vinculada con éxito!", "success");
        playCashDrawerSound();
      }, 1200);
    }
    setIsScanningUSB(false);
  };

  const handleScanBluetooth = async () => {
    setIsScanningBT(true);
    showToast("Buscando dispositivos WebBluetooth...");
    try {
      const nav = navigator as any;
      if (nav.bluetooth) {
        const device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true
        });
        if (device) {
          setDevices(prev => [...prev, `${device.name || "Impresora Bluetooth"} (Bluetooth)`]);
          showToast(`¡Tiquetera Bluetooth Vinculada: ${device.name}!`, "success");
          playCashDrawerSound();
        }
      } else {
        setTimeout(() => {
          setDevices(prev => [...prev, "Zebra ZQ320 (Bluetooth Emulada)"]);
          showToast("WebBluetooth emulado: Zebra ZQ320 vinculada con éxito!", "success");
          playCashDrawerSound();
        }, 1500);
      }
    } catch (e) {
      setTimeout(() => {
        setDevices(prev => [...prev, "Zebra ZQ320 (Bluetooth Emulada)"]);
        showToast("WebBluetooth emulado: Zebra ZQ320 vinculada con éxito!", "success");
        playCashDrawerSound();
      }, 1200);
    }
    setIsScanningBT(false);
  };

  return (
    <div className="bg-violet-900 text-white p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            <div>
              <h3 className="text-sm font-black text-violet-600 tracking-wide uppercase">CONEXIÓN IoT EDGE & HARDWARE</h3>
              <p className="text-[9px] text-gray-400 font-mono">Controladores de Caja y Gaveta de 5V</p>
            </div>
          </div>
          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span> Canales Activos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action buttons */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Vincular Dispositivos</span>

            <button
              type="button"
              onClick={handleScanUSB}
              disabled={isScanningUSB}
              className="w-full py-3 bg-white/5 hover:bg-violet-600/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              🔌 {isScanningUSB ? "Buscando USB..." : "Conectar Tiquetera USB (WebUSB)"}
            </button>

            <button
              type="button"
              onClick={handleScanBluetooth}
              disabled={isScanningBT}
              className="w-full py-3 bg-white/5 hover:bg-violet-600/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              📡 {isScanningBT ? "Escaneando BT..." : "Vincular por Bluetooth (WebBluetooth)"}
            </button>
          </div>

          {/* Connected devices list */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Canales de Impresión Configurados</span>
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 max-h-32 overflow-y-auto">
              {devices.map((dev, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> {dev}
                  </span>
                  <span className="text-[8px] text-violet-600 uppercase font-black">Activo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
