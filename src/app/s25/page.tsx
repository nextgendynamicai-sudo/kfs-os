"use client";

import React, { useEffect, useState } from "react";
import { useKFS } from "../../context/KFSContext";
import { activateS25UltraOfflineMode, deactivateS25UltraOfflineMode } from "../../lib/deviceMode";
import { AxisNitroPOS } from "../../components/AxisNitroPOS";
import { ClientDashboard } from "../../components/dashboards/ClientDashboard";
import { RiderDashboard } from "../../components/dashboards/RiderDashboard";
import { DemoSwitcherBar } from "../../components/DemoSwitcherBar";
import {
  Smartphone, Store, ShoppingCart, Truck, Globe,
  ShieldCheck, RefreshCw, ArrowLeft
} from "lucide-react";

export default function S25UltraOfflinePage() {
  const kfs = useKFS() as any;
  const {
    currentUser,
    view,
    setView,
    loadDemoCommerce,
    resetDemoCommerceData,
    db,
    setDb,
    addProduct,
    addExpense,
    processPurchase,
    generateZReport,
    originalUser,
    stopImpersonating,
    registerPosTerminal,
    deletePosTerminal,
    toggleLoyaltyProgram,
    updateStoreSettings,
    updatePaymentMethods,
    toggleProductFeatured,
    createCoupon,
    deleteCoupon,
    toggleCouponActive,
    logout,
    requestTopUp,
    requestPayout,
    showToast,
    formatUSD,
    formatEUR,
    rates
  } = kfs;

  const [activeTab, setActiveTab] = useState<"pos" | "dueño" | "rider">("pos");

  useEffect(() => {
    activateS25UltraOfflineMode();
    if (loadDemoCommerce && (!currentUser || !currentUser.isDemoUser)) {
      loadDemoCommerce("vendedor");
    }
  }, [currentUser, loadDemoCommerce]);

  const handleReturnToWeb = () => {
    deactivateS25UltraOfflineMode();
    if (logout) logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Barra de Diferenciación Superior: S25 Ultra Offline Edition */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-violet-500/30 px-3 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">
                  Samsung Galaxy S25 Ultra
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Offline
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Bodegón & Market Gourmet Caracas · Entorno Aislado Standalone
              </p>
            </div>
          </div>

          {/* Navegación Rápida de Demostración */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab("pos");
                loadDemoCommerce?.("vendedor");
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "pos"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <ShoppingCart size={13} />
              <span className="hidden xs:inline">POS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("dueño");
                loadDemoCommerce?.("dueño");
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "dueño"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <Store size={13} />
              <span className="hidden xs:inline">Dueño</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("rider");
                loadDemoCommerce?.("rider");
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "rider"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <Truck size={13} />
              <span className="hidden xs:inline">Rider</span>
            </button>

            <button
              onClick={handleReturnToWeb}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ml-1"
              title="Volver al Software Web / PWA Principal"
            >
              <Globe size={13} />
              <span className="hidden md:inline">Modo Web</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal de Demostración Aislado */}
      <main className="flex-1">
        {activeTab === "pos" && (
          <div className="w-full">
            <AxisNitroPOS />
          </div>
        )}

        {activeTab === "dueño" && (
          <div className="w-full">
            <ClientDashboard
              db={db}
              setDb={setDb}
              currentUser={currentUser || { role: "dueño", company: "Bodegón Gourmet Caracas", id: "demo-comercio-kfs" }}
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
              logout={handleReturnToWeb}
              requestTopUp={requestTopUp}
              requestPayout={requestPayout}
              showToast={showToast}
              formatUSD={formatUSD}
              formatEUR={formatEUR}
            />
          </div>
        )}

        {activeTab === "rider" && (
          <div className="w-full">
            <RiderDashboard />
          </div>
        )}
      </main>

      <DemoSwitcherBar />
    </div>
  );
}

