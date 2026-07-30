"use client";

import React from "react";
import { useKFS } from "../../context/KFSContext";
import { CoreDashboard } from "../../components/dashboards/CoreDashboard";
import { AppEnforcer } from "../../components/AppEnforcer";

export default function ArquitectoPage() {
  const kfs = useKFS() as any;
  const { db, setDb, approvePromotora, rejectPromotora, settlePromotoraEarnings, showToast, formatUSD, formatEUR, currentUser, logout, approveSubscription, setView } = kfs;

  return (
    <AppEnforcer currentUser={currentUser} updatePwaStatus={() => {}}>
      <CoreDashboard
        db={db}
        setDb={setDb}
        approvePromotora={approvePromotora}
        rejectPromotora={rejectPromotora}
        settlePromotoraEarnings={settlePromotoraEarnings}
        showToast={showToast}
        formatUSD={formatUSD}
        formatEUR={formatEUR}
        currentUser={currentUser || { role: "arquitecto", name: "Arquitecto Core", permissions: ["panel", "soporte", "kyc", "vista_dios", "db_manager", "tienda_oficial", "red", "auditoria", "nodos", "axis_nitro_pos", "equipo"] }}
        logout={logout}
        approveSubscription={approveSubscription}
        setView={setView}
      />
    </AppEnforcer>
  );
}
