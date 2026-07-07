"use client";

import React, { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { compressImage } from "../lib/utils";

export const RegisterPromotoraForm = ({ onRegister, onCancel, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "", avatar: "", kycCedula: "", kycAddress: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");

  const validatePhone = (phone: string) => {
    if (!phone) return false;
    const clean = phone.replace(/[^0-9]/g, "");
    let rawBody = clean;
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    return /^(412|414|424|416|426|415|425)\d{7}$/.test(rawBody) || (rawBody.length >= 7 && rawBody.length <= 12);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = validatePhone(formData.pagoMovil);
  const isEmailValid = validateEmail(formData.email);
  const isNameValid = formData.name.trim().length >= 3;
  const isAddressValid = formData.kycAddress.trim().length >= 5;
  const isPasswordValid = formData.password.length >= 6;
  const isBinanceValid = formData.binanceId.trim().length >= 5;
  const isFormValid = isNameValid && isAddressValid && isEmailValid && isPasswordValid && isBinanceValid && isPhoneValid && !!avatar && !!kycCedula;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setAvatar(base64String);
      setFormData(prev => ({ ...prev, avatar: base64String }));
    }
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 200, 0.6);
      setKycCedula(base64String);
      setFormData(prev => ({ ...prev, kycCedula: base64String }));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isFormValid) onRegister({ ...formData, referralCode: defaultReferralCode }); }} className="space-y-3 text-violet-950 animate-fade-in pb-4">
      <h3 className="text-lg font-black mb-4 border-b border-violet-100 pb-2 text-violet-700">Autogestión de Promotora</h3>

      <div className="flex flex-col items-center gap-2 mb-4 relative">
        <div className="relative w-20 h-20">
          <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-50 hover:bg-violet-100 transition-colors group block">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                <Camera size={24} className="mx-auto" />
                <span className="text-[8px] font-bold block mt-1 text-slate-500">Foto</span>
              </div>
            )}
          </label>
          {avatar && (
            <button type="button" onClick={() => { setAvatar(""); setFormData(p => ({ ...p, avatar: "" })); }} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10">
              <Trash2 size={10} />
            </button>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Foto de Perfil</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4 relative">
        <div className="relative w-full h-20">
          <label className="relative w-full h-full rounded-xl border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-50 hover:bg-violet-100 transition-colors group block">
            <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} />
            {kycCedula ? (
              <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
            ) : (
              <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                <Camera size={24} className="mx-auto" />
                <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Foto de Cédula (Obligatorio)</span>
              </div>
            )}
          </label>
          {kycCedula && (
            <>
              <span className="absolute top-1.5 left-1.5 text-[8px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-md">✓ Cédula Lista</span>
              <button type="button" onClick={() => { setKycCedula(""); setFormData(p => ({ ...p, kycCedula: "" })); }} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-650 transition-colors">
                <Trash2 size={10} />
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
        <input required placeholder="Nombre Completo" value={formData.name} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Dirección Completa (KYC)</label>
        <textarea required placeholder="Dirección Completa (KYC)" value={formData.kycAddress} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400 h-20 resize-none" onChange={e => setFormData({ ...formData, kycAddress: e.target.value })} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className="block text-xs font-black text-violet-700 uppercase tracking-widest">Correo Electrónico</label>
          {formData.email && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isEmailValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isEmailValid ? "✓ Correo Válido" : "✗ Email Inválido"}
            </span>
          )}
        </div>
        <input required type="email" placeholder="Correo Electrónico" value={formData.email} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Crear Clave de Acceso</label>
        <input required type="password" placeholder="Crear Clave de Acceso" value={formData.password} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Binance ID (Ej: 184592...)</label>
        <input required placeholder="Binance ID (Ej: 184592...)" value={formData.binanceId} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, binanceId: e.target.value })} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className="block text-xs font-black text-violet-700 uppercase tracking-widest">Pago Móvil (Ej: 0412...)</label>
          {formData.pagoMovil && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPhoneValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isPhoneValid ? "✓ Teléfono Válido" : "✗ Formato Inválido"}
            </span>
          )}
        </div>
        <input required placeholder="Pago Móvil (Ej: 0412...)" value={formData.pagoMovil} className="w-full bg-violet-50/50 border border-violet-100 rounded-lg px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, pagoMovil: e.target.value })} />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-violet-200 hover:bg-violet-50 text-slate-500 font-bold transition-all text-sm cursor-pointer bg-transparent">Cancelar</button>
        <button 
          type="submit" 
          disabled={!isFormValid}
          className="w-2/3 py-3 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-violet-600/30 cursor-pointer bg-violet-600 border-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          title={isFormValid ? "Registrar promotora" : "Por favor, completa todos los campos requeridos y sube tus documentos KYC"}
        >
          {isFormValid ? "Registrar Perfil" : "Faltan Campos / KYC"}
        </button>
      </div>
    </form>
  );
}
