"use client";

import React, { useState } from "react";
import { Sparkles, Store, Send, Check, Copy, ExternalLink, RefreshCw, Smartphone } from "lucide-react";
import { useKFS } from "../../context/KFSContext";
import { createTenantSlug } from "../../lib/tenantManager";

interface InstantDemoGeneratorProps {
  promotoraId: string;
  promotoraName: string;
}

export const InstantDemoGenerator: React.FC<InstantDemoGeneratorProps> = ({
  promotoraId,
  promotoraName
}) => {
  const { setDb, showToast } = useKFS() as any;

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("comida");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleProductsByCategory: Record<string, Array<{ name: string; priceUSD: number; image: string }>> = {
    comida: [
      { name: "Hamburguesa Especial Doble Carne + Papas", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60" },
      { name: "Pizza Familiar 4 Sabores con Borde de Queso", priceUSD: 12.00, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60" },
      { name: "Refresco 2L Sabor Original", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=60" }
    ],
    bodegon: [
      { name: "Harina de Maíz Precocida 1kg", priceUSD: 1.20, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60" },
      { name: "Queso Amarillo Paisa Rebanado 500g", priceUSD: 4.80, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=60" },
      { name: "Café Gourmet Molido Tostado 250g", priceUSD: 2.50, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=60" }
    ],
    farmacia: [
      { name: "Acetaminofén 500mg (Caja 10 tabletas)", priceUSD: 1.50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60" },
      { name: "Alcohol Antiséptico 70% 500ml", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=60" },
      { name: "Vitamina C Efervescente 1000mg", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=60" }
    ],
    ropa: [
      { name: "Franela Oversize Premium 100% Algodón", priceUSD: 15.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60" },
      { name: "Gorra Urbana con Bordado 3D", priceUSD: 10.00, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=60" },
      { name: "Jeans Clásico Denim Azul Oscuro", priceUSD: 25.00, image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=60" }
    ]
  };

  const handleGenerateInstantDemo = () => {
    if (!businessName.trim()) {
      showToast("Escribe el nombre del negocio", "error");
      return;
    }

    setIsGenerating(true);

    const slug = createTenantSlug(businessName);
    const clientId = `demo_${Date.now()}`;
    const sampleList = sampleProductsByCategory[category] || sampleProductsByCategory.comida;

    // Crear cliente demo en base de datos reactiva
    const newDemoClient = {
      id: clientId,
      slug: slug,
      company: businessName.trim(),
      name: `Dueño de ${businessName.trim()}`,
      phone: ownerPhone.trim() || "+58 412 0000000",
      email: `${slug}@demo.axisnitro.store`,
      address: "Caracas, Venezuela",
      isDemo: true,
      promotoraId: promotoraId,
      plan: "pionero",
      kfsFeePercentage: 0.02,
      storeSettings: {
        themeColor: category === "comida" ? "#EF4444" : category === "farmacia" ? "#10B981" : category === "bodegon" ? "#F59E0B" : "#8B5CF6",
        profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
        coverPhotoUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60",
        bioText: `¡Bienvenido a ${businessName.trim()}! Esta es tu tienda virtual demo creada por tu promotora ${promotoraName}.`,
        typography: "font-sans",
        layoutType: "grid"
      }
    };

    // Crear productos de ejemplo
    const newDemoProducts = sampleList.map((item, idx) => ({
      id: `prod_demo_${Date.now()}_${idx}`,
      clientId: clientId,
      sellerId: clientId,
      tenantId: clientId,
      name: item.name,
      price: item.priceUSD,
      priceUSD: item.priceUSD,
      stock: 50,
      category: category.toUpperCase(),
      image: item.image,
      createdAt: new Date().toISOString()
    }));

    setDb((prev: any) => ({
      ...prev,
      clients: [newDemoClient, ...(prev.clients || [])],
      products: [...newDemoProducts, ...(prev.products || [])]
    }));

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSlug(slug);
      showToast(`🎉 ¡Tienda Demo para '${businessName}' creada en vivo!`, "success");
    }, 400);
  };

  const demoUrl = generatedSlug ? `https://axisnitro.store/nitro/${generatedSlug}` : "";

  const handleCopyLink = () => {
    if (!demoUrl) return;
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    showToast("Enlace copiado al portapapeles", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!demoUrl) return;
    const cleanPhone = ownerPhone.replace(/[^0-9]/g, "");
    const msg = `¡Hola! 👋 Te habla ${promotoraName} de Axis Nitro & KFS OS.\n\n` +
      `Acabo de crear una *Tienda Virtual Demo en Vivo* para tu negocio *${businessName}*:\n` +
      `👉 ${demoUrl}\n\n` +
      `Ábrelo en tu teléfono para ver cómo tus clientes pueden ver tu catálogo y hacerte pedidos directamente por WhatsApp. ¿Qué te parece?`;

    const waLink = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(waLink, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-violet-950 to-indigo-950 border border-violet-500/40 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
          <Sparkles size={24} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Arma de Venta #1
          </span>
          <h3 className="text-xl font-black text-white mt-0.5">
            Generador de "Demo en Vivo en 60 Segundos"
          </h3>
          <p className="text-xs text-slate-300">
            Sorprende al comerciante creándole su tienda con sus productos en su propia cara.
          </p>
        </div>
      </div>

      {/* Formulario Exprés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
            1. Nombre del Negocio
          </label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Ej: Bodegón Don José"
            className="w-full bg-slate-900/90 border border-violet-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
            2. Rubro Comercial
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-slate-900/90 border border-violet-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
          >
            <option value="comida">🍔 Comida Rápida / Restaurant</option>
            <option value="bodegon">🛒 Bodegón / Víveres</option>
            <option value="farmacia">💊 Farmacia / Salud</option>
            <option value="ropa">👕 Ropa / Calzado / Boutique</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-300 block mb-1">
            3. WhatsApp del Dueño (Opcional)
          </label>
          <input
            type="tel"
            value={ownerPhone}
            onChange={e => setOwnerPhone(e.target.value)}
            placeholder="Ej: +58 412 1234567"
            className="w-full bg-slate-900/90 border border-violet-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
      </div>

      {/* Botón de Generación */}
      <button
        onClick={handleGenerateInstantDemo}
        disabled={isGenerating || !businessName.trim()}
        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer border-none flex items-center justify-center gap-2 active:scale-95"
      >
        {isGenerating ? (
          <>
            <RefreshCw size={16} className="animate-spin" /> Montando Tienda Demo en Vivo...
          </>
        ) : (
          <>
            <Sparkles size={16} /> ¡Crear Tienda Demo para {businessName || "el Comercio"}!
          </>
        )}
      </button>

      {/* Resultado: Tarjeta de Enlace Generado */}
      {generatedSlug && (
        <div className="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
              ✓ Tienda Demo Lista para Probar
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {generatedSlug}
            </span>
          </div>

          <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-amber-300 truncate font-bold">
              {demoUrl}
            </p>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700 cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? "Copiado" : "Copiar"}
              </button>

              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold rounded-lg transition-colors no-underline flex items-center gap-1"
              >
                <ExternalLink size={13} /> Abrir Demo
              </a>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            <Send size={15} /> 📲 Enviar Demo al WhatsApp del Comerciante
          </button>
        </div>
      )}
    </div>
  );
};
