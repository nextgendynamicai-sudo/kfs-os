"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, RefreshCw, Copy, Check, Calculator, ArrowRightLeft, Sparkles, X } from "lucide-react";

interface SmartChangeCalculatorProps {
  totalDueUSD: number;
  bcvRate: number;
  onClose?: () => void;
  onApplyChange?: (changeUSD: number, changeVES: number) => void;
}

export const SmartChangeCalculator: React.FC<SmartChangeCalculatorProps> = ({
  totalDueUSD,
  bcvRate = 60,
  onClose,
  onApplyChange
}) => {
  const [tenderedUSD, setTenderedUSD] = useState<string>("");
  const [tenderedVES, setTenderedVES] = useState<string>("");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "VES">("USD");
  const [copied, setCopied] = useState(false);

  const totalDueVES = useMemo(() => {
    return totalDueUSD * bcvRate;
  }, [totalDueUSD, bcvRate]);

  // Total pagado consolidado en USD
  const totalPaidInUSD = useMemo(() => {
    const paidUSD = parseFloat(tenderedUSD) || 0;
    const paidVES = (parseFloat(tenderedVES) || 0) / (bcvRate || 1);
    return paidUSD + paidVES;
  }, [tenderedUSD, tenderedVES, bcvRate]);

  // Total cambio en USD
  const changeUSD = useMemo(() => {
    return Math.max(0, totalPaidInUSD - totalDueUSD);
  }, [totalPaidInUSD, totalDueUSD]);

  // Total cambio en VES
  const changeVES = useMemo(() => {
    return changeUSD * bcvRate;
  }, [changeUSD, bcvRate]);

  // Desglose Mixto (Billetes redondos de $ + saldo restante en Bs)
  const mixedBreakdown = useMemo(() => {
    const wholeUSD = Math.floor(changeUSD);
    const fractionalUSD = changeUSD - wholeUSD;
    const remainingVES = fractionalUSD * bcvRate;

    return {
      wholeUSD,
      remainingVES: Number(remainingVES.toFixed(2))
    };
  }, [changeUSD, bcvRate]);

  const quickDollarBills = [5, 10, 20, 50, 100];

  const handleQuickBill = (amount: number) => {
    setTenderedUSD(amount.toString());
    setTenderedVES("");
  };

  const handleCopySummary = () => {
    const summary = `🧾 *CÁLCULO DE VUELTO / CAMBIO (KFS OS)*\n` +
      `• Cuenta: $${totalDueUSD.toFixed(2)} USD (Bs. ${totalDueVES.toFixed(2)})\n` +
      `• Pagado: $${totalPaidInUSD.toFixed(2)} USD\n` +
      `---------------------------------\n` +
      `💵 *Vuelto en USD:* $${changeUSD.toFixed(2)} USD\n` +
      `🇻🇪 *Vuelto en Bs (BCV ${bcvRate}):* Bs. ${changeVES.toFixed(2)}\n` +
      `⚡ *Vuelto Mixto Sugerido:* $${mixedBreakdown.wholeUSD} USD + Bs. ${mixedBreakdown.remainingVES.toFixed(2)}`;
    
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-violet-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-5 max-w-md w-full animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              Calculadora de Vueltos Mixtos <Sparkles size={14} className="text-amber-400" />
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Tasa BCV: Bs. {bcvRate.toFixed(2)} / USD
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Monto a Cobrar */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total a Cobrar</span>
          <p className="text-2xl font-black text-amber-400 font-mono">
            ${totalDueUSD.toFixed(2)} <span className="text-xs text-slate-400">USD</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Equivalente BCV</span>
          <p className="text-lg font-black text-emerald-400 font-mono">
            Bs. {totalDueVES.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Input de Pago Recibido */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-300">
            ¿Cuánto entrega el cliente?
          </label>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveCurrency("USD")}
              className={`px-2.5 py-1 rounded text-[10px] font-black cursor-pointer border-none transition-all ${
                activeCurrency === "USD" ? "bg-violet-600 text-white" : "text-slate-400 bg-transparent"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setActiveCurrency("VES")}
              className={`px-2.5 py-1 rounded text-[10px] font-black cursor-pointer border-none transition-all ${
                activeCurrency === "VES" ? "bg-emerald-600 text-white" : "text-slate-400 bg-transparent"
              }`}
            >
              Bs. VES
            </button>
          </div>
        </div>

        {activeCurrency === "USD" ? (
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="any"
              value={tenderedUSD}
              onChange={(e) => setTenderedUSD(e.target.value)}
              placeholder="Ej: 20"
              className="w-full bg-slate-800 border border-violet-500/30 rounded-xl pl-7 pr-4 py-2.5 text-white font-mono font-bold text-base focus:outline-none focus:border-violet-500"
              autoFocus
            />
          </div>
        ) : (
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400 font-bold">Bs.</span>
            <input
              type="number"
              step="any"
              value={tenderedVES}
              onChange={(e) => setTenderedVES(e.target.value)}
              placeholder="Ej: 1500"
              className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>
        )}

        {/* Billetes rápidos de USD */}
        <div className="flex gap-1.5 pt-1">
          {quickDollarBills.map((bill) => (
            <button
              key={bill}
              onClick={() => handleQuickBill(bill)}
              className="flex-1 py-1.5 bg-slate-800/80 hover:bg-violet-950/40 border border-slate-700 hover:border-violet-500/50 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              ${bill}
            </button>
          ))}
        </div>
      </div>

      {/* Opciones de Vuelto Calculadas */}
      {totalPaidInUSD > totalDueUSD ? (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Desglose de Vueltos Disponibles
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Opción 1: Todo en USD */}
            <div className="bg-violet-950/30 border border-violet-500/40 rounded-2xl p-3 text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-violet-300">100% en Dólares</span>
              <p className="text-lg font-black text-white font-mono">
                ${changeUSD.toFixed(2)} <span className="text-[9px] text-violet-300">USD</span>
              </p>
            </div>

            {/* Opción 2: Todo en Bolívares */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-3 text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-emerald-300">100% en Bolívares</span>
              <p className="text-lg font-black text-emerald-400 font-mono">
                Bs. {changeVES.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Opción 3: Mixto Inteligente */}
          {mixedBreakdown.wholeUSD > 0 && mixedBreakdown.remainingVES > 0 && (
            <div className="bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-400/40 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-black text-amber-400 flex items-center gap-1">
                  ⚡ Vuelto Mixto Recomendado
                </span>
                <p className="text-xs text-slate-300 font-bold mt-0.5">
                  <span className="text-white font-black text-sm">${mixedBreakdown.wholeUSD} USD</span> en billete +{" "}
                  <span className="text-emerald-400 font-black text-sm">Bs. {mixedBreakdown.remainingVES.toFixed(2)}</span> en Pago Móvil/Efectivo
                </p>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "¡Copiado!" : "Copiar Vuelto"}
            </button>

            {onApplyChange && (
              <button
                onClick={() => onApplyChange(changeUSD, changeVES)}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all border-none cursor-pointer"
              >
                ✓ Aplicar a Caja
              </button>
            )}
          </div>
        </div>
      ) : totalPaidInUSD > 0 && totalPaidInUSD < totalDueUSD ? (
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-3 text-center space-y-1">
          <span className="text-xs font-bold text-red-400">⚠️ Monto insuficiente</span>
          <p className="text-xs text-slate-300">
            Faltan <strong className="text-red-300 font-mono">${(totalDueUSD - totalPaidInUSD).toFixed(2)} USD</strong> (Bs. {((totalDueUSD - totalPaidInUSD) * bcvRate).toFixed(2)})
          </p>
        </div>
      ) : null}
    </div>
  );
};
