"use client";

import React, { useState } from "react";
import { X, Store, User, Mail, Phone, Lock, FileText, ChevronRight } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { ModalPortal } from "./ModalPortal";
import { PhoneInput } from "./PhoneInput";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerType: "demo" | "pionero" | null;
}

export function RegistrationModal({ isOpen, onClose, offerType }: RegistrationModalProps) {
  const { registerCommerceWithOffer } = useKFS() as any;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    rif: "",
  });

  if (!isOpen || !offerType) return null;

  const isDemo = offerType === "demo";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCommerceWithOffer(formData, offerType);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-md bg-slate-950 border-2 rounded-3xl p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
        isDemo ? "border-violet-600/50 shadow-violet-900/20" : "border-amber-600/50 shadow-orange-900/20"
      }`}>
        
        {/* Glow Effects */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-30 ${
          isDemo ? "bg-violet-500" : "bg-orange-500"
        }`} />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            isDemo 
              ? "bg-violet-900/60 text-violet-300 border-violet-800" 
              : "bg-amber-900/60 text-amber-300 border-amber-800"
          }`}>
            {isDemo ? "Demo Monopoly OS" : "Tarifa Pionera"}
          </span>
          <h2 className="text-2xl font-black text-white mt-4">
            Activa tu Nodo Comercial
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Completa tus datos para formalizar el registro en KFS OS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" name="company" required value={formData.company} onChange={handleChange}
                placeholder="Nombre del Comercio"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="Tu Nombre y Apellido"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" name="rif" required value={formData.rif} onChange={handleChange}
                  placeholder="RIF / Cédula"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
              <div className="relative">
                <PhoneInput
                  variant="dark"
                  required
                  value={formData.phone}
                  onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                  placeholder="WhatsApp (04xx...)"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="Correo Electrónico"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" name="password" required value={formData.password} onChange={handleChange}
                placeholder="Contraseña de Acceso"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 font-black text-sm rounded-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${
              isDemo 
                ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30" 
                : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 shadow-lg shadow-orange-500/20"
            }`}
          >
            {loading ? "Validando Sistema..." : "Registrar y Entrar a la Consola"}
            {!loading && <ChevronRight size={18} />}
          </button>

          <p className="text-[9px] text-center text-slate-500 mt-4 leading-relaxed">
            Al registrarte aceptas los Términos de Servicio de la Red Monopoly OS. 
            Este nodo comercial se enlazará automáticamente con el Master Core (El Arquitecto).
          </p>
        </form>
      </div>
      </div>
    </ModalPortal>
  );
}
