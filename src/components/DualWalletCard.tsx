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

  const realBalance = currentUser?.real_balance || currentUser?.walletBalanceUSD || 0;
  const kPointCashBalance = currentUser?.k_point_cash_balance || 0;
  const kPointsBalance = currentUser?.k_points_balance || currentUser?.kPoints || 0;
  const kPointBonusBalance = currentUser?.k_point_bonus_balance || 0;
  
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

  const handleSimulatedRecharge = (amount: number) => {
    if (onRequestTopUp) {
      onRequestTopUp(amount, selectedPromoter || currentUser?.referred_by_promoter_id);
    }
  };

  return (
    <div className="bg-white border border-violet-300/25 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_50px_rgba(10,17,40,0.4)] text-violet-950 relative overflow-hidden space-y-6">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-2xl -z-1"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -z-1"></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-violet-100 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-violet-600 animate-pulse" /> {KFS_BRAND.productAcronym} Billetera Digital
          </span>
          <h2 className="text-2xl font-black tracking-tight text-violet-950">Mi Billetera</h2>
          <p className="text-xs text-slate-500 mt-1">Tus dólares disponibles, dinero pro y puntos acumulados para compras.</p>
        </div>

        {/* Expiry Countdown Widget for Bonus */}
        {kPointBonusBalance > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 self-start">
            <Clock size={16} className="text-amber-600" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-700">Puntos por Vencer</p>
              <p className="text-sm font-mono font-black text-amber-600">
                {isExpired ? "¡Puntos Vencidos!" : timeLeftStr || "Calculando..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real Balance (USD & Bs BCV) */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-200 transition-all">
          <div className="flex items-center gap-1.5">
            <DollarSign size={16} className="text-emerald-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Saldo Disponible</p>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black tracking-tight text-violet-950">
              {formatUSD(realBalance)}
            </p>
            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
              ≈ Bs. {(realBalance * 36.45).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[9px] font-normal text-slate-400">(Tasa BCV)</span>
            </p>
          </div>
        </div>

        {/* Axis Cash */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-200 transition-all">
          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-[#3B82F6]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Saldo Axis Cash</p>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black tracking-tight text-violet-950">
              {kPointCashBalance.toLocaleString()} <span className="text-xs font-normal text-slate-500">Pts</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-1">Saldo para compras y transferencias.</p>
          </div>
        </div>

        {/* Axis Points Normal */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-200 transition-all">
          <div className="flex items-center gap-1.5">
            <Gift size={16} className="text-[#8B5CF6]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Puntos Acumulados</p>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black tracking-tight text-[#8B5CF6]">
              {kPointsBalance.toLocaleString()} <span className="text-xs font-normal text-slate-500">Pts</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-1">Ganados por compras en comercios.</p>
          </div>
        </div>

        {/* Axis Bonus */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-200 transition-all">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#F59E0B]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Puntos de Regalo</p>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black tracking-tight text-[#F59E0B]">
              {kPointBonusBalance.toLocaleString()} <span className="text-xs font-normal text-slate-500">Pts</span>
            </p>
            <p className="text-[9px] text-slate-500 mt-1">Bono por recargas iniciales.</p>
          </div>
        </div>
      </div>

      {/* Recharge ladder widget */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="text-sm font-black text-violet-950">Recargar Saldo</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Selecciona el monto que deseas recargar en tu cuenta:</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSimulatedRecharge(5)}
            className="bg-violet-600/10 hover:bg-violet-600 hover:text-white border border-violet-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer group"
          >
            <p className="text-xs font-black">Recarga $5</p>
            <p className="text-[9px] opacity-75 mt-0.5">+2,000 Puntos Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(10)}
            className="bg-violet-600/15 hover:bg-violet-600 hover:text-white border border-violet-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[7px] font-black px-1 py-0.5 rounded-bl">PRO</div>
            <p className="text-xs font-black">Recarga $10</p>
            <p className="text-[9px] opacity-75 mt-0.5">+5,000 Puntos Bono</p>
          </button>
          <button
            onClick={() => handleSimulatedRecharge(20)}
            className="bg-violet-600/20 hover:bg-violet-600 hover:text-white border border-violet-200 rounded-xl py-3 px-2 text-center transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[7px] font-black px-1 py-0.5 rounded-bl">WHALE</div>
            <p className="text-xs font-black">Recarga $20</p>
            <p className="text-[9px] opacity-75 mt-0.5">+12,000 Puntos Bono</p>
          </button>
        </div>

        {/* Optional Promoter Referral Assignment */}
        {currentUser && !currentUser.referred_by_promoter_id && (
          <div className="pt-2">
            <label className="text-[10px] text-slate-500 font-bold block mb-1">
              ¿Te refirió alguna Promotora? Asignar ID (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: p1 o ID de Promotora"
              value={selectedPromoter}
              onChange={(e) => setSelectedPromoter(e.target.value)}
              className="w-full bg-white border border-violet-100 rounded-xl px-3 py-2 text-xs text-violet-950 placeholder-gray-500 focus:outline-none focus:border-violet-300 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
