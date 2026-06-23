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

export const PromotoraDashboard = ({ db, setDb, currentUser, registerClient, upgradeToPremium, settlePromotoraEarnings, formatUSD, formatEUR, logout, registerVendedor }: any) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterVendedor, setShowRegisterVendedor] = useState(false);
  const [showCustomerRegister, setShowCustomerRegister] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [customizingClient, setCustomizingClient] = useState<any>(null);
  const { updateStoreSettings, replyTicket, validateTopUp, showToast } = useKFS() as any;
  const myClients = db.clients.filter((c: any) => c.promotoraId === currentUser.id);
  const myPromotoraData = db.promotoras.find((p: any) => p.id === currentUser.id);
  const filteredClients = myClients.filter((c: any) => c.company?.toLowerCase().includes(searchClient.toLowerCase()) || c.name?.toLowerCase().includes(searchClient.toLowerCase()));
  const myCustomers = db.customers?.filter((c: any) => c.referred_by_promoter_id === currentUser.id) || [];

  const pendingTopUps = db.topups?.filter((t: any) => t.status === 'pending' && (
    (t.userType === 'client' && myClients.find((c: any) => c.id === t.userId)) ||
    (t.userType === 'customer' && myCustomers.find((c: any) => c.id === t.userId))
  )) || [];

  const [activeTab, setActiveTab] = useState("panel"); // panel | negocios | afiliados
  const [activeManual, setActiveManual] = useState<string | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [hostUrl, setHostUrl] = useState("https://kfs-os.vercel.app");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-sky-950 relative">
      {/* Wavy Header */}
      <div className="bg-gradient-to-br from-sky-900 to-sky-950 rounded-b-[3rem] shadow-xl shadow-sky-900/20 pt-6 pb-12 px-6 text-white relative z-10 border-b border-sky-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-sky-300"><CheckCircle size={20} /></span>
            <h1 className="font-black text-xl tracking-tight text-white">{KFS_BRAND.productAcronym} Promotora</h1>
          </div>
          <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-orange-300/50" title="Billetera KFS Points">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">K-Pts</span>
                <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>
              </div>
              <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">
                <LogOut size={16} />
              </button>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg border-4 border-sky-800 relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate text-white">{currentUser.name}</h2>
            <p className="text-sky-300 font-mono text-xs mt-1 bg-sky-950/50 inline-block px-2 py-0.5 rounded-md border border-sky-800">{currentUser.phone}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto -mt-6 relative z-20 flex flex-col gap-8 animate-fade-in">
        <OracleInsightCard role="promoter" data={{ inactiveNode: myClients[0]?.company || 'N/A', remainingPioneerNodes: 100 - (db.clients?.length || 0) }} />

        {activeTab === "panel" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-sky-900 to-sky-800 rounded-[2rem] p-6 text-white shadow-xl shadow-sky-900/20 border border-sky-700 animate-fade-in">
              <div>
                <h3 className="font-black text-xl text-white">¿Tienes tu propio negocio?</h3>
                <p className="text-sky-200 text-sm mt-1">Crea tu tienda oficial anclada a ti misma. Su validación será automática.</p>
              </div>
              <button 
                onClick={() => {
                  window.location.href = `/?role=register&ref=${currentUser.id}#login`;
                }}
                className="bg-white text-sky-950 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-black/10 border-none"
              >
                Abrir Mi Propia {KFS_BRAND.modules.marketplace}
              </button>
            </div>
            
            {/* Axis Nitro Hub Action */}
            <div className="flex justify-between items-center bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-[2rem] p-6 text-black shadow-xl shadow-yellow-500/20 border border-yellow-400 animate-fade-in">
              <div>
                <h3 className="font-black text-xl text-black">Desplegar Tienda Axis Nitro</h3>
                <p className="text-yellow-900 text-sm mt-1 font-bold">Configura una tienda online independiente para tus comercios.</p>
              </div>
              <a 
                href="/axis/nitro-setup"
                className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-black/10 no-underline text-center"
              >
                Activar Nodo Nitro
              </a>
            </div>
            <ReferralLinksWidget userId={currentUser.id} showToast={showToast} />
            <UniversalWalletWidget currentUser={myPromotoraData} formatUSD={formatUSD} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white text-sky-950 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <p className="text-sky-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14} className="text-emerald-500" /> Regalías Liquidadas (BOS)</p>
                  <h2 className="text-5xl font-black mb-1 text-emerald-600">{formatEUR(myPromotoraData?.passiveEarningsEUR || 0)}</h2>
                  <p className="text-xs text-slate-500 mt-2">Modelo Revenue Share (20%)</p>
                  {(myPromotoraData?.passiveEarningsEUR || 0) > 0 && (
                    <button onClick={() => setShowPayoutModal(true)} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform cursor-pointer shadow-lg shadow-sky-600/30 flex justify-center items-center gap-2 mt-4">
                      <CheckCircle size={18} /> Solicitar Retiro
                    </button>
                  )}
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-sky-50" />
              </div>

              <div className="bg-white text-sky-950 p-8 rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 relative overflow-hidden flex flex-col">
                <div className="relative z-10">
                  <p className="text-sky-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-sky-400" /> Nodos Captados</p>
                  <h2 className="text-5xl font-black mb-1 text-sky-950">{myPromotoraData?.setups || 0}</h2>
                  <p className="text-xs text-slate-500 mt-2">Comercios afiliados activos</p>
                </div>
                <Users size={100} className="absolute -right-10 -bottom-10 text-sky-50" />
              </div>
            </div>

            {pendingTopUps.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 p-8 text-sky-950 mt-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-emerald-600"><DollarSign className="text-emerald-500" /> Recargas Pendientes por Validar</h3>
                <div className="space-y-4">
                  {pendingTopUps.map((t: any) => {
                    const user = t.userType === 'client' ? myClients.find((c: any) => c.id === t.userId) : myCustomers.find((c: any) => c.id === t.userId);
                    const name = t.userType === 'client' ? user?.company : user?.name;
                    return (
                      <div key={t.id} className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                          {t.screenshotBase64 && (
                            <a href={t.screenshotBase64} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-sky-200 block hover:scale-105 transition-transform shadow-sm">
                              <img src={t.screenshotBase64} alt="Comprobante" className="w-full h-full object-cover" />
                            </a>
                          )}
                          <div>
                            <p className="font-bold text-sm text-sky-950">{name} <span className="text-[10px] bg-sky-200/50 px-2 py-0.5 rounded-full text-sky-700 uppercase ml-2">{t.userType}</span></p>
                            <p className="text-xs text-slate-500 font-mono mt-1">Ref: {t.paymentReference} | {new Date(t.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="text-right flex-1 md:flex-none">
                            <p className="text-[10px] text-slate-500 uppercase font-black">Monto a Acreditar</p>
                            <p className="text-xl font-black text-emerald-600">${t.amountUSD.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => validateTopUp(t.id, 'rejected', currentUser.id)} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors cursor-pointer border border-red-200">
                              <X size={18} />
                            </button>
                            <button onClick={() => validateTopUp(t.id, 'approved', currentUser.id)} className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 flex items-center justify-center transition-colors cursor-pointer border border-emerald-200">
                              <CheckCircle size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 border border-sky-100 p-8 text-sky-950 mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-red-500"><Bell className="text-red-500" /> Tickets de Mis Comercios</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {(db.supportTickets || []).slice().reverse().filter((t: any) => {
                  const client = myClients.find((c: any) => c.id === t.clientId);
                  return client !== undefined;
                }).map((ticket: any) => {
                  const client = myClients.find((c: any) => c.id === ticket.clientId);
                  return (
                    <div key={ticket.id} className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-sky-950">[{ticket.status === 'open' ? '🔴 ABIERTO' : '🟢 CERRADO'}] {client?.company || "Comercio"} - {ticket.subject}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-sky-200">
                        {ticket.messages.map((m: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-sky-600">{m.author}:</span> <span className="text-slate-600">{m.text}</span>
                          </div>
                        ))}
                      </div>
                      {ticket.status === 'open' && (
                        <div className="flex gap-2 mt-2">
                          <input type="text" id={`reply-promo-${ticket.id}`} placeholder="Respuesta..." className="flex-1 bg-white border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-sky-950 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 placeholder:text-slate-400" />
                          <button onClick={() => {
                            const input = document.getElementById(`reply-promo-${ticket.id}`) as HTMLInputElement;
                            if (input && input.value) {
                              replyTicket(ticket.id, `Promotora ${currentUser.name}`, input.value);
                              input.value = "";
                            }
                          }} className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer hover:bg-sky-700 shadow-md shadow-sky-600/20">Responder</button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {(db.supportTickets || []).filter((t: any) => myClients.find((c: any) => c.id === t.clientId)).length === 0 && (
                  <p className="text-slate-500 text-sm font-bold text-center py-4">No hay tickets de soporte activos.</p>
                )}
              </div>
            </div>

            {/* Manuals Section */}
            <div className="bg-gradient-to-r from-sky-950 to-sky-900 text-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-sky-900/20 relative overflow-hidden border border-sky-800">
              <h3 className="text-xl font-black mb-6">Centro de Aprendizaje y Manuales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setActiveManual('sales')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <BookOpen size={32} className="text-sky-400" />
                  <span className="font-bold text-sm">Manual de Ventas</span>
                </button>
                <button onClick={() => setActiveManual('implementation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <Settings size={32} className="text-sky-400" />
                  <span className="font-bold text-sm">Guía de Implementación</span>
                </button>
                <button onClick={() => setActiveManual('installation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <DownloadCloud size={32} className="text-sky-400" />
                  <span className="font-bold text-sm">Setup Fiscal Proxy</span>
                </button>
                <a href="/presentacion_kan_cgos.pdf" download="presentacion_kan_cgos.pdf" className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10 no-underline text-white text-center">
                  <FileText size={32} className="text-emerald-400" />
                  <span className="font-bold text-sm">Presentación KAN CGOS (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "negocios" && (
          <div className="space-y-6">
            {!showRegister ? (
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-sky-100 pb-4 gap-4">
                  <h3 className="text-xl font-black text-sky-950">Mis Comercios Activados</h3>
                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Buscar comercio..." className="w-full bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 placeholder:text-slate-400 text-sky-950 transition-all" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
                    </div>
                    <button onClick={() => setShowRegister(true)} className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors shadow-md shadow-sky-600/30 cursor-pointer">+ Nuevo Setup</button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-sky-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-sky-50 text-sky-700 uppercase text-xs font-black">
                      <tr>
                        <th className="py-4 px-4 rounded-tl-xl">Nodo Comercial</th>
                        <th className="py-4 px-4">Contacto</th>
                        <th className="py-4 px-4">Tarifa BOS</th>
                        <th className="py-4 px-4 text-center">{KFS_BRAND.modules.marketplace}</th>
                        <th className="py-4 px-4 text-right rounded-tr-xl">Deuda {KFS_BRAND.productAcronym}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredClients.map((c: any) => (
                        <tr key={c.id} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-sky-950">
                            <div className="flex items-center gap-2">
                              {c.company}
                              {c.account_tier === 'free' && (
                                <button
                                  onClick={() => upgradeToPremium(c.id, currentUser.id)}
                                  className="bg-gradient-to-r from-sky-600 to-amber-500 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm cursor-pointer border-none"
                                >
                                  Upgrade $5
                                </button>
                              )}
                              {c.account_tier === 'premium' && (
                                <span className="bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm">
                                  Premium
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-500">{c.name}<br /><span className="text-xs font-mono">{c.phone}</span></td>
                          <td className="py-4 px-4 font-bold text-sky-600">{(c.kfsFeePercentage || 0.03) * 100}%</td>
                          <td className="py-4 px-4 text-center">
                            <button onClick={() => setCustomizingClient(c)} className="bg-slate-100 hover:bg-slate-200 text-sky-950 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 mx-auto shadow-sm">
                              <Palette size={14} /> Diseño
                            </button>
                          </td>
                          <td className="py-4 px-4 font-black text-red-500 text-right">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                        </tr>
                      ))}
                      {myClients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-bold">Sin nodos comerciales supervisados.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 max-w-2xl mx-auto">
                <RegisterClientForm onRegister={(data: any) => { registerClient(data, currentUser.id, data.kfsFeePercentage); setShowRegister(false); }} onCancel={() => setShowRegister(false)} standalone={false} />
              </div>
            )}
          </div>
        )}
      </div>

      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl">
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-violet-900 transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            <StorefrontCustomizer client={customizingClient} updateStoreSettings={(id: string, settings: any) => {
              updateStoreSettings(id, settings);
              setCustomizingClient(null);
            }} />
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-violet-900 rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-violet-900">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-violet-900 transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>

            {activeManual === 'sales' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-violet-600" size={28} /> Manual de Ventas: {KFS_BRAND.productAcronym} Ecosistema</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">1. Elevator Pitch (El Gancho):</p>
                    <p>Kreatek Flow Systems OS no es solo un punto de venta. Es un sistema operativo integral que fusiona facturación fiscal, control de inventario y un marketplace E-Commerce automatizado llamado "Nitro Market".</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">2. Beneficio Principal (Comercio):</p>
                    <p>Eliminación de hardware obsoleto. Nuestro Sincro-Shield fiscal proxy permite conectar la nube directamente con impresoras fiscales sin pagar licencias de terceros anuales altísimas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">3. Beneficio Principal (Tú como Promotor):</p>
                    <p>Recibes <span className="font-black text-green-600">20% de Revenue Share (Regalías)</span> de por vida sobre las comisiones generadas por los nodos comerciales que afilies. Esto es ingreso pasivo real y escalable.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">4. Manejo de Objeciones:</p>
                    <p>"Ya tengo un sistema". Respuesta: "{KFS_BRAND.productAcronym} es gratis de instalar y de licencia perpetua en la nube. Reemplazamos sus licencias caras y les damos E-Commerce gratis integrado en una sola app web."</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'implementation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings className="text-violet-600" size={28} /> Guía de Implementación {KFS_BRAND.productAcronym}</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">1. Registro del Comercio:</p>
                    <p>En este panel, haz clic en "+ Nuevo Setup". Llena los datos reales del comercio, asignando el email del dueño y una clave genérica para su primer acceso.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">2. Configuración de Tarifa BOS:</p>
                    <p>El default es 3% del total facturado. Puedes negociar hasta un 1% para clientes de alto volumen. Ese % es de lo que tú ganarás el 20%.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">3. Personalización UI:</p>
                    <p>Usa el botón "Diseño" en la tabla de comercios para subir el logo del cliente, fondo y colores de su {KFS_BRAND.modules.marketplace}.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">4. Carga de Inventario:</p>
                    <p>Acompaña al dueño en la creación de los primeros 5 productos para asegurar que entienda cómo funciona el código de barras y la vinculación de precios base.</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'installation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><DownloadCloud className="text-violet-600" size={28} /> Setup Sincro-Shield Fiscal</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
                    <p className="font-black text-red-800 text-xs uppercase tracking-widest mb-1">Obligatorio por Ley SENIAT</p>
                    <p className="text-red-700 text-xs">Esta integración garantiza que el comercio cumpla con las normativas fiscales venezolanas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">1. Requisitos de Hardware:</p>
                    <p>Máquina fiscal compatible (Ej: The Factory HKA modelo Bixolon, Aclas) conectada por cable USB a la PC principal de Caja (Windows/Mac).</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">2. Descarga del Proxy Local:</p>
                    <p>En el dashboard del Cliente o Vendedor, se debe descargar "Sincro-Shield Fiscal Proxy" y tener Node.js instalado en el sistema operativo del cliente.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-violet-900 mb-1">4. Pruebas de Transmisión:</p>
                    <p>En {KFS_BRAND.productAcronym} OS (Caja), abrir el Setup Sincro-Shield y presionar "Probar Conexión Proxy". Si responde, marcar la casilla "Imprimir Copias Fiscales por Defecto".</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "afiliados" && (
        <div className="space-y-6">
          {/* ── Captación Universal {KFS_BRAND.productAcronym} — 3 QR Codes ─────────────────── */}
          <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 text-sky-950">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><span>📡</span> Captación Universal {KFS_BRAND.productAcronym}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sky-50/50 shadow-sm border border-sky-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">🏪 Dueños / Comercios</h4>
                <div className="w-36 h-36 bg-white rounded-xl border border-sky-200 p-1.5 shadow-sm">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(hostUrl + '?role=dueño&ref=' + currentUser.id)}`} alt="QR Dueños" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-slate-500 leading-tight">Ganas <strong className="text-sky-700">50% de la cuota</strong> + 20% regalías de por vida.</p>
                <button onClick={() => { navigator.clipboard.writeText(hostUrl + '?role=dueño&ref=' + currentUser.id); showToast('Enlace copiado', 'success'); }} className="text-[10px] font-black text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-lg cursor-pointer w-full transition-colors border border-sky-200">📋 Copiar Enlace Comercios</button>
              </div>
              <div className="bg-sky-50/50 shadow-sm border border-sky-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">👨‍💼 Fuerza de Ventas</h4>
                <div className="w-36 h-36 bg-white rounded-xl border border-sky-200 p-1.5 shadow-sm">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(hostUrl + '?role=vendedor&ref=' + currentUser.id)}`} alt="QR Vendedores" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-slate-500 leading-tight">Recluta vendedores para tus comercios y expande tu red de ventas físicas.</p>
                <button onClick={() => { navigator.clipboard.writeText(hostUrl + '?role=vendedor&ref=' + currentUser.id); showToast('Enlace copiado', 'success'); }} className="text-[10px] font-black text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-lg cursor-pointer w-full transition-colors border border-sky-200">📋 Copiar Enlace Vendedores</button>
              </div>
              <div className="bg-sky-50/50 shadow-sm border border-sky-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">🛒 Clientes / {KFS_BRAND.modules.marketplace}</h4>
                <div className="w-36 h-36 bg-white rounded-xl border border-sky-200 p-1.5 shadow-sm">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(hostUrl + '?role=customer&ref=' + currentUser.id)}`} alt="QR Clientes" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-slate-500 leading-tight">Ganas <strong className="text-emerald-700">$1.00 USD</strong> cuando tu referido recarga sus primeros $5.00 USD.</p>
                <button onClick={() => { navigator.clipboard.writeText(hostUrl + '?role=customer&ref=' + currentUser.id); showToast('Enlace copiado', 'success'); }} className="text-[10px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer w-full transition-colors border border-emerald-200">📋 Copiar Enlace Clientes</button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">Tu ID de Promotora: <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{currentUser.id}</span></p>
              <button onClick={() => setShowCustomerRegister(true)} className="bg-sky-600 text-white px-6 py-3 rounded-xl font-black shadow-md shadow-sky-600/30 hover:bg-sky-700 transition-colors flex items-center gap-2 cursor-pointer text-sm"><UserPlus size={18} /> Registrar Cliente en Vivo</button>
            </div>
          </div>

          <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8">
            <h3 className="text-lg font-black mb-4 text-sky-950">Mis Clientes Afiliados ({myCustomers.length})</h3>
            {myCustomers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCustomers.map((c: any) => (
                  <div key={c.id} className="p-4 border border-sky-100 rounded-xl flex justify-between items-center bg-sky-50/50 hover:bg-sky-50 transition-colors">
                    <div>
                      <p className="font-bold text-sm text-sky-950">{c.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{c.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">Afiliado</p>
                      <p className="text-[10px] text-slate-400">{c.hasRecharged ? "Recargado" : "Pendiente Recarga"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6 font-bold">No tienes clientes afiliados todavía.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "vendedores" && (
        <div className="space-y-6">
          {!showRegisterVendedor ? (
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b border-sky-100 pb-4">
                <h3 className="text-xl font-black text-sky-950">Vendedores Activados</h3>
                <button onClick={() => setShowRegisterVendedor(true)} className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors shadow-md shadow-sky-600/30 cursor-pointer">+ Nuevo Vendedor</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(db.vendedores || []).filter((v: any) => v.promotoraId === currentUser.id).map((v: any) => (
                   <div key={v.id} className="p-4 border border-sky-100 rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sky-950">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.email}</p>
                        {v.clientId && <p className="text-[10px] bg-sky-100 text-sky-700 border border-sky-200 font-bold px-2 py-0.5 rounded-md inline-block mt-1">Ref: {myClients.find((c: any) => c.id === v.clientId)?.company || v.clientId}</p>}
                      </div>
                      <span className="text-[10px] text-sky-600 bg-sky-100 border border-sky-200 px-2 py-1 rounded-full uppercase font-black">Activo</span>
                   </div>
                 ))}
                 {(db.vendedores || []).filter((v: any) => v.promotoraId === currentUser.id).length === 0 && (
                    <p className="text-sm text-slate-500 font-bold">No hay vendedores registrados.</p>
                 )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-xl shadow-sky-200/50 border border-sky-100 rounded-[2rem] p-8 max-w-2xl mx-auto">
              <div className="flex justify-between mb-4 items-center">
                <h3 className="text-xl font-black text-sky-950">Activar Nuevo Vendedor</h3>
                <button onClick={() => setShowRegisterVendedor(false)} className="text-slate-400 hover:text-sky-950 cursor-pointer transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as any;
                registerVendedor({
                  name: target.vName.value,
                  email: target.vEmail.value,
                  password: target.vPassword.value,
                  promotoraId: currentUser.id,
                  clientId: target.vClient.value || null
                });
                setShowRegisterVendedor(false);
              }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Nombre Completo</label>
                  <input name="vName" required className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 placeholder:text-slate-400 text-sky-950 transition-all" placeholder="Ej: Vendedor Alpha" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Correo Electrónico (Login)</label>
                  <input type="email" name="vEmail" required className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 placeholder:text-slate-400 text-sky-950 transition-all" placeholder="vendedor@kfs.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Contraseña</label>
                  <input type="password" name="vPassword" required className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 placeholder:text-slate-400 text-sky-950 transition-all" placeholder="*****" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Asignar a Comercio (Opcional)</label>
                  <select name="vClient" className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 text-sky-950 placeholder:text-slate-400 transition-all">
                    <option value="">Independiente (Sin Comercio Fijo)</option>
                    {myClients.map((c: any) => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 transition-colors text-white py-4 rounded-xl font-black mt-6 shadow-md shadow-sky-600/30 cursor-pointer">Activar y Registrar Vendedor</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Customer Register Modal */}
      {showCustomerRegister && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-2 shadow-2xl border border-sky-100">
            <button onClick={() => setShowCustomerRegister(false)} className="absolute top-6 right-6 z-50 text-slate-400 hover:text-sky-950 transition-colors cursor-pointer"><X size={24} /></button>
            <div className="p-4 border-b border-sky-100 mb-4">
              <h3 className="text-xl font-black text-center text-sky-950">Registro Rápido de Cliente</h3>
              <p className="text-xs text-center text-slate-500 mt-1">Este cliente quedará atado a tu ID: <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{currentUser.id}</span></p>
            </div>
            <RegisterCustomerForm onCancel={() => setShowCustomerRegister(false)} defaultReferralCode={currentUser.id} />
          </div>
        </div>
      )}

      {showPayoutModal && (
        <PayoutModal
          maxAmount={myPromotoraData?.passiveEarningsEUR || 0}
          currency="EUR"
          formatMoney={formatEUR}
          onCancel={() => setShowPayoutModal(false)}
          onConfirm={(amount: number, details: string) => {
            settlePromotoraEarnings(currentUser.id);
            setShowPayoutModal(false);
          }}
        />
      )}

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-sky-100 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-center gap-10 items-center relative">
          {[
            { id: "panel", icon: Activity, label: "Panel" },
            { id: "negocios", icon: Store, label: "Comercios", badge: myClients.length },
            { id: "vendedores", icon: Briefcase, label: "Vendedores", badge: (db.vendedores || []).filter((v: any) => v.promotoraId === currentUser.id).length },
            { id: "afiliados", icon: Users, label: "Afiliados", badge: myCustomers.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
              >
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-sky-600 rounded-b-full shadow-[0_4px_10px_rgba(2,132,199,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-sky-600' : 'text-slate-400 group-hover:text-sky-500'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse shadow-sm">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-sky-950' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
