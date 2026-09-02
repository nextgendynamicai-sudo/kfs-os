"use client";

import React, { useState, useEffect, useRef } from "react";
import { KFS_BRAND } from "../config/brandConfig";
import { QrCode, X, Info, Terminal } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { triggerHapticFeedback, playScannerBeep } from "../lib/utils";

export const ScannerView = ({ videoRef, onClose, onScan, myProducts, formatUSD }: any) => {
  const [selectedProductToSimulate, setSelectedProductToSimulate] = useState("");
  const [selectedScanType, setSelectedScanType] = useState("product");
  const [selectedCedula, setSelectedCedula] = useState("PDF417:V25218648JAVIER_CASTILLO_M28051995");
  const localStreamRef = useRef<any>(null);

  useEffect(() => {
    let html5QrCode: any;
    let isComponentMounted = true;

    const startScanner = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!isComponentMounted) return;

        html5QrCode = new Html5Qrcode("kfs-reader");

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText: string) => {
            if (html5QrCode && html5QrCode.isScanning) {
              triggerHapticFeedback([100, 50, 100]);
              playScannerBeep();
              html5QrCode.stop().then(() => {
                onScan(decodedText);
              }).catch(() => {
                onScan(decodedText);
              });
            }
          },
          (errorMessage: string) => {
            // Ignore frame parsing errors
          }
        );
      } catch (err) {
        console.warn(`Cámara física no disponible o permiso no concedido. Se habilita entrada por teclado y códigos ${KFS_BRAND.productAcronym}.`, err);
      }
    };

    startScanner();

    return () => {
      isComponentMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  const handleManualScan = () => {
    triggerHapticFeedback([100, 50, 100]);
    playScannerBeep();
    if (selectedScanType === "product") {
      if (!selectedProductToSimulate) return;
      onScan(selectedProductToSimulate);
    } else {
      if (!selectedCedula) return;
      onScan(selectedCedula);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-br from-violet-900 to-slate-900 border border-violet-800 rounded-[2.5rem] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-violet-200 hover:text-white cursor-pointer">
          <X size={24} />
        </button>
        <h3 className="text-xl font-black text-violet-400 mb-4 flex items-center gap-2"><QrCode /> Terminal de Escaneo {KFS_BRAND.productAcronym}</h3>

        {/* Scan Frame */}
        <div id="kfs-reader" className="relative w-full aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center mb-6">
          {/* Laser animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse border-b-2 border-red-400 z-10 pointer-events-none" style={{ animationDuration: "1.5s", animationIterationCount: "infinite" }} />

          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-center z-10 pointer-events-none">
            <span className="text-[10px] text-violet-200 font-mono flex items-center justify-center gap-1"><Info size={12} /> Buscando QR o Código de Barras...</span>
          </div>
        </div>

        {/* Manual Fallback Entry Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block font-mono">Entrada Manual de Emergencia</span>
          <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
            <button
              type="button"
              onClick={() => setSelectedScanType("product")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "product" ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
            >
              📦 Producto
            </button>
            <button
              type="button"
              onClick={() => setSelectedScanType("cedula")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "cedula" ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
            >
              🪪 Cédula PDF417
            </button>
          </div>

          {selectedScanType === "product" ? (
            <select
              className="w-full bg-slate-900/50 text-white border border-violet-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-violet-500"
              value={selectedProductToSimulate}
              onChange={(e) => setSelectedProductToSimulate(e.target.value)}
            >
              <option value="">-- Seleccionar Producto --</option>
              {myProducts.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} - {formatUSD(p.priceUSD)}</option>
              ))}
            </select>
          ) : (
            <select
              className="w-full bg-slate-900/50 text-white border border-violet-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-violet-500 font-mono"
              value={selectedCedula}
              onChange={(e) => setSelectedCedula(e.target.value)}
            >
              <option value="PDF417:V25218648JAVIER_CASTILLO_M28051995">Cédula V-25.218.648 Javier Castillo (M)</option>
              <option value="PDF417:V12345678MARIA_PEREZ_F15081985">Cédula V-12.345.678 Maria Perez (F)</option>
              <option value="PDF417:E87654321PEDRO_GOMEZ_M10101974">Cédula E-87.654.321 Pedro Gomez (M)</option>
            </select>
          )}

          <button
            type="button"
            onClick={handleManualScan}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-600/30 border-none cursor-pointer"
          >
            ✓ Confirmar e Ingresar Manualmente
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="px-6 py-2 border border-white/15 text-xs text-violet-200/70 hover:text-white font-bold rounded-lg transition-colors cursor-pointer">
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
}
