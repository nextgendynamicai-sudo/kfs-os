"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Phone, MessageCircle, MapPin, Store, QrCode, Copy, Check, 
  CreditCard, Share2, Sparkles, UserPlus, ExternalLink, ArrowRight, ShieldCheck, Heart
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useKFS } from "../../../context/KFSContext";
import { initialDB } from "../../../config/initialDB";

export default function DigitalBusinessCardPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "oficial";
  const { db, showToast } = useKFS() as any;

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Resolver comercio
  const client = (db?.clients || initialDB.clients || []).find((c: any) => {
    const s = c.slug || (c.id === "kfs-express" ? "kfs-express" : (c.company || c.name || c.id).toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    return s === slug || c.id === slug;
  }) || initialDB.clients[0];

  const storeSettings = client.storeSettings || {};
  const themeColor = storeSettings.themeColor || "#C5A184";
  const companyName = client.company || client.name || "Axis Nitro Store";
  const ownerName = client.name || companyName;
  const phone = client.phone || "+58 412 0000000";
  const bio = storeSettings.bioText || "Negocio verificado en la red comercial Axis Nitro & KFS OS.";
  const logoUrl = storeSettings.profilePicUrl || client.avatar || "https://cdn-icons-png.flaticon.com/512/3063/3063822.png";
  const coverUrl = storeSettings.coverPhotoUrl || "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60";
  const storeUrl = `https://axisnitro.store/nitro/${slug}`;
  const cardUrl = typeof window !== "undefined" ? window.location.href : `https://axisnitro.store/card/${slug}`;

  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  const handleCopy = (text: string, fieldKey: string, successMsg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast(successMsg, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${ownerName};;;;
FN:${companyName}
ORG:${companyName}
TITLE:Comercio Oficial
TEL;TYPE=CELL:${cleanPhone}
EMAIL:${client.email || "contacto@axisnitro.store"}
URL:${storeUrl}
NOTE:${bio}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${companyName.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📇 Contacto guardado para tu agenda", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Tarjeta Glassmorphic Central */}
      <div className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-xl relative flex flex-col justify-between my-4 animate-fade-in">
        
        {/* Banner Superior con Efecto Glowing */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-800">
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Badge NFC Inteligente */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">NFC Activo</span>
          </div>
        </div>

        {/* Avatar y Datos del Comercio */}
        <div className="px-6 -mt-16 text-center space-y-3 relative z-10">
          <div className="relative inline-block">
            <div 
              className="w-28 h-28 rounded-3xl p-1.5 bg-slate-950 border-2 shadow-2xl mx-auto overflow-hidden flex items-center justify-center"
              style={{ borderColor: themeColor }}
            >
              <img src={logoUrl} alt={companyName} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-xl border-2 border-slate-900 shadow-md">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{companyName}</h1>
            <p className="text-xs text-amber-400 font-bold mt-0.5">{ownerName}</p>
            <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed line-clamp-3">
              {bio}
            </p>
          </div>
        </div>

        {/* Acciones Rápidas Principales */}
        <div className="px-6 py-5 space-y-3">
          {/* Botón 1: WhatsApp Directo */}
          <a
            href={`https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(`Hola ${companyName}, vi tu tarjeta digital de contacto.`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 no-underline active:scale-95 cursor-pointer"
          >
            <MessageCircle size={18} /> Escribir por WhatsApp
          </a>

          {/* Botón 2: Ver Tienda Virtual Nitro */}
          <a
            href={storeUrl}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 no-underline active:scale-95 cursor-pointer"
          >
            <Store size={18} /> Ver Catálogo & Tienda Online <ArrowRight size={14} />
          </a>

          {/* Botones Secundarios Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Guardar en Contactos */}
            <button
              onClick={downloadVCard}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={16} className="text-violet-400" /> Guardar Contacto
            </button>

            {/* Ver Código QR */}
            <button
              onClick={() => setShowQrModal(true)}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode size={16} className="text-amber-400" /> Código QR
            </button>
          </div>
        </div>

        {/* Caja de Datos de Pago Móvil Rápidos */}
        <div className="px-6 pb-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard size={14} className="text-violet-400" /> Datos de Pago Móvil
              </span>
              <button
                onClick={() => handleCopy(`${client.company || client.name}\nBanco: Banesco (0134)\nTel: ${phone}\nCI/RIF: ${client.idCard || "V-00000000"}`, "all_pm", "Datos copiados para pagar")}
                className="text-[10px] text-violet-400 hover:text-violet-300 font-bold border-none bg-transparent cursor-pointer flex items-center gap-1"
              >
                {copiedField === "all_pm" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedField === "all_pm" ? "¡Copiados!" : "Copiar Todo"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">Teléfono</span>
                <span className="font-bold text-white text-[11px]">{phone}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">C.I. / RIF</span>
                <span className="font-bold text-white text-[11px]">{client.idCard || "V-00000000"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 bg-black/40 py-3 px-6 text-center">
          <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
            Tecnología <strong className="text-amber-400">Axis Nitro</strong> • Red KFS OS
          </span>
        </div>
      </div>

      {/* Modal QR de la Tarjeta */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-violet-500/40 rounded-3xl p-6 text-center space-y-4 max-w-xs w-full shadow-2xl">
            <h4 className="text-sm font-black text-white">Escanea esta Tarjeta Digital</h4>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
              <QRCodeSVG value={cardUrl} size={180} />
            </div>
            <p className="text-[10px] text-slate-400 font-mono break-all">
              {cardUrl}
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
