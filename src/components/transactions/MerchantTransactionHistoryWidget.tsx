"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, DollarSign, Calendar, ArrowUpRight, CheckCircle2, Clock, Smartphone, Receipt } from "lucide-react";

interface TransactionItem {
  id: string;
  amountUSD: number;
  productName?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  timestamp?: string;
  date?: string;
  createdAt?: string;
  status?: string;
}

interface MerchantTransactionHistoryWidgetProps {
  transactions: TransactionItem[];
  bcvRate?: number;
  formatUSD: (val: number) => string;
  onViewReceipt?: (tx: TransactionItem) => void;
  className?: string;
}

export const MerchantTransactionHistoryWidget: React.FC<MerchantTransactionHistoryWidgetProps> = ({
  transactions = [],
  bcvRate = 36.45,
  formatUSD,
  onViewReceipt,
  className = ""
}) => {
  const [filterType, setFilterType] = useState<"all" | "today" | "week" | "cash_usd" | "cash_bs" | "hybrid">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    return transactions.filter((tx) => {
      const txDate = tx.timestamp || tx.date || tx.createdAt || "";
      const txTime = new Date(txDate).getTime();

      // 1. Filter pill condition
      if (filterType === "today") {
        if (!txDate.startsWith(todayStr)) return false;
      } else if (filterType === "week") {
        if (isNaN(txTime) || txTime < oneWeekAgo) return false;
      } else if (filterType === "cash_usd") {
        if (tx.paymentMethod !== "cash_usd") return false;
      } else if (filterType === "cash_bs") {
        if (tx.paymentMethod !== "cash_bs" && tx.paymentMethod !== "pago_movil") return false;
      } else if (filterType === "hybrid") {
        if (tx.paymentMethod !== "hybrid" && tx.paymentMethod !== "points") return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = tx.id.toLowerCase().includes(q);
        const matchCustomer = (tx.customerName || "").toLowerCase().includes(q);
        const matchPhone = (tx.customerPhone || "").includes(q);
        const matchProd = (tx.productName || "").toLowerCase().includes(q);
        if (!matchId && !matchCustomer && !matchPhone && !matchProd) return false;
      }

      return true;
    });
  }, [transactions, filterType, searchQuery]);

  const totalFilteredUSD = filteredTransactions.reduce((sum, tx) => sum + (Number(tx.amountUSD) || 0), 0);
  const totalFilteredBs = totalFilteredUSD * bcvRate;

  return (
    <div className={`bg-slate-900/80 border border-violet-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 ${className}`}>
      
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Historial de Ventas & Facturación
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Filtrado multi-criterio en tiempo real auditado al centavo
          </p>
        </div>

        <div className="text-left sm:text-right bg-slate-950/70 px-4 py-2 rounded-2xl border border-white/5">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Total del Filtro:</span>
          <span className="text-base font-black text-emerald-400">{formatUSD(totalFilteredUSD)}</span>
          <span className="text-[10px] text-slate-400 font-mono block">≈ Bs. {totalFilteredBs.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter Pills Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "all"
              ? "bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Todas ({transactions.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType("today")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "today"
              ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Hoy
        </button>

        <button
          type="button"
          onClick={() => setFilterType("week")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "week"
              ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Esta Semana
        </button>

        <button
          type="button"
          onClick={() => setFilterType("cash_usd")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "cash_usd"
              ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          💵 Efectivo USD
        </button>

        <button
          type="button"
          onClick={() => setFilterType("cash_bs")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "cash_bs"
              ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          🇻🇪 Pago Móvil Bs
        </button>

        <button
          type="button"
          onClick={() => setFilterType("hybrid")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            filterType === "hybrid"
              ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          ⚡ Ghost Trap / Mixto
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por ID, nombre del cliente, teléfono o producto..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 font-medium"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.slice().reverse().map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-violet-500/30 rounded-2xl flex items-center justify-between gap-3 transition-colors text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{tx.id.slice(-8)}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    tx.paymentMethod === "cash_usd" ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" :
                    tx.paymentMethod === "cash_bs" || tx.paymentMethod === "pago_movil" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                    "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}>
                    {tx.paymentMethod === "cash_usd" ? "Efectivo USD" : tx.paymentMethod === "cash_bs" ? "Pago Móvil" : "Mixto"}
                  </span>
                </div>
                <p className="font-bold text-white truncate mt-1">
                  {tx.productName || "Venta de Mostrador"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {tx.customerName ? `${tx.customerName} • ` : ""}{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "Registrado"}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-black text-white">{formatUSD(Number(tx.amountUSD) || 0)}</p>
                {onViewReceipt && (
                  <button
                    type="button"
                    onClick={() => onViewReceipt(tx)}
                    className="mt-1 text-[10px] font-bold text-violet-300 hover:text-white flex items-center gap-0.5 ml-auto transition-colors cursor-pointer"
                  >
                    <span>Ver Ticket</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
            <p className="text-xs text-slate-400 font-bold">No se encontraron ventas para este filtro.</p>
            <p className="text-[10px] text-slate-500">Prueba cambiando la pastilla de filtro o limpiando el buscador.</p>
          </div>
        )}
      </div>

    </div>
  );
};
