"use client";

import React, { useState } from "react";
import { 
  Sparkles, ShoppingCart, Package, Share2, ArrowRight, ArrowLeft, 
  CheckCircle2, Store, DollarSign, Zap, QrCode, Copy, ExternalLink, X
} from "lucide-react";
import { playPremiumChime, triggerHapticFeedback } from "../lib/utils";
import { KFS_BRAND } from "../config/brandConfig";

interface MerchantOnboardingTourProps {
  clientInfo: any;
  onComplete: () => void;
  onClose: () => void;
  setActiveTab?: (tab: string) => void;
  showToast?: (msg: string, type?: "success" | "error") => void;
}

export function MerchantOnboardingTour({
  clientInfo,
  onComplete,
  onClose,
  setActiveTab,
  showToast
}: MerchantOnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const tenantSlug = clientInfo?.slug || clientInfo?.company?.toLowerCase().replace(/\s+/g, '-') || "tienda";
  const storeUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/nitro/${tenantSlug}` 
    : `https://axisnitro.store/nitro/${tenantSlug}`;

  const handleCopyStoreLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      triggerHapticFeedback([50, 50]);
      if (showToast) showToast("¡Enlace de tu tienda copiado al portapapeles!", "success");
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleNext = () => {
    triggerHapticFeedback([40]);
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      playPremiumChime();
      onComplete();
    }
  };

  const handlePrev = () => {
    triggerHapticFeedback([30]);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const steps = [
    {
      step: 1,
      tag: "Paso 1 de 3: Operaciones de Caja",
      title: "Tu Punto de Venta (POS) Inteligente",
      subtitle: "Facturación multimoneda ultra-rápida y cero problemas de vuelto.",
      icon: <ShoppingCart size={32} className="text-violet-400" />,
      badgeColor: "from-violet-600 to-indigo-600",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu caja registradora está lista para vender en <strong className="text-white">Dólares y Bolívares</strong> con conversión automática a la tasa oficial del BCV.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-slate-950/60 border border-violet-500/20 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-300">
                <Zap size={14} className="text-amber-400" /> Calculadora de Vuelto
              </div>
              <p className="text-[10px] text-slate-400">
                Calcula automáticamente el vuelto exacto en efectivo o Pago Móvil para agilizar las colas.
              </p>
            </div>
            <div className="bg-slate-950/60 border border-violet-500/20 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-300">
                <DollarSign size={14} className="text-emerald-400" /> Arqueos y Cierre Z
              </div>
              <p className="text-[10px] text-slate-400">
                Reportes detallados por turno y cajero listos para imprimir o exportar en PDF.
              </p>
            </div>
          </div>
          <div className="bg-violet-950/40 border border-violet-500/30 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">¿Dónde encontrarlo?</span>
            <span className="text-[10px] bg-violet-600/30 text-violet-200 px-3 py-1 rounded-full font-mono font-bold">
              Pestaña: Resumen & Caja POS
            </span>
          </div>
        </div>
      )
    },
    {
      step: 2,
      tag: "Paso 2 de 3: Control de Stock",
      title: "Tu Inventario y Precios en Tiempo Real",
      subtitle: "Gestiona tus artículos, fotos y alertas de stock bajo con 1 toque.",
      icon: <Package size={32} className="text-amber-400" />,
      badgeColor: "from-amber-500 to-orange-500",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            Puedes cargar todos tus productos con foto, precio en USD y stock. Cada vez que vendes en caja, el stock se descuenta automáticamente.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                <QrCode size={14} className="text-violet-400" /> Código de Barras
              </div>
              <p className="text-[10px] text-slate-400">
                Escanea artículos directamente con la cámara de tu teléfono o pistola lectora USB.
              </p>
            </div>
            <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                <Store size={14} className="text-emerald-400" /> Destacados en Vitrina
              </div>
              <p className="text-[10px] text-slate-400">
                Marca tus productos estrella para que aparezcan de primeros en tu tienda online.
              </p>
            </div>
          </div>
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">¿Dónde encontrarlo?</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full font-mono font-bold">
              Pestaña: Inventario
            </span>
          </div>
        </div>
      )
    },
    {
      step: 3,
      tag: "Paso 3 de 3: Ventas por Internet",
      title: "Tu Tienda Virtual en Redes Sociales",
      subtitle: "Vende 24/7 con pedidos directos a tu WhatsApp y delivery integrado.",
      icon: <Share2 size={32} className="text-emerald-400" />,
      badgeColor: "from-emerald-500 to-teal-500",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu negocio ya tiene una tienda web activa y optimizada para celulares. Copia tu enlace y colócalo en el perfil de tu <strong className="text-white">Instagram, TikTok y estados de WhatsApp</strong>.
          </p>
          
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Enlace Público de tu Tienda:
              </span>
              <a 
                href={storeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-bold no-underline"
              >
                Abrir Tienda <ExternalLink size={10} />
              </a>
            </div>
            
            <div className="flex items-center gap-2 bg-black/50 border border-slate-800 rounded-xl px-3 py-2">
              <span className="text-xs text-emerald-300 font-mono truncate flex-1 select-all">
                {storeUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyStoreLink}
                className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-lg transition-all cursor-pointer border-none flex items-center gap-1 active:scale-95 shrink-0"
              >
                {copiedLink ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                {copiedLink ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">¿Dónde encontrarlo?</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full font-mono font-bold">
              Pestaña: Configuración & Enlace
            </span>
          </div>
        </div>
      )
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-violet-500/40 rounded-[2.5rem] shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 text-white text-center relative overflow-hidden">
        
        {/* Close / Skip button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer border-none bg-transparent"
        >
          <X size={20} />
        </button>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepNum === currentStep 
                  ? "w-10 bg-gradient-to-r from-violet-500 to-indigo-500" 
                  : stepNum < currentStep 
                    ? "w-6 bg-emerald-400" 
                    : "w-4 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Icon & Step Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-slate-950 border border-violet-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-inner shadow-violet-500/20">
            {current.icon}
          </div>

          <div className="space-y-1">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border border-white/10 bg-gradient-to-r ${current.badgeColor} text-white inline-block shadow-sm`}>
              {current.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="py-2">
          {current.content}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft size={14} /> Anterior
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer border-none bg-transparent"
            >
              Saltar Guía
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="py-3.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-violet-600/30 transition-all cursor-pointer border-none flex items-center gap-2 active:scale-95 ml-auto"
          >
            {currentStep === 3 ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" /> ¡Comenzar a Vender!
              </>
            ) : (
              <>
                Siguiente <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
