"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Bell, Sun, Moon, X } from "lucide-react";
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
      const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setTheme(isDark ? "dark" : "light");
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
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 bg-violet-900 sticky top-0 z-40 backdrop-blur-md gap-3 w-full">
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

          {/* Supabase Connection Status Badge */}
          <span 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black font-mono tracking-wider bg-white/5 ${
              isSupabaseConfigured 
                ? "border-emerald-500/30 text-emerald-400" 
                : "border-white/10 text-gray-400"
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
                  // user cancelled or share failed
                }
              } else {
                navigator.clipboard.writeText(shareUrl);
                showToast("Enlace de descarga copiado al portapapeles.", "success");
              }
            }}
            className="flex items-center justify-center p-2 rounded-xl border border-violet-500/30 hover:bg-violet-800 text-violet-300 hover:text-white transition-all cursor-pointer h-8 px-3 gap-1.5 bg-violet-950/40 text-xs font-black uppercase tracking-wider"
            title="Compartir enlace de descarga de la aplicación móvil"
          >
            <span>🔗 Compartir App</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all cursor-pointer h-8 w-8 bg-white/5"
            title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Interactive Notification Bell */}
          <button
            onClick={() => setShowNotifDrawer(prev => !prev)}
            className="relative flex items-center justify-center p-2 rounded-xl border border-violet-500/30 hover:bg-violet-800/50 text-violet-200 hover:text-white transition-all cursor-pointer h-8 w-8 bg-violet-950/40"
            title="Ver centro de notificaciones"
          >
            <Bell size={14} className={db.notifications?.length > 0 ? "animate-pulse text-amber-400" : ""} />
            {(db.notifications || []).length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow-md">
                {(db.notifications || []).length}
              </span>
            )}
          </button>

          {currentUser && currentUser.role !== "marketplace" && (
            <label className="relative w-8 h-8 rounded-full border border-violet-600/50 cursor-pointer overflow-hidden flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all shadow-inner group" title="Toca tu foto para actualizar tu imagen de perfil">
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
                <div className="w-full h-full bg-violet-600 text-violet-900 font-black text-[10px] flex items-center justify-center">
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

        {/* Notification Modal Drawer */}
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
}
