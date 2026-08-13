"use client";

import React from "react";
import { useKFS } from "../../context/KFSContext";
import { ClientDashboard } from "../../components/dashboards/ClientDashboard";
import { AppEnforcer } from "../../components/AppEnforcer";

export default function ComercioPage() {
  const kfs = useKFS() as any;
  const { db, setDb, currentUser, addProduct, addExpense, processPurchase, generateZReport, originalUser, stopImpersonating, registerPosTerminal, deletePosTerminal, toggleLoyaltyProgram, updateStoreSettings, updatePaymentMethods, toggleProductFeatured, createCoupon, deleteCoupon, toggleCouponActive, logout, requestTopUp, requestPayout, showToast, formatUSD, formatEUR } = kfs;

  return (
    <AppEnforcer currentUser={currentUser} updatePwaStatus={() => {}}>
      <ClientDashboard
        db={db}
        setDb={setDb}
        currentUser={currentUser || { role: "dueño", company: "Comercio Axis Nitro", id: "client_demo" }}
        addProduct={addProduct}
        addExpense={addExpense}
        processPurchase={processPurchase}
        generateZReport={generateZReport}
        originalUser={originalUser}
        stopImpersonating={stopImpersonating}
        registerPosTerminal={registerPosTerminal}
        deletePosTerminal={deletePosTerminal}
        toggleLoyaltyProgram={toggleLoyaltyProgram}
        updateStoreSettings={updateStoreSettings}
        updatePaymentMethods={updatePaymentMethods}
        toggleProductFeatured={toggleProductFeatured}
        createCoupon={createCoupon}
        deleteCoupon={deleteCoupon}
        toggleCouponActive={toggleCouponActive}
        logout={logout}
        requestTopUp={requestTopUp}
        requestPayout={requestPayout}
        showToast={showToast}
        formatUSD={formatUSD}
        formatEUR={formatEUR}
      />
    </AppEnforcer>
  );
}
