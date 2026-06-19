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
const Toast = ({ toast }: { toast: any }) => {
  if (!toast.show) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-2xl backdrop-blur-md font-bold text-sm transition-all duration-300 flex items-center gap-2 ${toast.type === "error" ? "bg-red-500/90 text-white border border-red-400" : "bg-[violet-600]/90 text-[violet-900] border border-white/20"}`}>
      {toast.type === "success" ? <CheckCircle size={18} /> : <Activity size={18} />}
      {toast.message}
    </div>
  );
};

// CvViewerModal Component
const CvViewerModal = ({ isOpen, onClose, candidate }: any) => {
  if (!isOpen || !candidate) return null;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const printContent = document.getElementById("printable-cv-area")?.innerHTML;
    const cleanName = candidate.name.replace(/\s+/g, '_');

    // Create an iframe to print cleanly without resetting state or styling
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.write(`
        <html>
          <head>
            <title>CV_${cleanName}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
              body {
                font-family: 'Outfit', sans-serif;
                color: violet-900;
                background: white;
                margin: 40px;
                line-height: 1.5;
                font-size: 14px;
              }
              .header {
                border-bottom: 2px solid violet-600;
                padding-bottom: 20px;
                margin-bottom: 25px;
              }
              .name {
                font-size: 28px;
                font-weight: 900;
                color: violet-900;
                margin: 0;
              }
              .role {
                font-size: 16px;
                font-weight: 800;
                color: violet-600;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 5px;
              }
              .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 12px;
                color: #555;
                margin-top: 10px;
              }
              .section-title {
                font-size: 14px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: violet-900;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
                margin-top: 25px;
                margin-bottom: 12px;
              }
              .bio {
                font-size: 13px;
                color: #333;
                text-align: justify;
                white-space: pre-line;
              }
              .skills-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .skill-tag {
                background: #F4F4F6;
                border: 1px solid #E4E4E7;
                color: violet-900;
                padding: 4px 10px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 600;
              }
              .grid {
                display: grid;
                grid-template-cols: 1fr 1fr;
                gap: 15px;
                font-size: 12px;
              }
              .grid-item {
                background: #F8F9FA;
                padding: 10px 15px;
                border-radius: 12px;
                border: 1px solid #F1F3F5;
              }
              .grid-label {
                font-weight: 800;
                color: violet-600;
                text-transform: uppercase;
                font-size: 9px;
              }
              .grid-value {
                font-weight: 600;
                color: violet-900;
                margin-top: 2px;
              }
              .footer {
                margin-top: 40px;
                border-top: 1px solid #eee;
                padding-top: 15px;
                text-align: center;
                font-size: 10px;
                color: #aaa;
                font-weight: 600;
              }
              @media print {
                body {
                  margin: 20px;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-[violet-900] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-scale-up">
        {/* Modal Actions */}
        <div className="bg-gray-50 border-b border-gray-100 p-5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-black text-lg text-[violet-900]">Previsualizar CV Digital</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Generador de PDF KFS OS</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-[violet-900] text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              🖨️ Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors animate-pulse"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* CV Render Area */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <div id="printable-cv-area" className="w-full">
            <div className="header">
              <h1 className="name">{candidate.name}</h1>
              <div className="role">{candidate.role}</div>
              <div className="contact-info">
                <span>📞 Teléfono: {candidate.phone}</span>
                <span>📧 Correo: {candidate.email}</span>
                <span>📍 Ubicación: {candidate.answers?.location || "Caracas"}</span>
              </div>
            </div>

            <div className="section-title">Perfil Profesional</div>
            <div className="bio">{candidate.bio}</div>

            <div className="section-title">Habilidades Técnicas</div>
            <div className="skills-container">
              {candidate.skills?.map((s: string) => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
              {(!candidate.skills || candidate.skills.length === 0) && (
                <span className="text-xs text-gray-400 italic">Ninguna seleccionada</span>
              )}
            </div>

            <div className="section-title">Micro-Encuesta KFS</div>
            <div className="grid">
              <div className="grid-item">
                <div className="grid-label">Disponibilidad de Horario</div>
                <div className="grid-value">
                  {candidate.answers?.availability === "full-time" ? "Tiempo Completo (Full-time)" :
                    candidate.answers?.availability === "part-time" ? "Medio Tiempo (Part-time)" : "Fines de Semana"}
                </div>
              </div>
              <div className="grid-item">
                <div className="grid-label">Años de Experiencia</div>
                <div className="grid-value">
                  {candidate.answers?.experienceYears === "0-1" ? "Menos de 1 año" :
                    candidate.answers?.experienceYears === "1-3" ? "1 a 3 años" : "Más de 3 años"}
                </div>
              </div>
              <div className="grid-item">
                <div className="grid-label">Movilización / Vehículo</div>
                <div className="grid-value">
                  {candidate.answers?.hasVehicle === "no" ? "No posee transporte propio" :
                    candidate.answers?.hasVehicle === "moto" ? "Moto propia" : "Carro propio"}
                </div>
              </div>
              <div className="grid-item">
                <div className="grid-label">Ubicación Residencial</div>
                <div className="grid-value">{candidate.answers?.location || "No especificada"}</div>
              </div>
            </div>

            <div className="footer">
              Sello de Validación Técnica KFS OS • ID Postulante: {candidate.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SMS Bank Notification Simulator (Smart Conciliator Sim with Live Terminal Logs)
const SMSConciliatorSimulator = () => {
  const { smsConciliator, showToast, db } = useKFS();
  const [isOpen, setIsOpen] = useState(false);
  const [bank, setBank] = useState("Mercantil");
  const [amount, setAmount] = useState("450,00");
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("04141234567");
  const [customSMS, setCustomSMS] = useState("");

  const [logs, setLogs] = useState<string[]>([
    `[15:40:01] companion_ping: Local socket connection: ACTIVE`,
    `[15:40:02] local_ip: Listening on 192.168.1.45:8080`,
    `[15:40:02] hardware_listener: SMS Sync active on telemetry port 443.`
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    let text = "";
    if (bank === "Mercantil") {
      text = `Mercantil: PagoMovil por Bs ${amount} de ${phone} recibido. Ref: ${reference || "123456"}`;
    } else if (bank === "Banesco") {
      text = `Banesco: Recibio Pago Movil por Bs ${amount} de MARIA PEREZ. Ref: ${reference || "987654"}`;
    } else if (bank === "Provincial") {
      text = `Pago Movil Provincial: Recibido Bs ${amount} de ${phone}, Ref: ${reference || "554433"}`;
    } else {
      text = `Zinli: Recibiste un pago de $${amount} de JAVIER CASTILLO. Confirmacion: ${reference || "ZINLI99"}`;
    }
    setCustomSMS(text);
  }, [bank, amount, reference, phone]);

  // Auto scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  const pendingOrders = db.orders?.filter((o: any) => o.status === 'pending') || [];

  const handleAutofillReference = (ref: string, amt: number, ph: string) => {
    setReference(ref);
    const bsAmount = (amt * 36.45).toFixed(2).replace('.', ',');
    setAmount(bsAmount);
    setPhone(ph || "04141234567");
    addLog(`autofill: Parsed pending order reference ${ref} and amount Bs ${amt * 36.45}`);
    showToast("Campos auto-rellenados.", "success");
  };

  const handleSimulateSync = () => {
    if (!customSMS) return;

    addLog(`sms_inbound: Intercepted push SMS payload from bank channel`);
    addLog(`parser_engine: Extracting amount, reference, telf...`);

    setTimeout(() => {
      const result = smsConciliator(customSMS);

      addLog(`parser_result: Bank: ${result.bank || "N/A"}, Amount: ${result.amount || 0}, Ref: ${result.reference || "N/A"}`);

      if (result.matched) {
        addLog(`match_result: 100% reference hit on pending online order!`);
        addLog(`payout_split: Transmitting 20% hot commission splits to promoter wallet...`);
        addLog(`database: Resolving order status: APPROVED`);
        playPremiumChime();

        const flash = document.createElement("div");
        flash.className = "fixed inset-0 pointer-events-none z-[99999] flex items-center justify-center animate-fade-in";
        flash.innerHTML = `
          <div class="absolute inset-0 bg-[violet-600]/20 backdrop-blur-sm transition-all duration-1000"></div>
          <div class="bg-[violet-900] border-2 border-[violet-600] p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center max-w-sm text-center transform scale-95 animate-scale-up animate-pulse" style="box-shadow: 0 0 50px rgba(197, 161, 132, 0.4)">
            <div class="w-16 h-16 bg-[violet-600]/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-3xl">🛎️</span>
            </div>
            <h2 class="text-2xl font-black text-[violet-600] mb-2 uppercase tracking-widest">Pago Conciliado</h2>
            <p class="text-xs text-white/80 font-mono mb-4">Smart SMS Sync Engine</p>
            <div class="bg-white/5 border border-white/10 p-4 rounded-2xl w-full mb-2">
              <span class="text-[10px] text-gray-400 font-bold block uppercase">Referencia</span>
              <span class="text-lg font-black text-white font-mono">${result.reference}</span>
            </div>
            <p class="text-xs text-green-400 font-bold">¡Liberación de orden instantánea aprobada!</p>
          </div>
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
          flash.classList.add("opacity-0");
          setTimeout(() => flash.remove(), 1000);
        }, 3500);

        showToast(`¡Pago Móvil Conciliado! Ref: ${result.reference} aprobada.`, "success");
      } else {
        addLog(`match_result: FAILED. No pending order matched reference.`);
        showToast(`SMS analizado con éxito, pero: ${result.error}`, "error");
      }
    }, 400);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[80] w-14 h-14 bg-gradient-to-br from-[violet-600] to-[#a38063] rounded-full shadow-[0_4px_20px_rgba(197,161,132,0.4)] flex items-center justify-center text-[violet-900] hover:scale-110 active:scale-95 transition-all cursor-pointer group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">🛎️</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
          SIM
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[violet-900]/95 backdrop-blur-xl border-r border-white/10 z-[90] shadow-2xl p-6 overflow-y-auto animate-slide-right flex flex-col justify-between text-white">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛎️</span>
                <div>
                  <h3 className="font-black text-sm tracking-wide text-[violet-600]">KFS SMART CONCILIATOR</h3>
                  <p className="text-[9px] text-gray-400 font-mono">Simulador de Telemetría SMS</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-black text-[violet-600] uppercase tracking-widest block font-mono">Órdenes Pendientes</span>
              {pendingOrders.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold">No hay órdenes online pendientes. Crea una en Flow Express para probar el auto-llenado.</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {pendingOrders.map((o: any) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => handleAutofillReference(o.paymentReference, o.amountUSD, o.customerPhone)}
                      className="w-full text-left bg-white/5 hover:bg-[violet-600]/15 border border-white/10 p-2.5 rounded-xl transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div>
                        <span className="text-[9px] font-mono block text-gray-400 group-hover:text-white">Ref: {o.paymentReference}</span>
                        <span className="text-[10px] font-bold text-white block">Telf: {o.customerPhone || "N/A"}</span>
                      </div>
                      <span className="text-xs font-black text-green-400">${o.amountUSD} &rarr;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Configurador de Mensaje</span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Banco</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full bg-[violet-900] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[violet-600] text-white">
                    <option value="Mercantil">Mercantil</option>
                    <option value="Banesco">Banesco</option>
                    <option value="Provincial">Provincial</option>
                    <option value="Zinli">Zinli</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Monto (Bs o $)</label>
                  <input type="text" placeholder="Ej: 150,00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[violet-900] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[violet-600] text-white font-mono placeholder:text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Referencia</label>
                  <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full bg-[violet-900] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[violet-600] text-white font-mono" placeholder="Ej: 123456" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Teléfono Emisor</label>
                  <input type="text" placeholder="Ej: 04121234567" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[violet-900] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[violet-600] text-white font-mono placeholder:text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">SMS Simulado (Editar Libremente)</label>
                <textarea
                  value={customSMS}
                  onChange={e => setCustomSMS(e.target.value)}
                  rows={3}
                  className="w-full bg-[violet-900] border border-white/20 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[violet-600] text-white font-mono"
                />
              </div>
            </div>

            {/* Live Terminal Telemetry Console */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block font-mono flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Telemetría Logs SMS Sync
              </span>
              <div className="bg-black/90 p-4 border border-white/5 rounded-xl font-mono text-[9px] text-green-400 space-y-1 h-32 overflow-y-auto select-text w-full hide-scrollbar">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 mt-6">
            <button
              type="button"
              onClick={handleSimulateSync}
              className="w-full py-4 bg-gradient-to-br from-[violet-600] to-[#a38063] text-[violet-900] font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer"
            >
              🚀 Detonar Conciliación Zero-Clic
            </button>
            <p className="text-[9px] text-gray-500 font-mono text-center">Simula la intercepción de notificaciones de pago KFS SMS Companion.</p>
          </div>
        </div>
      )}
    </>
  );
};

// Módulo Interactivo de Gobernanza Financiera (Split Visual Dinámico)
const KFSFinancialSplitCalculator = ({ formatUSD, formatEUR, clientFeePercentage = 0.03 }: { formatUSD: any, formatEUR: any, clientFeePercentage?: number }) => {
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
    <div className="bg-[violet-900] text-white p-6 md:p-8 rounded-[2rem] border border-[violet-600]/30 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-[violet-600]/20 pb-4">
          <div>
            <h3 className="text-lg font-black text-[violet-600] tracking-wide uppercase">Oráculo Financiero & Splits</h3>
            <p className="text-[10px] text-gray-400 font-mono">Simulador de Ecosistema KFS OS</p>
          </div>
          <span className="bg-[violet-600]/15 border border-[violet-600]/30 text-[violet-600] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider font-mono">Fórmula SaaS + POS</span>
        </div>

        {/* Interactive controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Monto de Venta de Ejemplo</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="1000"
                value={inputAmt}
                onChange={(e) => setInputAmt(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[violet-600]"
              />
              <span className="text-xl font-black font-mono text-[violet-600] min-w-[70px] text-right">${inputAmt}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tarifa BOS del Comercio</label>
            <div className="grid grid-cols-3 gap-2">
              {[0.03, 0.05, 0.10].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setFeePercentage(pct)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${feePercentage === pct ? "bg-[violet-600] text-[violet-900]" : "bg-white/5 text-[violet-600] border border-[violet-600]/20 hover:bg-white/10"}`}
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time splits visualization */}
        <div className="space-y-4 pt-4 border-t border-[violet-600]/15">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Distribución del Flujo de Capital</span>

          {/* 1. Commerce share */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>Ingreso Neto Comercio (Tienda)</span>
              <span className="text-green-400 font-black">{formatUSD(commerceNetUSD)} ({((commerceNetUSD / inputAmt) * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${(commerceNetUSD / inputAmt) * 100}%` }}></div>
            </div>
          </div>

          {/* 2. Total KFS Fee split */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-black text-[violet-600]">Comisión Total Kreatek KFS</span>
              <span className="text-red-400 font-mono font-black text-sm">{formatUSD(kfsFeeTotalUSD)}</span>
            </div>
            <p className="text-[9px] text-gray-400 leading-normal mb-2">Se distribuye en caliente de forma instantánea al registrar el cobro:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Promotora (20% share)</span>
                <span className="text-sm font-black text-yellow-400 block mt-1">{formatEUR(promoterEUR)}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Directo a Wallet (EUR)</span>
              </div>

              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Publicidad (20% neto)</span>
                <span className="text-sm font-black text-indigo-400 block mt-1">{formatEUR(adBudgetEUR)}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Inyección de Campañas</span>
              </div>

              <div className="bg-[violet-600]/10 border border-[violet-600]/20 p-3 rounded-xl">
                <span className="text-[9px] text-[violet-600] font-black block uppercase tracking-wider">Arquitecto (Neto Neto)</span>
                <span className="text-sm font-black text-green-400 block mt-1">{formatEUR(finalNetEUR)}</span>
                <span className="text-[8px] text-gray-400 font-mono block">Ganancia Neta KFS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background icon design */}
      <DollarSign size={150} className="absolute -right-16 -bottom-16 text-white/5 pointer-events-none" />
    </div>
  );
};

// Sincro-Shield Fiscal Setup Widget (SENIAT)
const FiscalPrinterSetupWidget = () => {
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
            <h3 className="font-black text-sm text-[violet-900] uppercase tracking-wider">🛡️ Sincro-Shield Fiscal (SENIAT)</h3>
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
                className="bg-[violet-900] text-white px-4 rounded-xl font-bold text-xs hover:bg-gray-800 disabled:opacity-50 flex-shrink-0 cursor-pointer"
              >
                {testing ? "Probando..." : "Probar"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-[9px] text-gray-500 space-y-1">
            <p className="font-bold text-[violet-900] uppercase tracking-wider text-[8px]">Telemetría Local:</p>
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

        <div className="bg-[violet-900] text-white p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Descarga el script `fiscal-proxy.js` y ejecútalo en la PC que tenga la impresora fiscal física conectada por serial.
          </p>
          <button
            type="button"
            onClick={downloadProxyScript}
            className="w-full mt-2 py-2 bg-[violet-600] hover:bg-[#b08e72] text-[violet-900] font-black rounded-lg text-xs transition-colors cursor-pointer text-center"
          >
            Descargar fiscal-proxy.js
          </button>
        </div>
      </div>
    </div>
  );
};

// Consola de Ajustes de Conectividad IoT Edge (WebUSB/WebBluetooth)
const KFSIoTEdgeConsole = ({ showToast }: { showToast: any }) => {
  const [devices, setDevices] = useState<string[]>(["Tiquetera Virtual KFS (Loopback)"]);
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
    <div className="bg-[violet-900] text-white p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            <div>
              <h3 className="text-sm font-black text-[violet-600] tracking-wide uppercase">CONEXIÓN IoT EDGE & HARDWARE</h3>
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
              className="w-full py-3 bg-white/5 hover:bg-[violet-600]/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              🔌 {isScanningUSB ? "Buscando USB..." : "Conectar Tiquetera USB (WebUSB)"}
            </button>

            <button
              type="button"
              onClick={handleScanBluetooth}
              disabled={isScanningBT}
              className="w-full py-3 bg-white/5 hover:bg-[violet-600]/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
                  <span className="text-[8px] text-[violet-600] uppercase font-black">Activo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Kreatek Logo Component (Removes white background dynamically)
const KreatekLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <img
      src="/kfs-logo.png"
      className={className}
      alt="Kreatek Flow Systems"
      style={{ objectFit: "contain" }}
    />
  );
};



// Navbar Component with state-aware interactive P2P Telemetry and profile avatar
const Navbar = ({ title, showBack = false, onBack }: { title?: string, showBack?: boolean, onBack?: () => void }) => {
  const { 
    view, 
    handleLogin, 
    networkState, 
    setNetworkState, 
    showToast, 
    currentUser, 
    setCurrentUser, 
    setDb, 
    db, 
    logout, 
    setView, 
    requestPayout,
    requestTopUp 
  } = useKFS() as any;
  const [isSyncing, setIsSyncing] = useState(false);

  const handleBack = () => {
    if (onBack && onBack !== logout) {
      onBack();
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      } else {
        setView("landing");
      }
    }
  };

  const cycleNetworkState = () => {
    if (isSyncing) return;

    if (networkState === "online") {
      setNetworkState("mesh");
      showToast("Modo: RED DE MALLA LOCAL (P2P Mesh) activada. Inventarios locales vinculados.", "success");
    } else if (networkState === "mesh") {
      setNetworkState("offline");
      showToast("Modo: DESCONECTADO (Stand-alone). Guardado en LocalStorage activado.", "error");
    } else {
      setIsSyncing(true);
      showToast("Sincronizando base de datos local P2P con el servidor en la nube...", "success");

      // Simulate sync animation
      setTimeout(() => {
        setNetworkState("online");
        setIsSyncing(false);
        playSyncChime();
        showToast("¡Base de datos sincronizada! 100% de consistencia en la nube.", "success");
      }, 2000);
    }
  };

  const getNetworkDetails = () => {
    switch (networkState) {
      case "online":
        return { color: "bg-green-500 shadow-[0_0_8px_#22c55e]", border: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)] bg-green-950/20 hover:bg-green-900/30 text-green-400", label: "ONLINE (NUBE)", text: "text-green-400" };
      case "mesh":
        return { color: "bg-amber-500 shadow-[0_0_8px_#f59e0b]", border: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] bg-amber-950/20 hover:bg-amber-900/30 text-amber-400", label: "LOCAL MESH (P2P)", text: "text-amber-400" };
      case "offline":
        return { color: "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse", border: "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] bg-red-950/20 hover:bg-red-900/30 text-red-400 animate-pulse", label: "OFFLINE (STAND-ALONE)", text: "text-red-400" };
      default:
        return { color: "bg-green-500 shadow-[0_0_8px_#22c55e]", border: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)] bg-green-950/20 hover:bg-green-900/30 text-green-400", label: "ONLINE (NUBE)", text: "text-green-400" };
    }
  };

  const net = getNetworkDetails();
  const latestNotif: any = currentUser ? [...(db.notifications || [])].filter((n: any) => n.audience === 'all' || n.audience === currentUser.role).pop() : null;

  return (
    <>
      {latestNotif && (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg z-50 animate-fade-in relative">
          <Bell size={16} className="animate-bounce" />
          <span className="uppercase tracking-widest">{latestNotif.title}:</span>
          <span className="font-normal">{latestNotif.message}</span>
        </div>
      )}
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 bg-[violet-900] sticky top-0 z-40 backdrop-blur-md gap-3 w-full">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-gray-300 font-bold transition-all cursor-pointer mr-2"
            >
              <ChevronLeft size={16} /> Atrás
            </button>
          )}
          <KreatekLogo className="h-10 sm:h-12 w-auto" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Network Telemetry Trigger */}
          <button
            onClick={cycleNetworkState}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${net.border} cursor-pointer group disabled:opacity-50`}
            title="Gestor de Conexión de Contingencia y Sincronización"
          >
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.color}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${net.color}`}></span>
            </span>
            <span className={`font-mono text-[10px] font-black ${net.text} tracking-wider`}>
              {isSyncing ? "SINCRONIZANDO..." : net.label}
            </span>
          </button>

          {title && <span className="text-white/80 text-xs sm:text-sm uppercase tracking-wider font-mono bg-white/5 px-3 py-1.5 rounded-full">{title}</span>}

          {currentUser && currentUser.role !== "marketplace" && (
            <label className="relative w-8 h-8 rounded-full border border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all shadow-inner group" title="Toca tu foto para actualizar tu imagen de perfil">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const base64String = await compressImage(file, 400);
                      setDb((prev: any) => {
                        let updated = { ...prev };
                        if (currentUser.role === "dueño") {
                          updated.clients = prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, avatar: base64String } : c);
                        } else if (currentUser.role === "promotora") {
                          updated.promotoras = prev.promotoras.map((p: any) => p.id === currentUser.id ? { ...p, avatar: base64String } : p);
                        } else if (currentUser.role === "vendedor") {
                          updated.vendedores = prev.vendedores.map((v: any) => v.id === currentUser.id ? { ...v, avatar: base64String } : v);
                        } else if (currentUser.role === "customer") {
                          updated.customers = (prev.customers || []).map((c: any) => c.id === currentUser.id ? { ...c, avatar: base64String } : c);
                        } else if (currentUser.role === "rider") {
                          updated.riders = (prev.riders || []).map((r: any) => r.id === currentUser.id ? { ...r, avatar: base64String } : r);
                        } else if (currentUser.role === "core") {
                          updated.kreatekCore = { ...updated.kreatekCore, avatar: base64String };
                        }
                        return updated;
                      });

                      setCurrentUser((prev: any) => ({ ...prev, avatar: base64String }));
                      showToast("Foto de perfil comprimida y guardada.", "success");
                    } catch (error) {
                      showToast("Error comprimiendo imagen", "error");
                    }
                  }
                }}
              />
              {currentUser.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
              ) : (
                <div className="w-full h-full bg-[violet-600] text-[violet-900] font-black text-[10px] flex items-center justify-center">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[8px] text-white font-black">⚙️</span>
              </div>
            </label>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1"
              title="Cerrar Sesión y salir del sistema"
            >
              ❌ Salir
            </button>
          )}
        </div>

      </nav>
    </>
  );
};

const RegisterClientForm = ({ onRegister, onCancel, standalone = true, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", idCard: "", company: "", avgBilling: "", phone: "", email: "", password: "", address: "", kfsFeePercentage: 0.03, avatar: "", kycCedula: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [acceptedToS, setAcceptedToS] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setAvatar(base64String);
      setFormData(prev => ({ ...prev, avatar: base64String }));
    }
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setKycCedula(base64String);
      setFormData(prev => ({ ...prev, kycCedula: base64String }));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (acceptedToS) onRegister(formData, defaultReferralCode, 0.03); else alert("Debes aceptar los Términos de Servicio y Privacidad."); }} className={`space-y-3 ${standalone ? "text-sky-950 animate-fade-in" : "text-sky-950"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-sky-700 border-sky-100" : "text-sky-900 border-sky-100"}`}>Setup de Nuevo Comercio</h3>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1 text-slate-500">Foto</span>
            </div>
          )}
        </label>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${standalone ? "text-slate-400" : "text-slate-500"}`}>Logo / Foto Comercio</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className={`relative w-full h-20 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center transition-colors group ${standalone ? "bg-sky-50 hover:bg-sky-100" : "bg-sky-50/50 hover:bg-sky-100"}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className={`text-center transition-colors ${standalone ? "text-sky-400 group-hover:text-sky-600" : "text-sky-500 group-hover:text-sky-700"}`}>
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Cédula del Representante (KYC)</span>
            </div>
          )}
        </label>
      </div>

      <input required placeholder="Nombre Completo" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input required placeholder="Cédula / RIF" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, idCard: e.target.value })} />
      <input required placeholder="Nombre de la Empresa" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, company: e.target.value })} />
      <textarea required placeholder="Dirección Comercial" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, address: e.target.value })} />
      <input required type="number" placeholder="Facturación Promedio Diaria ($)" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, avgBilling: e.target.value })} />

      <div className="flex flex-col mb-2">
        <label className={`text-xs font-bold mb-2 uppercase tracking-widest ${standalone ? "text-slate-400" : "text-slate-500"}`}>Tarifa BOS (Comisión Kreatek)</label>
        <select required value={formData.kfsFeePercentage} onChange={e => setFormData({ ...formData, kfsFeePercentage: parseFloat(e.target.value) })} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all font-bold cursor-pointer ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`}>
          <option value={0.03}>Plan Base (3%)</option>
          <option value={0.05}>Plan Estándar (5%)</option>
          <option value={0.10}>Plan Premium (10%)</option>
        </select>
      </div>

      <input required placeholder="Teléfono Personal" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
      <input required type="email" placeholder="Correo Electrónico" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input required type="password" placeholder="Crear Clave de Acceso" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${standalone ? "bg-sky-50/50 border-sky-100 text-sky-950 placeholder:text-slate-400" : "bg-sky-50/30 border-sky-100 text-sky-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, password: e.target.value })} />

      <div className="flex items-start gap-2 pt-2 mb-2">
        <input type="checkbox" required checked={acceptedToS} onChange={(e) => setAcceptedToS(e.target.checked)} className="mt-1 cursor-pointer" />
        <span className={`text-[10px] leading-tight ${standalone ? "text-slate-500" : "text-slate-500"}`}>
          He leído y acepto los <strong className="text-sky-600 cursor-pointer hover:underline">Términos de Servicio (ToS)</strong>. Entiendo que KFS cobra $6 mensuales por mantenimiento, y que Kreatek no asume responsabilidad financiera sobre el comercio frente al cliente final.
        </span>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 cursor-pointer border-none bg-sky-600">Aprobar Setup</button>
      </div>
    </form>
  );
};

// Setup Promotora Form
const RegisterPromotoraForm = ({ onRegister, onCancel, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "", avatar: "", kycCedula: "", kycAddress: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setAvatar(base64String);
      setFormData(prev => ({ ...prev, avatar: base64String }));
    }
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setKycCedula(base64String);
      setFormData(prev => ({ ...prev, kycCedula: base64String }));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister({ ...formData, referralCode: defaultReferralCode }); }} className="space-y-3 text-sky-950 animate-fade-in pb-4">
      <h3 className="text-lg font-black mb-4 border-b border-sky-100 pb-2 text-sky-700">Autogestión de Promotora</h3>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1 text-slate-500">Foto</span>
            </div>
          )}
        </label>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Foto de Perfil</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-full h-20 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Foto de Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <input required placeholder="Nombre Completo" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <textarea required placeholder="Dirección Completa (KYC)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, kycAddress: e.target.value })} />
      <input required type="email" placeholder="Correo Electrónico" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input required type="password" placeholder="Crear Clave de Acceso" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <input required placeholder="Binance ID (Ej: 184592...)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, binanceId: e.target.value })} />
      <input required placeholder="Pago Móvil (Ej: 0412...)" className="w-full bg-sky-50/50 border border-sky-100 rounded-lg px-4 py-3 text-sm text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, pagoMovil: e.target.value })} />
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 hover:bg-sky-50 text-slate-500 font-bold transition-all text-sm cursor-pointer bg-transparent">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 cursor-pointer bg-sky-600 border-none">Registrar Perfil</button>
      </div>
    </form>
  );
};



/* LandingPageView EXTRACTED */

;

// Login View


/* LoginView EXTRACTED */

;

const RegisterCustomerForm = ({ onCancel, defaultReferralCode }: { onCancel: () => void, defaultReferralCode?: string }) => {
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+58");
  const [phoneBody, setPhoneBody] = useState("");
  const [password, setPassword] = useState("");
  const [kycPhoto, setKycPhoto] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [kycAddress, setKycAddress] = useState("");
  const { registerCustomer } = useKFS() as any;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomer(`${phonePrefix}${phoneBody}`, password, name, defaultReferralCode, kycPhoto, kycCedula, kycAddress);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file, 200, 0.6);
      setter(base64);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let rawBody = phoneBody.replace(/[^0-9]/g, '');
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    const fullPhone = phonePrefix + rawBody;
    registerCustomer(fullPhone, password, name, defaultReferralCode || undefined, kycPhoto, kycCedula, kycAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <input required type="text" placeholder="Nombre y Apellido" value={name} onChange={e => setName(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" />

      <div className="flex gap-2">
        <select
          value={phonePrefix}
          onChange={e => setPhonePrefix(e.target.value)}
          className="bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 focus:outline-none focus:border-sky-400 text-sm cursor-pointer"
        >
          <option value="+58">VE (+58)</option>
          <option value="+57">CO (+57)</option>
          <option value="+507">PA (+507)</option>
          <option value="+34">ES (+34)</option>
          <option value="+56">CL (+56)</option>
          <option value="+593">EC (+593)</option>
          <option value="+51">PE (+51)</option>
          <option value="+54">AR (+54)</option>
          <option value="+1">US/CA (+1)</option>
          <option value="+1809">DO (+1-809)</option>
        </select>
        <input required type="text" placeholder="Número Telefónico (Ej: 4141234567)" value={phoneBody} onChange={e => setPhoneBody(e.target.value)} className="flex-1 bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all" />
      </div>

      <div className="flex gap-4 mb-2">
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50/50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycPhoto)} required />
          {kycPhoto ? (
            <img src={kycPhoto} className="w-full h-full object-cover" alt="Selfie" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <Camera size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Selfie (Obligatorio)</span>
            </div>
          )}
        </label>
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-sky-200 cursor-pointer overflow-hidden flex items-center justify-center bg-sky-50/50 hover:bg-sky-100 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycCedula)} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover" alt="Cédula" />
          ) : (
            <div className="text-center text-sky-400 group-hover:text-sky-600 transition-colors">
              <FileText size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1 text-slate-500">Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <textarea required placeholder="Dirección Residencial Completa" value={kycAddress} onChange={e => setKycAddress(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all text-sm h-20 resize-none" />

      <input required type="password" placeholder="Crear Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all" />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all cursor-pointer">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-sky-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-sky-600/30 border-none cursor-pointer">Crear Cuenta</button>
      </div>
    </form>
  )
}
// RegisterRiderForm — Formulario de Registro para Riders de Delivery
const RegisterRiderForm = ({ onCancel, defaultReferralCode = "" }: { onCancel: () => void, defaultReferralCode?: string }) => {
  const { registerRider, showToast } = useKFS() as any;
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    cedulaImg: "", medCertImg: "", licenseImg: "",
    pagoMovil: { banco: "", telefono: "", cedula: "" }
  });
  const [uploading, setUploading] = useState({ cedula: false, med: false, license: false });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "cedulaImg" | "medCertImg" | "licenseImg", key: "cedula" | "med" | "license") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const base64 = await compressImage(file, 500, 0.6);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    } catch {
      showToast("Error al subir documento", "error");
    }
    setUploading(prev => ({ ...prev, [key]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cedulaImg) { showToast("Debes subir tu Cédula de Identidad.", "error"); return; }
    if (!formData.medCertImg) { showToast("Debes subir tu Certificado Médico.", "error"); return; }
    if (!formData.licenseImg) { showToast("Debes subir tu Licencia de Conducir.", "error"); return; }
    if (!formData.pagoMovil.banco || !formData.pagoMovil.telefono || !formData.pagoMovil.cedula) {
      showToast("Completa todos los datos de Pago Móvil.", "error"); return;
    }
    registerRider({ ...formData, referredBy: defaultReferralCode });
  };

  const DocUploadField = ({ label, icon, field, fileKey, uploaded }: { label: string; icon: string; field: "cedulaImg" | "medCertImg" | "licenseImg"; fileKey: "cedula" | "med" | "license"; uploaded: boolean }) => (
    <label className={`relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${uploaded ? "border-green-400 bg-green-50" : "border-sky-200 bg-sky-50/50 hover:bg-sky-100"}`}>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleDocUpload(e, field, fileKey)} />
      <span className="text-3xl">{uploaded ? "✅" : icon}</span>
      <span className={`text-[11px] font-bold text-center ${uploaded ? "text-green-600" : "text-sky-700 group-hover:text-sky-800"}`}>
        {uploading[fileKey] ? "Subiendo..." : uploaded ? "¡Cargado!" : label}
      </span>
      {uploaded && <span className="text-[8px] text-green-500 font-mono">Toca para cambiar</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in w-full pb-4">
      <div className="text-center pb-2 border-b border-sky-100">
        <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-sky-200">
          <Truck className="text-sky-600" size={24} />
        </div>
        <h3 className="text-base font-black text-sky-700 uppercase tracking-wider">Registro Rider Delivery</h3>
        <p className="text-[10px] text-slate-400 mt-1">Sujeto a aprobación del Arquitecto KFS</p>
      </div>

      {/* Personal Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Nombre Completo" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="tel" placeholder="Teléfono (Ej: 04141234567)" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="email" placeholder="Correo Electrónico" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required type="password" placeholder="Crear Contraseña" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
      </div>

      {/* Document Uploads */}
      <div className="space-y-1 mt-2">
        <p className="text-[10px] font-black text-sky-700 uppercase tracking-widest">Documentos Requeridos</p>
        <p className="text-[9px] text-slate-500">Sube fotos directas desde tu galería o cámara</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <DocUploadField label="Cédula" icon="🪪" field="cedulaImg" fileKey="cedula" uploaded={!!formData.cedulaImg} />
        <DocUploadField label="Cert. Médico" icon="🏥" field="medCertImg" fileKey="med" uploaded={!!formData.medCertImg} />
        <DocUploadField label="Licencia" icon="🚗" field="licenseImg" fileKey="license" uploaded={!!formData.licenseImg} />
      </div>

      {/* Pago Móvil */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-sky-700 uppercase tracking-widest">Pago Móvil (Cobro de Delivery $2)</p>
        <p className="text-[9px] text-slate-500">Los clientes te pagarán directamente aquí</p>
      </div>
      <select required value={formData.pagoMovil.banco} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, banco: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-4 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all cursor-pointer">
        <option value="">— Selecciona Banco —</option>
        {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input required type="tel" placeholder="Teléfono PM (04xx...)" value={formData.pagoMovil.telefono} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, telefono: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
        <input required placeholder="Cédula Titular" value={formData.pagoMovil.cedula} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, cedula: e.target.value } }))} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-3 text-sky-950 text-sm focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-400" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">⚠️ Tu solicitud será revisada por el Arquitecto KFS. Recibirás notificación de aprobación antes de poder operar.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-sky-200 text-slate-500 font-bold hover:bg-sky-50 transition-all text-sm cursor-pointer">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-sky-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2 border-none shadow-md shadow-sky-600/30">
          <Truck size={16} /> Enviar Solicitud
        </button>
      </div>
    </form>
  );
};



/* CustomerDashboard EXTRACTED */

;

// CoreDashboard


/* CoreDashboard EXTRACTED */

;

// Promotora Dashboard


/* PromotoraDashboard EXTRACTED */

;

const StorefrontCustomizer = ({ client, updateStoreSettings }: { client: any, updateStoreSettings: any }) => {
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
};

const OnboardingWizard = ({ currentUser, finishOnboarding }: any) => {
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
};

const RecruitmentWidget = ({ db, currentUser, formatUSD }: any) => {
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
          <h3 className="font-black text-2xl text-[violet-900] flex items-center gap-2">
            <Users className="text-[violet-600]" /> Reclutamiento & Bolsa de Trabajo
          </h3>
          <p className="text-xs text-gray-500 mt-1">Busca talento verificado y respaldado por la red KFS OS en Venezuela.</p>
        </div>

        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => setActiveWidgetTab("search")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "search" ? "bg-[violet-900] text-white" : "text-gray-500 hover:text-[violet-900]"}`}
          >
            Buscar Candidatos
          </button>
          <button
            onClick={() => setActiveWidgetTab("preset")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "preset" ? "bg-[violet-900] text-white" : "text-gray-500 hover:text-[violet-900]"}`}
          >
            Configurar Criterios
          </button>
          <button
            onClick={() => setActiveWidgetTab("unlocked")}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${activeWidgetTab === "unlocked" ? "bg-[violet-900] text-white" : "text-gray-500 hover:text-[violet-900]"}`}
          >
            Desbloqueados
          </button>
        </div>
      </div>

      {activeWidgetTab === "preset" && (
        <form onSubmit={handleSavePreset} className="space-y-6">
          <h4 className="text-sm font-black text-[violet-900] uppercase tracking-wider">¿Qué perfil necesitas contratar?</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cargo Solicitado</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400"
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
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400"
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
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400"
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
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400"
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected ? "bg-[violet-900] text-white shadow-md" : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"}`}
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
              className="bg-[violet-900] text-white px-8 py-4 rounded-xl font-black hover:scale-[1.03] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
                        <h4 className="text-lg font-black text-[violet-900] mt-1 filter blur-[4px] select-none">
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
                      <div>📍 Residencia: <span className="text-[violet-900]">{cand.answers?.location || "No especificada"}</span></div>
                      <div>⏳ Experiencia: <span className="text-[violet-900]">{cand.answers?.experienceYears || "0-1"} años</span></div>
                      <div>🚗 Vehículo: <span className="text-[violet-900]">{cand.answers?.hasVehicle === "no" ? "No posee" : cand.answers?.hasVehicle === "moto" ? "Moto" : "Carro"}</span></div>
                      <div>⏰ Horario: <span className="text-[violet-900]">{cand.answers?.availability === "full-time" ? "Completo" : "Parcial"}</span></div>
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
                          <p><strong className="text-[violet-900]">Banco:</strong> Banco Nacional de Crédito (BNC)</p>
                          <p><strong className="text-[violet-900]">Teléfono:</strong> 0414-0000000</p>
                          <p><strong className="text-[violet-900]">Cédula:</strong> V-25.218.648</p>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Referencia Bancaria"
                            value={refNum}
                            onChange={(e) => setRefNum(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[violet-400]"
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
                          className="w-full bg-[violet-900] text-white hover:bg-gray-800 transition-colors font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Lock size={14} className="text-[violet-600]" /> Desbloquear Datos ($10)
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
                        <h4 className="text-lg font-black text-[violet-900] mt-1 flex items-center gap-1.5">
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
                      <div>📍 Residencia: <span className="text-[violet-900]">{cand.answers?.location || "No especificada"}</span></div>
                      <div>⏳ Experiencia: <span className="text-[violet-900]">{cand.answers?.experienceYears || "0-1"} años</span></div>
                      <div>🚗 Vehículo: <span className="text-[violet-900]">{cand.answers?.hasVehicle === "no" ? "No posee" : cand.answers?.hasVehicle === "moto" ? "Moto" : "Carro"}</span></div>
                      <div>⏰ Horario: <span className="text-[violet-900]">{cand.answers?.availability === "full-time" ? "Completo" : "Parcial"}</span></div>
                    </div>

                    <div className="bg-[violet-900] text-white p-4 rounded-xl space-y-2 border border-[violet-600]/20 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400">Teléfono:</span>
                        <span className="text-[violet-600] font-mono">{cand.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-mono select-all text-[10px]">{cand.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold border-t border-[violet-600]/10 pt-2 mt-1">
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
                            className="text-[violet-600] underline cursor-pointer text-[10px]"
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
                                <span className="text-[violet-900]">{r.clientName}</span>
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
          <div className="bg-white text-[violet-900] rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white/20 animate-scale-up space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-black text-[violet-900]">Calificar Candidato</h3>
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
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[violet-600] text-[violet-900] font-bold placeholder:text-gray-400"
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
                className="w-1/2 py-3 bg-[violet-900] hover:bg-gray-800 text-white rounded-xl font-black text-xs transition-colors cursor-pointer text-center shadow-md"
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
};



/* ClientDashboard EXTRACTED */

;

// Scanner View Component (Maintains camera and simulation logic)
const ScannerView = ({ videoRef, onClose, onScan, myProducts, formatUSD }: any) => {
  const [selectedProductToSimulate, setSelectedProductToSimulate] = useState("");
  const [selectedScanType, setSelectedScanType] = useState("product");
  const [selectedCedula, setSelectedCedula] = useState("PDF417:V25218648JAVIER_CASTILLO_M28051995");
  const localStreamRef = useRef<any>(null);

  useEffect(() => {
    let html5QrCode: any;
    let isComponentMounted = true;

    const startScanner = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!isComponentMounted) return;

        html5QrCode = new Html5Qrcode("kfs-reader");

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText: string) => {
            if (html5QrCode && html5QrCode.isScanning) {
              html5QrCode.stop().then(() => {
                onScan(decodedText);
              }).catch(() => {
                onScan(decodedText);
              });
            }
          },
          (errorMessage: string) => {
            // Ignore frame parsing errors
          }
        );
      } catch (err) {
        console.warn("Cámara física no disponible o error iniciando escáner. Se activa el simulador interactivo KFS.", err);
      }
    };

    startScanner();

    return () => {
      isComponentMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  const handleSimulatedScan = () => {
    if (selectedScanType === "product") {
      if (!selectedProductToSimulate) return;
      onScan(selectedProductToSimulate);
    } else {
      if (!selectedCedula) return;
      onScan(selectedCedula);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-br from-sky-900 to-slate-900 border border-sky-800 rounded-[2.5rem] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-sky-200 hover:text-white cursor-pointer">
          <X size={24} />
        </button>
        <h3 className="text-xl font-black text-sky-400 mb-4 flex items-center gap-2"><QrCode /> Terminal de Escaneo KFS</h3>

        {/* Scan Frame */}
        <div id="kfs-reader" className="relative w-full aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center mb-6">
          {/* Laser animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse border-b-2 border-red-400 z-10 pointer-events-none" style={{ animationDuration: "1.5s", animationIterationCount: "infinite" }} />

          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-center z-10 pointer-events-none">
            <span className="text-[10px] text-sky-200 font-mono flex items-center justify-center gap-1"><Info size={12} /> Buscando QR o Código de Barras...</span>
          </div>
        </div>

        {/* Manual Fallback Entry Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block font-mono">Entrada Manual de Emergencia</span>
          <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
            <button
              type="button"
              onClick={() => setSelectedScanType("product")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "product" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
            >
              📦 Producto
            </button>
            <button
              type="button"
              onClick={() => setSelectedScanType("cedula")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "cedula" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
            >
              🪪 Cédula PDF417
            </button>
          </div>

          {selectedScanType === "product" ? (
            <select
              className="w-full bg-slate-900/50 text-white border border-sky-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-sky-500"
              value={selectedProductToSimulate}
              onChange={(e) => setSelectedProductToSimulate(e.target.value)}
            >
              <option value="">-- Seleccionar Producto --</option>
              {myProducts.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} - {formatUSD(p.priceUSD)}</option>
              ))}
            </select>
          ) : (
            <select
              className="w-full bg-slate-900/50 text-white border border-sky-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
              value={selectedCedula}
              onChange={(e) => setSelectedCedula(e.target.value)}
            >
              <option value="PDF417:V25218648JAVIER_CASTILLO_M28051995">Cédula V-25.218.648 Javier Castillo (M)</option>
              <option value="PDF417:V12345678MARIA_PEREZ_F15081985">Cédula V-12.345.678 Maria Perez (F)</option>
              <option value="PDF417:E87654321PEDRO_GOMEZ_M10101974">Cédula E-87.654.321 Pedro Gomez (M)</option>
            </select>
          )}

          <button
            type="button"
            onClick={handleSimulatedScan}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-600/30 border-none cursor-pointer"
          >
            ✓ Confirmar e Ingresar Manualmente
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="px-6 py-2 border border-white/15 text-xs text-sky-200/70 hover:text-white font-bold rounded-lg transition-colors cursor-pointer">
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};

// Vendedor Dashboard


/* VendedorDashboard EXTRACTED */

;

// Marketplace Public View


/* MarketplaceView EXTRACTED */

;

// ==========================================
// RIDER DASHBOARD
// ==========================================


/* RiderDashboard EXTRACTED */

;

// ==========================================
// MAIN COMPONENT DEFINITION
// ==========================================
export default function Home() {
  const {
    isClient, isBooting, view, setView, currentUser, setCurrentUser,
    toast, db, setDb, formatUSD, formatEUR, showToast,
    handleLogin, logout, registerClient, registerFreeUser, upgradeToPremium, registerPromotora, approvePromotora, rejectPromotora, settlePromotoraEarnings, addProduct, addExpense, processPurchase,
    submitOnlineOrder, approveOrder, rejectOrder, dispatchOrder, generateZReport, registerCrmExpress,
    paySubscription, approveSubscription, requestPayout, requestTopUp,
    ghostTrapLocked, setGhostTrapLocked, triggerGhostTrap, logAction
  } = useKFS() as any;

  const [ghostPassword, setGhostPassword] = useState("");
  const [ghostError, setGhostError] = useState("");

  const handleUnlockGhostTrap = () => {
    const ghostPin = process.env.NEXT_PUBLIC_GHOST_TRAP_PIN || "1234";
    const corePass = process.env.NEXT_PUBLIC_CORE_PASSWORD || "199521";
    if (ghostPassword === ghostPin || ghostPassword === corePass || ghostPassword === "199521.") {
      setGhostTrapLocked(false);
      setGhostPassword("");
      setGhostError("");
      showToast("Terminal desbloqueado con éxito (Master).", "success");
      logAction("Dueño/Arquitecto", "GHOST_TRAP_UNLOCK", "El Protocolo Ghost fue desbloqueado usando Clave Maestra.");
    } else if (ghostPassword === "0000") {
      setGhostTrapLocked(false);
      setGhostPassword("");
      setGhostError("");
      showToast("Terminal desbloqueado por Supervisor.", "error");
      logAction("Supervisor", "GHOST_TRAP_OVERRIDE", "ALERTA ROJA: El Protocolo Ghost fue evadido usando el PIN de contingencia (Supervisor).");
    } else {
      setGhostError("Clave incorrecta. Acceso denegado.");
    }
  };

  const protectedViews = ["core", "client", "promotora", "vendedor", "customer", "rider"];

  let isUserValid = true;
  if (currentUser) {
    if (currentUser.role === "dueño" && db.clients?.length > 0 && !db.clients.some((c: any) => c.id === currentUser.id)) isUserValid = false;
    if (currentUser.role === "rider" && db.riders?.length > 0 && !db.riders.some((r: any) => r.id === currentUser.id)) isUserValid = false;
    if (currentUser.role === "vendedor" && db.vendedores?.length > 0 && !db.vendedores.some((v: any) => v.id === currentUser.id)) isUserValid = false;
  }

  const updatePwaStatus = async (status: boolean) => {
    if (!currentUser || currentUser.pwaInstalled === status) return;
    setCurrentUser({ ...currentUser, pwaInstalled: status });
    let table = "";
    if (currentUser.role === "dueño") table = "clients";
    else if (currentUser.role === "promotora") table = "promotoras";
    else if (currentUser.role === "customer") table = "customers";
    else if (currentUser.role === "rider") table = "riders";
    else if (currentUser.role === "vendedor") table = "vendedores";
    
    if (table && supabase) {
      await supabase.from(table).update({ pwaInstalled: status }).eq('id', currentUser.id);
    }
  };

  useEffect(() => {
    if (currentUser && !isUserValid) {
      if (currentUser.isImpersonated) {
        showToast("Sesión de comercio expirada. Retornando...", "error");
        setView("core");
        setCurrentUser({ id: "arquitecto", role: "core" }); // Fallback before actual reset
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast("Tu cuenta ya no se encuentra en el sistema.", "error");
        logout();
      }
    }
  }, [currentUser, isUserValid, logout, setView, showToast, setCurrentUser]);

  const safeView = (!currentUser || !isUserValid) && protectedViews.includes(view) ? "landing" : view;

  if (isBooting || !isClient) {
    return (
      <div className="min-h-screen bg-[violet-900] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center">
          <img src="/kfs-loading.png" className="h-28 sm:h-32 w-auto animate-pulse mb-8 object-contain" alt="KFS OS" />
          <div className="w-12 h-12 border-4 border-[violet-600]/20 border-t-[violet-600] rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono mt-6">Loading core vectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[violet-900]">
      <Toast toast={toast} />

      {ghostTrapLocked && (
        <div className="fixed inset-0 bg-[#0B0104]/95 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A050A] border-2 border-red-500/30 rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 animate-pulse"></div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-950/50 border border-red-500/40 rounded-full flex items-center justify-center animate-bounce text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <Lock size={36} className="animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
              🚨 GHOST TRAP ACTIVATED 🚨
            </h2>
            <p className="text-red-400 font-mono text-xs uppercase tracking-widest mb-6">
              Auditoría Criptográfica en Curso
            </p>

            <div className="bg-black/55 border border-red-500/10 rounded-2xl p-6 mb-6 text-left font-mono text-xs text-red-300 space-y-3 leading-relaxed">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ TERMINAL ]</span>
                <span className="text-white font-bold">{currentUser?.name || "Vendedor Terminal"} ({currentUser?.role || "Terminal"})</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ ACCIÓN ]</span>
                <span className="text-red-500 font-black">RECHAZO SOSPECHOSO DE ORDEN ONLINE</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ PROTOCOLO ]</span>
                <span className="text-yellow-500 font-black">BLOQUEO ANTIFRAUDE INMEDIATO</span>
              </p>
              <p className="flex justify-between">
                <span>[ TIMESTAMP ]</span>
                <span className="text-white">{new Date().toLocaleString()}</span>
              </p>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Este terminal de ventas ha sido congelado. Se requiere el ingreso de la contraseña maestra del dueño o del arquitecto para continuar.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Master Password o PIN de Supervisor"
                  value={ghostPassword}
                  onChange={(e) => setGhostPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockGhostTrap()}
                  className="w-full bg-black/60 border-2 border-red-500/20 focus:border-red-500 rounded-xl px-5 py-4 text-center font-black tracking-widest text-white text-lg focus:outline-none focus:ring-0 placeholder:text-gray-600 transition-colors"
                />
                {ghostError && <p className="text-xs text-red-500 font-bold mt-2">{ghostError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/584141234567?text=ALERTA%20DE%20SEGURIDAD%20KFS%20OS:%20Se%20ha%20detonado%20el%20Protocolo%20Ghost%20Trap%20en%20el%20terminal%20de%20ventas.%20Operador:%20${currentUser?.name || "Vendedor"}.%20Acción:%20Rechazo%20de%20Orden.%20Favor%20auditar.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-4 rounded-xl font-black text-xs text-green-400 bg-green-950/20 border border-green-500/20 hover:bg-green-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  💬 Reportar a WhatsApp
                </a>

                <button
                  onClick={handleUnlockGhostTrap}
                  className="py-4 rounded-xl font-black text-xs text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-red-600/20"
                >
                  🔓 Desbloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {safeView === "landing" && <LandingPageView setView={setView} />}
      {safeView === "b2b-onboarding" && <B2BSelfOnboarding setView={setView} />}

      {safeView === "login" && (
        <LoginView
          handleLogin={handleLogin}
          registerClient={registerClient}
          registerPromotora={registerPromotora}
          db={db}
          setView={setView}
          currentUser={currentUser}
          logout={logout}
        />
      )}
      {safeView === "marketplace" && (
        <MarketplaceView
          db={db}
          submitOnlineOrder={submitOnlineOrder}
          formatUSD={formatUSD}
          logout={logout}
          currentUser={currentUser}
        />
      )}
      {safeView === "customer" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <CustomerDashboard
            db={db}
            currentUser={currentUser}
            logout={logout}
            setView={setView}
          />
        </AppEnforcer>
      )}
      {safeView === "core" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <CoreDashboard
            db={db}
            setDb={setDb}
            approvePromotora={approvePromotora}
            rejectPromotora={rejectPromotora}
            settlePromotoraEarnings={settlePromotoraEarnings}
            showToast={showToast}
            formatUSD={formatUSD}
            formatEUR={formatEUR}
            currentUser={currentUser}
            logout={logout}
            approveSubscription={approveSubscription}
          />
        </AppEnforcer>
      )}
      
      {/* Mock function to prevent build failure since it's missing from KFSContext */}
      {(() => {
        const registerVendedor = (data: any) => showToast("Función en desarrollo.", "error");
        return safeView === "promotora" && (
          <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
            <PromotoraDashboard
              db={db}
              setDb={setDb}
              currentUser={currentUser}
              registerClient={registerClient}
              upgradeToPremium={upgradeToPremium}
              settlePromotoraEarnings={settlePromotoraEarnings}
              formatUSD={formatUSD}
              formatEUR={formatEUR}
              logout={logout}
              requestPayout={requestPayout}
              registerVendedor={registerVendedor}
            />
          </AppEnforcer>
        );
      })()}
      
      {safeView === "client" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <ClientDashboard
            db={db}
            setDb={setDb}
            currentUser={currentUser}
            addProduct={addProduct}
            addExpense={addExpense}
            showToast={showToast}
            formatUSD={formatUSD}
            formatEUR={formatEUR}
            logout={logout}
            approveOrder={approveOrder}
            rejectOrder={rejectOrder}
            dispatchOrder={dispatchOrder}
            paySubscription={paySubscription}
            requestPayout={requestPayout}
            requestTopUp={requestTopUp}
          />
        </AppEnforcer>
      )}
      {safeView === "vendedor" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <VendedorDashboard
            db={db}
            setDb={setDb}
            currentUser={currentUser}
            addProduct={addProduct}
            processPurchase={processPurchase}
            showToast={showToast}
            formatUSD={formatUSD}
            logout={logout}
            approveOrder={approveOrder}
            rejectOrder={rejectOrder}
            generateZReport={generateZReport}
            registerCrmExpress={registerCrmExpress}
          />
        </AppEnforcer>
      )}
      {safeView === "rider" && (
        <AppEnforcer currentUser={currentUser} updatePwaStatus={updatePwaStatus}>
          <RiderDashboard
            db={db}
            currentUser={currentUser}
            logout={logout}
          />
        </AppEnforcer>
      )}
      {null}
    </div>
  );
}
