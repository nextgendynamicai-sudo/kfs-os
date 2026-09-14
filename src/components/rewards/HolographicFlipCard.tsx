"use client";

import React, { useState } from "react";
import { Sparkles, QrCode, ShieldCheck, Wifi, Award, RefreshCw } from "lucide-react";
import { playCashDrawerSound } from "../../lib/utils";

interface HolographicFlipCardProps {
  customerName?: string;
  memberId?: string;
  kPointsBalance?: number;
  cashbackTier?: string;
  qrCodeValue?: string;
  className?: string;
}

export const HolographicFlipCard: React.FC<HolographicFlipCardProps> = ({
  customerName = "CLIENTE FRECUENTE",
  memberId = "AXIS-7749-9210",
  kPointsBalance = 1250,
  cashbackTier = "VIP NITRO GOLD",
  qrCodeValue = "https://axisnitro.store/rewards",
  className = ""
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playCashDrawerSound();
  };

  return (
    <div className={`perspective-[1000px] select-none ${className}`}>
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Tarjeta Holográfica Axis VIP. Toca para girar."
        className={`relative w-full h-56 rounded-[2rem] transition-transform duration-700 cursor-pointer [transform-style:preserve-3d] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ================= CARA FRONTAL ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] p-6 bg-gradient-to-tr from-slate-950 via-[#131127] to-slate-900 border border-amber-400/40 text-white flex flex-col justify-between overflow-hidden [backface-visibility:hidden]">
          {/* Holographic Glare Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />
          
          {/* Background Micro-Circuit Rings */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-amber-400/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border border-amber-400/20 pointer-events-none" />

          {/* Top Bar: Chip + Contactless + Badge */}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              {/* Gold Chip */}
              <div className="w-10 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 border border-amber-200 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-[1px] bg-amber-700/50 absolute" />
                <div className="w-[1px] h-full bg-amber-700/50 absolute" />
                <span className="text-[8px] font-mono text-slate-950 font-black tracking-tighter">CHIP</span>
              </div>
              <Wifi size={18} className="text-amber-300 rotate-90" />
            </div>

            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-3 py-1 rounded-full backdrop-blur-sm">
              <Sparkles size={11} className="text-amber-300 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                {cashbackTier}
              </span>
            </div>
          </div>

          {/* Center: Brand Identifier */}
          <div className="relative z-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">
              MEMBER CARD
            </p>
            <h4 className="text-xl font-black tracking-widest text-white mt-0.5 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
              AXIS REWARDS VIP
            </h4>
          </div>

          {/* Bottom Info: Member Name + Points Balance */}
          <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-3">
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider">
                Titular Autorizado
              </span>
              <span className="text-xs font-black tracking-wider text-white uppercase">
                {customerName}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono uppercase text-amber-400 block font-bold">
                Puntos K-Points
              </span>
              <span className="text-base font-black text-amber-300 font-mono">
                {kPointsBalance.toLocaleString()} KP
              </span>
            </div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 flex items-center gap-1 font-mono group-hover:text-amber-300 transition-colors">
            <RefreshCw size={10} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Toca para ver reverso y QR</span>
          </div>
        </div>

        {/* ================= CARA TRASERA ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] bg-slate-950 border border-amber-400/40 text-white flex flex-col justify-between overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {/* Black Magnetic Stripe */}
          <div className="w-full h-10 bg-black mt-4 border-y border-white/10" />

          {/* Signature Strip + CVV Box */}
          <div className="px-6 flex items-center gap-3">
            <div className="flex-1 h-7 bg-slate-800 rounded-md flex items-center px-3 text-[10px] font-mono text-slate-400 italic">
              {memberId}
            </div>
            <div className="w-14 h-7 bg-white rounded-md flex items-center justify-center text-slate-950 font-mono font-black text-xs">
              882
            </div>
          </div>

          {/* QR Code for Instant Checkout + Benefits */}
          <div className="px-6 pb-4 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-black flex items-center gap-1">
                <ShieldCheck size={12} /> Circuito Seguro KFS OS
              </span>
              <p className="text-[10px] text-slate-300 font-medium max-w-[180px] leading-tight">
                Presenta este código en caja para acumular y pagar con tus K-Points.
              </p>
              <span className="text-[9px] font-mono text-slate-500 block">
                ID: {memberId}
              </span>
            </div>

            {/* QR Visual Box */}
            <div className="w-16 h-16 bg-white p-1.5 rounded-xl flex items-center justify-center shadow-lg border border-amber-400/50">
              <QrCode size={52} className="text-slate-950" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
