"use client";

import React, { useState, useEffect } from "react";

import { useKFS } from "../context/KFSContext";
import { playCashDrawerSound } from "../lib/utils";
import { motion } from "framer-motion";

export const ReceiptModal = ({ tx, product, onClose, formatUSD, triggerGhostTrap, showToast, currentUser }: any) => {
  const [isPrinting, setIsPrinting] = useState(true);
  const [isTorn, setIsTorn] = useState(false);

  useEffect(() => {
    if (!tx) return;
    setIsPrinting(true);
    
    // Play paper feed tick sounds
    let tickCount = 0;
    const playTick = () => {
      if (tickCount >= 3) {
        setIsPrinting(false);
        return;
      }
      playCashDrawerSound(); // Play cash chime or quick feed tick
      tickCount++;
      setTimeout(playTick, 250);
    };
    playTick();
  }, [tx]);

  if (!tx) return null;

  const handleTearPaper = () => {
    setIsTorn(true);
    playCashDrawerSound();
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-xl z-[70] flex items-center justify-center p-4 animate-fade-in">
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm flex flex-col items-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        
        {/* Physical Printer Bezel Box */}
        <div className="w-full bg-[#1A1F2C] rounded-t-[2.5rem] border border-sky-100 p-5 shadow-2xl relative flex flex-col items-center gap-2">
          {/* Status Telemetry Light */}
          <div className="absolute left-6 top-6 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-green-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[8px] font-mono font-black text-green-400 tracking-widest">{tx.isFiscal ? "TFHKA / Fiscal Link Activo" : "WebUSB ESC/POS DIRECTA"}</span>
          </div>

          <div className="h-4"></div>

          {/* Printer Output Mouth */}
          <div className="w-full bg-[#0F131E] h-5 rounded-lg border-b border-black flex justify-center items-center shadow-inner relative overflow-hidden">
            <div className="w-48 h-1 bg-red-500/20 animate-pulse relative">
              <div className="absolute top-0 left-0 h-full bg-sky-600 w-2 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Paper Receipt Roll-out Container */}
        <div className={`w-[90%] bg-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-out border-x border-gray-200 ${isPrinting ? "h-0 opacity-0" : "h-auto opacity-100"} ${isTorn ? "translate-y-4 rotate-2 opacity-0 scale-95" : ""}`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 98%, 97% 100%, 94% 98%, 91% 100%, 88% 98%, 85% 100%, 82% 98%, 79% 100%, 76% 98%, 73% 100%, 70% 98%, 67% 100%, 64% 98%, 61% 100%, 58% 98%, 55% 100%, 52% 98%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 37% 100%, 34% 98%, 31% 100%, 28% 98%, 25% 100%, 22% 98%, 19% 100%, 16% 98%, 13% 100%, 10% 98%, 7% 100%, 4% 98%, 0% 100%)' }}>
          
          <div className="p-6 pt-4 font-mono text-white text-xs space-y-4">
            
            {/* Header Receipt */}
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <h3 className="text-sm font-black tracking-widest uppercase mb-1">{product?.clientName || "KFS ECOSISTEMA"}</h3>
              <p className="text-[10px] text-slate-400 font-bold">RIF: J-50201438-9</p>
              <p className="text-[10px] text-slate-400">BOS CONTROL DIGITAL</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>

            {/* Receipt Control Barcode (Pure CSS) */}
            <div className="flex flex-col items-center gap-1 border-b border-dashed border-gray-300 pb-3 mt-3">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest">{tx.isFiscal ? "Factura Fiscal" : "Recibo KFS Control"}</span>
              <div className="flex justify-center items-center gap-[1px] h-8 bg-gray-50 px-3 py-1 border border-gray-200/50 rounded">
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1.5 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1.5 h-6 bg-black"></div>
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-700">{tx.isFiscal ? `FACTURA NRO: 00-${Math.floor(10000 + Math.random() * 89999)}` : tx.receiptNumber}</span>
              {tx.isFiscal && <span className="text-[8px] font-mono text-slate-400">MÁQUINA FISCAL: Z1F-00129841</span>}
            </div>

            {/* Financial Ledger Details */}
            <div className="space-y-1 text-[11px] font-bold text-gray-700 border-b border-dashed border-gray-300 pb-3 mt-3">
              <div className="flex justify-between"><span>PRODUCTO:</span> <span className="text-gray-900 font-black uppercase text-right truncate max-w-[130px]">{product?.name} {tx.isFiscal ? "(G)" : "(E)"}</span></div>
              <div className="flex justify-between"><span>{tx.isFiscal ? "BASE IMPONIBLE:" : "SUBTOTAL:"}</span> <span className="text-gray-900">{formatUSD(tx.baseUSD || tx.amountUSD)}</span></div>
              {tx.isFiscal && <div className="flex justify-between"><span>EXENTO (E):</span> <span className="text-gray-900 font-black">$0.00</span></div>}
              {tx.ivaUSD > 0 && <div className="flex justify-between"><span>IVA (16%):</span> <span className="text-gray-900 font-black">+{formatUSD(tx.ivaUSD)}</span></div>}
              {tx.igtfUSD > 0 && <div className="flex justify-between"><span>IGTF (3%):</span> <span className="text-gray-900 font-black">+{formatUSD(tx.igtfUSD)}</span></div>}
              <div className="flex justify-between"><span>METODO:</span> <span className="text-gray-900 uppercase">{tx.paymentMethod.replace('_', ' ')}</span></div>
              {tx.reference && <div className="flex justify-between"><span>REF:</span> <span className="text-gray-900 font-mono">{tx.reference}</span></div>}
            </div>

            {/* SUNDDE Compliance Section */}
            <div className="space-y-1 text-[10px] font-bold text-slate-400 border-b border-dashed border-gray-300 pb-3 mt-3">
              <div className="flex justify-between"><span>TASA OFICIAL BCV:</span> <span>{tx.exchangeRateBCV?.toFixed(2)} Bs</span></div>
              <div className="flex justify-between text-xs text-gray-900 font-black mt-1"><span>TOTAL Bs:</span> <span>{(tx.amountUSD * (tx.exchangeRateBCV || 36.5)).toFixed(2)} Bs</span></div>
            </div>

            {/* Large Final Total */}
            <div className="text-center py-2 bg-gray-50 border border-gray-100 rounded-xl mt-3">
              <span className="text-[9px] text-slate-500 font-black uppercase block tracking-widest">Total Cancelado</span>
              <span className="text-3xl font-black text-white block">{formatUSD(tx.amountUSD)}</span>
              {tx.kfsPointsEarned > 0 && (
                <div className="mt-1 bg-sky-600/10 rounded-lg py-1 px-2 inline-block">
                  <span className="text-[10px] font-black text-sky-600">+{tx.kfsPointsEarned.toFixed(1)} KFS Pts Ganados</span>
                </div>
              )}
            </div>

            {/* Passive Split Suggestion */}
            <div className="text-center text-[9px] text-slate-500 border-t border-dashed border-gray-300 pt-3 flex flex-col gap-0.5 font-bold mt-3">
              <span>Split KFS: Acreditación Directa Promotora</span>
              <span className="font-mono text-green-600 uppercase">Procesado Exitosamente</span>
            </div>
          </div>
        </div>

        {/* Tactile Hardware Drawer Base */}
        <div className="w-full bg-[#151924] rounded-b-[2.5rem] border border-sky-100 p-5 shadow-2xl flex flex-col gap-3 z-10 -mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button 
              onClick={playCashDrawerSound} 
              className="py-3 rounded-xl font-black text-xs text-sky-600 bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(197,161,132,0.3)] active:scale-95"
            >
              💸 Gaveta
            </button>
            <button 
              onClick={() => {
                showToast("Buscando Impresora Térmica vía WebUSB...", "success");
                setTimeout(() => playCashDrawerSound(), 500);
              }} 
              className="py-3 rounded-xl font-black text-xs text-sky-600 bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              🖨️ Imprimir
            </button>
            
            {tx.customerPhone ? (
              <a 
                href={`https://wa.me/58${tx.customerPhone.replace(/^0+/, '').replace(/[^0-9]/g, '')}?text=Hola ${tx.customerName || 'Cliente'}, ¡Gracias por tu compra en ${product?.clientName || 'KFS ECOSISTEMA'}!%0A%0A*Recibo KFS: ${tx.receiptNumber}*${tx.isFiscal ? `%0A*Factura Fiscal / Control: 00-${Math.floor(10000 + Math.random() * 89999)}*` : ''}%0AProducto: ${product?.name} ${tx.isFiscal ? '(G)' : '(E)'}%0A${tx.isFiscal ? `Base Imponible: ${formatUSD(tx.baseUSD)}%0A` : ''}IVA: ${formatUSD(tx.ivaUSD)}%0AIGTF: ${formatUSD(tx.igtfUSD)}%0A%0ATasa Oficial BCV: ${tx.exchangeRateBCV?.toFixed(2)} Bs%0A*Total Pagado (USD): ${formatUSD(tx.amountUSD)}*%0A*Total Pagado (Bs): ${(tx.amountUSD * (tx.exchangeRateBCV || 36.5)).toFixed(2)} Bs*${tx.kfsPointsEarned > 0 ? `%0A%0A🎁 ¡Felicidades! Acumulaste +${tx.kfsPointsEarned.toFixed(1)} KFS Points con esta compra.` : ''}%0A%0ARecibo Digital Oficial KFS.`}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-xl font-black text-xs text-white bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                💬 Recibo WhatsApp
              </a>
            ) : (
              <button disabled className="py-3 rounded-xl font-bold text-xs text-slate-400 bg-sky-50 border border-white/5 flex items-center justify-center gap-1.5 cursor-not-allowed">
                Sin Teléfono CRM
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button 
              onClick={() => {
                showToast("Procesando anulación...", "error");
                setTimeout(() => {
                  triggerGhostTrap(currentUser.id, tx.amountUSD, tx.paymentMethod);
                  window.location.reload();
                }, 1500);
              }}
              className="w-full sm:w-1/3 py-4 bg-red-900/50 hover:bg-red-800 text-red-100 font-black rounded-2xl text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer border border-red-500/20"
            >
              Anular
            </button>
            <button 
              onClick={handleTearPaper}
              disabled={isPrinting}
              className="w-full sm:w-2/3 py-4 bg-sky-600 hover:bg-[#b08d70] hover:shadow-[0_0_20px_rgba(197,161,132,0.6)] disabled:bg-gray-700 text-white font-black rounded-2xl text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
            ✂️ Rasgar Recibo y Volver
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
