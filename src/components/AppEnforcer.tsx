"use client";

import { KFS_BRAND } from "../config/brandConfig";
import React, { useState, useEffect } from "react";
import { BellRing, Smartphone, ShieldAlert } from "lucide-react";

import { Lock, KeyRound, ArrowRight } from "lucide-react";
import { useKFS } from "../context/KFSContext";

export function AppEnforcer({ children, currentUser: propsUser, updatePwaStatus }: { children: React.ReactNode, currentUser?: any, updatePwaStatus?: (status: boolean) => void }) {
  const kfsContext = useKFS() as any;
  const currentUser = propsUser || kfsContext?.currentUser;
  const db = kfsContext?.db;

  const [isStandalone, setIsStandalone] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [masterBypassed, setMasterBypassed] = useState(false);
  const [bypassPin, setBypassPin] = useState("");
  const [bypassError, setBypassError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check URL or storage for Master Architect god mode bypass
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const storedBypass = sessionStorage.getItem("kfs_master_bypass") === "true";

    if (hash.includes("mode=god#core") || search.includes("mode=god") || search.includes("bypass=199521") || storedBypass) {
      setMasterBypassed(true);
    }

    const checkStatus = () => {
      const isIosStandalone = (window.navigator as any).standalone === true;
      const isWebStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isIosStandalone || isWebStandalone);

      if (!("Notification" in window)) {
        setHasPermissions(false);
      } else {
        setHasPermissions(Notification.permission === "granted");
      }
      setIsChecking(false);
    };

    checkStatus();
    
    // Register Service Worker for Native Push Notifications
    import("../lib/pushNotifications").then(({ registerServiceWorker }) => {
      registerServiceWorker();
    });

    const mql = window.matchMedia('(display-mode: standalone)');
    mql.addEventListener('change', checkStatus);
    
    return () => {
      mql.removeEventListener('change', checkStatus);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setHasPermissions(true);
    } else {
      alert("Debes permitir las notificaciones desde la configuración de tu navegador.");
    }
  };

  // Cloud Bypass Logic
  useEffect(() => {
    if (!isChecking && isStandalone && hasPermissions && currentUser && !currentUser.pwaInstalled && updatePwaStatus) {
      updatePwaStatus(true);
    }
  }, [isChecking, isStandalone, hasPermissions, currentUser, updatePwaStatus]);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (bypassPin.trim() === "199521") {
      setMasterBypassed(true);
      sessionStorage.setItem("kfs_master_bypass", "true");
      setBypassError("");
    } else {
      setBypassError("Código de Arquitecto Core inválido.");
    }
  };

  if (isChecking) return null;

  // Master Admin & Architect Roles always bypass suspension
  const isMasterRole = currentUser?.role === "kreatekCore" || currentUser?.role === "core" || currentUser?.name === "Ivory21" || currentUser?.name === "gaby21" || currentUser?.name === "valle21.";

  // Commercial Subscription Enforcement Check
  let isCommerceSuspended = false;
  if (!masterBypassed && !isMasterRole && currentUser && db) {
    const isCommerceRole = currentUser.role === "dueño" || currentUser.role === "client" || currentUser.role === "comercio";
    const isSellerRole = currentUser.role === "vendedor";

    let targetClient: any = null;
    if (isCommerceRole) {
      targetClient = (db.clients || []).find((c: any) => c.id === currentUser.id) || currentUser;
    } else if (isSellerRole) {
      targetClient = (db.clients || []).find((c: any) => c.id === currentUser.clientId);
    }

    if (targetClient && targetClient.subscription) {
      const sub = targetClient.subscription;
      const currentDay = new Date().getDate();
      
      // Check 7-day guarantee window / trial
      const createdAt = sub.contract_start_date || targetClient.createdAt || targetClient.created_at;
      const isTrial = sub.is_trial_active ?? (createdAt ? Date.now() <= new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000 : false);
      
      const paymentStatus = sub.payment_status || (sub.status === "active" ? "settled" : "pending");
      
      // If current date > day 5 of billing cycle and payment is not settled and trial is not active
      if (!isTrial && currentDay > 5 && paymentStatus !== "settled") {
        isCommerceSuspended = true;
      }
      
      // Explicit past due flag
      if (sub.status === "past_due" && !isTrial) {
        isCommerceSuspended = true;
      }
    }
  }

  // Render Suspension Screen if suspended
  if (isCommerceSuspended) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-lg w-full bg-slate-900/90 backdrop-blur-xl border border-red-500/30 rounded-[2.5rem] p-8 md:p-10 text-center space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <Lock size={36} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full inline-block">
              Control de Acceso Operativo
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Acceso Suspendido</h2>
          </div>

          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-5 text-slate-200 text-sm leading-relaxed text-left space-y-3">
            <p className="font-semibold text-red-200">
              Acceso suspendido temporalmente por conciliación de cuota mensual de mantenimiento ($100 USD). Comuníquese con Kreatek Central para reactivación inmediata.
            </p>
            <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-red-900/40 flex justify-between items-center">
              <span>Ciclo de cobro: Días 1 al 5</span>
              <span className="text-red-400 font-bold">Estado: Pendiente</span>
            </div>
          </div>

          {/* Master Architect Bypass Input */}
          <form onSubmit={handleUnlockPin} className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block text-left flex items-center gap-1.5">
              <KeyRound size={12} className="text-violet-400" /> Desbloqueo Maestro (Arquitecto Core / Supervisor)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={8}
                placeholder="Código de Arquitecto (199521)"
                value={bypassPin}
                onChange={(e) => setBypassPin(e.target.value)}
                className="flex-1 bg-black/50 border border-violet-900/50 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono tracking-widest"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-5 rounded-xl font-black text-xs transition-colors cursor-pointer flex items-center gap-1 border-none shadow-md shadow-violet-600/30"
              >
                <span>Acceder</span>
                <ArrowRight size={14} />
              </button>
            </div>
            {bypassError && <p className="text-xs text-red-400 text-left font-bold">{bypassError}</p>}
          </form>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 text-[10px]">KFS OS Enterprise Security</span>
            <a
              href="https://wa.me/584141234567?text=Hola,%20requiero%20asistencia%20con%20la%20conciliación%20de%20mantenimiento%20KFS%20OS."
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 font-bold underline"
            >
              Contactar Soporte Central
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
