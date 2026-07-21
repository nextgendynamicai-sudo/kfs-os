"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ViewType = "login" | "customer_dashboard" | "client_dashboard" | "promotora_dashboard" | "vendedor_dashboard" | "rider_dashboard" | "core" | "sales_landing" | "marketplace";

interface UIContextType {
  view: ViewType;
  setView: (v: ViewType) => void;
  toast: { show: boolean; message: string; type: string };
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  networkState: "online" | "offline" | "syncing" | "mesh";
  setNetworkState: (state: "online" | "offline" | "syncing" | "mesh") => void;
  ghostTrapLocked: boolean;
  setGhostTrapLocked: (locked: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [view, setViewInternal] = useState<ViewType | string>("landing");
  
  const setView = (newView: ViewType | string) => {
    setViewInternal(newView);
    if (typeof window !== "undefined" && window.history) {
      window.history.pushState({ view: newView }, "", `#${newView}`);
    }
  };

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [networkState, setNetworkState] = useState<"online" | "offline" | "syncing" | "mesh">("online");
  const [ghostTrapLocked, setGhostTrapLocked] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkState("online");
      showToast("Conexión restaurada con el Ecosistema.", "success");
    };
    const handleOffline = () => {
      setNetworkState("offline");
      showToast("Sin conexión. Operando en Modo Local (Cache).", "warning");
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
    
    // Native Push Notification Support
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && type === "success") {
      try {
        new Notification(`KFS OS`, { body: message, icon: "/kfs-logo.png" });
      } catch (e) {
        console.warn("Native notification failed", e);
      }
    }
  };

  return (
    <UIContext.Provider value={{
      view, setView,
      toast, showToast,
      networkState, setNetworkState,
      ghostTrapLocked, setGhostTrapLocked
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};
