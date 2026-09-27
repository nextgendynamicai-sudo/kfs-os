"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Search, ShoppingCart, Package, DollarSign, Users, 
  Settings, Moon, Sun, LogOut, ArrowRight, X, Sparkles,
  Store, CheckCircle2, ShieldAlert, FileText, Smartphone
} from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { ModalPortal } from "./ModalPortal";

export const CommandPalette = () => {
  const { 
    currentUser, 
    db, 
    view, 
    setView, 
    logout, 
    showToast,
    formatUSD 
  } = useKFS() as any;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Contextual actions
  const actions = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle?: string;
      category: string;
      icon: any;
      action: () => void;
      keywords?: string;
    }> = [];

    // Acciones POS y Caja
    list.push({
      id: "pos_open",
      title: "Abrir Caja POS (Cobro Rápido)",
      subtitle: "Ir al punto de venta táctil para escanear y cobrar",
      category: "Ventas & Caja",
      icon: ShoppingCart,
      keywords: "caja pos cobrar vender ticket factura venta escanear",
      action: () => {
        setView("nitro_pos");
        showToast("Caja POS abierta para cobro rápido", "success");
      }
    });

    list.push({
      id: "cierre_caja",
      title: "Cierre de Caja del Día (Reporte Z)",
      subtitle: "Arqueo ciego y balance final del turno",
      category: "Ventas & Caja",
      icon: ShieldAlert,
      keywords: "cierre corte z reporte arqueo caja dinero balance fin",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-open-blind-count"));
        showToast("Iniciando arqueo y Cierre de Caja (Z)...", "info");
      }
    });

    list.push({
      id: "nuevo_gasto",
      title: "Registrar Nuevo Gasto",
      subtitle: "Descontar egresos de caja chica o compras operativas",
      category: "Ventas & Caja",
      icon: DollarSign,
      keywords: "gasto egreso pagar proveedor compra caja chica salida",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-open-expense-modal"));
      }
    });

    // Acciones Inventario
    list.push({
      id: "nuevo_producto",
      title: "Agregar Nuevo Producto",
      subtitle: "Crear un artículo en inventario con código de barras y precio",
      category: "Inventario",
      icon: Package,
      keywords: "producto nuevo crear articulo agregar inventario stock",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-open-add-product"));
      }
    });

    list.push({
      id: "ver_inventario",
      title: "Consultar Inventario Completo",
      subtitle: "Ver stock, precios y categorías de productos",
      category: "Inventario",
      icon: Package,
      keywords: "inventario lista productos catalogo existencias stock",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-switch-tab", { detail: "inventario" }));
      }
    });

    // Alternar Modos de Interfaz
    list.push({
      id: "toggle_mode_counter",
      title: "Activar Modo Mostrador (Rápido)",
      subtitle: "Simplifica la pantalla al máximo para atención veloz en mostrador",
      category: "Interfaz & Vistas",
      icon: Store,
      keywords: "modo mostrador rapido simple pos cajero velocidad",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-set-interface-mode", { detail: "counter" }));
        showToast("Modo Mostrador activado: Máxima velocidad de atención.", "success");
      }
    });

    list.push({
      id: "toggle_mode_pro",
      title: "Activar Modo Gerencial (Completo)",
      subtitle: "Desbloquea analíticas completas, nómina y configuración de periféricos",
      category: "Interfaz & Vistas",
      icon: Sparkles,
      keywords: "modo gerencial pro completo administrador dueño reportes",
      action: () => {
        window.dispatchEvent(new CustomEvent("kfs-set-interface-mode", { detail: "pro" }));
        showToast("Modo Gerencial activado: Acceso completo a herramientas.", "success");
      }
    });

    // Tema
    list.push({
      id: "toggle_theme",
      title: "Alternar Modo Oscuro / Claro",
      subtitle: "Cambiar paleta visual del sistema",
      category: "Interfaz & Vistas",
      icon: Moon,
      keywords: "tema oscuro claro dark light noche dia",
      action: () => {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
          showToast("Modo Claro activado", "info");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          showToast("Modo Oscuro activado", "info");
        }
      }
    });

    // Productos de la tienda actual (búsqueda directa)
    if (currentUser?.id && db?.products) {
      const myProds = db.products.filter((p: any) => p.clientId === currentUser.id || p.clientId === currentUser.clientId);
      myProds.slice(0, 15).forEach((prod: any) => {
        list.push({
          id: `prod_${prod.id}`,
          title: prod.name,
          subtitle: `Precio: ${formatUSD(prod.priceUSD || 0)} • Stock: ${prod.stock ?? 0} unid.`,
          category: "Productos en Inventario",
          icon: Package,
          keywords: `${prod.name} ${prod.barcode || ""} ${prod.category || ""}`,
          action: () => {
            window.dispatchEvent(new CustomEvent("kfs-quick-sell-product", { detail: prod }));
            showToast(`Producto seleccionado: ${prod.name}`, "info");
          }
        });
      });
    }

    // Sesión
    if (currentUser) {
      list.push({
        id: "logout_action",
        title: "Cerrar Sesión Segura",
        subtitle: `Usuario activo: ${currentUser.name || currentUser.company || currentUser.email}`,
        category: "Cuenta",
        icon: LogOut,
        keywords: "salir cerrar sesion logout desconectar",
        action: () => logout()
      });
    }

    return list;
  }, [currentUser, db, setView, logout, showToast, formatUSD]);

  // Filtrado de acciones
  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions.slice(0, 8);
    const q = query.toLowerCase().trim();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
        (a.keywords && a.keywords.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  // Navegación con teclado
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredActions.length || 1)) % (filteredActions.length || 1));
    } else if (e.key === "Enter" && filteredActions[selectedIndex]) {
      e.preventDefault();
      executeAction(filteredActions[selectedIndex]);
    }
  };

  const executeAction = (actionItem: any) => {
    setIsOpen(false);
    actionItem.action();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 z-[999999] bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-hidden animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con Buscador */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 gap-3 bg-slate-50/50 dark:bg-slate-950/50">
            <Search size={20} className="text-violet-600 dark:text-violet-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownList}
              placeholder="Escribe un comando o busca un producto... (Ej: Cobrar, Cierre, Stock)"
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/10 rounded-md">
                ESC
              </kbd>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lista de Acciones y Resultados */}
          <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-white/5 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No se encontraron acciones ni productos.</p>
                <p className="text-xs mt-1 text-slate-400">Prueba con palabras como "cobrar", "cierre", "gasto" o el nombre de un artículo.</p>
              </div>
            ) : (
              filteredActions.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => executeAction(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isSelected 
                          ? "bg-white/20 text-white" 
                          : "bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400"
                      }`}>
                        <IconComponent size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold truncate">
                            {item.title}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider shrink-0 ${
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : "bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? "text-violet-100" : "text-slate-400 dark:text-slate-400"
                          }`}>
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <ArrowRight 
                      size={16} 
                      className={`shrink-0 ml-2 transition-transform ${
                        isSelected ? "translate-x-1 opacity-100" : "opacity-0"
                      }`} 
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer de Ayuda */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Usa ↑ ↓ para navegar y ENTER para ejecutar</span>
            <span className="hidden sm:inline">KFS OS 8.0 • Asistente Rápido</span>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
