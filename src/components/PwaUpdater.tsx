"use client";

import React, { useState, useEffect } from "react";
import { DownloadCloud, X } from "lucide-react";

export function PwaUpdater() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleChunkError = (event: ErrorEvent) => {
        const msg = event.message || "";
        if (
          msg.includes("Loading chunk") ||
          msg.includes("Unexpected token") ||
          msg.includes("Failed to fetch dynamically imported module")
        ) {
          console.warn("[PWA] Chunk de código obsoleto detectado. Actualizando caché...");
          if ("caches" in window) {
            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });
          }
          window.location.reload();
        }
      };
      window.addEventListener("error", handleChunkError);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").then((registration) => {
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdate(true);
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setShowUpdate(true);
                }
              });
            }
          });
        }).catch((err) => console.error("SW Registration Failed:", err));

        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      }

      return () => {
        window.removeEventListener("error", handleChunkError);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage("SKIP_WAITING");
      setShowUpdate(false); // Hide immediately while reloading
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] animate-bounce-short">
      <div className="bg-[#0f041a]/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(139,92,246,0.3)] flex items-center gap-4">
        <div className="bg-violet-900/50 p-2 rounded-full border border-violet-500/50">
          <DownloadCloud className="text-violet-400" size={24} />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">Nueva Versión Disponible</h4>
          <p className="text-violet-200 text-xs mt-0.5">La plataforma KFS-OS se ha actualizado.</p>
        </div>
        <button
          onClick={handleUpdate}
          className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-violet-500/50"
        >
          Actualizar
        </button>
        <button 
          onClick={() => setShowUpdate(false)}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
