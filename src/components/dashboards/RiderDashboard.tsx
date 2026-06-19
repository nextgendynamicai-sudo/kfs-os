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

export const RiderDashboard = ({ db, currentUser, logout }: any) => {
  const { updateRiderPagoMovil, showToast, formatUSD, confirmDelivery, markAsPickedUp, updateRiderGPS, riderCheckIn, riderCheckOut } = useKFS() as any;
  const [activeTab, setActiveTab] = useState("overview");
  const [editingPM, setEditingPM] = useState(false);
  const [pmForm, setPmForm] = useState({ banco: "", telefono: "", cedula: "" });
  const [gpsSharing, setGpsSharing] = useState(false);
  const gpsWatchRef = useRef<number | null>(null);

  const riderInfo = db.riders?.find((r: any) => r.id === currentUser.id) || currentUser;
  const myDeliveries = db.transactions?.filter((tx: any) => tx.assignedRiderId === currentUser.id) || [];
  const pendingDeliveries = myDeliveries.filter((tx: any) => tx.deliveryStatus === "assigned" && tx.shippingStatus !== "delivered");
  const completedDeliveries = myDeliveries.filter((tx: any) => tx.shippingStatus === "delivered" || tx.deliveryStatus === "delivered");
  const totalEarnings = completedDeliveries.length * 2;
  const avgRating = riderInfo.averageRating || 0;

  const toggleGPS = () => {
    if (!gpsSharing) {
      if (!navigator.geolocation) { showToast("GPS no disponible en este dispositivo.", "error"); return; }
      const id = navigator.geolocation.watchPosition(
        (pos) => updateRiderGPS(currentUser.id, pos.coords.latitude, pos.coords.longitude),
        () => { }, { enableHighAccuracy: true, maximumAge: 10000 }
      );
      gpsWatchRef.current = id;
      setGpsSharing(true);
      showToast("📍 Compartiendo ubicación GPS en tiempo real.", "success");
    } else {
      if (gpsWatchRef.current !== null) navigator.geolocation.clearWatch(gpsWatchRef.current);
      setGpsSharing(false);
      showToast("GPS desactivado.", "success");
    }
  };


  const myBusinesses = (riderInfo.associatedBusinesses || []).map((bId: string) =>
    db.clients?.find((c: any) => c.id === bId)
  ).filter(Boolean);

  const handleSavePM = () => {
    if (!pmForm.banco || !pmForm.telefono || !pmForm.cedula) {
      showToast("Completa todos los campos de Pago Móvil.", "error"); return;
    }
    updateRiderPagoMovil(currentUser.id, pmForm);
    setEditingPM(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sky-950 font-sans pb-24 relative">
      {/* Wavy Header */}
      <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-b-[3rem] shadow-xl shadow-sky-900/20 pt-6 pb-12 px-6 text-white relative z-10 border-b border-sky-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-sky-100 backdrop-blur-sm"><Truck size={20} /></span>
            <h1 className="font-black text-xl tracking-tight text-white">KFS Delivery</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-rose-500 transition-colors cursor-pointer text-white">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0 border-4 shadow-lg bg-sky-900 relative z-20 ${riderInfo.status === "approved" ? "border-emerald-400 shadow-emerald-500/20" : "border-amber-400 shadow-amber-500/20"}`}>
            <ProfileAvatarEditor currentUser={riderInfo} />
          </div>
          <div>
            <h2 className="font-black text-2xl truncate text-white">{riderInfo.name}</h2>
            <p className="text-xs text-sky-200/80 font-mono truncate">{riderInfo.email}</p>
            <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${riderInfo.status === "approved" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white animate-pulse"}`}>
              {riderInfo.status === "approved" ? "✅ Rider Activo" : "⏳ En Verificación"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-20 space-y-4 animate-fade-in">
        <UniversalWalletWidget currentUser={riderInfo} formatUSD={formatUSD} />

        {/* Check-In / Check-Out Widget */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-sky-200/30 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="font-black text-sm text-sky-950 uppercase tracking-wider mb-1 flex items-center justify-center md:justify-start gap-2">
              <Clock size={16} className={riderInfo.isWorking ? "text-emerald-500" : "text-slate-400"} />
              Disponibilidad
            </h3>
            <p className="text-xs text-slate-500 font-bold">Horas acumuladas: <span className="text-sky-600 font-black">{(riderInfo.totalHours || 0).toFixed(1)} h</span></p>
            {riderInfo.isWorking && riderInfo.sessionStart && (
              <p className="text-[10px] text-emerald-600 font-bold mt-1 animate-pulse bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md inline-block">
                En turno desde: {new Date(riderInfo.sessionStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className="w-full md:w-auto">
            {riderInfo.isWorking ? (
              <button onClick={() => riderCheckOut(riderInfo.id)} className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-red-500/30 transition-all cursor-pointer flex justify-center items-center gap-2">
                <LogOut size={18} /> Desconectarse
              </button>
            ) : (
              <button onClick={() => riderCheckIn(riderInfo.id)} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-green-500/30 transition-all cursor-pointer flex justify-center items-center gap-2">
                <LogIn size={18} /> Conectarse
              </button>
            )}
          </div>
        </div>
        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-3xl p-5 text-center shadow-xl shadow-sky-200/30 border border-sky-100 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center mb-2"><Truck size={20} /></div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Entregas</p>
                <p className="text-3xl font-black text-sky-950 mt-1">{myDeliveries.length}</p>
              </div>
              <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-3xl p-5 text-center shadow-xl shadow-sky-900/30 border border-sky-800 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 text-emerald-400 flex items-center justify-center mb-2"><DollarSign size={20} /></div>
                <p className="text-[10px] text-sky-200/70 font-bold uppercase tracking-wider">Ganado</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">${totalEarnings}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-sky-200/30 border border-sky-100 space-y-4">
              <h3 className="font-black text-sm text-sky-950 uppercase tracking-wider flex items-center gap-2"><Store size={16} className="text-sky-600" /> Negocios Asociados ({myBusinesses.length}/2)</h3>
              {myBusinesses.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">Aún no estás asociado a ningún negocio.</p>
              ) : myBusinesses.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-sky-100 hover:border-sky-200 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center font-black text-sky-700 text-sm flex-shrink-0 border border-sky-200">
                    {b.company?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-sm text-sky-950">{b.company}</p>
                    <p className="text-[10px] text-slate-500">{b.address || b.location || "Sin dirección"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-sky-600 rounded-[2rem] p-6 shadow-xl shadow-sky-600/30 relative overflow-hidden border border-sky-500">
              <div className="relative z-10">
                <h3 className="font-black text-sm text-white flex items-center gap-2 mb-2"><CreditCard size={16} /> Cómo cobras</h3>
                <p className="text-xs text-sky-100 leading-relaxed font-bold">Por cada pedido que entregues, el cliente te pagará <span className="font-black text-white bg-sky-900 px-1.5 py-0.5 rounded-md shadow-inner">$2.00 USD</span> directamente a tu Pago Móvil.</p>
              </div>
              <Star size={100} className="absolute -right-6 -bottom-6 opacity-20 text-white transform -rotate-12" />
            </div>

            {/* Rating + GPS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[2rem] p-5 text-center shadow-xl shadow-sky-200/30 border border-sky-100 flex flex-col items-center justify-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Calificación</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-xl ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>)}
                </div>
                <p className="text-xs font-black text-sky-950 mt-1">{avgRating > 0 ? avgRating.toFixed(1) : "Sin calif."} <span className="text-slate-400 font-normal">({riderInfo.totalRatings || 0})</span></p>
              </div>
              <button
                onClick={toggleGPS}
                className={`rounded-[2rem] p-5 text-center border transition-all cursor-pointer shadow-xl flex flex-col items-center justify-center ${gpsSharing ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/30' : 'bg-white border-sky-100 hover:bg-slate-50 shadow-sky-200/30'
                  }`}
              >
                <p className={`text-[9px] font-bold uppercase tracking-wider ${gpsSharing ? 'text-emerald-100' : 'text-slate-400'}`}>GPS en Vivo</p>
                <p className="text-3xl mt-2">{gpsSharing ? '📍' : '📍'}</p>
                <p className={`text-[10px] font-black mt-2 ${gpsSharing ? 'text-white' : 'text-sky-950'}`}>
                  {gpsSharing ? 'Compartiendo' : 'Activar GPS'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* TAB: Pedidos */}
        {activeTab === "deliveries" && (
          <div className="space-y-3">
            <h3 className="font-black text-sm text-sky-600 uppercase tracking-wider">Mis Pedidos Asignados</h3>
            {myDeliveries.length === 0 ? (
              <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center shadow-sm">
                <Truck size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-500">No tienes pedidos asignados aún.</p>
                <p className="text-xs text-slate-400 mt-1">Cuando el dueño despache un pedido, aparecerá aquí.</p>
              </div>
            ) : myDeliveries.map((tx: any) => {
              const client = db.clients?.find((c: any) => c.id === tx.clientId);
              const fullAddress = [tx.deliveryAddress, tx.deliveryCity].filter(Boolean).join(", ");
              const mapsUrl = fullAddress
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}&travelmode=driving`
                : null;
              return (
                <div key={tx.id} className="bg-white border border-sky-100 rounded-2xl p-4 space-y-3 shadow-sm hover:border-sky-200 transition-colors">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-sm text-sky-950">{client?.company || tx.deliveryBusinessName || "Comercio"}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{tx.id}</p>
                      <p className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-500">+$2.00</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${tx.shippingStatus === "dispatched" ? "bg-sky-100 text-sky-600" : tx.shippingStatus === "picked_up" ? "bg-purple-100 text-purple-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                        {tx.shippingStatus === "dispatched" ? "🛵 Asignado" : tx.shippingStatus === "picked_up" ? "📦 En camino" : "✅ Completado"}
                      </span>
                    </div>
                  </div>

                  {/* ===== DELIVERY ADDRESS + MAPS NAVIGATION ===== */}
                  {fullAddress ? (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 space-y-2">
                      <p className="text-[9px] text-orange-500 font-black uppercase tracking-wider flex items-center gap-1">
                        <Truck size={11} /> Dirección de entrega
                      </p>
                      <div>
                        <p className="text-sm font-black text-sky-950">{fullAddress}</p>
                        {tx.deliveryReference && (
                          <p className="text-[10px] text-orange-600/80 mt-0.5">📍 {tx.deliveryReference}</p>
                        )}
                      </div>
                      {/* Navigation Map */}
                      {(tx.shippingStatus === "dispatched" || tx.shippingStatus === "picked_up") && (
                        <div className="mt-4 mb-2 border border-orange-200/50 rounded-xl overflow-hidden">
                          <LiveMap
                            role="rider"
                            storePos={getStoreCoords(tx.clientId)}
                            customerPos={getCustomerCoords(tx.customerPhone || "default_cust")}
                            riderPos={riderInfo?.lastLat && riderInfo?.lastLng ? { lat: riderInfo.lastLat, lng: riderInfo.lastLng } : getStoreCoords(tx.clientId)}
                            className="h-48"
                          />
                        </div>
                      )}
                      {/* Navigation Button */}
                      <a
                        href={mapsUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-black rounded-xl transition-all text-xs cursor-pointer shadow-lg shadow-orange-500/30"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        🗺️ Iniciar Navegación en Google Maps
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Truck size={11} /> El dueño no ha configurado dirección de delivery aún.
                      </p>
                    </div>
                  )}

                  {/* Pago Móvil */}
                  {tx.riderPagoMovil && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                      <p className="text-[9px] text-emerald-600 font-black uppercase tracking-wider mb-1">El cliente debe pagarte a:</p>
                      <p className="text-xs font-bold text-sky-950">🏦 {tx.riderPagoMovil.banco} · 📱 {tx.riderPagoMovil.telefono} · 🪪 {tx.riderPagoMovil.cedula}</p>
                    </div>
                  )}

                  {/* Confirmar Entrega */}
                  {tx.shippingStatus === "dispatched" && (
                    <button
                      onClick={() => markAsPickedUp(tx.id)}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 mb-2"
                    >
                      <Package size={16} /> Marcar Recogido (En Tránsito)
                    </button>
                  )}
                  {(tx.shippingStatus === "picked_up" || tx.shippingStatus === "dispatched") && (
                    <button
                      onClick={() => confirmDelivery(tx.id)}
                      className="w-full py-3 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black rounded-xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle size={16} /> Confirmar Entrega Completada
                    </button>
                  )}
                  {tx.shippingStatus === "delivered" && (
                    <div className="flex items-center justify-center gap-2 py-2 text-green-400 text-xs font-black">
                      ✅ Entrega Completada · {tx.deliveredAt ? new Date(tx.deliveredAt).toLocaleString() : ""}
                      {tx.riderRating && <span className="text-yellow-400">· {tx.riderRating}★</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Pago Móvil */}
        {activeTab === "pago" && (
          <div className="space-y-4">
            <div className="bg-white border border-sky-100 rounded-3xl p-6 space-y-4 shadow-xl shadow-sky-200/30">
              <h3 className="font-black text-sm text-sky-600 uppercase tracking-wider flex items-center gap-2"><CreditCard size={16} /> Datos de Pago Móvil</h3>
              {!editingPM ? (
                <>
                  <div className="space-y-2">
                    {[
                      { label: "Banco", value: riderInfo.pagoMovil?.banco || "No configurado" },
                      { label: "Teléfono", value: riderInfo.pagoMovil?.telefono || "No configurado" },
                      { label: "Cédula Titular", value: riderInfo.pagoMovil?.cedula || "No configurado" }
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                        <span className="font-black text-sm text-sky-950">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setPmForm(riderInfo.pagoMovil || { banco: "", telefono: "", cedula: "" }); setEditingPM(true); }} className="w-full py-3 bg-sky-600 text-white font-black rounded-xl shadow-lg shadow-sky-600/30 hover:bg-sky-500 active:scale-95 transition-all cursor-pointer text-sm">
                    ✏️ Editar Datos de Pago Móvil
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <select value={pmForm.banco} onChange={e => setPmForm(p => ({ ...p, banco: e.target.value }))} className="w-full bg-slate-50 border border-sky-200 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                    <option value="">— Banco —</option>
                    {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="tel" placeholder="Teléfono PM" value={pmForm.telefono} onChange={e => setPmForm(p => ({ ...p, telefono: e.target.value }))} className="w-full bg-slate-50 border border-sky-200 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                  <input placeholder="Cédula Titular" value={pmForm.cedula} onChange={e => setPmForm(p => ({ ...p, cedula: e.target.value }))} className="w-full bg-slate-50 border border-sky-200 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setEditingPM(false)} className="w-1/3 py-3 border border-sky-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 cursor-pointer text-sm transition-colors">Cancelar</button>
                    <button onClick={handleSavePM} className="w-2/3 py-3 bg-sky-600 text-white font-black rounded-xl hover:bg-sky-500 shadow-lg shadow-sky-600/30 cursor-pointer text-sm transition-colors">Guardar</button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-sky-700 font-bold">ℹ️ Estos datos se muestran automáticamente al cliente cuando se le asigna tu delivery. El cliente debe pagarte $2.00 USD directamente a tu Pago Móvil.</p>
            </div>
          </div>
        )}

        {/* TAB: Documentos */}
        {activeTab === "docs" && (
          <div className="space-y-4">
            <h3 className="font-black text-sm text-sky-600 uppercase tracking-wider">Documentos Registrados</h3>
            {[
              { label: "Cédula de Identidad", key: "cedulaImg", icon: "🪪" },
              { label: "Certificado Médico", key: "medCertImg", icon: "🏥" },
              { label: "Licencia de Conducir", key: "licenseImg", icon: "🚗" }
            ].map(({ label, key, icon }) => (
              <div key={key} className="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-black text-sm text-sky-950">{label}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${(riderInfo as any)[key] ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                      {(riderInfo as any)[key] ? "✅ Cargado" : "⚠️ No subido"}
                    </span>
                  </div>
                </div>
                {(riderInfo as any)[key] && (
                  <img src={(riderInfo as any)[key]} alt={label} className="w-full max-h-40 object-contain rounded-xl border border-sky-100 mt-2" />
                )}
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-amber-700 font-bold">⚠️ Los documentos son revisados por el Arquitecto KFS para verificar tu identidad antes de aprobar tu cuenta.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
