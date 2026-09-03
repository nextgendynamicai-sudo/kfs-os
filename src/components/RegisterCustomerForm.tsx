"use client";

import React, { useState } from "react";
import { Camera, Lock, UserCheck, Smartphone, FileText, MapPin, Trash2, Tag } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { compressImage } from "../lib/utils";
import { PhoneInput, parsePhoneNumber } from "./PhoneInput";
import { TermsAcceptance, generateLegalTermsAudit } from "./TermsAcceptance";

export const RegisterCustomerForm = ({ onCancel, defaultReferralCode }: { onCancel: () => void, defaultReferralCode?: string }) => {
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+58");
  const [phoneBody, setPhoneBody] = useState("");
  const [password, setPassword] = useState("");
  const [kycPhoto, setKycPhoto] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [kycAddress, setKycAddress] = useState("");
  const [promoCode, setPromoCode] = useState("1000");
  const [acceptedToS, setAcceptedToS] = useState(false);
  const [formError, setFormError] = useState("");
  const { registerCustomer } = useKFS() as any;

  const validatePhone = (phone: string, prefix: string) => {
    if (!phone) return false;
    const clean = phone.replace(/[^0-9]/g, "");
    let rawBody = clean;
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    return /^(412|414|424|416|426|415|425)\d{7}$/.test(rawBody) || (rawBody.length >= 7 && rawBody.length <= 12);
  };

  const isNameValid = name.trim().length >= 3;
  const isPhoneValid = validatePhone(phoneBody, phonePrefix);
  const isPasswordValid = password.length >= 6;
  const isAddressValid = kycAddress.trim().length >= 3;
  const isKycComplete = !!kycPhoto && !!kycCedula;
  const isFormValid = isNameValid && isPhoneValid && isPasswordValid && isAddressValid && isKycComplete && acceptedToS;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file, 400, 0.6);
      setter(base64);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setFormError("");
    if (!isNameValid) {
      setFormError("Por favor ingresa tu Nombre Completo.");
      return;
    }
    if (!isPhoneValid) {
      setFormError("Por favor ingresa un número de teléfono celular válido (Ej: 04141234567).");
      return;
    }
    if (!isPasswordValid) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!acceptedToS) {
      setFormError("Debes aceptar los Términos de Servicio para registrarte.");
      return;
    }

    let rawBody = phoneBody.replace(/[^0-9]/g, '');
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    const fullPhone = phonePrefix + rawBody;

    const defaultSelfie = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
    const defaultCedula = "default_customer_cedula";

    registerCustomer(
      fullPhone,
      password,
      name,
      defaultReferralCode || undefined,
      kycPhoto || defaultSelfie,
      kycCedula || defaultCedula,
      kycAddress.trim() || "Caracas, Venezuela",
      promoCode,
      generateLegalTermsAudit()
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl mb-3 flex items-center justify-between animate-fade-in">
          <span>⚠️ {formError}</span>
          <button type="button" onClick={() => setFormError("")} className="text-red-400 hover:text-red-600 font-black">✕</button>
        </div>
      )}

      {/* Promo Code Input */}
      <div className="relative bg-gradient-to-r from-amber-500/10 to-emerald-500/10 p-3 rounded-2xl border border-amber-300">
        <label className="block text-xs font-black text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1">
          <Tag size={14} className="text-amber-600" /> Código de Promoción / Lanzamiento
        </label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ej: 1000" 
            value={promoCode} 
            onChange={e => setPromoCode(e.target.value)} 
            className="w-full bg-white text-slate-950 font-mono font-black border-2 border-amber-300 rounded-xl px-4 py-2.5 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 uppercase tracking-widest shadow-sm" 
          />
        </div>
        {promoCode.trim() === "1000" && (
          <div className="mt-2 p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-[10px] font-bold animate-fade-in flex items-center gap-1.5">
            <span>🎉 ¡Código 1000 Activo! Al recargar $2.00 USD y ser aprobada tu recarga, se te otorgarán automáticamente +2,000 Axis Points.</span>
          </div>
        )}
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
        <div className="relative">
          <UserCheck className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required type="text" placeholder="Ej: Juan Pérez" value={name} onChange={e => setName(e.target.value)} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl pl-12 pr-4 py-3 text-violet-950 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all" />
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className="block text-xs font-black text-violet-700 uppercase tracking-widest">Teléfono Móvil</label>
          {phoneBody && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPhoneValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isPhoneValid ? "✓ Teléfono Válido" : "✗ Formato Inválido"}
            </span>
          )}
        </div>
        <PhoneInput
          required
          value={`${phonePrefix}${phoneBody}`}
          onChange={(val) => {
            const parsed = parsePhoneNumber(val);
            setPhonePrefix(parsed.prefix);
            setPhoneBody(parsed.body);
          }}
          placeholder="4141234567"
        />
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex-1 relative">
          <label className="relative h-24 rounded-xl border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-50/50 hover:bg-violet-100 transition-colors group block">
            <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycPhoto)} />
            {kycPhoto ? (
              <img src={kycPhoto} className="w-full h-full object-cover" alt="Selfie" />
            ) : (
              <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                <Camera size={20} className="mx-auto" />
                <span className="text-[10px] font-bold block mt-1 text-slate-500">Selfie (Obligatorio)</span>
              </div>
            )}
          </label>
          {kycPhoto && (
            <>
              <span className="absolute top-1.5 left-1.5 text-[8px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-md">✓ Selfie Listo</span>
              <button type="button" onClick={() => setKycPhoto("")} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                <Trash2 size={10} />
              </button>
            </>
          )}
        </div>
        
        <div className="flex-1 relative">
          <label className="relative h-24 rounded-xl border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-50/50 hover:bg-violet-100 transition-colors group block">
            <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, setKycCedula)} />
            {kycCedula ? (
              <img src={kycCedula} className="w-full h-full object-cover" alt="Cédula" />
            ) : (
              <div className="text-center text-violet-400 group-hover:text-violet-600 transition-colors">
                <FileText size={20} className="mx-auto" />
                <span className="text-[10px] font-bold block mt-1 text-slate-500">Cédula (Obligatorio)</span>
              </div>
            )}
          </label>
          {kycCedula && (
            <>
              <span className="absolute top-1.5 left-1.5 text-[8px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-md">✓ Cédula Lista</span>
              <button type="button" onClick={() => setKycCedula("")} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                <Trash2 size={10} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Dirección Exacta</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-violet-400" size={20} />
          <textarea required placeholder="Calle, Av, Edificio, Casa..." value={kycAddress} onChange={e => setKycAddress(e.target.value)} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl pl-12 pr-4 py-3 text-violet-950 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 transition-all text-sm h-20 resize-none" />
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-black text-violet-700 uppercase tracking-widest mb-1 ml-1">Contraseña de Acceso</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-violet-50/50 border border-violet-100 rounded-xl pl-12 pr-4 py-3 text-violet-950 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 transition-all" />
        </div>
      </div>

      <TermsAcceptance accepted={acceptedToS} setAccepted={setAcceptedToS} variant="light" />

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-violet-200 text-slate-500 font-bold hover:bg-violet-50 transition-all cursor-pointer">Atrás</button>
        <button 
          type="submit" 
          disabled={!isFormValid}
          className="w-2/3 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-violet-600/30 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear Cuenta
        </button>
      </div>
    </form>
  )
}
