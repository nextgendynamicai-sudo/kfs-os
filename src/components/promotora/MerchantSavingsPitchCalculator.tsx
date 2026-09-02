"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, TrendingUp, ShieldCheck, Clock, Award, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export const MerchantSavingsPitchCalculator: React.FC = () => {
  const [monthlySalesUSD, setMonthlySalesUSD] = useState<number>(3000);
  const [deliveryOrdersPerMonth, setDeliveryOrdersPerMonth] = useState<number>(60);

  // Cálculos comparativos
  // Sistema tradicional: 4% comisiones pasarelas/bancos + 25% comisiones apps de delivery tradicionales ($15 ticket prom) + $50 pérdida mensual descuadres
  const traditionalPaymentFees = useMemo(() => monthlySalesUSD * 0.045, [monthlySalesUSD]);
  const traditionalDeliveryCuts = useMemo(() => deliveryOrdersPerMonth * 15 * 0.25, [deliveryOrdersPerMonth]); // 25% que cobran apps tipo Yummy/PedidosYa
  const traditionalManualLoss = 45; // Cuadres de caja, vueltos erróneos
  const traditionalTotalMonthlyCost = traditionalPaymentFees + traditionalDeliveryCuts + traditionalManualLoss;

  // KFS OS / Axis Nitro: Flat fee ~2%, 0% comisión en delivery propio, 0 pérdidas por cuadre automático
  const kfsPaymentFees = useMemo(() => monthlySalesUSD * 0.02, [monthlySalesUSD]);
  const kfsDeliveryCuts = 0; // 0% comisión a apps de terceros
  const kfsManualLoss = 0; // Calculadora automática de vueltos
  const kfsTotalMonthlyCost = kfsPaymentFees + kfsDeliveryCuts + kfsManualLoss;

  // Ahorro mensual y anual
  const monthlySavingsUSD = Math.max(0, traditionalTotalMonthlyCost - kfsTotalMonthlyCost);
  const annualSavingsUSD = monthlySavingsUSD * 12;

  return (
    <div className="bg-slate-900 border border-emerald-500/40 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
          <DollarSign size={24} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Arma de Venta #2
          </span>
          <h3 className="text-xl font-black text-white mt-0.5">
            Calculadora de Ahorro y Rentabilidad para el Comerciante
          </h3>
          <p className="text-xs text-slate-400">
            Demuéstrale con números exactos cuánto dinero pierde hoy con sistemas antiguos.
          </p>
        </div>
      </div>

      {/* Sliders Interactivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              Ventas Estimadas del Comercio
            </span>
            <span className="font-mono font-black text-amber-400 text-sm">
              ${monthlySalesUSD.toLocaleString()} USD / mes
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={25000}
            step={500}
            value={monthlySalesUSD}
            onChange={(e) => setMonthlySalesUSD(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>$500</span>
            <span>$10,000</span>
            <span>$25,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              Pedidos a Domicilio (Delivery)
            </span>
            <span className="font-mono font-black text-teal-400 text-sm">
              {deliveryOrdersPerMonth} pedidos / mes
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={10}
            value={deliveryOrdersPerMonth}
            onChange={(e) => setDeliveryOrdersPerMonth(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>0</span>
            <span>150</span>
            <span>300</span>
          </div>
        </div>
      </div>

      {/* Tarjeta Gigante de Ahorro Proyectado */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
            <Sparkles size={13} /> Dinero que se queda en el bolsillo del dueño
          </span>
          <h4 className="text-3xl sm:text-4xl font-black text-white font-mono">
            +${monthlySavingsUSD.toFixed(0)}{" "}
            <span className="text-sm font-bold text-emerald-400">USD / mes</span>
          </h4>
          <p className="text-xs text-slate-400">
            Ahorro anual estimado: <strong className="text-emerald-300 font-mono font-black">+${annualSavingsUSD.toFixed(0)} USD</strong>
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
          <div className="bg-slate-900/90 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Clock size={18} className="text-amber-400 shrink-0" />
            <div className="text-left">
              <p className="text-[9px] text-slate-400 uppercase font-bold">Tiempo Ahorrado</p>
              <p className="text-xs font-black text-white">~15 horas / mes en cuadres</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Award size={18} className="text-teal-400 shrink-0" />
            <div className="text-left">
              <p className="text-[9px] text-slate-400 uppercase font-bold">Comisión Delivery</p>
              <p className="text-xs font-black text-emerald-400">0% de peaje a terceros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Comparativa Rápida para el Pitch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Antiguo Método */}
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-black uppercase text-red-400 block tracking-wider">
            ❌ Sistemas Tradicionales
          </span>
          <div className="space-y-1 text-xs text-slate-300">
            <p>• Comisiones bancarias/terminales: ~${traditionalPaymentFees.toFixed(0)} USD</p>
            <p>• Apps de delivery (25% comisión): ~${traditionalDeliveryCuts.toFixed(0)} USD</p>
            <p>• Cuadres manuales y vueltos erróneos: ~$45 USD</p>
            <p className="font-black text-red-400 pt-1 border-t border-red-500/20 font-mono">
              Gasto Total: -${traditionalTotalMonthlyCost.toFixed(0)} USD / mes
            </p>
          </div>
        </div>

        {/* KFS OS / Axis Nitro */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
            ✓ Con Axis Nitro / KFS OS
          </span>
          <div className="space-y-1 text-xs text-slate-300">
            <p>• Micro-fee plano: ~${kfsPaymentFees.toFixed(0)} USD</p>
            <p>• Delivery directo con motorizados propios: $0 comisiones</p>
            <p>• Cuadres exactos y conversión BCV automática: $0 pérdidas</p>
            <p className="font-black text-emerald-400 pt-1 border-t border-emerald-500/20 font-mono">
              Costo Total: ~${kfsTotalMonthlyCost.toFixed(0)} USD / mes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
