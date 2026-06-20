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
import { CvViewerModal } from "./CvViewerModal";
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

export const RecruitmentWidget = ({ db, currentUser, formatUSD }: any) => {
  const { unlockCandidateContact, updateStoreSettings, hireCandidate, releaseCandidate, showToast } = useKFS() as any;
  const [activeWidgetTab, setActiveWidgetTab] = useState("search"); // search | preset | unlocked

  // Rating & Review Modal State
  const [ratingCandidateId, setRatingCandidateId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [viewingCandidateCv, setViewingCandidateCv] = useState<any | null>(null);

  const getAverageRating = (c: any) => {
    if (!c.reviews || c.reviews.length === 0) return 0;
    const sum = c.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return Math.round((sum / c.reviews.length) * 10) / 10;
  };

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex text-amber-500 gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xs">
            {star <= rounded ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  // Preset States
  const storePreset = currentUser.storeSettings?.hiringPreset || {
    role: "Cajero",
    skills: [],
    experienceYears: "1-3",
    availability: "full-time",
    location: "Caracas - Centro"
  };

  const [role, setRole] = useState(storePreset.role);
  const [skills, setSkills] = useState<string[]>(storePreset.skills || []);
  const [experienceYears, setExperienceYears] = useState(storePreset.experienceYears);
  const [availability, setAvailability] = useState(storePreset.availability);
  const [location, setLocation] = useState(storePreset.location);

  // Pay States
  const [payingCandidateId, setPayingCandidateId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("transfer"); // transfer only
  const [refNum, setRefNum] = useState("");
  const [screenshot, setScreenshot] = useState("");

  const availableSkills = [
    "Cuadre de caja", "Uso de POS", "Atención al cliente",
    "Lector de código de barras", "Control de inventario",
    "Ventas retail", "Facturación fiscal", "Manejo de delivery"
  ];

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSkills(prev => [...prev, skill]);
    }
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(currentUser.id, {
      hiringPreset: {
        role,
        skills,
        experienceYears,
        availability,
        location
      }
    });
    showToast("Preset de contratación guardado.", "success");
  };

  // List candidates and compute match score
  const candidates = db.candidates || [];
  const unlocks = db.unlockedContacts || [];

  const checkUnlockStatus = (candId: string) => {
    const reversed = [...unlocks].reverse();
    const found = reversed.find((u: any) => u.clientId === currentUser.id && u.candidateId === candId);
    if (!found) return { isUnlocked: false };
    return { isUnlocked: found.status === "approved", status: found.status };
  };

  const getMatchScore = (cand: any) => {
    let score = 100;

    // Role matching
    if (cand.role !== role) score -= 30;

    // Location matching
    if (cand.answers?.location !== location) score -= 20;

    // Skills matching
    if (skills.length > 0) {
      const matchCount = skills.filter(s => cand.skills?.includes(s)).length;
      const missingCount = skills.length - matchCount;
      score -= (missingCount / skills.length) * 35;
    }

    // Experience matching
    if (role === "Administrador" && cand.answers?.experienceYears === "0-1") score -= 15;

    return Math.max(0, Math.round(score));
  };

  const sortedCandidates = candidates
    .filter((c: any) => c.active !== false && c.registrationPaymentStatus === "approved" && c.hiringState === "available")
    .map((c: any) => ({ ...c, matchScore: getMatchScore(c) }))
    .sort((a: any, b: any) => {
      const aBack = a.status === "backed" ? 1 : 0;
      const bBack = b.status === "backed" ? 1 : 0;
      if (aBack !== bBack) return bBack - aBack;
      return b.matchScore - a.matchScore;
    });

  const handleProcessUnlock = () => {
    if (!refNum.trim()) {
      showToast("Ingresa el número de referencia del pago.", "error");
      return;
    }
    unlockCandidateContact(payingCandidateId, currentUser.id, refNum, screenshot);
    setPayingCandidateId(null);
    setRefNum("");
    setScreenshot("");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="font-black text-2xl text-violet-900 flex items-center gap-2">
            <Users className="text-violet-600" /> Reclutamiento & Bolsa de Trabajo
          </h3>
          <p className="text-xs text-gray-500 mt-1">Busca talento verificado y respaldado por la red KFS OS en Venezuela.</p>
        </div>

        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => setActiveWidgetTab("search")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "search" ? "bg-violet-900 text-white" : "text-gray-500 hover:text-violet-900"}`}
          >
            Buscar Candidatos
          </button>
          <button
            onClick={() => setActiveWidgetTab("preset")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "preset" ? "bg-violet-900 text-white" : "text-gray-500 hover:text-violet-900"}`}
          >
            Configurar Criterios
          </button>
          <button
            onClick={() => setActiveWidgetTab("unlocked")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "unlocked" ? "bg-violet-900 text-white" : "text-gray-500 hover:text-violet-900"}`}
          >
            Desbloqueados
          </button>
        </div>
      </div>

      {activeWidgetTab === "preset" && (
        <form onSubmit={handleSavePreset} className="space-y-6">
          <h4 className="text-sm font-black text-violet-900 uppercase tracking-wider">¿Qué perfil necesitas contratar?</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cargo Solicitado</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-gray-400"
              >
                <option value="Cajero">Cajero / Cajera</option>
                <option value="Vendedor">Vendedor de Tienda</option>
                <option value="Almacenista">Almacenista / Despachador</option>
                <option value="Administrador">Administrador de Local</option>
                <option value="Delivery">Delivery / Mensajero</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Ubicación Preferida</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-gray-400"
              >
                <option value="Caracas - Este">Caracas - Este</option>
                <option value="Caracas - Oeste">Caracas - Oeste</option>
                <option value="Caracas - Centro">Caracas - Centro</option>
                <option value="Fuera de Caracas">Fuera de Caracas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Experiencia Requerida</label>
              <select
                value={experienceYears}
                onChange={e => setExperienceYears(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-gray-400"
              >
                <option value="0-1">Menos de 1 año</option>
                <option value="1-3">1 a 3 años</option>
                <option value="3+">Más de 3 años</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Disponibilidad de Horario</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-gray-400"
              >
                <option value="full-time">Tiempo Completo (Full-time)</option>
                <option value="part-time">Medio Tiempo (Part-time)</option>
                <option value="weekends">Fines de Semana</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Habilidades Técnicas Mandatorias</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected ? "bg-violet-900 text-white shadow-md" : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"}`}
                  >
                    {isSelected && <Check size={12} />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="bg-violet-900 text-white px-8 py-4 rounded-xl font-black hover:scale-[1.03] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              Guardar Configuración de Búsqueda
            </button>
          </div>
        </form>
      )}

      {activeWidgetTab === "search" && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-800 leading-relaxed font-bold">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p>Se muestran los perfiles ordenados por afinidad. El sello dorado indica perfiles entrenados y "Respaldados por KFS OS". El costo de desbloqueo de cada contacto de candidato es de <strong>$10 USD</strong>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedCandidates.map((cand: any) => {
              const { isUnlocked, status: unlockStatus } = checkUnlockStatus(cand.id);

              if (isUnlocked) return null;

              const isPaying = payingCandidateId === cand.id;

              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${cand.status === "backed" ? "border-yellow-300 shadow-[0_4px_20px_rgba(234,179,8,0.1)] bg-gradient-to-br from-yellow-50/30 to-white" : "border-gray-100 shadow-sm"}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {cand.role}
                        </span>
                        <h4 className="text-lg font-black text-violet-900 mt-1 filter blur-[4px] select-none">
                          {cand.name}
                        </h4>
                        {(() => {
                          const avg = getAverageRating(cand);
                          if (avg === 0) return null;
                          return (
                            <div className="flex items-center gap-1.5 mt-1">
                              {renderStars(avg)}
                              <span className="text-[10px] font-bold text-gray-500">
                                {avg} ({cand.reviews.length} {cand.reviews.length === 1 ? "reseña" : "reseñas"})
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${cand.matchScore >= 80 ? 'bg-green-100 text-green-700' : cand.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          Compatibilidad: {cand.matchScore}%
                        </span>
                        {cand.status === "backed" && (
                          <span className="text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-300/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            🏆 Respaldado KFS
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {cand.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {cand.skills?.map((s: string) => (
                        <span key={s} className="text-[9px] font-bold text-gray-500 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none px-2 py-0.5 rounded-md placeholder:text-gray-400">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-bold bg-gray-50/50 p-3 rounded-xl">
                      <div>📍 Residencia: <span className="text-violet-900">{cand.answers?.location || "No especificada"}</span></div>
                      <div>⏳ Experiencia: <span className="text-violet-900">{cand.answers?.experienceYears || "0-1"} años</span></div>
                      <div>🚗 Vehículo: <span className="text-violet-900">{cand.answers?.hasVehicle === "no" ? "No posee" : cand.answers?.hasVehicle === "moto" ? "Moto" : "Carro"}</span></div>
                      <div>⏰ Horario: <span className="text-violet-900">{cand.answers?.availability === "full-time" ? "Completo" : "Parcial"}</span></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {unlockStatus === "pending_approval" ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center text-xs font-bold text-yellow-700 flex items-center justify-center gap-2">
                        <Clock size={14} className="animate-pulse" />
                        <span>Espera Aprobación del Core</span>
                      </div>
                    ) : isPaying ? (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 animate-slide-up">
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 leading-tight">
                          <p className="font-black border-b border-amber-200/50 pb-1 mb-2">PAGO MÓVIL REQUERIDO ($10.00 USD)</p>
                          <p>Para desbloquear este candidato, debes realizar un pago móvil de <strong>$10.00 USD</strong> y adjuntar el comprobante.</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 p-3 rounded-xl text-[10px] space-y-1 font-mono text-gray-600">
                          <p><strong className="text-violet-900">Banco:</strong> Banco Nacional de Crédito (BNC)</p>
                          <p><strong className="text-violet-900">Teléfono:</strong> 0414-0000000</p>
                          <p><strong className="text-violet-900">Cédula:</strong> V-25.218.648</p>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Referencia Bancaria"
                            value={refNum}
                            onChange={(e) => setRefNum(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400"
                          />
                        </div>
                        
                        <div>
                          {screenshot ? (
                             <div className="relative h-20 rounded-lg overflow-hidden group">
                               <img src={screenshot} className="w-full h-full object-cover" />
                               <button onClick={() => setScreenshot("")} className="absolute inset-0 bg-black/60 text-white font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Borrar</button>
                             </div>
                          ) : (
                             <label className="border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 text-[10px] text-gray-500">
                               <span>Subir Captura de Pago Móvil</span>
                               <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const { compressImage } = await import('../lib/utils');
                                   const base64 = await compressImage(file, 800, 0.7);
                                   setScreenshot(base64 as string);
                                 }
                               }} />
                             </label>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => { setPayingCandidateId(null); setRefNum(""); setScreenshot(""); }}
                            className="w-1/3 bg-gray-200 text-gray-600 font-bold rounded-xl text-xs py-2 cursor-pointer transition-colors hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleProcessUnlock}
                            className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs py-2 cursor-pointer shadow-md transition-all"
                          >
                            Validar Pago
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {unlockStatus === "rejected" && (
                          <div className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg p-2 text-center">
                            ❌ Desbloqueo anterior fallido/rechazado
                          </div>
                        )}
                        <button
                          onClick={() => setPayingCandidateId(cand.id)}
                          className="w-full bg-violet-900 text-white hover:bg-gray-800 transition-colors font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Lock size={14} className="text-violet-600" /> Desbloquear Datos ($10)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sortedCandidates.filter((c: any) => !checkUnlockStatus(c.id).isUnlocked).length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 font-bold border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Users size={36} className="mx-auto mb-2 opacity-50" />
                No hay más perfiles de candidatos disponibles en la red.
              </div>
            )}
          </div>
        </div>
      )}

      {activeWidgetTab === "unlocked" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((cand: any) => {
              const { isUnlocked } = checkUnlockStatus(cand.id);
              if (!isUnlocked) return null;

              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-3xl p-6 border border-green-200 shadow-sm bg-gradient-to-br from-green-50/20 to-white relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          {cand.role}
                        </span>
                        <h4 className="text-lg font-black text-violet-900 mt-1 flex items-center gap-1.5">
                          {cand.name}
                          <CheckCircle size={16} className="text-green-600 shrink-0" />
                        </h4>
                      </div>
                      {cand.status === "backed" && (
                        <span className="text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-300/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          🏆 Respaldado KFS
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {cand.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {cand.skills?.map((s: string) => (
                        <span key={s} className="text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-bold bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div>📍 Residencia: <span className="text-violet-900">{cand.answers?.location || "No especificada"}</span></div>
                      <div>⏳ Experiencia: <span className="text-violet-900">{cand.answers?.experienceYears || "0-1"} años</span></div>
                      <div>🚗 Vehículo: <span className="text-violet-900">{cand.answers?.hasVehicle === "no" ? "No posee" : cand.answers?.hasVehicle === "moto" ? "Moto" : "Carro"}</span></div>
                      <div>⏰ Horario: <span className="text-violet-900">{cand.answers?.availability === "full-time" ? "Completo" : "Parcial"}</span></div>
                    </div>

                    <div className="bg-violet-900 text-white p-4 rounded-xl space-y-2 border border-violet-600/20 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400">Teléfono:</span>
                        <span className="text-violet-600 font-mono">{cand.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-mono select-all text-[10px]">{cand.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold border-t border-violet-600/10 pt-2 mt-1">
                        <span className="text-gray-400">Estado de Contratación:</span>
                        <span className={`uppercase tracking-wider font-black px-1.5 py-0.5 rounded ${cand.hiringState === 'hired' ? 'bg-green-500/20 text-green-400' :
                            cand.hiringState === 'interviewing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                          {cand.hiringState === 'hired' ? 'Contratado' :
                            cand.hiringState === 'interviewing' ? 'En Entrevista' : 'Libre'}
                        </span>
                      </div>
                      {(cand.cvFile || cand.useKfsCvBuilder) && (
                        <div className="flex justify-between items-center text-xs font-bold pt-1">
                          <span className="text-gray-400">Hoja de Vida (CV):</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (cand.useKfsCvBuilder) {
                                setViewingCandidateCv(cand);
                              } else {
                                window.open(cand.cvFile, '_blank');
                              }
                            }}
                            className="text-violet-600 underline cursor-pointer text-[10px]"
                          >
                            👁️ {cand.useKfsCvBuilder ? "Ver CV Digital KFS" : "Ver CV Adjunto"}
                          </button>
                        </div>
                      )}
                    </div>
                    {cand.reviews && cand.reviews.length > 0 && (
                      <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2">
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Historial de Referencias KFS:</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {cand.reviews.map((r: any) => (
                            <div key={r.id} className="p-3 bg-white border border-gray-200 rounded-lg text-[10px] space-y-1">
                              <div className="flex justify-between items-center font-bold">
                                <span className="text-violet-900">{r.clientName}</span>
                                <div className="flex items-center gap-1">
                                  {renderStars(r.rating)}
                                  <span className="text-gray-500 font-mono">({r.rating})</span>
                                </div>
                              </div>
                              <p className="text-gray-600 leading-normal font-normal italic">"{r.comment}"</p>
                              <div className="text-[8px] text-gray-400 text-right font-mono">{new Date(r.timestamp).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex gap-2">
                      <a
                        href={`tel:${cand.phone}`}
                        className="w-1/2 py-3 rounded-xl border border-gray-300 font-bold text-center text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        📞 Llamar Candidato
                      </a>

                      {(() => {
                        const waNum = cand.phone.replace(/[^0-9]/g, '');
                        const cleanWaNum = waNum.startsWith('0') ? '58' + waNum.slice(1) : (waNum.length === 10 ? '58' + waNum : waNum);
                        return (
                          <a
                            href={`https://wa.me/${cleanWaNum}?text=Hola%20${encodeURIComponent(cand.name)}!%20Vimos%20tu%20perfil%20en%20la%20Bolsa%20de%20Empleo%20de%20KFS%20OS%20y%20nos%20interesaría%20agendar%20una%20entrevista.%20¿Estás%20disponible?`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-1/2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            💬 WhatsApp
                          </a>
                        );
                      })()}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      {cand.hiringState === 'interviewing' ? (
                        <>
                          <button
                            onClick={() => hireCandidate(cand.id, currentUser.id)}
                            className="w-1/2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-md transition-colors"
                          >
                            🤝 Contratar
                          </button>
                          <button
                            onClick={() => {
                              setRatingCandidateId(cand.id);
                              setRatingStars(5);
                              setRatingComment("");
                            }}
                            className="w-1/2 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-md transition-colors"
                          >
                            🔓 Liberar Candidato
                          </button>
                        </>
                      ) : cand.hiringState === 'hired' && cand.interviewingClientId === currentUser.id ? (
                        <button
                          onClick={() => {
                            setRatingCandidateId(cand.id);
                            setRatingStars(5);
                            setRatingComment("");
                          }}
                          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-md transition-colors"
                        >
                          🚪 Finalizar Contrato (Liberar a la Bolsa)
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {unlocks.filter((u: any) => u.clientId === currentUser.id && u.status === "approved").length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 font-bold border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Users size={36} className="mx-auto mb-2 opacity-50" />
                Aún no has desbloqueado contactos de candidatos.
              </div>
            )}
          </div>
        </div>
      )}
      {ratingCandidateId && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-violet-900 rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white/20 animate-scale-up space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-black text-violet-900">Calificar Candidato</h3>
              <p className="text-xs text-gray-500 mt-1">Comparte tu experiencia para ayudar a otros comercios de la red KFS.</p>
            </div>

            {/* Stars Selector */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="text-3xl focus:outline-none hover:scale-110 transition-transform cursor-pointer text-amber-500"
                >
                  {star <= ratingStars ? "★" : "☆"}
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Reseña / Referencia laboral</label>
              <textarea
                rows={3}
                placeholder="Ej: Excelente actitud, muy rápido en el POS y puntual. Altamente recomendado."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600 text-violet-900 font-bold placeholder:text-gray-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  releaseCandidate(ratingCandidateId, currentUser.id);
                  setRatingCandidateId(null);
                }}
                className="w-1/2 py-3 bg-gray-150 text-gray-500 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center animate-pulse"
              >
                Omitir Calificación
              </button>
              <button
                type="button"
                onClick={() => {
                  releaseCandidate(ratingCandidateId, currentUser.id, { rating: ratingStars, comment: ratingComment });
                  setRatingCandidateId(null);
                }}
                className="w-1/2 py-3 bg-violet-900 hover:bg-gray-800 text-white rounded-xl font-black text-xs transition-colors cursor-pointer text-center shadow-md"
              >
                Enviar y Liberar
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingCandidateCv && (
        <CvViewerModal
          isOpen={!!viewingCandidateCv}
          onClose={() => setViewingCandidateCv(null)}
          candidate={viewingCandidateCv}
        />
      )}



    </div>
  );
}
