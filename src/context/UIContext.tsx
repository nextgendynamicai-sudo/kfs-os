"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ViewType = string;

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

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" | "warning" = "success") => {
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
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setNetworkState("syncing");
      const { processOfflineQueue } = await import("../lib/offlineSync");
      const { syncedCount } = await processOfflineQueue();
      
      setNetworkState("online");
      if (syncedCount > 0) {
        showToast(`⚡ Sincronización offline completada: ${syncedCount} operaciones subidas a la nube con éxito.`, "success");
      } else {
        showToast("Conexión restaurada con el Ecosistema.", "success");
      }
    };
    const handleOffline = () => {
      setNetworkState("offline");
      showToast("Sin conexión. Modo Offline activo: Las operaciones se guardarán localmente.", "warning");
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [showToast]);

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
