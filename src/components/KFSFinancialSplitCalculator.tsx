"use client";

import { KFS_BRAND } from "../config/brandConfig";
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





export const KFSFinancialSplitCalculator = ({ formatUSD, formatEUR, clientFeePercentage = 0.03 }: { formatUSD: any, formatEUR: any, clientFeePercentage?: number }) => {
  const [inputAmt, setInputAmt] = useState(100);
  const [feePercentage, setFeePercentage] = useState(clientFeePercentage);
  const { rates } = useKFS();

  const kfsFeeTotalUSD = inputAmt * feePercentage + 0.04;
  const commerceNetUSD = inputAmt - kfsFeeTotalUSD;

  // Split calculations
  const kfsFeeTotalEUR = (kfsFeeTotalUSD * rates.USD) / rates.EUR;
  const promoterEUR = kfsFeeTotalEUR * 0.20;
  const kfsNetEUR = kfsFeeTotalEUR - promoterEUR;
  const adBudgetEUR = kfsNetEUR * 0.20;
  const finalNetEUR = kfsNetEUR - adBudgetEUR;

  return (
    <div className="bg-violet-900 text-white p-6 md:p-8 rounded-[2rem] border border-violet-600/30 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-violet-600/20 pb-4">
          <div>
            <h3 className="text-lg font-black text-white tracking-wide uppercase">Oráculo Financiero & Splits</h3>
            <p className="text-[10px] text-violet-200 font-mono">Simulador de Ecosistema {KFS_BRAND.productAcronym} OS</p>
          </div>
          <span className="bg-violet-650/15 border border-violet-500/30 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Fórmula SaaS + POS</span>
        </div>

        {/* Interactive controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-violet-200 uppercase tracking-wider block">Monto de Venta de Ejemplo</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="1000"
                value={inputAmt}
                onChange={(e) => setInputAmt(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-xl font-black font-mono text-white min-w-[70px] text-right">${inputAmt}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-violet-200 uppercase tracking-wider block">Tarifa BOS del Comercio</label>
            <div className="grid grid-cols-3 gap-2">
              {[0.03, 0.05, 0.10].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setFeePercentage(pct)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${feePercentage === pct ? "bg-violet-500 text-white" : "bg-white/10 text-white/90 border border-violet-500/30 hover:bg-white/20"}`}
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time splits visualization */}
        <div className="space-y-4 pt-4 border-t border-violet-600/15">
          <span className="text-[10px] font-black text-violet-200 uppercase tracking-widest block font-mono">Distribución del Flujo de Capital</span>

          {/* 1. Commerce share */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-white">
              <span>Ingreso Neto Comercio ({KFS_BRAND.modules.marketplace})</span>
              <span className="text-green-400 font-black">{formatUSD(commerceNetUSD)} ({((commerceNetUSD / inputAmt) * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${(commerceNetUSD / inputAmt) * 100}%` }}></div>
            </div>
          </div>

          {/* 2. Total {KFS_BRAND.productAcronym} Fee split */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-black text-white">Comisión Total Kreatek {KFS_BRAND.productAcronym}</span>
              <span className="text-red-400 font-mono font-black text-sm">{formatUSD(kfsFeeTotalUSD)}</span>
            </div>
            <p className="text-[9px] text-violet-200/90 leading-normal mb-2">Se distribuye en caliente de forma instantánea al registrar el cobro:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-violet-200 font-bold block uppercase tracking-wider">Promotora (20% share)</span>
                <span className="text-sm font-black text-yellow-400 block mt-1">{formatEUR(promoterEUR)}</span>
                <span className="text-[8px] text-violet-300 font-mono block">Directo a Wallet (EUR)</span>
              </div>

              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-violet-200 font-bold block uppercase tracking-wider">Publicidad (20% neto)</span>
                <span className="text-sm font-black text-indigo-400 block mt-1">{formatEUR(adBudgetEUR)}</span>
                <span className="text-[8px] text-violet-300 font-mono block">Inyección de Campañas</span>
              </div>

              <div className="bg-white/10 border border-white/20 p-3 rounded-xl">
                <span className="text-[9px] text-white font-black block uppercase tracking-wider">Arquitecto (Neto Neto)</span>
                <span className="text-sm font-black text-green-400 block mt-1">{formatEUR(finalNetEUR)}</span>
                <span className="text-[8px] text-violet-300 font-mono block">Ganancia Neta {KFS_BRAND.productAcronym}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background icon design */}
      <DollarSign size={150} className="absolute -right-16 -bottom-16 text-white/5 pointer-events-none" />
    </div>
  );
}
