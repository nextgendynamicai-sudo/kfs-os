// src/lib/deviceMode.ts
// Utilidad para diferenciar y aislar la aplicación offline de Samsung S25 Ultra vs Software Web/PWA

export function isS25UltraOfflineMode(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // 1. Detección de entorno Capacitor / Android Nativo (APK)
    const isCapacitor = Boolean(
      (window as any).Capacitor?.isNativePlatform?.() ||
      (window as any).Capacitor ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "ionic:"
    );
    if (isCapacitor) return true;

    // 2. Bandera persistente en almacenamiento local para sesiones offline dedicadas
    if (localStorage.getItem("kfs_is_s25_offline") === "true") {
      return true;
    }

    // 3. Parámetro de URL explícito (?mode=s25, ?s25=true)
    const search = window.location.search;
    if (search.includes("mode=s25") || search.includes("s25=true") || search.includes("s25_offline=true")) {
      return true;
    }

    // 4. Ruta dedicada /s25
    if (window.location.pathname.startsWith("/s25")) {
      return true;
    }
  } catch (e) {
    // Fallback seguro a web estándar
  }

  return false;
}

export function activateS25UltraOfflineMode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("kfs_is_s25_offline", "true");
  } catch (e) {}
}

export function deactivateS25UltraOfflineMode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("kfs_is_s25_offline");
  } catch (e) {}
}

