"use client";
import React, { useState, useEffect } from "react";
import { BellRing, Smartphone, ShieldAlert } from "lucide-react";

export function AppEnforcer({ children, currentUser, updatePwaStatus }: { children: React.ReactNode, currentUser?: any, updatePwaStatus?: (status: boolean) => void }) {
  const [isStandalone, setIsStandalone] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
  // Si está en PWA, dejamos pasar e informamos a la nube que la instaló (si no estaba marcada).
  useEffect(() => {
    if (!isChecking && isStandalone && hasPermissions && currentUser && !currentUser.pwaInstalled && updatePwaStatus) {
      updatePwaStatus(true);
    }
  }, [isChecking, isStandalone, hasPermissions, currentUser, updatePwaStatus]);

  if (isChecking) return null;

  const showPwaWarning = !isStandalone && !currentUser?.pwaInstalled;
  const showNotificationWarning = !hasPermissions;

  if (!showPwaWarning && !showNotificationWarning) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#EEF2F5] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-8 text-center space-y-8 animate-fade-in">
        <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-violet-200">
          <ShieldAlert size={40} className="text-violet-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-violet-900 mb-3">Acceso Restringido</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Por protocolos de seguridad, para operar en la nube web primero debes haber completado los requisitos del sistema en tu dispositivo principal.
          </p>
        </div>

        <div className="space-y-4">
          {showPwaWarning && (
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <Smartphone size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-violet-900">App No Instalada</p>
                  <p className="text-[10px] text-gray-400">Añade KFS a tu pantalla de inicio</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Toca el menú de tu navegador y selecciona 'Añadir a la pantalla de inicio' o 'Instalar aplicación'")}
                className="text-xs bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] text-violet-600 px-4 py-2 rounded-xl font-bold cursor-pointer"
              >
                Guía
              </button>
            </div>
          )}

          {!hasPermissions && (
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <BellRing size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-violet-900">Notificaciones Off</p>
                  <p className="text-[10px] text-gray-400">Requeridas para operar caja</p>
                </div>
              </div>
              <button 
                onClick={requestNotificationPermission}
                className="text-xs bg-violet-600 shadow-[0_5px_15px_rgba(139,92,246,0.2)] text-white px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-violet-700 transition-colors"
              >
                Activar
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] text-gray-400 underline hover:text-violet-600 cursor-pointer border-none bg-transparent"
          >
            Refrescar página una vez completado
          </button>
        </div>
      </div>
    </div>
  );
}
