import { Tenant, TenantBranding, TenantSettings, TenantStats } from "../types/tenant";

/**
 * Convierte un texto en un slug URL-friendly.
 * Ej: "Zapatería El Sol #1" -> "zapateria-el-sol-1"
 */
export function createTenantSlug(name: string): string {
  if (!name) return "comercio-" + Math.random().toString(36).substring(2, 7);
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]+/g, "-") // Caracteres no alfanuméricos a guiones
    .replace(/^-+|-+$/g, "") // Eliminar guiones al inicio y final
    || "comercio";
}

/**
 * Convierte cualquier registro de Client existente en un Tenant tipado y enriquecido,
 * garantizando 100% de compatibilidad hacia atrás sin mutar ni dañar registros previos.
 */
export function clientToTenant(
  client: any,
  allProducts: any[] = [],
  allVendedores: any[] = [],
  allVales: any[] = [],
  allTransactions: any[] = []
): Tenant {
  if (!client) {
    return getDefaultTenant();
  }

  const clientId = client.id || "default_tenant";
  const slug = client.slug || (client.id === "kfs-express" ? "kfs-express" : createTenantSlug(client.company || client.name || client.id));

  // Branding seguro con fallbacks armónicos
  const rawSettings = client.storeSettings || {};
  const branding: TenantBranding = {
    themeColor: rawSettings.themeColor || "#C5A184",
    secondaryColor: rawSettings.secondaryColor || "#1E1B4B",
    logoUrl: rawSettings.profilePicUrl || client.avatar || "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
    bannerUrl: rawSettings.bannerUrl || "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60",
    profilePicUrl: rawSettings.profilePicUrl || client.avatar || "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
    bioText: rawSettings.bioText || (client.id === "kfs-express" 
      ? "Tienda Oficial del Ecosistema Axis Nitro & KFS Points." 
      : `Bienvenido a ${client.company || client.name || "nuestra tienda"}.`),
    typography: rawSettings.typography || "font-sans",
    layoutType: rawSettings.layoutType || "grid",
    socialLinks: rawSettings.socialLinks || {
      whatsapp: client.phone || "",
      instagram: "",
      website: ""
    }
  };

  const isArchitectStore = client.isArchitectStore || client.created_by === 'arquitecto' || client.id === 'kfs-express' || client.plan === 'pionero' || client.plan === 'premium';

  // Configuración operativa del tenant
  const settings: TenantSettings = {
    currencyDefault: rawSettings.currencyDefault || "USD",
    taxRate: rawSettings.taxRate ?? 0.16,
    customDomain: client.customDomain || rawSettings.customDomain || undefined,
    subdomain: client.subdomain || slug,
    allowVales: rawSettings.allowVales ?? true,
    allowDelivery: rawSettings.allowDelivery ?? true,
    allowGhostTrap: rawSettings.allowGhostTrap ?? false,
    isMultiCashier: rawSettings.isMultiCashier ?? true,
    autoPrintReceipts: rawSettings.autoPrintReceipts ?? false,
    // Funciones Exclusivas Tiendas de Arquitecto (7, 9, 10, 13)
    enableSmartChange: rawSettings.enableSmartChange ?? isArchitectStore,
    enableLowStockAlerts: rawSettings.enableLowStockAlerts ?? isArchitectStore,
    enableCombos: rawSettings.enableCombos ?? isArchitectStore,
    enableDigitalCard: rawSettings.enableDigitalCard ?? isArchitectStore,
    isArchitectStore: isArchitectStore
  };

  // Filtrado de métricas aisladas para este tenant
  const tenantProducts = allProducts.filter((p: any) => (p.clientId === clientId || p.sellerId === clientId));
  const tenantVendedores = allVendedores.filter((v: any) => v.clientId === clientId);
  const tenantVales = allVales.filter((vl: any) => vl.clientId === clientId);
  const tenantTransactions = allTransactions.filter((t: any) => t.clientId === clientId);

  const totalSalesUSD = tenantTransactions.reduce((acc, t) => acc + (t.amountUSD || t.amount || 0), 0) + (client.salesUSD || client.salesVolume || 0);

  const stats: TenantStats = {
    totalSalesUSD: Number(totalSalesUSD.toFixed(2)),
    productsCount: tenantProducts.length,
    vendedoresCount: tenantVendedores.length,
    valesCount: tenantVales.length,
    transactionsCount: tenantTransactions.length
  };

  return {
    id: clientId,
    slug: slug,
    name: client.company || client.name || "Comercio KFS",
    company: client.company || client.name || "Comercio KFS",
    email: client.email || "contacto@axisnitro.store",
    phone: client.phone || "",
    address: client.address || "",
    avatar: branding.logoUrl,
    status: client.status === "blocked" ? "suspended" : (client.status || "active"),
    plan: (client.plan as any) || (client.is_founder ? "pionero" : "free"),
    kfsFeePercentage: client.kfsFeePercentage ?? 0.01,
    walletBalanceUSD: client.walletBalanceUSD || 0,
    salesVolumeUSD: stats.totalSalesUSD,
    rating: client.rating || 5.0,
    reviewCount: client.reviewCount || 0,
    promotoraId: client.referredBy || client.promotoraId,
    branding,
    settings,
    stats,
    createdAt: client.createdAt || new Date().toISOString()
  };
}

/**
 * Tenant por defecto del sistema (Arquitecto / Tienda Oficial Axis Nitro)
 */
export function getDefaultTenant(): Tenant {
  return {
    id: "kfs-express",
    slug: "kfs-express",
    name: "Arquitecto Axis Points Reward",
    company: "Arquitecto Axis Points Reward",
    email: "arquitecto@kfs.com",
    phone: "+58 412 0000000",
    address: "Soporte Central Axis Nitro",
    avatar: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
    status: "active",
    plan: "pionero",
    kfsFeePercentage: 0.01,
    walletBalanceUSD: 0,
    salesVolumeUSD: 0,
    rating: 5.0,
    reviewCount: 0,
    branding: {
      themeColor: "#C5A184",
      secondaryColor: "#1E1B4B",
      logoUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
      bannerUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1200&auto=format&fit=crop&q=60",
      profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
      bioText: "En esta tienda podrás canjear tus Axis Points. Mira todo lo que tenemos para ti",
      typography: "font-sans",
      layoutType: "grid",
      socialLinks: {
        whatsapp: "+584120000000",
        instagram: "@axisnitro",
        website: "https://axisnitro.store"
      }
    },
    settings: {
      currencyDefault: "USD",
      taxRate: 0.16,
      subdomain: "kfs-express",
      allowVales: true,
      allowDelivery: true,
      allowGhostTrap: true,
      isMultiCashier: true,
      autoPrintReceipts: false
    },
    createdAt: "2026-01-01T00:00:00.000Z"
  };
}

/**
 * Resuelve un tenant a partir de un slug, ID, subdominio o dominio personalizado
 */
export function resolveTenant(identifier: string, clients: any[] = []): Tenant | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();

  // 1. Coincidencia por ID directo
  const byId = clients.find((c: any) => c.id?.toLowerCase() === clean);
  if (byId) return clientToTenant(byId);

  // 2. Coincidencia por slug explícito o derivado
  const bySlug = clients.find((c: any) => {
    const s = c.slug || createTenantSlug(c.company || c.name || c.id);
    return s.toLowerCase() === clean;
  });
  if (bySlug) return clientToTenant(bySlug);

  // 3. Coincidencia por subdominio o dominio personalizado
  const byDomain = clients.find((c: any) => {
    return (
      c.subdomain?.toLowerCase() === clean ||
      c.customDomain?.toLowerCase() === clean ||
      c.storeSettings?.customDomain?.toLowerCase() === clean
    );
  });
  if (byDomain) return clientToTenant(byDomain);

  // Fallback para kfs-express
  if (clean === "kfs-express" || clean === "core" || clean === "arquitecto") {
    return getDefaultTenant();
  }

  return null;
}

/**
 * Filtra los productos pertenecientes exclusivamente al tenant seleccionado.
 * Si el usuario es Arquitecto Super-Admin y pasa "all", devuelve todos.
 */
export function filterProductsByTenant(products: any[] = [], tenantId?: string): any[] {
  if (!tenantId || tenantId === "all") return products;
  return products.filter((p: any) => (p.clientId === tenantId || p.sellerId === tenantId));
}

/**
 * Filtra las transacciones pertenecientes exclusivamente al tenant seleccionado.
 */
export function filterTransactionsByTenant(transactions: any[] = [], tenantId?: string): any[] {
  if (!tenantId || tenantId === "all") return transactions;
  return transactions.filter((t: any) => t.clientId === tenantId);
}

/**
 * Filtra los vales pertenecientes exclusivamente al tenant seleccionado.
 */
export function filterValesByTenant(vales: any[] = [], tenantId?: string): any[] {
  if (!tenantId || tenantId === "all") return vales;
  return vales.filter((v: any) => v.clientId === tenantId);
}

/**
 * Filtra el personal (vendedores) del tenant seleccionado.
 */
export function filterVendedoresByTenant(vendedores: any[] = [], tenantId?: string): any[] {
  if (!tenantId || tenantId === "all") return vendedores;
  return vendedores.filter((v: any) => v.clientId === tenantId);
}

/**
 * Filtra los puntos de venta POS del tenant seleccionado.
 */
export function filterPOSTerminalsByTenant(posTerminals: any[] = [], tenantId?: string): any[] {
  if (!tenantId || tenantId === "all") return posTerminals;
  return posTerminals.filter((pt: any) => pt.clientId === tenantId);
}
