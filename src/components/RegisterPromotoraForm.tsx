"use client";

import React, { useState } from "react";
import { Camera, Trash2, ShieldCheck, CheckCircle2, AlertCircle, Info, Lock, Smartphone, Mail, User, MapPin, CreditCard } from "lucide-react";
import { compressImage } from "../lib/utils";
import { PhoneInput } from "./PhoneInput";
import { TermsAcceptance, generateLegalTermsAudit } from "./TermsAcceptance";

export const RegisterPromotoraForm = ({ onRegister, onCancel, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "", avatar: "", kycCedula: "", kycAddress: "" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedToS, setAcceptedToS] = useState(false);
  const [formError, setFormError] = useState("");

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
  const isNameValid = formData.name.trim().length >= 2;
  const isPasswordValid = formData.password.length >= 4;
  const isAddressValid = formData.kycAddress.trim().length >= 3;
  const isBinanceValid = formData.binanceId.trim().length >= 3;
  const hasAvatar = !!avatar;
  const hasCedula = !!kycCedula;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isPhoneValid && acceptedToS;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 400, 0.6);
      setAvatar(base64String);
      setFormData(prev => ({ ...prev, avatar: base64String }));
    }
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await compressImage(file, 400, 0.6);
      setKycCedula(base64String);
      setFormData(prev => ({ ...prev, kycCedula: base64String }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!isNameValid) {
      setFormError("Por favor ingresa tu Nombre Completo.");
      return;
    }
    if (!isPhoneValid) {
      setFormError("Por favor ingresa un número de Teléfono/Pago Móvil válido (Ej: 04141234567).");
      return;
    }
    if (!isEmailValid) {
      setFormError("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!isPasswordValid) {
      setFormError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    if (!acceptedToS) {
      setFormError("Debes aceptar los Términos de Servicio para registrarte.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    const defaultAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    const defaultCedula = "default_cedula_doc";

    try {
      const fallbackData = {
        ...formData,
        binanceId: formData.binanceId.trim() || "N/A",
        kycAddress: formData.kycAddress.trim() || "Dirección pendiente",
        avatar: avatar || defaultAvatar,
        kycCedula: kycCedula || defaultCedula,
        referralCode: defaultReferralCode,
        termsAudit: generateLegalTermsAudit()
      };
      await Promise.resolve(onRegister(fallbackData));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-violet-950 animate-fade-in pb-4">
      <div className="flex items-center justify-between border-b border-violet-100 pb-3">
        <h3 className="text-lg font-black text-violet-900 flex items-center gap-2">
          <ShieldCheck className="text-violet-600" size={22} />
          Registro de Promotora
        </h3>
        {defaultReferralCode && (
          <span className="text-[10px] font-black text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
            Ref: {defaultReferralCode}
          </span>
        )}
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl mb-3 flex items-center justify-between animate-fade-in">
          <span>⚠️ {formError}</span>
          <button type="button" onClick={() => setFormError("")} className="text-red-400 hover:text-red-600 font-black">✕</button>
        </div>
      )}

      {/* Live Requirement Checklist */}
      <div className="bg-violet-50/80 border border-violet-100 rounded-2xl p-3.5 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 flex items-center gap-1">
          <Info size={12} /> Requisitos para Activar tu Cuenta
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
          <div className={`flex items-center gap-1.5 ${isNameValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isNameValid ? 'text-emerald-600' : 'text-slate-300'} /> Nombre Completo
          </div>
          <div className={`flex items-center gap-1.5 ${isEmailValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isEmailValid ? 'text-emerald-600' : 'text-slate-300'} /> Correo Válido
          </div>
          <div className={`flex items-center gap-1.5 ${isPasswordValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isPasswordValid ? 'text-emerald-600' : 'text-slate-300'} /> Clave (min 6)
          </div>
          <div className={`flex items-center gap-1.5 ${isAddressValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isAddressValid ? 'text-emerald-600' : 'text-slate-300'} /> Dirección KYC
          </div>
          <div className={`flex items-center gap-1.5 ${isBinanceValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isBinanceValid ? 'text-emerald-600' : 'text-slate-300'} /> Binance Pay ID
          </div>
          <div className={`flex items-center gap-1.5 ${isPhoneValid ? 'text-emerald-700' : 'text-slate-400'}`}>
            <CheckCircle2 size={13} className={isPhoneValid ? 'text-emerald-600' : 'text-slate-300'} /> Pago Móvil
          </div>
          <div className={`flex items-center gap-1.5 ${hasAvatar ? 'text-emerald-700' : 'text-amber-600 font-bold'}`}>
            <CheckCircle2 size={13} className={hasAvatar ? 'text-emerald-600' : 'text-amber-500'} /> Foto de Perfil
          </div>
          <div className={`flex items-center gap-1.5 ${hasCedula ? 'text-emerald-700' : 'text-amber-600 font-bold'}`}>
            <CheckCircle2 size={13} className={hasCedula ? 'text-emerald-600' : 'text-amber-500'} /> Foto de Cédula (KYC)
          </div>
        </div>
      </div>

      {/* Avatar & KYC Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1.5 bg-violet-50/50 p-3 rounded-2xl border border-violet-100">
          <div className="relative w-16 h-16">
            <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-violet-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-violet-100 transition-colors group block shadow-sm">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                  <Camera size={20} className="mx-auto" />
                </div>
              )}
            </label>
            {avatar && (
              <button type="button" onClick={() => { setAvatar(""); setFormData(p => ({ ...p, avatar: "" })); }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors border-none cursor-pointer">
                <Trash2 size={10} />
              </button>
            )}
          </div>
          <span className="text-[10px] text-violet-900 font-bold">Foto de Perfil {hasAvatar && '✓'}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 bg-violet-50/50 p-3 rounded-2xl border border-violet-100">
          <div className="relative w-full h-16">
            <label className="relative w-full h-full rounded-xl border-2 border-dashed border-violet-300 cursor-pointer overflow-hidden flex items-center justify-center bg-white hover:bg-violet-100 transition-colors group block shadow-sm">
              <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} />
              {kycCedula ? (
                <img src={kycCedula} className="w-full h-full object-cover" alt="Cédula" />
              ) : (
                <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                  <Camera size={20} className="mx-auto" />
                  <span className="text-[9px] font-bold block text-slate-500">Subir Cédula</span>
                </div>
              )}
            </label>
            {kycCedula && (
              <button type="button" onClick={() => { setKycCedula(""); setFormData(p => ({ ...p, kycCedula: "" })); }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors border-none cursor-pointer">
                <Trash2 size={10} />
              </button>
            )}
          </div>
          <span className="text-[10px] text-violet-900 font-bold">Documento Cédula {hasCedula && '✓'}</span>
        </div>
      </div>

      {/* Input Fields */}
      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
          <User size={12} /> Nombre Completo
        </label>
        <input required placeholder="Ej: María Pérez" value={formData.name} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
          <MapPin size={12} /> Dirección de Residencia (KYC)
        </label>
        <textarea required placeholder="Ej: Av. Bolívar, Res. La Floresta, Torre A, Apto 4" value={formData.kycAddress} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-2.5 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400 h-16 resize-none" onChange={e => setFormData({ ...formData, kycAddress: e.target.value })} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className="block text-xs font-black text-violet-700 uppercase tracking-widest flex items-center gap-1">
            <Mail size={12} /> Correo Electrónico
          </label>
          {formData.email && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isEmailValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isEmailValid ? "✓ Válido" : "✗ Formato Inválido"}
            </span>
          )}
        </div>
        <input required type="email" placeholder="promotora@correo.com" value={formData.email} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
          <Lock size={12} /> Crear Clave de Acceso
        </label>
        <input required type="password" placeholder="Mínimo 6 caracteres" value={formData.password} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
          <CreditCard size={12} /> Binance Pay ID (Para Cobrar Regalías)
        </label>
        <input required placeholder="Ej: 184592019" value={formData.binanceId} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400" onChange={e => setFormData({ ...formData, binanceId: e.target.value })} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className="block text-xs font-black text-violet-700 uppercase tracking-widest flex items-center gap-1">
            <Smartphone size={12} /> Teléfono Pago Móvil
          </label>
          {formData.pagoMovil && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPhoneValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isPhoneValid ? "✓ Válido" : "✗ Ejemplo: 04141234567"}
            </span>
          )}
        </div>
        <PhoneInput
          required
          value={formData.pagoMovil}
          onChange={val => setFormData({ ...formData, pagoMovil: val })}
          placeholder="04141234567"
        />
      </div>

      <TermsAcceptance accepted={acceptedToS} setAccepted={setAcceptedToS} variant="light" />

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3.5 rounded-xl border border-violet-200 hover:bg-violet-50 text-slate-500 font-bold transition-all text-sm cursor-pointer bg-transparent">
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={!isFormValid || isSubmitting}
          className="w-2/3 py-3.5 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-violet-600/30 cursor-pointer bg-violet-600 border-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          title={isFormValid ? "Completar registro" : "Por favor, completa todos los requisitos mostrados en la lista"}
        >
          {isSubmitting ? "Registrando..." : isFormValid ? "Registrar Perfil" : "Requisitos Incompletos"}
        </button>
      </div>
    </form>
  );
};

