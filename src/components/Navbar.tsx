"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Bell, 
  Sun, 
  Moon, 
  X, 
  ShoppingBag, 
  Store, 
  LogOut 
} from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { KreatekLogo } from "./KreatekLogo";
import { compressImage, playSyncChime } from "../lib/utils";
import { isSupabaseConfigured } from "../context/supabase";

export const Navbar = ({ title, showBack = false, onBack }: { title?: string, showBack?: boolean, onBack?: () => void }) => {
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // Default to light mode for the executive Fintech glassmorphism experience
      const isDark = savedTheme === "dark";
      setTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

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
        return { 
          color: "bg-emerald-500 shadow-[0_0_8px_#10b981]", 
          border: "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", 
          label: "ONLINE (NUBE)", 
          text: "text-emerald-600 dark:text-emerald-400" 
        };
      case "mesh":
        return { 
          color: "bg-amber-500 shadow-[0_0_8px_#f59e0b]", 
          border: "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300", 
          label: "LOCAL MESH (P2P)", 
          text: "text-amber-600 dark:text-amber-400" 
        };
      case "offline":
        return { 
          color: "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse", 
          border: "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-50 dark:bg-red-950/20 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse", 
          label: "OFFLINE (STAND-ALONE)", 
          text: "text-red-600 dark:text-red-400" 
        };
      default:
        return { 
          color: "bg-emerald-500 shadow-[0_0_8px_#10b981]", 
          border: "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", 
          label: "ONLINE (NUBE)", 
          text: "text-emerald-600 dark:text-emerald-400" 
        };
    }
  };

  const net = getNetworkDetails();
  const latestNotif: any = currentUser ? [...(db.notifications || [])].filter((n: any) => n.audience === 'all' || n.audience === currentUser.role).pop() : null;

  return (
    <>
      {/* Alerta Global de Notificaciones Urgentes (Solo si existe y usuario está logueado) */}
      {latestNotif && (
        <div className="w-full bg-gradient-to-r from-rose-600 to-violet-700 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md z-50 animate-fade-in relative">
          <Bell size={15} className="animate-bounce" />
          <span className="uppercase tracking-widest text-[11px] bg-white/20 px-2 py-0.5 rounded-full">{latestNotif.title}:</span>
          <span className="font-normal">{latestNotif.message}</span>
        </div>
      )}

      {/* Barra de Navegación Principal en Cristal Translúcido (Glassmorphism de Élite) */}
      <nav className="flex flex-row justify-between items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 shadow-xs transition-all duration-300 gap-3 w-full">
        
        {/* ========================================================= */}
        {/* IZQUIERDA: BOTÓN VOLVER + LOGO FUSIONADO + BRANDING ELEGANTE */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-xs text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer mr-1 shadow-xs"
              title="Regresar a la pantalla anterior"
            >
              <ChevronLeft size={16} />
              <span className="hidden xs:inline">Atrás</span>
            </button>
          )}

          {/* Logo fusionado de forma limpia sin caja blanca tosca */}
          <div 
            onClick={() => { if (!currentUser) setView("landing"); }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
            title="AXIS NITRO KFS OS 8.0"
          >
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-white/80 dark:bg-white/10 border border-violet-100 dark:border-white/15 shadow-xs group-hover:bg-white/95 group-hover:scale-105 transition-all duration-300">
              <KreatekLogo className="h-8 sm:h-9 w-auto drop-shadow-sm filter" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-950 dark:from-white dark:via-violet-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  AXIS NITRO
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60 shadow-xs">
                  OS 8.0
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                FINTECH PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTRO: TÍTULO CONTEXTUAL (SI APLICA EN MARKETPLACE/DASHBOARD) */}
        {/* ========================================================= */}
        {title && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="truncate max-w-xs">{title}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* DERECHA: PÚBLICO COMERCIAL (MILLION-DOLLAR) vs SESIÓN PRIVADA */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0">
          
          {/* ------------------------------------------------------- */}
          {/* CASO A: VISTA PÚBLICA / ACCESO (SIN USUARIO LOGUEADO)   */}
          {/* Cero botones toscos de programador, 100% comercial      */}
          {/* ------------------------------------------------------- */}
          {!currentUser ? (
            <>
              {/* Micro-chip de Estado Bancario en Línea (Discreto y Elegante) */}
              <div
                onClick={cycleNetworkState}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 transition-all shadow-xs select-none"
                title="Infraestructura Bancaria en tiempo real (Click para alternar contingencia)"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.color}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${net.color}`}></span>
                </span>
                <span className="font-semibold tracking-tight">
                  {networkState === 'offline' ? 'Modo Offline' : networkState === 'mesh' ? 'Malla P2P' : 'Sistemas en Línea'}
                </span>
              </div>

              {/* Botón Explorar Catálogo / Mercado */}
              <button
                onClick={() => setView("marketplace")}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                title="Ver vitrina de productos y comercios afiliados"
              >
                <ShoppingBag size={14} className="text-violet-600 dark:text-violet-400" />
                <span>Catálogo</span>
              </button>

              {/* Botón Comercial: Afiliar Negocio */}
              <button
                onClick={() => setView("b2b-onboarding")}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs shadow-violet-500/20 hover:shadow-md transition-all cursor-pointer border-none"
                title="Registra tu negocio y obtén punto de venta POS"
              >
                <Store size={14} />
                <span>Afiliar Negocio</span>
              </button>

              {/* Selector de Modo Claro / Oscuro */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer h-8 w-8 bg-white/70 dark:bg-slate-900/70 shadow-xs"
                title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </>
          ) : (
            /* ------------------------------------------------------- */
            /* CASO B: SESIÓN AUTENTICADA (OPERATIVO EN DASHBOARD)     */
            /* Herramientas avanzadas con diseño Glassmorphism refinado */
            /* ------------------------------------------------------- */
            <>
              {/* Telemetría y Sincronización de Red P2P / Nube */}
              <button
                onClick={cycleNetworkState}
                disabled={isSyncing}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${net.border} cursor-pointer group disabled:opacity-50 shadow-xs`}
                title="Gestor de Conexión de Contingencia y Sincronización"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.color}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${net.color}`}></span>
                </span>
                <span className={`font-mono text-[10px] font-black ${net.text} tracking-wider`}>
                  {isSyncing ? "SINCRONIZANDO..." : net.label}
                </span>
              </button>

              {/* Indicador de Nube Supabase */}
              <span 
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-black font-mono tracking-wider bg-white/70 dark:bg-slate-900/70 shadow-xs ${
                  isSupabaseConfigured 
                    ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" 
                    : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                }`}
                title={isSupabaseConfigured ? "Supabase Cloud: Conectado" : "Supabase Cloud: Desconectado (Usando Mock Local)"}
              >
                {isSupabaseConfigured ? "☁️ CLOUD ACTIVE" : "☁️ MOCK ACTIVE"}
              </span>

              {/* Compartir APK / App */}
              <button
                onClick={async () => {
                  const shareUrl = `${window.location.origin}/download-apk`;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: "KFS-OS APK",
                        text: "Descarga la aplicación oficial de KFS-OS en tu dispositivo móvil",
                        url: shareUrl
                      });
                      showToast("Enlace compartido con éxito", "success");
                    } catch (e) {
                      // user cancelled
                    }
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    showToast("Enlace de descarga copiado al portapapeles.", "success");
                  }
                }}
                className="hidden sm:flex items-center justify-center p-2 rounded-xl border border-violet-200 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300 transition-all cursor-pointer h-8 px-2.5 gap-1.5 bg-violet-50/60 dark:bg-violet-950/30 text-[11px] font-bold shadow-xs"
                title="Compartir enlace de descarga de la aplicación móvil"
              >
                <span>🔗 App</span>
              </button>

              {/* Selector de Modo Claro / Oscuro */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer h-8 w-8 bg-white/70 dark:bg-slate-900/70 shadow-xs"
                title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>

              {/* Campana de Notificaciones Interactiva */}
              <button
                onClick={() => setShowNotifDrawer(prev => !prev)}
                className="relative flex items-center justify-center p-2 rounded-xl border border-violet-200 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 transition-all cursor-pointer h-8 w-8 bg-violet-50/50 dark:bg-violet-950/40 shadow-xs"
                title="Ver centro de notificaciones"
              >
                <Bell size={14} className={db.notifications?.length > 0 ? "animate-pulse text-amber-500" : ""} />
                {(db.notifications || []).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow-sm">
                    {(db.notifications || []).length}
                  </span>
                )}
              </button>

              {/* Foto de Perfil / Cambio de Avatar */}
              {currentUser.role !== "marketplace" && (
                <label 
                  className="relative w-8 h-8 rounded-full border-2 border-violet-500/40 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-100 dark:bg-white/10 hover:border-violet-600 transition-all shadow-xs group" 
                  title="Toca tu foto para actualizar tu imagen de perfil"
                >
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
                            const updated = { ...prev };
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
                    <div className="w-full h-full bg-violet-600 text-white font-black text-[10px] flex items-center justify-center">
                      {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[8px] text-white font-black">⚙️</span>
                  </div>
                </label>
              )}

              {/* Botón Salir / Logout */}
              <button
                onClick={logout}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                title="Cerrar Sesión y salir del sistema"
              >
                <LogOut size={13} />
                <span className="hidden xs:inline">Salir</span>
              </button>
            </>
          )}
        </div>

        {/* Drawer Lateral del Centro de Notificaciones */}
        {showNotifDrawer && (
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex justify-end animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border-l border-violet-500/30 text-white h-full p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell className="text-amber-400" size={20} />
                    <h3 className="text-lg font-black text-white">Centro de Notificaciones</h3>
                  </div>
                  <button 
                    onClick={() => setShowNotifDrawer(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white border-none cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 py-2 scrollbar-thin">
                  {(() => {
                    const userNotifs = (db.notifications || []).filter((n: any) => 
                      !n.audience || n.audience === 'all' || n.audience === 'global' || n.audience === currentUser?.role || currentUser?.role === 'core'
                    );

                    if (userNotifs.length === 0) {
                      return (
                        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2 my-4 shadow-inner">
                          <Bell className="mx-auto text-slate-500 mb-2" size={36} />
                          <p className="text-sm font-bold text-slate-200">Sin notificaciones pendientes</p>
                          <p className="text-xs text-slate-400">Todas las alertas del ecosistema aparecerán en esta bandeja.</p>
                        </div>
                      );
                    }

                    return userNotifs.slice().reverse().map((notif: any, idx: number) => (
                      <div key={notif.id || idx} className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 space-y-2 relative overflow-hidden hover:border-violet-500/50 transition-all">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">{notif.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {notif.date ? new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "En vivo"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{notif.message}</p>
                        {notif.imageUrl && (
                          <img src={notif.imageUrl} alt="Adjunto" className="w-full max-h-36 object-cover rounded-xl border border-white/10 mt-2" />
                        )}
                        {notif.destType && notif.destType !== "none" && (
                          <button
                            onClick={() => {
                              setShowNotifDrawer(false);
                              if (notif.destType === "product") {
                                setView("landing");
                              } else if (notif.destType === "store" && setView) {
                                setView("client");
                              } else if (notif.destType === "url" && notif.destVal) {
                                window.open(notif.destVal, "_blank");
                              }
                            }}
                            className="w-full mt-2 py-2 bg-violet-600/80 hover:bg-violet-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer flex items-center justify-center gap-1"
                          >
                            Ir a Destino ➔
                          </button>
                        )}
                      </div>
                    ));
                  })()}
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex justify-between gap-3 shrink-0">
                  <button 
                    onClick={() => {
                      showToast("Notificación Push de prueba emitida", "success");
                    }}
                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs border-none cursor-pointer shadow-lg shadow-violet-600/30"
                  >
                    ⚡ Probar Alerta
                  </button>
                  <button 
                    onClick={() => setShowNotifDrawer(false)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

