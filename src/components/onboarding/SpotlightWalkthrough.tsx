"use client";

import React, { useState } from "react";
import { Sparkles, Package, ShoppingCart, TrendingUp, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface SpotlightWalkthroughProps {
  onClose: () => void;
  onNavigateTab?: (tabKey: string) => void;
}

export const SpotlightWalkthrough: React.FC<SpotlightWalkthroughProps> = ({
  onClose,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Tu Catálogo de Productos & Precios",
      badge: "Inventario Inteligente",
      icon: Package,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-400/20 border-amber-400/30",
      description: "Administra fácilmente tus productos con fotos en alta definición, control de stock mínimo y precios calculados automáticamente en dólares y bolívares a la tasa oficial del BCV.",
      tip: "💡 Tip: Puedes precargar 25 productos esenciales venezolanos en 1 solo clic.",
      tabTarget: "inventory"
    },
    {
      title: "2. Punto de Venta Rápido (Axis Nitro POS)",
      badge: "Caja en Mostrador",
      icon: ShoppingCart,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20 border-emerald-500/30",
      description: "Cobra en menos de 10 segundos utilizando el escáner óptico con la cámara de tu teléfono, el asistente de vueltos automáticos multi-moneda y la emisión de recibos térmicos o por WhatsApp.",
      tip: "⚡ Tip: No necesitas comprar pistolas de código de barras ni terminales costosas.",
      tabTarget: "pos"
    },
    {
      title: "3. Métricas en Vivo & Arqueo Ciego",
      badge: "Finanzas & Control",
      icon: TrendingUp,
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/20 border-cyan-500/30",
      description: "Monitorea tus ventas brutas, utilidades netas, comisiones y realiza cierres de caja ciegos (Reporte Z) para garantizar que el dinero en gaveta cuadre al centavo todos los días.",
      tip: "🛡️ Tip: Todos tus registros están protegidos con persistencia absoluta e indestructible.",
      tabTarget: "overview"
    }
  ];

  const active = steps[currentStep];
  const IconComponent = active.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (onNavigateTab) onNavigateTab(steps[currentStep + 1].tabTarget);
    } else {
      localStorage.setItem("kfs_tour_completed", "true");
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (onNavigateTab) onNavigateTab(steps[currentStep - 1].tabTarget);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-violet-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative space-y-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${active.bgColor}`}>
              {active.badge} • Paso {currentStep + 1} de {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem("kfs_tour_completed", "true");
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border ${active.bgColor}`}>
              <IconComponent size={24} className={active.iconColor} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {active.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {active.description}
          </p>

          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-white/10 text-xs text-amber-300/90 font-medium">
            {active.tip}
          </div>
        </div>

        {/* Dots & Nav Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep ? "w-6 bg-amber-400" : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} /> Anterior
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{currentStep === steps.length - 1 ? "¡Empezar a Facturar!" : "Siguiente"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
