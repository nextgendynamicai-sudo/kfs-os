"use client";

import React, { useState } from "react";
import { X, ShieldAlert, DollarSign, Calculator, Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import { motion, AnimatePresence } from "framer-motion";

interface BlindCashCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    declaredUSD: number;
    declaredBs: number;
    declaredDigitalUSD: number;
    notes: string;
  }) => void;
  bcvRate: number;
  terminalName?: string;
  cashierName?: string;
}

export const BlindCashCountModal: React.FC<BlindCashCountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bcvRate = 36.5,
  terminalName = "Caja Principal",
  cashierName = "Cajero"
}) => {
  const [cashUSD, setCashUSD] = useState("");
  const [cashBs, setCashBs] = useState("");
  const [digitalUSD, setDigitalUSD] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numCashUSD = parseFloat(cashUSD) || 0;
  const numCashBs = parseFloat(cashBs) || 0;
  const numDigitalUSD = parseFloat(digitalUSD) || 0;

  const bsInUSD = bcvRate > 0 ? numCashBs / bcvRate : 0;
  const totalDeclaredUSD = numCashUSD + bsInUSD + numDigitalUSD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onConfirm({
        declaredUSD: numCashUSD,
        declaredBs: numCashBs,
        declaredDigitalUSD: numDigitalUSD,
        notes: notes.trim()
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-950 border border-violet-800/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-violet-900/40 bg-gradient-to-r from-violet-950/70 to-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  Arqueo Ciego de Caja
                </h3>
                <p className="text-[11px] text-violet-300 font-mono">
                  {terminalName} • Cajero: {cashierName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-200">
            {/* Aviso de Auditoría Ciega */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-3">
              <ShieldAlert className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">Auditoría Ciega Activa</strong>
                Ingresa el conteo físico exacto de tu gaveta. El total del sistema se revelará tras confirmar el cierre y generará el Reporte Z de turno.
              </div>
            </div>

            {/* Inputs de Conteo */}
            <div className="space-y-4">
              {/* Efectivo USD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>💵 Efectivo Físico en Dólares (USD)</span>
                  <span className="text-[10px] text-violet-400 font-mono">Billetes en gaveta</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={cashUSD}
                    onChange={(e) => setCashUSD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              {/* Efectivo Bs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>🇻🇪 Efectivo Físico en Bolívares (Bs)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Tasa BCV: Bs. {bcvRate.toFixed(2)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Bs</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={cashBs}
                    onChange={(e) => setCashBs(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                {numCashBs > 0 && (
                  <p className="text-[10px] text-slate-400 font-mono text-right">
                    Equivalente: ≈ ${bsInUSD.toFixed(2)} USD
                  </p>
                )}
              </div>

              {/* Pagos Digitales Declarados */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>📱 Comprobantes Digitales / Pago Móvil (USD equiv.)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Total comprobantes</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={digitalUSD}
                    onChange={(e) => setDigitalUSD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Observaciones o Novedades de Turno (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Billetes deteriorados, vuelto en caramelos, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Total Declarado Preview */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-mono">Total Físico Declarado</span>
                <span className="text-xl font-black text-violet-400 font-mono">
                  ${totalDeclaredUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <span>Cálculo Ciego</span>
                <br />
                <span className="text-slate-400 font-mono">BCV: {bcvRate.toFixed(2)}</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 px-4 rounded-xl transition-colors text-xs cursor-pointer border border-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-violet-900/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Confirmar y Cerrar (Z)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </ModalPortal>
  );
};
