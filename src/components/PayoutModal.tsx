"use client";

import { KFS_BRAND } from "../config/brandConfig";
import React, { useState } from "react";
import { DollarSign, Landmark, X, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export const PayoutModal = ({ maxAmount, currency, onConfirm, onCancel, formatMoney }: any) => {
  const [amount, setAmount] = useState<string>("");
  const [banco, setBanco] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const withdrawalFee = parsedAmount * 0.02;
  const totalToDeduct = parsedAmount + withdrawalFee;
  const isAmountValid = parsedAmount > 0 && totalToDeduct <= maxAmount;

  return (
    <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-white to-sky-50 border border-sky-200 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/20 rounded-full blur-2xl -z-10"></div>

        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-sky-950/50 hover:text-sky-950 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-sky-600/10 flex items-center justify-center border border-sky-200">
            <Landmark className="text-sky-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-sky-950">Solicitar Retiro</h3>
            <p className="text-xs text-sky-600 font-bold tracking-widest uppercase font-mono">Liquidación de Fondos</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disponible:</span>
            <span className="text-xl font-black text-green-400">{formatMoney(maxAmount)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={14} className="text-sky-600"/> Monto a Retirar ({currency})
            </label>
            <input 
              type="number" 
              placeholder={`Monto a recibir`} 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="w-full bg-white border border-sky-200 rounded-xl px-5 py-4 font-black text-sky-950 text-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all"
            />
            {parsedAmount > 0 && (
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 px-1 font-mono">
                <span>Comisión {KFS_BRAND.productAcronym} (2%): <strong className="text-red-400">{formatMoney(withdrawalFee)}</strong></span>
                <span>Total a Debitar: <strong className="text-sky-950">{formatMoney(totalToDeduct)}</strong></span>
              </div>
            )}
            {!isAmountValid && amount !== "" && (
              <p className="text-xs font-bold text-red-400 mt-1">El total a debitar supera tu saldo disponible.</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Datos de Pago Móvil (Destino)</label>
            <select 
              value={banco} 
              onChange={e => setBanco(e.target.value)} 
              className="w-full bg-white border border-sky-100 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C5A184]"
            >
              <option value="">— Selecciona Banco —</option>
              {["Banesco", "Mercantil", "Banco de Venezuela", "Provincial", "BOD", "Bancaribe", "Bicentenario", "BNC", "Exterior", "Tesoro"].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="tel" placeholder="Teléfono (Ej: 0414...)" value={telefono} onChange={e => setTelefono(e.target.value)} 
                className="w-full bg-white border border-sky-100 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" 
              />
              <input 
                type="text" placeholder="Cédula Titular" value={cedula} onChange={e => setCedula(e.target.value)} 
                className="w-full bg-white border border-sky-100 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" 
              />
            </div>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 flex gap-3">
            <Shield className="text-blue-400 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] text-blue-300 font-medium leading-relaxed">
              Las liquidaciones son procesadas por el equipo de {KFS_BRAND.productAcronym} Core en un lapso de 24 a 48 horas hábiles.
            </p>
          </div>

          <button 
            disabled={!isAmountValid || !banco || !telefono || !cedula}
            onClick={() => onConfirm(parsedAmount, JSON.stringify({ banco, telefono, cedula }))} 
            className="w-full py-4 rounded-xl font-black text-white bg-sky-600 hover:bg-[#d8b59a] shadow-[0_0_20px_rgba(197,161,132,0.3)] hover:shadow-[0_0_30px_rgba(197,161,132,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-gray-600 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <CheckCircle size={20} /> Solicitar Retiro
          </button>
        </div>
      </motion.div>
    </div>
  );
};
