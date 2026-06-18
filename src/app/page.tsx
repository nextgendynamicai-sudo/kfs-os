"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera, Upload, ShoppingCart, TrendingUp, Users, DollarSign,
  LogOut, Shield, Package, Activity, Search, QrCode, Lock,
  ChevronRight, CheckCircle, CreditCard, Bell, X, Info,
  Store, Star, ChevronLeft, Clock, UserCheck, Palette,
  Zap, BookOpen, Printer, Smartphone, Settings, DownloadCloud, Terminal, Truck,
  Briefcase, FileText, Award, Check, ArrowUpRight, WifiOff, Gift, MapPin, UserPlus, LogIn, Eye, Database
} from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckoutModal } from "../components/CheckoutModal";
import { TopUpModal } from "../components/TopUpModal";
import { PayoutModal } from "../components/PayoutModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { UniversalWalletWidget } from "../components/UniversalWalletWidget";
import { ProfileAvatarEditor } from "../components/ProfileAvatarEditor";

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
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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
    <form onSubmit={(e) => { e.preventDefault(); if (acceptedToS) onRegister(formData, defaultReferralCode, 0.03); else alert("Debes aceptar los Términos de Servicio y Privacidad."); }} className={`space-y-3 ${standalone ? "text-white animate-fade-in" : "text-gray-800"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-[violet-600] border-[violet-600]/30" : "text-[violet-900] border-gray-200"}`}>Setup de Nuevo Comercio</h3>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[violet-900]/40 hover:bg-[violet-900]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1">Foto</span>
            </div>
          )}
        </label>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${standalone ? "text-gray-400" : "text-gray-500"}`}>Logo / Foto Comercio</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className={`relative w-full h-20 rounded-xl border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center transition-colors group ${standalone ? "bg-[violet-900]/40 hover:bg-[violet-900]/60" : "bg-gray-50 hover:bg-gray-100"}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className={`text-center transition-colors ${standalone ? "text-gray-400 group-hover:text-white" : "text-gray-500 group-hover:text-[violet-900]"}`}>
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1">Subir Cédula del Representante (KYC)</span>
            </div>
          )}
        </label>
      </div>

      <input required placeholder="Nombre Completo" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input required placeholder="Cédula / RIF" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, idCard: e.target.value })} />
      <input required placeholder="Nombre de la Empresa" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, company: e.target.value })} />
      <textarea required placeholder="Dirección Comercial" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, address: e.target.value })} />
      <input required type="number" placeholder="Facturación Promedio Diaria ($)" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, avgBilling: e.target.value })} />

      <div className="flex flex-col mb-2">
        <label className={`text-xs font-bold mb-2 uppercase tracking-widest ${standalone ? "text-gray-400" : "text-gray-500"}`}>Tarifa BOS (Comisión Kreatek)</label>
        <select required value={formData.kfsFeePercentage} onChange={e => setFormData({ ...formData, kfsFeePercentage: parseFloat(e.target.value) })} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all font-bold ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`}>
          <option value={0.03}>Plan Base (3%)</option>
          <option value={0.05}>Plan Estándar (5%)</option>
          <option value={0.10}>Plan Premium (10%)</option>
        </select>
      </div>

      <input required placeholder="Teléfono Personal" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
      <input required type="email" placeholder="Correo Electrónico" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input required type="password" placeholder="Crear Clave de Acceso" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all ${standalone ? "bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`} onChange={e => setFormData({ ...formData, password: e.target.value })} />

      <div className="flex items-start gap-2 pt-2 mb-2">
        <input type="checkbox" required checked={acceptedToS} onChange={(e) => setAcceptedToS(e.target.checked)} className="mt-1 cursor-pointer" />
        <span className={`text-[10px] leading-tight ${standalone ? "text-gray-400" : "text-gray-500"}`}>
          He leído y acepto los <strong className="text-[violet-600] cursor-pointer hover:underline">Términos de Servicio (ToS)</strong>. Entiendo que KFS cobra $6 mensuales por mantenimiento, y que Kreatek no asume responsabilidad financiera sobre el comercio frente al cliente final.
        </span>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl bg-gray-200/20 hover:bg-gray-200/30 text-white font-bold transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[violet-900] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer" style={{ backgroundColor: KREATEK_COLORS.bronze }}>Aprobar Setup</button>
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
    <form onSubmit={(e) => { e.preventDefault(); onRegister({ ...formData, referralCode: defaultReferralCode }); }} className="space-y-3 text-white animate-fade-in">
      <h3 className="text-lg font-black mb-4 border-b border-[violet-600]/30 pb-2 text-[violet-600]">Autogestión de Promotora</h3>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[violet-900]/40 hover:bg-[violet-900]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1">Foto</span>
            </div>
          )}
        </label>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Foto de Perfil</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-full h-20 rounded-xl border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[violet-900]/40 hover:bg-[violet-900]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1">Subir Foto de Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <input required placeholder="Nombre Completo" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <textarea required placeholder="Dirección Completa (KYC)" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, kycAddress: e.target.value })} />
      <input required type="email" placeholder="Correo Electrónico" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input required type="password" placeholder="Crear Clave de Acceso" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <input required placeholder="Binance ID (Ej: 184592...)" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, binanceId: e.target.value })} />
      <input required placeholder="Pago Móvil (Ej: 0412...)" className="w-full bg-[violet-900]/80 border border-[violet-600]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[violet-600] transition-all placeholder:text-gray-400" onChange={e => setFormData({ ...formData, pagoMovil: e.target.value })} />
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl bg-gray-200/20 hover:bg-gray-200/30 text-white font-bold transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[violet-900] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer" style={{ backgroundColor: KREATEK_COLORS.bronze }}>Registrar Perfil</button>
      </div>
    </form>
  );
};

const LandingPageView = ({ setView }: any) => {
  return (
    <div className="min-h-screen bg-[#EEF2F5] text-violet-900 font-sans overflow-x-hidden selection:bg-violet-600 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#EEF2F5]/80 backdrop-blur-xl border-b border-white/50 py-4 px-6 sm:px-10 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <KreatekLogo className="h-8 w-auto text-violet-600" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView("login")} className="text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors cursor-pointer pt-2">
            Soy Cliente
          </button>
          <button onClick={() => setView("login")} className="text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors cursor-pointer hidden sm:block pt-2">
            Soy Tienda / Promotora
          </button>
          <button onClick={() => setView("b2b-onboarding")} className="text-violet-600 text-sm font-bold hover:text-violet-800 transition-colors cursor-pointer hidden sm:block pt-2">
            Afiliar Comercio (B2B)
          </button>
          <button onClick={() => setView("login")} className="bg-violet-600 text-white px-5 py-2 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] cursor-pointer border-none">
            Acceder
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] -z-10"></div>

        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/50 text-xs font-bold text-violet-600 uppercase tracking-widest backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            El Ecosistema Financiero Definitivo
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Gobierna tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-500">
              Comercio Local
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Punto de venta físico (POS), E-Commerce integrado con descripciones optimizadas, proxy fiscal SENIAT y conciliación automatizada en una sola plataforma en la nube.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => setView("login")} className="bg-violet-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] cursor-pointer flex items-center justify-center gap-2 border-none">
              <Zap size={20} /> Empezar Ahora
            </button>
            <button onClick={() => {
              const el = document.getElementById("pricing");
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 px-8 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer flex items-center justify-center gap-2 border-none hover:scale-105">
              Ver Planes y Precios
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative z-10">
          <div className="bg-[#EEF2F5] rounded-[2rem] p-4 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none transition-transform duration-700 ease-out">
            <img src="/hero_cards.png" alt="Dashboard Preview" className="w-full h-auto rounded-xl object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-violet-900">Todo lo que necesitas, <span className="text-violet-600">sin licencias extra</span>.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Reemplazamos tu sistema viejo, el hardware obsoleto y las comisiones ocultas por un hub centralizado de alto rendimiento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <ShoppingCart className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">Flow Express (E-Commerce)</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Tu inventario físico se refleja automáticamente en tu vitrina e-commerce gratuita. Los clientes compran online en tiempo real.</p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Printer className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">Sincro-Shield Fiscal (SENIAT)</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Conéctate directamente a tu impresora fiscal en red local cumpliendo las normativas del SENIAT sin pagar licencias de intermediarios.</p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Smartphone className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">Auto-Conciliación SMS</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Evita fraudes de captures falsos. Nuestro conciliador en la nube lee el SMS del banco y aprueba las órdenes online de forma autónoma.</p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Lock className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">Bóveda Criptográfica</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Configura tus datos de Pago Móvil, Zinli, AirTM, Ubbi, Wally y Binance Pay. Tus compradores los verán directamente y podrán subir referencias y captures.</p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Zap className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">Instalación PWA Móvil</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Instala la aplicación en tu pantalla de inicio móvil con un icono nativo en un segundo, sin descargar tiendas App Store o Google Play.</p>
          </div>

          {/* Benefit 6 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8 rounded-[2rem] hover:scale-105 transition-transform group">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Users className="text-violet-600" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-violet-900">CRM & Fidelización Express</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Registra compras vinculando la cédula del cliente (escaneo manual o cámara), otorga puntos KFS y premia su fidelidad.</p>
          </div>
        </div>
      </section>

      {/* Pioneer Banner Section */}
      <section id="pricing" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <PioneerOfferBanner />

        <div className="text-center mt-16 mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-violet-900 tracking-tighter mb-6">Planes Escalamiento</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Elige el ecosistema KFS que se adapte al flujo de tu negocio o aprovecha la tasa Pionero arriba.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Plan 1 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-105 transition-transform relative">
            <div>
              <h3 className="text-2xl font-black text-violet-900">Flow Velocity</h3>
              <p className="text-sm text-gray-500 mt-2">Perfecto para negocios pequeños empezando a digitalizarse.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-violet-900">3%</span>
                <span className="text-sm text-gray-500 block mt-1">Por Venta</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> POS Offline/Online</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Tienda PWA Personalizada</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Control de 1 Caja Múltiple</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Cierre Z Básico</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-white text-violet-600 font-bold py-4 rounded-xl mt-8 cursor-pointer transition-colors shadow-sm hover:bg-gray-50 border-none">Empezar</button>
          </div>

          {/* Plan 2 (Popular) */}
          <div className="bg-gradient-to-br from-[#EEF2F5] to-violet-50 shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] border-2 border-violet-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-105 transition-transform relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">Más Popular</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-violet-900">Flow Matrix AI</h3>
              <p className="text-sm text-gray-500 mt-2">El motor completo para escalar y fidelizar clientes en piloto automático.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-violet-900">5%</span>
                <span className="text-sm text-gray-500 block mt-1">Por Venta + $3 USD/mes Suscripción Nube</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Todo lo de Flow Velocity</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Auto-Conciliación SMS Integrada</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> CRM & Vales de Crédito (3 POS)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> **Marketing AI**: Sugerencias de descripciones</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> **Flujos cada 4 días**: Ofertas planificadas</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Generación de Posts listos para Ads</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-violet-600 text-white shadow-[0_10px_20px_rgba(139,92,246,0.3)] font-black py-4 rounded-xl mt-8 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform border-none">Suscribirme</button>
          </div>

          {/* Plan 3 */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-105 transition-transform relative">
            <div>
              <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase block w-max mb-4">Líder</span>
              <h3 className="text-2xl font-black text-violet-900">Flow Monopoly OS</h3>
              <p className="text-sm text-gray-500 mt-2">El ecosistema financiero corporativo total para grandes franquicias.</p>

              <div className="my-8">
                <span className="text-5xl font-black text-violet-900">10%</span>
                <span className="text-sm text-gray-500 block mt-1">Por Venta + $6 USD/mes Suscripción Nube</span>
              </div>

              <ul className="space-y-3 pt-6 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Todo lo de Flow Matrix AI</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> POS ilimitados + SENIAT Proxy PnP</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> **Presupuesto Ads Directo**: Incluido en fee</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> **Omnicanalidad**: Ads en IG, FB y WhatsApp</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> IA para buscar clientes en redes</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-violet-600" /> Diseños y Copys de contenido automatizados</li>
              </ul>
            </div>
            <button onClick={() => setView("login")} className="w-full bg-white text-violet-600 font-bold py-4 rounded-xl mt-8 cursor-pointer transition-colors shadow-sm hover:bg-gray-50 border-none">Empezar</button>
          </div>
        </div>
      </section>

      {/* AI Deep Dive Section */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] rounded-[3rem]">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[violet-600]/10 border border-[violet-600]/20 text-xs font-black text-[violet-600] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[violet-600] animate-pulse"></span>
            Inteligencia Artificial Proactiva
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Gemini Flash al Servicio de tus Ventas
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            No es un chatbot pasivo. Es un agente inteligente que trabaja en segundo plano para vender de forma autónoma basándose en datos reales de tus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Outreach */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-[violet-600]/30 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h4 className="font-black text-xl text-white mb-3">Outreach Automatizado (Cada 4 Días)</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              El motor de KFS OS audita los clientes inactivos. Gemini Flash analiza el historial de compras del cliente y las ofertas planificadas por tus vendedores para redactar mensajes promocionales de WhatsApp Business hiper-personalizados.
            </p>
            <p className="text-xs text-gray-500 mt-4 italic">
              *Nota: KFS cubre el costo de la IA. El envío por WhatsApp Cloud API (Meta) tiene un costo externo de aprox. $0.05 por conversación iniciado por el comercio (recargable en tu balance KFS).
            </p>
          </div>

          {/* Card 2: Copywriting Optimizer */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-[violet-600]/30 transition-colors">
            <div className="w-12 h-12 bg-[violet-600]/20 rounded-xl flex items-center justify-center mb-6">
              <ShoppingCart className="text-[violet-600]" size={24} />
            </div>
            <h4 className="font-black text-xl text-white mb-3">Optimización del Marketplace</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gemini audita el catálogo en vivo. Si detecta productos con descripciones incompletas o sin gancho comercial, redacta propuestas de copywriting optimizadas para SEO y conversiones. Los comerciantes pueden aplicarlas en su catálogo con un solo clic.
            </p>
          </div>

          {/* Card 3: Social Media Lead Hunting */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-[violet-600]/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-green-400" size={24} />
            </div>
            <h4 className="font-black text-xl text-white mb-3">Buscador de Clientes en Redes</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Un scraper inteligente conectado a Gemini rastrea menciones públicas en tu ciudad de usuarios buscando recomendaciones de compra en redes sociales. La IA pre-califica el lead y te muestra la oportunidad directamente en el panel de control.
            </p>
          </div>
        </div>
      </section>

      {/* Contract, Setup and Promotoras Details */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[violet-600]/10 border border-[violet-600]/20 text-xs font-black text-[violet-600] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[violet-600] animate-pulse"></span>
            Estructura Financiera y de Afiliación
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Transparencia de Costos e Incentivos
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            El modelo de Kreatek elimina licencias de software complejas y las sustituye por comisiones claras por uso y una red de incentivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Card 1: Setup Fee */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-white mb-2">Cuota de Setup (Instalación)</h4>
            <div className="text-4xl font-black text-[violet-600] my-4">$75 USD <span className="text-xs text-gray-400 font-normal">pago único</span></div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Cubre la provisión del nodo en Supabase, el aprovisionamiento del proxy fiscal, la configuración del catálogo digital inicial y la asignación del soporte local.
            </p>
            <div className="border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-gray-300 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-400 mt-1 font-bold">
                La Promotora que afilia el comercio recibe el 50% ($37.50 USD) de esta cuota de inmediato.
              </p>
            </div>
          </div>

          {/* Card 2: Cloud Maintenance */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-white mb-2">Mantenimiento Mensual Nube</h4>
            <div className="text-4xl font-black text-[violet-600] my-4">$6 USD <span className="text-xs text-gray-400 font-normal">al mes</span></div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Cubre el hosting seguro SSL en Vercel, almacenamiento continuo de bases de datos, actualizaciones de seguridad y el conciliador automático de SMS del banco.
            </p>
            <div className="border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-gray-300 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-400 mt-1 font-bold">
                La Promotora recibe el 50% ($3.00 USD) de forma fija mensual de por vida mientras el comercio esté activo.
              </p>
            </div>
          </div>

          {/* Card 3: Royalties */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
            <h4 className="font-black text-lg text-white mb-2">Regalías de Venta (Comisiones)</h4>
            <div className="text-4xl font-black text-[violet-600] my-4">3% / 5% / 10% <span className="text-xs text-gray-400 font-normal">por venta real</span></div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              KFS no te cobra licencias de software fijas si no vendes. La comisión se descuenta automáticamente por venta confirmada en caja POS o Marketplace online.
            </p>
            <div className="border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-gray-300 block">Distribución de Red (Split):</span>
              <p className="text-xs text-green-400 mt-1 font-bold">
                La Promotora recibe el 20% de las regalías de KFS de por vida sobre cada artículo vendido por el comercio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kreatek / Value Proposition Section */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-tr from-[#0D1530]/50 to-[#141E3A]/20 rounded-[3rem]">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[violet-600]/10 border border-[violet-600]/20 text-xs font-black text-[violet-600] uppercase tracking-widest">
            ¿Por qué Kreatek Flow Systems?
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            La Elección Inteligente para Comercios y Promotoras
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Eliminamos los altos costos de software y comisiones ocultas del retail tradicional, reemplazándolos con un sistema de incentivos donde todos ganan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Business Value Proposition */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between hover:border-[violet-600]/20 transition-all">
            <div className="space-y-6">
              <span className="text-[violet-600] text-xs font-black uppercase tracking-widest block">Para Dueños de Negocio</span>
              <h3 className="text-3xl font-black text-white">Simplifica tu operación y reduce tus gastos al mínimo</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                KFS OS unifica tu tienda física y e-commerce bajo un mismo motor lógico. Olvídate de pagar suscripciones separadas de inventario, pasarelas de pago externas y licencias para conectar impresoras fiscales.
              </p>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <h4 className="font-bold text-[violet-600] text-sm uppercase tracking-wider">Ahorro Garantizado:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>Ahorro en Hardware:</strong> Usa cualquier smartphone o tablet como POS físico ($0 USD en terminales dedicados).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>Ahorro en Licencias:</strong> E-commerce e inventario en tiempo real unificados sin cargos adicionales de software.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>Ahorro Fiscal:</strong> Sincro-Shield Fiscal directo a tu impresora sin pagar intermediarios.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
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
                className="w-full sm:w-auto bg-[violet-600] text-[violet-900] px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-lg cursor-pointer"
              >
                Registrar mi Comercio (Setup)
              </button>
            </div>
          </div>

          {/* Promotoras Value Proposition */}
          <div className="bg-[violet-900] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between hover:border-[violet-600]/20 transition-all relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[violet-600]/5 rounded-full blur-[80px] -z-10"></div>

            <div className="space-y-6">
              <span className="text-[violet-600] text-xs font-black uppercase tracking-widest block">Para Promotoras de Expansión</span>
              <h3 className="text-3xl font-black text-white">Construye una fuente de ingresos pasivos de por vida</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No vendes un software convencional; afilias comercios al hardware transaccional más avanzado de la región. Trabaja a tu propio ritmo buscando tiendas locales y cobrando comisiones recurrentes.
              </p>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <h4 className="font-bold text-[violet-600] text-sm uppercase tracking-wider">Tus Beneficios y Labores:</h4>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>50% del Setup ($37.50 USD):</strong> Cobro inmediato en tu panel por cada comercio nuevo que instales y configures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>50% del Mantenimiento ($3.00 USD):</strong> Ingreso pasivo mensual constante por cada comercio activo en la nube.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>20% de las Regalías de Caja:</strong> Ganancia permanente sobre el fee de cada artículo que venda el comercio de por vida.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
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
                className="w-full sm:w-auto border border-[violet-600] text-[violet-600] hover:bg-[violet-600]/5 px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
              >
                Sé Promotora de Kreatek Flow Systems OS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Process / Steps Section */}

      <section id="process" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Proceso de Activación Rápida</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Pon en marcha tu tienda física y canal digital e-commerce en solo 4 pasos sencillos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] relative">
            <span className="text-6xl font-black text-[violet-600]/20 absolute right-6 top-6">01</span>
            <h4 className="font-black text-lg text-white mb-2">Registro de Cuenta</h4>
            <p className="text-sm text-gray-400">Regístrate en menos de un minuto como dueño del comercio e ingresa los detalles básicos.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] relative">
            <span className="text-6xl font-black text-[violet-600]/20 absolute right-6 top-6">02</span>
            <h4 className="font-black text-lg text-white mb-2">Configurar Bóveda</h4>
            <p className="text-sm text-gray-400">Establece tus cuentas de Pago Móvil, Zinli, AirTM, Ubbi, Wally y Binance Pay en la bóveda cifrada en tu panel.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] relative">
            <span className="text-6xl font-black text-[violet-600]/20 absolute right-6 top-6">03</span>
            <h4 className="font-black text-lg text-white mb-2">Subir Productos</h4>
            <p className="text-sm text-gray-400">Sube fotos de tus productos, ponles precio, stock y una descripción detallada en tu inventario.</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] relative">
            <span className="text-6xl font-black text-[violet-600]/20 absolute right-6 top-6">04</span>
            <h4 className="font-black text-lg text-white mb-2">Cobrar y Vender</h4>
            <p className="text-sm text-gray-400">Publica el enlace de tu Marketplace o usa la caja POS física. Valida captures y emite facturas.</p>
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
};

// Login View
const LoginView = ({ handleLogin, registerClient, registerPromotora, db, setView, currentUser, logout }: any) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRole = searchParams.get('role');
      if (urlRole) return urlRole;
      
      const saved = localStorage.getItem("kfs_pending_tab");
      if (saved) {
        localStorage.removeItem("kfs_pending_tab");
        return saved;
      }
    }
    return "marketplace";
  });
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('ref') || "";
    }
    return "";
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF2F5] font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-8 animate-fade-in">
          {currentUser ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 bg-violet-100 rounded-full border border-violet-600/20 flex items-center justify-center mx-auto shadow-inner overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
                ) : (
                  <span className="text-violet-600 font-black text-xl">{currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}</span>
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-violet-900">Sesión Activa Detectada</h2>
                <p className="text-sm text-gray-500">
                  Ya has iniciado sesión como <strong className="text-violet-900">{currentUser.name || currentUser.company}</strong> (<span className="capitalize">{currentUser.role}</span>).
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const role = currentUser.role;
                    if (role === "dueño") setView("client");
                    else if (role === "vendedor") setView("vendedor");
                    else if (role === "promotora") setView("promotora");
                    else if (role === "core") setView("core");
                    else if (role === "customer") setView("customer");
                    else if (role === "rider") setView("rider");
                    else setView("landing");
                  }}
                  className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none text-white bg-violet-600 cursor-pointer text-sm"
                >
                  Ir a mi Panel de Control <ChevronRight size={18} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-3.5 rounded-xl font-bold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-sm"
                >
                  Cerrar Sesión (Cambiar Cuenta)
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Shield className="text-violet-600" size={32} />
                </div>
                <h1 className="text-2xl font-black text-violet-900 tracking-tight">KFS Core <span className="text-violet-600">Access</span></h1>
                <p className="text-sm text-gray-500 mt-2 font-mono">Seleccione su vector de entrada</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button onClick={() => setActiveTab("marketplace")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "marketplace" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Flow Exp.</button>
                <button onClick={() => setActiveTab("customer")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "customer" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Cliente</button>
                <button onClick={() => setActiveTab("dueño")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "dueño" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Dueño</button>
                <button onClick={() => setActiveTab("vendedor")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "vendedor" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Vendedor</button>
                <button onClick={() => setActiveTab("promotora")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "promotora" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Promotora</button>
                <button onClick={() => setActiveTab("rider")} className={`flex-1 min-w-[80px] py-2.5 px-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${activeTab === "rider" ? "bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : "bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 hover:text-violet-800"}`}>Delivery</button>
                <button onClick={() => setActiveTab("core")} className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer ${activeTab === "core" ? "bg-slate-800 text-white shadow-[0_5px_15px_rgba(30,41,59,0.3)]" : "bg-white shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-slate-500 hover:text-slate-800"}`}>Arquitecto</button>
              </div>

              {activeTab === "marketplace" && (
                <button onClick={() => handleLogin("marketplace", "")} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none text-white bg-violet-600 cursor-pointer">
                  <ShoppingCart size={20} /> Entrar a Flow Express
                </button>
              )}

              {(activeTab === "core" || activeTab === "promotora" || activeTab === "dueño" || activeTab === "vendedor" || activeTab === "customer" || activeTab === "rider") && (
                <div className="space-y-4">
                  {(activeTab === "dueño" || activeTab === "vendedor" || activeTab === "promotora" || activeTab === "customer" || activeTab === "rider") && (
                    <input type="text" placeholder={activeTab === "customer" ? "Número de Teléfono (Ej: +584141234567)" : "Correo Electrónico de Usuario"} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-4 text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
                  )}
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-violet-400" size={20} />
                    <input type="password" placeholder="Clave de Seguridad" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-12 pr-4 py-4 text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
                  </div>
                  <button onClick={() => handleLogin(activeTab, password, email)} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none text-white bg-violet-600 cursor-pointer">
                    Entrar a mi Panel <ChevronRight size={20} />
                  </button>
                  {activeTab === "dueño" && (
                    <button onClick={() => setActiveTab("register")} className="w-full text-center text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Comercio nuevo? Iniciar Setup
                    </button>
                  )}
                  {activeTab === "promotora" && (
                    <button onClick={() => setActiveTab("registerPromo")} className="w-full text-center text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nueva Promotora? Registrarse
                    </button>
                  )}
                  {activeTab === "customer" && (
                    <button onClick={() => setActiveTab("registerCustomer")} className="w-full text-center text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nuevo Cliente? Crea tu cuenta
                    </button>
                  )}
                  {activeTab === "rider" && (
                    <button onClick={() => setActiveTab("registerRider")} className="w-full text-center text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors mt-4 cursor-pointer border-none bg-transparent">
                      ¿Nuevo Rider? Regístrate como Delivery
                    </button>
                  )}
                </div>
              )}

              {activeTab === "register" && <RegisterClientForm onRegister={registerClient} onCancel={() => setActiveTab("dueño")} defaultReferralCode={referralCode} />}
              {activeTab === "registerPromo" && <RegisterPromotoraForm onRegister={registerPromotora} onCancel={() => setActiveTab("promotora")} defaultReferralCode={referralCode} />}
              {activeTab === "registerCustomer" && <RegisterCustomerForm onCancel={() => setActiveTab("customer")} defaultReferralCode={referralCode} />}
              {activeTab === "registerRider" && <RegisterRiderForm onCancel={() => setActiveTab("rider")} defaultReferralCode={referralCode} />}
            </>
          )}

          <div className="mt-8 pt-6 border-t border-violet-200 text-center">
            <button onClick={() => setView("landing")} className="text-sm font-black text-violet-600 hover:text-violet-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto border-none bg-transparent">
              <Star size={16} /> Ver Landing de Ventas - KFS OS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

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
      <input required type="text" placeholder="Nombre y Apellido" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[violet-600] transition-all" />

      <div className="flex gap-2">
        <select
          value={phonePrefix}
          onChange={e => setPhonePrefix(e.target.value)}
          className="bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[violet-600] text-sm cursor-pointer"
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
        <input required type="text" placeholder="Número Telefónico (Ej: 4141234567)" value={phoneBody} onChange={e => setPhoneBody(e.target.value)} className="flex-1 bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[violet-600] transition-all" />
      </div>

      <div className="flex gap-4 mb-2">
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[violet-900]/40 hover:bg-[violet-900]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycPhoto)} required />
          {kycPhoto ? (
            <img src={kycPhoto} className="w-full h-full object-cover opacity-80" alt="Selfie" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1">Selfie (Obligatorio)</span>
            </div>
          )}
        </label>
        <label className="flex-1 relative h-24 rounded-xl border-2 border-dashed border-[violet-600]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[violet-900]/40 hover:bg-[violet-900]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycCedula)} required />
          {kycCedula ? (
            <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <FileText size={20} className="mx-auto" />
              <span className="text-[10px] font-bold block mt-1">Cédula (Obligatorio)</span>
            </div>
          )}
        </label>
      </div>

      <textarea required placeholder="Dirección Residencial Completa" value={kycAddress} onChange={e => setKycAddress(e.target.value)} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[violet-600] transition-all text-sm h-20 resize-none" />

      <input required type="password" placeholder="Crear Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[violet-600] transition-all" />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-white/20 text-gray-300 font-bold hover:bg-white/5 transition-all">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-[violet-600] text-[violet-900] font-black hover:scale-[1.02] active:scale-95 transition-all">Crear Cuenta</button>
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
    <label className={`relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${uploaded ? "border-green-500/60 bg-green-500/10" : "border-[violet-600]/30 bg-[violet-900]/40 hover:bg-[violet-900]/60"}`}>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleDocUpload(e, field, fileKey)} />
      <span className="text-3xl">{uploaded ? "✅" : icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-wider text-center ${uploaded ? "text-green-400" : "text-gray-400 group-hover:text-white"}`}>
        {uploading[fileKey] ? "Subiendo..." : uploaded ? "¡Cargado!" : label}
      </span>
      {uploaded && <span className="text-[8px] text-green-400 font-mono">Toca para cambiar</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in w-full pb-4">
      <div className="text-center pb-2 border-b border-[violet-600]/20">
        <div className="w-12 h-12 bg-[violet-600]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[violet-600]/30">
          <Truck className="text-[violet-600]" size={24} />
        </div>
        <h3 className="text-base font-black text-[violet-600] uppercase tracking-wider">Registro Rider Delivery</h3>
        <p className="text-[10px] text-gray-400 mt-1">Sujeto a aprobación del Arquitecto KFS</p>
      </div>

      {/* Personal Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Nombre Completo" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
        <input required type="tel" placeholder="Teléfono (Ej: 04141234567)" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
        <input required type="email" placeholder="Correo Electrónico" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
        <input required type="password" placeholder="Crear Contraseña" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
      </div>

      {/* Document Uploads */}
      <div className="space-y-1 mt-2">
        <p className="text-[10px] font-black text-[violet-600] uppercase tracking-widest">Documentos Requeridos</p>
        <p className="text-[9px] text-gray-500">Sube fotos directas desde tu galería o cámara</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <DocUploadField label="Cédula" icon="🪪" field="cedulaImg" fileKey="cedula" uploaded={!!formData.cedulaImg} />
        <DocUploadField label="Cert. Médico" icon="🏥" field="medCertImg" fileKey="med" uploaded={!!formData.medCertImg} />
        <DocUploadField label="Licencia" icon="🚗" field="licenseImg" fileKey="license" uploaded={!!formData.licenseImg} />
      </div>

      {/* Pago Móvil */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[violet-600] uppercase tracking-widest">Pago Móvil (Cobro de Delivery $2)</p>
        <p className="text-[9px] text-gray-500">Los clientes te pagarán directamente aquí</p>
      </div>
      <select required value={formData.pagoMovil.banco} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, banco: e.target.value } }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all">
        <option value="">— Selecciona Banco —</option>
        {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input required type="tel" placeholder="Teléfono PM (04xx...)" value={formData.pagoMovil.telefono} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, telefono: e.target.value } }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
        <input required placeholder="Cédula Titular" value={formData.pagoMovil.cedula} onChange={e => setFormData(p => ({ ...p, pagoMovil: { ...p.pagoMovil, cedula: e.target.value } }))} className="w-full bg-[violet-900]/80 border border-[violet-600]/30 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[violet-600] transition-all" />
      </div>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3">
        <p className="text-[10px] text-amber-300 font-bold leading-relaxed">⚠️ Tu solicitud será revisada por el Arquitecto KFS. Recibirás notificación de aprobación antes de poder operar.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-white/20 text-gray-300 font-bold hover:bg-white/5 transition-all text-sm cursor-pointer">Atrás</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl bg-[violet-600] text-[violet-900] font-black hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2">
          <Truck size={16} /> Enviar Solicitud
        </button>
      </div>
    </form>
  );
};

const CustomerDashboard = ({ db, currentUser, logout, setView }: any) => {
  const { formatUSD, registerCandidate, showToast, markNotificationsAsRead, requestTopUp, claimFlowMaster } = useKFS() as any;
  const [subTab, setSubTab] = useState("profile"); // profile | jobs
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const { transferP2P } = useP2PTransfer();
  const [p2pRecipient, setP2pRecipient] = useState("");
  const [p2pAmount, setP2pAmount] = useState("");
  const [p2pType, setP2pType] = useState<"real_balance" | "k_points">("real_balance");

  const handleP2PTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(p2pAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("Por favor ingresa un monto válido.", "error");
      return;
    }
    const success = transferP2P(currentUser.phone, p2pRecipient, amountNum, p2pType);
    if (success) {
      setP2pRecipient("");
      setP2pAmount("");
    }
  };

  if (!currentUser) return null;

  // Aggregate CRM points
  const crmEntry = db.crm?.find((c: any) => c.phone === currentUser.phone);
  const totalPoints = crmEntry?.kfsPoints || 0;

  // Aggregate transactions by store
  const userTransactions = db.transactions?.filter((tx: any) => tx.customerPhone === currentUser.phone) || [];
  const historyByStore = userTransactions.reduce((acc: any, tx: any) => {
    if (!acc[tx.clientId]) {
      acc[tx.clientId] = {
        clientId: tx.clientId,
        purchasesCount: 0,
        totalSpent: 0
      };
    }
    acc[tx.clientId].purchasesCount += 1;
    acc[tx.clientId].totalSpent += tx.amountUSD;
    return acc;
  }, {});
  const historyEntries = Object.values(historyByStore) as any[];

  const activeOrders = db.orders?.filter((o: any) => o.customerPhone === currentUser.phone && o.status === 'pending') || [];
  const logisticsTxs = db.transactions?.filter((tx: any) => tx.customerPhone === currentUser.phone && (tx.shippingStatus === 'pending' || tx.shippingStatus === 'dispatched')) || [];

  // FlowMaster Gamification Logic
  const txCount = userTransactions.length;
  const uniqueMerchants = historyEntries.length;
  const volumeUSD = userTransactions.reduce((acc: number, tx: any) => acc + (tx.amountUSD || 0), 0);
  const volumeKPoints = volumeUSD * 1000;
  
  const meetsFlowMaster = txCount >= 10 && uniqueMerchants >= 4 && volumeKPoints >= 50000;

  // Candidate Form States
  const currentCandidate = db.candidates?.find((c: any) => c.phone === currentUser.phone);
  const unreadNotifsCount = currentCandidate?.notifications?.filter((n: any) => !n.read).length || 0;

  const [bio, setBio] = useState(currentCandidate?.bio || "");
  const [email, setEmail] = useState(currentCandidate?.email || "");
  const [selectedRole, setSelectedRole] = useState(currentCandidate?.role || "Cajero");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentCandidate?.skills || []);
  const [answers, setAnswers] = useState<Record<string, string>>(currentCandidate?.answers || {
    availability: "full-time",
    location: "Caracas - Centro",
    experienceYears: "1-3",
    hasVehicle: "no"
  });
  const [isActive, setIsActive] = useState(currentCandidate ? (currentCandidate.active !== false) : true);

  // CV Upload States
  const [cvFile, setCvFile] = useState(currentCandidate?.cvFile || "");
  const [cvFileType, setCvFileType] = useState(currentCandidate?.cvFileType || "");
  const [cvFileName, setCvFileName] = useState(currentCandidate?.cvFileName || "");

  // Registration Payment $1 USD States
  const [regRefNum, setRegRefNum] = useState("");
  const [regScreenshot, setRegScreenshot] = useState("");

  const [useKfsCvBuilder, setUseKfsCvBuilder] = useState(currentCandidate?.useKfsCvBuilder || false);
  const [showCvModal, setShowCvModal] = useState(false);

  const availableSkills = [
    "Cuadre de caja", "Uso de POS", "Atención al cliente",
    "Lector de código de barras", "Control de inventario",
    "Ventas retail", "Facturación fiscal", "Manejo de delivery"
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio.trim() || !email.trim()) {
      showToast("Por favor completa los campos obligatorios (Correo y Presentación).", "error");
      return;
    }
    if (!useKfsCvBuilder && !cvFile) {
      showToast("Debe cargar su Currículum Vitae en PDF/Imagen o activar el CV Digital KFS.", "error");
      return;
    }

    const isPaid = currentCandidate?.registrationPaymentStatus === "approved";
    let nextStatus = currentCandidate?.registrationPaymentStatus || "unpaid";
    let paymentRef = currentCandidate?.registrationPaymentRef || "";
    let paymentProof = currentCandidate?.registrationPaymentProof || "";

    if (!isPaid) {
      if (!regRefNum.trim()) {
        showToast("Por favor ingrese la referencia del pago de $1 USD.", "error");
        return;
      }
      nextStatus = "pending_approval";
      paymentRef = regRefNum;
      paymentProof = regScreenshot;
    }

    registerCandidate({
      id: currentCandidate?.id || `cand_${Date.now()}`,
      phone: currentUser.phone,
      name: currentUser.name,
      email,
      bio,
      role: selectedRole,
      skills: selectedSkills,
      answers,
      status: currentCandidate?.status || "pending",
      active: isActive,
      cvFile: useKfsCvBuilder ? "" : cvFile,
      cvFileType: useKfsCvBuilder ? "" : cvFileType,
      cvFileName: useKfsCvBuilder ? "" : cvFileName,
      useKfsCvBuilder,
      registrationPaymentStatus: nextStatus,
      registrationPaymentRef: paymentRef,
      registrationPaymentProof: paymentProof,
      hiringState: currentCandidate?.hiringState || "available",
      interviewingClientId: currentCandidate?.interviewingClientId || null
    });
  };

  return (
    <div className="min-h-screen bg-[#EEF2F5] text-[violet-900] font-sans pb-24 relative">
      {/* Wavy Header */}
      <div className="bg-gradient-to-br from-[violet-900] to-[#1a2b5e] rounded-b-[3rem] shadow-[0_10px_30px_rgba(10,17,40,0.3)] pt-6 pb-12 px-6 text-white relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-[violet-600]"><UserCheck size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS Customer</h1>
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
          <div className="w-16 h-16 bg-[violet-600] rounded-full flex items-center justify-center text-[violet-900] font-black text-2xl flex-shrink-0 shadow-lg border-4 border-[violet-900] relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{currentUser.name}</h2>
            <p className="text-[violet-600] font-mono text-xs mt-1 bg-[violet-900] inline-block px-2 py-0.5 rounded-md">{currentUser.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 space-y-6 animate-fade-in">
        <OracleInsightCard role="customer" data={{ walletBalance: currentUser.walletUSD || 0 }} />

        {subTab === "profile" ? (
          <>
            {/* Universal Wallet Widget */}
            <UniversalWalletWidget currentUser={currentUser} formatUSD={formatUSD}>
              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4 mt-2">
                <div>
                  <h4 className="text-sm font-black text-gray-200">Recarga Express</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Acredita saldo Fiat al instante.</p>
                </div>
                <button
                  onClick={() => { setTopUpAmount("5"); setIsTopUpOpen(true); }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer border-none shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                >
                  Recargar Ahora
                </button>
              </div>
            </UniversalWalletWidget>

            {/* FlowMaster Gamification Tracker */}
            <div className="bg-gradient-to-tr from-[#1E293B] to-[#0F172A] border border-slate-700/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shadow-inner">
                  <Star className={currentUser.isFlowMaster ? "text-yellow-400" : "text-slate-400"} size={20} />
                </div>
                <div>
                  <h4 className="text-white font-black text-sm">Rango FlowMaster</h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">{currentUser.isFlowMaster ? "¡Eres FlowMaster! AOF exento." : "Completa los hitos para exentar el AOF y subir de rango."}</p>
                </div>
              </div>

              {!currentUser.isFlowMaster && (
                <div className="space-y-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-2.5 flex justify-between items-center border border-slate-700">
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">10 Transacciones</span>
                    <span className={`text-xs font-black ${txCount >= 10 ? 'text-emerald-400' : 'text-slate-500'}`}>{txCount}/10</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5 flex justify-between items-center border border-slate-700">
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">4 Comercios Distintos</span>
                    <span className={`text-xs font-black ${uniqueMerchants >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>{uniqueMerchants}/4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5 flex justify-between items-center border border-slate-700">
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">50K Puntos ($50) Movidos</span>
                    <span className={`text-xs font-black ${volumeKPoints >= 50000 ? 'text-emerald-400' : 'text-slate-500'}`}>{volumeKPoints.toLocaleString()}/50,000 KP</span>
                  </div>
                </div>
              )}

              {!currentUser.isFlowMaster && meetsFlowMaster && (
                <button
                  onClick={() => claimFlowMaster(currentUser.id)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black py-3 rounded-xl transition-all shadow-[0_5px_15px_rgba(234,179,8,0.3)] animate-bounce"
                >
                  ¡Reclamar Rango FlowMaster!
                </button>
              )}
            </div>

            <TopUpModal
              isOpen={isTopUpOpen}
              onClose={() => setIsTopUpOpen(false)}
              amount={topUpAmount}
              setAmount={setTopUpAmount}
              onSubmit={(amount: number, ref: string, img: string) => {
                requestTopUp(currentUser.id, 'customer', amount, ref, img);
              }}
              userType="customer"
            />

            {/* P2P Transfer Form */}
            <div className="bg-gradient-to-tr from-[violet-900]/85 to-[#141E3A]/85 backdrop-blur-xl border border-[violet-600]/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5">
              <div>
                <h3 className="text-xl font-black text-[violet-600] flex items-center gap-2">
                  <Users size={24} /> Transferencias P2P Instantáneas
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Envía Saldo Real o K-Points a cualquier contacto registrado en la red KFS OS al instante.
                </p>
              </div>

              {/* Bono Viral Embajador — QR Real Escaneable */}
              <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-500/40 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 bg-white rounded-xl p-1.5 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex-shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id)}`}
                    alt="QR Referido"
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Gift size={18} className="text-emerald-400" />
                    <h4 className="font-black text-white text-base">Bono Viral Embajador</h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    Escanea o comparte tu QR. Cuando tu referido haga su primera recarga de <strong className="text-emerald-400">$5.00+</strong>, recibirás <strong className="text-emerald-400">+500 K-Points ($0.50)</strong> automáticos.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-mono bg-black/60 border border-emerald-500/30 px-2 py-1 rounded-lg text-emerald-300 text-xs">ID: {currentUser.id}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); showToast('📋 Enlace copiado.', 'success'); }}
                      className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      📋 Copiar Enlace
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleP2PTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Destinatario (Teléfono o Nombre)</label>
                    <input
                      type="text"
                      placeholder="Ej: 04121234567 o Nombre"
                      value={p2pRecipient}
                      onChange={(e) => setP2pRecipient(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[violet-600] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Monto a Enviar</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ej: 5.00 o 500"
                      value={p2pAmount}
                      onChange={(e) => setP2pAmount(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[violet-600] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setP2pType("real_balance")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p2pType === "real_balance" ? "bg-[violet-600] text-[violet-900] border-[violet-600]" : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"}`}
                    >
                      Saldo Real (USD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setP2pType("k_points")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p2pType === "k_points" ? "bg-[violet-600] text-[violet-900] border-[violet-600]" : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"}`}
                    >
                      K-Points
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-white/10 hover:bg-[violet-600] hover:text-[violet-900] border border-white/10 rounded-xl px-6 py-2.5 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md self-end sm:self-auto font-sans"
                  >
                    Transferir Balance <ArrowUpRight size={14} />
                  </button>
                </div>
              </form>
            </div>

            {/* Overdrive Digital Catalog */}
            <FlowExpressCatalog currentUser={currentUser} formatUSD={formatUSD} />

            {/* Logistics Tracking */}
            {(activeOrders.length > 0 || logisticsTxs.length > 0) && (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl">
                <h3 className="text-xl font-black mb-6 text-[violet-600] flex items-center gap-2"><Truck size={24} /> Rastreo de Envíos Activos</h3>
                <div className="space-y-4">
                  {activeOrders.map((o: any) => {
                    const p = db.products.find((prod: any) => prod.id === o.productId);
                    return (
                      <div key={o.id} className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-orange-400">{p?.name || "Producto Online"}</h4>
                          <p className="text-xs text-orange-200/70 mt-1">Ref: {o.paymentReference} | Pendiente de Aprobación por el Vendedor</p>
                        </div>
                        <Clock className="text-orange-400 animate-pulse" />
                      </div>
                    );
                  })}
                  {logisticsTxs.map((tx: any) => {
                    const p = db.products.find((prod: any) => prod.id === tx.productId);
                    const isDispatched = tx.shippingStatus === 'dispatched';
                    const isPickedUp = tx.shippingStatus === 'picked_up';
                    const isDelivered = tx.shippingStatus === 'delivered';
                    return (
                      <div key={tx.id} className={`${isDelivered ? 'bg-gray-800/50 border-gray-700' : isPickedUp ? 'bg-purple-500/10 border-purple-500/20' : isDispatched ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'} border p-5 rounded-2xl space-y-4 relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                          <div>
                            <h4 className={`font-bold ${isDelivered ? 'text-gray-400' : isPickedUp ? 'text-purple-400' : isDispatched ? 'text-green-400' : 'text-blue-400'}`}>{p?.name || "Producto Online"}</h4>
                            <p className={`text-xs mt-1 ${isDelivered ? 'text-gray-500' : isPickedUp ? 'text-purple-200/70' : isDispatched ? 'text-green-200/70' : 'text-blue-200/70'}`}>
                              {isDelivered ? '✅ Entregado' : isPickedUp ? '🛵 Tu Rider recogió el pedido y va en camino.' : isDispatched ? '📦 Tu paquete fue asignado a un Rider y está esperando recolección.' : '⏳ Pago Aprobado. Vendedor empacando'}
                            </p>
                          </div>
                          {isDelivered ? <CheckCircle className="text-gray-500" /> : isPickedUp ? <MapPin className="text-purple-400 animate-bounce" /> : isDispatched ? <Truck className="text-green-400 animate-pulse" /> : <Package className="text-blue-400 animate-pulse" />}
                        </div>

                        {/* Live Map */}
                        {isPickedUp && (
                          <div className="mt-4">
                            <LiveMap
                              role="customer"
                              storePos={getStoreCoords(tx.clientId)}
                              customerPos={getCustomerCoords(tx.customerPhone || "default_cust")}
                              riderPos={
                                (() => {
                                  const r = db.riders?.find((r: any) => r.id === tx.assignedRiderId);
                                  return r?.lastLat && r?.lastLng ? { lat: r.lastLat, lng: r.lastLng } : getStoreCoords(tx.clientId);
                                })()
                              }
                              className="h-48"
                            />
                            <div className="flex justify-between items-center mt-3 bg-black/60 rounded-lg px-3 py-2 border border-purple-500/20 backdrop-blur-md">
                              <p className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5"><Clock size={12} className="text-purple-400" /> ETA Estimado</p>
                              <p className="text-xs font-black text-white">~ 12 min</p>
                            </div>
                          </div>
                        )}
                        {tx.assignedRiderName && (
                          <div className="bg-black/30 rounded-xl p-3 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
                                🛵
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tu Rider</p>
                                <p className="text-sm font-black text-white">{tx.assignedRiderName}</p>
                              </div>
                            </div>
                            {/* Rating Widget if Delivered */}
                            {isDelivered && !tx.riderRating && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => {
                                      const { rateRider } = useKFS() as any;
                                      rateRider(tx.id, star);
                                    }}
                                    className="text-gray-500 hover:text-yellow-400 transition-colors text-lg"
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            )}
                            {tx.riderRating && (
                              <div className="text-yellow-400 text-sm font-black flex items-center gap-1">
                                {tx.riderRating} ★
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchase History */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-black mb-6 text-[violet-600] flex items-center gap-2"><Activity size={24} /> Historial de Tiendas Visitadas</h3>
              {historyEntries.length === 0 ? (
                <div className="text-center py-10 opacity-70">
                  <Package size={48} className="mx-auto mb-4 text-[violet-600]" />
                  <p className="font-bold text-gray-300">Aún no tienes historial de compras.</p>
                  <p className="text-xs text-gray-500 mt-1">Visita tiendas KFS o compra en Flow Express.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyEntries.map((c: any, i: number) => {
                    const store = db.clients.find((cl: any) => cl.id === c.clientId);
                    return (
                      <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-black/40 rounded-xl border border-white/5 hover:border-[violet-600]/30 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[violet-600]">
                            <Store size={18} />
                          </div>
                          <div>
                            <p className="font-black text-gray-100 text-lg">{store?.company || "Tienda Desconocida"}</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">{c.purchasesCount} Compras Registradas</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                          <p className="text-[10px] text-gray-400 font-mono">Volumen Gastado</p>
                          <p className="text-[violet-600] font-black text-xl">{formatUSD(c.totalSpent)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Jobs Tab Container */
          <div className="space-y-6">
            {/* Candidate Notifications Section */}
            {currentCandidate?.notifications && currentCandidate.notifications.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black text-[violet-600] uppercase tracking-wider flex items-center gap-2">
                    <Bell size={16} /> Notificaciones de Empleo
                  </h4>
                  {unreadNotifsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markNotificationsAsRead(currentCandidate.id)}
                      className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {[...currentCandidate.notifications].reverse().map((n: any) => (
                    <div key={n.id} className={`p-4 rounded-xl border transition-all text-xs ${n.read ? 'bg-black/35 border-white/5 text-gray-400' : 'bg-[violet-600]/10 border-[violet-600]/30 text-white font-bold'}`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="uppercase tracking-wider font-black">{n.title}</span>
                        <span className="text-[9px] text-gray-500 font-mono shrink-0">{new Date(n.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-1 text-gray-300 font-normal leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentCandidate?.registrationPaymentStatus === "pending_approval" ? (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full border border-yellow-500/30 flex items-center justify-center mx-auto shadow-lg">
                  <Clock size={36} className="text-yellow-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Postulación en Espera de Verificación</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Hemos recibido tu postulación laboral y tu reporte de pago de **$1.00 USD**. Nuestro equipo de soporte técnico de KFS OS está verificando la transferencia y auditando tu CV.
                  </p>
                  <p className="text-xs text-[violet-600] font-mono mt-1">
                    Referencia de pago de activación: <span className="font-bold">{currentCandidate.registrationPaymentRef}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-gray-500">
                  Tu perfil se activará en la bolsa de trabajo tan pronto como el pago sea conciliado.
                </div>
              </div>
            ) : (
              /* Jobs Tab Form Container */
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[violet-600] flex items-center gap-2">
                      <Briefcase size={26} /> Mi Perfil Laboral
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Configura tu perfil profesional para ser visible ante dueños de comercios KFS OS.</p>
                  </div>

                  {currentCandidate ? (
                    currentCandidate.status === "backed" ? (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 text-yellow-300 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse">
                        <Award size={16} className="text-yellow-400" />
                        <span>Perfil Respaldado por KFS OS</span>
                      </div>
                    ) : (
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                        <Clock size={16} className="animate-spin" />
                        <span>Perfil en Evaluación KFS</span>
                      </div>
                    )
                  ) : (
                    <span className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/25 px-3 py-1.5 rounded-xl">Sin postularse</span>
                  )}
                </div>

                <form onSubmit={handleSaveCandidate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-2 block">Nombre Completo</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-2 block">Teléfono (WhatsApp)</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.phone}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-2 block">Correo Electrónico (Obligatorio)</label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[violet-600] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-2 block">Cargo de Interés</label>
                      <select
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[violet-600] focus:outline-none focus:bg-[violet-900]"
                      >
                        <option value="Cajero">Cajero / Cajera</option>
                        <option value="Vendedor">Vendedor de Tienda</option>
                        <option value="Almacenista">Almacenista / Despachador</option>
                        <option value="Administrador">Administrador de Local</option>
                        <option value="Delivery">Delivery / Mensajero</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-2 block">Presentación y Experiencia Laboral (Obligatorio)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe detalladamente tu experiencia, referencias y por qué eres un excelente candidato..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[violet-600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider block">Currículum Vitae (Obligatorio)</label>
                      <button
                        type="button"
                        onClick={() => setUseKfsCvBuilder(!useKfsCvBuilder)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${useKfsCvBuilder ? "bg-[violet-600] text-[violet-900]" : "bg-white/5 text-gray-400 hover:text-white"}`}
                      >
                        {useKfsCvBuilder ? "⚡ Usando CV Digital KFS" : "📄 Usar CV Digital KFS"}
                      </button>
                    </div>

                    {useKfsCvBuilder ? (
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <p className="text-xs text-green-400 font-bold">✨ CV Digital Autogenerado KFS OS</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Se generará un currículum formateado profesionalmente con tu Bio, Habilidades y Respuestas.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCvModal(true)}
                          className="px-4 py-2 rounded-xl bg-[violet-900] text-[violet-600] border border-[violet-600]/35 font-bold text-xs hover:bg-[violet-600] hover:text-[violet-900] transition-all cursor-pointer"
                        >
                          Previsualizar / Imprimir CV
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setCvFileName(file.name);
                                setCvFileType(file.type);
                                const base64 = await readAsBase64(file);
                                setCvFile(base64);
                                showToast("Currículum cargado.", "success");
                              } catch (err) {
                                showToast("Error al leer el archivo.", "error");
                              }
                            }
                          }}
                          className="text-xs text-gray-400 block w-full sm:w-auto"
                        />
                        {cvFileName && (
                          <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                            <span>📄 {cvFileName}</span>
                            <button
                              type="button"
                              onClick={() => window.open(cvFile, '_blank')}
                              className="text-[10px] text-green-300 underline cursor-pointer hover:text-white"
                            >
                              (Ver actual)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {showCvModal && (
                      <CvViewerModal
                        isOpen={showCvModal}
                        onClose={() => setShowCvModal(false)}
                        candidate={{
                          name: currentUser.name,
                          phone: currentUser.phone,
                          email: email || currentCandidate?.email || "correo@ejemplo.com",
                          bio: bio || currentCandidate?.bio || "Bio...",
                          role: selectedRole || currentCandidate?.role || "Cajero",
                          skills: selectedSkills || currentCandidate?.skills || [],
                          answers: answers || currentCandidate?.answers || {},
                          id: currentCandidate?.id || "cand_demo"
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[violet-600] uppercase tracking-wider mb-3 block">Habilidades Técnicas</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected ? "bg-[violet-600] text-[violet-900] shadow-md" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}
                          >
                            {isSelected && <Check size={12} />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                    <h4 className="text-[violet-600] text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Shield size={14} /> Micro-Encuesta de Compatibilidad
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Disponibilidad</label>
                        <select
                          value={answers.availability}
                          onChange={e => setAnswers(prev => ({ ...prev, availability: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[violet-600]"
                        >
                          <option value="full-time">Tiempo Completo (Full-time)</option>
                          <option value="part-time">Medio Tiempo (Part-time)</option>
                          <option value="weekends">Fines de Semana</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Ubicación (Residencia)</label>
                        <select
                          value={answers.location}
                          onChange={e => setAnswers(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[violet-600]"
                        >
                          <option value="Caracas - Este">Caracas - Este</option>
                          <option value="Caracas - Oeste">Caracas - Oeste</option>
                          <option value="Caracas - Centro">Caracas - Centro</option>
                          <option value="Fuera de Caracas">Fuera de Caracas</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Años de Experiencia</label>
                        <select
                          value={answers.experienceYears}
                          onChange={e => setAnswers(prev => ({ ...prev, experienceYears: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[violet-600]"
                        >
                          <option value="0-1">Menos de 1 año</option>
                          <option value="1-3">1 a 3 años</option>
                          <option value="3+">Más de 3 años</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">¿Posee Transporte Propio?</label>
                        <select
                          value={answers.hasVehicle}
                          onChange={e => setAnswers(prev => ({ ...prev, hasVehicle: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[violet-600]"
                        >
                          <option value="no">No posee</option>
                          <option value="moto">Moto propia</option>
                          <option value="carro">Carro propio</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {currentCandidate?.registrationPaymentStatus !== "approved" && (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
                      <h4 className="text-sm font-black text-[violet-600] uppercase tracking-wider border-b border-[violet-600]/15 pb-2">
                        Pago de Activación de Perfil ($1.00 USD)
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Para activar tu perfil en la Bolsa de Trabajo de KFS OS y ser visible ante dueños de locales, debes realizar un pago único de **$1.00 USD** para cubrir la validación técnica de tu CV.
                      </p>

                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-[10px] text-amber-200 space-y-1 font-mono leading-tight">
                        <p className="font-black border-b border-amber-500/20 pb-1">DATOS DE TRANSFERENCIA DIRECTA ($1 USD):</p>
                        <p>Zinli/Wally/AirTM: <strong>master@kreatek.com</strong></p>
                        <p>Pago Móvil: <strong>Banesco (0414-1234567) RIF: J-4019283-2</strong></p>
                      </div>

                      {currentCandidate?.registrationPaymentStatus === "rejected" && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold animate-pulse">
                          ⚠️ Tu reporte de pago anterior fue RECHAZADO por el administrador. Por favor, realiza una transferencia correcta y reenvía los datos.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Referencia del Pago</label>
                          <input
                            type="text"
                            placeholder="Número de referencia de $1 USD"
                            value={regRefNum}
                            onChange={e => setRegRefNum(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[violet-600]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 font-sans">Capture de Transferencia ($1 USD)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file, 400);
                                  setRegScreenshot(base64);
                                  showToast("Capture cargado.", "success");
                                } catch (err) {
                                  showToast("Error al comprimir el capture.", "error");
                                }
                              }
                            }}
                            className="text-xs text-gray-400 block mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 border border-white/10 p-5 rounded-2xl gap-4">
                    <div>
                      <h4 className="text-sm font-black text-white">Estado de Búsqueda Activa</h4>
                      <p className="text-xs text-gray-400">Si lo desactivas, los comercios no verán tu perfil en las búsquedas hasta que decidas reactivarlo.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${isActive ? "bg-green-600 text-white shadow-md" : "bg-gray-700 text-gray-300"}`}
                    >
                      {isActive ? "🟢 Visible (Buscando Trabajo)" : "🔴 Pausado (Oculto)"}
                    </button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-[violet-600] text-[violet-900] px-8 py-4 rounded-xl font-black hover:scale-[1.03] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                    >
                      <FileText size={18} /> {currentCandidate ? "Actualizar Perfil Laboral" : "Publicar Perfil Profesional"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-center gap-10 items-center relative">
          {[
            { id: "profile", icon: Activity, label: "Mi Cuenta" },
            { id: "jobs", icon: Briefcase, label: "Empleos", badge: unreadNotifsCount }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
              >
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-[violet-600] rounded-b-full shadow-[0_4px_10px_rgba(197,161,132,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-[violet-900]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-[violet-900]' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  );
};

// CoreDashboard
const CoreDashboard = ({ db, setDb, approvePromotora, rejectPromotora, settlePromotoraEarnings, showToast, formatUSD, formatEUR, currentUser, logout, approveSubscription }: any) => {
  const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, deleteCustomer, deletePromotora, deleteVendedor, deleteRider, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints, updateStoreSettings } = useKFS() as any;
  const [searchPromotora, setSearchPromotora] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchVendedor, setSearchVendedor] = useState("");
  const [viewingCandidateCv, setViewingCandidateCv] = useState<any | null>(null);
  const [viewingKycPhoto, setViewingKycPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("panel"); // panel | red | soporte | auditoria
  const { isSupabaseConfigured } = useKFS() as any;
  const pendingTopUps = db.topups?.filter((t: any) => t.status === 'pending') || [];

  const handleWipeDatabase = async () => {
    if (confirm("🚨 ¿ESTÁS SEGURO? Esta acción borrará permanentemente todos los comercios, promotoras, transacciones, y restablecerá todo a $0.00 en Supabase y localmente.")) {
      const cleared = {
        promotoras: [],
        clients: [],
        vendedores: [],
        products: [],
        transactions: [],
        orders: [],
        expenses: [],
        crm: [],
        vales: [],
        posTerminals: [],
        zReports: [],
        buyers: [],
        customers: [],
        kreatekCore: {
          totalTransactions: 0,
          earningsEUR: 0,
          netEarningsEUR: 0,
          adBudgetEUR: 0,
          wipeVersion: 4
        },
        ghostLogs: [],
        notifications: [],
        auditLogs: [],
        supportTickets: [],
        candidates: [],
        unlockedContacts: [],
        riders: [],
        topups: []
      };
      setDb(cleared);
      localStorage.setItem("kfs_os_db_prod", JSON.stringify(cleared));

      if (isSupabaseConfigured) {
        try {
          const { supabase } = await import("../context/supabase");
          const syncId = "kfs-general-db-prod";
          const { error } = await supabase.from("kfs_store_states").upsert({
            id: syncId,
            db_state: cleared,
            updated_at: new Date().toISOString()
          });
          if (error) throw error;
          showToast("Base de datos borrada a 0 en Supabase y local.", "success");
        } catch (err) {
          showToast("Error al sincronizar con Supabase", "error");
        }
      } else {
        showToast("Base de datos local borrada a 0.", "success");
      }
    }
  };

  // ── Customizing state for Arquitecto ──────────────────────────────────────
  const [customizingClient, setCustomizingClient] = useState<any>(null);

  // Feature 1: Clear all demo records
  const handleClearDemos = () => {
    if (confirm('¿Eliminar todos los registros de demo del sistema?')) {
      setDb((prev: any) => ({
        ...prev,
        clients:    prev.clients.filter((c: any)    => !String(c.id).includes('demo')),
        promotoras: prev.promotoras.filter((p: any) => !String(p.id).includes('demo')),
        vendedores: prev.vendedores.filter((v: any) => !String(v.id).includes('demo')),
        customers:  prev.customers.filter((c: any)  => !String(c.id).includes('demo')),
      }));
      showToast('✅ Demos eliminados correctamente.', 'success');
    }
  };

  // Feature 5: Inject KFS Points to any user
  const handleInjectPoints = (collection: string, userId: string) => {
    const raw = prompt('Cantidad de KFS Points a inyectar (ej: 500 = $0.50 USD):', '500');
    if (!raw || isNaN(Number(raw))) return;
    const amount = parseInt(raw, 10);
    setDb((prev: any) => ({
      ...prev,
      [collection]: prev[collection].map((u: any) =>
        u.id === userId ? { ...u, kfsPoints: (u.kfsPoints || 0) + amount } : u
      ),
    }));
    showToast(`🎁 ${amount} K-Points inyectados.`, 'success');
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const clearClientDebt = (clientId: string) => {
    if(confirm("¿Estás seguro de perdonar/eliminar la deuda de cobranza de este comercio?")) {
      setDb((prev: any) => ({
        ...prev,
        clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, kfsFeesOwedUSD: 0 } : c)
      }));
      showToast("Deuda eliminada del registro.", "success");
    }
  };

  // Assign Promotora State
  const [targetClientId, setTargetClientId] = useState("");
  const [targetPromotoraId, setTargetPromotoraId] = useState("");

  // Assign Rider to Business State
  const [assignRiderModal, setAssignRiderModal] = useState<{ riderId: string; riderName: string } | null>(null);
  const [assignRiderBusinessId, setAssignRiderBusinessId] = useState("");

  // Global Product State
  const [globalProdName, setGlobalProdName] = useState("");
  const [globalProdPrice, setGlobalProdPrice] = useState("");
  const [globalProdCategory, setGlobalProdCategory] = useState("");

  // Notification State
  const [notifTarget, setNotifTarget] = useState("all");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");

  useEffect(() => {
    const handleGlobalSale = (e: any) => {
      showToast(`⚡ KFS Network: Venta reportada de ${e.detail.name} por ${formatUSD(e.detail.priceUSD)}`, "success");
    };
    const handlePaymentAlert = (e: any) => {
      showToast(`🔔 ALERTA DE PAGO: ${e.detail.company} reportó transferencia por ${formatUSD(e.detail.amount)}`, "success");
    };
    window.addEventListener("kfs-purchase", handleGlobalSale);
    window.addEventListener("kfs-payment-alert", handlePaymentAlert);
    return () => {
      window.removeEventListener("kfs-purchase", handleGlobalSale);
      window.removeEventListener("kfs-payment-alert", handlePaymentAlert);
    };
  }, [showToast, formatUSD]);

  const totalPromotoras = db.promotoras.length;
  const totalSetups = db.promotoras.reduce((acc: number, p: any) => acc + (p.setups || 0), 0);
  const totalDueños = db.clients.length;
  const globalSalesUSD = db.clients.reduce((acc: number, c: any) => acc + (c.salesUSD || 0), 0);
  const globalDebtUSD = db.clients.reduce((acc: number, c: any) => acc + (c.kfsFeesOwedUSD || 0), 0);
  const totalKPoints = db.customers?.reduce((acc: number, c: any) => acc + (c.kPoints || 0), 0) || 0;
  const usdFloat = db.customers?.reduce((acc: number, c: any) => acc + (c.walletUSD || 0), 0) || 0;

  const chartData = db.transactions.map((t: any, index: number) => ({
    name: `TX-${index + 1}`,
    kreatekFee: t.kreatekFeeEUR
  })).slice(-15);

  return (
    <div className="min-h-screen bg-[#EEF2F5] pb-24 font-sans text-violet-900 relative">
      {/* Wavy Header */}
      <div className="bg-[#EEF2F5] rounded-b-[3rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none pt-6 pb-12 px-6 text-violet-900 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 p-2 rounded-xl text-violet-600 shadow-inner"><Shield size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS OS (Arquitecto)</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white shadow-sm rounded-xl hover:text-red-500 transition-colors cursor-pointer text-gray-500 border-none">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] rounded-full flex items-center justify-center text-violet-600 font-black text-2xl flex-shrink-0 border-none relative z-20 placeholder:text-gray-400">
              <ProfileAvatarEditor currentUser={currentUser} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight truncate text-violet-900">Control Matriz KFS</h2>
              <p className="text-violet-600 font-mono text-xs mt-1 bg-violet-100 shadow-inner inline-block px-2 py-0.5 rounded-md">Vista de Dios • Arquitectura de Red</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto -mt-6 relative z-20 flex flex-col gap-8 animate-fade-in">
        {activeTab === "panel" && (
          <div className="space-y-8 flex flex-col">
            <ReferralLinksWidget userId={currentUser.id} showToast={showToast} />
            <KPointsIssuerWidget db={db} transferKFSPoints={transferKFSPoints} />
            <OracleControlSlider merchantId={db.clients?.[0]?.id} merchantName={db.clients?.[0]?.company || "N/A"} currentFee={db.clients?.[0]?.oracle_fee_percentage} setDb={setDb} />
            {/* Global Metrics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-6 rounded-[2rem] relative overflow-hidden border-none flex flex-col">
                <div className="relative z-10">
                  <span className="text-violet-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Nodos Globales</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-violet-900">{totalDueños}</h2>
                    <span className="text-xs text-gray-500 font-bold">comercios</span>
                  </div>
                </div>
                <Activity size={80} className="absolute -right-5 -bottom-5 text-violet-600/5" />
              </div>
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-6 rounded-[2rem] relative overflow-hidden border-none flex flex-col">
                <div className="relative z-10">
                  <span className="text-violet-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Fuerza de Ventas</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-violet-900">{totalPromotoras}</h2>
                    <span className="text-xs text-gray-500 font-bold">promotoras</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold mt-2 block">{totalSetups} setups históricos</span>
                </div>
                <Users size={80} className="absolute -right-5 -bottom-5 text-violet-600/5" />
              </div>
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-6 rounded-[2rem] relative overflow-hidden border-none flex flex-col">
                <div className="relative z-10">
                  <span className="text-violet-600 text-[10px] font-black uppercase tracking-widest mb-1 block">Facturación Global</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-emerald-500"><AnimatedCounter value={globalSalesUSD} format={formatUSD} /></h2>
                  </div>
                </div>
                <TrendingUp size={80} className="absolute -right-5 -bottom-5 text-violet-600/5" />
              </div>
              <div className="bg-[#EEF2F5] shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff] text-violet-900 p-6 rounded-[2rem] relative overflow-hidden border-none flex flex-col">
                <div className="relative z-10">
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1 block">Deuda Total x Cobrar</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-red-500"><AnimatedCounter value={globalDebtUSD} format={formatUSD} /></h2>
                  </div>
                </div>
                <Activity size={80} className="absolute -right-5 -bottom-5 text-red-500/5" />
              </div>
            </div>

            {/* Push Notifications Command Center */}
            <PushCommandCenter currentUser={currentUser} />

            {/* BCV Rate Manual Update */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-violet-900 text-lg">Tasa Oficial Banco Central</h3>
                <p className="text-xs text-gray-500">Actualización manual / forzada en el sistema</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-32">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Tasa USD (Bs)</label>
                  <input type="number" id="manualUsdRate" placeholder="Tasa USD" defaultValue={rates.USD} step="0.01" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-2 font-bold text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-gray-400" />
                </div>
                <div className="flex-1 md:w-32">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Tasa EUR (Bs)</label>
                  <input type="number" id="manualEurRate" placeholder="Tasa EUR" defaultValue={rates.EUR} step="0.01" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-2 font-bold text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-gray-400" />
                </div>
                <button onClick={() => {
                  const usd = parseFloat((document.getElementById('manualUsdRate') as HTMLInputElement).value);
                  const eur = parseFloat((document.getElementById('manualEurRate') as HTMLInputElement).value);
                  if (usd > 0 && eur > 0) updateBcvRates(usd, eur);
                }} className="bg-violet-600 text-white rounded-xl px-6 py-2 h-10 mt-5 font-black hover:bg-violet-800 transition-colors shadow-[0_5px_15px_rgba(139,92,246,0.3)] border-none">
                  Fijar
                </button>
              </div>
            </div>

            {/* Net Earnings and Ad Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-8 rounded-[2rem] border-none relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-violet-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> Ganancia Neta KFS</p>
                  <h2 className="text-5xl font-black mb-1 text-emerald-500">{formatEUR(db.kreatekCore?.netEarningsEUR || 0)}</h2>
                  <p className="text-xs text-gray-500 mt-2">Libre de pago a promotoras y fondos.</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-violet-600/5" />
              </div>

              {/* Float & Liquidez (Phase E) */}
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-8 rounded-[2rem] border-none relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-violet-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-sky-500" /> Float Liquidez (USD)</p>
                  <h2 className="text-5xl font-black mb-1 text-sky-500">{formatUSD(usdFloat)}</h2>
                  <p className="text-xs text-gray-500 mt-2">Dinero real pre-pagado por usuarios, listo para invertir.</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-violet-600/5" />
              </div>

              {/* K-Points Emitidos (Phase E) */}
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-8 rounded-[2rem] border-none relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-violet-600 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14} className="text-purple-500" /> Total K-Points Emitidos</p>
                  <h2 className="text-5xl font-black mb-1 text-purple-500">{totalKPoints} K-Pts</h2>
                  <p className="text-xs text-gray-500 mt-2">Deuda interna en la economía. {(totalKPoints * 0.001).toFixed(2)} USD (Ref).</p>
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-violet-600/5" />
              </div>

              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-violet-900 p-8 rounded-[2rem] border-none flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-violet-600 text-xs font-black uppercase tracking-widest mb-2">Fondo Publicidad KFS</p>
                  <h2 className="text-5xl font-black text-violet-900">{formatEUR(db.kreatekCore?.adBudgetEUR || 0)}</h2>
                  <p className="text-xs text-gray-500 mt-2">Fondo sugerido para inyección días 13-17 y 28-2.</p>
                </div>
              </div>
            </div>

            <KFSFinancialSplitCalculator formatUSD={formatUSD} formatEUR={formatEUR} />

            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-violet-900 flex items-center gap-2"><TrendingUp className="text-violet-600" /> Flujo de Comisiones KFS</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorKreatekFee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="kreatekFee" stroke="#8B5CF6" strokeWidth={4} fill="url(#colorKreatekFee)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "red" && (
          <div className="space-y-8 flex flex-col">
            {/* Tactical Buttons Row for RED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button onClick={() => setActiveModal('store')} className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] border-none p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer">
                <div className="bg-violet-600 text-white p-3 rounded-xl shadow-[0_5px_15px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform"><Store size={24} /></div>
                <span className="font-black text-violet-900 text-sm text-center">Alta de Comercio</span>
              </button>
              <button onClick={() => setActiveModal('assign')} className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] border-none p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer">
                <div className="bg-violet-900 text-white p-3 rounded-xl shadow-[0_5px_15px_rgba(76,29,149,0.3)] group-hover:scale-110 transition-transform"><Users size={24} /></div>
                <span className="font-black text-violet-900 text-sm text-center">Asignar Promotora</span>
              </button>
              <button onClick={() => setAssignRiderModal({ riderId: "", riderName: "" })} className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] border-none p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all hover:scale-[0.98] group cursor-pointer">
                <div className="bg-amber-500 text-white p-3 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform"><Truck size={24} /></div>
                <span className="font-black text-violet-900 text-sm text-center">Asignar Rider a Negocio</span>
              </button>
            </div>

            {/* Control y Gobernanza de Promotoras */}
            <div className="bg-[#EEF2F5] rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-violet-900 flex items-center gap-2"><Shield className="text-violet-600" /> Control y Gobernanza de Promotoras</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar promotora..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all text-violet-900 placeholder:text-gray-400" value={searchPromotora} onChange={e => setSearchPromotora(e.target.value)} />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Promotora</th>
                      <th className="py-4 px-4">Accesos</th>
                      <th className="py-4 px-4">Datos de Pago</th>
                      <th className="py-4 px-4 text-center">Estado / Métricas</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.promotoras.filter((p: any) => p.name.toLowerCase().includes(searchPromotora.toLowerCase()) || p.email.toLowerCase().includes(searchPromotora.toLowerCase())).map((p: any) => (
                      <tr key={p.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-violet-900">{p.name}</td>
                        <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">{p.email}</span><span className="text-xs font-mono">P: {p.password}</span></td>
                        <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">BIN: {p.binanceId || "N/A"}</span><span className="text-xs font-mono block">PM: {p.pagoMovil || "N/A"}</span></td>
                        <td className="py-4 px-4 text-center">
                          {p.status === 'pending' ? (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Pendiente</span>
                          ) : (
                            <div>
                              <span className="font-black text-violet-900 block">{p.setups || 0} Setups</span>
                              <span className="font-black text-emerald-500 block">{formatEUR(p.earningsEUR || 0)}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {p.status === 'pending' ? (
                            <>
                              <button onClick={() => approvePromotora(p.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-green-700 cursor-pointer">Aprobar</button>
                              <button onClick={() => rejectPromotora(p.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-700 cursor-pointer">Denegar</button>
                            </>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-2 rounded-lg uppercase tracking-wider flex items-center">Habilitada</span>
                              {(p.passiveEarningsEUR || 0) > 0 && (
                                <button onClick={() => settlePromotoraEarnings(p.id)} className="bg-[violet-600] text-[violet-900] px-3 py-1.5 rounded-lg font-bold text-xs shadow-md hover:bg-[#b08d70] cursor-pointer inline-flex items-center gap-1">
                                  <CheckCircle size={14} /> Liquidar Regalías
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {db.promotoras.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay promotoras en la red.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estado de Cobranza Diaria (BOS) */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-violet-900 flex items-center gap-2"><DollarSign className="text-red-500" /> Estado de Cobranza Diaria (BOS)</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar comercio..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all text-violet-900 placeholder:text-gray-400" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                      <th className="py-4 px-4">Teléfono (WhatsApp)</th>
                      <th className="py-4 px-4">Facturación Bruta USD</th>
                      <th className="py-4 px-4">Deuda Actual USD</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones de Cobro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.clients.filter((c: any) => c.company.toLowerCase().includes(searchClient.toLowerCase()) || c.name.toLowerCase().includes(searchClient.toLowerCase())).map((c: any) => {
                      const isBlocked = c.subscription?.status === 'past_due';
                      return (
                        <tr key={c.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-bold text-[violet-900] block">{c.company}</span>
                            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${isBlocked ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                              {isBlocked ? '🔴 Bloqueado' : '🟢 Activo'}
                            </span>
                            {c.promotoraId && (
                              <span className="block mt-2 text-[10px] text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2 py-1 rounded-md inline-block">
                                Ref: {db.promotoras?.find((p: any) => p.id === c.promotoraId)?.name || c.promotoraId}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-500 font-mono">{c.phone}</td>
                          <td className="py-4 px-4 font-black text-green-600">{formatUSD(c.salesUSD || 0)}</td>
                          <td className="py-4 px-4 font-black text-red-500">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <button onClick={() => impersonateClient(c)} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                👁️ Ver Panel
                              </button>

                              {isBlocked ? (
                                <button onClick={() => releaseClient(c.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                  🔓 Liberar
                                </button>
                              ) : (
                                <button onClick={() => blockClient(c.id)} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-600 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                  🔒 Bloquear
                                </button>
                              )}

                              <button onClick={() => {
                                deleteClient(c.id);
                              }} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-red-700 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Eliminar Comercio">
                                🗑️ Comercio
                              </button>

                              <button onClick={() => {
                                clearClientDebt(c.id);
                              }} className="bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-red-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Limpiar Deuda (Registro)">
                                🗑️ Deuda
                              </button>

                              <button onClick={() => {
                                const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                                const targetPhone = cleanPhone.startsWith('04') ? `58${cleanPhone.substring(1)}` : cleanPhone;
                                window.open(`https://wa.me/${targetPhone}?text=Hola ${c.name}, te escribimos de *Kreatek*. Te recordamos realizar el pago de tu mantenimiento BOS diario por un monto de *${formatUSD(c.kfsFeesOwedUSD || 0)}*. Puedes usar el botón en tu panel de control para reportar la transferencia. ¡Gracias!`, '_blank');
                              }} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-1">
                                💬 Cobro WA
                              </button>

                              <button onClick={() => handleInjectPoints('clients', c.id)} className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                🎁 K-Pts
                              </button>

                              <button onClick={() => setCustomizingClient(c)} className="bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-violet-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                                🎨 Diseño
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {db.clients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay comercios en la red para cobrar.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fuerza Laboral (Vendedores) */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-violet-900 flex items-center gap-2"><UserCheck className="text-violet-600" /> Fuerza Laboral (Vendedores)</h3>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar vendedor..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 text-violet-900 transition-all placeholder:text-gray-400" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto max-h-96 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black sticky top-0">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Vendedor</th>
                      <th className="py-4 px-4">Comercio</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Credenciales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.vendedores || []).filter((v: any) => v.name.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email.toLowerCase().includes(searchVendedor.toLowerCase())).map((vend: any) => {
                      const client = db.clients.find((c: any) => c.id === vend.clientId);
                      return (
                        <tr key={vend.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-violet-900">{vend.name}</td>
                          <td className="py-4 px-4 text-gray-500 text-xs">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-right text-gray-500">
                            <span className="text-[10px] font-mono block">{vend.email}</span>
                            <span className="text-[10px] font-mono block">P: {vend.password}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {(db.vendedores || []).length === 0 && <tr><td colSpan={3} className="text-center py-10 text-gray-400 font-bold">No hay vendedores registrados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Riders de Delivery */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-violet-100">
                <div>
                  <h2 className="text-xl font-black text-violet-900 flex items-center gap-2">
                    <Truck size={20} className="text-violet-600" /> Riders de Delivery
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Aprobación, revisión de documentos y gestión de riders</p>
                </div>
                <div className="flex gap-2 items-center">
                  {(db.riders?.filter((r: any) => r.status === "pending") || []).length > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm border-none">
                      {(db.riders?.filter((r: any) => r.status === "pending") || []).length} pendientes
                    </span>
                  )}
                  <span className="bg-violet-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border-none">
                    {(db.riders || []).length} total
                  </span>
                </div>
              </div>

              {/* Metrics Banner */}
              <div className="bg-violet-100/50 border-b border-violet-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-4 rounded-xl flex items-center justify-between placeholder:text-gray-400">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Entregas</p>
                    <p className="text-xl font-black text-violet-900">
                      {(db.riders || []).reduce((acc: number, r: any) => acc + (r.deliveriesCompleted || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Truck size={20} /></div>
                </div>
                <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-4 rounded-xl flex items-center justify-between placeholder:text-gray-400">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ganancias Generadas</p>
                    <p className="text-xl font-black text-emerald-500">
                      {formatUSD((db.riders || []).reduce((acc: number, r: any) => acc + (r.totalEarningsUSD || 0), 0))}
                    </p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><DollarSign size={20} /></div>
                </div>
                <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-4 rounded-xl flex items-center justify-between placeholder:text-gray-400">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Riders Activos</p>
                    <p className="text-xl font-black text-violet-900">
                      {(db.riders || []).filter((r: any) => r.status === "approved").length}
                    </p>
                  </div>
                  <div className="bg-sky-100 text-sky-600 p-2 rounded-lg"><Users size={20} /></div>
                </div>
              </div>

              {(db.riders || []).length === 0 ? (
                <div className="p-10 text-center">
                  <Truck size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold">No hay riders registrados aún.</p>
                  <p className="text-xs text-gray-300 mt-1">Los riders se registran desde el panel de login.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {(db.riders || []).map((rider: any) => {
                    const businessNames = (rider.associatedBusinesses || []).map((bId: string) =>
                      db.clients?.find((c: any) => c.id === bId)?.company
                    ).filter(Boolean);
                    return (
                      <div key={rider.id} className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 ${rider.status === "approved" ? "border-green-400 bg-green-50" : "border-amber-400 bg-amber-50"}`}>
                            🛵
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-[violet-900]">{rider.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${rider.status === "approved" ? "bg-green-100 text-green-700" : rider.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {rider.status === "approved" ? "✅ Aprobado" : rider.status === "rejected" ? "❌ Rechazado" : "⏳ Pendiente"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono">{rider.email} · {rider.phone}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {businessNames.length > 0 ? `Negocios: ${businessNames.join(", ")}` : "Sin negocios asociados"}
                            </p>
                            {rider.pagoMovil?.banco && (
                              <p className="text-[10px] text-green-600 font-bold mt-0.5">
                                💳 PM: {rider.pagoMovil.banco} · {rider.pagoMovil.telefono} · CI {rider.pagoMovil.cedula}
                              </p>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-300 flex-shrink-0">{new Date(rider.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* Documents Preview */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Cédula", key: "cedulaImg", icon: "🪪" },
                            { label: "Cert. Médico", key: "medCertImg", icon: "🏥" },
                            { label: "Licencia", key: "licenseImg", icon: "🚗" }
                          ].map(({ label, key, icon }) => (
                            <div key={key} className={`rounded-xl p-2 text-center border ${rider[key] ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                              {rider[key] ? (
                                <img src={rider[key]} alt={label} className="w-full aspect-square object-cover rounded-lg mb-1 cursor-pointer" onClick={() => window.open(rider[key], "_blank")} title="Click para ampliar" />
                              ) : (
                                <div className="w-full aspect-square flex items-center justify-center text-2xl mb-1 bg-gray-100 rounded-lg">{icon}</div>
                              )}
                              <p className={`text-[8px] font-black uppercase ${rider[key] ? "text-green-600" : "text-red-400"}`}>
                                {rider[key] ? "✅ " : "⚠️ "}{label}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        {rider.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => approveRider(rider.id)} className="flex-1 py-2.5 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 active:scale-95 transition-all text-xs cursor-pointer">
                              ✅ Aprobar Rider
                            </button>
                            <button onClick={() => rejectRider(rider.id)} className="flex-1 py-2.5 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 active:scale-95 transition-all text-xs cursor-pointer">
                              ❌ Rechazar y Eliminar
                            </button>
                          </div>
                        )}
                        {rider.status === "approved" && (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <div className="flex-1 py-2 bg-green-50 border border-green-200 rounded-xl text-center">
                                <p className="text-[10px] font-black text-green-600">🏁 {rider.deliveriesCompleted || 0} entregas realizadas</p>
                              </div>
                              <button
                                onClick={() => { setAssignRiderModal({ riderId: rider.id, riderName: rider.name }); setAssignRiderBusinessId(""); }}
                                className="px-4 py-2 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 text-xs border border-orange-400 cursor-pointer flex items-center gap-1"
                              >
                                <Truck size={12} /> Asignar Negocio
                              </button>
                              <button onClick={() => rejectRider(rider.id)} className="px-4 py-2 bg-red-50 text-red-500 font-black rounded-xl hover:bg-red-100 text-xs border border-red-200 cursor-pointer">
                                Revocar
                              </button>
                            </div>
                            {/* Businesses assigned – with remove option */}
                            {(rider.associatedBusinesses || []).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(rider.associatedBusinesses || []).map((bId: string) => {
                                  const biz = db.clients?.find((c: any) => c.id === bId);
                                  return biz ? (
                                    <span key={bId} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-full border border-orange-200">
                                      🏪 {biz.company}
                                      <button onClick={() => removeRiderFromBusiness(rider.id, bId)} className="hover:text-red-500 transition-colors cursor-pointer ml-0.5">✕</button>
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "soporte" && (
          <div className="space-y-8 flex flex-col">
            {/* Help Desk */}
            <div className="bg-[violet-900] rounded-[2rem] shadow-sm border border-red-500/20 p-8 text-white mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-red-400"><Bell className="text-red-400" /> Help Desk (Tickets de Soporte Global)</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {(db.supportTickets || []).slice().reverse().map((ticket: any) => {
                  const client = db.clients.find((c: any) => c.id === ticket.clientId);
                  return (
                    <div key={ticket.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-200">[{ticket.status === 'open' ? '🔴 ABIERTO' : '🟢 CERRADO'}] {client?.company || "Comercio"} - {ticket.subject}</p>
                        <span className="text-[10px] text-gray-500 font-mono">{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-[violet-600]/30">
                        {ticket.messages.map((m: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-[violet-600]">{m.author}:</span> <span className="text-gray-300">{m.text}</span>
                          </div>
                        ))}
                      </div>
                      {ticket.status === 'open' && (
                        <div className="flex gap-2 mt-2">
                          <input type="text" id={`reply-${ticket.id}`} placeholder="Respuesta Kreatek..." className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[violet-600]" />
                          <button onClick={() => {
                            const input = document.getElementById(`reply-${ticket.id}`) as HTMLInputElement;
                            if (input && input.value) {
                              replyTicket(ticket.id, "Kreatek Core", input.value);
                              input.value = "";
                            }
                          }} className="bg-[violet-600] text-[violet-900] px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer hover:bg-[#b08d70]">Responder</button>
                          <button onClick={() => {
                            closeTicket(ticket.id);
                          }} className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 cursor-pointer">Cerrar Ticket</button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {(!db.supportTickets || db.supportTickets.length === 0) && (
                  <p className="text-gray-500 text-sm font-bold text-center py-4">No hay tickets de soporte.</p>
                )}
              </div>
            </div>

            {/* Suscripciones Pendientes */}
            {db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').length > 0 && (
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 mb-8">
                <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2"><CreditCard className="text-green-500" /> Suscripciones por Aprobar ($6)</h3>
                <div className="space-y-4">
                  {db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').map((c: any) => (
                    <div key={c.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-green-50/50 rounded-2xl border border-green-100 shadow-sm gap-4">
                      <div>
                        <h4 className="font-bold text-[violet-900]">{c.company}</h4>
                        <p className="text-sm text-gray-600 font-mono mt-1">Ref Bancaria Enviada: <span className="font-black text-green-700">{c.subscription.lastPaymentRef}</span></p>
                      </div>
                      <button onClick={() => approveSubscription(c.id)} className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md">
                        <CheckCircle size={18} /> Aprobar Pago y Reactivar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registros de Candidatos Pendientes ($1) */}
            {db.candidates?.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').length > 0 && (
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 mb-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2">
                  <Briefcase className="text-green-500" /> Registraciones de Bolsa de Empleo por Aprobar ($1)
                </h3>
                <div className="space-y-4">
                  {db.candidates.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').map((cand: any) => (
                    <div key={cand.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-green-50/50 rounded-2xl border border-green-100 shadow-sm gap-4">
                      <div>
                        <h4 className="font-black text-[violet-900]">Candidato: {cand.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Cargo: <strong>{cand.role}</strong> | Teléfono: <strong>{cand.phone}</strong>
                        </p>
                        <p className="text-xs text-gray-600 font-mono mt-1">
                          Referencia de Activación ($1): <span className="font-black text-green-700">{cand.registrationPaymentRef}</span>
                        </p>
                        <div className="flex gap-4 mt-2">
                          {(cand.cvFile || cand.useKfsCvBuilder) && (
                            <button
                              onClick={() => {
                                if (cand.useKfsCvBuilder) {
                                  setViewingCandidateCv(cand);
                                } else {
                                  window.open(cand.cvFile, '_blank');
                                }
                              }}
                              className="text-[10px] font-black text-blue-700 underline cursor-pointer flex items-center gap-1"
                            >
                              👁️ {cand.useKfsCvBuilder ? "Ver CV Digital KFS" : `Abrir Currículum (${cand.cvFileType?.includes('pdf') ? 'PDF' : 'Imagen'})`}
                            </button>
                          )}
                          {cand.registrationPaymentProof && (
                            <button
                              onClick={() => window.open(cand.registrationPaymentProof, '_blank')}
                              className="text-[10px] font-black text-green-700 underline cursor-pointer flex items-center gap-1"
                            >
                              👁️ Ver Capture de Pago
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <button
                          onClick={() => approveCandidateRegistration(cand.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-xs"
                        >
                          <CheckCircle size={14} /> Aprobar Registro
                        </button>
                        <button
                          onClick={() => rejectCandidateRegistration(cand.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-xs"
                        >
                          <X size={14} /> Rechazar Registro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desbloqueos de Contactos Pendientes ($10) */}
            {db.unlockedContacts?.filter((u: any) => u.status === 'pending_approval').length > 0 && (
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 mb-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2">
                  <CreditCard className="text-green-500" /> Desbloqueos de Bolsa de Empleo por Aprobar ($10)
                </h3>
                <div className="space-y-4">
                  {db.unlockedContacts.filter((u: any) => u.status === 'pending_approval').map((u: any) => {
                    const candidate = db.candidates?.find((cand: any) => cand.id === u.candidateId);
                    const client = db.clients?.find((c: any) => c.id === u.clientId);
                    return (
                      <div key={u.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-green-50/50 rounded-2xl border border-green-100 shadow-sm gap-4">
                        <div>
                          <h4 className="font-black text-[violet-900]">Comercio: {client?.company || "Desconocido"}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Candidato Target: <strong>{candidate?.name || "Desconocido"}</strong> ({candidate?.role})
                          </p>
                          <p className="text-xs text-gray-600 font-mono mt-1">
                            Referencia Bancaria: <span className="font-black text-green-700">{u.reference}</span>
                          </p>
                          {u.screenshot && (
                            <div className="mt-2">
                              <button
                                onClick={() => window.open(u.screenshot, '_blank')}
                                className="text-[10px] font-black text-green-700 underline cursor-pointer"
                              >
                                👁️ Ver Capture de Pago
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                          <button
                            onClick={() => approveUnlock(u.id)}
                            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-xs"
                          >
                            <CheckCircle size={14} /> Aprobar Desbloqueo
                          </button>
                          <button
                            onClick={() => rejectUnlock(u.id)}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-xs"
                          >
                            <X size={14} /> Rechazar Pago
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verificaciones y Respaldo de Candidatos */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 mb-8 animate-fade-in">
              <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2">
                <Award className="text-yellow-500" /> Verificaciones de Bolsa de Empleo
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Candidato</th>
                      <th className="py-4 px-4">Cargo & Habilidades</th>
                      <th className="py-4 px-4">Contacto</th>
                      <th className="py-4 px-4 text-center">Estado KFS</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.candidates?.map((cand: any) => (
                      <tr key={cand.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-bold text-[violet-900]">{cand.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {cand.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-black text-[violet-900] block">{cand.role}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cand.skills?.map((s: string) => (
                              <span key={s} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500 font-mono text-xs">
                          <span className="block">{cand.phone}</span>
                          <span className="block">{cand.email}</span>
                          {(cand.cvFile || cand.useKfsCvBuilder) && (
                            <button
                              onClick={() => {
                                if (cand.useKfsCvBuilder) {
                                  setViewingCandidateCv(cand);
                                } else {
                                  window.open(cand.cvFile, '_blank');
                                }
                              }}
                              className="text-[9px] font-black text-blue-700 underline cursor-pointer block mt-1 text-left"
                            >
                              👁️ {cand.useKfsCvBuilder ? "Ver CV Digital" : "Ver CV Adjunto"}
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {cand.status === 'backed' ? (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                              🏆 Respaldado
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => toggleCandidateBacking(cand.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${cand.status === 'backed' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-yellow-500 text-[violet-900] hover:bg-yellow-600'}`}
                          >
                            {cand.status === 'backed' ? "Quitar Aval KFS" : "Otorgar Aval KFS"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!db.candidates || db.candidates.length === 0) && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 font-bold">
                          No hay candidatos registrados en la bolsa de empleo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auditoria" && (
          <div className="space-y-8 flex flex-col">
            {/* Tactical Buttons Row for Auditoría & Control */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              <button onClick={() => setActiveModal('product')} className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-indigo-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Package size={24} /></div>
                <span className="font-black text-[violet-900] text-sm text-center font-bold">Catálogo Global KFS</span>
              </button>
              <button onClick={() => setActiveModal('push')} className="bg-red-50 border border-red-100 hover:bg-red-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-red-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Bell size={24} /></div>
                <span className="font-black text-[violet-900] text-sm text-center font-bold">Alerta Push Network</span>
              </button>
              <button onClick={handleWipeDatabase} className="bg-red-100 border border-red-200 hover:bg-red-200 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-red-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Shield size={24} /></div>
                <span className="font-black text-red-700 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>
              </button>
              <button onClick={handleClearDemos} className="bg-orange-50 border border-orange-200 hover:bg-orange-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-orange-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Trash2 size={24} /></div>
                <span className="font-black text-orange-700 text-sm text-center font-bold">🗑️ Limpiar Demos</span>
              </button>
            </div>

            {/* Validaciones Financieras */}
            {pendingTopUps.length > 0 && (
              <div className="bg-green-50/50 rounded-[2rem] shadow-sm border border-green-200 p-8 mb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-green-900 flex items-center gap-2"><DollarSign className="text-green-500" /> Validaciones Financieras Pendientes</h3>
                </div>
                <div className="space-y-4">
                  {pendingTopUps.map((t: any) => {
                    const user = t.userType === 'client' ? db.clients?.find((c: any) => c.id === t.userId) : db.customers?.find((c: any) => c.id === t.userId);
                    const name = t.userType === 'client' ? user?.company : user?.name;
                    return (
                      <div key={t.id} className="bg-white border border-green-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          {t.screenshotBase64 && (
                            <a href={t.screenshotBase64} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 block hover:scale-105 transition-transform shrink-0 shadow-sm">
                              <img src={t.screenshotBase64} alt="Comprobante" className="w-full h-full object-cover" />
                            </a>
                          )}
                          <div>
                            <p className="font-bold text-sm text-[violet-900]">{name} <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 uppercase ml-2">{t.userType}</span></p>
                            <p className="text-xs text-gray-500 font-mono mt-1">Ref: {t.paymentReference} | {new Date(t.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="text-right flex-1 md:flex-none">
                            <p className="text-[10px] text-gray-400 uppercase font-black">Monto a Acreditar</p>
                            <p className="text-xl font-black text-green-600">${t.amountUSD.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => validateTopUp(t.id, 'rejected', currentUser.id)} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors cursor-pointer border border-red-200">
                              <X size={18} />
                            </button>
                            <button onClick={() => validateTopUp(t.id, 'approved', currentUser.id)} className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-500 hover:text-white text-green-600 flex items-center justify-center transition-colors cursor-pointer border border-green-200">
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

            {/* Ghost Trap Forensics */}
            <div className="bg-red-50/30 rounded-[2rem] shadow-sm border border-red-100 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-red-900 flex items-center gap-2"><Lock className="text-red-500" /> Ghost Trap Forensics (Alertas de Anulación Silenciosa)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-red-100/50 text-red-800 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">ID Fraude</th>
                      <th className="py-4 px-4">Vendedor / Comercio</th>
                      <th className="py-4 px-4">Fecha de Detonación</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Monto Absorbido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.ghostLogs || []).map((log: any) => {
                      const vendedor = db.vendedores?.find((v: any) => v.id === log.vendedorId);
                      const client = db.clients?.find((c: any) => c.id === vendedor?.clientId);
                      return (
                        <tr key={log.id} className="border-b border-red-100/50 hover:bg-red-50 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-red-900 font-bold">{log.id}</td>
                          <td className="py-4 px-4 font-bold text-red-900">
                            {vendedor?.name || "Desconocido"} <span className="text-xs font-normal opacity-70">({client?.company || "N/A"})</span>
                          </td>
                          <td className="py-4 px-4 text-red-800 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-black text-red-600">+{formatUSD(log.amountUSD)}</td>
                        </tr>
                      );
                    })}
                    {(db.ghostLogs || []).length === 0 && <tr><td colSpan={4} className="text-center py-6 text-green-700 font-bold">No se han detectado intentos de anulación. Sistema blindado.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Auditoría de Cierre */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[violet-900] flex items-center gap-2"><Lock className="text-[violet-600]" /> Auditoría de Cierre (Reportes Z Globales)</h3>
                <div className="flex gap-2">
                  <button onClick={() => showToast("Comando TFHKA Z (SENIAT) enviado al Spooler...", "success")} className="bg-amber-100 text-amber-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-2 border border-amber-300">
                    Emitir Z Fiscal
                  </button>
                  <button onClick={() => window.print()} className="bg-[violet-900] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2">
                    Imprimir Listado
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                      <th className="py-4 px-4">Fecha / Vendedor</th>
                      <th className="py-4 px-4">Operaciones</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Total USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.zReports || []).map((z: any) => {
                      const client = db.clients.find((c: any) => c.id === z.clientId);
                      const vendedor = db.vendedores?.find((v: any) => v.id === z.vendedorId);
                      return (
                        <tr key={z.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-[violet-900]">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-gray-500">
                            <span className="block font-mono text-xs">{new Date(z.timestamp).toLocaleString()}</span>
                            <span className="block font-bold text-[violet-900] text-xs">Operador: {vendedor?.name || "N/A"}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-500">{z.txCount} TXs</td>
                          <td className="py-4 px-4 text-right font-black text-green-600">{formatUSD(z.totalUSD)}</td>
                        </tr>
                      );
                    })}
                    {(db.zReports || []).length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-bold">No hay reportes Z emitidos aún.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registro Inmutable de Auditoría */}
            <div className="bg-[violet-900] rounded-[2rem] shadow-sm border border-white/10 p-8 text-white mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Shield className="text-[violet-600]" /> Registro Inmutable de Auditoría (Logs)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(db.auditLogs || []).slice().reverse().map((log: any) => (
                  <div key={log.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-[violet-600]/20 text-[violet-600] p-2 rounded-lg">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-200">[{log.action}] <span className="text-gray-400 font-normal">por {log.actor}</span></p>
                      <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">{new Date(log.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!db.auditLogs || db.auditLogs.length === 0) && (
                  <p className="text-gray-500 text-sm font-bold text-center py-4">No hay registros de auditoría recientes.</p>
                )}
              </div>
            </div>

            {/* Catálogo Global de Productos */}
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2"><Store className="text-[violet-600]" /> Catálogo Global de Productos</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black sticky top-0">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Producto</th>
                      <th className="py-4 px-4">Comercio</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.products.map((prod: any) => {
                      const client = db.clients.find((c: any) => c.id === prod.clientId);
                      return (
                        <tr key={prod.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-[violet-900]">{prod.name}</td>
                          <td className="py-4 px-4 text-gray-500 text-xs">{client?.company || "N/A"}</td>
                          <td className="py-4 px-4 text-gray-500 font-mono">{prod.stock}</td>
                          <td className="py-4 px-4 text-right font-black text-green-600">{formatUSD(prod.price)}</td>
                        </tr>
                      );
                    })}
                    {db.products.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-bold">No hay productos en el ecosistema.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="space-y-8 flex flex-col">
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
              <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2"><FileText className="text-[violet-600]" /> Bóveda KYC (Know Your Customer)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                    <tr>
                      <th className="py-4 px-4 rounded-tl-xl">Usuario / Entidad</th>
                      <th className="py-4 px-4">Rol</th>
                      <th className="py-4 px-4">Dirección Fiscal/Residencial</th>
                      <th className="py-4 px-4 text-center">Docs</th>
                      <th className="py-4 px-4 text-right rounded-tr-xl">Estado KYC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Clientes */}
                    {db.clients?.map((client: any) => (
                      <tr key={client.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[violet-900]">{client.name} <span className="text-xs text-gray-500 font-normal block">{client.company}</span></td>
                        <td className="py-4 px-4 text-xs font-bold text-[violet-600]">Dueño</td>
                        <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate" title={client.kyc_address || client.address}>{client.kyc_address || client.address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {client.kyc_photo || client.avatar ? <img src={client.kyc_photo || client.avatar} onClick={() => setViewingKycPhoto(client.kyc_photo || client.avatar)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Selfie" title="Ver Selfie/Logo" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><Camera size={16} /></span>}
                            {client.kyc_id_card_img ? <img src={client.kyc_id_card_img} onClick={() => setViewingKycPhoto(client.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Cédula" title="Ver Cédula/RIF" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${client.kyc_status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{client.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                    {/* Promotoras */}
                    {db.promotoras?.map((promo: any) => (
                      <tr key={promo.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[violet-900]">{promo.name}</td>
                        <td className="py-4 px-4 text-xs font-bold text-indigo-600">Promotora</td>
                        <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate" title={promo.kyc_address}>{promo.kyc_address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {promo.kyc_photo || promo.avatar ? <img src={promo.kyc_photo || promo.avatar} onClick={() => setViewingKycPhoto(promo.kyc_photo || promo.avatar)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Selfie" title="Ver Selfie" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><Camera size={16} /></span>}
                            {promo.kyc_id_card_img ? <img src={promo.kyc_id_card_img} onClick={() => setViewingKycPhoto(promo.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Cédula" title="Ver Cédula" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${promo.kyc_status === 'verified' ? 'bg-green-100 text-green-700' : promo.kyc_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{promo.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                    {/* Customers */}
                    {db.customers?.map((cust: any) => (
                      <tr key={cust.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[violet-900]">{cust.name} <span className="text-xs text-gray-500 font-normal block">{cust.phone}</span></td>
                        <td className="py-4 px-4 text-xs font-bold text-gray-600">Usuario</td>
                        <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate" title={cust.kyc_address}>{cust.kyc_address || "N/A"}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {cust.kyc_photo ? <img src={cust.kyc_photo} onClick={() => setViewingKycPhoto(cust.kyc_photo)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Selfie" title="Ver Selfie" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><Camera size={16} /></span>}
                            {cust.kyc_id_card_img ? <img src={cust.kyc_id_card_img} onClick={() => setViewingKycPhoto(cust.kyc_id_card_img)} className="w-10 h-10 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200" alt="Cédula" title="Ver Cédula" /> : <span className="p-2.5 text-gray-300 border border-dashed border-gray-200 rounded-lg"><FileText size={16} /></span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${cust.kyc_status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{cust.kyc_status || 'verified'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "nodos" && (
          <div className="space-y-8 flex flex-col">
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 animate-fade-in">
              <h3 className="text-xl font-black mb-6 text-[violet-900] flex items-center gap-2"><QrCode className="text-[violet-600]" /> Creador de Nodos KFS (Invitaciones)</h3>
              <p className="text-sm text-gray-500 mb-6">Genera enlaces QR oficiales para registrar nuevos actores en la economía KFS como tus referidos.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { role: 'registerCustomer', title: 'Invitar Cliente', imgUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80' },
                  { role: 'registerPromo', title: 'Invitar Promotora', imgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
                  { role: 'register', title: 'Invitar Comercio', imgUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80' },
                  { role: 'registerRider', title: 'Invitar Delivery', imgUrl: 'https://images.unsplash.com/photo-1552872673-9b7b99711ebb?auto=format&fit=crop&w=400&q=80' }
                ].map((invite, idx) => {
                  let host = '';
                  if (typeof window !== 'undefined') {
                    host = window.location.origin + window.location.pathname;
                  }
                  const url = `${host}?role=${invite.role}&ref=arquitecto`;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
                  return (
                    <div key={idx} className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-6 rounded-2xl flex flex-col items-center text-center shadow-sm placeholder:text-gray-400">
                      <h4 className="font-black text-[violet-900] mb-4">{invite.title}</h4>
                      <img src={invite.imgUrl} alt={invite.title} className="w-full h-32 object-cover rounded-xl mb-4 shadow-sm border-2 border-white" />
                      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm mb-4">
                        <img src={qrUrl} alt={`QR ${invite.title}`} className="w-32 h-32 rounded-lg" />
                      </div>
                      <input type="text" readOnly value={url} className="w-full text-[10px] bg-white border border-gray-200 rounded p-2 text-gray-500 mb-2 focus:outline-none" />
                      <button onClick={() => { navigator.clipboard.writeText(url); showToast('Enlace copiado', 'success'); }} className="w-full py-2 bg-[violet-600] text-[violet-900] font-bold text-xs rounded hover:bg-[#b08d70] transition-colors">Copiar Enlace</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tactical Actions Modals */}
        {activeModal === 'store' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-2 shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black"><X size={24} /></button>
              <RegisterClientForm onRegister={(data: any, promoId: string, fee: number) => { registerClient(data, promoId, fee); setActiveModal(null); }} onCancel={() => setActiveModal(null)} />
            </div>
          </div>
        )}

        {activeModal === 'assign' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black">Asignar Promotora</h3>
                <button onClick={() => setActiveModal(null)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Comercio (Target)</label>
                  <select value={targetClientId} onChange={e => setTargetClientId(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400">
                    <option value="">Seleccione Comercio...</option>
                    {db.clients.map((c: any) => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nueva Promotora</label>
                  <select value={targetPromotoraId} onChange={e => setTargetPromotoraId(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400">
                    <option value="">Seleccione Promotora...</option>
                    <option value="none">Sin Promotora (100% KFS)</option>
                    {db.promotoras.filter((p: any) => p.status !== 'pending').map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button onClick={() => { if (targetClientId && targetPromotoraId) { assignPromotoraToClient(targetClientId, targetPromotoraId === 'none' ? '' : targetPromotoraId); setActiveModal(null); } }} className="w-full bg-[violet-900] text-white py-4 rounded-xl font-black shadow-lg">Aplicar Reasignación</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Storefront Customizer Modal (Arquitecto) ───────────────────── */}
      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setCustomizingClient(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-violet-900 transition-colors cursor-pointer z-10 border-none bg-transparent">
              <X size={24} />
            </button>
            <StorefrontCustomizer
              client={customizingClient}
              updateStoreSettings={(id: string, settings: any) => {
                updateStoreSettings(id, settings);
                setCustomizingClient(null);
                showToast('✅ Diseño de tienda actualizado.', 'success');
              }}
            />
          </div>
        </div>
      )}

      {activeModal === 'product' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black">Catálogo Global</h3>
                <button onClick={() => setActiveModal(null)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre del Producto" value={globalProdName} onChange={e => setGlobalProdName(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400" />
                <input type="number" placeholder="Precio ($ USD)" value={globalProdPrice} onChange={e => setGlobalProdPrice(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400" />
                <input type="text" placeholder="Categoría" value={globalProdCategory} onChange={e => setGlobalProdCategory(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400" />
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer p-3 border border-gray-200 rounded-xl bg-gray-50">
                  <input type="checkbox" id="globalKPoints" className="w-5 h-5 accent-indigo-600 rounded" defaultChecked={true} />
                  Permitir pago mixto con K-Points (Lealtad)
                </label>
                <button onClick={() => { 
                  if (globalProdName && globalProdPrice) { 
                    const allowKPoints = (document.getElementById('globalKPoints') as HTMLInputElement)?.checked;
                    addGlobalProduct({ name: globalProdName, priceUSD: parseFloat(globalProdPrice), category: globalProdCategory, allowKPoints }); 
                    setActiveModal(null); 
                  } 
                }} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-colors">
                  Inyectar a la Red KFS
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'push' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black text-red-600">Alerta Push Network</h3>
                <button onClick={() => setActiveModal(null)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Audiencia Destino</label>
                  <select value={notifTarget} onChange={e => setNotifTarget(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold placeholder:text-gray-400">
                    <option value="all">Toda la Red KFS</option>
                    <option value="dueño">Comercios Afiliados</option>
                    <option value="promotora">Fuerza de Promotoras</option>
                    <option value="vendedor">Terminales (Vendedores)</option>
                  </select>
                </div>
                <input type="text" placeholder="Título Breve" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold text-red-600 placeholder:text-gray-400" />
                <textarea placeholder="Mensaje de impacto..." value={notifMsg} onChange={e => setNotifMsg(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold h-24 resize-none placeholder:text-gray-400" />
                <button onClick={() => { if (notifTitle && notifMsg) { sendNotification(notifTarget, notifTitle, notifMsg); setActiveModal(null); } }} className="w-full bg-red-600 text-white py-4 rounded-xl font-black shadow-lg flex justify-center gap-2 items-center"><Bell size={20} /> Broadcast Instantáneo</button>
              </div>
            </div>
          </div>
        )}

        {viewingKycPhoto && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative max-w-3xl w-full flex flex-col items-center">
              <button onClick={() => setViewingKycPhoto(null)} className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors cursor-pointer"><X size={32} /></button>
              <img src={viewingKycPhoto} alt="Visor KYC" className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-white/5" />
              <div className="mt-6 flex gap-4 w-full max-w-sm">
                {currentUser?.role === 'core' && (
                  <a href={viewingKycPhoto} download="kfs_kyc_document.jpg" className="flex-1 bg-[violet-600] text-[violet-900] py-3 rounded-xl font-black text-center shadow-[0_0_20px_rgba(197,161,132,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer">
                    <DownloadCloud size={20} /> Descargar Documento
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {assignRiderModal !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[violet-900] flex items-center gap-2"><Truck className="text-orange-500" size={22} /> Asignar Rider a Negocio</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Máx. 2 negocios por rider • Máx. 2 riders por negocio</p>
                </div>
                <button onClick={() => { setAssignRiderModal(null); setAssignRiderBusinessId(""); }}><X size={24} className="text-gray-400 hover:text-gray-700 cursor-pointer" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Rider Aprobado</label>
                  <select
                    value={assignRiderModal.riderId}
                    onChange={e => {
                      const r = db.riders?.find((r: any) => r.id === e.target.value);
                      setAssignRiderModal({ riderId: e.target.value, riderName: r?.name || "" });
                    }}
                    className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold text-[violet-900] focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
                  >
                    <option value="">Seleccione un Rider...</option>
                    {(db.riders || []).filter((r: any) => r.status === "approved").map((r: any) => (
                      <option key={r.id} value={r.id} disabled={(r.associatedBusinesses || []).length >= 2}>
                        🛵 {r.name} {(r.associatedBusinesses || []).length >= 2 ? "(Máx. negocios)" : `(${(r.associatedBusinesses || []).length}/2 negocios)`}
                      </option>
                    ))}
                  </select>
                  {(db.riders || []).filter((r: any) => r.status === "approved").length === 0 && (
                    <p className="text-xs text-amber-500 font-bold mt-1">⚠️ No hay riders aprobados. Aprueba un rider primero en la sección de abajo.</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Negocio Destino</label>
                  <select
                    value={assignRiderBusinessId}
                    onChange={e => setAssignRiderBusinessId(e.target.value)}
                    className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 font-bold text-[violet-900] focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
                  >
                    <option value="">Seleccione un Comercio...</option>
                    {db.clients.map((c: any) => {
                      const bizRiderCount = (db.riders || []).filter((r: any) => (r.associatedBusinesses || []).includes(c.id)).length;
                      const alreadyAssigned = assignRiderModal.riderId && (db.riders || []).find((r: any) => r.id === assignRiderModal.riderId)?.associatedBusinesses?.includes(c.id);
                      return (
                        <option key={c.id} value={c.id} disabled={bizRiderCount >= 2 || !!alreadyAssigned}>
                          🏪 {c.company} {alreadyAssigned ? "(Ya asignado)" : bizRiderCount >= 2 ? "(Máx. riders)" : `(${bizRiderCount}/2 riders)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {assignRiderModal.riderId && (() => {
                  const r = db.riders?.find((r: any) => r.id === assignRiderModal.riderId);
                  const bizNames = (r?.associatedBusinesses || []).map((bId: string) => db.clients?.find((c: any) => c.id === bId)?.company).filter(Boolean);
                  return r ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <p className="text-xs font-black text-orange-700">🛵 {r.name}</p>
                      <p className="text-[10px] text-orange-500 mt-0.5">
                        {bizNames.length > 0 ? `Ya en: ${bizNames.join(", ")}` : "Sin negocios asignados aún"}
                      </p>
                      {r.pagoMovil?.banco && (
                        <p className="text-[10px] text-green-600 font-bold mt-0.5">💳 PM: {r.pagoMovil.banco} · {r.pagoMovil.telefono}</p>
                      )}
                    </div>
                  ) : null;
                })()}
                <button
                  onClick={() => {
                    if (assignRiderModal.riderId && assignRiderBusinessId) {
                      assignRiderToBusiness(assignRiderModal.riderId, assignRiderBusinessId);
                      setAssignRiderModal(null);
                      setAssignRiderBusinessId("");
                    }
                  }}
                  disabled={!assignRiderModal.riderId || !assignRiderBusinessId}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck size={18} /> Confirmar Asignación
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vista_dios" && (
          <div className="space-y-8 flex flex-col animate-fade-in">
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-[2rem] p-8 shadow-2xl text-white">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-white"><Eye className="text-purple-500" /> Vista de Dios (Read-Only)</h3>
              <p className="text-sm text-gray-400 mb-8">Acceso directo a la capa de datos. Todo el ecosistema unificado.</p>
              
              <div className="space-y-8">
                {/* Tabla de Z-Reports (Flujos de Caja) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-[violet-600] font-black uppercase tracking-widest text-sm mb-4">Flujos de Caja Consolidados (Z-Reports)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-gray-500 border-b border-white/10">
                        <tr>
                          <th className="pb-2">Fecha</th>
                          <th className="pb-2">Comercio</th>
                          <th className="pb-2">Bruto</th>
                          <th className="pb-2">Comisiones KFS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.zReports?.slice().reverse().slice(0, 50).map((z: any) => (
                          <tr key={z.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-gray-300">{new Date(z.timestamp).toLocaleDateString()}</td>
                            <td className="py-3 text-white font-bold">{z.clientName}</td>
                            <td className="py-3 text-green-400 font-bold">{formatUSD(z.totalSalesUSD)}</td>
                            <td className="py-3 text-purple-400 font-bold">{formatUSD(z.kfsFeesOwedUSD)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla de Usuarios Activos */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-[violet-600] font-black uppercase tracking-widest text-sm mb-4">Usuarios Activos en Red</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 block uppercase">Dueños</span>
                      <span className="text-2xl font-black text-white">{db.clients?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 block uppercase">Promotoras</span>
                      <span className="text-2xl font-black text-white">{db.promotoras?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 block uppercase">Delivery</span>
                      <span className="text-2xl font-black text-white">{db.riders?.length || 0}</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 block uppercase">Consumidores</span>
                      <span className="text-2xl font-black text-white">{db.customers?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tabla de Últimas Transacciones */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-[violet-600] font-black uppercase tracking-widest text-sm mb-4">Pipeline de Transacciones</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-gray-500 border-b border-white/10">
                        <tr>
                          <th className="pb-2">Fecha</th>
                          <th className="pb-2">Comprador</th>
                          <th className="pb-2">Tienda</th>
                          <th className="pb-2">Total USD</th>
                          <th className="pb-2">Método</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.transactions?.slice().reverse().slice(0, 50).map((t: any) => (
                          <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-gray-300">{new Date(t.timestamp).toLocaleTimeString()}</td>
                            <td className="py-3 text-gray-400">{t.customerName || t.customerPhone}</td>
                            <td className="py-3 text-white">{t.clientName}</td>
                            <td className="py-3 text-green-400 font-bold">{formatUSD(t.totalUSD)}</td>
                            <td className="py-3 text-gray-500 text-[10px] uppercase">{t.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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


        {activeTab === "db_manager" && (
          <DatabaseManagerWidget 
            db={db}
            deleteClient={deleteClient}
            deleteCustomer={deleteCustomer}
            deletePromotora={deletePromotora}
            deleteVendedor={deleteVendedor}
            rejectRider={rejectRider}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tienda_oficial" && (
          <div className="space-y-8 flex flex-col animate-fade-in relative">
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-[2rem] shadow-lg flex items-center justify-center mb-6">
                <Store className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-[violet-900] mb-2">Tienda Oficial KFS</h2>
              <p className="text-gray-500 font-bold mb-8 max-w-md">
                Administra el inventario del Marketplace Global (Flow Express). Los productos aquí subidos forzarán el consumo de K-Points.
              </p>
              
              <button 
                onClick={() => {
                  const oficialStore = db.clients?.find((c: any) => c.id === "kfs-express");
                  if (oficialStore) {
                    impersonateClient(oficialStore);
                  } else {
                    showToast("Error: No se encontró la tienda matriz en la DB.", "error");
                  }
                }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-slate-800 transition-all cursor-pointer shadow-xl hover:-translate-y-1 border-none"
              >
                <Database className="w-6 h-6 text-fuchsia-400" />
                Acceder como Dueño de Tienda
              </button>
            </div>
          </div>
        )}
      </div>


      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-around items-center relative">
          {[
            { id: "panel", icon: Activity, label: "Panel" },
            { id: "red", icon: Store, label: "Red KFS", badge: (db.riders?.filter((r: any) => r.status === "pending") || []).length },
            { id: "soporte", icon: Bell, label: "Soporte", badge: (db.clients.filter((c: any) => c.subscription?.status === 'pending_verification').length + (db.candidates?.filter((c: any) => c.registrationPaymentStatus === 'pending_approval').length || 0) + (db.unlockedContacts?.filter((u: any) => u.status === 'pending_approval').length || 0) + (db.supportTickets || []).filter((t: any) => t.status === 'open').length) },
            { id: "auditoria", icon: Shield, label: "Auditoría" },
            { id: "kyc", icon: FileText, label: "Bóveda KYC" },
            { id: "nodos", icon: QrCode, label: "Nodos KFS" },
            { id: "vista_dios", icon: Eye, label: "Vista Dios" },
            { id: "db_manager", icon: Database, label: "Gestión DB" },
            { id: "tienda_oficial", icon: Store, label: "Tienda KFS" }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
              >
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-[violet-600] rounded-b-full shadow-[0_4px_10px_rgba(197,161,132,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-[violet-900]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-[violet-900]' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

// Promotora Dashboard
const PromotoraDashboard = ({ db, setDb, currentUser, registerClient, upgradeToPremium, settlePromotoraEarnings, formatUSD, formatEUR, logout, registerVendedor }: any) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterVendedor, setShowRegisterVendedor] = useState(false);
  const [showCustomerRegister, setShowCustomerRegister] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [customizingClient, setCustomizingClient] = useState<any>(null);
  const { updateStoreSettings, replyTicket, validateTopUp } = useKFS() as any;
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

  return (
    <div className="min-h-screen bg-[#EEF2F5] pb-24 font-sans text-[violet-900] relative">
      {/* Wavy Header */}
      <div className="bg-gradient-to-br from-[violet-900] to-[#1a2b5e] rounded-b-[3rem] shadow-[0_10px_30px_rgba(10,17,40,0.3)] pt-6 pb-12 px-6 text-white relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-[violet-600]"><CheckCircle size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS Promotora</h1>
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
          <div className="w-16 h-16 bg-[violet-600] rounded-full flex items-center justify-center text-[violet-900] font-black text-2xl flex-shrink-0 shadow-lg border-4 border-[violet-900] relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{currentUser.name}</h2>
            <p className="text-[violet-600] font-mono text-xs mt-1 bg-[violet-900] inline-block px-2 py-0.5 rounded-md">{currentUser.phone}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto -mt-6 relative z-20 flex flex-col gap-8 animate-fade-in">
        <OracleInsightCard role="promoter" data={{ inactiveNode: myClients[0]?.company || 'N/A', remainingPioneerNodes: 100 - (db.clients?.length || 0) }} />

        {activeTab === "panel" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-violet-900 rounded-3xl p-6 text-white shadow-lg animate-fade-in">
              <div>
                <h3 className="font-black text-xl">¿Tienes tu propio negocio?</h3>
                <p className="text-violet-200 text-sm mt-1">Crea tu tienda oficial anclada a ti misma. Su validación será automática.</p>
              </div>
              <button 
                onClick={() => {
                  window.location.href = `/?role=register&ref=${currentUser.id}#login`;
                }}
                className="bg-white text-violet-900 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform cursor-pointer shadow-xl border-none"
              >
                Abrir Mi Propia Tienda
              </button>
            </div>
            <ReferralLinksWidget userId={currentUser.id} showToast={showToast} />
            <UniversalWalletWidget currentUser={myPromotoraData} formatUSD={formatUSD} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[violet-900] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/10 flex flex-col">
                <div className="relative z-10">
                  <p className="text-[violet-600] text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14} className="text-green-500" /> Regalías Liquidadas (BOS)</p>
                  <h2 className="text-5xl font-black mb-1 text-green-400">{formatEUR(myPromotoraData?.passiveEarningsEUR || 0)}</h2>
                  <p className="text-xs text-gray-400 mt-2">Modelo Revenue Share (20%)</p>
                  {(myPromotoraData?.passiveEarningsEUR || 0) > 0 && (
                    <button onClick={() => setShowPayoutModal(true)} className="w-full bg-[violet-600] text-[violet-900] py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform cursor-pointer shadow-lg flex justify-center items-center gap-2 mt-4">
                      <CheckCircle size={18} /> Solicitar Retiro
                    </button>
                  )}
                </div>
                <Activity size={100} className="absolute -right-10 -bottom-10 text-white/5" />
              </div>

              <div className="bg-gradient-to-br from-[violet-900] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/10 flex flex-col">
                <div className="relative z-10">
                  <p className="text-[violet-600] text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-white/50" /> Nodos Captados</p>
                  <h2 className="text-5xl font-black mb-1 text-white">{myPromotoraData?.setups || 0}</h2>
                  <p className="text-xs text-gray-400 mt-2">Comercios afiliados activos</p>
                </div>
                <Users size={100} className="absolute -right-10 -bottom-10 text-white/5" />
              </div>
            </div>

            {pendingTopUps.length > 0 && (
              <div className="bg-[violet-900] rounded-[2rem] shadow-sm border border-green-500/30 p-8 text-white mt-8 animate-fade-in">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-green-400"><DollarSign className="text-green-400" /> Recargas Pendientes por Validar</h3>
                <div className="space-y-4">
                  {pendingTopUps.map((t: any) => {
                    const user = t.userType === 'client' ? myClients.find((c: any) => c.id === t.userId) : myCustomers.find((c: any) => c.id === t.userId);
                    const name = t.userType === 'client' ? user?.company : user?.name;
                    return (
                      <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                          {t.screenshotBase64 && (
                            <a href={t.screenshotBase64} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 block hover:scale-105 transition-transform">
                              <img src={t.screenshotBase64} alt="Comprobante" className="w-full h-full object-cover" />
                            </a>
                          )}
                          <div>
                            <p className="font-bold text-sm text-gray-200">{name} <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-[violet-600] uppercase ml-2">{t.userType}</span></p>
                            <p className="text-xs text-gray-400 font-mono mt-1">Ref: {t.paymentReference} | {new Date(t.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="text-right flex-1 md:flex-none">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Monto a Acreditar</p>
                            <p className="text-xl font-black text-green-400">${t.amountUSD.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => validateTopUp(t.id, 'rejected', currentUser.id)} className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors cursor-pointer border border-red-500/50">
                              <X size={18} />
                            </button>
                            <button onClick={() => validateTopUp(t.id, 'approved', currentUser.id)} className="w-10 h-10 rounded-xl bg-green-500/20 hover:bg-green-500 hover:text-white text-green-500 flex items-center justify-center transition-colors cursor-pointer border border-green-500/50">
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

            <div className="bg-[violet-900] rounded-[2rem] shadow-sm border border-red-500/20 p-8 text-white mt-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-red-400"><Bell className="text-red-400" /> Tickets de Mis Comercios</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {(db.supportTickets || []).slice().reverse().filter((t: any) => {
                  const client = myClients.find((c: any) => c.id === t.clientId);
                  return client !== undefined;
                }).map((ticket: any) => {
                  const client = myClients.find((c: any) => c.id === ticket.clientId);
                  return (
                    <div key={ticket.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-200">[{ticket.status === 'open' ? '🔴 ABIERTO' : '🟢 CERRADO'}] {client?.company || "Comercio"} - {ticket.subject}</p>
                        <span className="text-[10px] text-gray-500 font-mono">{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-[violet-600]/30">
                        {ticket.messages.map((m: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-[violet-600]">{m.author}:</span> <span className="text-gray-300">{m.text}</span>
                          </div>
                        ))}
                      </div>
                      {ticket.status === 'open' && (
                        <div className="flex gap-2 mt-2">
                          <input type="text" id={`reply-promo-${ticket.id}`} placeholder="Respuesta..." className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[violet-600]" />
                          <button onClick={() => {
                            const input = document.getElementById(`reply-promo-${ticket.id}`) as HTMLInputElement;
                            if (input && input.value) {
                              replyTicket(ticket.id, `Promotora ${currentUser.name}`, input.value);
                              input.value = "";
                            }
                          }} className="bg-[violet-600] text-[violet-900] px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer hover:bg-[#b08d70]">Responder</button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {(db.supportTickets || []).filter((t: any) => myClients.find((c: any) => c.id === t.clientId)).length === 0 && (
                  <p className="text-gray-500 text-sm font-bold text-center py-4">No hay tickets de soporte activos.</p>
                )}
              </div>
            </div>

            {/* Manuals Section */}
            <div className="bg-[violet-900] text-white p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-6">Centro de Aprendizaje y Manuales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setActiveManual('sales')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <BookOpen size={32} className="text-[violet-600]" />
                  <span className="font-bold text-sm">Manual de Ventas</span>
                </button>
                <button onClick={() => setActiveManual('implementation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <Settings size={32} className="text-[violet-600]" />
                  <span className="font-bold text-sm">Guía de Implementación</span>
                </button>
                <button onClick={() => setActiveManual('installation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                  <DownloadCloud size={32} className="text-[violet-600]" />
                  <span className="font-bold text-sm">Setup Fiscal Proxy</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "negocios" && (
          <div className="space-y-6">
            {!showRegister ? (
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-4 gap-4">
                  <h3 className="text-xl font-black text-[violet-900]">Mis Comercios Activados</h3>
                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="Buscar comercio..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
                    </div>
                    <button onClick={() => setShowRegister(true)} className="bg-[violet-900] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md cursor-pointer">+ Nuevo Setup</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-violet-100 text-violet-700 uppercase text-xs font-black">
                      <tr>
                        <th className="py-4 px-4">Nodo Comercial</th>
                        <th className="py-4 px-4">Contacto</th>
                        <th className="py-4 px-4">Tarifa BOS</th>
                        <th className="py-4 px-4 text-center">Tienda</th>
                        <th className="py-4 px-4 text-right">Deuda KFS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((c: any) => (
                        <tr key={c.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-[violet-900]">
                            <div className="flex items-center gap-2">
                              {c.company}
                              {c.account_tier === 'free' && (
                                <button
                                  onClick={() => upgradeToPremium(c.id, currentUser.id)}
                                  className="bg-gradient-to-r from-[violet-600] to-yellow-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
                                >
                                  Upgrade $5
                                </button>
                              )}
                              {c.account_tier === 'premium' && (
                                <span className="bg-[violet-900] text-[violet-600] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm">
                                  Premium
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-500">{c.name}<br /><span className="text-xs font-mono">{c.phone}</span></td>
                          <td className="py-4 px-4 font-bold text-[violet-600]">{(c.kfsFeePercentage || 0.03) * 100}%</td>
                          <td className="py-4 px-4 text-center">
                            <button onClick={() => setCustomizingClient(c)} className="bg-gray-100 hover:bg-gray-200 text-[violet-900] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 mx-auto">
                              <Palette size={14} /> Diseño
                            </button>
                          </td>
                          <td className="py-4 px-4 font-black text-red-500 text-right">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                        </tr>
                      ))}
                      {myClients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">Sin nodos comerciales supervisados.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 max-w-2xl mx-auto">
                <RegisterClientForm onRegister={(data: any) => { registerClient(data, currentUser.id, data.kfsFeePercentage); setShowRegister(false); }} onCancel={() => setShowRegister(false)} standalone={false} />
              </div>
            )}
          </div>
        )}
      </div>

      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl">
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-[violet-900] transition-colors cursor-pointer z-10">
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
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-[violet-900] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[violet-900]">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[violet-900] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>

            {activeManual === 'sales' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[violet-600]" size={28} /> Manual de Ventas: KFS Ecosistema</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">1. Elevator Pitch (El Gancho):</p>
                    <p>Kreatek Flow Systems OS no es solo un punto de venta. Es un sistema operativo integral que fusiona facturación fiscal, control de inventario y un marketplace E-Commerce automatizado llamado "Flow Express".</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">2. Beneficio Principal (Comercio):</p>
                    <p>Eliminación de hardware obsoleto. Nuestro Sincro-Shield fiscal proxy permite conectar la nube directamente con impresoras fiscales sin pagar licencias de terceros anuales altísimas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">3. Beneficio Principal (Tú como Promotor):</p>
                    <p>Recibes <span className="font-black text-green-600">20% de Revenue Share (Regalías)</span> de por vida sobre las comisiones generadas por los nodos comerciales que afilies. Esto es ingreso pasivo real y escalable.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">4. Manejo de Objeciones:</p>
                    <p>"Ya tengo un sistema". Respuesta: "KFS es gratis de instalar y de licencia perpetua en la nube. Reemplazamos sus licencias caras y les damos E-Commerce gratis integrado en una sola app web."</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'implementation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings className="text-[violet-600]" size={28} /> Guía de Implementación KFS</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">1. Registro del Comercio:</p>
                    <p>En este panel, haz clic en "+ Nuevo Setup". Llena los datos reales del comercio, asignando el email del dueño y una clave genérica para su primer acceso.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">2. Configuración de Tarifa BOS:</p>
                    <p>El default es 3% del total facturado. Puedes negociar hasta un 1% para clientes de alto volumen. Ese % es de lo que tú ganarás el 20%.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">3. Personalización UI:</p>
                    <p>Usa el botón "Diseño" en la tabla de comercios para subir el logo del cliente, fondo y colores de su Flow Express Marketplace.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">4. Carga de Inventario:</p>
                    <p>Acompaña al dueño en la creación de los primeros 5 productos para asegurar que entienda cómo funciona el código de barras y la vinculación de precios base.</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'installation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><DownloadCloud className="text-[violet-600]" size={28} /> Setup Sincro-Shield Fiscal</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
                    <p className="font-black text-red-800 text-xs uppercase tracking-widest mb-1">Obligatorio por Ley SENIAT</p>
                    <p className="text-red-700 text-xs">Esta integración garantiza que el comercio cumpla con las normativas fiscales venezolanas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">1. Requisitos de Hardware:</p>
                    <p>Máquina fiscal compatible (Ej: The Factory HKA modelo Bixolon, Aclas) conectada por cable USB a la PC principal de Caja (Windows/Mac).</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">2. Descarga del Proxy Local:</p>
                    <p>En el dashboard del Cliente o Vendedor, se debe descargar "Sincro-Shield Fiscal Proxy" y tener Node.js instalado en el sistema operativo del cliente.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">4. Pruebas de Transmisión:</p>
                    <p>En KFS OS (Caja), abrir el Setup Sincro-Shield y presionar "Probar Conexión Proxy". Si responde, marcar la casilla "Imprimir Copias Fiscales por Defecto".</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "afiliados" && (
        <div className="space-y-6">
          {/* ── Captación Universal KFS — 3 QR Codes ─────────────────── */}
          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 text-[violet-900]">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><span>📡</span> Captación Universal KFS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">🏪 Dueños / Comercios</h4>
                <div className="w-36 h-36 bg-white rounded-xl border-2 border-violet-400 p-1.5 shadow-md">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://kfs-os.vercel.app?role=due%C3%B1o&ref=' + currentUser.id)}`} alt="QR Dueños" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-gray-500 leading-tight">Ganas <strong className="text-violet-700">50% de la cuota</strong> + 20% regalías de por vida.</p>
                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=due%C3%B1o&ref=' + currentUser.id); }} className="text-[10px] font-black text-violet-700 bg-violet-100 hover:bg-violet-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Comercios</button>
              </div>
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">👨‍💼 Fuerza de Ventas</h4>
                <div className="w-36 h-36 bg-white rounded-xl border-2 border-blue-400 p-1.5 shadow-md">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://kfs-os.vercel.app?role=vendedor&ref=' + currentUser.id)}`} alt="QR Vendedores" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-gray-500 leading-tight">Recluta vendedores para tus comercios y expande tu red de ventas físicas.</p>
                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=vendedor&ref=' + currentUser.id); }} className="text-[10px] font-black text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Vendedores</button>
              </div>
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-black text-lg mb-1">🛒 Clientes / Flow Express</h4>
                <div className="w-36 h-36 bg-white rounded-xl border-2 border-emerald-400 p-1.5 shadow-md">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id)}`} alt="QR Clientes" className="w-full h-full object-contain rounded-lg" loading="lazy" />
                </div>
                <p className="text-xs text-gray-500 leading-tight">Ganas <strong className="text-emerald-700">$1.00 USD</strong> cuando tu referido recarga sus primeros $5.00 USD.</p>
                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); }} className="text-[10px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Clientes</button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">Tu ID de Promotora: <span className="font-mono font-black text-violet-700">{currentUser.id}</span></p>
              <button onClick={() => setShowCustomerRegister(true)} className="bg-violet-700 text-white px-6 py-3 rounded-xl font-black shadow-md hover:bg-violet-900 transition-colors flex items-center gap-2 cursor-pointer text-sm"><UserPlus size={18} /> Registrar Cliente en Vivo</button>
            </div>
          </div>


          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
            <h3 className="text-lg font-black mb-4">Mis Clientes Afiliados ({myCustomers.length})</h3>
            {myCustomers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCustomers.map((c: any) => (
                  <div key={c.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50">
                    <div>
                      <p className="font-bold text-sm text-[violet-900]">{c.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{c.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-green-600 font-bold uppercase">Afiliado</p>
                      <p className="text-[10px] text-gray-400">{c.hasRecharged ? "Recargado" : "Pendiente Recarga"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">No tienes clientes afiliados todavía.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "vendedores" && (
        <div className="space-y-6">
          {!showRegisterVendedor ? (
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black text-[violet-900]">Vendedores Activados</h3>
                <button onClick={() => setShowRegisterVendedor(true)} className="bg-[violet-900] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md cursor-pointer">+ Nuevo Vendedor</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(db.vendedores || []).filter((v: any) => v.promotoraId === currentUser.id).map((v: any) => (
                   <div key={v.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[violet-900]">{v.name}</p>
                        <p className="text-xs text-gray-500">{v.email}</p>
                        {v.clientId && <p className="text-[10px] bg-[violet-600] text-[violet-900] font-bold px-2 py-0.5 rounded-md inline-block mt-1">Ref: {myClients.find((c: any) => c.id === v.clientId)?.company || v.clientId}</p>}
                      </div>
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase font-black">Activo</span>
                   </div>
                 ))}
                 {(db.vendedores || []).filter((v: any) => v.promotoraId === currentUser.id).length === 0 && (
                    <p className="text-sm text-gray-500">No hay vendedores registrados.</p>
                 )}
              </div>
            </div>
          ) : (
            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 max-w-2xl mx-auto">
              <div className="flex justify-between mb-4 items-center">
                <h3 className="text-xl font-black text-[violet-900]">Activar Nuevo Vendedor</h3>
                <button onClick={() => setShowRegisterVendedor(false)} className="text-gray-400 hover:text-black cursor-pointer"><X size={20}/></button>
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
                  <label className="text-xs font-bold text-gray-400 block mb-1">Nombre Completo</label>
                  <input name="vName" required className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" placeholder="Ej: Vendedor Alpha" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Correo Electrónico (Login)</label>
                  <input type="email" name="vEmail" required className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" placeholder="vendedor@kfs.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Contraseña</label>
                  <input type="password" name="vPassword" required className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" placeholder="*****" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Asignar a Comercio (Opcional)</label>
                  <select name="vClient" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:border-[violet-600] text-gray-700 placeholder:text-gray-400">
                    <option value="">Independiente (Sin Comercio Fijo)</option>
                    {myClients.map((c: any) => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-[violet-900] hover:bg-gray-800 transition-colors text-white py-4 rounded-xl font-black mt-6 shadow-md cursor-pointer">Activar y Registrar Vendedor</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Customer Register Modal */}
      {showCustomerRegister && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-2 shadow-2xl">
            <button onClick={() => setShowCustomerRegister(false)} className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black cursor-pointer"><X size={24} /></button>
            <div className="p-4 border-b border-gray-100 mb-4">
              <h3 className="text-xl font-black text-center text-[violet-900]">Registro Rápido de Cliente</h3>
              <p className="text-xs text-center text-gray-500 mt-1">Este cliente quedará atado a tu ID: <span className="font-mono font-bold text-indigo-600">{currentUser.id}</span></p>
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
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
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
                {isActive && <span className="absolute -top-4 w-12 h-1 bg-[violet-600] rounded-b-full shadow-[0_4px_10px_rgba(197,161,132,0.5)]" />}
                <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-[violet-900]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-[violet-900]' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

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
        image: productImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
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
                        <span>Espera Aprobación (Pago manual enviado)</span>
                      </div>
                    ) : isPaying ? (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 animate-slide-up">
                        <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-500">Forma de Pago</span>
                          <span className="font-black text-[violet-900]">Monto: $10.00 USD</span>
                        </div>

                        {unlockStatus === "rejected" && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[10px] font-bold text-red-700 leading-tight">
                            ⚠️ Su reporte de pago anterior fue RECHAZADO por el administrador. Por favor, verifique la referencia y capture y reenvíe el reporte.
                          </div>
                        )}

                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[10px] text-amber-900 space-y-1 font-mono leading-tight">
                          <p className="font-black border-b border-amber-200/50 pb-1">DATOS DE TRANSFERENCIA DIRECTA ($10 USD):</p>
                          <p>Zinli/Wally/AirTM: <strong>master@kreatek.com</strong></p>
                          <p>Pago Móvil: <strong>Banesco (0414-1234567) RIF: J-4019283-2</strong></p>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Número de Referencia"
                            value={refNum}
                            onChange={e => setRefNum(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file, 400);
                                  setScreenshot(base64);
                                } catch (err) {
                                  alert("Error al comprimir la imagen");
                                }
                              }
                            }}
                            className="w-full text-[10px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setPayingCandidateId(null)}
                            className="w-1/3 bg-gray-200 text-gray-600 font-bold rounded-xl text-xs py-2 cursor-pointer"
                          >
                            Atrás
                          </button>
                          <button
                            onClick={handleProcessUnlock}
                            className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs py-2 cursor-pointer"
                          >
                            Enviar Reporte Pago
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {unlockStatus === "rejected" && (
                          <div className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg p-2 text-center">
                            ❌ Pago de desbloqueo anterior rechazado
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
        <div className="fixed inset-0 z-[11000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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

const ClientDashboard = ({ db, setDb, currentUser, addProduct, addExpense, showToast, formatUSD, formatEUR, logout, approveOrder, rejectOrder, dispatchOrder, paySubscription, requestPayout, requestTopUp }: any) => {
  const { finishOnboarding } = useKFS();
  const clientInfo = db.clients?.find((c: any) => c.id === currentUser.id) || currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("resumen"); // resumen | inventario | personal | config
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddVendedor, setShowAddVendedor] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState<any>(null); // Holds vendedor obj
  const [payrollBaseSalary, setPayrollBaseSalary] = useState("");
  const [searchVendedor, setSearchVendedor] = useState("");

  const [newProd, setNewProd] = useState({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [newVendedor, setNewVendedor] = useState({ name: "", email: "", password: "", avatar: "" });
  const [newExpense, setNewExpense] = useState({ description: "", amountUSD: "" });
  const [smsInput, setSmsInput] = useState("");
  const [activeManual, setActiveManual] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { createTicket, fundWallet, processMonthlyBilling, createVale, payVale, processPayroll, queryGlobalBarcode, smsConciliator, rates, toggleLoyaltyProgram, updateStoreSettings, updatePaymentMethods, toggleProductFeatured, stopImpersonating, registerPosTerminal, deletePosTerminal, assignRiderToBusiness, removeRiderFromBusiness, assignDeliveryToOrder, toggleBusinessOpen, updateBusinessConfig } = useKFS() as any;
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(clientInfo?.deliveryRadiusKm || 5);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      if (lines.length > 1) {
        const newProducts: any[] = [];
        lines.slice(1).forEach(line => {
          if (!line.trim()) return;
          const cols = line.split(',');
          if (cols.length >= 2) {
            const name = cols[0]?.trim();
            const price = parseFloat(cols[1]?.trim());
            const stock = parseInt(cols[2]?.trim() || "0");
            const category = cols[3]?.trim() || "Importados";
            const barcode = cols[4]?.trim() || "";
            if (name && !isNaN(price)) {
              newProducts.push({
                id: `p${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                priceUSD: price,
                costUSD: price * 0.7,
                stock,
                category,
                barcode,
                image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500",
                clientId: currentUser.id,
                clientName: currentUser.company,
                timestamp: new Date().toISOString()
              });
            }
          }
        });

        if (newProducts.length > 0) {
          setDb((prev: any) => ({
            ...prev,
            products: [...prev.products, ...newProducts]
          }));
          showToast(`¡Se importaron ${newProducts.length} productos con éxito desde CSV!`, "success");
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualSmsConciliation = () => {
    if (!smsInput.trim()) return;
    const result = smsConciliator(smsInput);
    if (result.matched) {
      playPremiumChime();
      showToast(`¡Conciliación Exitosa! Orden auto-aprobada por SMS. Ref: ${result.reference}`, "success");
      setSmsInput("");
    } else {
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(`SMS leído (Ref: ${result.reference || "Desconocida"}, Bs. ${result.amount || 0}), pero no coincide con ninguna orden online pendiente.`, "error");
      }
    }
  };

  const shieldMargin = (productId: string, newPrice: number) => {
    setDb((prev: any) => ({
      ...prev,
      products: prev.products.map((p: any) => p.id === productId ? { ...p, priceUSD: parseFloat(newPrice.toFixed(2)) } : p)
    }));
    showToast("Margen blindado con éxito en el canal POS y Flow Express.", "success");
  };

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode) return;
    setIsFetchingBarcode(true);
    try {
      // 1. Consultar el Catálogo Nacional de Venezuela (Garantía offline-first)
      const globalProd = await queryGlobalBarcode(barcode);
      if (globalProd) {
        setNewProd(prev => ({
          ...prev,
          name: globalProd.name,
          imgUrl: globalProd.imgUrl,
          category: globalProd.category || prev.category
        }));
        showToast(`¡Producto encontrado en Catálogo Venezolano! (${globalProd.brand})`, "success");
        setIsFetchingBarcode(false);
        return;
      }

      // 2. Fallback a Open Food Facts global
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setNewProd(prev => ({
          ...prev,
          name: data.product.product_name || data.product.product_name_es || prev.name,
          imgUrl: data.product.image_url || prev.imgUrl
        }));
        showToast("¡Producto encontrado en la base global!", "success");
      } else {
        showToast("Producto no encontrado en base global. Complete manualmente.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error consultando base de datos. Complete manualmente.");
    }
    setIsFetchingBarcode(false);
  };

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.id);
  const myVendedores = db.vendedores?.filter((v: any) => v.clientId === currentUser.id) || [];
  const myExpenses = db.expenses?.filter((e: any) => e.clientId === currentUser.id) || [];
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.id && o.status === 'pending') || [];
  const myPendingDispatch = db.transactions?.filter((tx: any) => tx.clientId === currentUser.id && tx.shippingStatus === 'pending') || [];

  const totalExpensesUSD = myExpenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amountUSD), 0);
  const grossSalesUSD = clientInfo.salesUSD || 0;
  const netProfitUSD = grossSalesUSD - totalExpensesUSD;

  const myTransactions = db.transactions.filter((tx: any) =>
    db.products.find((p: any) => p.id === tx.productId)?.clientId === currentUser.id
  );
  const clientChartData = myTransactions.map((t: any, index: number) => ({
    name: `Venta ${index + 1}`,
    amount: t.amountUSD
  })).slice(-15);

  const lowStockProducts = myProducts.filter((p: any) => p.stock !== undefined && p.stock < 5);
  const stagnantProducts = myProducts.filter((p: any) => {
    if (p.stock === undefined || p.stock <= 0) return false;
    const daysSinceSold = p.lastSoldAt ? (new Date().getTime() - new Date(p.lastSoldAt).getTime()) / (1000 * 3600 * 24) : 16; // default 16 if never sold
    return daysSinceSold > 15;
  });

  // Filter CRM to this client's transactions? Wait, CRM is global right now based on phone.
  // Actually, we'll just show the global CRM filtered by those who bought from this client
  const myClientTxs = db.transactions.filter((tx: any) => tx.clientId === currentUser.id && tx.customerPhone);
  const myUniquePhones = Array.from(new Set(myClientTxs.map((tx: any) => tx.customerPhone)));
  const myCrm = db.crm?.filter((c: any) => myUniquePhones.includes(c.phone)) || [];

  const myZReports = db.zReports?.filter((z: any) => z.clientId === currentUser.id) || [];

  useEffect(() => {
    const handleStoreSale = (e: any) => {
      if (e.detail.clientId === currentUser.id) {
        showToast(`💰 Venta registrada en tu red: ${e.detail.name} (+${formatUSD(e.detail.priceUSD)})`);
      }
    };
    window.addEventListener("kfs-purchase", handleStoreSale);
    return () => window.removeEventListener("kfs-purchase", handleStoreSale);
  }, [currentUser.id, showToast, formatUSD]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await compressImage(file, 400, 0.6);
        setNewProd(prev => ({ ...prev, imgUrl: base64String }));
      } catch (error) {
        showToast("Error comprimiendo imagen", "error");
      }
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newProd.price);
    const parsedCost = parseFloat(newProd.cost) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast("El precio de venta debe ser mayor a 0", "error");
      return;
    }
    if (parsedCost > 0 && parsedPrice <= parsedCost) {
      showToast("El precio de venta debe ser mayor al costo de insumo", "error");
      return;
    }

    addProduct({
      name: newProd.name,
      priceUSD: parsedPrice,
      costUSD: parsedCost,
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      clientId: currentUser.id,
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode,
      description: newProd.description,
      timestamp: new Date().toISOString()
    });
    setNewProd({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
    setShowAddModal(false);
  };

  const changeTier = (tier: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, kfsTier: tier } : c)
    }));
    showToast(`Nivel Operativo actualizado a ${tier.toUpperCase()}`, "success");
  };

  const handleAddVendedor = (e: React.FormEvent) => {
    e.preventDefault();
    const added = { ...newVendedor, id: `v${Date.now()}`, clientId: currentUser.id, company: currentUser.company };
    setDb((prev: any) => ({ ...prev, vendedores: [...prev.vendedores, added] }));
    setNewVendedor({ name: "", email: "", password: "", avatar: "" });
    setShowAddVendedor(false);
    showToast("Vendedor autorizado y registrado.");
  };

  const isPastDue = clientInfo.subscription?.status === 'past_due' || (clientInfo.subscription?.nextBillingDate && new Date() > new Date(clientInfo.subscription.nextBillingDate));
  const isPendingVerification = clientInfo.subscription?.status === 'pending_verification';

  if (isPastDue || isPendingVerification) {
    return (
      <div className="min-h-screen bg-[violet-900] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-10 border-t-8 border-[violet-600] animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[violet-600]/5 z-0 pointer-events-none"></div>

          <Lock size={64} className="text-[violet-600] mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-black text-[violet-900] mb-2 relative z-10">
            {isPendingVerification ? "Pago en Verificación" : "Suscripción Vencida"}
          </h2>
          <p className="text-gray-600 mb-8 font-bold relative z-10 text-lg">
            {isPendingVerification
              ? "Tu comprobante de pago ha sido enviado al equipo Kreatek Core y está siendo auditado. Tu tienda se reactivará en breve."
              : "Tu membresía mensual a KFS OS ($6) se encuentra vencida. Tu tienda está pausada."}
          </p>

          {!isPendingVerification && (
            <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none p-6 rounded-2xl mb-8 relative z-10 placeholder:text-gray-400">
              <h3 className="font-bold text-[violet-900] mb-4">¿Cómo reactivar tu Tienda?</h3>
              <p className="text-sm text-gray-500 mb-4">Transfiere $6 USD vía Zinli, AirTM, Wally, Ubbi, Binance Pay o Pago Móvil y escribe la referencia bancaria a continuación:</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const ref = (e.target as any).reference.value;
                paySubscription(currentUser.id, ref);
              }} className="space-y-4">
                <input
                  type="text"
                  name="reference"
                  required
                  placeholder="Ej: 12345678"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[violet-600] focus:outline-none"
                />
                <button type="submit" className="w-full bg-[violet-600] text-white font-black py-4 rounded-xl hover:bg-[#b08e72] transition-colors cursor-pointer flex justify-center items-center gap-2 shadow-md">
                  <Upload size={18} /> Enviar Comprobante al Core
                </button>
              </form>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-orange-300/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">K-Pts</span>
              <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>
            </div>
            <button onClick={logout} className="text-gray-400 font-bold hover:text-red-500 transition relative z-10 cursor-pointer">
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (clientInfo.isOnboarded === false) {
    return <OnboardingWizard currentUser={currentUser} finishOnboarding={finishOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#EEF2F5] pb-24 font-sans text-[violet-900] relative">
      {currentUser?.isImpersonated && (
        <div className="bg-amber-500 text-[violet-900] px-4 py-3 font-bold text-center flex items-center justify-center gap-4 text-sm shadow-md animate-pulse sticky top-[64px] z-50">
          <span>⚠️ MODO IMPERSONACIÓN ACTIVO: Estás controlando el panel de {currentUser.company}</span>
          <button onClick={stopImpersonating} className="bg-[violet-900] text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors shadow cursor-pointer">
            Regresar a Panel Core
          </button>
        </div>
      )}

      {/* Neumorphic / Purple Header */}
      <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-b-[3rem] shadow-[0_15px_30px_rgba(139,92,246,0.3)] pt-6 pb-12 px-6 text-white relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-white"><Store size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS Negocio</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-violet-600 font-black text-2xl flex-shrink-0 shadow-lg border-none relative z-20">
            <ProfileAvatarEditor currentUser={currentUser} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">{currentUser.company}</h2>
            <p className="text-gray-300 font-mono text-xs mt-1 truncate max-w-[200px]">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20 space-y-6 animate-fade-in">


        {activeTab === "resumen" && (
          <div className="space-y-6">
            <div className="bg-[#EEF2F5] p-8 md:p-12 rounded-[2.5rem] shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] relative overflow-hidden text-[violet-900]">
              <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                  <p className="text-violet-500 text-xs font-black uppercase tracking-widest mb-4">Ganancia Neta (USD)</p>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-[violet-900]"><AnimatedCounter value={netProfitUSD} format={formatUSD} /></h2>
                  <div className="flex gap-4 text-sm font-bold text-gray-500">
                    <span>Ventas Brutas: <span className="text-emerald-500"><AnimatedCounter value={grossSalesUSD} format={formatUSD} /></span></span>
                    <span>Gastos: <span className="text-rose-500">-<AnimatedCounter value={totalExpensesUSD} format={formatUSD} /></span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] px-4 py-2 rounded-xl border-none placeholder:text-gray-400">
                      <span className="text-xs font-bold text-gray-500">Plan Base:</span>
                      <select
                        value={currentUser.kfsTier || 'matrix'}
                        onChange={(e) => changeTier(e.target.value)}
                        className="bg-transparent text-sm font-black text-violet-600 focus:outline-none cursor-pointer"
                      >
                        <option value="velocity" className="text-black bg-white">Flow Velocity (3%)</option>
                        <option value="matrix" className="text-black bg-white">Flow Matrix (5%)</option>
                        <option value="monopoly" className="text-black bg-white">Flow Monopoly (10%)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] px-4 py-2 rounded-xl border-none placeholder:text-gray-400">
                      <span className="text-xs font-bold text-gray-500">Tasa KFS Activa (Oráculo):</span>
                      <span className="text-sm font-black text-violet-600">
                        {currentUser.oracle_fee_percentage !== undefined && currentUser.oracle_fee_percentage !== null
                          ? currentUser.oracle_fee_percentage
                          : (currentUser.kfsTier === 'velocity' ? 3 : currentUser.kfsTier === 'monopoly' ? 10 : 5)}%
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setShowExpenseModal(true)} className="bg-violet-500 text-white font-black px-6 py-3 rounded-xl shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-transform border-none">
                    Registrar Gasto
                  </button>
                </div>
              </div>
              <DollarSign size={200} className="absolute -right-10 -bottom-20 text-violet-500/5" />
            </div>

            {/* Peaje Gamificado Progress */}
            <div className="bg-[#EEF2F5] rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] p-8 flex flex-col md:flex-row items-center gap-8 border-none">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-black text-[violet-900] text-lg">Progreso de Peaje Gamificado</h3>
                  <span className="text-sm font-bold text-violet-500">{clientInfo?.onboardedUsers || 0} / 50 Usuarios</span>
                </div>
                <div className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] h-4 rounded-full overflow-hidden placeholder:text-gray-400">
                  <div className="bg-violet-500 h-full transition-all duration-1000" style={{ width: `${Math.min(((clientInfo?.onboardedUsers || 0) / 50) * 100, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Logra que 50 clientes se afilien usando tu código o QR y tu comisión B2B se reducirá automáticamente al 3% de forma permanente.
                </p>
              </div>
              <div className="w-32 h-32 bg-[#EEF2F5] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] rounded-xl border-none flex items-center justify-center flex-shrink-0 text-center relative p-3">
                <div className="text-center w-full h-full">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://kfs-os.vercel.app/#landing?ref=' + currentUser.id)}`} alt="Tu QR" className="w-full h-full object-contain mix-blend-multiply rounded-lg" />
                </div>
              </div>
            </div>
            
            <OracleInsightCard role="owner" data={{ topProduct: "Combo Kreatek" }} />
          </div>
        )}

        {activeTab === 'config' && <StorefrontCustomizer client={clientInfo} updateStoreSettings={updateStoreSettings} />}

        {/* ===== OPEN / CLOSE TOGGLE + DELIVERY CONFIG ===== */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Open / Close */}
            <div className="bg-[#EEF2F5] rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-6 flex flex-col gap-4">
              <h4 className="font-black text-[violet-900] flex items-center gap-2"><Store size={20} className="text-violet-500" /> Estado del Negocio</h4>
              <div className="flex items-center justify-between bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] rounded-2xl p-4 placeholder:text-gray-400">
                <div>
                  <p className="font-black text-sm text-[violet-900]">{clientInfo.isOpen !== false ? '🟢 Abierto' : '🔴 Cerrado'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tus clientes verán este estado en tu tienda</p>
                </div>
                <button
                  onClick={() => toggleBusinessOpen(currentUser.id)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${clientInfo.isOpen !== false ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${clientInfo.isOpen !== false ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Horario de Atención</p>
                {['Lun-Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 w-14">{day}</span>
                    <input type="time" defaultValue="08:00" className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-lg px-2 py-1 text-xs flex-1 placeholder:text-gray-400" />
                    <span className="text-xs text-gray-400">–</span>
                    <input type="time" defaultValue="18:00" className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-lg px-2 py-1 text-xs flex-1 placeholder:text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery zone */}
            <div className="bg-[#EEF2F5] rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-6 flex flex-col gap-4">
              <h4 className="font-black text-[violet-900] flex items-center gap-2"><Truck size={20} className="text-emerald-500" /> Zona de Delivery</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                    Radio máximo: <span className="text-emerald-500">{deliveryRadiusKm} km</span>
                  </label>
                  <input
                    type="range" min={1} max={30} value={deliveryRadiusKm}
                    onChange={e => setDeliveryRadiusKm(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1">
                    <span>1 km</span><span>15 km</span><span>30 km</span>
                  </div>
                </div>
                <div className="bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl p-3 text-xs text-emerald-600 font-bold placeholder:text-gray-400">
                  📦 Solo se aceptarán pedidos dentro de {deliveryRadiusKm} km del negocio.
                </div>
                <button
                  onClick={() => updateBusinessConfig(currentUser.id, { deliveryRadiusKm })}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black hover:scale-105 shadow-[0_10px_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all text-sm cursor-pointer border-none"
                >
                  Guardar Configuración de Zona
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && <FiscalPrinterSetupWidget />}

        {activeTab === 'personal' && <RecruitmentWidget db={db} currentUser={currentUser} formatUSD={formatUSD} />}

        {/* Manuals Section for Client (Owner) */}
        {activeTab === 'resumen' && (
          <div className="bg-violet-600 text-white p-6 md:p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(139,92,246,0.3)] relative overflow-hidden border-none">
            <h3 className="text-xl font-black mb-6">Centro de Aprendizaje (Dueño de Negocio)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setActiveManual('owner')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                <BookOpen size={32} className="text-violet-200" />
                <span className="font-bold text-sm">Manual de Uso del Sistema</span>
              </button>
              <button onClick={() => setActiveManual('benefits')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
                <Star size={32} className="text-violet-200" />
                <span className="font-bold text-sm">Whitepaper de Beneficios KFS</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {activeTab === 'inventario' && (
            <>
              <button onClick={() => setShowAddModal(true)} className="bg-[#EEF2F5] border-none p-8 rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] flex flex-col items-center justify-center gap-5 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] rounded-full flex items-center justify-center placeholder:text-gray-400">
                  <Package size={32} className="text-violet-500" />
                </div>
                <span className="font-black text-lg text-[violet-900]">Subir Producto</span>
              </button>

              <div className="bg-[#EEF2F5] border-none p-8 rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] flex flex-col items-center justify-center gap-5 transition-all relative overflow-hidden">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} className="hidden" />
                <div className="w-16 h-16 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] rounded-full flex items-center justify-center placeholder:text-gray-400">
                  <DownloadCloud size={32} className="text-emerald-500" />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="font-black text-lg text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer text-center leading-tight">Importar Inventario<br /><span className="text-xs font-bold text-gray-400">Desde Excel/CSV</span></button>
              </div>

              <button onClick={() => setShowTicketModal(true)} className="bg-violet-600 text-white p-8 rounded-[2rem] shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none hover:shadow-[0_15px_30px_rgba(139,92,246,0.4)] flex flex-col items-center justify-center gap-5 transition-all relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-white/5 animate-pulse group-hover:bg-white/10 transition-colors"></div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center relative z-10">
                  <Bell size={32} className="text-white" />
                </div>
                <span className="font-black text-lg text-white relative z-10">Help Desk (Tickets)</span>
              </button>
            </>
          )}
        </div>

        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-[#EEF2F5] p-6 md:p-8 rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none h-full">
              <h3 className="font-black text-xl text-[violet-900] mb-6 flex items-center gap-2"><TrendingUp className="text-violet-500" /> Rendimiento de Ventas</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clientChartData}>
                    <defs>
                      <linearGradient id="colorClientSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={10} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={4} fill="url(#colorClientSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-[#EEF2F5] p-6 md:p-8 rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none h-full flex flex-col">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Star className="text-violet-500" /> Productos Estrella</h3>
              <div className="space-y-4">
                {myProducts.slice(0, 4).map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] p-4 rounded-xl border-none placeholder:text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-100 text-violet-600 font-black h-8 w-8 rounded-full flex items-center justify-center">#{i + 1}</div>
                      <span className="font-bold">{p.name}</span>
                    </div>
                    <span className="font-black text-violet-600">{formatUSD(p.priceUSD)}</span>
                  </div>
                ))}
                {myProducts.length === 0 && <p className="text-gray-400 text-sm font-bold">Aún no hay productos.</p>}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'resumen' && (
            <div className="bg-violet-600 text-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_20px_rgba(139,92,246,0.3)] relative overflow-hidden border-none h-full">
              <h3 className="font-black text-xl mb-2 flex items-center gap-2"><Activity className="text-violet-200" /> Kreatek Insights (IA)</h3>
              <p className="text-xs text-violet-200 mb-6">Motor de predicción de inventario activo.</p>
              <div className="space-y-4">
                <div className="bg-white/20 border-none rounded-xl p-4 flex gap-4">
                  <span className="text-2xl">🤖</span>
                  <p className="text-sm text-white">He analizado tus productos estrella. Te sugiero aumentar un 5% el precio del producto top 1, la rotación soporta el margen.</p>
                </div>
                <div className="bg-white/20 border-none rounded-xl p-4 flex gap-4">
                  <span className="text-2xl">⚡</span>
                  <p className="text-sm text-white">Tus ventas en horario matutino cayeron un 12%. Te sugiero lanzar un SMS Push "Oferta Mañanera" desde Flow Express.</p>
                </div>
              </div>
            </div>
        )}

        {activeTab === 'resumen' && (
            <UniversalWalletWidget currentUser={clientInfo} formatUSD={formatUSD}>
              <div className="flex flex-col gap-4 mt-2">
                <p className="text-xs text-gray-400 mb-2">Suscripción SaaS Activa: $6/mes. Próximo cobro: {new Date(clientInfo.subscription?.nextBillingDate).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Monto $USD" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-gray-500" />
                  <button onClick={() => { if (fundAmount) { setIsTopUpOpen(true); } }} className="w-1/2 bg-emerald-500 text-white font-black rounded-xl cursor-pointer hover:scale-105 shadow-[0_5px_15px_rgba(16,185,129,0.3)] transition-transform border-none text-xs">Recargar Saldo</button>
                  <TopUpModal
                    isOpen={isTopUpOpen}
                    onClose={() => setIsTopUpOpen(false)}
                    amount={fundAmount}
                    setAmount={setFundAmount}
                    onSubmit={(amount: number, ref: string, img: string) => {
                      requestTopUp(currentUser.id, 'client', amount, ref, img);
                    }}
                    userType="client"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowPayoutModal(true)} className="w-1/2 bg-white/10 text-white font-black py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-colors border border-white/10 text-xs">Retirar Fondos</button>
                  <button onClick={() => processMonthlyBilling(currentUser.id)} className="w-1/2 bg-red-500/20 text-red-400 font-bold py-2 rounded-xl border border-red-500/30 text-[10px] cursor-pointer hover:bg-red-500/30">Simular Cobro</button>
                </div>
              </div>
            </UniversalWalletWidget>
        )}

        {activeTab === 'personal' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2"><Users className="text-[violet-600]" /> Control de Empleados</h3>
              <div className="flex gap-4">
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar vendedor..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
                </div>
                <button onClick={() => setShowAddVendedor(true)} className="text-sm font-bold text-white bg-[violet-900] px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">+ Añadir Vendedor</button>
              </div>
            </div>
            <div className="space-y-3">
              {myVendedores.filter((v: any) => v.name?.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email?.toLowerCase().includes(searchVendedor.toLowerCase())).map((v: any) => (
                <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    {v.avatar ? (
                      <img src={v.avatar} className="w-10 h-10 rounded-full object-cover border border-[violet-600]/40" alt="Avatar" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[violet-900]/10 text-[violet-900] font-black text-xs flex items-center justify-center border border-[violet-900]/20">
                        {v.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-[violet-900]">{v.name}</span>
                      <span className="text-xs text-gray-500 font-mono">{v.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">Activo</span>
                    <button onClick={() => setShowPayrollModal(v)} className="bg-[violet-900] text-[violet-600] border border-[violet-600]/50 text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-[violet-600] hover:text-[violet-900] transition-colors cursor-pointer uppercase tracking-wider">
                      Liquidar Nómina
                    </button>
                  </div>
                </div>
              ))}
              {myVendedores.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin empleados. Añada vendedores para usar los terminales móviles.</p>}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[violet-600]/5 rounded-bl-[100px] -z-10"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2"><DollarSign className="text-[violet-600]" /> Datos Oficiales de Liquidación KFS</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-gray-200">Transferencia Directa</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Entidad Bancaria</span>
                <span className="font-black text-sm text-[violet-900]">Banco Nacional de Crédito (BNC)</span>
              </div>
              <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Teléfono (Pago Móvil)</span>
                <span className="font-mono font-bold text-sm text-[violet-900]">0412-7740041</span>
              </div>
              <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Cédula de Identidad</span>
                <span className="font-mono font-bold text-sm text-[violet-900]">V-25.218.648</span>
              </div>
            </div>
          </div>
        )}

        {/* Widget de Cierre y Publicidad para el Dueño */}
        {activeTab === 'resumen' && (
          <div className="bg-gradient-to-br from-[violet-900] to-[#141E3A] text-white p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5 animate-fade-in w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[violet-600]/5 rounded-full blur-3xl -z-10"></div>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10">

              {/* Columna 1: Liquidación Obligatoria al Cierre */}
              <div className="flex-1 flex flex-col justify-between p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                <div className="space-y-2">
                  <span className="text-[violet-600] text-[10px] font-black uppercase tracking-widest block font-mono">Cierre de Caja & Liquidación</span>
                  <h3 className="text-xl font-black text-white">Pago Requerido al Cierre</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Para habilitar la sincronización en la nube de tu terminal el día de mañana, debes liquidar tu balance de comisiones BOS de la jornada actual.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">TOTAL A REPORTAR:</span>
                    <span className="text-3xl font-black text-red-400 font-mono">{formatUSD(currentUser.kfsFeesOwedUSD || 0)}</span>
                  </div>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/584127740041?text=Hola Kreatek, soy el local *${currentUser.company}*. Adjunto comprobante de pago de BOS diario correspondiente a la deuda de *${formatUSD(currentUser.kfsFeesOwedUSD || 0)}*.`, '_blank');
                      window.dispatchEvent(new CustomEvent('kfs-payment-alert', { detail: { company: currentUser.company, amount: currentUser.kfsFeesOwedUSD } }));
                      showToast("Abriendo WhatsApp y notificando a KFS Core...", "success");
                    }}
                    className="bg-[violet-600] text-[violet-900] font-black text-xs px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={14} /> Reportar Pago
                  </button>
                </div>
              </div>

              {/* Columna 2: Inversión en Publicidad del Día Siguiente */}
              <div className="flex-1 flex flex-col justify-between p-6 bg-indigo-950/40 rounded-2xl border border-indigo-500/20 relative">
                <div className="space-y-2">
                  <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest block font-mono">Plan de Tracción de Tráfico</span>
                  <h3 className="text-xl font-black text-white">Inversión en Publicidad KFS</h3>
                  <p className="text-xs text-indigo-200/70 leading-relaxed">
                    El oráculo de KFS OS reinyecta automáticamente el **20% de tu tarifa BOS diaria** en campañas de publicidad geolocalizada mañana.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-500/20 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-indigo-300 block font-bold">PRESUPUESTO ASIGNADO PARA MAÑANA:</span>
                    <span className="text-3xl font-black text-green-400 font-mono">
                      {formatUSD((currentUser.kfsFeesOwedUSD || 0) * 0.20)}
                    </span>
                  </div>
                  <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[9px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Tráfico Garantizado
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'config' && <KFSIoTEdgeConsole showToast={showToast} />}

        {/* Vales & Créditos Widget */}
        {activeTab === 'personal' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2 text-[violet-600]">
                🎫 Vales y Créditos Digitales
              </h3>
              <span className="bg-[violet-600]/15 border border-[violet-600]/30 text-[violet-600] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Conciliación Automática
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emitir Vale Form */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Emitir Nuevo Vale / Crédito</span>
                <form onSubmit={e => {
                  e.preventDefault();
                  const target = e.target as any;
                  const recipientName = target.recipient.value;
                  const type = target.type.value;
                  const amountUSD = parseFloat(target.amount.value);
                  const surchargePct = parseFloat(target.surcharge.value);
                  const dueDate = target.dueDate.value;

                  createVale({
                    recipientName,
                    type,
                    amountUSD,
                    surchargePct,
                    dueDate
                  });

                  target.reset();
                }} className="space-y-3">
                  <input required name="recipient" placeholder="Telf. Cliente CRM o Nombre Vendedor" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none" />
                  <select name="type" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                    <option value="credito_cliente">Crédito a Cliente (CRM)</option>
                    <option value="adelanto_nomina">Adelanto de Nómina</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="number" step="0.01" name="amount" placeholder="Monto ($)" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none" />
                    <select name="surcharge" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                      <option value="0.00">Sin Recargo</option>
                      <option value="0.03">Recargo 3%</option>
                      <option value="0.05">Recargo 5%</option>
                      <option value="0.08">Recargo 8%</option>
                      <option value="0.10">Recargo 10%</option>
                    </select>
                  </div>
                  <input required type="date" name="dueDate" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-mono" />
                  <button type="submit" className="w-full py-3 bg-[violet-900] hover:bg-gray-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                    Emitir Vale Criptográfico &rarr;
                  </button>
                </form>
              </div>

              {/* List of active Vales */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Gobernanza de Cuentas y Adelantos Pendientes</span>
                <div className="overflow-x-auto max-h-60 border border-gray-100 rounded-xl bg-gray-50/50 p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] font-black sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-lg">Vale / Beneficiario</th>
                        <th className="py-2.5 px-2">Tipo</th>
                        <th className="py-2.5 px-2">Vencimiento</th>
                        <th className="py-2.5 px-2">Total Adeudado</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(db.vales || []).map((v: any) => (
                        <tr key={v.id} className="border-b border-gray-100/50 hover:bg-white transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-black text-[violet-900] block">{v.id}</span>
                            <span className="text-[10px] text-gray-500 font-bold block">{v.recipientName}</span>
                          </td>
                          <td className="py-3 px-2 font-bold text-gray-600">
                            {v.type === "adelanto_nomina" ? "💼 Nómina" : "🛍️ Cliente"}
                          </td>
                          <td className="py-3 px-2 font-mono text-gray-500">{v.dueDate}</td>
                          <td className="py-3 px-2">
                            <span className="font-black text-red-500">{formatUSD(v.totalDueUSD)}</span>
                            {v.surchargePct > 0 && <span className="text-[9px] text-orange-500 font-bold block">Recargo: +{v.surchargePct * 100}%</span>}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {v.status === "pending" ? (
                              <button onClick={() => {
                                const payAmount = parseFloat(prompt("Ingrese el monto del abono en USD ($):", v.totalDueUSD.toFixed(2)) || "0");
                                if (payAmount > 0) {
                                  payVale(v.id, payAmount);
                                }
                              }} className="bg-green-100 text-green-700 font-black px-2.5 py-1.5 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                                Abonar
                              </button>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 font-black px-2 py-1 rounded uppercase tracking-wider text-[8px]">Cancelado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(db.vales || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400 font-bold">No hay vales ni créditos pendientes registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Lógica Empresarial / Analítica */}
        {activeTab === 'resumen' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2">
                📊 Inteligencia de Mercado y Metas KFS
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[violet-900] text-white p-6 rounded-2xl border border-[violet-600]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[violet-600]/10 rounded-full blur-3xl" />
                <h4 className="text-[10px] font-black uppercase text-[violet-600] mb-2 font-mono">Caja & Ganancias Disponibles</h4>
                <p className="text-3xl font-black mb-1">${formatUSD(currentUser.salesUSD || 0)} <span className="text-sm font-light text-gray-400">/ $1,000</span></p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4 mb-4">
                  <div className="bg-[violet-600] h-full" style={{ width: `${Math.min(100, ((currentUser.salesUSD || 0) / 1000) * 100)}%` }} />
                </div>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Solicitar Retiro
                </button>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 font-mono">Categorías Fuertes</h4>
                <ul className="space-y-2 mt-4 text-sm font-bold text-gray-800">
                  <li className="flex justify-between items-center"><span>Alimentos</span> <span className="text-[violet-600]">74%</span></li>
                  <li className="flex justify-between items-center"><span>Bebidas</span> <span className="text-[violet-600]">20%</span></li>
                  <li className="flex justify-between items-center"><span>Limpieza</span> <span className="text-[violet-600]">6%</span></li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h4 className="text-[10px] font-black uppercase text-red-500 mb-2 font-mono">Fuga de Capital Detectada</h4>
                <p className="text-xs text-red-700 mt-2">KFS Oracle™ ha detectado que no tienes productos en la categoría <strong>'Higiene Personal'</strong>. Estás perdiendo aproximadamente un 15% de ventas combinadas ante tu competencia local.</p>
                <button className="mt-4 text-xs font-black text-red-600 hover:underline uppercase tracking-wider">Poblar Catálogo →</button>
              </div>
            </div>
          </div>
        )}

        {/* Bóveda KFS (Métodos de Pago del Dueño) */}
        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2">
                🏦 Bóveda Financiera (Métodos de Cobro)
              </h3>
              <span className="bg-green-100 text-green-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Verificados
              </span>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const target = e.target as any;
              updatePaymentMethods(currentUser.id, {
                zinli: target.zinli.value,
                wallyTech: target.wallyTech.value,
                airtm: target.airtm.value,
                ubbiApp: target.ubbiApp.value,
                pagoMovilPhone: target.pMovilPhone.value,
                pagoMovilId: target.pMovilId.value,
                pagoMovilBank: target.pMovilBank.value,
                binance: target.binance.value
              });
            }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono block">Zinli (Email)</label>
                <input name="zinli" defaultValue={currentUser.paymentMethods?.zinli || ""} placeholder="correo@zinli.com" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono block">Wally Tech</label>
                <input name="wallyTech" defaultValue={currentUser.paymentMethods?.wallyTech || ""} placeholder="Usuario o Teléfono" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono block">AirTM</label>
                <input name="airtm" defaultValue={currentUser.paymentMethods?.airtm || ""} placeholder="correo@airtm.com" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono block">Ubbi App</label>
                <input name="ubbiApp" defaultValue={currentUser.paymentMethods?.ubbiApp || ""} placeholder="Usuario Ubbi" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono block">Binance Pay (Pay ID)</label>
                <input name="binance" defaultValue={currentUser.paymentMethods?.binance || ""} placeholder="ID de Binance" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="space-y-2 border border-gray-200 p-4 rounded-xl">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono mb-2 block">Pago Móvil</label>
                <input name="pMovilBank" defaultValue={currentUser.paymentMethods?.pagoMovilBank || ""} placeholder="Banco (Ej. Banesco 0134)" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[violet-600] mb-2 placeholder:text-gray-400" />
                <input name="pMovilPhone" defaultValue={currentUser.paymentMethods?.pagoMovilPhone || ""} placeholder="Teléfono" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[violet-600] mb-2 placeholder:text-gray-400" />
                <input name="pMovilId" defaultValue={currentUser.paymentMethods?.pagoMovilId || ""} placeholder="Cédula/RIF" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-[violet-900] text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors cursor-pointer active:scale-95">Guardar en Bóveda Criptográfica</button>
              </div>
            </form>
          </div>
        )}

        {/* Gobernanza de Puntos de Venta (Multi-POS Integrado) */}
        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2 text-[violet-600]">
                🔌 Gobernanza de Puntos de Venta (Multi-POS Integrado)
              </h3>
              <span className="bg-[violet-600]/15 border border-[violet-600]/30 text-[violet-600] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                Sincronización Directa PCI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Formulario de Registro/Enlace POS */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Enlazar y Certificar POS Físico</span>
                <form onSubmit={e => {
                  e.preventDefault();
                  const target = e.target as any;
                  const name = target.posName.value;
                  const connectionType = target.connectionType.value;
                  const connectionInfo = target.connectionInfo.value;
                  const assignedVendedorId = target.assignedVendedorId.value || null;

                  registerPosTerminal({
                    name,
                    connectionType,
                    connectionInfo,
                    assignedVendedorId,
                    clientId: currentUser.id
                  });

                  target.reset();
                }} className="space-y-3">
                  <input required name="posName" placeholder="Nombre POS (Ej: Pax A920 - Caja 1)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none" />

                  <div className="grid grid-cols-2 gap-2">
                    <select name="connectionType" className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-900 focus:outline-none font-bold">
                      <option value="TCP_IP">Red Local (IP)</option>
                      <option value="SERIAL">Puerto COM (Serial)</option>
                    </select>
                    <input required name="connectionInfo" placeholder="IP (192...) o COM3" className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-900 focus:outline-none font-mono" />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-widest">Cajero Asignado</label>
                    <select name="assignedVendedorId" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                      <option value="">Sin Asignar</option>
                      {myVendedores.map((v: any) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="w-full py-3 bg-[violet-900] hover:bg-gray-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                    ⚡ Conectar POS Integrado &rarr;
                  </button>
                </form>
              </div>

              {/* Listado de POS enlazados y telemetría en vivo */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Telemetría y Facturación Real por Punto</span>
                <div className="overflow-x-auto max-h-60 border border-gray-100 rounded-xl bg-gray-50/50 p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] font-black sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-lg">POS Físico / Canal</th>
                        <th className="py-2.5 px-2">Cajero</th>
                        <th className="py-2.5 px-2">Telemetría</th>
                        <th className="py-2.5 px-2">Facturación Real</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).map((p: any) => {
                        const vendedor = myVendedores.find((v: any) => v.id === p.assignedVendedorId);
                        return (
                          <tr key={p.id} className="border-b border-gray-100/50 hover:bg-white transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-bold text-[violet-900] block">{p.name}</span>
                              <span className="text-[9px] text-gray-400 font-mono block uppercase">ID: {p.id} | {p.connectionType}: {p.connectionInfo}</span>
                            </td>
                            <td className="py-3 px-2 font-bold text-gray-600">
                              {vendedor ? (
                                <span className="flex items-center gap-1.5 text-[violet-900]">
                                  <UserCheck size={12} className="text-[violet-600]" /> {vendedor.name}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">No Asignado</span>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-full font-black text-[8px] uppercase tracking-wider border border-green-200">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </span>
                                Conectado
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-black text-green-600 block">{formatUSD(p.totalAmountUSD || 0)}</span>
                              <span className="text-[9px] text-gray-400 font-bold block">{p.transactionsCount || 0} TXs Directas</span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  deletePosTerminal(p.id);
                                }}
                                className="text-[9px] bg-red-50 hover:bg-red-100 text-red-600 font-black px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Retirar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400 font-bold">No hay puntos de venta integrados en este local comercial.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <div className="space-y-6">
            {(myOrders.length > 0 || myPendingDispatch.length > 0) && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-200 bg-orange-50/30">
                <h3 className="font-black text-xl text-[violet-900] mb-6 flex items-center gap-2 text-orange-600">
                  <Clock className="text-orange-500" /> Órdenes Online ({myOrders.length} por validar, {myPendingDispatch.length} por despachar)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna Izquierda: Lista de Órdenes */}
                  <div className="lg:col-span-2 space-y-4">
                    {myOrders.map((order: any) => {
                      const product = db.products.find((p: any) => p.id === order.productId);
                      return (
                        <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-2xl border border-orange-100 shadow-sm gap-4 animate-fade-in">
                          <div>
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Pendiente</span>
                            <h4 className="font-bold text-[violet-900]">{product?.name || "Producto Desconocido"}</h4>
                            <p className="text-sm text-gray-500 font-mono mt-1">Ref: <span className="font-bold text-gray-900">{order.paymentReference}</span> | Método: {order.paymentMethod}</p>
                            {order.customerName && (
                              <p className="text-xs text-gray-600 font-bold mt-1">
                                Cliente: {order.customerName} {order.customerRif && `(${order.customerRif})`}
                              </p>
                            )}
                            {order.paymentScreenshot && (
                              <button
                                onClick={() => setActiveScreenshot(order.paymentScreenshot)}
                                className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-black px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                🖼️ Ver Capture
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="text-right flex-1 md:flex-none">
                              <p className="font-black text-lg text-green-600">{formatUSD(order.amountUSD)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => rejectOrder(order.id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors cursor-pointer" title="Rechazar y devolver stock"><X size={20} /></button>
                              <button onClick={() => approveOrder(order.id)} className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={20} /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Columna Centro: Órdenes por Despachar */}
                  {myPendingDispatch.length > 0 && (
                    <div className="lg:col-span-2 space-y-4 mt-8 lg:mt-0 lg:border-t-0 border-t border-orange-100 pt-8 lg:pt-0">
                      <h4 className="font-bold text-[violet-900] mb-4 flex items-center gap-2">
                        <Package className="text-blue-500" /> Listo para Empacar / Despachar ({myPendingDispatch.length})
                      </h4>
                      {myPendingDispatch.map((tx: any) => {
                        const product = db.products.find((p: any) => p.id === tx.productId);
                        const assignedRider = tx.assignedRiderId ? db.riders?.find((r: any) => r.id === tx.assignedRiderId) : null;
                        return (
                          <div key={tx.id} className="flex flex-col p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm gap-4 animate-fade-in">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <span className="bg-blue-200 text-blue-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Pago Aprobado</span>
                                <h4 className="font-bold text-[violet-900]">{product?.name || "Producto Desconocido"}</h4>
                                <p className="text-sm text-gray-600 font-mono mt-1">Teléfono: <span className="font-bold">{tx.customerPhone}</span></p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { dispatchOrder(tx.id); assignDeliveryToOrder(tx.id, currentUser.id); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-md text-sm">
                                  <Truck size={16} /> Despachar + Asignar Rider
                                </button>
                              </div>
                            </div>
                            {assignedRider && (
                              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                <p className="text-[10px] text-green-600 font-black uppercase tracking-wider mb-1">🛵 Rider Asignado — El cliente paga $2 directamente</p>
                                <p className="font-bold text-sm text-[violet-900]">{assignedRider.name}</p>
                                {assignedRider.pagoMovil?.banco && (
                                  <p className="text-xs text-gray-600 mt-0.5">💳 {assignedRider.pagoMovil.banco} · {assignedRider.pagoMovil.telefono} · CI {assignedRider.pagoMovil.cedula}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* My Riders Section */}
                      {(() => {
                        const myRiders = (db.riders || []).filter((r: any) => (r.associatedBusinesses || []).includes(currentUser.id));
                        const availableRiders = (db.riders || []).filter((r: any) => r.status === "approved" && !(r.associatedBusinesses || []).includes(currentUser.id) && (r.associatedBusinesses || []).length < 2);
                        return (
                          <div className="bg-white border border-blue-100 rounded-2xl p-5 mt-4">
                            <h4 className="font-black text-[violet-900] text-sm mb-3 flex items-center gap-2">
                              <Truck size={16} className="text-blue-500" /> Mis Riders ({myRiders.length}/2)
                            </h4>
                            {myRiders.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No tienes riders asignados. Añade un rider aprobado abajo.</p>
                            ) : (
                              <div className="space-y-2 mb-3">
                                {myRiders.map((r: any) => (
                                  <div key={r.id} className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
                                    <div>
                                      <p className="font-black text-sm text-[violet-900]">{r.name}</p>
                                      <p className="text-[10px] text-gray-500">{r.pagoMovil?.banco ? `PM: ${r.pagoMovil.banco}` : "Sin Pago Móvil"}</p>
                                    </div>
                                    <button onClick={() => removeRiderFromBusiness(r.id, currentUser.id)} className="text-[10px] text-red-500 hover:text-red-700 font-bold cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50">Quitar</button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {myRiders.length < 2 && availableRiders.length > 0 && (
                              <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Riders disponibles para asignar:</p>
                                <div className="space-y-1">
                                  {availableRiders.slice(0, 5).map((r: any) => (
                                    <button key={r.id} onClick={() => assignRiderToBusiness(r.id, currentUser.id)} className="w-full text-left px-3 py-2 bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer placeholder:text-gray-400">
                                      <span className="font-bold text-sm text-[violet-900]">{r.name}</span>
                                      <span className="text-[10px] text-gray-400 ml-2">{r.email}</span>
                                      <span className="float-right text-[10px] text-blue-500 font-black">+ Añadir</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Columna Derecha: Conciliador SMS Real */}
                  <div className="bg-[violet-900] border border-[violet-600]/20 rounded-3xl p-6 text-[#F8F9FA] relative overflow-hidden shadow-xl flex flex-col justify-between text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[violet-600]/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[violet-600]/15 text-[violet-600]">
                          <Bell size={20} className="animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm tracking-wide">CONCILIADOR SMS</h4>
                          <p className="text-[9px] text-[violet-600] font-mono uppercase tracking-widest">Tecnología Inteligente KFS</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">
                        Pega el SMS de Pago Móvil, Zinli o AirTM. El motor KFS extraerá la referencia y el monto para conciliar y liberar la orden al instante sin intervención manual.
                      </p>

                      <textarea
                        placeholder="Pega el mensaje de texto bancario recibido aquí..."
                        value={smsInput}
                        onChange={(e) => setSmsInput(e.target.value)}
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-[violet-600] placeholder:text-gray-600 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleManualSmsConciliation}
                      className="w-full mt-4 py-3 rounded-xl font-black text-xs text-[violet-900] bg-[violet-600] hover:bg-[#b08e72] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Conciliar SMS Real
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-xl text-[violet-900] mb-6 flex items-center gap-2">Registro de Egresos Operativos</h3>
              <div className="space-y-3">
                {myExpenses.map((e: any) => (
                  <div key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="font-bold text-[violet-900]">{e.description}</span>
                    <span className="text-red-500 font-black">-{formatUSD(e.amountUSD)}</span>
                  </div>
                ))}
                {myExpenses.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay egresos registrados.</p>}
              </div>
            </div>

            {/* Módulos Fase 15 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Low Stock Widget */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-100 bg-red-50/20">
                <h3 className="font-black text-xl text-[violet-900] mb-6 flex items-center gap-2 text-red-500">
                  <Activity className="text-red-500" /> Alertas de Inventario
                </h3>
                <div className="space-y-3">
                  {lowStockProducts.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-[violet-900]">{p.name} <span className="text-[10px] font-black text-white bg-green-500 px-2 py-0.5 rounded-full ml-2">Alerta Verde</span></span>
                        <span className="text-xs text-red-500 font-black">{p.stock} unidades restantes</span>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/?text=Hola,%20necesito%20reabastecer:%20${p.name}`, '_blank')} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">Reabastecer</button>
                    </div>
                  ))}
                  {stagnantProducts.map((p: any) => (
                    <div key={`stg-${p.id}`} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-[violet-900]">{p.name} <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full ml-2">Alerta Roja</span></span>
                        <span className="text-xs text-red-500 font-black">Estancado (&gt;15 días sin ventas)</span>
                      </div>
                      <button onClick={() => showToast(`Iniciando campaña de Retargeting forzado para ${p.name}...`)} className="text-xs font-bold bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">Forzar Descuento</button>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && stagnantProducts.length === 0 && <p className="text-sm text-gray-400 font-bold">El inventario está estable.</p>}
                </div>
              </div>

              {/* CRM Widget */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="font-black text-xl text-[violet-900] flex items-center gap-2 text-[violet-600]">
                    <Users className="text-[violet-600]" /> Clientes Frecuentes (CRM)
                  </h3>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-600">Programa Fidelidad KFS</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={currentUser.loyaltyProgramActive || false} onChange={e => toggleLoyaltyProgram(currentUser.id, e.target.checked)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[violet-600]"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  {myCrm.map((c: any) => (
                    <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[violet-900] font-mono">{c.phone} {c.name && <span className="text-gray-500 font-sans font-medium text-xs ml-1">({c.name})</span>}</span>
                        <span className="text-xs text-gray-500">{c.purchasesCount} compras registradas</span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-green-600 font-black block">{formatUSD(c.totalSpent)}</span>
                          {c.kfsPoints > 0 && <span className="text-[10px] font-bold text-[violet-600] bg-[violet-600]/10 px-2 py-0.5 rounded-full">{c.kfsPoints.toFixed(1)} KFS Pts</span>}
                        </div>
                        <a
                          href={`https://wa.me/58${c.phone.replace(/^0+/, '').replace(/[^0-9]/g, '')}?text=Hola ${c.name || ''}, ¡Te extrañamos en ${currentUser.company}! 🎁 Tienes puntos acumulados por tus compras.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[violet-900] text-white p-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center"
                          title="Re-Marketing (WhatsApp)"
                        >
                          <Users size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                  {myCrm.length === 0 && <p className="text-sm text-gray-400 font-bold">Sin clientes registrados con teléfono.</p>}
                </div>
              </div>
            </div>

            {/* Z-Reports Widget */}
            {myZReports.length > 0 && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="font-black text-xl text-[violet-900] mb-6 flex items-center gap-2">
                  <Lock className="text-[violet-900]" /> Cortes de Caja (Reportes Z)
                </h3>
                <div className="space-y-3">
                  {myZReports.map((z: any) => {
                    const vendedor = myVendedores.find((v: any) => v.id === z.vendedorId);
                    return (
                      <div key={z.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex flex-col">
                          <span className="font-black text-[violet-900] uppercase tracking-wider text-sm">{vendedor?.name || "Vendedor"} - {new Date(z.timestamp).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{z.txCount} transacciones procesadas</span>
                        </div>
                        <span className="font-black text-xl text-[violet-900]">{formatUSD(z.totalUSD)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-black text-xl text-[violet-900] mb-6 pl-2">Inventario en Flow Express</h3>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-4">
                {myProducts.map((p: any) => {
                  const hasCost = p.costUSD !== undefined && p.costUSD > 0;
                  const margin = hasCost ? ((p.priceUSD - p.costUSD) / p.priceUSD) * 100 : 0;
                  const recPrice = hasCost ? p.costUSD / 0.65 : 0;
                  const marginVulnerable = hasCost && p.priceUSD < recPrice - 0.01;

                  return (
                    <div key={p.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${marginVulnerable ? "border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-gray-100"}`}>
                      <div className="aspect-square bg-gray-100 w-full overflow-hidden relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        {marginVulnerable && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse shadow-md">
                            ⚠️ Margen Vulnerado
                          </span>
                        )}
                        <button
                          onClick={() => toggleProductFeatured(p.id, !p.isFeatured)}
                          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
                          title={p.isFeatured ? "Quitar de Destacados" : "Marcar como Estrella"}
                        >
                          <Star size={16} className={p.isFeatured ? "fill-yellow-400 text-yellow-500" : "text-gray-400"} />
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm truncate text-[violet-900] mb-0.5">{p.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category || "General"}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[10px] font-mono leading-tight">
                          <div className="flex flex-col text-gray-500">
                            <span>Precio:</span>
                            <span className="text-[violet-600] font-black">{formatUSD(p.priceUSD)}</span>
                          </div>
                          <div className="flex flex-col text-gray-500 text-center">
                            <span>Costo:</span>
                            <span className="text-[violet-900] font-bold">{hasCost ? formatUSD(p.costUSD) : "N/D"}</span>
                          </div>
                          <div className="flex flex-col text-gray-500 text-right">
                            <span>Margen:</span>
                            <span className={`font-black ${margin >= 35 ? "text-green-600" : margin > 0 ? "text-orange-500 animate-pulse" : "text-gray-400"}`}>
                              {hasCost ? `${margin.toFixed(1)}%` : "N/D"}
                            </span>
                          </div>
                        </div>

                        {marginVulnerable && (
                          <div className="bg-red-50/50 border border-red-100 p-2 rounded-lg text-center space-y-1.5">
                            <p className="text-[9px] font-bold text-red-600">Sugerido KFS: <span className="font-black text-xs">{formatUSD(recPrice)}</span></p>
                            <button
                              onClick={() => shieldMargin(p.id, recPrice)}
                              className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow transition-colors cursor-pointer"
                            >
                              🛡️ Blindar Margen
                            </button>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-1 border-t border-gray-100 mt-2">
                          <div>
                            <p className="text-[violet-900] font-black text-sm">{formatUSD(p.priceUSD)}</p>
                            <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {p.stock && p.stock > 0 ? `${p.stock} unids` : "Agotado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {myProducts.length === 0 && <div className="col-span-2 md:col-span-4 text-center py-10 bg-white rounded-2xl text-gray-400 font-bold">Catálogo vacío.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Modal Agregar Producto */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-[violet-900]">Nuevo Producto</h3>
              <form onSubmit={submitProduct} className="space-y-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({ ...newProd, barcode: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-mono text-gray-900 placeholder:text-gray-400" />
                  <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-[violet-900] text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                    <Search size={18} />
                  </button>
                </div>
                <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400" />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Costo Insumo</label>
                    <input required type="number" step="0.01" placeholder="Costo ($)" value={newProd.cost} onChange={e => setNewProd({ ...newProd, cost: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Precio Venta</label>
                    <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-black text-gray-900 text-center placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock</label>
                    <input required type="number" placeholder="Cant" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 text-center placeholder:text-gray-400" />
                  </div>
                </div>
                <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400">
                  <option value="Alimentos">Alimentos y Bebidas</option>
                  <option value="Ropa y Calzado">Ropa y Calzado</option>
                  <option value="Tecnología">Tecnología y Electrónica</option>
                  <option value="Salud y Belleza">Salud y Belleza</option>
                  <option value="Hogar">Hogar y Muebles</option>
                  <option value="Servicios">Servicios Generales</option>
                </select>
                <textarea placeholder="Descripción del producto (Opcional)" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-medium text-gray-900 text-sm h-20 resize-none placeholder:text-gray-400" />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {newProd.imgUrl ? (
                    <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Camera size={40} className="mb-3" />
                      <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[violet-900] bg-[violet-600] shadow-lg cursor-pointer">Publicar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Agregar Vendedor */}
        {showAddVendedor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-[violet-900]">Nuevo Empleado</h3>
              <form onSubmit={handleAddVendedor} className="space-y-4">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64String = await compressImage(file, 200, 0.6);
                          setNewVendedor(prev => ({ ...prev, avatar: base64String }));
                        } catch (error) {
                          // ignore error or showToast if available in scope
                        }
                      }
                    }} />
                    {newVendedor.avatar ? (
                      <img src={newVendedor.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                        <Camera size={20} className="mx-auto" />
                        <span className="text-[7px] font-bold block mt-0.5">Foto</span>
                      </div>
                    )}
                  </label>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Foto del Empleado</span>
                </div>

                <input required type="text" placeholder="Nombre del Vendedor" value={newVendedor.name} onChange={e => setNewVendedor({ ...newVendedor, name: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400" />
                <input required type="email" placeholder="Correo (Usuario de Acceso)" value={newVendedor.email} onChange={e => setNewVendedor({ ...newVendedor, email: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400" />
                <input required type="password" placeholder="Clave de Acceso" value={newVendedor.password} onChange={e => setNewVendedor({ ...newVendedor, password: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400" />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddVendedor(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-[violet-900] shadow-lg cursor-pointer">Crear Acceso</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Agregar Gasto */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 text-[violet-900]">Registrar Gasto (Egreso)</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                addExpense({
                  description: newExpense.description,
                  amountUSD: parseFloat(newExpense.amountUSD) || 0,
                  clientId: currentUser.id
                });
                setNewExpense({ description: "", amountUSD: "" });
                setShowExpenseModal(false);
              }} className="space-y-4">
                <input required type="text" placeholder="Concepto (Ej. Alquiler, Proveedor)" value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400" />
                <input required type="number" step="0.01" placeholder="Monto Total (USD)" value={newExpense.amountUSD} onChange={e => setNewExpense({ ...newExpense, amountUSD: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400" />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowExpenseModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                  <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg cursor-pointer">Descontar Saldo</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeManual && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white text-[violet-900] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[violet-900]">
              <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[violet-900] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>

              {activeManual === 'owner' && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[violet-600]" size={28} /> Manual de Uso del Dueño</h2>
                  <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">1. ¿Qué es KFS OS?</p>
                      <p>Es tu centro de comando. Desde aquí controlas tus ventas físicas, tu E-Commerce (Flow Express Marketplace), empleados e inventario en un solo lugar.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">2. Control de Inventario:</p>
                      <p>Usa la sección "Inventario" para cargar tus productos. Recomendamos usar código de barras reales (EAN/UPC) para que la búsqueda en caja sea instantánea.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">3. Control de Empleados (Vendedores):</p>
                      <p>Crea usuarios y contraseñas temporales para tus cajeros. Ellos accederán desde sus propios dispositivos o la PC de la tienda al panel de Caja Registradora.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">4. Liquidación y Tarifas:</p>
                      <p>Tus ganancias netas están en la cima de este panel. La deuda KFS se calcula basada en tu tarifa operativa y debe ser cancelada en los datos de transferencia mostrados abajo.</p>
                    </div>
                  </div>
                </div>
              )}
              {activeManual === 'benefits' && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Star className="text-[violet-600]" size={28} /> Whitepaper de Beneficios KFS</h2>
                  <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                      <p className="font-black text-blue-800 text-xs uppercase tracking-widest mb-1">El Ecosistema Financiero</p>
                      <p className="text-blue-700 text-xs">Ahorros masivos al eliminar software de terceros obsoleto.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">1. E-Commerce Flow Express Gratuito:</p>
                      <p>Tu inventario está conectado en tiempo real al marketplace Flow Express. Cualquier cliente puede comprar online con pago móvil, Zinli, AirTM, Ubbi, Wally o Binance Pay sin comisiones adicionales.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">2. Sincro-Shield Fiscal Gratuito:</p>
                      <p>No necesitas pagar licencias anuales a intermediarios. Nuestro proxy conecta tu PC directo a la impresora fiscal bajo las normativas del SENIAT.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="font-black text-[violet-900] mb-1">3. Conciliación Automática SMS:</p>
                      <p>Si activas la función SMS, el sistema verificará pagos móviles entrantes de forma autónoma. Se acabaron los fraudes de capturas falsas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showTicketModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 space-y-4 shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-[violet-900]">Crear Ticket SOS</h3>
                <button onClick={() => setShowTicketModal(false)} className="hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors"><X size={20} className="text-gray-400" /></button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Nuestro equipo técnico y tu promotora asignada recibirán este reporte inmediatamente.</p>
              <input type="text" placeholder="Asunto (Ej: Lector no lee)" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              <textarea placeholder="Describe el problema..." value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-[violet-600] placeholder:text-gray-400" />
              <button onClick={() => { if (ticketSubject && ticketMsg) { createTicket(currentUser.id, ticketSubject, ticketMsg); setShowTicketModal(false); } }} className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50" disabled={!ticketSubject || !ticketMsg}>
                Enviar a Soporte Técnico
              </button>
            </div>
          </div>
        )}
        {activeScreenshot && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-[violet-900] border border-[violet-600]/30 rounded-[2.5rem] w-full max-w-lg p-6 shadow-2xl relative flex flex-col items-center">
              <button onClick={() => setActiveScreenshot(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-full">
                <X size={20} />
              </button>
              <h3 className="text-xl font-black text-[violet-600] mb-4 text-center">Capture de Transacción</h3>
              <div className="w-full max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-2 flex justify-center items-center">
                <img src={activeScreenshot} alt="Transaction Capture" className="max-w-full h-auto rounded-xl object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* FIXED BOTTOM NAVIGATION */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between gap-2 items-center relative">
            {[
              { id: "resumen", icon: Activity, label: "Resumen" },
              { id: "inventario", icon: Package, label: "Inventario" },
              { id: "personal", icon: Users, label: "Personal" },
              { id: "config", icon: Settings, label: "Ajustes" }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center justify-center w-20 h-12 cursor-pointer group"
                >
                  {isActive && <span className="absolute -top-4 w-12 h-1 bg-[violet-600] rounded-b-full shadow-[0_4px_10px_rgba(197,161,132,0.5)]" />}
                  <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-2 text-[violet-900]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-[violet-900]' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {showPayrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-md w-full animate-scale-in border border-gray-100">
            <h3 className="text-xl font-black mb-1 flex items-center gap-2 text-[violet-900]"><DollarSign className="text-blue-500" /> Liquidación de Nómina</h3>
            <p className="text-xs text-gray-500 mb-6">Empleado: {showPayrollModal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Salario / Comisión Base ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" step="0.01" className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400" placeholder="0.00" value={payrollBaseSalary} onChange={(e) => setPayrollBaseSalary(e.target.value)} />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest block">Vales Pendientes por Descontar</span>
                {(db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center text-xs text-orange-800">
                    <span>{v.date.slice(0, 10)} - Adelanto</span>
                    <span className="font-bold">-${v.totalDueUSD.toFixed(2)}</span>
                  </div>
                ))}
                {(db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").length === 0 && (
                  <span className="text-xs text-orange-800/60 block">No hay vales pendientes.</span>
                )}
              </div>

              <div className="flex justify-between items-center bg-[violet-900] p-4 rounded-xl text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Neto a Pagar</span>
                <span className="text-xl font-black text-[violet-600]">
                  ${Math.max(0, parseFloat(payrollBaseSalary || "0") - (db.vales || []).filter((v: any) => v.targetId === showPayrollModal.id && v.status === "pending").reduce((acc: number, v: any) => acc + v.totalDueUSD, 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowPayrollModal(null); setPayrollBaseSalary(""); }} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!payrollBaseSalary) {
                    showToast("Ingresa un monto base", "error");
                    return;
                  }
                  processPayroll(showPayrollModal.id, parseFloat(payrollBaseSalary));
                  setShowPayrollModal(null);
                  setPayrollBaseSalary("");
                }}
                className="flex-1 px-4 py-3 bg-[violet-900] text-[violet-600] text-sm font-black uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors cursor-pointer border border-[violet-600]/30 shadow-lg"
              >
                Aprobar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayoutModal && (
        <PayoutModal
          maxAmount={clientInfo.walletBalanceUSD || 0}
          currency="USD"
          formatMoney={formatUSD}
          onCancel={() => setShowPayoutModal(false)}
          onConfirm={(amount: number, details: string) => {
            requestPayout(amount, details);
            setShowPayoutModal(false);
          }}
        />
      )}

    </div>
  );
};

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[violet-900] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white cursor-pointer">
          <X size={24} />
        </button>
        <h3 className="text-xl font-black text-[violet-600] mb-4 flex items-center gap-2"><QrCode /> Terminal de Escaneo KFS</h3>

        {/* Scan Frame */}
        <div id="kfs-reader" className="relative w-full aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center mb-6">
          {/* Laser animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse border-b-2 border-red-400 z-10 pointer-events-none" style={{ animationDuration: "1.5s", animationIterationCount: "infinite" }} />

          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-center z-10 pointer-events-none">
            <span className="text-[10px] text-gray-300 font-mono flex items-center justify-center gap-1"><Info size={12} /> Buscando QR o Código de Barras...</span>
          </div>
        </div>

        {/* Manual Fallback Entry Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-black text-[violet-600] uppercase tracking-widest block font-mono">Entrada Manual de Emergencia</span>
          <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
            <button
              type="button"
              onClick={() => setSelectedScanType("product")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "product" ? "bg-[violet-600] text-[violet-900]" : "bg-white/5 text-gray-400"}`}
            >
              📦 Producto
            </button>
            <button
              type="button"
              onClick={() => setSelectedScanType("cedula")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "cedula" ? "bg-[violet-600] text-[violet-900]" : "bg-white/5 text-gray-400"}`}
            >
              🪪 Cédula PDF417
            </button>
          </div>

          {selectedScanType === "product" ? (
            <select
              className="w-full bg-[violet-900] text-white border border-[violet-600]/30 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
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
              className="w-full bg-[violet-900] text-white border border-[violet-600]/30 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-mono"
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
            className="w-full py-3 bg-[violet-600] text-[violet-900] font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            ✓ Confirmar e Ingresar Manualmente
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="px-6 py-2 border border-white/15 text-xs text-gray-300 font-bold rounded-lg cursor-pointer">
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};

// Vendedor Dashboard
const VendedorDashboard = ({ db, setDb, currentUser, addProduct, processPurchase, showToast, formatUSD, logout, approveOrder, rejectOrder, generateZReport, registerCrmExpress, triggerGhostTrap }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const [scannedGlobalProduct, setScannedGlobalProduct] = useState<any>(null);
  const [smsInput, setSmsInput] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const { queryGlobalBarcode, smsConciliator, rates, networkState, requestNotificationPermission } = useKFS() as any;

  // Hardware Barcode Scanner Listener
  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();
    let timeoutId: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter" && barcodeBuffer.length > 3) {
        e.preventDefault();
        const scannedCode = barcodeBuffer;
        barcodeBuffer = "";

        const product = db.products?.find((p: any) => p.clientId === currentUser.clientId && p.barcode === scannedCode);
        if (product && product.stock > 0) {
          playPremiumChime();
          setCheckoutProduct(product);
          showToast(`Producto escaneado vía Hardware: ${product.name}`, "success");
        } else if (product && product.stock <= 0) {
          showToast(`Producto sin stock: ${product.name}`, "error");
        } else {
          showToast(`Código de barras no encontrado: ${scannedCode}`, "error");
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { barcodeBuffer = ""; }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [db, currentUser]);

  const handleManualSmsConciliation = () => {
    if (!smsInput.trim()) return;
    const result = smsConciliator(smsInput);
    if (result.matched) {
      playPremiumChime();
      showToast(`¡Conciliación Exitosa! Orden auto-aprobada por SMS. Ref: ${result.reference}`, "success");
      setSmsInput("");
    } else {
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(`SMS leído (Ref: ${result.reference || "Desconocida"}, Bs. ${result.amount || 0}), pero no coincide con ninguna orden online pendiente.`, "error");
      }
    }
  };

  const [newProd, setNewProd] = useState({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [activeManual, setActiveManual] = useState<string | null>(null);

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode) return;
    setIsFetchingBarcode(true);
    try {
      // 1. Consultar el Catálogo Nacional de Venezuela (Garantía offline-first)
      const globalProd = await queryGlobalBarcode(barcode);
      if (globalProd) {
        setNewProd(prev => ({
          ...prev,
          name: globalProd.name,
          imgUrl: globalProd.imgUrl,
          category: globalProd.category || prev.category
        }));
        showToast(`¡Producto encontrado en Catálogo Venezolano! (${globalProd.brand})`, "success");
        setIsFetchingBarcode(false);
        return;
      }

      // 2. Fallback a Open Food Facts global
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setNewProd(prev => ({
          ...prev,
          name: data.product.product_name || data.product.product_name_es || prev.name,
          imgUrl: data.product.image_url || prev.imgUrl
        }));
        showToast("¡Producto encontrado en la base global!", "success");
      } else {
        showToast("Producto no encontrado en base global. Complete manualmente.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error consultando base de datos. Complete manualmente.");
    }
    setIsFetchingBarcode(false);
  };

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.clientId);
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.clientId && o.status === 'pending') || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await compressImage(file, 400, 0.6);
        setNewProd(prev => ({ ...prev, imgUrl: base64String }));
      } catch (error) {
        showToast("Error comprimiendo imagen", "error");
      }
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProd.name,
      priceUSD: parseFloat(newProd.price),
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      clientId: currentUser.clientId,
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode,
      description: newProd.description
    });
    setShowAddModal(false);
    setNewProd({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "", description: "" });
  };

  const handleScanSuccess = async (prodIdOrBarcode: string) => {
    playScannerBeep();
    // Intercept PDF417 Cédula Scanner
    if (prodIdOrBarcode.startsWith("PDF417:")) {
      const payload = prodIdOrBarcode.substring(7); // remove prefix
      const match = payload.match(/^([V|E])([0-9]+)([A-Z_]+)_([A-Z_]+)_([M|F])([0-9]{8})$/);
      if (match) {
        const type = match[1];
        const cedula = match[2];
        const name = match[3].replace(/_/g, ' ');
        const surname = match[4].replace(/_/g, ' ');

        const crmPhone = `0414-${Math.floor(1000000 + Math.random() * 9000000)}`;
        registerCrmExpress(`${type}-${cedula}`, name, surname, crmPhone);

        playPremiumChime();
        showToast(`CRM Express: ¡Cédula ${type}-${cedula} (${name} ${surname}) registrada en CRM!`, "success");
      } else {
        showToast("Error decodificando código PDF417 de la Cédula.", "error");
      }
      setShowScanner(false);
      return;
    }

    // 1. Buscar por ID o código de barras localmente
    let prod = db.products.find((p: any) => p.id === prodIdOrBarcode || p.barcode === prodIdOrBarcode);

    if (prod) {
      setCheckoutProduct(prod);
      setShowScanner(false);
      return;
    }

    // 2. Consulta en el Catálogo Nacional de Venezuela (Garantía offline-first)
    const globalProd = await queryGlobalBarcode(prodIdOrBarcode);
    if (globalProd) {
      playPremiumChime();
      setScannedGlobalProduct({
        barcode: prodIdOrBarcode,
        name: globalProd.name,
        imgUrl: globalProd.imgUrl,
        category: globalProd.category || "Alimentos",
        brand: globalProd.brand || "Venezuela",
        source: globalProd.source
      });
      setShowScanner(false);
      return;
    }

    // 3. Fallback a Open Food Facts global
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${prodIdOrBarcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const productName = data.product.product_name || data.product.product_name_es || "Producto Desconocido";
        const imgUrl = data.product.image_url || "";
        playPremiumChime();
        setScannedGlobalProduct({
          barcode: prodIdOrBarcode,
          name: productName,
          imgUrl: imgUrl,
          category: "Alimentos",
          brand: "Importado / Global",
          source: "openfoodfacts"
        });
      } else {
        showToast("Producto no encontrado en las bases de datos.");
      }
    } catch (e) {
      showToast("Producto no reconocido y error de red.");
    }
    setShowScanner(false);
  };

  const handleConfirmCheckout = (paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string, customerName: string, customerRif: string, paymentScreenshot?: string, kPointsToBurn: number = 0) => {
    const tx = processPurchase(checkoutProduct, paymentMethod, applyIva, customerPhone, customerName, customerRif, kPointsToBurn);
    if (tx) {
      setReceiptTx(tx);
    }
    setCheckoutProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#EEF2F5] pb-20 font-sans relative">
      {clientInfo?.subscription?.status === 'past_due' && (
        <div className="fixed inset-0 bg-red-900/95 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center p-6 animate-fade-in text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Lock size={48} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">SISTEMA BLOQUEADO</h1>
          <p className="text-red-200 text-sm max-w-md mb-8">
            Tu suscripción KFS-OS se encuentra vencida. Por políticas de seguridad comercial, tu acceso operativo ha sido suspendido. Paga tu saldo pendiente de <strong className="text-white">${clientInfo.subscription.costUSD || 6} USD</strong> usando tu Reserva Central para reactivar tu negocio inmediatamente.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => paySubscription(clientInfo.id)}
              className="bg-red-500 hover:bg-red-400 text-white font-black px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              Pagar Suscripción Ahora
            </button>
            <button
              onClick={logout}
              className="bg-transparent border border-red-500/30 text-red-300 font-bold px-8 py-4 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 bg-[violet-900] sticky top-0 z-40 backdrop-blur-md gap-3 w-full">
        <div className="flex items-center gap-3 justify-between w-full sm:w-auto">
          <KreatekLogo className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-widest uppercase text-[violet-600] sm:text-lg">
              Terminal: {currentUser.company}
            </span>
            <div className="w-10 h-10 ml-2 rounded-full border-2 border-[violet-600] relative z-20">
              <ProfileAvatarEditor currentUser={currentUser} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <button onClick={requestNotificationPermission} className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold" title="Activar Alertas Nativas">
              <Bell size={14} />
            </button>
            <button onClick={() => showToast("Comando TFHKA Reporte X enviado...", "success")} className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold">
              Reporte X
            </button>
            <button onClick={() => { generateZReport(currentUser.id, currentUser.clientId); showToast("Comando TFHKA Z enviado. Sesión cerrada.", "success"); }} className="flex items-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition-colors text-xs font-bold">
              Cerrar Caja (Z)
            </button>
          </div>
<div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm" title="K-Pts">
              <span className="text-[9px] font-black text-orange-900 uppercase">K-Pts</span>
              <span className="font-black text-white text-xs">{currentUser?.kfsPoints || 0}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors text-white cursor-pointer text-xs font-bold">
              Salir
            </button>
          </div>
        </div>
      </nav>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <OracleInsightCard role="cashier" data={{ streak: 5, bonusEarned: currentUser.accumulated_bonus || '0.00' }} />

        {networkState === "offline" && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <WifiOff className="text-red-400" size={24} />
              <div>
                <h3 className="font-black text-red-400">Modo Offline Activo</h3>
                <p className="text-xs text-red-300 font-medium">Las ventas se guardarán localmente en la cola segura y se sincronizarán al recuperar la conexión.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-[violet-900] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-white/10">
          <div className="relative z-10">
            <p className="text-[violet-600] text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14} className="text-green-500" /> Sesión Operativa</p>
            <h2 className="text-5xl font-black mb-1">{currentUser.name}</h2>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Terminal en línea y asegurado.
            </p>
          </div>

          <div className="relative z-10 bg-black/50 border border-green-500/30 p-4 rounded-xl flex flex-col items-end">
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Cumplimiento SUNDDE</span>
            <span className="text-2xl font-black text-white mt-1">Tasa BCV: {rates?.USD?.toFixed(2)} Bs</span>
            <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Gaceta Oficial de Venezuela</span>
          </div>

          <Activity size={150} className="absolute -right-10 -bottom-10 text-white/5" />
        </div>

        <UniversalWalletWidget currentUser={currentUser} formatUSD={formatUSD} />

        <KFSIoTEdgeConsole showToast={showToast} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => setShowAddModal(true)} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:border-[violet-600]/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-[violet-900]/5 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-[violet-900]" />
            </div>
            <span className="font-black text-[violet-900]">Subir Producto</span>
          </button>
          <button onClick={() => { setShowScanner(true); showToast("Cámara de escaneo activada."); }} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:border-[violet-600]/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-[violet-900]/5 rounded-full flex items-center justify-center">
              <QrCode size={24} className="text-[violet-900]" />
            </div>
            <span className="font-black text-[violet-900]">Escanear QR / Compra</span>
          </button>
          <button onClick={() => setActiveManual('operator')} className="bg-[violet-900] text-white p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:bg-gray-900 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-[violet-600]" />
            </div>
            <span className="font-black text-white">Manual de Operación</span>
          </button>
        </div>

        {myOrders.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-200 bg-orange-50/30">
            <h3 className="font-black text-xl text-[violet-900] mb-4 flex items-center gap-2 text-orange-600">
              <Clock className="text-orange-500" /> Órdenes Online ({myOrders.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Lista de Órdenes */}
              <div className="lg:col-span-2 space-y-3">
                {myOrders.map((order: any) => {
                  const product = db.products.find((p: any) => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-xl border border-orange-100 shadow-sm gap-3 animate-fade-in">
                      <div>
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-1 inline-block">Validación Pendiente</span>
                        <h4 className="font-bold text-sm text-[violet-900]">{product?.name || "Producto Desconocido"}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">Ref: <span className="font-bold text-gray-900">{order.paymentReference}</span> | {order.paymentMethod}</p>
                        {order.customerName && (
                          <p className="text-[10px] text-gray-600 font-bold mt-1">
                            Cliente: {order.customerName} {order.customerRif && `(${order.customerRif})`}
                          </p>
                        )}
                        {order.paymentScreenshot && (
                          <button
                            onClick={() => setActiveScreenshot(order.paymentScreenshot)}
                            className="mt-1.5 text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 font-black px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            🖼️ Ver Capture
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-right flex-1 md:flex-none">
                          <p className="font-black text-base text-green-600">{formatUSD(order.amountUSD)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => rejectOrder(order.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer" title="Rechazar"><X size={18} /></button>
                          <button onClick={() => approveOrder(order.id)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: Conciliador SMS Real */}
              <div className="bg-[violet-900] border border-[violet-600]/20 rounded-3xl p-5 text-[#F8F9FA] relative overflow-hidden shadow-xl flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[violet-600]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-[violet-600]/15 text-[violet-600]">
                      <Bell size={16} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs tracking-wide">CONCILIADOR SMS</h4>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                    Pega el SMS de notificación del Pago Móvil recibido para conciliar y auto-aprobar la orden del cliente de inmediato.
                  </p>

                  <textarea
                    placeholder="Pega el SMS recibido..."
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-[violet-600] placeholder:text-gray-600 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleManualSmsConciliation}
                  className="w-full mt-3 py-2.5 rounded-xl font-black text-xs text-[violet-900] bg-[violet-600] hover:bg-[#b08e72] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ⚡ Conciliar SMS
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h3 className="font-black text-[violet-900] text-lg flex items-center gap-2"><Package size={20} className="text-[violet-600]" /> Catálogo de {currentUser.company}</h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar producto o barcode..." className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[violet-600] placeholder:text-gray-400" value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-4">
            {myProducts.filter((p: any) => p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).map((p: any) => (
              <div key={p.id} className="border border-gray-100 rounded-2xl p-3 flex flex-col justify-between bg-gray-50/50">
                <div className="h-28 bg-gray-200 rounded-lg overflow-hidden mb-2">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <div>
                  <h4 className="font-bold text-xs truncate text-gray-900">{p.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <p className="text-xs font-black text-[violet-600]">{formatUSD(p.priceUSD)}</p>
                      <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock && p.stock > 0 ? `${p.stock} u.` : "Agotado"}
                    </span>
                  </div>
                </div>
                <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} className="mt-2 w-full py-2 bg-[violet-900] disabled:bg-gray-400 hover:bg-gray-800 text-white font-bold rounded-lg text-[10px] cursor-pointer disabled:cursor-not-allowed">
                  {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Cargar Venta"}
                </button>
              </div>
            ))}
            {myProducts.filter((p: any) => p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).length === 0 && <p className="col-span-full text-center text-xs text-gray-400 py-6 font-bold">Sin resultados o sin productos cargados.</p>}
          </div>
        </div>
      </div>

      {/* Scanner View Integration */}
      {showScanner && (
        <ScannerView
          videoRef={videoRef}
          onClose={() => setShowScanner(false)}
          onScan={handleScanSuccess}
          myProducts={myProducts}
          formatUSD={formatUSD}
        />
      )}

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onConfirm={handleConfirmCheckout}
          onCancel={() => setCheckoutProduct(null)}
          formatUSD={formatUSD}
          currentUser={currentUser}
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

      {/* Modal Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[violet-900]">Nuevo Producto</h3>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({ ...newProd, barcode: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-mono text-gray-900 placeholder:text-gray-400" />
                <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-[violet-900] text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                  <Search size={18} />
                </button>
              </div>
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-black text-lg text-gray-900 placeholder:text-gray-400" />
                <input required type="number" placeholder="Stock" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400" />
              </div>
              <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-bold text-gray-900 placeholder:text-gray-400">
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Ropa y Calzado">Ropa y Calzado</option>
                <option value="Tecnología">Tecnología y Electrónica</option>
                <option value="Salud y Belleza">Salud y Belleza</option>
                <option value="Hogar">Hogar y Muebles</option>
                <option value="Servicios">Servicios Generales</option>
              </select>
              <textarea placeholder="Descripción del producto (Opcional)" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[violet-600] font-medium text-gray-900 text-sm h-20 resize-none placeholder:text-gray-400" />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {newProd.imgUrl ? (
                  <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Camera size={40} className="mb-3" />
                    <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[violet-900] bg-[violet-600] shadow-lg cursor-pointer">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Producto Detectado en Catálogo Global / Nacional */}
      {scannedGlobalProduct && (
        <div className="fixed inset-0 bg-[violet-900]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-[violet-900] border border-[violet-600]/30 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            {/* Efecto de brillo de fondo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[violet-600]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-[violet-600]/10 text-[violet-600]">
                <Package size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F8F9FA]">Producto Detectado</h3>
                <p className="text-xs text-[violet-600] font-bold tracking-widest uppercase animate-pulse">
                  {scannedGlobalProduct.source === "local_venezuela" || scannedGlobalProduct.source === "supabase_cloud"
                    ? "Catálogo Nacional de Venezuela"
                    : "Base de Datos Global (OpenFoodFacts)"}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              El artículo escaneado está registrado en la base de datos central, pero <span className="text-[violet-600] font-bold">no existe aún en tu inventario local</span>. Puedes agregarlo instantáneamente.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex gap-4 items-center">
              {scannedGlobalProduct.imgUrl ? (
                <img
                  src={scannedGlobalProduct.imgUrl}
                  alt={scannedGlobalProduct.name}
                  className="w-20 h-20 object-cover rounded-xl border border-white/10 shadow-lg flex-shrink-0 bg-white/10 animate-fade-in"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[violet-600]">
                  <Camera size={28} />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[#F8F9FA] font-black text-lg truncate" title={scannedGlobalProduct.name}>
                  {scannedGlobalProduct.name}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Marca: <span className="text-gray-300 font-semibold">{scannedGlobalProduct.brand}</span> • Categoría: <span className="text-gray-300 font-semibold">{scannedGlobalProduct.category}</span>
                </p>
                <p className="text-[violet-600] font-mono text-xs mt-2 bg-[violet-600]/10 border border-[violet-600]/20 rounded px-2.5 py-1 inline-block">
                  {scannedGlobalProduct.barcode}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setScannedGlobalProduct(null)}
                className="w-1/3 py-3.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold cursor-pointer transition-colors"
              >
                Ignorar
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewProd({
                    name: scannedGlobalProduct.name,
                    price: "",
                    stock: "20",
                    imgUrl: scannedGlobalProduct.imgUrl || "",
                    category: scannedGlobalProduct.category || "Alimentos",
                    barcode: scannedGlobalProduct.barcode,
                    description: ""
                  });
                  setScannedGlobalProduct(null);
                  setShowAddModal(true);
                }}
                className="w-2/3 py-3.5 rounded-xl font-black text-[violet-900] bg-[violet-600] hover:bg-[#b08e72] shadow-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Registrar en Inventario
              </button>
            </div>
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-[violet-900] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[violet-900]">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[violet-900] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>

            {activeManual === 'operator' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[violet-600]" size={28} /> Manual del Operador (Caja)</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">1. Registro de Compras Físicas:</p>
                    <p>Usa el botón "Escanear QR / Compra" o busca el producto manualmente. Selecciona el método de pago e ingresa el RIF o Cédula del cliente si requiere Factura Fiscal.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">2. Validar Órdenes Online (E-Commerce):</p>
                    <p>Las compras realizadas por clientes en la tienda online aparecerán en el panel "Órdenes Online". Copia el mensaje SMS del banco (Pago Móvil) y pégalo en el "Conciliador SMS" para aprobar la orden automáticamente.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">3. Cierre de Caja (Reporte Z):</p>
                    <p>Al final del turno, debes presionar "Cerrar Caja (Z)" en el menú superior. Esto enviará la totalización al dueño y cerrará tu sesión operativa.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[violet-900] mb-1">4. Impresión Fiscal:</p>
                    <p>Asegúrate de que la aplicación "Sincro-Shield Proxy" esté corriendo en la PC de caja para que el sistema KFS pueda emitir los recibos por la impresora conectada.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeScreenshot && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[violet-900] border border-[violet-600]/30 rounded-[2.5rem] w-full max-w-lg p-6 shadow-2xl relative flex flex-col items-center">
            <button onClick={() => setActiveScreenshot(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-full">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-[violet-600] mb-4 text-center">Capture de Transacción</h3>
            <div className="w-full max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-2 flex justify-center items-center">
              <img src={activeScreenshot} alt="Transaction Capture" className="max-w-full h-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Marketplace Public View
const MarketplaceView = ({ db, submitOnlineOrder, formatUSD, logout, currentUser }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const { rates, triggerGhostTrap, showToast } = useKFS();
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
  const themeColor = settings.themeColor || "violet-600";
  const typography = settings.typography || "font-sans";
  const layoutType = settings.layoutType || "grid";
  const profilePicUrl = settings.profilePicUrl || "";

  return (
    <div className={`min-h-screen bg-[#EEF2F5] pb-20 ${activeStore ? typography : "font-sans"}`}>
      <Navbar title={activeStore ? `Mall: ${activeStore.company}` : "Flow Express"} showBack={true} onBack={logout} />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {activeStore && settings.coverPhotoUrl ? (
          <div className="relative rounded-3xl overflow-hidden shadow-sm mb-8 border border-gray-100">
            <div className="h-48 w-full bg-gray-200">
              <img src={settings.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white p-6 pt-12 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="absolute -top-12 left-6">
                <img src={profilePicUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&auto=format&fit=crop&q=60"} alt="Store Logo" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white" style={{ borderColor: themeColor }} />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-28">
                <h2 className="text-3xl font-black text-[violet-900]">{activeStore.company}</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">{settings.bioText || "Catálogo exclusivo de este negocio."}</p>
              </div>
              <div className="relative w-full sm:w-80 shrink-0">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar en esta tienda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400"
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
                <h2 className="text-2xl font-black text-[violet-900]">{activeStore ? activeStore.company : "Centros Comerciales KFS"}</h2>
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
                className="w-full bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[violet-600] text-gray-900 placeholder:text-gray-400"
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
                      <div className="w-16 h-16 bg-[violet-900]/5 rounded-2xl flex items-center justify-center group-hover:bg-[violet-600]/10 transition-colors">
                        <Store size={32} className="text-[violet-900] group-hover:text-[violet-600] transition-colors" />
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                        <Star size={12} className="fill-yellow-600" /> {c.rating || "5.0"}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-[violet-900]">{c.company}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{c.address || "Comercio Afiliado"}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>{pCount} Productos</span>
                      <span className="text-[violet-600]">Entrar a la tienda &rarr;</span>
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
              <button onClick={() => { setActiveStoreId(null); setSearchQuery(""); }} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[violet-900] transition-colors">
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

            {featuredProducts.length > 0 && selectedCategory === "All" && searchQuery === "" && (
              <div className="mb-8">
                <h3 className="text-lg font-black text-[violet-900] mb-4 flex items-center gap-2">
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
                            <h4 className="font-bold text-sm text-[violet-900] truncate mb-1">{p.name}</h4>
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
                      <span className="absolute bottom-2 left-2 text-[8px] bg-[violet-900]/80 text-[violet-600] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[violet-600]/20 backdrop-blur-sm">
                        {p.category || "General"}
                      </span>
                    </div>
                    <div className={`p-4 flex flex-col justify-between ${layoutType === 'list' ? 'w-full' : ''}`}>
                      <div>
                        <h4 className="font-bold text-sm text-[violet-900] truncate mb-1">{p.name}</h4>
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
};

// ==========================================
// RIDER DASHBOARD
// ==========================================
const RiderDashboard = ({ db, currentUser, logout }: any) => {
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
    <div className="min-h-screen bg-[#EEF2F5] text-[violet-900] font-sans pb-24 relative">
      {/* Wavy Header */}
      <div className="bg-gradient-to-br from-[violet-900] to-[#1a2b5e] rounded-b-[3rem] shadow-[0_10px_30px_rgba(10,17,40,0.3)] pt-6 pb-12 px-6 text-white relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-2 rounded-xl text-[violet-600]"><Truck size={20} /></span>
            <h1 className="font-black text-xl tracking-tight">KFS Delivery</h1>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">
            <LogOut size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0 border-4 shadow-lg bg-[violet-900] relative z-20 ${riderInfo.status === "approved" ? "border-green-400 shadow-green-500/20" : "border-amber-400 shadow-amber-500/20"}`}>
            <ProfileAvatarEditor currentUser={riderInfo} />
          </div>
          <div>
            <h2 className="font-black text-2xl truncate">{riderInfo.name}</h2>
            <p className="text-xs text-gray-300 font-mono truncate">{riderInfo.email}</p>
            <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${riderInfo.status === "approved" ? "bg-green-500 text-white" : "bg-amber-500 text-white animate-pulse"}`}>
              {riderInfo.status === "approved" ? "✅ Rider Activo" : "⏳ En Verificación"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-20 space-y-4 animate-fade-in">
        <UniversalWalletWidget currentUser={riderInfo} formatUSD={formatUSD} />

        {/* Check-In / Check-Out Widget */}
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="font-black text-sm text-[violet-900] uppercase tracking-wider mb-1 flex items-center justify-center md:justify-start gap-2">
              <Clock size={16} className={riderInfo.isWorking ? "text-green-500" : "text-gray-400"} />
              Disponibilidad
            </h3>
            <p className="text-xs text-gray-500 font-bold">Horas acumuladas: <span className="text-[violet-600] font-black">{(riderInfo.totalHours || 0).toFixed(1)} h</span></p>
            {riderInfo.isWorking && riderInfo.sessionStart && (
              <p className="text-[10px] text-green-600 font-bold mt-1 animate-pulse bg-green-50 px-2 py-1 rounded-md inline-block">
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
              <div className="bg-white rounded-3xl p-5 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-2"><Truck size={20} /></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Entregas</p>
                <p className="text-3xl font-black text-[violet-900] mt-1">{myDeliveries.length}</p>
              </div>
              <div className="bg-[violet-900] rounded-3xl p-5 text-center shadow-lg border border-[violet-900] flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[violet-600]/20 text-[violet-600] flex items-center justify-center mb-2"><DollarSign size={20} /></div>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Ganado</p>
                <p className="text-3xl font-black text-[violet-600] mt-1">${totalEarnings}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-black text-sm text-[violet-900] uppercase tracking-wider flex items-center gap-2"><Store size={16} className="text-[violet-600]" /> Negocios Asociados ({myBusinesses.length}/2)</h3>
              {myBusinesses.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">Aún no estás asociado a ningún negocio.</p>
              ) : myBusinesses.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[violet-600]/20 flex items-center justify-center font-black text-[violet-900] text-sm flex-shrink-0">
                    {b.company?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-sm text-[violet-900]">{b.company}</p>
                    <p className="text-[10px] text-gray-500">{b.address || b.location || "Sin dirección"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[violet-600] rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black text-sm text-[violet-900] flex items-center gap-2 mb-2"><CreditCard size={16} /> Cómo cobras</h3>
                <p className="text-xs text-[violet-900]/80 leading-relaxed font-bold">Por cada pedido que entregues, el cliente te pagará <span className="font-black text-white bg-[violet-900] px-1.5 py-0.5 rounded-md">$2.00 USD</span> directamente a tu Pago Móvil.</p>
              </div>
              <Star size={100} className="absolute -right-6 -bottom-6 opacity-10 text-white transform -rotate-12" />
            </div>

            {/* Rating + GPS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[2rem] p-5 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Calificación</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-xl ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}
                </div>
                <p className="text-xs font-black text-[violet-900] mt-1">{avgRating > 0 ? avgRating.toFixed(1) : "Sin calif."} <span className="text-gray-400 font-normal">({riderInfo.totalRatings || 0})</span></p>
              </div>
              <button
                onClick={toggleGPS}
                className={`rounded-[2rem] p-5 text-center border transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center ${gpsSharing ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
              >
                <p className={`text-[9px] font-bold uppercase tracking-wider ${gpsSharing ? 'text-green-100' : 'text-gray-400'}`}>GPS en Vivo</p>
                <p className="text-3xl mt-2">{gpsSharing ? '📍' : '📍'}</p>
                <p className={`text-[10px] font-black mt-2 ${gpsSharing ? 'text-white' : 'text-[violet-900]'}`}>
                  {gpsSharing ? 'Compartiendo' : 'Activar GPS'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* TAB: Pedidos */}
        {activeTab === "deliveries" && (
          <div className="space-y-3">
            <h3 className="font-black text-sm text-[violet-600] uppercase tracking-wider">Mis Pedidos Asignados</h3>
            {myDeliveries.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <Truck size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-sm font-bold text-gray-400">No tienes pedidos asignados aún.</p>
                <p className="text-xs text-gray-500 mt-1">Cuando el dueño despache un pedido, aparecerá aquí.</p>
              </div>
            ) : myDeliveries.map((tx: any) => {
              const client = db.clients?.find((c: any) => c.id === tx.clientId);
              const fullAddress = [tx.deliveryAddress, tx.deliveryCity].filter(Boolean).join(", ");
              const mapsUrl = fullAddress
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}&travelmode=driving`
                : null;
              return (
                <div key={tx.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-sm">{client?.company || tx.deliveryBusinessName || "Comercio"}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{tx.id}</p>
                      <p className="text-[10px] text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-400">+$2.00</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${tx.shippingStatus === "dispatched" ? "bg-blue-500/20 text-blue-400" : tx.shippingStatus === "picked_up" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"
                        }`}>
                        {tx.shippingStatus === "dispatched" ? "🛵 Asignado" : tx.shippingStatus === "picked_up" ? "📦 En camino" : "✅ Completado"}
                      </span>
                    </div>
                  </div>

                  {/* ===== DELIVERY ADDRESS + MAPS NAVIGATION ===== */}
                  {fullAddress ? (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 space-y-2">
                      <p className="text-[9px] text-orange-300 font-black uppercase tracking-wider flex items-center gap-1">
                        <Truck size={11} /> Dirección de entrega
                      </p>
                      <div>
                        <p className="text-sm font-black text-white">{fullAddress}</p>
                        {tx.deliveryReference && (
                          <p className="text-[10px] text-orange-200/70 mt-0.5">📍 {tx.deliveryReference}</p>
                        )}
                      </div>
                      {/* Navigation Map */}
                      {(tx.shippingStatus === "dispatched" || tx.shippingStatus === "picked_up") && (
                        <div className="mt-4 mb-2">
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
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <Truck size={11} /> El dueño no ha configurado dirección de delivery aún.
                      </p>
                    </div>
                  )}

                  {/* Pago Móvil */}
                  {tx.riderPagoMovil && (
                    <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3">
                      <p className="text-[9px] text-green-400 font-black uppercase tracking-wider mb-1">El cliente debe pagarte a:</p>
                      <p className="text-xs font-bold text-white">🏦 {tx.riderPagoMovil.banco} · 📱 {tx.riderPagoMovil.telefono} · 🪪 {tx.riderPagoMovil.cedula}</p>
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="font-black text-sm text-[violet-600] uppercase tracking-wider flex items-center gap-2"><CreditCard size={16} /> Datos de Pago Móvil</h3>
              {!editingPM ? (
                <>
                  <div className="space-y-2">
                    {[
                      { label: "Banco", value: riderInfo.pagoMovil?.banco || "No configurado" },
                      { label: "Teléfono", value: riderInfo.pagoMovil?.telefono || "No configurado" },
                      { label: "Cédula Titular", value: riderInfo.pagoMovil?.cedula || "No configurado" }
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
                        <span className="font-black text-sm text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setPmForm(riderInfo.pagoMovil || { banco: "", telefono: "", cedula: "" }); setEditingPM(true); }} className="w-full py-3 bg-[violet-600] text-[violet-900] font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-sm">
                    ✏️ Editar Datos de Pago Móvil
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <select value={pmForm.banco} onChange={e => setPmForm(p => ({ ...p, banco: e.target.value }))} className="w-full bg-[violet-900] border border-[violet-600]/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600]">
                    <option value="">— Banco —</option>
                    {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="tel" placeholder="Teléfono PM" value={pmForm.telefono} onChange={e => setPmForm(p => ({ ...p, telefono: e.target.value }))} className="w-full bg-[violet-900] border border-[violet-600]/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600]" />
                  <input placeholder="Cédula Titular" value={pmForm.cedula} onChange={e => setPmForm(p => ({ ...p, cedula: e.target.value }))} className="w-full bg-[violet-900] border border-[violet-600]/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[violet-600]" />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPM(false)} className="w-1/3 py-3 border border-white/20 text-gray-300 font-bold rounded-xl hover:bg-white/5 cursor-pointer text-sm">Cancelar</button>
                    <button onClick={handleSavePM} className="w-2/3 py-3 bg-[violet-600] text-[violet-900] font-black rounded-xl hover:scale-[1.02] cursor-pointer text-sm">Guardar</button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4">
              <p className="text-xs text-blue-300 font-bold">ℹ️ Estos datos se muestran automáticamente al cliente cuando se le asigna tu delivery. El cliente debe pagarte $2.00 USD directamente a tu Pago Móvil.</p>
            </div>
          </div>
        )}

        {/* TAB: Documentos */}
        {activeTab === "docs" && (
          <div className="space-y-4">
            <h3 className="font-black text-sm text-[violet-600] uppercase tracking-wider">Documentos Registrados</h3>
            {[
              { label: "Cédula de Identidad", key: "cedulaImg", icon: "🪪" },
              { label: "Certificado Médico", key: "medCertImg", icon: "🏥" },
              { label: "Licencia de Conducir", key: "licenseImg", icon: "🚗" }
            ].map(({ label, key, icon }) => (
              <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-black text-sm">{label}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${(riderInfo as any)[key] ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {(riderInfo as any)[key] ? "✅ Cargado" : "⚠️ No subido"}
                    </span>
                  </div>
                </div>
                {(riderInfo as any)[key] && (
                  <img src={(riderInfo as any)[key]} alt={label} className="w-full max-h-40 object-contain rounded-xl border border-white/10" />
                )}
              </div>
            ))}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4">
              <p className="text-xs text-amber-300 font-bold">⚠️ Los documentos son revisados por el Arquitecto KFS para verificar tu identidad antes de aprobar tu cuenta.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
        <div className="fixed inset-0 bg-[#0B0104]/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 animate-fade-in">
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
