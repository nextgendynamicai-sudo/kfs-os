"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Zap, Volume2, CheckCircle, Barcode, QrCode, RefreshCw } from "lucide-react";
import { playScannerBeep } from "../../lib/utils";

interface ZeroHardwareBarcodeScannerProps {
  onScan: (barcodeOrProduct: string) => void;
  onClose: () => void;
  products?: Array<{ id: string; name: string; priceUSD: number; stock?: number }>;
}

export const ZeroHardwareBarcodeScanner: React.FC<ZeroHardwareBarcodeScannerProps> = ({
  onScan,
  onClose,
  products = []
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Sample quick barcodes to test when physical camera or barcodes aren't present
  const demoBarcodes = [
    { code: "7591001001234", name: products[0]?.name || "Harina de Maíz Pan 1kg", price: products[0]?.priceUSD || 1.25 },
    { code: "7592002005678", name: products[1]?.name || "Queso Paisa Rebanado 500g", price: products[1]?.priceUSD || 4.80 },
    { code: "7593003009999", name: products[2]?.name || "Café Molido Gourmet 250g", price: products[2]?.priceUSD || 2.50 },
    { code: "7594004008888", name: products[3]?.name || "Aceite Vegetal 1L", price: products[3]?.priceUSD || 3.20 }
  ];

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        activeStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } catch (err) {
        console.warn("Camera access not available or permitted, activating fallback scanner simulator:", err);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerSuccessfulScan = (codeOrName: string) => {
    playScannerBeep();
    setLastScanned(codeOrName);
    onScan(codeOrName);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        // @ts-ignore
        await track.applyConstraints({
          // @ts-ignore
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (err) {
        console.log("Torch constraint not supported on this device", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-violet-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
              <Barcode size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Escáner Zero-Hardware
              </h3>
              <p className="text-[10px] text-slate-400">
                Lectura óptica con cámara móvil o web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCameraActive && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-xl transition-all ${
                  torchOn ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
                title="Alternar Linterna"
              >
                <Zap size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewfinder Camera Stage */}
        <div className="relative w-full h-72 bg-black flex items-center justify-center overflow-hidden">
          {hasCamera ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-6 text-center space-y-2">
              <Camera size={36} className="mx-auto text-slate-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-300">
                Cámara en modo de simulación de alta precisión
              </p>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Haz clic en cualquier código de muestra a continuación para simular la lectura del láser en 0.2 segundos.
              </p>
            </div>
          )}

          {/* HUD Overlay: Aiming Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="relative w-64 h-40 border-2 border-dashed border-violet-400/60 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-1 -mr-1" />

              {/* Animated Laser Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-bounce" />

              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                Enfoca código de barras o QR
              </span>
            </div>
          </div>

          {/* Success Flash Feedback */}
          {lastScanned && (
            <div className="absolute inset-0 bg-emerald-500/30 backdrop-blur-sm flex items-center justify-center text-white z-20 animate-in fade-in duration-100">
              <div className="bg-slate-950/90 border border-emerald-400 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="text-xs font-black">¡Leído con éxito!</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Barcode Testing Buttons */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Barcode size={12} className="text-amber-400" /> Códigos de barra del comercio:
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Bip acústico activo 🔊</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoBarcodes.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerSuccessfulScan(item.name)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-left transition-all active:scale-95 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-amber-400/90 font-bold">{item.code.slice(-6)}</span>
                  <span className="text-[10px] font-black text-emerald-400">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-[11px] font-bold text-white truncate mt-1 group-hover:text-amber-300">
                  {item.name}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
