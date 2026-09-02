"use client";

import React, { useState } from "react";
import { 
  Sparkles, Store, Smartphone, WifiOff, TrendingUp, ShieldCheck, 
  Truck, Gift, CreditCard, Clock, Award, ArrowRight, CheckCircle2, 
  MessageCircle, BarChart3, Users, Zap, QrCode, Layers, Star, Phone
} from "lucide-react";

export default function BeneficiosLandingPage() {
  const [activeTab, setActiveTab] = useState<"pos" | "tienda" | "delivery" | "fidelizacion">("pos");

  const coreFeatures = [
    {
      icon: WifiOff,
      title: "Operación 100% Offline",
      description: "Si se cae el internet o falla la energía eléctrica, tu caja registradora sigue cobrando y emitiendo tickets normalmente sin interrupciones."
    },
    {
      icon: TrendingUp,
      title: "Tasa BCV en Tiempo Real",
      description: "Conversión automática e instantánea entre Dólares y Bolívares a la tasa oficial del Banco Central de Venezuela. Olvídate de la calculadora manual."
    },
    {
      icon: Store,
      title: "Tu Propia Tienda Virtual",
      description: "Un catálogo digital exclusivo con tus fotos, descripciones y precios donde tus clientes compran y te envían el pedido directo a tu WhatsApp."
    },
    {
      icon: Truck,
      title: "Delivery sin Comisiones a Terceros",
      description: "Despacha a domicilio con tus propios motorizados o personal de confianza, manteniendo el 100% del margen de tu comida o mercancía."
    },
    {
      icon: Gift,
      title: "Puntos de Fidelización",
      description: "Premia las compras recurrentes de tus clientes con puntos de fidelidad para asegurar que siempre vuelvan a comprar en tu negocio."
    },
    {
      icon: BarChart3,
      title: "Cierre Z y Cuadre Exacto",
      description: "Reporte consolidado al final del día con el total de efectivo, Pago Móvil y divisas recibidas para cuadrar caja en 30 segundos."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Navbar Superior Minimalista */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
              ⚡
            </div>
            <div>
              <span className="font-black text-base text-white tracking-tight">Axis Nitro</span>
              <span className="text-[10px] text-amber-400 font-mono block -mt-1 font-bold">KFS Operating System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/#login"
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all no-underline border border-white/10"
            >
              Iniciar Sesión
            </a>
            <a
              href="https://wa.me/?text=Hola,%20deseo%20una%20demostración%20gratuita%20de%20Axis%20Nitro%20para%20mi%20negocio."
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all no-underline shadow-lg shadow-amber-500/20"
            >
              Solicitar Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shadow-inner">
            <Sparkles size={14} /> La Plataforma Comercial Todo-en-Uno
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Todo lo que tu Negocio Necesita para <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Crecer y Vender Más</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Punto de Venta inteligente, Tienda Virtual propia, conversión automática BCV y delivery directo en una sola aplicación sencilla y rápida.
          </p>

          {/* Badges de Garantía */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400" /> Funciona en Celular y Tablet
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400" /> Opera sin Internet (Offline)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400" /> Tasa Oficial BCV al Instante
            </span>
          </div>
        </div>
      </section>

      {/* Grid de 6 Pilares del Ecosistema */}
      <section className="py-16 px-6 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Diseñado para la Realidad de tu Comercio
            </h2>
            <p className="text-sm text-slate-400">
              Elimina los dolores de cabeza diarios de tu negocio con tecnología moderna creada para el día a día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-6 rounded-3xl space-y-3 transition-all hover:scale-[1.02] shadow-xl group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-md">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-black text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección Interactiva: Selector de Módulos */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Explora Cada Módulo en Detalle
            </h2>
            <p className="text-sm text-slate-400">
              Toca cada pestaña para ver cómo funciona en la vida real.
            </p>
          </div>

          {/* Botones de Pestañas */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 max-w-xl mx-auto">
            {[
              { id: "pos", label: "💳 Caja Registradora (POS)" },
              { id: "tienda", label: "🛍️ Tienda Virtual Propia" },
              { id: "delivery", label: "🛵 Delivery Directo" },
              { id: "fidelizacion", label: "🎁 Vales & Fidelización" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-white bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido Dinámico de la Pestaña */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
            {activeTab === "pos" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Punto de Venta de Nueva Generación
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Cobra Rápido, sin Errores y en Cualquier Moneda
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Tus cajeros seleccionan los productos con un toque o escaneando el código de barras. El sistema calcula en milisegundos el total en dólares y en bolívares a la tasa oficial del BCV.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 font-bold">
                    <li className="flex items-center gap-2">✓ Calculadora inteligente de vueltos ($ y Bs).</li>
                    <li className="flex items-center gap-2">✓ Acepta Efectivo, Pago Móvil, Binance y Vales QR.</li>
                    <li className="flex items-center gap-2">✓ Cierre de turno y reporte Z automático al final del día.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-amber-400">Terminal POS Activo</span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">🟢 En Línea</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Hamburguesa Especial (x2)</span>
                      <span className="font-mono text-amber-400">$13.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Refresco Familiar 2L</span>
                      <span className="font-mono text-amber-400">$2.00</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Total a Cobrar</p>
                      <p className="text-xl font-black text-white font-mono">$15.00 USD</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Tasa Oficial BCV</p>
                      <p className="text-base font-black text-emerald-400 font-mono">Bs. 915,00</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tienda" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Comercio Electrónico Instantáneo
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Tu Tienda Virtual Abierta 24 Horas
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Tus clientes ya no te pedirán que les envíes fotos de los productos por WhatsApp una por una. Les envías tu enlace exclusivo <strong className="text-amber-400 font-mono">axisnitro.store/nitro/tunegocio</strong> y ven todo tu catálogo al instante.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 font-bold">
                    <li className="flex items-center gap-2">✓ Personalizada con tu logo, fotos y colores corporativos.</li>
                    <li className="flex items-center gap-2">✓ Carrito de compra optimizado para celulares.</li>
                    <li className="flex items-center gap-2">✓ El pedido llega listo con la lista completa a tu WhatsApp.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mx-auto text-2xl shadow-lg">
                    🛍️
                  </div>
                  <h4 className="font-black text-lg text-white">Tu Catálogo Digital Listo</h4>
                  <p className="text-xs text-slate-400">
                    Sube tus productos en 1 minuto o impórtalos directamente desde un archivo de Excel.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-xl border border-white/5 font-mono text-xs text-amber-300">
                    https://axisnitro.store/nitro/tu-comercio
                  </div>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Logística Geogestionada Directa
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Despachos a Domicilio con Cero Comisiones
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Deja de ceder el 25% o 30% del valor de tus platos o productos a aplicaciones de delivery intermediarias. Gestiona tus entregas con tus propios motorizados con cálculo de ruta y tarifa justa.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 font-bold">
                    <li className="flex items-center gap-2">✓ Control de radio de cobertura en kilómetros (ej: 5 km, 10 km).</li>
                    <li className="flex items-center gap-2">✓ Dirección y ubicación directa en Google Maps para el motorizado.</li>
                    <li className="flex items-center gap-2">✓ Confirmación de entrega transparente y en tiempo real.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black mx-auto text-2xl shadow-lg">
                    🛵
                  </div>
                  <h4 className="font-black text-lg text-white">0% Peaje a Intermediarios</h4>
                  <p className="text-xs text-slate-400">
                    Tus pedidos llegan directamente a tu cocina o mostrador para que tú tengas el control total de tu cliente.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "fidelizacion" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Fidelización & Tarjeta Digital
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Haz que tus Clientes Siempre Vuelvan
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Convierte a compradores ocasionales en clientes leales. Con el sistema de puntos y vales QR, tus clientes acumulan saldo cada vez que compran y lo canjean en su próxima visita.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 font-bold">
                    <li className="flex items-center gap-2">✓ Tarjeta digital de presentación NFC/QR para compartir en redes.</li>
                    <li className="flex items-center gap-2">✓ Vales prepagados o créditos con código QR único.</li>
                    <li className="flex items-center gap-2">✓ Promociones y paquetes combos con descuento automático.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-black mx-auto text-2xl shadow-lg">
                    🎁
                  </div>
                  <h4 className="font-black text-lg text-white">Recompensas Reales</h4>
                  <p className="text-xs text-slate-400">
                    Tus clientes tendrán una razón concreta para comprarte a ti y no a la competencia.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 via-violet-950/40 to-slate-950 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mx-auto text-2xl shadow-2xl">
            ⚡
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¿Listo para Digitalizar tu Comercio Hoy?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
            Contacta a tu promotora comercial autorizada para programar una demostración personalizada de 2 minutos sin ningún compromiso.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/?text=Hola,%20vi%20la%20presentación%20de%20Axis%20Nitro%20y%20quiero%20probar%20una%20demostración%20para%20mi%20negocio."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/30 transition-all no-underline flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Contactar a una Promotora Oficial
            </a>

            <a
              href="/#login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-700 transition-all no-underline"
            >
              Ingresar al Sistema
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Axis Nitro • KFS OS. Todos los derechos reservados.</p>
        <p className="text-[10px] text-slate-600 mt-1">Tecnología de Crecimiento Comercial y Punto de Venta Inteligente.</p>
      </footer>
    </div>
  );
}
