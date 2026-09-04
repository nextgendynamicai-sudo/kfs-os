"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { KFS_BRAND } from "../config/brandConfig";
import { ModalPortal } from "./ModalPortal";
import { Printer, Download, X, QrCode, Sparkles, ShieldCheck, Smartphone, Gift } from "lucide-react";

interface CounterDisplayQRModalProps {
  client: any;
  onClose: () => void;
}

export const CounterDisplayQRModal: React.FC<CounterDisplayQRModalProps> = ({ client, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const storeName = client?.company || client?.name || "Mi Comercio KFS";
  const storeId = client?.id || "comercio_demo";
  const storeUrl = `https://kfs-os.vercel.app/card/${storeId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white animate-fade-in">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #kfs-printable-standee, #kfs-printable-standee * {
              visibility: visible !important;
            }
            #kfs-printable-standee {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 2rem !important;
              box-shadow: none !important;
              border: 2px solid #000 !important;
            }
          }
        `}} />

        <div className="w-full max-w-lg bg-slate-900 border border-violet-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 relative print:border-none print:bg-white print:p-0">
          {/* Close button (hidden on print) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer print:hidden"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center print:hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Kit Oficial de Mostrador KFS
            </div>
            <h2 className="text-xl font-black text-white">Exhibidor QR para Clientes</h2>
            <p className="text-xs text-gray-400">Imprime este exhibidor para colocarlo en tu caja o en las mesas del local.</p>
          </div>

          {/* Printable Standee Card */}
          <div
            id="kfs-printable-standee"
            ref={qrRef}
            className="w-full bg-gradient-to-b from-slate-950 via-violet-950 to-slate-950 text-white border-4 border-violet-500 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden print:border-4 print:border-black print:text-black print:from-white print:via-white print:to-white"
          >
            {/* Top Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/30 border border-violet-400/50 text-violet-200 text-xs font-black uppercase tracking-widest mb-4 print:bg-gray-100 print:text-black print:border-black">
              <ShieldCheck size={16} /> Punto de Pago & Lealtad Verificado
            </div>

            {/* Store Brand / Logo */}
            <h1 className="text-2xl font-black text-white tracking-tight uppercase mb-1 print:text-black">
              {storeName}
            </h1>
            <p className="text-xs text-violet-300 font-mono tracking-wider uppercase mb-6 print:text-gray-700">
              {KFS_BRAND.productAcronym} OS · Red Comercial
            </p>

            {/* High-Contrast QR Container */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.3)] border-4 border-violet-400/40 mb-6 flex flex-col items-center print:border-2 print:border-black print:shadow-none">
              <QRCodeSVG
                value={storeUrl}
                size={220}
                level="H"
                includeMargin={false}
              />
              <span className="text-[10px] font-mono text-gray-800 font-bold mt-3 tracking-widest uppercase">
                ID: {storeId}
              </span>
            </div>

            {/* Instructions */}
            <h3 className="text-lg font-black text-violet-200 uppercase tracking-wide mb-2 flex items-center justify-center gap-2 print:text-black">
              <Smartphone size={20} /> Escanea con tu Cámara
            </h3>
            <p className="text-xs text-gray-300 max-w-xs leading-relaxed mb-6 print:text-gray-800">
              Paga al instante con <strong className="text-white print:text-black">Pago Móvil, Binance, Zinli o Efectivo</strong> y acumula <strong className="text-emerald-400 print:text-black">Puntos K-Points</strong> en cada compra.
            </p>

            {/* Supported Badges */}
            <div className="grid grid-cols-4 gap-2 w-full pt-4 border-t border-violet-800/40 print:border-black text-[10px] font-bold text-gray-300 print:text-black">
              <div className="bg-white/10 print:bg-gray-100 p-2 rounded-xl">🇻🇪 Pago Móvil</div>
              <div className="bg-white/10 print:bg-gray-100 p-2 rounded-xl">🟡 Binance Pay</div>
              <div className="bg-white/10 print:bg-gray-100 p-2 rounded-xl">🟣 Zinli / Wally</div>
              <div className="bg-white/10 print:bg-gray-100 p-2 rounded-xl flex items-center justify-center gap-1">
                <Gift size={12} className="text-emerald-400" /> K-Points
              </div>
            </div>
          </div>

          {/* Action Bar (Print / Close) */}
          <div className="w-full flex items-center justify-between gap-3 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="flex-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Printer size={16} /> Imprimir Exhibidor de Mostrador
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
