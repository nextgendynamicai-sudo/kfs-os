"use client";

import React, { useState } from "react";
import { 
  Sparkles, Store, Check, Copy, ExternalLink, Trash2, ShieldCheck, 
  DollarSign, Percent, KeyRound, RefreshCw, Send, ArrowRight, X, 
  Zap, ShoppingBag, Plus, Eye, Smartphone, Printer, CheckCircle, AlertCircle,
  HelpCircle, Settings, UserCheck, Layers, Award
} from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { createTenantSlug } from "../lib/tenantManager";
import { syncSingleClient, syncSingleProduct } from "../lib/supabaseSync";

interface LiveDemoPitchManagerProps {
  onClose?: () => void;
}

export const LiveDemoPitchManager: React.FC<LiveDemoPitchManagerProps> = ({ onClose }) => {
  const { db, setDb, showToast, currentUser, formatUSD, formatEUR } = useKFS() as any;

  // Step 1: Demo Configuration State
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("bodegon");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [city, setCity] = useState("Caracas, Venezuela");
  const [themeColor, setThemeColor] = useState("#F59E0B");
  
  // Products inside current demo session
  const [demoProducts, setDemoProducts] = useState<Array<{ id: string; name: string; priceUSD: number; stock: number; image: string }>>([]);
  const [activeDemoClientId, setActiveDemoClientId] = useState<string | null>(null);
  const [activeDemoSlug, setActiveDemoSlug] = useState<string | null>(null);

  // New product inline addition
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");

  // Step 2: Commercial Activation Modal State (When client says YES)
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [commercialModel, setCommercialModel] = useState<"monthly_fixed" | "percentage_revenue" | "hybrid" | "free_promo">("monthly_fixed");
  const [monthlyFeeUSD, setMonthlyFeeUSD] = useState("100");
  const [revenueSharePercent, setRevenueSharePercent] = useState("2.0");
  const [hybridMonthlyUSD, setHybridMonthlyUSD] = useState("50");
  const [hybridPercent, setHybridPercent] = useState("1.0");
  const [assignedPromotoraId, setAssignedPromotoraId] = useState("");
  const [tempPassword, setTempPassword] = useState(`KFS-${Math.floor(1000 + Math.random() * 9000)}`);
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  // Step 3: Success Delivery Ticket State
  const [activatedClientData, setActivatedClientData] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Category Presets Catalog
  const categoryPresets: Record<string, { color: string; defaultProds: Array<{ name: string; priceUSD: number; image: string }> }> = {
    bodegon: {
      color: "#F59E0B",
      defaultProds: [
        { name: "Harina de Maíz Pan 1kg", priceUSD: 1.25, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60" },
        { name: "Queso Amarillo Paisa 500g", priceUSD: 4.80, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=60" },
        { name: "Café Molido Gourmet 250g", priceUSD: 2.50, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=60" },
        { name: "Aceite Vegetal 1L", priceUSD: 3.20, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=60" }
      ]
    },
    comida: {
      color: "#EF4444",
      defaultProds: [
        { name: "Hamburguesa Doble Carne con Queso Cheddar", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60" },
        { name: "Pizza Familiar 4 Sabores con Borde de Queso", priceUSD: 12.00, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60" },
        { name: "Papas Fritas Grandes con Tocineta", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=60" },
        { name: "Refresco 2L Sabor Original", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=60" }
      ]
    },
    farmacia: {
      color: "#10B981",
      defaultProds: [
        { name: "Acetaminofén 500mg (Caja 10 Tabletas)", priceUSD: 1.50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60" },
        { name: "Alcohol Antiséptico 70% 500ml", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=60" },
        { name: "Vitamina C Efervescente 1000mg", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=60" },
        { name: "Suero Oral Electrolitos 500ml", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=60" }
      ]
    },
    ropa: {
      color: "#8B5CF6",
      defaultProds: [
        { name: "Franela Oversize Premium 100% Algodón", priceUSD: 15.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60" },
        { name: "Jeans Clásico Denim Azul Oscuro", priceUSD: 25.00, image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=60" },
        { name: "Gorra Urbana con Bordado 3D", priceUSD: 10.00, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=60" }
      ]
    },
    ferreteria: {
      color: "#3B82F6",
      defaultProds: [
        { name: "Bombillo LED 12W Luz Blanca 6500K", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=60" },
        { name: "Cinta Teflón Profesional 3/4", priceUSD: 0.80, image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=60" },
        { name: "Destornillador Doble Punta Imantado", priceUSD: 3.00, image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=60" }
      ]
    }
  };

  // Handle Category Change
  const handleCategorySelect = (catKey: string) => {
    setCategory(catKey);
    const preset = categoryPresets[catKey];
    if (preset) {
      setThemeColor(preset.color);
      if (demoProducts.length === 0) {
        setDemoProducts(preset.defaultProds.map((p, idx) => ({
          id: `demo_prod_${Date.now()}_${idx}`,
          name: p.name,
          priceUSD: p.priceUSD,
          stock: 50,
          image: p.image
        })));
      }
    }
  };

  // 1. Create / Launch Live Demo
  const handleLaunchLiveDemo = () => {
    if (!businessName.trim()) {
      showToast("Ingresa el nombre del comercio a demostrar", "error");
      return;
    }

    const slug = createTenantSlug(businessName);
    const clientId = `demo_architect_${Date.now()}`;
    const initialProds = demoProducts.length > 0 
      ? demoProducts 
      : (categoryPresets[category]?.defaultProds || categoryPresets.bodegon.defaultProds).map((p, idx) => ({
          id: `demo_prod_${Date.now()}_${idx}`,
          name: p.name,
          priceUSD: p.priceUSD,
          stock: 50,
          image: p.image
        }));

    setDemoProducts(initialProds);

    const demoClientObj = {
      id: clientId,
      slug: slug,
      company: businessName.trim(),
      name: ownerName.trim() || `Dueño de ${businessName.trim()}`,
      phone: ownerPhone.trim() || "+58 412 0000000",
      email: ownerEmail.trim() || `${slug}@demo.kfsos.store`,
      address: city,
      isDemo: true,
      plan: "demo_pitch",
      kfsFeePercentage: 0.02,
      storeSettings: {
        themeColor: themeColor,
        profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
        coverPhotoUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60",
        bioText: `¡Bienvenido a ${businessName.trim()}! Esta es tu tienda virtual en vivo configurada por el Arquitecto Core KFS OS.`,
        typography: "font-sans",
        layoutType: "grid"
      },
      createdAt: new Date().toISOString()
    };

    const formattedProducts = initialProds.map(p => ({
      id: p.id,
      clientId: clientId,
      sellerId: clientId,
      tenantId: clientId,
      name: p.name,
      price: p.priceUSD,
      priceUSD: p.priceUSD,
      stock: p.stock || 50,
      category: category.toUpperCase(),
      image: p.image,
      createdAt: new Date().toISOString()
    }));

    setDb((prev: any) => ({
      ...prev,
      clients: [demoClientObj, ...(prev.clients || []).filter((c: any) => c.id !== clientId)],
      products: [...formattedProducts, ...(prev.products || []).filter((p: any) => p.clientId !== clientId)]
    }));

    setActiveDemoClientId(clientId);
    setActiveDemoSlug(slug);

    showToast(`⚡ ¡Entorno de Demostración para "${businessName}" montado con éxito!`, "success");
  };

  // Add Product to Demo in real time
  const handleAddCustomDemoProduct = () => {
    if (!newProdName.trim() || !newProdPrice) {
      showToast("Indica el nombre y precio del producto", "error");
      return;
    }
    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Precio inválido", "error");
      return;
    }

    const newProd = {
      id: `demo_prod_${Date.now()}`,
      name: newProdName.trim(),
      priceUSD: priceNum,
      stock: 50,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60"
    };

    const updated = [...demoProducts, newProd];
    setDemoProducts(updated);
    setNewProdName("");
    setNewProdPrice("");

    if (activeDemoClientId) {
      setDb((prev: any) => ({
        ...prev,
        products: [
          {
            id: newProd.id,
            clientId: activeDemoClientId,
            sellerId: activeDemoClientId,
            tenantId: activeDemoClientId,
            name: newProd.name,
            price: newProd.priceUSD,
            priceUSD: newProd.priceUSD,
            stock: 50,
            category: category.toUpperCase(),
            image: newProd.image,
            createdAt: new Date().toISOString()
          },
          ...(prev.products || [])
        ]
      }));
    }

    showToast(`Producto '${newProd.name}' agregado a la demostración en vivo`, "success");
  };

  // Remove single product from demo
  const handleRemoveDemoProduct = (prodId: string) => {
    setDemoProducts(prev => prev.filter(p => p.id !== prodId));
    if (activeDemoClientId) {
      setDb((prev: any) => ({
        ...prev,
        products: (prev.products || []).filter((p: any) => p.id !== prodId)
      }));
    }
  };

  // 2. DISCARD / DELETE DEMO (When sale did not happen)
  const handleDiscardDemo = () => {
    if (!activeDemoClientId) {
      // Just reset local fields
      setBusinessName("");
      setOwnerName("");
      setOwnerPhone("");
      setDemoProducts([]);
      showToast("Formulario de demostración reiniciado.", "success");
      return;
    }

    if (confirm(`¿Descartar y eliminar toda la configuración de demo para "${businessName}"? Esto no afectará a ningún comercio real.`)) {
      setDb((prev: any) => ({
        ...prev,
        clients: (prev.clients || []).filter((c: any) => c.id !== activeDemoClientId),
        products: (prev.products || []).filter((p: any) => p.clientId !== activeDemoClientId && p.tenantId !== activeDemoClientId)
      }));

      setActiveDemoClientId(null);
      setActiveDemoSlug(null);
      setBusinessName("");
      setOwnerName("");
      setOwnerPhone("");
      setDemoProducts([]);
      showToast("🗑️ Demostración eliminada y limpiada del sistema con total seguridad.", "success");
    }
  };

  // 3. ACTIVATE REAL BUSINESS (When client says YES)
  const handleActivateRealBusiness = async () => {
    if (!businessName.trim() || !ownerPhone.trim()) {
      showToast("Se requiere el nombre del negocio y el teléfono del dueño para activar la cuenta", "error");
      return;
    }

    const finalClientId = `client_${Date.now()}`;
    const finalSlug = activeDemoSlug || createTenantSlug(businessName);
    
    // Construct subscription object based on commercial model chosen
    let subscriptionData: any = {
      plan_type: commercialModel,
      contract_start_date: new Date().toISOString(),
      status: "active",
      payment_status: "settled",
      is_trial_active: true, // 7-day guarantee
      created_at: new Date().toISOString()
    };

    let feePercentage = 0;

    if (commercialModel === "monthly_fixed") {
      subscriptionData.monthly_fee_usd = parseFloat(monthlyFeeUSD) || 100;
      subscriptionData.billing_cycle = "monthly_1_to_5";
      subscriptionData.fee_model = "FIXED_MONTHLY";
      feePercentage = 0;
    } else if (commercialModel === "percentage_revenue") {
      const pct = (parseFloat(revenueSharePercent) || 2.0) / 100;
      subscriptionData.revenue_share_percentage = pct;
      subscriptionData.fee_model = "REVENUE_SHARE";
      feePercentage = pct;
    } else if (commercialModel === "hybrid") {
      const pct = (parseFloat(hybridPercent) || 1.0) / 100;
      subscriptionData.monthly_fee_usd = parseFloat(hybridMonthlyUSD) || 50;
      subscriptionData.revenue_share_percentage = pct;
      subscriptionData.fee_model = "HYBRID";
      feePercentage = pct;
    } else {
      subscriptionData.monthly_fee_usd = 0;
      subscriptionData.fee_model = "FREE_PROMO";
      feePercentage = 0;
    }

    const realClientObj = {
      id: finalClientId,
      slug: finalSlug,
      company: businessName.trim(),
      name: ownerName.trim() || `Dueño de ${businessName.trim()}`,
      phone: ownerPhone.trim(),
      email: ownerEmail.trim() || `${finalSlug}@kfsos.store`,
      address: city,
      isDemo: false, // Activated as REAL
      promotoraId: assignedPromotoraId || "promotora_central",
      plan: commercialModel,
      kfsFeePercentage: feePercentage,
      subscription: subscriptionData,
      tempPassword: tempPassword,
      mustChangePassword: requirePasswordChange,
      requirePasswordChangeOnFirstLogin: requirePasswordChange,
      storeSettings: {
        themeColor: themeColor,
        profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
        coverPhotoUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60",
        bioText: `¡Bienvenido a ${businessName.trim()}! Tu tienda virtual y punto de venta oficial KFS OS.`,
        typography: "font-sans",
        layoutType: "grid"
      },
      createdAt: new Date().toISOString()
    };

    // Products to persist
    const finalProducts = (demoProducts.length > 0 ? demoProducts : categoryPresets[category]?.defaultProds || []).map((p, idx) => ({
      id: `prod_${finalClientId}_${idx}`,
      clientId: finalClientId,
      sellerId: finalClientId,
      tenantId: finalClientId,
      name: p.name,
      price: p.priceUSD,
      priceUSD: p.priceUSD,
      stock: (p as any).stock || 50,
      category: category.toUpperCase(),
      image: p.image,
      createdAt: new Date().toISOString()
    }));

    // Update DB & Remove old demo placeholder
    setDb((prev: any) => ({
      ...prev,
      clients: [
        realClientObj,
        ...(prev.clients || []).filter((c: any) => c.id !== activeDemoClientId && c.id !== finalClientId)
      ],
      products: [
        ...finalProducts,
        ...(prev.products || []).filter((p: any) => p.clientId !== activeDemoClientId)
      ]
    }));

    // Sync to Supabase in background
    try {
      syncSingleClient(realClientObj);
      finalProducts.forEach(prod => syncSingleProduct(prod));
    } catch (e) {
      console.warn("Could not sync to cloud immediately, local storage preserved.", e);
    }

    setActivatedClientData({
      ...realClientObj,
      productCount: finalProducts.length
    });

    setShowActivationModal(false);
    showToast(`🎉 ¡NEGOCIO ACTIVADO CON ÉXITO! Cliente oficial listo para entrega.`, "success");
  };

  const demoStoreUrl = activeDemoSlug ? `https://axisnitro.store/nitro/${activeDemoSlug}` : "";

  return (
    <div className="bg-slate-950 border border-violet-500/30 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-violet-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                Módulo de Cierre Comercial
              </span>
              {activeDemoClientId && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Demo Activa
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Modo Demostración en Vivo & Activación de Negocio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configura y enseña el sistema frente al cliente. Si compra, actívalo en 1 clic; si no, descártalo sin ensuciar la base de datos.
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* TICKET DE BIENVENIDA / ENTREGA TRAS ACTIVACIÓN EXITOSA */}
      {activatedClientData ? (
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-2xl relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <CheckCircle size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                ¡Venta Exitosa y Cuenta Creada!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ficha de Entrega para {activatedClientData.company}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-5 rounded-2xl border border-emerald-500/30 font-mono text-xs">
            <div className="space-y-2">
              <p><span className="text-slate-400">Comercio:</span> <strong className="text-white">{activatedClientData.company}</strong></p>
              <p><span className="text-slate-400">Dueño:</span> <strong className="text-white">{activatedClientData.name}</strong></p>
              <p><span className="text-slate-400">WhatsApp / Usuario:</span> <strong className="text-amber-400 font-black">{activatedClientData.phone}</strong></p>
              <p><span className="text-slate-400">Contraseña Provisoria:</span> <strong className="text-emerald-400 font-black bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/40">{activatedClientData.tempPassword}</strong></p>
            </div>
            <div className="space-y-2">
              <p><span className="text-slate-400">Modelo Comercial:</span> <strong className="text-white uppercase">{activatedClientData.plan}</strong></p>
              <p><span className="text-slate-400">Cambio de Clave en 1er Inicio:</span> <strong className="text-amber-400">OBLIGATORIO (Seguridad Activa)</strong></p>
              <p><span className="text-slate-400">Productos Iniciales:</span> <strong className="text-white">{activatedClientData.productCount} artículos</strong></p>
              <p><span className="text-slate-400">Enlace de la Tienda:</span> <strong className="text-cyan-400 truncate block">https://axisnitro.store/nitro/{activatedClientData.slug}</strong></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                const text = `🎉 ¡Bienvenido a KFS OS & Axis Nitro!\n\n` +
                  `Tu negocio *${activatedClientData.company}* ya está 100% activo en el sistema.\n\n` +
                  `🔑 *Credenciales de Primer Inicio:*\n` +
                  `• Enlace de Acceso: https://axisnitro.store\n` +
                  `• Usuario (Teléfono): ${activatedClientData.phone}\n` +
                  `• Contraseña Temporal: ${activatedClientData.tempPassword}\n\n` +
                  `*Nota de Seguridad:* Al ingresar por primera vez, el sistema te solicitará cambiar tu contraseña por una clave privada y personal.\n\n` +
                  `🛍️ *Tu Tienda Virtual:* https://axisnitro.store/nitro/${activatedClientData.slug}`;
                
                const cleanPhone = activatedClientData.phone.replace(/[^0-9]/g, "");
                const url = cleanPhone.length >= 10 
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
                  : `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, "_blank");
              }}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <Send size={16} /> 📲 Enviar Credenciales por WhatsApp al Cliente
            </button>

            <button
              onClick={() => {
                setActivatedClientData(null);
                setBusinessName("");
                setOwnerName("");
                setOwnerPhone("");
                setDemoProducts([]);
                setActiveDemoClientId(null);
                setActiveDemoSlug(null);
              }}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition-colors cursor-pointer border border-slate-700"
            >
              Configurar Otra Demostración
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* PASO 1: FORMULARIO DE DEMO EN VIVO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            {/* Columna Izquierda: Datos del Prospecto */}
            <div className="space-y-4 lg:col-span-2 bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Store size={18} /> 1. Datos del Comercio Prospecto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Nombre del Comercio *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="Ej: Bodegón Don Pepe, Farmacia Ávila, Burger King"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Rubro / Categoría *</label>
                  <select
                    value={category}
                    onChange={e => handleCategorySelect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
                  >
                    <option value="bodegon">🛒 Bodegón / Supermercado / Víveres</option>
                    <option value="comida">🍔 Comida Rápida / Restaurante / Panadería</option>
                    <option value="farmacia">💊 Farmacia / Salud / Cuidado Personal</option>
                    <option value="ropa">👕 Ropa / Calzado / Boutique</option>
                    <option value="ferreteria">🔧 Ferretería / Iluminación / Hogar</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Nombre del Dueño / Gerente</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="Ej: José Rodríguez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">WhatsApp del Dueño (Para entrega)</label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    placeholder="Ej: +58 412 1234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Selector de Color de Marca */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-300 block mb-2">Color de Marca para su Tienda Virtual</label>
                <div className="flex items-center gap-3">
                  {[
                    { hex: "#F59E0B", label: "Ámbar Dorado" },
                    { hex: "#EF4444", label: "Rojo Carmesí" },
                    { hex: "#10B981", label: "Verde Esmeralda" },
                    { hex: "#8B5CF6", label: "Morado Eléctrico" },
                    { hex: "#3B82F6", label: "Azul Cyber" },
                    { hex: "#EC4899", label: "Rosa Vibrante" }
                  ].map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setThemeColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer border-2 ${themeColor === c.hex ? "scale-125 border-white shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Botón de Montar Demo */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleLaunchLiveDemo}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer border-none flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles size={16} /> Montar Entorno Demo para {businessName || "el Cliente"}
                </button>

                {activeDemoClientId && (
                  <button
                    type="button"
                    onClick={handleDiscardDemo}
                    className="px-4 py-3.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white font-bold text-xs rounded-2xl border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Descartar y borrar demo sin guardar"
                  >
                    <Trash2 size={16} /> Descartar
                  </button>
                )}
              </div>
            </div>

            {/* Columna Derecha: Catálogo Interactivo en Vivo */}
            <div className="space-y-4 bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ShoppingBag size={18} /> 2. Catálogo en Vivo ({demoProducts.length})
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Modificable en caliente</span>
                </div>

                {/* Lista de Productos Demo */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {demoProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                        <span className="font-bold text-slate-200 truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-black text-amber-400">${p.priceUSD.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDemoProduct(p.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agregar producto en vivo mientras el cliente mira */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold">Añadir producto real del cliente:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre del producto"
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="$ USD"
                      value={newProdPrice}
                      onChange={e => setNewProdPrice(e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDemoProduct}
                      className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón de Abrir Demo en Vivo */}
              {activeDemoSlug && (
                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={demoStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 no-underline shadow-lg shadow-violet-600/30"
                  >
                    <ExternalLink size={15} /> Abrir Tienda Demo en Teléfono
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* PASO 2: BOTÓN GIGANTE DE CIERRE COMERCIAL / ACTIVAR NEGOCIO */}
          {activeDemoClientId && (
            <div className="bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-indigo-900/60 border-2 border-amber-400/40 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 shadow-2xl animate-fade-in">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Cierre de Venta Instantáneo
                </span>
                <h3 className="text-xl font-black text-white">
                  ¿El cliente dijo que SÍ? Activa su negocio oficial ahora mismo
                </h3>
                <p className="text-xs text-slate-300">
                  Convierte la demostración en una cuenta comercial activa con su modelo de cobro personalizado.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleDiscardDemo}
                  className="px-4 py-3 bg-slate-900 hover:bg-red-900/50 text-slate-400 hover:text-red-300 font-bold text-xs rounded-2xl border border-slate-700 transition-colors cursor-pointer"
                >
                  No compró (Descartar)
                </button>

                <button
                  type="button"
                  onClick={() => setShowActivationModal(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-none flex items-center gap-2"
                >
                  <Award size={18} /> ¡Activar Negocio Oficial!
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DE ACTIVACIÓN COMERCIAL (DEFINIR CONDICIONES DE PAGO) */}
      {showActivationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-violet-500/40 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Activación de Cuenta Comercial
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Condiciones Comerciales para "{businessName}"
                </h3>
              </div>
              <button 
                onClick={() => setShowActivationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Selector de Modelo Comercial */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                Selecciona el Modelo de Cobro:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opción 1: Cuota Fija Mensual */}
                <div 
                  onClick={() => setCommercialModel("monthly_fixed")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${commercialModel === "monthly_fixed" ? "bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={18} className="text-amber-400" />
                    <h4 className="font-black text-sm text-white">Cuota Fija Mensual</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cobro fijo recurrente al mes. Bloqueo automático tras día 5 si no concilia.
                  </p>
                </div>

                {/* Opción 2: % de Facturación */}
                <div 
                  onClick={() => setCommercialModel("percentage_revenue")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${commercialModel === "percentage_revenue" ? "bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Percent size={18} className="text-emerald-400" />
                    <h4 className="font-black text-sm text-white">% de Facturación</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Comisión porcentual sobre cada venta procesada en la plataforma.
                  </p>
                </div>

                {/* Opción 3: Modelo Híbrido */}
                <div 
                  onClick={() => setCommercialModel("hybrid")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${commercialModel === "hybrid" ? "bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={18} className="text-purple-400" />
                    <h4 className="font-black text-sm text-white">Modelo Híbrido</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cuota mensual reducida + pequeño porcentaje por venta.
                  </p>
                </div>

                {/* Opción 4: Plan Gratuito / Pionero */}
                <div 
                  onClick={() => setCommercialModel("free_promo")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${commercialModel === "free_promo" ? "bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={18} className="text-cyan-400" />
                    <h4 className="font-black text-sm text-white">Plan Promocional ($0)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Comisión cero y sin cuota para convenios especiales o pruebas piloto.
                  </p>
                </div>
              </div>
            </div>

            {/* Parámetros Específicos por Modelo */}
            {commercialModel === "monthly_fixed" && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Cuota Mensual Acordada (USD):</label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-400">$</span>
                  <input
                    type="number"
                    value={monthlyFeeUSD}
                    onChange={e => setMonthlyFeeUSD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold font-mono focus:outline-none focus:border-amber-400"
                    placeholder="100"
                  />
                  <span className="text-xs text-slate-400 font-mono shrink-0">USD / mes</span>
                </div>
              </div>
            )}

            {commercialModel === "percentage_revenue" && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Porcentaje de Facturación Acordado (%):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={revenueSharePercent}
                    onChange={e => setRevenueSharePercent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold font-mono focus:outline-none focus:border-emerald-400"
                    placeholder="2.0"
                  />
                  <span className="text-xs text-slate-400 font-mono shrink-0">% de cada venta</span>
                </div>
              </div>
            )}

            {commercialModel === "hybrid" && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Cuota Base ($ USD):</label>
                  <input
                    type="number"
                    value={hybridMonthlyUSD}
                    onChange={e => setHybridMonthlyUSD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Porcentaje (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hybridPercent}
                    onChange={e => setHybridPercent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                    placeholder="1.0"
                  />
                </div>
              </div>
            )}

            {/* Asignación de Promotora & Seguridad de Contraseña */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Promotora Responsable de la Venta (Comisión de Setup):
                </label>
                <select
                  value={assignedPromotoraId}
                  onChange={e => setAssignedPromotoraId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
                >
                  <option value="">🏢 Kreatek Central (Venta Directa Arquitecto)</option>
                  {(db.promotoras || []).map((p: any) => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name || p.phone} ({p.zone || "Agente Autorizado"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Protocolo de Cambio de Contraseña en Primer Inicio */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                  <KeyRound size={16} /> Protocolo de Seguridad en Entrega:
                </div>
                
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-white">Contraseña Provisoria:</p>
                    <p className="font-mono text-amber-300 text-sm font-black">{tempPassword}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTempPassword(`KFS-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    Regenerar
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={requirePasswordChange}
                    onChange={e => setRequirePasswordChange(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Obligar al cliente a cambiar su contraseña en su primer inicio de sesión</span>
                </label>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowActivationModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleActivateRealBusiness}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer border-none flex items-center gap-2"
              >
                <CheckCircle size={16} /> Confirmar & Activar Negocio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
