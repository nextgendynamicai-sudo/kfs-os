"use client";

import React, { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, Copy, Check, Sparkles, MessageCircle, HelpCircle } from "lucide-react";

interface ObjectionItem {
  question: string;
  shortAnswer: string;
  deepPitch: string;
  tag: string;
}

export const ObjectionKillerGuide: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const objections: ObjectionItem[] = [
    {
      tag: "⚡ Conectividad",
      question: "¿Y si se va la luz o se cae el internet en mi local?",
      shortAnswer: "El sistema opera 100% Offline-First sin internet y sincroniza solo cuando regresa la señal.",
      deepPitch: "Nuestro POS está programado con arquitectura Offline-First. Tu cajero puede seguir pasando productos, calculando montos en dólares o bolívares e imprimiendo recibos aunque no haya señal en toda la zona. En cuanto el teléfono o tablet detecta datos o Wi-Fi, todas las ventas se suben solas a la nube sin perder un solo centavo."
    },
    {
      tag: "👥 Personal",
      question: "¿Mis empleados o cajeros sabrán usarlo? No saben de computación.",
      shortAnswer: "Es tan fácil e intuitivo como enviar un mensaje por WhatsApp. Se aprende en 5 minutos.",
      deepPitch: "Diseñamos la pantalla para que cualquier persona, sin importar su edad o experiencia tecnológica, pueda cobrar con solo tocar la foto del producto o apuntar la cámara al código de barras. No requiere cursos complicados ni configuraciones técnicas."
    },
    {
      tag: "🇻🇪 Moneda & BCV",
      question: "¿Cómo manejo el cobro en bolívares y dólares al mismo tiempo?",
      shortAnswer: "El sistema actualiza la tasa oficial del BCV del día en caliente y calcula los vueltos exactos.",
      deepPitch: "Tus productos están protegidos en dólares para que nunca pierdas por devaluación. Al momento de cobrar, el POS muestra en grande el total en USD y en Bolívares a la tasa del Banco Central de Venezuela. Además, nuestra calculadora de vuelto mixto le dice al cajero cuánto entregar en billetes y cuánto en Pago Móvil en 1 segundo."
    },
    {
      tag: "💻 Equipamiento",
      question: "¿Tengo que comprar computadoras caras o puntos de venta nuevos?",
      shortAnswer: "No. Funciona en cualquier teléfono celular Android/iPhone, tablet o computadora que ya tengas.",
      deepPitch: "No tienes que gastar $300 en equipos caros. Puedes descargar la aplicación directamente en el celular del cajero, en una tablet económica o abrirla en el navegador de cualquier laptop. Si tienes lector de código de barras o impresora térmica Bluetooth, se conecta automáticamente."
    },
    {
      tag: "🛵 Delivery",
      question: "¿Tengo que pagarle 25% o 30% a aplicaciones de delivery tradicionales?",
      shortAnswer: "Cero comisiones a terceros. Tus clientes te piden directo y despachas con tus propios motorizados.",
      deepPitch: "Con tu tienda virtual propia `/nitro/[nombre]`, tus clientes ven tus fotos, hacen el pedido y te llega directo a tu WhatsApp o panel con la dirección de entrega calculada por GPS. Despachas con tu propio personal de confianza y te quedas con el 100% de la ganancia."
    },
    {
      tag: "🔒 Seguridad",
      question: "¿Mis datos, clientes y dinero están seguros? ¿Se me puede borrar la información?",
      shortAnswer: "Persistencia blindada con respaldo dual en la nube (Supabase) y almacenamiento en tu dispositivo.",
      deepPitch: "Tu información tiene respaldo redundante encriptado de nivel bancario. Incluso si se formatea tu teléfono o cambias de computadora, al iniciar sesión con tu clave recuperas todo tu inventario, historial de ventas y clientes al instante."
    }
  ];

  const handleCopyPitch = (pitch: string, idx: number) => {
    navigator.clipboard.writeText(pitch);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-violet-500/40 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black shadow-lg">
          <ShieldAlert size={24} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            Arma de Venta #3
          </span>
          <h3 className="text-xl font-black text-white mt-0.5">
            Guía "Mata-Objeciones" en Vivo
          </h3>
          <p className="text-xs text-slate-400">
            Respuestas contundentes a las dudas más comunes de los dueños de negocios.
          </p>
        </div>
      </div>

      {/* Acordeón de Objeciones */}
      <div className="space-y-3">
        {objections.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-slate-950/90 border-violet-500/60 shadow-lg shadow-violet-950/40"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer border-none bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-violet-900/40 text-violet-300 border border-violet-800/40 shrink-0">
                    {item.tag}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {item.question}
                  </h4>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-3 border-t border-white/5 animate-fade-in text-xs">
                  {/* Respuesta Rápida */}
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 font-bold flex items-start gap-2">
                    <span className="text-emerald-400 text-sm">💡</span>
                    <span>{item.shortAnswer}</span>
                  </div>

                  {/* Pitch Completo */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed space-y-2">
                    <p className="font-medium">{item.deepPitch}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCopyPitch(item.deepPitch, idx)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
                      >
                        {copiedIndex === idx ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copiedIndex === idx ? "¡Texto Copiado!" : "Copiar Argumento"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
