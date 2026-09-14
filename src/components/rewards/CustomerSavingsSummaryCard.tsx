"use client";

import React from "react";
import { TrendingUp, PiggyBank, Award, Store, Sparkles, ArrowRight } from "lucide-react";

interface CustomerSavingsSummaryCardProps {
  totalSavedUSD?: number;
  kPointsEarned?: number;
  merchantsVisited?: number;
  bcvRate?: number;
  className?: string;
  onExploreMerchants?: () => void;
}

export const CustomerSavingsSummaryCard: React.FC<CustomerSavingsSummaryCardProps> = ({
  totalSavedUSD = 18.40,
  kPointsEarned = 350,
  merchantsVisited = 4,
  bcvRate = 36.45,
  className = "",
  onExploreMerchants
}) => {
  const savedBs = totalSavedUSD * bcvRate;
  const progressPercent = Math.min(100, Math.round((kPointsEarned / 500) * 100));

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border border-violet-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <PiggyBank size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Resumen Inteligente de Ahorro
            </h4>
            <p className="text-[10px] text-slate-400">
              Rendimiento de tus compras y beneficios KFS este mes
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          Activo • Mes en curso
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* Total Ahorrado */}
        <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3.5 space-y-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
            Ahorro Total Neto
          </span>
          <p className="text-xl font-black text-emerald-400">
            +${totalSavedUSD.toFixed(2)} USD
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            ≈ Bs. {savedBs.toFixed(2)} (BCV)
          </p>
        </div>

        {/* K-Points Ganados */}
        <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3.5 space-y-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
            K-Points Acumulados
          </span>
          <p className="text-xl font-black text-amber-300 font-mono">
            +{kPointsEarned} KP
          </p>
          <p className="text-[10px] text-amber-400/80">
            Equivale a ${(kPointsEarned * 0.001).toFixed(2)} USD
          </p>
        </div>

        {/* Comercios Visitados */}
        <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3.5 space-y-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
            Comercios Aliados
          </span>
          <p className="text-xl font-black text-cyan-400">
            {merchantsVisited} Locales
          </p>
          <p className="text-[10px] text-slate-400">
            En circuito comercial KFS
          </p>
        </div>
      </div>

      {/* Progress Bar towards Next VIP Milestone */}
      <div className="space-y-1.5 relative z-10 bg-slate-950/50 p-3 rounded-2xl border border-white/5">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-slate-300 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" />
            Meta VIP Nitro Platinum:
          </span>
          <span className="text-amber-300 font-mono">{kPointsEarned} / 500 KP ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[9px] text-slate-400">
          Acumula 150 KP adicionales para desbloquear 5% de cashback en compras de fin de semana.
        </p>
      </div>

      {/* Action footer */}
      {onExploreMerchants && (
        <div className="pt-1 flex justify-end relative z-10">
          <button
            type="button"
            onClick={onExploreMerchants}
            className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver comercios aliados con K-Points</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
