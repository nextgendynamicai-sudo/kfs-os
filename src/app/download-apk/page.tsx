"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, Chrome, ShieldCheck, ArrowRight, Share2, HelpCircle } from "lucide-react";
import { KreatekLogo } from "../../components/KreatekLogo";
import { isSupabaseConfigured, supabase } from "../../context/supabase";
import { KFS_BRAND } from "../../config/brandConfig";

export default function DownloadApkPage() {
  const [apkUrl, setApkUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = supabase.storage.from("kfs-assets").getPublicUrl("kfs-os.apk");
        if (data?.publicUrl) {
          setApkUrl(data.publicUrl);
        }
      } catch (err) {
        console.error("Failed to generate public APK url:", err);
      }
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "KFS-OS APK",
          text: "Descarga la aplicación oficial de KFS-OS en tu dispositivo móvil",
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
              Portal Oficial de Descarga e Instalación
            </p>
          </div>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: PWA Native Installation */}
          <div className="bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-900/50 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Chrome size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Instalar como PWA (Recomendado)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instalación directa en 1 segundo. Actualizaciones en tiempo real sin descargas manuales y soporte offline.
              </p>
            </div>
            
            <div className="pt-2">
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2 text-[10px] text-slate-300 font-mono">
                <p className="text-violet-300 font-bold uppercase tracking-wider">Instrucciones rápidas:</p>
                <p>🟢 **Android**: Abre en Chrome ➔ toca los 3 puntos ➔ "Instalar aplicación".</p>
                <p>🔵 **iOS (iPhone)**: Abre en Safari ➔ toca Compartir ➔ "Añadir a pantalla de inicio".</p>
              </div>
            </div>
          </div>

          {/* Option B: Direct APK Download */}
          <div className="bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-900/50 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Descargar APK Directo</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Descarga el instalador nativo directamente en tu dispositivo Android. Ideal para entornos empresariales o terminales fijos.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={apkUrl || "#"}
                onClick={(e) => {
                  if (!apkUrl) {
                    e.preventDefault();
                    alert("Aún no has subido tu archivo 'kfs-os.apk' a Supabase Storage (bucket: kfs-assets).");
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2 cursor-pointer border-none text-center"
              >
                <Download size={14} /> Descargar APK
              </a>
              <p className="text-[9px] text-center text-slate-400">
                {apkUrl ? "Versión oficial compilada" : "El archivo debe ser subido a Supabase"}
              </p>
            </div>
          </div>
        </div>

        {/* Share and Security Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-black/40 border border-white/5 p-4 rounded-2xl gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <ShieldCheck size={16} /> Aplicación Segura y Libre de Virus
          </div>
          <button
            onClick={handleShare}
            className="text-xs font-black text-violet-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5"
          >
            <Share2 size={14} /> {copied ? "¡Enlace Copiado!" : "Compartir esta Página"}
          </button>
        </div>

      </div>

      <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors mt-6 font-bold flex items-center gap-1.5">
        Volver a la Plataforma Principal <ArrowRight size={12} />
      </a>
    </div>
  );
}
