"use client";

import { KFS_BRAND } from "../../config/brandConfig";
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

export const resolveThemeColor = (color: string) => {
  if (!color) return "#7c3aed";
  if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl")) {
    return color;
  }
  const tailwindColors: { [key: string]: string } = {
    "violet-900": "#4c1d95",
    "violet-600": "#7c3aed",
    "indigo-600": "#4f46e5",
    "emerald-500": "#10b981",
    "amber-500": "#f59e0b",
    "red-500": "#ef4444",
  };
  return tailwindColors[color] || "#7c3aed";
};

export const MarketplaceView = ({ db, submitOnlineOrder, formatUSD, logout, currentUser }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const { rates, triggerGhostTrap, showToast } = useKFS();
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoadingStore, setIsLoadingStore] = useState(false);

  useEffect(() => {
    if (activeStoreId) {
      setIsLoadingStore(true);
      const timer = setTimeout(() => {
        setIsLoadingStore(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeStoreId]);

  const handleConfirmCheckout = (paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string, customerName: string, customerRif: string, paymentScreenshot?: string, kPointsToBurn: number = 0) => {
    submitOnlineOrder(checkoutProduct, paymentMethod, applyIva, paymentReference, customerPhone, customerName, customerRif, paymentScreenshot, kPointsToBurn);
    setCheckoutProduct(null);
  };

  const filteredClients = db.clients.filter((c: any) =>
    c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStore = activeStoreId ? db.clients.find((c: any) => c.id === activeStoreId) : null;
  const storeProducts = activeStore ? db.products.filter((p: any) => p.clientId === activeStoreId) : [];

  const filteredProducts = storeProducts.filter((p: any) =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredProducts = storeProducts.filter((p: any) => p.isFeatured);

  const categories = ["All", "Alimentos", "Ropa y Calzado", "Tecnología", "Salud y Belleza", "Hogar", "Servicios"];

  const settings = activeStore?.storeSettings || {};
  const themeColorRaw = settings.themeColor || "violet-600";
  const themeColor = resolveThemeColor(themeColorRaw);
  const typography = settings.typography || "font-sans";
  const layoutType = settings.layoutType || "grid";
  const profilePicUrl = settings.profilePicUrl || "";

  return (
    <div 
      className={`min-h-screen bg-[#EEF2F5] pb-20 ${activeStore ? typography : "font-sans"}`}
      style={{ "--store-theme-color": themeColor } as React.CSSProperties}
    >
      <Navbar title={activeStore ? `Mall: ${activeStore.company}` : `${KFS_BRAND.modules.marketplace}`} showBack={true} onBack={logout} />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {activeStore && settings.coverPhotoUrl ? (
          <div className="relative rounded-3xl overflow-hidden shadow-sm mb-8 border border-gray-100">
            <div className="h-48 w-full bg-gray-200">
              <img src={settings.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white p-6 pt-12 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="absolute -top-12 left-6 relative z-10 w-24 h-24 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden" style={{ borderColor: themeColor }}>
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Store Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store size={40} className="text-gray-300" />
                )}
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-28">
                <h2 className="text-3xl font-black text-violet-900">{activeStore.company}</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">{settings.bioText || "Catálogo exclusivo de este negocio."}</p>
              </div>
              <div className="relative w-full sm:w-80 shrink-0">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar en esta tienda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-600 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              {activeStore && profilePicUrl && (
                <img src={profilePicUrl} alt="Store Logo" className="w-16 h-16 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: themeColor }} />
              )}
              <div>
                <h2 className="text-2xl font-black text-violet-900">{activeStore ? activeStore.company : `Centros Comerciales ${KFS_BRAND.productAcronym}`}</h2>
                <p className="text-xs text-gray-500 mt-1">{activeStore ? (settings.bioText || "Catálogo exclusivo de este negocio.") : "Explora nuestras tiendas destacadas y descubre sus productos."}</p>
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={activeStore ? "Buscar en esta tienda..." : "Buscar comercio..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-600 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        {!activeStoreId ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredClients.map((c: any) => {
                const pCount = db.products.filter((p: any) => p.clientId === c.id).length;
                return (
                  <div key={c.id} onClick={() => setActiveStoreId(c.id)} className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-violet-900/5 rounded-2xl flex items-center justify-center group-hover:bg-violet-600/10 transition-colors">
                        <Store size={32} className="text-violet-900 group-hover:text-violet-600 transition-colors" />
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                        <Star size={12} className="fill-yellow-600" /> {c.rating || "5.0"}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-violet-900">{c.company}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{c.address || "Comercio Afiliado"}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>{pCount} Productos</span>
                      <span className="text-violet-600">Entrar a la tienda &rarr;</span>
                    </div>
                  </div>
                );
              })}
              {filteredClients.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
                  No se encontraron comercios.
                </div>
              )}
            </div>

            <div className="mt-8">
              <FlowExpressCatalog currentUser={currentUser} formatUSD={formatUSD} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { setActiveStoreId(null); setSearchQuery(""); }} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-900 transition-colors">
                <ChevronLeft size={16} /> Volver a Tiendas
              </button>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={selectedCategory === cat ? { backgroundColor: themeColor, color: '#fff' } : {}}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? "shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
                >
                  {cat === "All" ? "Todos los Productos" : cat}
                </button>
              ))}
            </div>

            {isLoadingStore ? (
              <div className="space-y-6 pt-4">
                <div className="h-6 w-48 bg-slate-200 rounded-[0.5rem] animate-shimmer" />
                <div className={`grid gap-6 ${layoutType === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4'}`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={`bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex ${layoutType === 'list' ? 'flex-row items-center h-32' : 'flex-col justify-between'}`}>
                      <div className={layoutType === 'list' ? 'flex flex-row w-full h-full' : 'w-full'}>
                        <div className={`${layoutType === 'list' ? 'w-32 h-full' : 'h-44 w-full'} bg-slate-200/50 animate-shimmer shrink-0`} />
                        <div className="p-4 flex flex-col justify-between w-full min-w-0">
                          <div className="space-y-2 flex-grow">
                            <div className="h-4 w-3/4 bg-slate-200/50 rounded animate-shimmer" />
                            <div className="h-3 w-1/2 bg-slate-200/30 rounded animate-shimmer" />
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="h-4 w-12 bg-slate-200/50 rounded animate-shimmer" />
                            <div className="h-3 w-10 bg-slate-200/30 rounded animate-shimmer" />
                          </div>
                          <div className="mt-4 h-8 w-full bg-slate-200/50 rounded-xl animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {featuredProducts.length > 0 && selectedCategory === "All" && searchQuery === "" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-violet-900 mb-4 flex items-center gap-2">
                      <Star className="text-yellow-500 fill-yellow-500" /> Productos Estrella
                    </h3>
                    <div className={`grid gap-6 ${layoutType === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4'}`}>
                      {featuredProducts.map((p: any) => (
                        <div key={p.id} className={`bg-gradient-to-br from-yellow-50 to-white rounded-[1.5rem] shadow-sm overflow-hidden border border-yellow-200 flex ${layoutType === 'list' ? 'flex-row items-center h-32' : 'flex-col justify-between'} transition-transform duration-200 hover:-translate-y-1 relative`}>
                          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/20 rounded-bl-[100%] z-0 pointer-events-none"></div>
                          <div className={`relative z-10 ${layoutType === 'list' ? 'flex flex-row w-full h-full' : 'w-full'}`}>
                            <div className={`${layoutType === 'list' ? 'w-32 h-full' : 'h-44 w-full'} bg-gray-100 overflow-hidden relative shrink-0`}>
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              <span className="absolute bottom-2 left-2 text-[8px] bg-yellow-500 text-white font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                                Destacado
                              </span>
                            </div>
                            <div className={`p-4 flex flex-col justify-between ${layoutType === 'list' ? 'w-full' : ''}`}>
                              <div>
                                <h4 className="font-bold text-sm text-violet-900 truncate mb-1">{p.name}</h4>
                                {p.description && <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{p.description}</p>}
                                <div className="flex justify-between items-center mt-2">
                                  <div>
                                    <p className="font-black text-sm" style={{ color: themeColor }}>{formatUSD(p.priceUSD)}</p>
                                    <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className={layoutType === 'list' ? 'mt-2' : 'mt-4'}>
                                <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} style={p.stock > 0 ? { backgroundColor: themeColor } : {}} className="w-full py-2 disabled:bg-gray-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-md hover:brightness-90 transition-all">
                                  <ShoppingCart size={14} /> {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Comprar"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`grid gap-6 ${layoutType === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4'}`}>
                  {filteredProducts.map((p: any) => (
                    <div key={p.id} className={`bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex ${layoutType === 'list' ? 'flex-row items-center h-32' : 'flex-col justify-between'} transition-transform duration-200 hover:-translate-y-1`}>
                      <div className={layoutType === 'list' ? 'flex flex-row w-full h-full' : 'w-full'}>
                        <div className={`${layoutType === 'list' ? 'w-32 h-full' : 'h-44 w-full'} bg-gray-100 overflow-hidden relative shrink-0`}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-[8px] bg-violet-900/80 text-white font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">
                            {p.category || "General"}
                          </span>
                        </div>
                        <div className={`p-4 flex flex-col justify-between ${layoutType === 'list' ? 'w-full' : ''}`}>
                          <div>
                            <h4 className="font-bold text-sm text-violet-900 truncate mb-1">{p.name}</h4>
                            {p.description && <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{p.description}</p>}
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <p className="font-black text-sm" style={{ color: themeColor }}>{formatUSD(p.priceUSD)}</p>
                                <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {p.stock && p.stock > 0 ? `${p.stock} disp.` : "Agotado"}
                              </span>
                            </div>
                          </div>
                          <div className={layoutType === 'list' ? 'mt-2' : 'mt-4'}>
                            <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} style={p.stock > 0 ? { backgroundColor: themeColor } : {}} className="w-full py-2 disabled:bg-gray-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-md hover:brightness-90 transition-all">
                              <ShoppingCart size={14} /> {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Comprar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
                      Esta tienda no tiene productos en esta categoría.
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>



      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onConfirm={handleConfirmCheckout}
          onCancel={() => setCheckoutProduct(null)}
          formatUSD={formatUSD}
          isOnline={true}
        />
      )}

      {receiptTx && (
        <ReceiptModal
          tx={receiptTx}
          product={db.products.find((p: any) => p.id === receiptTx.productId)}
          onClose={() => setReceiptTx(null)}
          formatUSD={formatUSD}
          triggerGhostTrap={triggerGhostTrap}
          showToast={showToast}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
