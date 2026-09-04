"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Shield, Lock, ChevronRight, ChevronLeft, Smartphone, Mail,
  Eye, EyeOff, UserPlus, ShoppingCart, Store, Users, Truck,
  Sparkles, CheckCircle2, KeyRound, ArrowRight, Info,
  HelpCircle, ChevronDown, Check, MessageCircle, Search, Zap
} from "lucide-react";
import { KFS_BRAND } from "../../config/brandConfig";
import { Navbar } from "../Navbar";

const RegisterClientForm = dynamic(() => import("../RegisterClientForm").then(m => m.RegisterClientForm), { ssr: false });
const RegisterPromotoraForm = dynamic(() => import("../RegisterPromotoraForm").then(m => m.RegisterPromotoraForm), { ssr: false });
const RegisterCustomerForm = dynamic(() => import("../RegisterCustomerForm").then(m => m.RegisterCustomerForm), { ssr: false });
const RegisterRiderForm = dynamic(() => import("../RegisterRiderForm").then(m => m.RegisterRiderForm), { ssr: false });

// Configuración de los 4 perfiles de registro disponibles
const REGISTRATION_PROFILES = [
  {
    id: "customer",
    targetTab: "registerCustomer",
    badge: "Consumidor B2C",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    accentColor: "from-emerald-500 to-teal-600",
    btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25",
    icon: ShoppingCart,
    iconBg: "bg-emerald-100 text-emerald-700",
    title: "Cliente / Comprador",
    subtitle: "Acumula Axis Points y canjea saldo en compras",
    description: "Diseñado para compradores en comercios aliados. Obtén un monedero digital personal donde cada compra te devuelve puntos canjeables por cashback o productos.",
    perks: [
      "Puntos y cashback directo en cada consumo",
      "Registro exprés en menos de 10 segundos con tu teléfono",
      "Seguimiento y recibos de tus pedidos en tiempo real"
    ],
    buttonText: "Registrarme como Cliente"
  },
  {
    id: "comercio",
    targetTab: "b2b-onboarding",
    badge: "Comercio & Punto de Venta",
    badgeColor: "bg-violet-100 text-violet-800 border-violet-200",
    accentColor: "from-violet-600 to-indigo-600",
    btnColor: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/25",
    icon: Store,
    iconBg: "bg-violet-100 text-violet-700",
    title: "Comercio o Negocio",
    subtitle: "Punto de Venta POS, inventario y catálogo digital",
    description: "La solución completa para tiendas, minimarkets, farmacias y restaurantes. Cobra en Bs (Pago Móvil BCV), USD o cripto, factura rápido y vende online por delivery.",
    perks: [
      "Punto de Venta en la nube con cobro multimoneda y tasa BCV",
      "Control de inventario en tiempo real y arqueo de caja",
      "Catálogo online para recibir pedidos directos a WhatsApp"
    ],
    buttonText: "Afiliar mi Comercio"
  },
  {
    id: "rider",
    targetTab: "registerRider",
    badge: "Flota de Entregas",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    accentColor: "from-amber-500 to-orange-600",
    btnColor: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25",
    icon: Truck,
    iconBg: "bg-amber-100 text-amber-700",
    title: "Rider / Repartidor",
    subtitle: "Genera ingresos entregando pedidos en tu ciudad",
    description: "Únete a la flota oficial de despacho para comercios aliados. Gestiona entregas de última milla con rutas optimizadas, confirmación por PIN y cobra tus ganancias semanales.",
    perks: [
      "Alertas automáticas de pedidos listos para despacho",
      "100% de las tarifas de envío y propinas directo para ti",
      "Retiros directos a tu Pago Móvil o cuenta bancaria"
    ],
    buttonText: "Postularme como Rider"
  },
  {
    id: "promotora",
    targetTab: "registerPromo",
    badge: "Red Comercial & Ventas",
    badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    accentColor: "from-fuchsia-600 to-pink-600",
    btnColor: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-fuchsia-600/25",
    icon: Users,
    iconBg: "bg-fuchsia-100 text-fuchsia-700",
    title: "Promotora de Afiliación",
    subtitle: "Gana comisiones recurrentes por comercios afiliados",
    description: "Monetiza tus relaciones comerciales. Afilia nuevos establecimientos y gana bonos en dólares y comisiones residuales por el volumen transaccionado en tu red.",
    perks: [
      "Comisiones fijas y residuales por cada negocio afiliado",
      "Enlace y código de referido personal con métricas en vivo",
      "Billetera virtual propia con liquidación inmediata de ingresos"
    ],
    buttonText: "Registrarme como Promotora"
  }
];

// Preguntas Frecuentes Desplegables
const FAQ_ITEMS = [
  {
    category: "General & Costos",
    question: "¿El registro para clientes, comercios, promotoras o riders tiene algún costo?",
    answer: "El registro para Clientes, Promotoras y Riders es 100% gratuito. Para los Comercios, la incorporación requiere la contratación del plan operativo y setup de infraestructura tecnológica (Punto de Venta en la nube, control de inventario, catálogo online y pasarelas de pago multimoneda), sin períodos de prueba gratuitos."
  },
  {
    category: "Inicio de Sesión",
    question: "¿Cómo funciona el inicio de sesión inteligente (Smart SSO) si ya tengo cuenta?",
    answer: "Es completamente unificado y automático. No necesitas buscar qué botón específico creaste. Solo escribe tu correo electrónico o tu número celular en el formulario principal e ingresa tu contraseña. Nuestro motor detecta instantáneamente si eres Dueño de Comercio, Cajero/Vendedor, Cliente, Rider o Promotora y abre tu consola específica sin fricción."
  },
  {
    category: "Punto de Venta & Pagos",
    question: "¿Qué métodos de pago acepta el Punto de Venta (POS) para comercios?",
    answer: "KFS OS / Axis Nitro está adaptado para transaccionar en economía multimoneda: procesa Pago Móvil interbancario automatizado con conversión a tasa oficial del Banco Central de Venezuela (BCV), Efectivo (USD y Bolívares), Zelle, Zinli, Binance Pay y transferencias bancarias. Todo se concilia automáticamente en tu arqueo de caja diario."
  },
  {
    category: "Comisiones & Ganancias",
    question: "¿Cómo y con qué frecuencia cobran sus comisiones las Promotoras y los Riders?",
    answer: "Tanto las comisiones de afiliación comercial como las tarifas de entrega se acreditan de forma transparente e inmediata a tu saldo virtual dentro de la plataforma. Puedes solicitar retiros a tu Pago Móvil o cuenta bancaria en cualquier momento desde tu panel de control."
  },
  {
    category: "Dispositivos & PWA",
    question: "¿Puedo utilizar KFS OS desde cualquier teléfono celular o tableta?",
    answer: "Sí. KFS OS opera bajo una arquitectura Progressive Web App (PWA) de alto rendimiento. Funciona de manera fluida en cualquier navegador moderno de Android o iPhone, se puede instalar en tu pantalla de inicio como una aplicación nativa o descargar en formato APK para terminales dedicadas."
  },
  {
    category: "Soporte & Claves",
    question: "¿Qué debo hacer si olvidé mi contraseña de acceso o necesito ayuda?",
    answer: "Puedes comunicarte directamente con nuestro equipo de soporte oficial vía WhatsApp o solicitar asistencia técnica. Un operador validará tu identidad mediante tu correo o teléfono registrado para restablecer tu acceso con total seguridad."
  },
  {
    category: "Modo Demostración",
    question: "¿Cómo puedo probar la plataforma antes de registrarme (Modo Demo)?",
    answer: "Puedes conocer y probar la interfaz completa tecleando la clave especial '000' en el campo de contraseña en el formulario superior. El sistema activará el entorno interactivo de demostración con datos de prueba para que explores cada panel."
  },
  {
    category: "Seguridad & Datos",
    question: "¿Cómo garantiza KFS OS la seguridad y persistencia de mis datos e inventarios?",
    answer: "El sistema opera bajo una estricta Regla Infranqueable de Persistencia: tus registros, ventas, clientes y configuraciones están resguardados con cifrado local y réplicas en la nube. Ninguna actualización o despliegue borra ni sobreescribe tus datos reales."
  }
];

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

  // Estados para FAQ y búsqueda
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

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

  // Enrutamiento directo al formulario de registro seleccionado con scroll suave
  const handleDirectRegister = (target: string) => {
    if (target === "b2b-onboarding") {
      if (setView) {
        setView("b2b-onboarding");
      } else {
        setActiveTab("register");
      }
    } else {
      setActiveTab(target);
    }
    if (typeof window !== "undefined") {
      const el = document.getElementById("auth-main-card");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Filtrado de preguntas frecuentes
  const filteredFaqs = FAQ_ITEMS.filter(item =>
    item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-slate-50 to-violet-100/70 font-sans selection:bg-violet-600 selection:text-white">
      <Navbar />
      
      {/* Contenedor Principal con Scroll Fluido y Estructura Responsive */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 w-full max-w-6xl mx-auto space-y-12 sm:space-y-16 py-6 sm:py-10">
        
        {/* Ancla para Scroll Suave de la Tarjeta Central */}
        <div id="auth-main-card" className="w-full flex justify-center scroll-mt-24">
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

                  {/* Acceso Rápido a Guía y FAQ */}
                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("guide-and-faqs");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[11px] font-bold text-violet-600 hover:text-violet-800 transition-colors border-none bg-transparent cursor-pointer inline-flex items-center gap-1 py-1"
                    >
                      <span>¿Dudas sobre qué cuenta elegir? Ver guía y FAQ</span>
                      <ChevronDown size={14} />
                    </button>
                  </div>
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

                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    ¿Cómo deseas usar Axis Nitro?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Selecciona tu perfil para configurar tu cuenta con las herramientas indicadas.
                  </p>
                </div>

                {/* Las 3 Vertientes de Selección */}
                <div className="space-y-3">
                  {/* Opción 1: Comprador / Cliente */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("registerCustomer")}
                    className="w-full text-left p-4 rounded-2xl border-2 border-violet-100 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-inner">
                      <ShoppingCart size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Soy Comprador / Cliente
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          B2C
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                        Gana Axis Points, canjea cashback y haz pedidos en comercios aliados.
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all self-center" />
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

                    <div className="grid grid-cols-2 gap-2 pt-1">
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

        {/* ========================================================= */}
        {/* SECCIÓN 1: GUÍA EXPLICATIVA DE REGISTROS Y BOTONES DIRECTOS */}
        {/* ========================================================= */}
        <section id="guide-and-faqs" className="w-full max-w-5xl mx-auto pt-4 space-y-8 scroll-mt-24">
          
          {/* Encabezado de la Sección de Registros */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-800 text-xs font-black uppercase tracking-wider border border-violet-200 shadow-sm">
              <Zap size={14} className="text-violet-600" />
              <span>Perfiles y Accesos KFS OS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ¿Cuál es la cuenta ideal para ti?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Conoce para qué sirve cada tipo de registro en la red Axis Nitro y accede con un solo clic al formulario correspondiente según tus objetivos.
            </p>
          </div>

          {/* Grid de los 4 Perfiles de Registro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REGISTRATION_PROFILES.map((profile) => {
              const IconComponent = profile.icon;
              return (
                <div
                  key={profile.id}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-violet-300 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-200/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Barra decorativa superior con degradado temático */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${profile.accentColor}`} />

                  <div>
                    {/* Header de la Tarjeta */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${profile.iconBg} group-hover:scale-105 transition-transform`}>
                        <IconComponent size={24} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${profile.badgeColor}`}>
                        {profile.badge}
                      </span>
                    </div>

                    {/* Títulos y Subtítulos */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-violet-700 transition-colors">
                      {profile.title}
                    </h3>
                    <p className="text-xs font-bold text-violet-600 mt-0.5">
                      {profile.subtitle}
                    </p>

                    {/* Descripción Explicativa (Para qué sirve) */}
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-3 leading-relaxed font-medium">
                      {profile.description}
                    </p>

                    {/* Beneficios Clave */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      {profile.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Registro Directo */}
                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDirectRegister(profile.targetTab)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] border-none shadow-md ${profile.btnColor}`}
                    >
                      <span>{profile.buttonText}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECCIÓN 2: PREGUNTAS FRECUENTES (FAQ) EN DESPLEGABLES     */}
        {/* ========================================================= */}
        <section className="w-full max-w-4xl mx-auto pt-4 space-y-8">
          
          {/* Encabezado FAQ */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider border border-indigo-200 shadow-sm">
              <HelpCircle size={14} className="text-indigo-600" />
              <span>Preguntas Frecuentes (FAQ)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Todo lo que necesitas saber
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Respuestas directas a las consultas más habituales sobre accesos, registros, pagos y seguridad en la plataforma.
            </p>

            {/* Buscador de preguntas rápido */}
            <div className="relative max-w-md mx-auto mt-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda o palabra clave (ej. costo, pago, bcv)..."
                className="w-full bg-white/90 border border-slate-200 focus:border-violet-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Acordeón Desplegable */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className={`bg-white/95 backdrop-blur-md rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                      isOpen ? "border-violet-300 ring-4 ring-violet-500/5 shadow-md" : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer border-none bg-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 text-xs font-black">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider block mb-0.5">
                            {faq.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">
                            {faq.question}
                          </h4>
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-violet-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-slate-50 animate-fade-in text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium pl-14">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-white/70 rounded-2xl border border-slate-100 p-6 text-slate-500 text-xs">
                No encontramos preguntas que coincidan con "<strong>{faqSearch}</strong>". Intenta con otra palabra.
              </div>
            )}
          </div>

          {/* Tarjeta de Soporte y Asistencia Directa */}
          <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-fuchsia-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
                <MessageCircle size={14} /> Asesoría y Soporte Oficial
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                ¿Tienes una duda específica o deseas afiliar tu comercio?
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-medium">
                Nuestro equipo comercial y técnico está disponible para guiarte paso a paso en la puesta en marcha de tu cuenta.
              </p>
            </div>
            <a
              href="https://wa.me/584141234567?text=Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20y%20asesor%C3%ADa%20sobre%20Axis%20Nitro%20/%20KFS%20OS."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 active:scale-95 font-black text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 no-underline cursor-pointer"
            >
              <MessageCircle size={18} className="text-emerald-600" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
