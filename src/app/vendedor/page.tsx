"use client";

import React from "react";
import { useKFS } from "../../context/KFSContext";
import { VendedorDashboard } from "../../components/dashboards/VendedorDashboard";
import { AppEnforcer } from "../../components/AppEnforcer";

export default function VendedorPage() {
  const kfs = useKFS() as any;
  const { db, setDb, currentUser, processPurchase, triggerGhostTrap, logout, showToast, formatUSD } = kfs;

  return (
    <AppEnforcer currentUser={currentUser} updatePwaStatus={() => {}}>
      <VendedorDashboard
        db={db}
        setDb={setDb}
        currentUser={currentUser || { role: "vendedor", name: "Vendedor Táctico Axis Nitro", id: "vendedor_demo" }}
        processPurchase={processPurchase}
        triggerGhostTrap={triggerGhostTrap}
        logout={logout}
        showToast={showToast}
        formatUSD={formatUSD}
      />
    </AppEnforcer>
  );
}
