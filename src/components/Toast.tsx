"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

export const Toast = ({ toast }: { toast: any }) => {
  if (!toast?.show) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";
  const isWarning = toast.type === "warning";

  const getBgStyle = () => {
    if (isError) {
      return "bg-rose-600/95 text-white border-rose-400/40 shadow-rose-900/30";
    }
    if (isWarning) {
      return "bg-amber-600/95 text-white border-amber-400/40 shadow-amber-900/30";
    }
    if (toast.type === "info") {
      return "bg-sky-600/95 text-white border-sky-400/40 shadow-sky-900/30";
    }
    return "bg-slate-900/95 dark:bg-slate-950/95 text-white border-violet-500/30 shadow-violet-950/40";
  };

  return (
    <div 
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[999999] max-w-[92vw] sm:max-w-md px-5 py-3 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-between gap-3 border ${getBgStyle()}`}
      role="alert"
    >
      <div className="flex items-center gap-2.5 truncate">
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        ) : isWarning ? (
          <AlertTriangle size={18} className="text-amber-300 shrink-0" />
        ) : isError ? (
          <AlertCircle size={18} className="text-rose-200 shrink-0" />
        ) : (
          <Info size={18} className="text-sky-300 shrink-0" />
        )}
        <span className="truncate">{toast.message}</span>
      </div>

      {toast.action && (
        <button
          type="button"
          onClick={toast.action.onClick}
          className="shrink-0 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-none shadow-xs"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
};
