"use client";

import React, { useState } from "react";
import { KFS_BRAND } from "../config/brandConfig";
import { Camera, DollarSign, Lock, Info, Store, UserCheck, Smartphone, FileText, MapPin, Trash2 } from "lucide-react";
import { compressImage } from "../lib/utils";
import { PhoneInput } from "./PhoneInput";
import { TermsAcceptance, generateLegalTermsAudit } from "./TermsAcceptance";

export const RegisterClientForm = ({ onRegister, onCancel, standalone = true, defaultReferralCode = "" }: any) => {
  const [formData, setFormData] = useState({ name: "", idCard: "", company: "", avgBilling: "", phone: "", email: "", password: "", address: "", kfsFeePercentage: 0.03, avatar: "", kycCedula: "", business_preset: "RETAIL-QUICK" });
  const [avatar, setAvatar] = useState<string>("");
  const [kycCedula, setKycCedula] = useState<string>("");
  const [acceptedToS, setAcceptedToS] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isPhoneValid = validatePhone(formData.phone);
  const isEmailValid = validateEmail(formData.email);
  const isNameValid = formData.name.trim().length >= 3;
  const isIdCardValid = formData.idCard.trim().length >= 5;
  const isCompanyValid = formData.company.trim().length >= 3;
  const isAddressValid = formData.address.trim().length >= 5;
  const isPasswordValid = formData.password.length >= 6;
  const isFormValid = isNameValid && isIdCardValid && isCompanyValid && isAddressValid && isPhoneValid && isEmailValid && isPasswordValid && acceptedToS;

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

  const ALL_AVAILABLE_SERVICES = [
    { id: "pos_checkout", label: "Punto de Venta POS & Cobro Multimoneda", desc: "Caja registradora, escáner e impresión" },
    { id: "inventory_management", label: "Inventario & Catálogo de Productos", desc: "Gestión de stock, fotos y precios" },
    { id: "online_marketplace", label: "Tienda Digital en Marketplace", desc: "Ventas online directas en la web" },
    { id: "delivery_rider", label: "Despacho Delivery / Motorizados", desc: "Asignación de riders a pedidos" },
    { id: "vales_payroll", label: "Gestión de Vales & Nómina", desc: "Adelantos de sueldo a cajeros" },
    { id: "crm_express", label: "Fidelización CRM & Axis Points", desc: "Cashback y registro de clientes" },
    { id: "fiscal_printer", label: "Conexión Impresora Fiscal", desc: "Facturación legal y fiscal" },
    { id: "escandallos_serial", label: "Escandallos / Seriales", desc: "Trazabilidad de costo y serie" },
    { id: "booking_room", label: "Reservas & Habitaciones", desc: "Reserva de citas o salas" }
  ];

  const [enabledServices, setEnabledServices] = useState<string[]>([
    "pos_checkout",
    "inventory_management",
    "online_marketplace",
    "delivery_rider",
    "vales_payroll",
    "crm_express",
    "fiscal_printer",
    "escandallos_serial",
    "booking_room"
  ]);

  const toggleService = (serviceId: string) => {
    setEnabledServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formData.company.trim()) {
      setFormError("Por favor ingresa el Nombre Comercial / Empresa.");
      return;
    }
    if (!isNameValid) {
      setFormError("Por favor ingresa el Nombre del Representante Legal.");
      return;
    }
    if (!isPhoneValid) {
      setFormError("Por favor ingresa un número de teléfono válido (Ej: 04141234567).");
      return;
    }
    if (!isEmailValid) {
      setFormError("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!isPasswordValid) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!acceptedToS) {
      setFormError("Debes aceptar los Términos de Servicio para registrar tu comercio.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const defaultAvatar = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150&auto=format&fit=crop&q=80";
      const defaultCedula = "default_cedula_doc";

      const fallbackData = {
        ...formData,
        enabledServices,
        idCard: formData.idCard.trim() || "V00000000",
        address: formData.address.trim() || "Dirección Comercial Principal",
        avatar: avatar || defaultAvatar,
        kycCedula: kycCedula || defaultCedula,
        termsAudit: generateLegalTermsAudit()
      };

      await Promise.resolve(onRegister(fallbackData, defaultReferralCode, 0.03));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${standalone ? "text-violet-950 animate-fade-in" : "text-violet-950"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-violet-700 border-violet-100" : "text-violet-900 border-violet-100"}`}>Setup de Nuevo Comercio</h3>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl mb-3 flex items-center justify-between animate-fade-in">
          <span>⚠️ {formError}</span>
          <button type="button" onClick={() => setFormError("")} className="text-red-400 hover:text-red-600 font-black">✕</button>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 mb-4 relative">
        <div className="relative w-20 h-20">
          <label className="relative w-full h-full rounded-full border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center bg-violet-50 hover:bg-violet-100 transition-colors group block">
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
        <span className={`text-[10px] font-bold uppercase tracking-wider ${standalone ? "text-slate-400" : "text-slate-500"}`}>Logo / Foto Comercio</span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-4 relative">
        <div className="relative w-full h-20">
          <label className={`relative w-full h-full rounded-xl border-2 border-dashed border-violet-200 cursor-pointer overflow-hidden flex items-center justify-center transition-colors group block ${standalone ? "bg-violet-50 hover:bg-violet-100" : "bg-violet-50/50 hover:bg-violet-100"}`}>
            <input type="file" accept="image/*" className="hidden" onChange={handleCedulaChange} />
            {kycCedula ? (
              <img src={kycCedula} className="w-full h-full object-cover opacity-80" alt="Cédula" />
            ) : (
              <div className={`text-center transition-colors ${standalone ? "text-violet-400 group-hover:text-violet-600" : "text-violet-500 group-hover:text-violet-700"}`}>
                <Camera size={24} className="mx-auto" />
                <span className="text-[10px] font-bold block mt-1 text-slate-500">Subir Cédula del Representante (KYC)</span>
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

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-violet-700" : "text-violet-800"}`}>Nombre Completo</label>
        <div className="relative">
          <UserCheck className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required placeholder="Ej: Juan Pérez" value={formData.name} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className={`block text-xs font-black uppercase tracking-widest ${standalone ? "text-violet-700" : "text-violet-800"}`}>Cédula / RIF</label>
          {formData.idCard && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isIdCardValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isIdCardValid ? "✓ Formato Válido" : "✗ Mínimo 5 caracteres"}
            </span>
          )}
        </div>
        <div className="relative">
          <FileText className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required placeholder="Ej: V-12345678 o J-12345678" value={formData.idCard} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, idCard: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-violet-700" : "text-violet-800"}`}>Nombre de la Empresa / Comercio</label>
        <div className="relative">
          <Store className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required placeholder="Ej: Inversiones El Sol C.A." value={formData.company} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, company: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-violet-700" : "text-violet-800"}`}>Dirección Comercial Exacta</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-violet-400" size={20} />
          <textarea required placeholder="Calle, Avenida, Centro Comercial, Local..." value={formData.address} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all h-20 resize-none ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </div>
      </div>

      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-violet-700" : "text-violet-800"}`}>Facturación Promedio Diaria ($)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required type="number" placeholder="Ej: 500" value={formData.avgBilling} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, avgBilling: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col mb-2">
        <label className={`text-xs font-black mb-1 ml-1 uppercase tracking-widest ${standalone ? "text-violet-700" : "text-violet-800"}`}>Tarifa BOS (Comisión Kreatek)</label>
        <select required value={formData.kfsFeePercentage} onChange={e => setFormData({ ...formData, kfsFeePercentage: parseFloat(e.target.value) })} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all font-bold cursor-pointer ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`}>
          <option value={0.03}>Plan Base (3%)</option>
          <option value={0.05}>Plan Estándar (5%)</option>
          <option value={0.10}>Plan Premium (10%)</option>
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <label className={`text-xs font-black mb-1 ml-1 uppercase tracking-widest ${standalone ? "text-violet-700" : "text-violet-800"}`}>Tipo de Ecosistema / Preset</label>
        <select required value={formData.business_preset} onChange={e => setFormData({ ...formData, business_preset: e.target.value })} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all font-bold cursor-pointer ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`}>
          <option value="RETAIL-QUICK">Tienda Física POS (Inventario, Balanza, Impresora)</option>
          <option value="AXIS-ONLY">Sólo Puntos Axis (Fidelización Digital, Sin Local Físico)</option>
        </select>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className={`block text-xs font-black uppercase tracking-widest ${standalone ? "text-violet-700" : "text-violet-800"}`}>Teléfono Personal</label>
          {formData.phone && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPhoneValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isPhoneValid ? "✓ Teléfono Válido" : "✗ Formato Inválido"}
            </span>
          )}
        </div>
        <PhoneInput
          required
          value={formData.phone}
          onChange={val => setFormData({ ...formData, phone: val })}
          placeholder="04141234567"
        />
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-1 ml-1">
          <label className={`block text-xs font-black uppercase tracking-widest ${standalone ? "text-violet-700" : "text-violet-800"}`}>Correo Electrónico</label>
          {formData.email && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isEmailValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {isEmailValid ? "✓ Correo Válido" : "✗ Email Inválido"}
            </span>
          )}
        </div>
        <div className="relative">
          <Info className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required type="email" placeholder="ejemplo@correo.com" value={formData.email} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
      </div>
      
      <div className="relative">
        <label className={`block text-xs font-black uppercase tracking-widest mb-1 ml-1 ${standalone ? "text-violet-700" : "text-violet-800"}`}>Crear Clave de Acceso</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-violet-400" size={20} />
          <input required type="password" placeholder="Mínimo 6 caracteres" value={formData.password} className={`w-full border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all ${standalone ? "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400" : "bg-violet-50/30 border-violet-100 text-violet-950 placeholder:text-slate-400"}`} onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </div>
      </div>

      {/* SELECCIONADOR MODULAR DE SERVICIOS */}
      <div className="bg-violet-50/60 border border-violet-100 rounded-xl p-3 my-3">
        <label className="block text-xs font-black uppercase tracking-widest text-violet-800 mb-1">
          Servicios Habilitados para el Comercio ({enabledServices.length} de {ALL_AVAILABLE_SERVICES.length})
        </label>
        <p className="text-[10px] text-slate-500 mb-3">Selecciona únicamente los servicios y módulos que el cliente desea activar en su plan:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
          {ALL_AVAILABLE_SERVICES.map((srv) => {
            const isChecked = enabledServices.includes(srv.id);
            return (
              <label 
                key={srv.id} 
                className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                  isChecked 
                    ? "bg-white border-violet-400 shadow-sm" 
                    : "bg-gray-50/50 border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => toggleService(srv.id)}
                  className="mt-0.5 accent-violet-600 cursor-pointer"
                />
                <div>
                  <span className="text-[11px] font-bold text-violet-950 block leading-tight">{srv.label}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight">{srv.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <TermsAcceptance accepted={acceptedToS} setAccepted={setAcceptedToS} variant={standalone ? "light" : "dark"} />

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl border border-violet-200 text-slate-500 font-bold hover:bg-violet-50 transition-all text-sm cursor-pointer">Cancelar</button>
        <button 
          type="submit" 
          disabled={!isFormValid || isSubmitting}
          className="w-2/3 py-3.5 rounded-xl font-black text-white text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-violet-600/30 cursor-pointer bg-violet-600 border-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          title={isFormValid ? "Completar registro" : "Por favor, completa todos los requisitos mostrados en la lista"}
        >
          {isSubmitting ? "Registrando..." : isFormValid ? "Finalizar Setup de Tienda" : "Requisitos Incompletos"}
        </button>
      </div>
    </form>
  );
}
