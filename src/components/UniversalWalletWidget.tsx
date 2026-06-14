import React, { useState, useEffect } from "react";
import { DollarSign, Zap, Gift, CircleDollarSign, ArrowUpRight } from "lucide-react";

interface UniversalWalletWidgetProps {
  currentUser: any;
  formatUSD: (val: number) => string;
  children?: React.ReactNode;
}

export function UniversalWalletWidget({ currentUser, formatUSD, children }: UniversalWalletWidgetProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const realBalance = currentUser?.walletBalanceUSD ?? currentUser?.real_balance ?? 0;
  const kPointsBalance = currentUser?.k_points_balance ?? currentUser?.kfsPoints ?? 0;
  const expiry = currentUser?.k_points_expiry;

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
    <div className="bg-[#0A1128] border border-[#3B82F6]/25 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_50px_rgba(10,17,40,0.4)] text-white relative overflow-hidden space-y-6 animate-fade-in">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[violet]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6]/80 flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-[#3B82F6] animate-pulse" /> KFS Universal Wallet
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-100">Mi Billetera</h2>
          <p className="text-xs text-gray-400 mt-1">Gestión centralizada de activos Fiat y Cripto.</p>
        </div>
      </div>

      {/* Balances Display - Grid 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* USDC Wallet (Próximamente) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#3B82F6]/20 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#3B82F6] text-white text-[9px] font-black px-2 py-1 rounded-bl-lg shadow-lg">PRÓXIMAMENTE</div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <CircleDollarSign size={10} className="text-[#3B82F6]" /> USD Coin (USDC)
            </p>
            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-sm font-bold">
              $
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-white opacity-50">$0.00</p>
            <p className="text-[9px] text-gray-400 mt-1">Red Polygon / Ethereum</p>
          </div>
        </div>

        {/* Real Balance (USD) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <DollarSign size={10} className="text-emerald-500" /> Saldo Fiat (USD)
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm font-bold">
              $
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-white">{formatUSD(realBalance)}</p>
            <p className="text-[9px] text-gray-400 mt-1">Disponible para retiro o compra.</p>
          </div>
        </div>

        {/* K-Points */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[violet-500]/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <Gift size={10} className="text-[violet-400]" /> K-Points (KP)
            </p>
            <div className="w-8 h-8 rounded-full bg-[violet-500]/10 flex items-center justify-center text-[violet-400] text-xs font-bold">
              KP
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight text-[violet-400]">
              {kPointsBalance.toLocaleString()} <span className="text-xs text-[violet-400]/80">KP</span>
            </p>
            <p className="text-[9px] text-gray-400 mt-1">
              {kPointsBalance > 0 && !isExpired && timeLeftStr ? `Expira en: ${timeLeftStr}` : "Puntos de lealtad / cashback."}
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
