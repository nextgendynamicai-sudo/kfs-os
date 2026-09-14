"use client";

import React, { useRef } from "react";
import { X, QrCode, Send, Download, Sparkles, CheckCircle2, ShieldCheck, Share2 } from "lucide-react";

interface MerchantWelcomeFlyerModalProps {
  companyName: string;
  slug: string;
  themeColor?: string;
  ownerPhone?: string;
  onClose: () => void;
  showToast?: (msg: string, type: string) => void;
}

export const MerchantWelcomeFlyerModal: React.FC<MerchantWelcomeFlyerModalProps> = ({
  companyName,
  slug,
  themeColor = "#F59E0B",
  ownerPhone = "",
  onClose,
  showToast
}) => {
  const flyerRef = useRef<HTMLDivElement>(null);
  const storeUrl = `https://axisnitro.store/nitro/${slug}`;

  const handleShareWhatsApp = () => {
    const text = `🎉 ¡Gran Noticia! Ahora puedes comprar y pagar en *${companyName}* con Axis Nitro OS & KFS.\n\n` +
      `🛍️ *Nuestra Tienda Virtual Oficial:*\n${storeUrl}\n\n` +
      `💳 Aceptamos Pago Móvil en Bolívares (Tasa Oficial BCV) y Efectivo USD sin comisiones extra.\n\n` +
      `¡Te esperamos!`;

    const cleanPhone = (ownerPhone || "").replace(/[^0-9]/g, "");
    const waUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleSimulateDownload = () => {
    if (showToast) {
      showToast("📸 Flyer generado en alta resolución listo para tus Estados de WhatsApp.", "success");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-violet-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Flyer Digital de Bienvenida
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 overflow-y-auto flex-1 flex justify-center">
          {/* Vertical 9:16 Social Flyer Card */}
          <div 
            ref={flyerRef}
            className="w-full max-w-[280px] aspect-[9/16] rounded-2xl p-5 flex flex-col justify-between text-center relative overflow-hidden shadow-2xl border border-white/20"
            style={{
              background: `linear-gradient(145deg, #09090b 0%, #17152b 50%, #050508 100%)`
            }}
          >
            {/* Top Accent Color Bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: themeColor }}
            />

            {/* Glowing orb */}
            <div 
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: themeColor }}
            />

            {/* Top Header */}
            <div className="space-y-1.5 relative z-10 pt-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-950 bg-white/95 px-2.5 py-0.5 rounded-full shadow-sm inline-block">
                Comercio Oficial Verificado
              </span>
              <p className="text-[9px] font-mono tracking-wider text-amber-300 font-bold uppercase">
                AXIS NITRO OS ECOSISTEMA
              </p>
            </div>

            {/* Business Logo / Name */}
            <div className="space-y-1 relative z-10 my-auto">
              <div 
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg border border-white/20"
                style={{ backgroundColor: themeColor }}
              >
                {companyName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-black text-white leading-tight">
                {companyName}
              </h2>
              <p className="text-[10px] text-slate-300 font-medium">
                ¡Ya estamos activos para recibir tus pagos en línea y en mostrador!
              </p>
            </div>

            {/* Center QR Code */}
            <div className="relative z-10 my-auto space-y-1.5">
              <div className="bg-white p-2.5 rounded-2xl w-32 h-32 mx-auto shadow-2xl flex items-center justify-center border-2 border-white/80">
                <QrCode size={110} className="text-slate-950" />
              </div>
              <p className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                Escanea para ver menú y pagar
              </p>
            </div>

            {/* Bottom Footer */}
            <div className="space-y-1 relative z-10 border-t border-white/10 pt-2 text-[9px] text-slate-300 font-medium">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 size={11} />
                <span>Pago Móvil BCV • Efectivo USD</span>
              </div>
              <p className="text-[8px] font-mono text-slate-400 truncate">
                {storeUrl.replace('https://', '')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            <Send size={15} />
            <span>Compartir en WhatsApp del Cliente</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateDownload}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Download size={14} />
            <span>Descargar Imagen para Estados</span>
          </button>
        </div>

      </div>
    </div>
  );
};
