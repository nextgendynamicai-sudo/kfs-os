"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in React Component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-sky-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-md shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black mb-4">¡Fallo Crítico de Sistema!</h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              KFS OS ha detectado una excepción no controlada en la interfaz de usuario.
              El límite de errores ha prevenido una pantalla en blanco.
            </p>
            
            {this.state.error && (
              <div className="bg-sky-50 p-4 rounded-xl text-left overflow-x-auto mb-6 border border-white/5">
                <code className="text-xs text-red-300 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 w-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <RefreshCw size={18} />
              Reiniciar KFS OS
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
