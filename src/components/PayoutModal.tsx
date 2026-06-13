"use client";

import React, { useState } from "react";
import { DollarSign, Landmark, X, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export const PayoutModal = ({ maxAmount, currency, onConfirm, onCancel, formatMoney }: any) => {
  const [amount, setAmount] = useState<string>("");
  const [bankDetails, setBankDetails] = useState<string>("");

  const parsedAmount = parseFloat(amount) || 0;
  const isAmountValid = parsedAmount > 0 && parsedAmount <= maxAmount;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] flex items-center justify-center p-4 animate-fade-in">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] border border-[#C5A184]/20 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A184]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/20 rounded-full blur-2xl -z-10"></div>

        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#C5A184]/10 flex items-center justify-center border border-[#C5A184]/30">
            <Landmark className="text-[#C5A184]" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Solicitar Retiro</h3>
            <p className="text-xs text-[#C5A184] font-bold tracking-widest uppercase font-mono">Liquidación de Fondos</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Disponible:</span>
            <span className="text-xl font-black text-green-400">{formatMoney(maxAmount)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={14} className="text-[#C5A184]"/> Monto a Retirar ({currency})
            </label>
            <input 
              type="number" 
              placeholder={`Máximo ${maxAmount}`} 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="w-full bg-black/40 border border-[#C5A184]/30 rounded-xl px-5 py-4 font-black text-white text-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all"
            />
            {!isAmountValid && amount !== "" && (
              <p className="text-xs font-bold text-red-400">Monto inválido o superior al disponible.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Datos Bancarios (Destino)</label>
            <textarea 
              placeholder="Ej: Banco Mercantil, Cuenta: 0105..., CI: V-1234..." 
              value={bankDetails} 
              onChange={e => setBankDetails(e.target.value)} 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C5A184] resize-none h-24"
            ></textarea>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 flex gap-3">
            <Shield className="text-blue-400 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] text-blue-300 font-medium leading-relaxed">
              Las liquidaciones son procesadas por el equipo de KFS Core en un lapso de 24 a 48 horas hábiles tras la validación de los fondos.
            </p>
          </div>

          <button 
            disabled={!isAmountValid || !bankDetails.trim()}
            onClick={() => onConfirm(parsedAmount, bankDetails)} 
            className="w-full py-4 rounded-xl font-black text-[#0A1128] bg-[#C5A184] hover:bg-[#d8b59a] shadow-[0_0_20px_rgba(197,161,132,0.3)] hover:shadow-[0_0_30px_rgba(197,161,132,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <CheckCircle size={20} /> Solicitar {formatMoney(parsedAmount)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
