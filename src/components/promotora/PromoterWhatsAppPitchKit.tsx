"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Copy, Check, Sparkles, BookOpen, Smartphone, ExternalLink } from "lucide-react";

interface PromoterWhatsAppPitchKitProps {
  promotoraName: string;
  promotoraId: string;
}

interface ScriptItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  content: string;
}

export const PromoterWhatsAppPitchKit: React.FC<PromoterWhatsAppPitchKitProps> = ({
  promotoraName,
  promotoraId
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetPhone, setTargetPhone] = useState("");

  const scripts: ScriptItem[] = [
    {
      id: "full_product_explanation",
      title: "1. Explicación Completa y Detallada del Producto (Pitch Maestro)",
      badge: "⭐ Pitch Maestro",
      description: "Explica a fondo qué es Axis Nitro / KFS OS, todos sus módulos y beneficios de forma ordenada y profesional.",
      content: `Hola 👋 Estimado(a), te saluda *${promotoraName}*, especialista comercial de *Axis Nitro & KFS OS*.

Te escribo porque ayudamos a comercios y negocios a *aumentar sus ventas, digitalizar su catálogo y eliminar el desorden en caja* con una sola plataforma todo-en-uno:

🚀 *¿QUÉ INCLUYE TU PLATAFORMA COMERCIAL?*

1️⃣ *PUNTO DE VENTA (POS) INTELIGENTE:*
• Funciona en cualquier teléfono celular, tablet o laptop.
• *Opera 100% Offline:* Si se va el internet o la luz en tu zona, sigues cobrando sin interrupciones.
• *Conversión en Caliente:* Calcula en automático el total en Dólares ($) y Bolívares a la *Tasa Oficial BCV* del día.
• *Calculadora de Vueltos Mixtos:* Le dice al cajero en 1 segundo cuánto entregar en billetes y cuánto en Pago Móvil.

2️⃣ *TIENDA VIRTUAL PROPIA (/nitro/[tunegocio]):*
• Tu propio catálogo digital público con fotos, precios y stock en tiempo real.
• Tus clientes eligen sus productos y te compran directo por WhatsApp o Pago Móvil.
• Personalizada con tu logotipo, tus colores y tu marca.

3️⃣ *SISTEMA DE DELIVERY DIRECTO:*
• *0% de comisiones a aplicaciones de terceros.*
• Despachas con tus propios motorizados con cálculo de ruta por Google Maps.

4️⃣ *VALES QR Y FIDELIZACIÓN DE CLIENTES:*
• Emite vales digitales con código QR para clientes habituales o crédito controlado.
• Sistema de Puntos que premia a los compradores recurrentes para que siempre vuelvan a tu tienda.

5️⃣ *TARJETA DE PRESENTACIÓN DIGITAL NFC:*
• Tu enlace inteligente con acceso directo a tu WhatsApp, tu tienda, tu ubicación en Maps y datos de Pago Móvil listos para copiar.

🌐 *Puedes ver todos los beneficios detallados en nuestra presentación interactiva:*
👉 https://axisnitro.store/beneficios

¿A qué hora te quedaría cómodo que te haga una demostración de 2 minutos sin ningún compromiso?`
    },
    {
      id: "cold_outreach",
      title: "2. Mensaje de Prospección Inicial (Primer Contacto Rápido)",
      badge: "💬 Prospección",
      description: "Mensaje corto de alto impacto para captar la atención de un dueño de negocio en 10 segundos.",
      content: `¡Hola! 👋 Mucho gusto. Te saluda *${promotoraName}* de *Axis Nitro / KFS OS*.

Estuve viendo tu negocio y quiero mostrarte cómo puedes tener tu *Punto de Venta con Tasa BCV automática, Tienda Virtual propia y control de inventario* directamente desde tu celular, sin necesidad de comprar equipos caros.

💡 Funciona incluso si se cae el internet y te permite recibir pedidos a domicilio con *0% de comisiones*.

¿Te gustaría que te envíe un enlace demo de 1 minuto para que veas cómo luciría tu tienda?`
    },
    {
      id: "follow_up",
      title: "3. Mensaje de Seguimiento Post-Reunión o Visita",
      badge: "🔄 Seguimiento",
      description: "Para enviar justo después de visitar el local o tener una llamada con el comerciante.",
      content: `¡Hola! 👋 Fue un verdadero gusto conversar contigo hoy sobre *Axis Nitro / KFS OS*.

Te comparto el enlace de la *Presentación de Beneficios* para que la revises con calma:
👉 https://axisnitro.store/beneficios

Recuerda los 3 puntos clave que vimos:
✅ Cobras en Dólares y Bolívares con Tasa BCV al instante y calculadora de vuelto.
✅ Sigues vendiendo sin internet gracias al modo Offline.
✅ Tu propia tienda virtual lista para compartir por WhatsApp e Instagram.

Si deseas que activemos tu tienda hoy mismo, solo avísame y la dejamos lista en 5 minutos. ¡Quedo a tu orden!`
    },
    {
      id: "demo_invite",
      title: "4. Invitación Directa a Probar la Tienda Demo",
      badge: "⚡ Invitación Demo",
      description: "Ideal para mandar junto con el enlace demo creado en el Generador de Demos.",
      content: `¡Hola! 👋 Te habla *${promotoraName}*.

Te tengo una sorpresa: me tomé la libertad de crear una *Tienda Demo en Vivo* para tu negocio para que veas exactamente cómo tus clientes pueden ver tus productos y comprarte desde su celular:

👉 Puedes probarla aquí: https://axisnitro.store/beneficios

Ábrelo desde tu teléfono y dime qué tal te parece la rapidez. ¿Te gustaría que la activemos con tus productos reales?`
    }
  ];

  const handleCopyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (text: string) => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/40 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Arma de Venta #4 (Detallada y Perfecta)
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Kit de Prospección por WhatsApp & Guiones Maestros
            </h3>
            <p className="text-xs text-slate-400">
              Mensajes redactados por expertos en ventas listos para enviar en 1 toque.
            </p>
          </div>
        </div>

        {/* Input Opcional de Teléfono para Envío Directo */}
        <div className="w-full sm:w-64">
          <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
            Enviar directo a este WhatsApp:
          </label>
          <input
            type="tel"
            value={targetPhone}
            onChange={(e) => setTargetPhone(e.target.value)}
            placeholder="+58 412 1234567"
            className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>
      </div>

      {/* Lista de Guiones de Venta */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-2.5">
              <div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  {script.badge}
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  {script.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {script.description}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => handleCopyScript(script.content, script.id)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-colors border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copiedId === script.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copiedId === script.id ? "¡Copiado!" : "Copiar Texto"}
                </button>

                <button
                  onClick={() => handleSendWhatsApp(script.content)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-600/30 cursor-pointer border-none flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Send size={14} /> Enviar por WhatsApp
                </button>
              </div>
            </div>

            {/* Vista Previa del Contenido */}
            <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3.5 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {script.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
