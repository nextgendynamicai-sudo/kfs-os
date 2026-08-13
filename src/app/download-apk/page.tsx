"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, Compass, ShieldCheck, ArrowRight, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../context/supabase";
import { KFS_BRAND } from "../../config/brandConfig";

export default function DownloadApkPage() {
  const [apkUrl, setApkUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
      setIsInstalled(isStandalone);

      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  useEffect(() => {
    let url = "/kfs-os.apk";
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = supabase.storage.from("kfs-assets").getPublicUrl("kfs-os.apk");
        if (data?.publicUrl) {
          url = data.publicUrl;
        }
      } catch (err) {
        console.error("Failed to generate public APK url:", err);
      }
    }
    setApkUrl(url);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIos) {
        alert("En iPhone/iPad: Presiona el botón 'Compartir' de Safari y selecciona 'Añadir a pantalla de inicio'.");
      } else {
        alert("Presiona el menú de 3 puntos de tu navegador y selecciona 'Instalar aplicación' o 'Añadir a pantalla de inicio'.");
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${KFS_BRAND.productAcronym} OS App`,
          text: "Descarga e instala la aplicación oficial de KFS-OS en tu dispositivo móvil",
          url: window.location.href
        });
      } catch (e) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApkDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Link directly opens or downloads /kfs-os.apk smoothly
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-violet-950/40 border border-violet-500/20 p-2 shadow-xl">
            <img src="/kfs-logo.png" className="w-full h-full object-contain" alt="KFS Logo" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-violet-200 via-white to-indigo-200 bg-clip-text text-transparent">
              {KFS_BRAND.productAcronym} OS MÓVIL
            </h1>
            <p className="text-xs text-violet-300 font-mono tracking-widest uppercase mt-1">
              Portal Oficial de Instalación y Descarga
            </p>
          </div>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: PWA Native Installation (Primary Action) */}
          <div className="bg-gradient-to-b from-violet-900/30 to-indigo-950/40 border border-violet-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-400/30 flex items-center justify-center text-violet-300">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Instalar App Nativa
                <span className="text-[10px] bg-violet-500/30 text-violet-200 px-2 py-0.5 rounded-full font-mono">1 Tap</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instalación instantánea en tu teléfono. Sin ocupar espacio de memoria, con soporte offline y actualizaciones automáticas en tiempo real.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleInstallPwa}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-violet-600/40 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {isInstalled ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Smartphone size={16} />}
                {isInstalled ? "Aplicación Ya Instalada" : "Instalar en Mi Teléfono"}
              </button>
              <p className="text-[9px] text-center text-violet-300/80 font-mono">
                Recomendado para Android e iOS (iPhone)
              </p>
            </div>
          </div>

          {/* Option B: Direct APK Download */}
          <div className="bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Descargar Archivo APK</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instalador nativo en formato `.apk` para dispositivos Android o cajas registradoras POS empresariales.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={apkUrl || "#"}
                onClick={handleApkDownloadClick}
                download="kfs-os.apk"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-center no-underline"
              >
                <Download size={14} /> Descargar .APK (Android)
              </a>
              <p className="text-[9px] text-center text-slate-400">
                Requiere haber subido kfs-os.apk a Supabase
              </p>
            </div>
          </div>
        </div>

        {/* Share and Security Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-black/40 border border-white/5 p-4 rounded-2xl gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <ShieldCheck size={16} /> Aplicación Oficial Segura
          </div>
          <button
            onClick={handleShare}
            className="text-xs font-black text-violet-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5"
          >
            <Share2 size={14} /> {copied ? "¡Enlace Copiado!" : "Compartir Enlace de Instalación"}
          </button>
        </div>

      </div>

      <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors mt-6 font-bold flex items-center gap-1.5">
        Volver a la Plataforma Principal <ArrowRight size={12} />
      </a>
    </div>
  );
}
