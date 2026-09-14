"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, PiggyBank, Award, ArrowUpRight, Sliders, CheckCircle2 } from "lucide-react";

interface MerchantPitchRoiCalculatorProps {
  initialSalesUSD?: number;
  className?: string;
  onApplyPresetVolume?: (volumeUSD: number) => void;
}

export const MerchantPitchRoiCalculator: React.FC<MerchantPitchRoiCalculatorProps> = ({
  initialSalesUSD = 4000,
  className = "",
  onApplyPresetVolume
}) => {
  const [monthlySalesUSD, setMonthlySalesUSD] = useState<number>(initialSalesUSD);

  // Traditional Bank / POS calculations
  const traditionalRate = 0.04; // 4%
  const traditionalDeviceRentalMonth = 35; // $35/mo rental of physical terminal
  const traditionalAnnualCost = (monthlySalesUSD * traditionalRate * 12) + (traditionalDeviceRentalMonth * 12);

  // KFS OS / Axis Nitro calculations
  const axisNitroRate = 0.02; // 2% flat rate
  const axisNitroAnnualCost = monthlySalesUSD * axisNitroRate * 12;

  // Merchant Net Annual Savings
  const annualSavingsUSD = Math.max(0, traditionalAnnualCost - axisNitroAnnualCost);
  const monthlySavingsUSD = annualSavingsUSD / 12;

  // Promoter Recurring Commission (0.5% monthly residual)
  const promoterMonthlyCommission = monthlySalesUSD * 0.005;
  const promoterAnnualCommission = promoterMonthlyCommission * 12;

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border border-amber-400/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Sliders size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Calculadora de Ahorro & Ganancia en Vivo
            </h4>
            <p className="text-[10px] text-slate-400">
              Argumento matemático para cerrar al comerciante en el pitch
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-mono">
          Tarifa Plana 2% vs Banca
        </span>
      </div>

      {/* Slider Control */}
      <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-white/5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-bold">Venta Mensual Estimada del Comercio:</span>
          <span className="text-xl font-black text-amber-300 font-mono">
            ${monthlySalesUSD.toLocaleString()} USD/mes
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="30000"
          step="500"
          value={monthlySalesUSD}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 500;
            setMonthlySalesUSD(val);
            if (onApplyPresetVolume) onApplyPresetVolume(val);
          }}
          className="w-full accent-amber-400 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>$500/mes</span>
          <span>$10,000/mes</span>
          <span>$20,000/mes</span>
          <span>$30,000+/mes</span>
        </div>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Card 1: Ahorro para el Comercio */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <PiggyBank size={13} /> Ahorro para el Comercio
            </span>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Anual Garantizado
            </span>
          </div>

          <p className="text-2xl font-black text-emerald-300 font-mono">
            +${Math.round(annualSavingsUSD).toLocaleString()} USD/año
          </p>

          <p className="text-[11px] text-slate-300">
            Ahorra <strong className="text-emerald-400">${Math.round(monthlySavingsUSD)} USD mensuales</strong> al eliminar comisiones bancarias del 4% y costos de alquiler de punto físico.
          </p>
        </div>

        {/* Card 2: Ganancia Pasiva para la Promotora */}
        <div className="bg-violet-950/30 border border-violet-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 flex items-center gap-1">
              <Award size={13} /> Tu Comisión Recurrente
            </span>
            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Residual Mensual
            </span>
          </div>

          <p className="text-2xl font-black text-amber-300 font-mono">
            +${Math.round(promoterMonthlyCommission)} USD/mes
          </p>

          <p className="text-[11px] text-slate-300">
            Ganancia pasiva de <strong className="text-amber-300">${Math.round(promoterAnnualCommission)} USD/año</strong> de por vida por este solo cliente afiliado en tu red.
          </p>
        </div>
      </div>

      {/* Quick Pitch Bullet Points */}
      <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-1.5 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
          <span>Sin contratos forzosos ni comprar máquinas de miles de dólares.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
          <span>Cobra al instante en Pago Móvil Bs (tasa BCV) o Efectivo USD sin comisiones ocultas.</span>
        </div>
      </div>
    </div>
  );
};
