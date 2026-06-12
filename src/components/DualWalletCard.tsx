import React, { useState, useEffect } from "react";
import { DollarSign, Clock, Zap, ArrowUpRight, Gift, Lock } from "lucide-react";

interface DualWalletCardProps {
  currentUser: any;
  formatUSD: (val: number) => string;
  onRequestTopUp?: (amount: number, promoterId?: string) => void;
}

export function DualWalletCard({ currentUser, formatUSD, onRequestTopUp }: DualWalletCardProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedPromoter, setSelectedPromoter] = useState<string>("");

  const realBalance = currentUser.real_balance || 0;
  const kPointsBalance = currentUser.k_points_balance || 0;
  const expiry = currentUser.k_points_expiry;

  useEffect(() => {
    if (!expiry || kPointsBalance <= 0) {
      setTimeLeftStr("");
      setIsExpired(false);
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const expiryTime = new Date(expiry).getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeftStr("Expirado");
        setIsExpired(true);
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry, kPointsBalance]);

  const handleSimulatedRecharge = (amount: number) => {
    if (onRequestTopUp) {
      onRequestTopUp(amount, selectedPromoter || currentUser.referred_by_promoter_id);
    }
  };

  return (
    <div className="bg-[#0A1128] border border-[#C5A184]/25 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_50px_rgba(10,17,40,0.4)] text-white relative overflow-hidden space-y-6">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A184]/5 rounded-full blur-2xl -z-1"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#C5A184]/5 rounded-full blur-3xl -z-1"></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A184]/80 flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-[#C5A184] animate-pulse" /> KFS Wallet Engine v4
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-100">Billetera Dual Integrada</h2>
          <p className="text-xs text-gray-400 mt-1">Tu balance real y cupones de compra digital en tiempo real.</p>
        </div>

        {/* Expiry Countdown Widget */}
        {kPointsBalance > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 self-start animate-pulse">
            <Clock size={16} className="text-red-400" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-red-300">Caducidad de Bono (120h)</p>
              <p className="text-sm font-mono font-black text-red-400">
                {isExpired ? "¡Bono Caducado!" : timeLeftStr || "Calculando..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real Balance (USD) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-[#C5A184]/20 transition-all">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <DollarSign size={10} /> Saldo Real (USD)
            </p>
            <p className="text-3xl font-black tracking-tight text-white mt-1">
              {formatUSD(realBalance)}
            </p>
            <p className="text-[9px] text-gray-400 mt-1">Disponible en cualquier comercio aliado.</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-lg font-bold">
            $
          </div>
        </div>

        {/* K-Points / Flow Express Bonus */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-[#C5A184]/20 transition-all relative overflow-hidden">
          {currentUser.is_k_points_locked && (
            <div className="absolute inset-0 bg-[#0A1128]/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-2">
              <Lock size={16} className="text-[#C5A184] mb-1 drop-shadow-lg" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white mb-2 drop-shadow-md">Bono Bloqueado</p>
              <button 
                onClick={() => handleSimulatedRecharge(5)}
                className="bg-[#C5A184] hover:bg-[#C5A184]/90 text-[#0A1128] px-3 py-1.5 rounded-lg text-[9px] font-black transition-colors shadow-lg"
              >
                Recarga $5 para desbloquear
              </button>
            </div>
          )}
          <div className={currentUser.is_k_points_locked ? "opacity-20 blur-[2px]" : ""}>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <Gift size={10} /> Bono Flow Express
            </p>
            <p className="text-3xl font-black tracking-tight text-[#C5A184] mt-1">
              {kPointsBalance.toLocaleString()} <span className="text-xs text-[#C5A184]/80">KP</span>
            </p>
            <p className="text-[9px] text-gray-400 mt-1">
              Equivale a {formatUSD(kPointsBalance / 1000)} USD. Expira en 5 días.
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-[#C5A184]/15 flex items-center justify-center text-[#C5A184] text-lg font-bold ${currentUser.is_k_points_locked ? "opacity-20 blur-[2px]" : ""}`}>
            KP
          </div>
        </div>
      </div>

      {/* Recharge ladder widget */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-black text-gray-200">Recarga Express Cero Fricción</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Elige un nivel operativo para acreditar saldo y recibir bonos instantáneos.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSimulatedRecharge(5)}
            className="bg-[#C5A184]/10 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/30 rounded-xl py-3 px-2 text-center transition-all cursor-pointer group"
          >
            <p className="text-xs font-black">Recarga $5</p>
            <p className="text-[9px] opacity-75 mt-0.5">+2,000 KP Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(10)}
            className="bg-[#C5A184]/15 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/40 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-[#C5A184] text-[#0A1128] text-[7px] font-black px-1 py-0.5 rounded-bl">PRO</div>
            <p className="text-xs font-black">Recarga $10</p>
            <p className="text-[9px] opacity-75 mt-0.5">+5,000 KP Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(20)}
            className="bg-[#C5A184]/20 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/50 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-[#C5A184] text-[#0A1128] text-[7px] font-black px-1 py-0.5 rounded-bl">WHALE</div>
            <p className="text-xs font-black">Recarga $20</p>
            <p className="text-[9px] opacity-75 mt-0.5">+12,000 KP Bono</p>
          </button>
        </div>

        {/* Optional Promoter Referral Assignment */}
        {!currentUser.referred_by_promoter_id && (
          <div className="pt-2">
            <label className="text-[10px] text-gray-400 font-bold block mb-1">
              ¿Te refirió alguna Promotora? Asignar ID (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: p1 o ID de Promotora"
              value={selectedPromoter}
              onChange={(e) => setSelectedPromoter(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A184] transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
