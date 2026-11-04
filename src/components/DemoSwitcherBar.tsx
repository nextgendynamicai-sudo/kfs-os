"use client";

import React, { useState } from "react";
import { useKFS } from "../context/KFSContext";
import { isS25UltraOfflineMode, deactivateS25UltraOfflineMode } from "../lib/deviceMode";
import {
  Store, ShoppingCart, Truck, Smartphone,
  RotateCcw, X, ChevronUp, ChevronDown, CheckCircle2, Shield, Minus, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DemoSwitcherBar() {
  const {
    currentUser,
    view,
    setView,
    loadDemoCommerce,
    resetDemoCommerceData,
    logout
  } = useKFS() as any;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Solo mostrar si el usuario está en modo offline S25 Ultra O si tiene activa la sesión de demo
  const isDemoActive = Boolean(
    isS25UltraOfflineMode() ||
    (currentUser && (
      currentUser.id === "demo-comercio-kfs" ||
      currentUser.isDemoUser ||
      currentUser.clientId === "demo-comercio-kfs" ||
      currentUser.merchantId === "demo-comercio-kfs" ||
      currentUser.email === "comercio@demo.com" ||
      currentUser.email === "carlos@demo.com" ||
      currentUser.email === "maria@demo.com" ||
      currentUser.email === "rider@demo.com"
    ))
  );

  if (!isDemoActive) return null;

  const handleExitToWeb = () => {
    deactivateS25UltraOfflineMode();
    if (logout) logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  if (isMinimized) {
    return (
      <aside aria-label="Consola S25 Ultra Offline minimizada" className="fixed bottom-24 right-3 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 backdrop-blur-xl border border-violet-500/50 text-white text-[11px] font-bold shadow-[0_6px_25px_rgba(139,92,246,0.45)] active:scale-95 cursor-pointer hover:border-violet-400 transition-all"
          title="Abrir consola S25 Ultra Offline"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="bg-gradient-to-r from-violet-300 via-white to-indigo-300 bg-clip-text text-transparent font-black tracking-wide">
            S25 OFFLINE
          </span>
          <ChevronUp size={13} className="text-violet-300" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Consola Samsung S25 Ultra Offline" className="fixed bottom-24 sm:bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-lg pointer-events-auto">
      <div className="bg-slate-950/95 backdrop-blur-xl border border-violet-500/40 rounded-2xl shadow-[0_10px_35px_rgba(139,92,246,0.35)] p-2 text-white overflow-hidden transition-all duration-300">
        {/* Cabecera / Pill de Control */}
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  S25 Ultra · Edición Offline
                </span>
                <span className="px-1.5 py-0.2 text-[8px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  STANDALONE
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">
                Bodegón Gourmet Caracas (100% Sin Conexión)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title={isExpanded ? "Contraer roles" : "Cambiar rol del sistema"}
            >
              <span>Roles</span>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
              title="Minimizar a botón flotante discreto"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleExitToWeb}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
              title="Salir al Modo Web Producción"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Roles y Acciones Rápidas */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2 border-t border-white/10 mt-1.5 space-y-2"
            >
              <div className="grid grid-cols-4 gap-1.5 px-1">
                {/* Dueño */}
                <button
                  onClick={() => {
                    loadDemoCommerce?.("dueño");
                    setIsExpanded(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    view === "client" && currentUser?.role === "dueño"
                      ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <Store size={18} className="mb-1" />
                  <span className="text-[10px] font-bold leading-tight">Dueño</span>
                  <span className="text-[8px] opacity-70">Gerencia</span>
                </button>

                {/* Cajero / POS */}
                <button
                  onClick={() => {
                    loadDemoCommerce?.("vendedor");
                    setIsExpanded(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    view === "vendedor"
                      ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <ShoppingCart size={18} className="mb-1" />
                  <span className="text-[10px] font-bold leading-tight">Caja POS</span>
                  <span className="text-[8px] opacity-70">Cajero 1</span>
                </button>

                {/* Rider */}
                <button
                  onClick={() => {
                    loadDemoCommerce?.("rider");
                    setIsExpanded(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    view === "rider"
                      ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <Truck size={18} className="mb-1" />
                  <span className="text-[10px] font-bold leading-tight">Rider</span>
                  <span className="text-[8px] opacity-70">Delivery</span>
                </button>

                {/* Cliente */}
                <button
                  onClick={() => {
                    loadDemoCommerce?.("customer");
                    setIsExpanded(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    view === "customer"
                      ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <Smartphone size={18} className="mb-1" />
                  <span className="text-[10px] font-bold leading-tight">Cliente</span>
                  <span className="text-[8px] opacity-70">App Rewards</span>
                </button>
              </div>

              {/* Botones de Utilidad */}
              <div className="flex items-center justify-between gap-2 px-1 pt-1 border-t border-white/5 text-[10px]">
                <button
                  onClick={() => resetDemoCommerceData?.()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reiniciar Datos Demo</span>
                </button>

                <button
                  onClick={handleExitToWeb}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium transition-colors cursor-pointer"
                >
                  <Globe size={12} />
                  <span>Salir a Modo Web Producción</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
