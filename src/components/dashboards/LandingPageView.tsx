import { KFS_BRAND } from "../../config/brandConfig";
"use client";
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

export const LandingPageView = ({ setView }: any) => {
  return (
    <div className="min-h-screen bg-sky-50 text-sky-950 font-sans overflow-x-hidden selection:bg-sky-600 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-sky-100 py-4 px-6 sm:px-10 flex justify-between items-center transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-3">
          <KreatekLogo className="h-8 w-auto text-sky-600" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView("login")} className="text-sm font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer pt-2">
            Soy Cliente
          </button>
          <button onClick={() => setView("login")} className="text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors cursor-pointer hidden sm:block pt-2">
            Soy {KFS_BRAND.modules.marketplace} / Promotora
          </button>
          <button onClick={() => setView("b2b-onboarding")} className="text-sky-600 text-sm font-bold hover:text-sky-800 transition-colors cursor-pointer hidden sm:block pt-2">
            Afiliar Comercio (B2B)
          </button>
          <button onClick={() => setView("login")} className="bg-sky-600 text-white px-5 py-2 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sky-600/30 cursor-pointer border-none">
            Acceder
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] -z-10"></div>

        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-sky-200 text-xs font-bold text-sky-600 uppercase tracking-widest backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            El Ecosistema Financiero Definitivo
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-sky-950">
            Gobierna tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              Comercio Local
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            Punto de venta físico (POS), E-Commerce integrado con descripciones optimizadas, proxy fiscal SENIAT y conciliación automatizada en una sola plataforma en la nube.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => setView("login")} className="bg-sky-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-600/30 cursor-pointer flex items-center justify-center gap-2 border-none">
              <Zap size={20} /> Empezar Ahora
            </button>
            <button onClick={() => {
              const el = document.getElementById("pricing");
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="bg-white border border-sky-100 shadow-md text-sky-900 px-8 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1">
              Ver Planes y Precios
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative z-10">
          <div className="bg-white rounded-[2rem] p-4 shadow-2xl shadow-sky-200/50 border border-sky-50 transition-transform duration-700 ease-out">
            <img src="/hero_cards.png" alt="Dashboard Preview" className="w-full h-auto rounded-xl object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-sky-950">Todo lo que necesitas, <span className="text-sky-600">sin licencias extra</span>.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Reemplazamos tu sistema viejo, el hardware obsoleto y las comisiones ocultas por un hub centralizado de alto rendimiento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">Flow Express (E-Commerce)</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Tu inventario físico se refleja automáticamente en tu vitrina e-commerce gratuita. Los clientes compran online en tiempo real.</p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Printer className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">Sincro-Shield Fiscal (SENIAT)</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Conéctate directamente a tu impresora fiscal en red local cumpliendo las normativas del SENIAT sin pagar licencias de intermediarios.</p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">Auto-Conciliación SMS</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Evita fraudes de captures falsos. Nuestro conciliador en la nube lee el SMS del banco y aprueba las órdenes online de forma autónoma.</p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">Bóveda Criptográfica</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Configura tus datos de Pago Móvil, Zinli, AirTM, Ubbi, Wally y Binance Pay. Tus compradores los verán directamente y podrán subir referencias y captures.</p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">Instalación PWA Móvil</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Instala la aplicación en tu pantalla de inicio móvil con un icono nativo en un segundo, sin descargar tiendas App Store o Google Play.</p>
          </div>

          {/* Benefit 6 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-sky-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-sky-950">CRM & Fidelización Express</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Registra compras vinculando la cédula del cliente (escaneo manual o cámara), otorga puntos {KFS_BRAND.productAcronym} y premia su fidelidad.</p>
          </div>
        </div>
      </section>

      {/* Pioneer Banner Section */}
      <section id="pricing" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <PioneerOfferBanner />

        <div className="text-center mt-16 mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-sky-950 tracking-tighter mb-6">Planes Escalamiento</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Elige el ecosistema {KFS_BRAND.productAcronym} que se adapte al flujo de tu negocio o aprovecha la tasa Pionero arriba.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Plan 1 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 rounded-[2.5rem] p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all relative">
            <div>
              <h3 className="text-2xl font-black text-sky-950">Flow Velocity</h3>
              <p className="text-sm text-slate-500 mt-2">Perfecto para negocios pequeños empezando a digitalizarse.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-sky-950">3%</span>
                <span className="text-sm text-slate-500 block mt-1">Por Venta</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> POS Offline/Online</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> {KFS_BRAND.modules.marketplace} PWA Personalizada</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Control de 1 Caja Múltiple</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Cierre Z Básico</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-sky-50 text-sky-700 font-bold py-4 rounded-xl mt-8 cursor-pointer transition-colors hover:bg-sky-100 border-none">Empezar</button>
          </div>

          {/* Plan 2 (Popular) */}
          <div className="bg-gradient-to-br from-white to-sky-50 shadow-2xl shadow-sky-200/50 border-2 border-sky-300 rounded-[2.5rem] p-8 flex flex-col justify-between hover:-translate-y-4 transition-all relative transform md:-translate-y-2">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-sky-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">Más Popular</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-sky-950">Flow Matrix AI</h3>
              <p className="text-sm text-slate-500 mt-2">El motor completo para escalar y fidelizar clientes en piloto automático.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-sky-950">5%</span>
                <span className="text-sm text-slate-500 block mt-1">Por Venta + $3 USD/mes Suscripción Nube</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Todo lo de Flow Velocity</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Auto-Conciliación SMS Integrada</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> CRM & Vales de Crédito (3 POS)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> **Marketing AI**: Sugerencias de descripciones</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> **Flujos cada 4 días**: Ofertas planificadas</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Generación de Posts listos para Ads</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-sky-600 text-white shadow-lg shadow-sky-600/30 font-black py-4 rounded-xl mt-8 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform border-none">Suscribirme</button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 rounded-[2.5rem] p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all relative">
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase block w-max mb-4">Líder</span>
              <h3 className="text-2xl font-black text-sky-950">Flow Monopoly OS</h3>
              <p className="text-sm text-slate-500 mt-2">El ecosistema financiero corporativo total para grandes franquicias.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-sky-950">10%</span>
                <span className="text-sm text-slate-500 block mt-1">Por Venta + $6 USD/mes Suscripción Nube</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Todo lo de Flow Matrix AI</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> POS ilimitados + SENIAT Proxy PnP</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> **Presupuesto Ads Directo**: Incluido en fee</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> **Omnicanalidad**: Ads en IG, FB y WhatsApp</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> IA para buscar clientes en redes</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-sky-600" /> Diseños y Copys de contenido automatizados</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-sky-50 text-sky-700 font-bold py-4 rounded-xl mt-8 cursor-pointer transition-colors hover:bg-sky-100 border-none">Empezar</button>
          </div>
        </div>
      </section>

      {/* AI Deep Dive Section */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-sky-100 bg-sky-50 rounded-[3rem]">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-black text-sky-600 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
            Inteligencia Artificial Proactiva
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-sky-950">
            Gemini Flash al Servicio de tus Ventas
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            No es un chatbot pasivo. Es un agente inteligente que trabaja en segundo plano para vender de forma autónoma basándose en datos reales de tus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Outreach */}
          <div className="bg-white border border-sky-100 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] hover:border-sky-300 transition-colors">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-sky-500" size={24} />
            </div>
            <h4 className="font-black text-xl text-sky-950 mb-3">Outreach Automatizado (Cada 4 Días)</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              El motor de {KFS_BRAND.productAcronym} OS audita los clientes inactivos. Gemini Flash analiza el historial de compras del cliente y las ofertas planificadas por tus vendedores para redactar mensajes promocionales de WhatsApp Business hiper-personalizados.
            </p>
            <p className="text-xs text-slate-400 mt-4 italic">
              *Nota: {KFS_BRAND.productAcronym} cubre el costo de la IA. El envío por WhatsApp Cloud API (Meta) tiene un costo externo de aprox. $0.05 por conversación iniciado por el comercio (recargable en tu balance {KFS_BRAND.productAcronym}).
            </p>
          </div>

          {/* Card 2: Copywriting Optimizer */}
          <div className="bg-white border border-sky-100 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] hover:border-sky-300 transition-colors">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
              <ShoppingCart className="text-sky-500" size={24} />
            </div>
            <h4 className="font-black text-xl text-sky-950 mb-3">Optimización del {KFS_BRAND.modules.marketplace}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Gemini audita el catálogo en vivo. Si detecta productos con descripciones incompletas o sin gancho comercial, redacta propuestas de copywriting optimizadas para SEO y conversiones. Los comerciantes pueden aplicarlas en su catálogo con un solo clic.
            </p>
          </div>

          {/* Card 3: Social Media Lead Hunting */}
          <div className="bg-white border border-sky-100 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] hover:border-sky-300 transition-colors">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-sky-500" size={24} />
            </div>
            <h4 className="font-black text-xl text-sky-950 mb-3">Buscador de Clientes en Redes</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Un scraper inteligente conectado a Gemini rastrea menciones públicas en tu ciudad de usuarios buscando recomendaciones de compra en redes sociales. La IA pre-califica el lead y te muestra la oportunidad directamente en el panel de control.
            </p>
          </div>
        </div>
      </section>

      {/* Contract, Setup and Promotoras Details */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-black text-sky-600 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
            Estructura Financiera y de Afiliación
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-sky-950">
            Transparencia de Costos e Incentivos
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            El modelo de Kreatek elimina licencias de software complejas y las sustituye por comisiones claras por uso y una red de incentivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Card 1: Setup Fee */}
          <div className="bg-white border border-sky-50 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-sky-950 mb-2">Cuota de Setup (Instalación)</h4>
            <div className="text-4xl font-black text-sky-600 my-4">$75 USD <span className="text-xs text-slate-400 font-normal">pago único</span></div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Cubre la provisión del nodo en Supabase, el aprovisionamiento del proxy fiscal, la configuración del catálogo digital inicial y la asignación del soporte local.
            </p>
            <div className="border-t border-sky-100 pt-4">
              <span className="text-xs font-bold text-slate-400 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-600 mt-1 font-bold">
                La Promotora que afilia el comercio recibe el 50% ($37.50 USD) de esta cuota de inmediato.
              </p>
            </div>
          </div>

          {/* Card 2: Cloud Maintenance */}
          <div className="bg-white border border-sky-50 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-sky-950 mb-2">Mantenimiento Mensual Nube</h4>
            <div className="text-4xl font-black text-sky-600 my-4">$6 USD <span className="text-xs text-slate-400 font-normal">al mes</span></div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Cubre el hosting seguro SSL en Vercel, almacenamiento continuo de bases de datos, actualizaciones de seguridad y el conciliador automático de SMS del banco.
            </p>
            <div className="border-t border-sky-100 pt-4">
              <span className="text-xs font-bold text-slate-400 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-600 mt-1 font-bold">
                La Promotora recibe el 50% ($3.00 USD) de forma fija mensual de por vida mientras el comercio esté activo.
              </p>
            </div>
          </div>

          {/* Card 3: Royalties */}
          <div className="bg-white border border-sky-50 shadow-xl shadow-sky-100/50 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-sky-950 mb-2">Regalías de Venta (Comisiones)</h4>
            <div className="text-4xl font-black text-sky-600 my-4">3% / 5% / 10% <span className="text-xs text-slate-400 font-normal">por venta real</span></div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {KFS_BRAND.productAcronym} no te cobra licencias de software fijas si no vendes. La comisión se descuenta automáticamente por venta confirmada en caja POS o {KFS_BRAND.modules.marketplace} online.
            </p>
            <div className="border-t border-sky-100 pt-4">
              <span className="text-xs font-bold text-slate-400 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-600 mt-1 font-bold">
                La Promotora recibe el 20% de las regalías de {KFS_BRAND.productAcronym} de por vida sobre cada artículo vendido por el comercio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kreatek / Value Proposition Section */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-sky-100 bg-white rounded-[3rem] shadow-xl shadow-sky-100/50 mb-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-black text-sky-600 uppercase tracking-widest">
            ¿Por qué Kreatek Flow Systems?
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-sky-950">
            La Elección Inteligente para Comercios y Promotoras
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Eliminamos los altos costos de software y comisiones ocultas del retail tradicional, reemplazándolos con un sistema de incentivos donde todos ganan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Business Value Proposition */}
          <div className="bg-sky-50 border border-sky-100 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between hover:border-sky-300 transition-all">
            <div className="space-y-6">
              <span className="text-sky-600 text-xs font-black uppercase tracking-widest block">Para Dueños de Negocio</span>
              <h3 className="text-3xl font-black text-sky-950">Simplifica tu operación y reduce tus gastos al mínimo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {KFS_BRAND.productAcronym} OS unifica tu tienda física y e-commerce bajo un mismo motor lógico. Olvídate de pagar suscripciones separadas de inventario, pasarelas de pago externas y licencias para conectar impresoras fiscales.
              </p>

              <div className="space-y-4 border-t border-sky-200 pt-6">
                <h4 className="font-bold text-sky-700 text-sm uppercase tracking-wider">Ahorro Garantizado:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Ahorro en Hardware:</strong> Usa cualquier smartphone o tablet como POS físico ($0 USD en terminales dedicados).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Ahorro en Licencias:</strong> E-commerce e inventario en tiempo real unificados sin cargos adicionales de software.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Ahorro Fiscal:</strong> Sincro-Shield Fiscal directo a tu impresora sin pagar intermediarios.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Conciliación Automática:</strong> Evita al 100% las estafas con captures falsos gracias a la lectura directa de SMS bancarios.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("kfs_pending_tab", "register");
                  }
                  setView("login");
                }}
                className="w-full sm:w-auto bg-sky-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-sky-600/30 cursor-pointer border-none"
              >
                Registrar mi Comercio (Setup)
              </button>
            </div>
          </div>

          {/* Promotoras Value Proposition */}
          <div className="bg-sky-600 border border-sky-500 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between hover:border-sky-400 transition-all relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] -z-10"></div>

            <div className="space-y-6">
              <span className="text-sky-100 text-xs font-black uppercase tracking-widest block">Para Promotoras de Expansión</span>
              <h3 className="text-3xl font-black text-white">Construye una fuente de ingresos pasivos de por vida</h3>
              <p className="text-sm text-sky-100 leading-relaxed">
                No vendes un software convencional; afilias comercios al hardware transaccional más avanzado de la región. Trabaja a tu propio ritmo buscando tiendas locales y cobrando comisiones recurrentes.
              </p>

              <div className="space-y-4 border-t border-sky-500 pt-6">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Tus Beneficios y Labores:</h4>
                <ul className="space-y-3 text-xs text-sky-50">
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>50% del Setup ($37.50 USD):</strong> Cobro inmediato en tu panel por cada comercio nuevo que instales y configures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>50% del Mantenimiento ($3.00 USD):</strong> Ingreso pasivo mensual constante por cada comercio activo en la nube.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>20% de las Regalías de Caja:</strong> Ganancia permanente sobre el fee de cada artículo que venda el comercio de por vida.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>Tus Labores:</strong> Afiliación y acompañamiento del dueño de tienda en su registro y carga del catálogo inicial.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("kfs_pending_tab", "registerPromo");
                  }
                  setView("login");
                }}
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer bg-transparent"
              >
                Sé Promotora de Kreatek Flow Systems OS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Process / Steps Section */}

      <section id="process" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-sky-950">Proceso de Activación Rápida</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Pon en marcha tu tienda física y canal digital e-commerce en solo 4 pasos sencillos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-6 rounded-[2rem] relative hover:-translate-y-1 transition-transform">
            <span className="text-6xl font-black text-sky-100 absolute right-6 top-6">01</span>
            <h4 className="font-black text-lg text-sky-950 mb-2 relative z-10">Registro de Cuenta</h4>
            <p className="text-sm text-slate-500 relative z-10">Regístrate en menos de un minuto como dueño del comercio e ingresa los detalles básicos.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-6 rounded-[2rem] relative hover:-translate-y-1 transition-transform">
            <span className="text-6xl font-black text-sky-100 absolute right-6 top-6">02</span>
            <h4 className="font-black text-lg text-sky-950 mb-2 relative z-10">Configurar Bóveda</h4>
            <p className="text-sm text-slate-500 relative z-10">Establece tus cuentas de Pago Móvil, Zinli, AirTM, Ubbi, Wally y Binance Pay en la bóveda cifrada en tu panel.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-6 rounded-[2rem] relative hover:-translate-y-1 transition-transform">
            <span className="text-6xl font-black text-sky-100 absolute right-6 top-6">03</span>
            <h4 className="font-black text-lg text-sky-950 mb-2 relative z-10">Subir Productos</h4>
            <p className="text-sm text-slate-500 relative z-10">Sube fotos de tus productos, ponles precio, stock y una descripción detallada en tu inventario.</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white shadow-xl shadow-sky-100/50 border border-sky-50 p-6 rounded-[2rem] relative hover:-translate-y-1 transition-transform">
            <span className="text-6xl font-black text-sky-100 absolute right-6 top-6">04</span>
            <h4 className="font-black text-lg text-sky-950 mb-2 relative z-10">Cobrar y Vender</h4>
            <p className="text-sm text-slate-500 relative z-10">Publica el enlace de tu {KFS_BRAND.modules.marketplace} o usa la caja POS física. Valida captures y emite facturas.</p>
          </div>
        </div>
      </section>

      {/* Explicit Deliverables Checklist */}
      <section className="py-20 px-6 sm:px-10 max-w-4xl mx-auto border-t border-white/5">
        <h3 className="text-2xl md:text-3xl font-black text-center mb-10">¿Qué incluye el Contrato de Servicio de Kreatek?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-sm">Hospedaje Web y Dominio SSL Seguro</p>
              <p className="text-xs text-gray-400 mt-1">Conexión cifrada HTTPS integrada de forma nativa.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-sm">Base de Datos Supabase en la Nube</p>
              <p className="text-xs text-gray-400 mt-1">Sincronización en tiempo real protegida contra colisiones.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-sm">Actualizaciones Fiscales Incluidas</p>
              <p className="text-xs text-gray-400 mt-1">El proxy fiscal se actualiza de acuerdo a normas SENIAT.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-sm">Instalación PWA Rápida</p>
              <p className="text-xs text-gray-400 mt-1">Fácil acceso webapp en móviles sin pagar tiendas de apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center border-t border-violet-100 relative">
        <div className="absolute inset-0 bg-violet-600/5 -z-10"></div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-violet-900 tracking-tight">El Nuevo Estándar <br className="hidden md:block"/> Financiero.</h2>
        <p className="text-xl text-violet-600 mb-10 font-bold">Sin contratos complejos. Comisiones transparentes.</p>
        <button onClick={() => setView("login")} className="bg-violet-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none cursor-pointer">
          Acceder al Sistema
        </button>
      </section>
    </div>
  );
}
