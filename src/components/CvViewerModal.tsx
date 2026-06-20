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



// ==========================================
// SUBCOMPONENTS (DEFINED OUTSIDE PARENT TO PREVENT UNMOUNT RESETS)
// ==========================================

// Toast Component

export const CvViewerModal = ({ isOpen, onClose, candidate }: any) => {
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
      <div className="bg-white text-violet-900 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-scale-up">
        {/* Modal Actions */}
        <div className="bg-gray-50 border-b border-gray-100 p-5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-black text-lg text-violet-900">Previsualizar CV Digital</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Generador de PDF {KFS_BRAND.productAcronym} OS</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-violet-900 text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
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

            <div className="section-title">Micro-Encuesta {KFS_BRAND.productAcronym}</div>
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
              Sello de Validación Técnica {KFS_BRAND.productAcronym} OS • ID Postulante: {candidate.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
