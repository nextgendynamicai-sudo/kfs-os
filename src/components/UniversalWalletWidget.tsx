import { KFS_BRAND } from "../config/brandConfig";
import React, { useState, useEffect } from "react";
import { DollarSign, Zap, Gift, CircleDollarSign } from "lucide-react";

interface UniversalWalletWidgetProps {
  currentUser: any;
  formatUSD: (val: number) => string;
  children?: React.ReactNode;
}

export function UniversalWalletWidget({ currentUser, formatUSD, children }: UniversalWalletWidgetProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const realBalance = currentUser?.walletBalanceUSD ?? currentUser?.real_balance ?? 0;
  const kPointCashBalance = currentUser?.k_point_cash_balance ?? 0;
  const kPointsBalance = currentUser?.k_points_balance ?? currentUser?.kfsPoints ?? 0;
  const kPointBonusBalance = currentUser?.k_point_bonus_balance ?? 0;
  
  const expiry = currentUser?.k_points_expiry;
  const bonusExpiry = currentUser?.k_point_bonus_expiry;

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

  return (
    <div className="bg-white border border-[#3B82F6]/25 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_50px_rgba(10,17,40,0.4)] text-sky-950 relative overflow-hidden space-y-6 animate-fade-in">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6]/80 flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-[#3B82F6] animate-pulse" /> {KFS_BRAND.productAcronym} Universal Wallet
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-100">Mi Billetera</h2>
          <p className="text-xs text-slate-500 mt-1">Gestión centralizada de activos Fiat y Cripto.</p>
        </div>
      </div>

      {/* Balances Display - Grid 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Reserva Central (USD) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <DollarSign size={10} className="text-emerald-500" /> Reserva Central (USD)
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm font-bold">
              $
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-sky-950">{formatUSD(realBalance)}</p>
            <p className="text-[9px] text-slate-500 mt-1">Inamovible a bancos.</p>
          </div>
        </div>

        {/* K-Point Cash (Dinero Pro) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex flex-col justify-between hover:border-[#3B82F6]/20 transition-all relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <CircleDollarSign size={10} className="text-[#3B82F6]" /> K-Point Cash
            </p>
            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-sm font-bold">
              K$
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-sky-950">{kPointCashBalance.toLocaleString()}</p>
            <p className="text-[9px] text-slate-500 mt-1">Alta liquidez. Transferible.</p>
          </div>
        </div>

        {/* {KFS_BRAND.economy.currency} (Normal) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex flex-col justify-between hover:border-[#8B5CF6]/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Gift size={10} className="text-[#8B5CF6]" /> {KFS_BRAND.economy.currency} (KP)
            </p>
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] text-xs font-bold">
              KP
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-[#8B5CF6]">
              {kPointsBalance.toLocaleString()} <span className="text-xs text-[#8B5CF6]/80">KP</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-1">
              {kPointsBalance > 0 && !isExpired && timeLeftStr ? `AOF en: ${timeLeftStr}` : "Moneda de consumo forzado."}
            </p>
          </div>
        </div>

        {/* K-Point Bonus */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex flex-col justify-between hover:border-[#F59E0B]/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Zap size={10} className="text-[#F59E0B]" /> K-Point Bonus
            </p>
            <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] text-xs font-bold">
              KB
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-[#F59E0B]">
              {kPointBonusBalance.toLocaleString()} <span className="text-xs text-[#F59E0B]/80">KB</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-1">
              Expira en 7 días. Intransferible.
            </p>
          </div>
        </div>
      </div>

      {/* Children (Actions like TopUp, Transfer, etc) */}
      {children && (
        <div className="pt-4 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}
