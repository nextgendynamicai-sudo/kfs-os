"use client";

import React, { useState, useEffect } from "react";
import { playCashDrawerSound, announcePaymentVoice } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModalPortal } from "./ModalPortal";
import { 
  X, Printer, Volume2, Share2, DollarSign, QrCode, 
  CheckCircle2, AlertTriangle, Scissors, Sparkles, MessageCircle
} from "lucide-react";

export const ReceiptModal = ({ 
  tx, 
  product, 
  onClose, 
  formatUSD, 
  triggerGhostTrap, 
  showToast, 
  currentUser 
}: any) => {
  const [thermalWidth, setThermalWidth] = useState<"58mm" | "80mm">("58mm");
  const [whatsappPhone, setWhatsappPhone] = useState(tx?.customerPhone || "");
  const [showAnnulConfirm, setShowAnnulConfirm] = useState(false);
  const [isTorn, setIsTorn] = useState(false);

  useEffect(() => {
    if (!tx) return;
    try {
      playCashDrawerSound();
    } catch (_) {}
  }, [tx]);

  if (!tx) return null;

  const handleFinishSale = () => {
    setIsTorn(true);
    try {
      playCashDrawerSound();
    } catch (_) {}
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const handlePrint = () => {
    if (showToast) showToast(`Enviando a tiquetera térmica ${thermalWidth}...`, "success");
    try {
      playCashDrawerSound();
    } catch (_) {}
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const exchangeRate = tx.exchangeRateBCV || 893.22;
  const totalUSD = tx.amountUSD || 0;
  const totalBs = (totalUSD * exchangeRate).toFixed(2);
  const clientName = tx.clientName || product?.clientName || currentUser?.company || "Bodegón & Market Gourmet Caracas";

  const cleanPhone = (whatsappPhone || "").replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('58') 
    ? cleanPhone 
    : (cleanPhone.startsWith('0') ? `58${cleanPhone.slice(1)}` : `58${cleanPhone}`);

  const itemSummaryText = tx.cartItems && tx.cartItems.length > 0
    ? tx.cartItems.map((i: any) => `${i.quantity || i.qty || 1}x ${i.name}`).join(', ')
    : (product?.name || tx.productName || 'Compra en Mostrador');

  const whatsappMessage = `Hola ${tx.customerName || 'Cliente'}, ¡Gracias por tu compra en *${clientName}*!%0A%0A🧾 *Recibo Oficial: ${tx.receiptNumber || 'POS'}*%0A📦 Detalle: ${itemSummaryText}%0A💵 *Total (USD): ${formatUSD ? formatUSD(totalUSD) : `$${totalUSD.toFixed(2)}`}*%0A🇻🇪 *Total (Bs BCV): Bs. ${totalBs}*%0A📅 Fecha: ${new Date(tx.timestamp || tx.date || Date.now()).toLocaleString()}%0A${tx.kfsPointsEarned > 0 ? `%0A🎁 *¡Acumulaste +${tx.kfsPointsEarned.toFixed(1)} Puntos Axis Rewards!*` : ''}%0A%0AConsulta tu carnet digital y puntos en: https://axisnitro.store/rewards`;

  const whatsappUrl = formattedPhone.length >= 10 ? `https://wa.me/${formattedPhone}?text=${whatsappMessage}` : '#';

  return (
    <ModalPortal>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print, header, nav, aside, button {
            display: none !important;
          }
          .receipt-modal-backdrop {
            background: transparent !important;
            position: static !important;
            padding: 0 !important;
            inset: auto !important;
            display: block !important;
          }
          .receipt-paper-printable {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            clip-path: none !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 auto !important;
          }
          @page {
            margin: 3mm;
            size: auto;
          }
        }
      `}} />
      <div 
        className="receipt-modal-backdrop fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in"
        suppressHydrationWarning
      >
        <motion.div 
          initial={{ y: 35, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`w-full ${thermalWidth === "58mm" ? "max-w-sm sm:max-w-[390px]" : "max-w-md sm:max-w-[470px]"} flex flex-col items-center my-auto drop-shadow-2xl transition-all duration-300 max-h-[96vh] overflow-y-auto hide-scrollbar`}
        >
          {/* ========================================================= */}
          {/* CABECERA: BISEL DE IMPRESORA TÉRMICA & TELEMETRÍA         */}
          {/* ========================================================= */}
          <div className="no-print w-full bg-[#161B26] text-white rounded-t-3xl border-t border-x border-white/10 px-4 py-3 shadow-xl relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-black tracking-wider text-emerald-400 uppercase">
                {tx.isFiscal ? "TFHKA / Fiscal Link Activo" : "POS Térmico Directo"}
              </span>
            </div>

            {/* Selector de Ancho Térmico */}
            <div className="flex items-center bg-black/50 rounded-xl p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setThermalWidth("58mm")}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer border-none ${
                  thermalWidth === "58mm" 
                    ? "bg-amber-400 text-slate-950 shadow-sm" 
                    : "text-slate-400 hover:text-white bg-transparent"
                }`}
                title="Formato de bolsillo 58mm"
              >
                58mm
              </button>
              <button
                type="button"
                onClick={() => setThermalWidth("80mm")}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer border-none ${
                  thermalWidth === "80mm" 
                    ? "bg-amber-400 text-slate-950 shadow-sm" 
                    : "text-slate-400 hover:text-white bg-transparent"
                }`}
                title="Formato de mostrador 80mm"
              >
                80mm
              </button>
            </div>

            {/* Botón Cerrar Rápido */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border-none active:scale-95"
              title="Cerrar Recibo"
            >
              <X size={16} />
            </button>
          </div>

          {/* Ranura de salida del papel (Efecto físico realista) */}
          <div className="no-print w-full bg-[#0D1117] h-3 border-x border-b border-black flex justify-center items-center shadow-inner relative overflow-hidden">
            <div className="w-36 h-0.5 bg-emerald-500/40 animate-pulse"></div>
          </div>

          {/* ========================================================= */}
          {/* TICKET DE PAPEL TÉRMICO (100% VISIBLE Y SIN TRUNCAMIENTOS)*/}
          {/* ========================================================= */}
          <div 
            className={`receipt-paper-printable w-[96%] bg-[#FCFCFD] text-slate-900 shadow-2xl relative transition-all duration-300 ease-out border-x border-slate-300 ${
              isTorn ? "translate-y-4 rotate-1 opacity-0 scale-95" : "opacity-100"
            }`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 12px), 98% 100%, 96% calc(100% - 12px), 94% 100%, 92% calc(100% - 12px), 90% 100%, 88% calc(100% - 12px), 86% 100%, 84% calc(100% - 12px), 82% 100%, 80% calc(100% - 12px), 78% 100%, 76% calc(100% - 12px), 74% 100%, 72% calc(100% - 12px), 70% 100%, 68% calc(100% - 12px), 66% 100%, 64% calc(100% - 12px), 62% 100%, 60% calc(100% - 12px), 58% 100%, 56% calc(100% - 12px), 54% 100%, 52% calc(100% - 12px), 50% 100%, 48% calc(100% - 12px), 46% 100%, 44% calc(100% - 12px), 42% 100%, 40% calc(100% - 12px), 38% 100%, 36% calc(100% - 12px), 34% 100%, 32% calc(100% - 12px), 30% 100%, 28% calc(100% - 12px), 26% 100%, 24% calc(100% - 12px), 22% 100%, 20% calc(100% - 12px), 18% 100%, 16% calc(100% - 12px), 14% 100%, 12% calc(100% - 12px), 10% 100%, 8% calc(100% - 12px), 6% 100%, 4% calc(100% - 12px), 2% 100%, 0% calc(100% - 12px))'
            }}
          >
            <div className="p-5 sm:p-6 pb-10 font-mono text-xs space-y-3">
              {/* Encabezado del Comercio */}
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-950 leading-tight">
                  {clientName}
                </h3>
                <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                  RIF: {currentUser?.rif || "J-50201438-9"}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  BOS CONTROL DIGITAL · VENTA OFICIAL
                </p>
                <p className="text-[9px] text-slate-400 mt-1">
                  {new Date(tx.timestamp || tx.date || Date.now()).toLocaleString("es-VE")}
                </p>
              </div>

              {/* Identidad del Documento Fiscal o POS */}
              <div className="flex flex-col items-center gap-1 border-b border-dashed border-slate-300 pb-3">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  {tx.isFiscal ? "FACTURA FISCAL" : "COMPROBANTE DE PAGO POS"}
                </span>

                {/* Código de barras gráfico */}
                <div className="flex justify-center items-center gap-[1.5px] h-7 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                  <div className="w-1 h-5 bg-black"></div>
                  <div className="w-0.5 h-5 bg-black"></div>
                  <div className="w-1.5 h-5 bg-black"></div>
                  <div className="w-0.5 h-5 bg-black"></div>
                  <div className="w-1 h-5 bg-black"></div>
                  <div className="w-2 h-5 bg-black"></div>
                  <div className="w-0.5 h-5 bg-black"></div>
                  <div className="w-1.5 h-5 bg-black"></div>
                  <div className="w-1 h-5 bg-black"></div>
                  <div className="w-0.5 h-5 bg-black"></div>
                  <div className="w-2 h-5 bg-black"></div>
                  <div className="w-1 h-5 bg-black"></div>
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-800">
                  {tx.isFiscal 
                    ? `FACTURA NRO: 00-${tx.receiptNumber ? tx.receiptNumber.replace(/[^0-9]/g, '').slice(-5) : '25205'}` 
                    : (tx.receiptNumber || `POS-${Date.now().toString().slice(-6)}`)}
                </span>
                {tx.isFiscal && (
                  <span className="text-[8px] font-mono text-slate-500">
                    MÁQUINA FISCAL: Z1F-00129841
                  </span>
                )}
              </div>

              {/* Detalle de Productos (100% sin truncamientos ni '...') */}
              <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
                <div className="text-[9px] font-bold text-slate-400 flex justify-between uppercase pb-0.5">
                  <span>Cant / Descripción</span>
                  <span>Total</span>
                </div>

                {tx.cartItems && tx.cartItems.length > 0 ? (
                  tx.cartItems.map((item: any, idx: number) => {
                    const itemQty = item.quantity || item.qty || 1;
                    const itemPrice = item.priceUSD || 0;
                    const itemTotal = itemPrice * itemQty;
                    return (
                      <div key={idx} className="flex justify-between items-start gap-2 text-[11px] leading-tight">
                        <div className="flex-1 text-left min-w-0">
                          <span className="font-bold text-slate-900 break-words block">
                            {itemQty}x {item.name}
                          </span>
                          {itemPrice > 0 && (
                            <span className="block text-[9px] text-slate-500 mt-0.5">
                              @ {formatUSD ? formatUSD(itemPrice) : `$${itemPrice.toFixed(2)}`} c/u
                            </span>
                          )}
                        </div>
                        <div className="text-right whitespace-nowrap shrink-0 pl-2">
                          <span className="font-black text-slate-950 font-mono">
                            {formatUSD ? formatUSD(itemTotal) : `$${itemTotal.toFixed(2)}`}
                          </span>
                          <span className="text-[9px] text-slate-500 ml-1 font-bold">
                            {tx.isFiscal ? "(G)" : "(E)"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-between items-start gap-2 text-[11px] leading-tight">
                    <div className="flex-1 text-left min-w-0">
                      <span className="font-bold text-slate-900 break-words block">
                        1x {product?.name || tx.productName || "Consumo en Mostrador"}
                      </span>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0 pl-2">
                      <span className="font-black text-slate-950 font-mono">
                        {formatUSD ? formatUSD(totalUSD) : `$${totalUSD.toFixed(2)}`}
                      </span>
                      <span className="text-[9px] text-slate-500 ml-1 font-bold">
                        {tx.isFiscal ? "(G)" : "(E)"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Desglose Financiero */}
              <div className="space-y-1 text-[11px] font-semibold text-slate-700 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span>{tx.isFiscal ? "BASE IMPONIBLE:" : "SUBTOTAL:"}</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {formatUSD ? formatUSD(tx.baseUSD || tx.subtotalUSD || totalUSD) : `$${(tx.baseUSD || totalUSD).toFixed(2)}`}
                  </span>
                </div>

                {tx.isFiscal && (
                  <div className="flex justify-between text-slate-600">
                    <span>EXENTO (E):</span>
                    <span className="font-mono font-bold">$0.00</span>
                  </div>
                )}

                {tx.ivaUSD > 0 && (
                  <div className="flex justify-between text-slate-800">
                    <span>IVA (16%):</span>
                    <span className="font-mono font-bold text-emerald-800">
                      +{formatUSD ? formatUSD(tx.ivaUSD) : `$${tx.ivaUSD.toFixed(2)}`}
                    </span>
                  </div>
                )}

                {tx.igtfUSD > 0 && (
                  <div className="flex justify-between text-slate-800">
                    <span>IGTF (3%):</span>
                    <span className="font-mono font-bold text-amber-800">
                      +{formatUSD ? formatUSD(tx.igtfUSD) : `$${tx.igtfUSD.toFixed(2)}`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-1">
                  <span className="text-[10px] text-slate-500 uppercase">MÉTODO:</span>
                  <span className="font-mono uppercase text-slate-900 font-bold text-[10px]">
                    {(tx.paymentMethod || "cash_usd").replace(/_/g, ' ')}
                  </span>
                </div>

                {tx.reference && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-500">REF BANCARIA:</span>
                    <span className="font-mono text-slate-900 font-bold text-[10px]">{tx.reference}</span>
                  </div>
                )}
              </div>

              {/* Conversión Oficial BCV (SUNDDE) */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>TASA OFICIAL BCV:</span>
                  <span className="font-mono font-bold">{exchangeRate.toFixed(2)} Bs</span>
                </div>
                <div className="flex justify-between text-slate-950 font-black text-xs pt-0.5">
                  <span>TOTAL Bs:</span>
                  <span className="font-mono font-black text-sm text-slate-900">
                    {totalBs} Bs
                  </span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* RECUADRO DESTACADO: TOTAL CANCELADO (TOTALMENTE VISIBLE) */}
              {/* ========================================================= */}
              <div className="bg-slate-100/90 border border-slate-300/80 rounded-2xl p-4 text-center shadow-inner my-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  TOTAL CANCELADO
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-950 block font-mono tracking-tight leading-none my-1">
                  {formatUSD ? formatUSD(totalUSD) : `$${totalUSD.toFixed(2)}`}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 block mt-1">
                  Equivalente BCV: Bs. {totalBs}
                </span>

                {tx.kfsPointsEarned > 0 && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 bg-violet-100 text-violet-900 px-3 py-1 rounded-full text-[10px] font-bold border border-violet-200">
                    <Sparkles size={12} className="text-violet-600" />
                    <span>+{tx.kfsPointsEarned.toFixed(1)} Puntos Axis Rewards Ganados</span>
                  </div>
                )}
              </div>

              {/* Mensaje de fidelidad y pie */}
              <div className="text-center text-[9px] text-slate-500 pt-1 space-y-0.5">
                <p className="font-bold text-slate-800 uppercase tracking-wider">¡Gracias por su compra!</p>
                <p className="text-[8px] text-slate-400">Comprobante digital verificado por Axis Nitro OS</p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PANEL DE ACCIONES Y HARDWARE (SEPARADO Y NÍTIDO)          */}
          {/* ========================================================= */}
          <div className="no-print w-full bg-[#151924] text-white rounded-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3 mt-3 z-10">
            {/* Fila de Utilidades de Hardware */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={playCashDrawerSound} 
                className="py-2.5 px-2 rounded-xl font-bold text-xs text-violet-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                title="Abrir gaveta de dinero"
              >
                <span>💸 Gaveta</span>
              </button>

              <button 
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-2 rounded-xl font-bold text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                title={`Imprimir ticket en rollo de ${thermalWidth}`}
              >
                <Printer size={14} />
                <span>{thermalWidth}</span>
              </button>

              <button 
                type="button"
                onClick={() => announcePaymentVoice(totalUSD, tx.paymentMethod)}
                className="py-2.5 px-2 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                title="Anunciar pago en altavoz"
              >
                <Volume2 size={14} />
                <span>Parlante</span>
              </button>
            </div>

            {/* Fila WhatsApp Directo */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  placeholder="WhatsApp (ej: 04141234567)"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  maxLength={15}
                  className="flex-1 min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (formattedPhone.length < 10) {
                      e.preventDefault();
                      if (showToast) showToast("Ingresa un número de WhatsApp válido (ej: 04141234567).", "warning");
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl font-black text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 shrink-0 uppercase tracking-tight"
                >
                  <MessageCircle size={15} className="fill-slate-950" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-[9px] text-slate-400 px-1">
                Envía el comprobante digital al WhatsApp del cliente con 1 toque sin gastar papel.
              </p>
            </div>

            {/* Botones de Finalización / Despacho */}
            <div className="flex items-center gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setShowAnnulConfirm(true)}
                className="py-3 px-3.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold rounded-xl text-xs transition-all cursor-pointer border border-red-500/30 active:scale-95 shrink-0"
                title="Anular venta y auditar"
              >
                Anular
              </button>

              <button 
                type="button"
                onClick={handleFinishSale}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-violet-600/30 active:scale-95 transition-all cursor-pointer border border-violet-400/40 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Scissors size={15} className="rotate-90" />
                <span>Rasgar Recibo y Volver</span>
              </button>
            </div>
          </div>

          {/* Diálogo de Confirmación de Anulación (Seguridad Ghost Trap) */}
          <AnimatePresence>
            {showAnnulConfirm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
              >
                <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-3xl">
                    🚨
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">¿Confirmar Anulación?</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Esta acción auditará la transacción de <strong>{formatUSD ? formatUSD(totalUSD) : `$${totalUSD.toFixed(2)}`}</strong> mediante el protocolo antifraude.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAnnulConfirm(false)}
                      className="flex-1 py-3 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAnnulConfirm(false);
                        if (showToast) showToast("Procesando anulación con Ghost Trap...", "error");
                        setTimeout(() => {
                          if (triggerGhostTrap) {
                            triggerGhostTrap(currentUser?.id, totalUSD, tx.paymentMethod);
                          }
                          window.location.reload();
                        }, 1000);
                      }}
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer border-none"
                    >
                      Sí, Anular
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ModalPortal>
  );
};
