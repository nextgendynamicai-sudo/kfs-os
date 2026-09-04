"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Shield, Lock, ChevronRight, ChevronLeft, Smartphone, Mail,
  Eye, EyeOff, UserPlus, ShoppingCart, Store, Users, Truck,
  Sparkles, CheckCircle2, KeyRound, ArrowRight, Info
} from "lucide-react";
import { KFS_BRAND } from "../../config/brandConfig";
import { Navbar } from "../Navbar";

const RegisterClientForm = dynamic(() => import("../RegisterClientForm").then(m => m.RegisterClientForm), { ssr: false });
const RegisterPromotoraForm = dynamic(() => import("../RegisterPromotoraForm").then(m => m.RegisterPromotoraForm), { ssr: false });
const RegisterCustomerForm = dynamic(() => import("../RegisterCustomerForm").then(m => m.RegisterCustomerForm), { ssr: false });
const RegisterRiderForm = dynamic(() => import("../RegisterRiderForm").then(m => m.RegisterRiderForm), { ssr: false });

export const LoginView = ({
  handleLogin,
  registerClient,
  registerPromotora,
  db,
  setView,
  currentUser,
  logout
}: any) => {
  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("ref") || searchParams.get("referral") || searchParams.get("referralCode") || searchParams.get("code") || searchParams.get("promotoraId") || "";
    }
    return "";
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRole = searchParams.get("role");
      const hash = window.location.hash.replace("#", "").trim();

      if (hash === "register" || hash === "registerCustomer" || hash === "registerPromo" || hash === "registerRider") {
        return hash;
      }

      if (urlRole) {
        if (urlRole === "dueño" || urlRole === "register") return "register";
        if (urlRole === "customer" || urlRole === "registerCustomer") return "registerCustomer";
        if (urlRole === "promotora" || urlRole === "registerPromo") return "registerPromo";
        if (urlRole === "rider" || urlRole === "registerRider") return "registerRider";
        if (urlRole === "marketplace") return "marketplace";
        return urlRole;
      }

      const ref = searchParams.get("ref") || searchParams.get("referral") || searchParams.get("referralCode") || searchParams.get("code") || searchParams.get("promotoraId");
      if (ref) {
        return "registerCustomer";
      }

      const saved = localStorage.getItem("kfs_pending_tab");
      if (saved) {
        localStorage.removeItem("kfs_pending_tab");
        return saved;
      }
    }
    return "login";
  });

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleOverride, setSelectedRoleOverride] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const isPhoneIdentifier = /^[+0-9\s-]+$/.test(identifier.trim()) && identifier.trim().length > 3;

  const handleSubmitLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetRole = selectedRoleOverride || (activeTab === "core" ? "core" : "universal");
      await handleLogin(targetRole, password, identifier);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecretAdminTrigger = () => {
    const next = adminClickCount + 1;
    setAdminClickCount(next);
    if (next >= 3) {
      setSelectedRoleOverride("core");
      setShowRoleSelector(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-slate-50 to-violet-100/70 font-sans selection:bg-violet-600 selection:text-white">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl shadow-violet-200/60 border border-violet-100/80 rounded-[2.5rem] p-6 sm:p-8 animate-fade-in transition-all">
          
          {/* ========================================================= */}
          {/* CASO 1: SESIÓN ACTIVA DETECTADA                           */}
          {/* ========================================================= */}
          {currentUser ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full p-0.5 mx-auto shadow-xl shadow-violet-500/20">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
                  ) : (
                    <span className="text-violet-700 font-black text-xl">
                      {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "AN")}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sesión Activa
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentUser.name || currentUser.company || "Usuario"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Perfil de acceso: <strong className="text-violet-700 uppercase tracking-wider">{currentUser.role}</strong>
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const role = currentUser.role;
                    if (role === "dueño") setView("client");
                    else if (role === "vendedor") setView("vendedor");
                    else if (role === "promotora") setView("promotora");
                    else if (role === "core") setView("core");
                    else if (role === "customer") setView("customer");
                    else if (role === "rider") setView("rider");
                    else setView("landing");
                  }}
                  className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-600/30 border-none text-white bg-violet-600 hover:bg-violet-700 cursor-pointer text-sm"
                >
                  Ir a mi Panel de Control <ChevronRight size={18} />
                </button>
                <button
                  onClick={logout}
                  className="w-full py-3.5 rounded-2xl font-bold border border-red-200 text-red-600 hover:bg-red-50/80 transition-colors cursor-pointer text-xs bg-transparent"
                >
                  Cerrar Sesión (Cambiar de Cuenta)
                </button>
              </div>
            </div>
          ) : activeTab === "login" || activeTab === "marketplace" ? (
            /* ========================================================= */
            /* CASO 2: SMART SSO LOGIN (DETECCIÓN AUTOMÁTICA)             */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <button
                  onClick={handleSecretAdminTrigger}
                  title="Axis Nitro Security Core"
                  className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-violet-600/30 border-none cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                >
                  <Shield size={26} />
                </button>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {KFS_BRAND.productAcronym} <span className="text-violet-600">Access</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Acceso inteligente y unificado para clientes, comercios y equipo
                </p>
              </div>

              {/* Selector de rol opcional/avanzado si se activó */}
              {showRoleSelector && (
                <div className="bg-violet-50/80 border border-violet-200 rounded-2xl p-2.5 animate-fade-in">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-[10px] font-black text-violet-800 uppercase tracking-wider">Vector Forzado:</span>
                    <button onClick={() => { setShowRoleSelector(false); setSelectedRoleOverride(null); }} className="text-[10px] text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                      Modo Auto
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    {["universal", "customer", "dueño", "vendedor", "promotora", "rider", "core"].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRoleOverride(r === "universal" ? null : r)}
                        className={`py-1.5 px-2 rounded-lg font-bold capitalize border-none cursor-pointer transition-all ${
                          (selectedRoleOverride === r || (!selectedRoleOverride && r === "universal"))
                            ? "bg-violet-600 text-white shadow-sm"
                            : "bg-white text-slate-600 hover:bg-violet-100"
                        }`}
                      >
                        {r === "universal" ? "Auto ✨" : r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulario Smart SSO */}
              <form onSubmit={handleSubmitLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider ml-1">
                    Correo Electrónico o Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                      {isPhoneIdentifier ? <Smartphone size={18} /> : <Mail size={18} />}
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="usuario@correo.com o 04141234567"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200 focus:border-violet-500 focus:bg-white rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Ingresa tu clave de acceso"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200 focus:border-violet-500 focus:bg-white rounded-2xl pl-11 pr-11 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 border-none bg-transparent cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password === "000" && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200/70 p-2.5 rounded-xl animate-fade-in mt-2">
                      <Sparkles size={14} className="shrink-0 text-amber-500" />
                      <span>Modo Demo Activado: Acceso instantáneo con datos simulados.</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer border-none mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Autenticando...</span>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* ========================================================= */}
              {/* BOTÓN DE REGISTRO DESTACADO (HIGH VISIBILITY CTA)         */}
              {/* ========================================================= */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-center">
                  <span className="text-xs text-slate-500 font-semibold">¿Aún no tienes cuenta?</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("register-select")}
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-violet-700 bg-violet-50 hover:bg-violet-600 hover:text-white border-2 border-violet-200/80 hover:border-violet-600 transition-all shadow-sm hover:shadow-lg hover:shadow-violet-600/25 flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <UserPlus size={18} className="text-violet-600 group-hover:text-white transition-colors" />
                  <span>Crear Cuenta Nueva / Registrarme</span>
                  <ArrowRight size={16} className="text-violet-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Acceso Rápido a Nitro Market sin Login */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => handleLogin("marketplace", "")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-violet-700 transition-colors py-1.5 px-3 rounded-xl hover:bg-violet-50/80 border-none bg-transparent cursor-pointer"
                >
                  <ShoppingCart size={15} className="text-violet-500" />
                  <span>Explorar Nitro Market como Invitado</span>
                </button>
              </div>

              {/* Footer discreto con selector manual */}
              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                >
                  ⚙️ Ingreso por rol específico
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleOverride("core");
                    setShowRoleSelector(true);
                  }}
                  className="hover:text-violet-600 flex items-center gap-1 border-none bg-transparent cursor-pointer"
                >
                  <KeyRound size={12} />
                  <span>Acceso Core</span>
                </button>
              </div>
            </div>
          ) : activeTab === "register-select" ? (
            /* ========================================================= */
            /* CASO 3: SELECTOR GUIADO POR PROPÓSITO (REGISTRO)          */
            /* ========================================================= */
            <div className="space-y-6 animate-fade-in">
              {/* Header de Registro */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-700 py-1.5 px-2.5 rounded-xl hover:bg-violet-50 border-none bg-transparent cursor-pointer transition-colors"
                >
                  <ChevronLeft size={16} /> Volver
                </button>
                <span className="text-[11px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                  Registro Nuevo
                </span>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  ¿Cómo deseas usar Axis Nitro?
                </h2>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  Selecciona tu objetivo para abrir el formulario exacto en segundos
                </p>
              </div>

              {/* Tarjetas de Selección por Propósito */}
              <div className="space-y-3 pt-1">
                {/* Opción 1: Cliente / Comprador */}
                <button
                  type="button"
                  onClick={() => setActiveTab("registerCustomer")}
                  className="w-full text-left p-4 rounded-2xl border-2 border-violet-100 hover:border-violet-500 bg-white hover:bg-violet-50/50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-violet-100 group-hover:bg-violet-600 text-violet-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-inner">
                    <ShoppingCart size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-violet-700 transition-colors">
                        Soy Comprador / Cliente
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        10 seg
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                      Gana Axis Points, canjea cashback y haz pedidos en comercios aliados.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all self-center" />
                </button>

                {/* Opción 2: Comercio / Negocio */}
                <button
                  type="button"
                  onClick={() => {
                    if (setView) {
                      setView("b2b-onboarding");
                    } else {
                      setActiveTab("register");
                    }
                  }}
                  className="w-full text-left p-4 rounded-2xl border-2 border-violet-100 hover:border-violet-500 bg-white hover:bg-violet-50/50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-violet-100 group-hover:bg-violet-600 text-violet-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-inner">
                    <Store size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-violet-700 transition-colors">
                        Tengo un Comercio / Negocio
                      </h3>
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                        B2B POS
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                      Punto de venta, catálogo online, facturación fiscal e inventario en tiempo real.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all self-center" />
                </button>

                {/* Opción 3: Trabajar con la Red (Rider & Promotora) */}
                <div className="p-4 rounded-2xl border-2 border-violet-100 bg-white shadow-sm space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 shadow-inner">
                      <Sparkles size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-slate-900">
                        Quiero Generar Ingresos con la Red
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Trabaja con la flota de entregas o afilia comercios por comisiones.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("registerRider")}
                      className="py-2.5 px-3 rounded-xl border border-violet-200 hover:border-violet-500 bg-violet-50/50 hover:bg-violet-600 hover:text-white text-violet-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <Truck size={15} />
                      <span>Soy Rider</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("registerPromo")}
                      className="py-2.5 px-3 rounded-xl border border-violet-200 hover:border-violet-500 bg-violet-50/50 hover:bg-violet-600 hover:text-white text-violet-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <Users size={15} />
                      <span>Soy Promotora</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón de regreso a Login */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-xs font-bold text-slate-500 hover:text-violet-700 transition-colors border-none bg-transparent cursor-pointer"
                >
                  ¿Ya tienes una cuenta registrada? <strong>Inicia sesión aquí</strong>
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* CASO 4: FORMULARIOS INDIVIDUALES DE REGISTRO              */
            /* ========================================================= */
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("register-select")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-violet-700 border-none bg-transparent cursor-pointer"
                >
                  <ChevronLeft size={16} /> Cambiar opción
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-xs font-bold text-violet-600 hover:text-violet-800 border-none bg-transparent cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </div>

              {activeTab === "register" && (
                <RegisterClientForm
                  onRegister={registerClient}
                  onCancel={() => setActiveTab("register-select")}
                  defaultReferralCode={referralCode}
                />
              )}

              {activeTab === "registerPromo" && (
                <RegisterPromotoraForm
                  onRegister={registerPromotora}
                  onCancel={() => setActiveTab("register-select")}
                  defaultReferralCode={referralCode}
                />
              )}

              {activeTab === "registerCustomer" && (
                <RegisterCustomerForm
                  onCancel={() => setActiveTab("register-select")}
                  defaultReferralCode={referralCode}
                />
              )}

              {activeTab === "registerRider" && (
                <RegisterRiderForm
                  onCancel={() => setActiveTab("register-select")}
                  defaultReferralCode={referralCode}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
