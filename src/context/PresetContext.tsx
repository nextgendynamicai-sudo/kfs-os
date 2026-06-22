"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useKFS } from "./KFSContext";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface PresetFeatures {
  escandallos: boolean;
  serial_tracking: boolean;
  room_management: boolean;
  weight_scale: boolean;
  booking_system: boolean;
}

export interface CustomLabels {
  inventory_unit: string;
  checkout_btn: string;
}

export interface PresetMetadata {
  ui_mode: string;
  features: PresetFeatures;
  custom_labels: CustomLabels;
}

export interface PresetContextType {
  businessPreset: string;
  presetMetadata: PresetMetadata;
  isLoadingPreset: boolean;
  refreshPreset: () => Promise<void>;
}

const DEFAULT_PRESET = "RETAIL-QUICK";
const DEFAULT_METADATA: PresetMetadata = {
  ui_mode: "standard",
  features: {
    escandallos: false,
    serial_tracking: false,
    room_management: false,
    weight_scale: false,
    booking_system: false,
  },
  custom_labels: {
    inventory_unit: "Item",
    checkout_btn: "Cobrar",
  },
};

const PresetContext = createContext<PresetContextType | undefined>(undefined);

export function PresetProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, db } = useKFS() as any;
  const [businessPreset, setBusinessPreset] = useState<string>(DEFAULT_PRESET);
  const [presetMetadata, setPresetMetadata] = useState<PresetMetadata>(DEFAULT_METADATA);
  const [isLoadingPreset, setIsLoadingPreset] = useState<boolean>(false);

  // Determinar merchantId activo
  const merchantId = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.role === "dueño" || currentUser.role === "client") {
      return currentUser.id;
    }
    if (currentUser.role === "vendedor") {
      return currentUser.clientId || currentUser.merchantId;
    }
    return null;
  }, [currentUser]);

  // Buscar localmente en la base de datos de KFS
  const localClientData = useMemo(() => {
    if (!merchantId || !db.clients) return null;
    return db.clients.find((c: any) => c.id === merchantId);
  }, [merchantId, db.clients]);

  const refreshPreset = async () => {
    if (!merchantId) {
      setBusinessPreset(DEFAULT_PRESET);
      setPresetMetadata(DEFAULT_METADATA);
      return;
    }

    setIsLoadingPreset(true);

    // 1. Intentar cargar datos locales primero para una respuesta ultra-rápida (Low compute/Offline-first)
    if (localClientData) {
      if (localClientData.business_preset) {
        setBusinessPreset(localClientData.business_preset);
      }
      if (localClientData.preset_metadata) {
        setPresetMetadata({
          ui_mode: localClientData.preset_metadata.ui_mode || DEFAULT_METADATA.ui_mode,
          features: {
            ...DEFAULT_METADATA.features,
            ...(localClientData.preset_metadata.features || {}),
          },
          custom_labels: {
            ...DEFAULT_METADATA.custom_labels,
            ...(localClientData.preset_metadata.custom_labels || {}),
          },
        });
      }
    }

    // 2. Si Supabase está configurado, intentar sincronizar el valor en la nube
    if (isSupabaseConfigured) {
      const tables = ["kfs_clients", "kfs_merchants", "merchants"];
      let fetchedData = null;

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("business_preset, preset_metadata")
            .eq("id", merchantId)
            .single();

          if (!error && data && (data.business_preset || data.preset_metadata)) {
            fetchedData = data;
            break;
          }
        } catch (err) {
          // Continuar al siguiente fallback de tabla
        }
      }

      if (fetchedData) {
        if (fetchedData.business_preset) {
          setBusinessPreset(fetchedData.business_preset);
        }
        if (fetchedData.preset_metadata) {
          setPresetMetadata({
            ui_mode: fetchedData.preset_metadata.ui_mode || DEFAULT_METADATA.ui_mode,
            features: {
              ...DEFAULT_METADATA.features,
              ...(fetchedData.preset_metadata.features || {}),
            },
            custom_labels: {
              ...DEFAULT_METADATA.custom_labels,
              ...(fetchedData.preset_metadata.custom_labels || {}),
            },
          });
        }
      }
    }

    setIsLoadingPreset(false);
  };

  useEffect(() => {
    refreshPreset();
  }, [merchantId, localClientData]);

  const value = useMemo(
    () => ({
      businessPreset,
      presetMetadata,
      isLoadingPreset,
      refreshPreset,
    }),
    [businessPreset, presetMetadata, isLoadingPreset]
  );

  return <PresetContext.Provider value={value}>{children}</PresetContext.Provider>;
}

export function usePreset() {
  const context = useContext(PresetContext);
  if (context === undefined) {
    throw new Error("usePreset must be used within a PresetProvider");
  }
  return context;
}
