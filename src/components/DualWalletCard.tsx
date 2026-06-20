import { KFS_BRAND } from "../config/brandConfig";
import React, { useState, useEffect } from "react";
import { DollarSign, Clock, Zap, Gift, Lock } from "lucide-react";

interface DualWalletCardProps {
  currentUser: any;
  formatUSD: (val: number) => string;
  onRequestTopUp?: (amount: number, promoterId?: string) => void;
}

export function DualWalletCard({ currentUser, formatUSD, onRequestTopUp }: DualWalletCardProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedPromoter, setSelectedPromoter] = useState<string>("");

  const realBalance = currentUser.real_balance || currentUser.walletBalanceUSD || 0;
  const kPointCashBalance = currentUser.k_point_cash_balance || 0;
  const kPointsBalance = currentUser.k_points_balance || currentUser.kPoints || 0;
  const kPointBonusBalance = currentUser.k_point_bonus_balance || 0;
  
  const expiry = currentUser.k_points_expiry;
  const bonusExpiry = currentUser.k_point_bonus_expiry;

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
    <div className="bg-white border border-sky-300/25 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_50px_rgba(10,17,40,0.4)] text-sky-950 relative overflow-hidden space-y-6">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-600/5 rounded-full blur-2xl -z-1"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-600/5 rounded-full blur-3xl -z-1"></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600/80 flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-sky-600 animate-pulse" /> {KFS_BRAND.productAcronym} Wallet Engine v4
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-100">Billetera Multicapa (Double Ledger)</h2>
          <p className="text-xs text-slate-500 mt-1">Tu balance Fiat, Dinero Pro y Puntos segregados.</p>
        </div>

        {/* Expiry Countdown Widget for Bonus */}
        {kPointBonusBalance > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 self-start animate-pulse">
            <Clock size={16} className="text-red-400" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-red-300">Caducidad de Bono (168h)</p>
              <p className="text-sm font-mono font-black text-red-400">
                {isExpired ? "¡Bono Caducado!" : timeLeftStr || "Calculando..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real Balance (USD) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-sky-200 transition-all">
          <DollarSign size={20} className="text-green-500 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reserva Central</p>
          <p className="text-2xl font-black tracking-tight text-sky-950 mt-1">
            {formatUSD(realBalance)}
          </p>
        </div>

        {/* K-Point Cash */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-sky-200 transition-all">
          <Zap size={20} className="text-[#3B82F6] mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">K-Point Cash</p>
          <p className="text-2xl font-black tracking-tight text-sky-950 mt-1">
            {kPointCashBalance.toLocaleString()} <span className="text-xs">K$</span>
          </p>
        </div>

        {/* {KFS_BRAND.economy.currency} (Normal) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-sky-200 transition-all">
          <Gift size={20} className="text-[#8B5CF6] mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{KFS_BRAND.economy.currency} Normal</p>
          <p className="text-2xl font-black tracking-tight text-[#8B5CF6] mt-1">
            {kPointsBalance.toLocaleString()} <span className="text-xs">KP</span>
          </p>
        </div>

        {/* K-Point Bonus */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-sky-200 transition-all">
          <Clock size={20} className="text-[#F59E0B] mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">K-Point Bonus</p>
          <p className="text-2xl font-black tracking-tight text-[#F59E0B] mt-1">
            {kPointBonusBalance.toLocaleString()} <span className="text-xs">KB</span>
          </p>
        </div>
      </div>

      {/* Recharge ladder widget */}
      <div className="bg-sky-50 border border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-black text-gray-200">Recarga Express Cero Fricción</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Elige un nivel operativo para acreditar saldo y recibir bonos instantáneos.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSimulatedRecharge(5)}
            className="bg-sky-600/10 hover:bg-sky-600 hover:text-white border border-sky-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer group"
          >
            <p className="text-xs font-black">Recarga $5</p>
            <p className="text-[9px] opacity-75 mt-0.5">+2,000 KP Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(10)}
            className="bg-sky-600/15 hover:bg-sky-600 hover:text-white border border-sky-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-sky-600 text-white text-[7px] font-black px-1 py-0.5 rounded-bl">PRO</div>
            <p className="text-xs font-black">Recarga $10</p>
            <p className="text-[9px] opacity-75 mt-0.5">+5,000 KP Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(20)}
            className="bg-sky-600/20 hover:bg-sky-600 hover:text-white border border-sky-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-sky-600 text-white text-[7px] font-black px-1 py-0.5 rounded-bl">WHALE</div>
            <p className="text-xs font-black">Recarga $20</p>
            <p className="text-[9px] opacity-75 mt-0.5">+12,000 KP Bono</p>
          </button>
        </div>

        {/* Optional Promoter Referral Assignment */}
        {!currentUser.referred_by_promoter_id && (
          <div className="pt-2">
            <label className="text-[10px] text-slate-500 font-bold block mb-1">
              ¿Te refirió alguna Promotora? Asignar ID (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: p1 o ID de Promotora"
              value={selectedPromoter}
              onChange={(e) => setSelectedPromoter(e.target.value)}
              className="w-full bg-white border border-sky-100 rounded-xl px-3 py-2 text-xs text-sky-950 placeholder-gray-500 focus:outline-none focus:border-sky-300 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
