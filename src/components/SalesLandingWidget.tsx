"use client";

import React, { useState } from "react";
import { useKFS } from "../context/KFSContext";
import { KFS_BRAND } from "../config/brandConfig";
import { 
  Sparkles, Shield, Cpu, Store, Activity, Users, Zap, Award, Target, 
  HelpCircle, ArrowRight, DollarSign, Smartphone, Printer, Truck, 
  FileText, CheckCircle, Gift, BarChart2, MessageSquare, Layers, Percent, Clock
} from "lucide-react";
import { playPremiumChime, playCashDrawerSound } from "../lib/utils";
import { RegistrationModal } from "./RegistrationModal";

export function SalesLandingWidget() {
  const { showToast, formatUSD, formatEUR } = useKFS() as any;
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (type: string) => {
    setSelectedOffer(type);
    setIsModalOpen(true);
    if (type === "demo") {
      playPremiumChime();
    } else {
      playCashDrawerSound();
    }
  };

  return (
    <>
      <div className="bg-slate-950 text-white rounded-[2.5rem] border border-violet-900/50 p-6 md:p-10 shadow-[0_20px_60px_rgba(30,20,80,0.6)] space-y-12 animate-fade-in max-w-5xl mx-auto overflow-hidden relative">
        
        {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px] -z-10"></div>

      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-violet-900/40 pb-8">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-900/50 flex items-center gap-1.5 w-fit">
            <Sparkles size={11} className="text-amber-400 animate-pulse" /> Presentación Privada para Clientes
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
            {KFS_BRAND.productName} OS
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            El Sistema Operativo de Crecimiento Comercial (**CGOS**) definitivo. Conectamos POS físico, e-commerce, conciliación de pagos automática, proxy fiscal y logística en una sola consola.
          </p>
        </div>
        
        <div className="bg-violet-900/30 border border-violet-800/60 p-4 rounded-2xl flex items-center gap-3 self-stretch md:self-auto shrink-0 backdrop-blur-md">
          <Cpu className="text-violet-400 animate-pulse" size={28} />
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-black block">Plataforma</span>
            <span className="text-xs font-bold text-violet-300">Monopoly Network</span>
          </div>
        </div>
      </div>

      {/* Seccion 1: Por qué KFS OS es excesivamente lógico */}
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-violet-400">
            🧠 Lógica del Sistema: ¿Qué Dolor Resolvemos?
          </h2>
          <p className="text-xs text-slate-400 mt-1">El retail tradicional es ineficiente y disperso. KFS OS unifica todo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-violet-900/30 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 text-red-400 flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-white text-base">Cero Captures Falsos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              La conciliación manual de Pago Móvil es lenta y propensa a fraudes. Nuestro motor SMS lee y valida los datos bancarios en segundos para auto-aprobar compras.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-violet-900/30 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-violet-900/40 text-violet-400 flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-white text-base">Ahorro en Licencias Fiscales</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evita pagar miles de dólares en sistemas fiscales obsoletos. Nuestro proxy local se conecta directo a tu impresora fiscal SENIAT sin costos de intermediarios.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-violet-900/30 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-white text-base">Fidelización Circular</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Otorga **Axis Points** en cada compra física o digital. Los clientes vuelven más seguido para quemar sus puntos o transferirlos a otros usuarios en segundos.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 2: Los 8 Productos de la Suite KFS OS */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-violet-400">
            📦 Suite de 8 Productos Integrados
          </h2>
          <p className="text-xs text-slate-400 mt-1">Nuestras líneas comerciales listas para operar y comercializar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {[
            { 
              title: "Axis OS", 
              desc: "Libro mayor y núcleo administrativo central. Controla identidades, wallets multimoneda y comisiones globales.",
              icon: Cpu,
              color: "text-blue-400 bg-blue-950/40 border-blue-900/30"
            },
            { 
              title: "Axis Nitro POS", 
              desc: "Punto de venta táctil rápido para cajeros. Inyectado con Feature Flags según tu rubro (mesas, seriales, citas).",
              icon: Zap,
              color: "text-amber-400 bg-amber-950/40 border-amber-900/30"
            },
            { 
              title: "Nitro Market", 
              desc: "E-Commerce automático estilo PWA. Vitrina digital de carga ultrarrápida sincronizada al stock del POS.",
              icon: Store,
              color: "text-violet-400 bg-violet-950/40 border-violet-900/30"
            },
            { 
              title: "Sincro-Shield Fiscal", 
              desc: "Proxy de impresión local SENIAT para Venezuela. Cero licencias terceras caras, conexión transparente.",
              icon: Printer,
              color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"
            },
            { 
              title: "Flow Conciliator", 
              desc: "Motor autónomo de verificación de Pago Móvil por SMS. Aprueba pedidos online automáticamente.",
              icon: MessageSquare,
              color: "text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-900/30"
            },
            { 
              title: "Nitro Squad", 
              desc: "Control logístico de última milla. Asignación de riders, mapa interactivo LiveMap y comisiones de delivery.",
              icon: Truck,
              color: "text-orange-400 bg-orange-950/40 border-orange-900/30"
            },
            { 
              title: "Oracle AI", 
              desc: "Asistente inteligente Gemini Flash. Avisa sobre rotación lenta, stock bajo y optimiza copys de marketing.",
              icon: Sparkles,
              color: "text-pink-400 bg-pink-950/40 border-pink-900/30"
            },
            { 
              title: "Axis Reward Center", 
              desc: "Fidelización gamificada de clientes. Emisión de Axis Points y pasarela P2P integrada en billetera.",
              icon: Gift,
              color: "text-red-400 bg-red-950/40 border-red-900/30"
            }
          ].map((prod, idx) => {
            const Icon = prod.icon;
            return (
              <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 backdrop-blur-sm ${prod.color}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon size={20} />
                    <h4 className="font-bold text-white text-sm">{prod.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{prod.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección 3: Matriz de Roles (6 Actores) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-violet-400">
            👥 El Ecosistema en Acción: 6 Roles Clave
          </h2>
          <p className="text-xs text-slate-400 mt-1">Cómo interactúa cada tipo de usuario con la red unificada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              role: "🏢 A. Dueño (Operator)", 
              details: "Gestiona inventario, crea cajeros, liquida nóminas, customiza su tienda web y consulta a Oracle AI consejos financieros."
            },
            { 
              role: "💳 B. Cajero (Vendedor)", 
              details: "Opera el POS físico, escanea con WebCam o código de barras, recibe pagos mixtos y acumula comisiones personales de venta."
            },
            { 
              role: "🛒 C. Cliente (Comprador)", 
              details: "Compra online en Nitro Market, canjea Axis Points, sube comprobantes de pago y transfiere saldo P2P gratis."
            },
            { 
              role: "🏷️ D. Promotora (Growth)", 
              details: "Recluta nuevos comercios, registra candidatos desde el Hiring Board y gana comisiones de $32.50 USD por instalación."
            },
            { 
              role: "🛵 E. Repartidor (Rider)", 
              details: "Recibe despachos asignados, visualiza su GPS en LiveMap y completa entregas de última milla."
            },
            { 
              role: "👑 F. Arquitecto (Core)", 
              details: "Monitorea toda la red, valida recargas/retiros, ajusta tasas, responde tickets de soporte y difunde alertas Push."
            }
          ].map((r, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-violet-900/25 p-5 rounded-2xl space-y-2 hover:border-violet-700/50 transition-colors">
              <h4 className="font-bold text-white text-sm">{r.role}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{r.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 4: Tabla de Planes */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-violet-400">
            📊 Comparación de Planes de Licencia
          </h2>
          <p className="text-xs text-slate-400 mt-1">Métricas de licenciamiento tradicional antes de las ofertas especiales.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-violet-900/30 bg-slate-950">
          <table className="w-full text-xs text-left">
            <thead className="bg-violet-950/60 text-violet-300 uppercase text-[10px] font-black tracking-wider border-b border-violet-900/30">
              <tr>
                <th className="py-4 px-4">Módulo</th>
                <th className="py-4 px-4 text-emerald-400">🟢 Flow Velocity (3%)</th>
                <th className="py-4 px-4 text-blue-400">🔵 Flow Matrix AI (5% + $3/m)</th>
                <th className="py-4 px-4 text-fuchsia-400">🟣 Flow Monopoly OS (10% + $6/m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-900/20 text-slate-300 font-medium">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Axis POS Cajas</td>
                <td className="py-3 px-4">1 Caja Activa</td>
                <td className="py-3 px-4">Hasta 3 Cajas</td>
                <td className="py-3 px-4">Cajas Ilimitadas</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Vitrina Web</td>
                <td className="py-3 px-4">Catálogo Estándar</td>
                <td className="py-3 px-4">E-Commerce Premium</td>
                <td className="py-3 px-4">Multi-franquicia / Marca blanca</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Conciliación SMS</td>
                <td className="py-3 px-4">Manual</td>
                <td className="py-3 px-4">Automatizada</td>
                <td className="py-3 px-4">Autónoma completa + Webhooks</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Sincro-Shield SENIAT</td>
                <td className="py-3 px-4">No Disponible</td>
                <td className="py-3 px-4">Opcional ($)</td>
                <td className="py-3 px-4">Incluido Plug & Play</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Oracle AI Insights</td>
                <td className="py-3 px-4">No Disponible</td>
                <td className="py-3 px-4">Alertas de Stock y Copys</td>
                <td className="py-3 px-4">Recomendaciones Financieras y Precios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 5: Ofertas Especiales & CTAs */}
      <div className="bg-gradient-to-br from-violet-950/60 to-fuchsia-950/40 rounded-3xl border-2 border-violet-700/60 p-6 md:p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-lg">
          🔥 Oferta Pionera Limitada
        </div>

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
            🎁 Planes Especiales de Lanzamiento
          </h2>
          <p className="text-xs text-slate-300">
            Escoge entre probar el sistema completo sin riesgos o asegurar una tarifa de por vida exclusiva para fundadores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Oferta 1: Demo 1 Mes */}
          <div className="bg-slate-950/80 border border-violet-800/40 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-violet-600 transition-all">
            <div className="space-y-4">
              <div className="inline-block bg-violet-900/60 text-violet-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-violet-800">
                PROBAR SIN RIESGOS
              </div>
              <h3 className="text-xl font-bold text-white">Demo Monopoly OS - 1 Mes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prueba el sistema operativo empresarial completo (**Flow Monopoly OS**) durante un mes. Accede a cajas ilimitadas, conciliación de pagos SMS, telemetría AI de precios y proxy fiscal sin ataduras de permanencia.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-black text-white">$100 USD</span>
                <span className="text-xs text-slate-400 block mt-1">Pago único · Incluye todo lo de Monopoly OS</span>
              </div>
            </div>
            
            <button
              onClick={() => handleAction("demo")}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-black text-sm rounded-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform border-none shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              Comenzar con $100 Demo 1 Mes
            </button>
          </div>

          {/* Oferta 2: Tarifa Pionera */}
          <div className="bg-slate-950/80 border border-amber-800/40 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-amber-600 transition-all relative">
            <div className="space-y-4">
              <div className="inline-block bg-amber-900/60 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-800">
                TASA FUNDADOR DE POR VIDA
              </div>
              <h3 className="text-xl font-bold text-white">Tarifa Especial Fundadores</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Forma parte de los primeros **100 clientes** de la red y congela una tarifa transaccional hiperbaja para siempre. Conéctate al POS, lanza tu e-commerce y olvídate de comisiones de dos dígitos.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-black text-amber-400">2% + $30 USD</span>
                <span className="text-xs text-slate-400 block mt-1">De facturación + Pago único de instalación/activación</span>
              </div>
            </div>
            
            <button
              onClick={() => handleAction("pionero")}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm rounded-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform border-none shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              Comenzar con 2% + $30 de Instalación
            </button>
          </div>

        </div>

        {/* Action feedback modal/alert box */}
        {selectedOffer && !isModalOpen && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2 animate-fade-in">
            <p className="text-xs font-bold text-violet-300">
              {selectedOffer === "demo" 
                ? "🎁 Licencia de Prueba de Monopoly OS ($100)"
                : "⚡ Tarifa Pionera de Comisión Red (2% + $30)"}
            </p>
            <p className="text-[10px] text-slate-400">
              Para formalizar la carga fiscal de tu nodo comercial, coordina el envío de los fondos con tu promotora autorizada o recarga el balance desde la consola principal.
            </p>
          </div>
        )}
      </div>

      </div>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        offerType={selectedOffer as any} 
      />
    </>
  );
}
