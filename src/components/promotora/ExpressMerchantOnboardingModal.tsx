"use client";

import React, { useState } from "react";
import { UserPlus, Sparkles, Check, X, Store, Phone, Lock, Tag, ArrowRight } from "lucide-react";
import { useKFS } from "../../context/KFSContext";
import { createTenantSlug } from "../../lib/tenantManager";

interface ExpressMerchantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotoraId: string;
  promotoraName: string;
}

export const ExpressMerchantOnboardingModal: React.FC<ExpressMerchantOnboardingModalProps> = ({
  isOpen,
  onClose,
  promotoraId,
  promotoraName
}) => {
  const { registerClient, showToast } = useKFS() as any;

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Comida & Restaurantes");
  const [password, setPassword] = useState("123456");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStoreData, setCreatedStoreData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleCompleteRegister = async () => {
    if (!companyName.trim() || !phone.trim()) {
      showToast("Completa los campos obligatorios.", "error");
      return;
    }

    setIsSubmitting(true);
    const slug = createTenantSlug(companyName);

    const clientFormData = {
      name: ownerName.trim() || companyName.trim(),
      company: companyName.trim(),
      phone: phone.trim(),
      email: `${slug}@axisnitro.store`,
      password: password.trim() || "123456",
      address: "Caracas, Venezuela",
      category: category,
      slug: slug,
      promotoraId: promotoraId,
      isArchitectStore: true,
      created_by: "promotora",
      plan: "pionero",
      kfsFeePercentage: 0.02
    };

    try {
      if (registerClient) {
        await registerClient(clientFormData, promotoraId, 0.02);
      }
      setCreatedStoreData(clientFormData);
      setStep(3); // Paso final de confirmación
      showToast(`🎉 ¡Comercio '${companyName}' activado en la red!`, "success");
    } catch (err) {
      showToast("Error al registrar comercio. Intenta nuevamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setCompanyName("");
    setOwnerName("");
    setPhone("");
    setPassword("123456");
    setCreatedStoreData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-violet-500/40 rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 text-white shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
              <UserPlus size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                Alta Exprés en 3 Pasos
              </span>
              <h3 className="text-lg font-black text-white">
                Registrar Nuevo Comercio
              </h3>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={20} />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <div className="flex items-center justify-between px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  step === s
                    ? "bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/30"
                    : step > s
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  step === s ? "text-amber-400 font-black" : "text-slate-500"
                }`}
              >
                {s === 1 ? "Negocio" : s === 2 ? "Contacto" : "¡Listo!"}
              </span>
              {s < 3 && <div className="w-8 sm:w-12 h-0.5 bg-slate-800" />}
            </div>
          ))}
        </div>

        {/* Paso 1: Datos del Negocio */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Nombre de la Empresa o Tienda *
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej: Panadería y Pastelería La Espiga"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 font-bold"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Nombre del Dueño o Encargado (Opcional)
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ej: Carlos Mendoza"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Categoría / Rubro
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500 font-bold cursor-pointer"
              >
                <option value="Comida & Restaurantes">🍔 Comida, Panadería y Restaurantes</option>
                <option value="Bodegones & Supermercados">🛒 Bodegón, Supermercado y Víveres</option>
                <option value="Farmacias & Salud">💊 Farmacia y Salud</option>
                <option value="Ropa & Calzado">👕 Ropa, Calzado y Boutique</option>
                <option value="Servicios & Varios">⚡ Servicios y Otros</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!companyName.trim()) {
                  showToast("Escribe el nombre del negocio", "error");
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              Continuar al Paso 2 <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Paso 2: Teléfono y Acceso */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                WhatsApp / Teléfono del Comercio *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: +58 412 1234567"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 font-mono font-bold"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tus clientes usarán este número para enviarte pedidos directos.
              </span>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
                Clave de Acceso Inicial
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>

            <div className="bg-violet-950/40 border border-violet-500/30 rounded-2xl p-3.5 text-xs text-violet-200">
              <span className="font-bold text-amber-300 block mb-0.5">🌟 Afiliado a tu cuenta:</span>
              Promotora: <strong>{promotoraName}</strong> (ID: {promotoraId}). Recibirás tus comisiones de forma automática.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Volver
              </button>
              <button
                onClick={handleCompleteRegister}
                disabled={isSubmitting}
                className="w-2/3 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Activando Tienda..." : "✓ ¡Activar Tienda Ahora!"}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación Final */}
        {step === 3 && createdStoreData && (
          <div className="text-center space-y-4 animate-fade-in py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>

            <div>
              <h4 className="text-xl font-black text-white">
                ¡{createdStoreData.company} está Activo!
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                La tienda ha sido dada de alta exitosamente en la red.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Tienda Virtual:</span>
                <span className="text-amber-400 font-bold">https://axisnitro.store/nitro/{createdStoreData.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acceso POS:</span>
                <span className="text-white font-bold">https://axisnitro.store/#login</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clave Inicial:</span>
                <span className="text-emerald-400 font-bold">{createdStoreData.password}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  const msg = `¡Hola ${createdStoreData.name}! 👋\n\nTu tienda comercial *${createdStoreData.company}* ya está activa en Axis Nitro:\n\n🛍️ *Tu Tienda Virtual:* https://axisnitro.store/nitro/${createdStoreData.slug}\n💳 *Acceso a tu Caja POS:* https://axisnitro.store/#login\n🔑 *Clave Inicial:* ${createdStoreData.password}\n\nCualquier duda, estoy a tu orden para ayudarte.`;
                  window.open(`https://wa.me/${createdStoreData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all border-none cursor-pointer"
              >
                📲 Enviar Accesos al Dueño
              </button>

              <button
                onClick={handleResetAndClose}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
