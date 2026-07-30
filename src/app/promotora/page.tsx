"use client";

import React from "react";
import { useKFS } from "../../context/KFSContext";
import { PromotoraDashboard } from "../../components/dashboards/PromotoraDashboard";
import { AppEnforcer } from "../../components/AppEnforcer";

export default function PromotoraPage() {
  const kfs = useKFS() as any;
  const { db, setDb, currentUser, registerClient, upgradeToPremium, settlePromotoraEarnings, formatUSD, formatEUR, logout, requestPayout, registerVendedor } = kfs;

  return (
    <AppEnforcer currentUser={currentUser} updatePwaStatus={() => {}}>
      <PromotoraDashboard
        db={db}
        setDb={setDb}
        currentUser={currentUser || { role: "promotora", name: "Promotora Digital Axis Nitro" }}
        registerClient={registerClient}
        upgradeToPremium={upgradeToPremium}
        settlePromotoraEarnings={settlePromotoraEarnings}
        formatUSD={formatUSD}
        formatEUR={formatEUR}
        logout={logout}
        requestPayout={requestPayout}
        registerVendedor={registerVendedor}
      />
    </AppEnforcer>
  );
}
