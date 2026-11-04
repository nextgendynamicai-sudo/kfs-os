/**
 * Kreatek Flow Systems (KFS) - Brand Configuration
 * Este archivo centraliza la nomenclatura para evitar hardcoding en la UI.
 */
export const KFS_BRAND = {
  // Holding (La empresa)
  holding: "Kreatek",
  
  // Producto (El CGOS)
  productName: "Axis Nitro OS",
  productAcronym: "KFS",
  productCategory: "CGOS", // Commercial Growth Operating System
  
  domain: "axisnitro.store",
  baseUrl: "https://axisnitro.store",
  
  // Módulos del Producto
  modules: {
    backend: "Axis OS",
    marketplace: "Nitro Market",
    logistics: "Nitro Squad",
    partner: "Kreatek Operator", // Antes: Partner/Dueño/Tienda/Comercio
  },
  
  // Economía
  economy: {
    currency: "Axis Points", // Antes: Axis Points / Puntos
    rewardCenter: "Centro de Recompensas Axis"
  }
};

export const getAppBaseUrl = (): string => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return KFS_BRAND.baseUrl;
};
