"use client";

import React, { useState, useMemo } from "react";
import { useKFS } from "../context/KFSContext";
import { Tenant, TenantBranding, TenantSettings } from "../types/tenant";
import { 
  Building2, 
  Store, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Settings, 
  Palette, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Globe, 
  Sparkles, 
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Gift,
  CreditCard
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ComboBuilderModal } from "./ComboBuilderModal";

export function MultiTenantManager({ isArchitect = false }: { isArchitect?: boolean }) {
  const kfs = useKFS() as any;
  const { 
    db, 
    currentUser, 
    allTenants = [], 
    activeTenant, 
    switchTenant, 
    updateStoreSettings, 
    showToast,
    formatUSD 
  } = kfs;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "settings" | "branding">("list");
  const [showQrModal, setShowQrModal] = useState<Tenant | null>(null);
  const [comboModalTenantId, setComboModalTenantId] = useState<string | null>(null);

  // Form states para edición
  const [editBio, setEditBio] = useState("");
  const [editThemeColor, setEditThemeColor] = useState("#C5A184");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [editCustomDomain, setEditCustomDomain] = useState("");
  const [editSubdomain, setEditSubdomain] = useState("");
  const [editAllowVales, setEditAllowVales] = useState(true);
  const [editAllowDelivery, setEditAllowDelivery] = useState(true);

  // Abrir modal de edición
  const handleOpenEdit = (tenant: Tenant, tab: "settings" | "branding") => {
    setSelectedTenant(tenant);
    setEditBio(tenant.branding.bioText || "");
    setEditThemeColor(tenant.branding.themeColor || "#C5A184");
    setEditLogoUrl(tenant.branding.logoUrl || "");
    setEditCustomDomain(tenant.settings.customDomain || "");
    setEditSubdomain(tenant.settings.subdomain || tenant.slug);
    setEditAllowVales(tenant.settings.allowVales);
    setEditAllowDelivery(tenant.settings.allowDelivery);
    setActiveTab(tab);
  };

  // Guardar cambios del tenant
  const handleSaveTenant = () => {
    if (!selectedTenant) return;

    const updatedStoreSettings = {
      ...(selectedTenant.branding || {}),
      bioText: editBio,
      themeColor: editThemeColor,
      profilePicUrl: editLogoUrl,
      customDomain: editCustomDomain.trim() || undefined,
      subdomain: editSubdomain.trim() || selectedTenant.slug,
      allowVales: editAllowVales,
      allowDelivery: editAllowDelivery
    };

    updateStoreSettings(selectedTenant.id, updatedStoreSettings);
    showToast(`Configuración de "${selectedTenant.name}" guardada con éxito`, "success");
    setActiveTab("list");
  };

  // Copiar enlace
  const handleCopyLink = (slug: string) => {
    const url = `https://axisnitro.store/nitro/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast("Enlace de tienda copiado al portapapeles", "success");
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Filtrar tenants
  const filteredTenants = useMemo(() => {
    return allTenants.filter((t: Tenant) => {
      const matchSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchPlan = filterPlan === "all" || t.plan === filterPlan;
      return matchSearch && matchPlan;
    });
  }, [allTenants, searchTerm, filterPlan]);

  // Métricas globales
  const totalVolume = useMemo(() => {
    return allTenants.reduce((acc: number, t: Tenant) => acc + (t.salesVolumeUSD || 0), 0);
  }, [allTenants]);

  const totalProducts = useMemo(() => {
    return (db.products || []).length;
  }, [db.products]);

  return (
    <div className="space-y-6">
      {/* Header Banner Multi-Tenant */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Building2 size={12} /> Motor Multi-Tenant Activo
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Aislamiento 100% Blindado
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Hub de Comercios & Tenants</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Administración de tiendas independientes, marcas blancas, dominios y catálogos aislados.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-3">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenants</p>
              <p className="text-xl font-black text-indigo-400">{allTenants.length}</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Productos</p>
              <p className="text-xl font-black text-emerald-400">{totalProducts}</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Volumen Red</p>
              <p className="text-xl font-black text-amber-400">{formatUSD(totalVolume)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles y Búsqueda */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Barra de Búsqueda */}
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, slug, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filtros por Plan */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "Todos los Planes" },
            { id: "pionero", label: "Pioneros" },
            { id: "premium", label: "Premium" },
            { id: "free", label: "Gratuitos" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPlan(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                filterPlan === tab.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                  : "bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Tenants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant: Tenant) => {
          const isActiveScope = activeTenant?.id === tenant.id;
          const storeUrl = `https://axisnitro.store/nitro/${tenant.slug}`;

          return (
            <div
              key={tenant.id}
              className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                isActiveScope
                  ? "border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header del Tenant */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center p-1 border border-slate-700 overflow-hidden shrink-0"
                      style={{ backgroundColor: tenant.branding.themeColor ? `${tenant.branding.themeColor}20` : '#1E1B4B' }}
                    >
                      {tenant.branding.logoUrl ? (
                        <img 
                          src={tenant.branding.logoUrl} 
                          alt={tenant.name} 
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            (e.target as any).src = "https://cdn-icons-png.flaticon.com/512/3063/3063822.png";
                          }}
                        />
                      ) : (
                        <Store size={22} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1 flex items-center gap-1.5">
                        {tenant.name}
                        {tenant.id === "kfs-express" && (
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-500/30">
                            CORE
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        /nitro/<span className="text-indigo-400 font-bold">{tenant.slug}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badge de Plan & Estado */}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      tenant.plan === "pionero"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : tenant.plan === "premium"
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {tenant.plan}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">
                      Fee: {(tenant.kfsFeePercentage * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Bio / Descripción */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  {tenant.branding.bioText || "Sin descripción configurada."}
                </p>

                {/* Métricas del Tenant */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center justify-center gap-1">
                      <Package size={10} /> Catálogo
                    </p>
                    <p className="text-xs font-black text-white mt-0.5">
                      {tenant.stats?.productsCount || 0}
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center justify-center gap-1">
                      <Users size={10} /> Staff
                    </p>
                    <p className="text-xs font-black text-white mt-0.5">
                      {tenant.stats?.vendedoresCount || 0}
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center justify-center gap-1">
                      <DollarSign size={10} /> Ventas
                    </p>
                    <p className="text-xs font-black text-emerald-400 mt-0.5">
                      {formatUSD(tenant.stats?.totalSalesUSD || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botonera de Acciones */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Enlace y QR */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyLink(tenant.slug)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Copiar enlace de tienda virtual"
                  >
                    {copiedSlug === tenant.slug ? (
                      <>
                        <Check size={14} className="text-emerald-400" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar URL
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowQrModal(tenant)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    title="Ver código QR de la tienda"
                  >
                    <QrCode size={16} />
                  </button>

                  <a
                    href={`/card/${tenant.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 hover:text-white rounded-xl border border-amber-800/60 transition-colors no-underline flex items-center justify-center"
                    title="Ver Tarjeta Digital NFC"
                  >
                    <CreditCard size={16} />
                  </a>

                  <a
                    href={`/nitro/${tenant.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white rounded-xl border border-indigo-800/60 transition-colors no-underline flex items-center justify-center"
                    title="Abrir tienda en vivo"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Acciones de Administración */}
                <div className="flex gap-2">
                  {isArchitect && (
                    <button
                      onClick={() => {
                        switchTenant(tenant.id);
                        showToast(`Contexto cambiado al tenant: ${tenant.name}`, "success");
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActiveScope
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                          : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      }`}
                    >
                      {isActiveScope ? (
                        <>
                          <CheckCircle2 size={14} /> Scope Activo
                        </>
                      ) : (
                        <>
                          <Eye size={14} /> Activar Scope
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setComboModalTenantId(tenant.id)}
                    className="p-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 hover:text-amber-300 rounded-xl border border-amber-800/40 transition-colors cursor-pointer"
                    title="Administrar Combos y Paquetes"
                  >
                    <Gift size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(tenant, "branding")}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    title="Personalizar branding y colores"
                  >
                    <Palette size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(tenant, "settings")}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    title="Configuración de Dominio y Operaciones"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Personalización / Configuración */}
      {selectedTenant && (activeTab === "settings" || activeTab === "branding") && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700"
                  style={{ backgroundColor: editThemeColor ? `${editThemeColor}30` : '#1E1B4B' }}
                >
                  <Store size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {activeTab === "branding" ? "Personalizar Marca & Colores" : "Configuración de Dominio & POS"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedTenant.name}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab(activeTab === "branding" ? "settings" : "branding")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
                >
                  {activeTab === "branding" ? <Settings size={14} /> : <Palette size={14} />}
                  {activeTab === "branding" ? "Ver Dominio" : "Ver Branding"}
                </button>
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido según Tab */}
            {activeTab === "branding" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Descripción / Bio de la Tienda
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Escribe el lema o información comercial de tu tienda..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Color Principal de Marca
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editThemeColor}
                        onChange={(e) => setEditThemeColor(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={editThemeColor}
                        onChange={(e) => setEditThemeColor(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      URL del Logotipo (PNG / SVG)
                    </label>
                    <input
                      type="text"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="https://.../logo.png"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Subdominio Axis Nitro
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editSubdomain}
                      onChange={(e) => setEditSubdomain(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-l-xl px-3 py-2 text-xs text-white"
                    />
                    <span className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-r-xl text-xs text-slate-400 font-mono">
                      .axisnitro.store
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Dominio Propio Personalizado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editCustomDomain}
                    onChange={(e) => setEditCustomDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="ej: www.minegocio.com"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Apunta un registro CNAME a <code className="text-indigo-400">cname.vercel-dns.com</code>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editAllowVales}
                      onChange={(e) => setEditAllowVales(e.target.checked)}
                      className="accent-indigo-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Habilitar Vales / QR</span>
                  </label>

                  <label className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editAllowDelivery}
                      onChange={(e) => setEditAllowDelivery(e.target.checked)}
                      className="accent-indigo-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Habilitar Riders</span>
                  </label>
                </div>
              </div>
            )}

            {/* Footer de Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer border-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTenant}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer border-none flex items-center gap-1.5"
              >
                <Check size={14} /> Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-lg">{showQrModal.name}</h3>
            <p className="text-xs text-slate-400">Escanea para acceder a la tienda virtual</p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <QRCodeSVG
                value={`https://axisnitro.store/nitro/${showQrModal.slug}`}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="text-xs font-mono text-indigo-400 break-all">
              https://axisnitro.store/nitro/{showQrModal.slug}
            </p>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors border-none cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Gestor de Combos */}
      {comboModalTenantId && (
        <ComboBuilderModal
          isOpen={!!comboModalTenantId}
          onClose={() => setComboModalTenantId(null)}
          clientId={comboModalTenantId}
        />
      )}
    </div>
  );
}
