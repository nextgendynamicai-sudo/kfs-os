"use client";

import React, { useState } from "react";
import { KFS_BRAND } from "../config/brandConfig";
import { Camera, Palette, Truck, Globe, Copy, Check, ExternalLink, QrCode, Store, CreditCard } from "lucide-react";
import { compressImage, resolveThemeColor } from "../lib/utils";
import { QRCodeSVG } from "qrcode.react";

export const StorefrontCustomizer = ({ client, updateStoreSettings }: { client: any, updateStoreSettings: any }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const storeSlug = client?.slug || (client?.id === "kfs-express" ? "kfs-express" : (client?.company || client?.name || client?.id || "tienda").toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const storefrontUrl = `https://axisnitro.store/nitro/${storeSlug}`;

  const [settings, setSettings] = useState(client?.storeSettings || {
    profilePicUrl: "",
    coverPhotoUrl: "",
    bioText: "",
    themeColor: "#C5A184",
    typography: "font-sans",
    layoutType: "grid",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryReference: "",
    subdomain: client?.subdomain || storeSlug,
    customDomain: client?.customDomain || ""
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateStoreSettings(client.id, settings);
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file, 200, 0.5);
        setSettings((prev: any) => ({ ...prev, profilePicUrl: base64 }));
      } catch (err) {
        alert("Error al comprimir/subir imagen");
      }
    }
  };

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file, 600, 0.5);
        setSettings((prev: any) => ({ ...prev, coverPhotoUrl: base64 }));
      } catch (err) {
        alert("Error al comprimir/subir imagen");
      }
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-black text-violet-900 text-lg flex items-center gap-2">
            <Palette className="text-violet-600" /> Personalizar Tienda & Dominio Multi-Tenant
          </h4>
          <p className="text-xs text-gray-500">
            Ajusta la apariencia visual, tu enlace exclusivo y la configuración de marca de tu vitrina virtual.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-xl border border-violet-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? "¡Enlace Copiado!" : "Copiar Enlace"}
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl border border-violet-200 transition-colors cursor-pointer"
            title="Ver código QR"
          >
            <QrCode size={16} />
          </button>

          <a
            href={`/card/${storeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 no-underline"
          >
            <CreditCard size={14} /> Tarjeta Digital NFC
          </a>

          <a
            href={storefrontUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 no-underline"
          >
            <ExternalLink size={14} /> Ver Tienda en Vivo
          </a>
        </div>
      </div>

      {/* Banner de Enlace Público y Subdominio */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black">
            <Store size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-950">Tu Enlace de Tienda en la Red</p>
            <p className="text-xs font-mono text-violet-700 font-bold">{storefrontUrl}</p>
          </div>
        </div>

        {showQr && (
          <div className="bg-white p-3 rounded-xl border border-violet-200 shadow-md animate-fade-in flex flex-col items-center gap-2">
            <QRCodeSVG value={storefrontUrl} size={120} />
            <span className="text-[10px] text-gray-500 font-mono">Escanea para comprar</span>
          </div>
        )}
      </div>

      {/* Formulario de Configuración Visual */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block">Logo / Foto de Perfil</label>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl relative">
              <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                {settings.profilePicUrl && (settings.profilePicUrl.startsWith("http") || settings.profilePicUrl.startsWith("data:")) ? (
                  <img src={settings.profilePicUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <Camera size={20} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </label>
              <div className="flex-grow">
                <p className="text-xs font-bold text-violet-900">Subir desde Galería</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Se guardará directamente en tu base de datos {KFS_BRAND.productAcronym}.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block">Banner de Portada</label>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl relative">
              <label className="relative w-24 h-16 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoUpload} />
                {settings.coverPhotoUrl && (settings.coverPhotoUrl.startsWith("http") || settings.coverPhotoUrl.startsWith("data:")) ? (
                  <img src={settings.coverPhotoUrl} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <Camera size={20} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </label>
              <div className="flex-grow">
                <p className="text-xs font-bold text-violet-900">Subir desde Galería</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Banner panorámico para tu tienda virtual.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block">Biografía o Eslogan (Max 150 char)</label>
          <textarea 
            maxLength={150} 
            value={settings.bioText} 
            onChange={e => setSettings({ ...settings, bioText: e.target.value })} 
            placeholder="Los mejores productos..." 
            className="w-full h-16 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none placeholder:text-gray-400" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-2">Color Principal</label>
            <div className="flex flex-wrap items-center gap-2">
              <input 
                type="color" 
                value={settings.themeColor || "#C5A184"} 
                onChange={e => setSettings({ ...settings, themeColor: e.target.value })} 
                className="h-10 w-10 rounded-full cursor-pointer border-none shadow-sm p-0 overflow-hidden" 
                title="Elegir color personalizado" 
              />
              <div className="flex gap-1 border-l pl-2 border-gray-200">
                {["#C5A184", "#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#7C3AED"].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSettings({ ...settings, themeColor: c })} 
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${settings.themeColor === c ? 'border-gray-900 shadow-md scale-110' : 'border-transparent'}`} 
                    style={{ backgroundColor: c }} 
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-1">Tipografía</label>
            <select 
              value={settings.typography || "font-sans"} 
              onChange={e => setSettings({ ...settings, typography: e.target.value })} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none"
            >
              <option value="font-sans">Moderna (Sans)</option>
              <option value="font-serif">Clásica (Serif)</option>
              <option value="font-mono">Técnica (Mono)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-1">Disposición (Layout)</label>
          <select 
            value={settings.layoutType || "grid"} 
            onChange={e => setSettings({ ...settings, layoutType: e.target.value })} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none"
          >
            <option value="grid">Grilla de Tarjetas (Recomendado)</option>
            <option value="list">Lista Compacta</option>
          </select>
        </div>

        {/* ===== DELIVERY ADDRESS SECTION ===== */}
        <div className="border-t border-gray-100 pt-6 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <Truck size={18} />
            </div>
            <div>
              <h5 className="font-black text-violet-900 text-sm">Dirección de Delivery</h5>
              <p className="text-[10px] text-gray-400">Esta dirección se enviará al rider cuando despaches un pedido.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-1">Calle y Número / Local</label>
              <input
                type="text"
                value={settings.deliveryAddress || ""}
                onChange={e => setSettings({ ...settings, deliveryAddress: e.target.value })}
                placeholder="Ej: Av. Principal, Edificio Torre Norte, Local 4"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-1">Ciudad / Municipio</label>
              <input
                type="text"
                value={settings.deliveryCity || ""}
                onChange={e => setSettings({ ...settings, deliveryCity: e.target.value })}
                placeholder="Ej: Caracas, Miranda"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-violet-950 uppercase tracking-widest block mb-1">Referencia (para el rider)</label>
              <input
                type="text"
                value={settings.deliveryReference || ""}
                onChange={e => setSettings({ ...settings, deliveryReference: e.target.value })}
                placeholder="Ej: Frente al banco, puerta azul"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          className="w-full mt-4 bg-violet-900 hover:bg-violet-800 text-white py-3.5 rounded-xl font-black text-sm shadow-lg shadow-violet-900/20 active:scale-95 transition-all cursor-pointer border-none"
        >
          Guardar Diseño y Configuración de Tienda
        </button>
      </div>
    </div>
  );
};
