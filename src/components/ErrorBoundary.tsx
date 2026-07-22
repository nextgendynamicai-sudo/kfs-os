"use client";

import { KFS_BRAND } from "../config/brandConfig";
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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-md shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black mb-4 text-white">¡Protección de Pantalla Activa!</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed font-bold">
              {KFS_BRAND.productAcronym} OS ha capturado una excepción en la interfaz. La pantalla ha sido protegida para prevenir cierres inesperados.
            </p>
            
            {this.state.error && (
              <div className="bg-slate-950 p-4 rounded-xl text-left overflow-x-auto mb-6 border border-slate-800">
                <code className="text-xs text-red-400 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-violet-600 hover:bg-violet-500 text-white font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 w-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-600/30 border-none cursor-pointer text-xs uppercase tracking-wider"
              >
                <RefreshCw size={16} />
                Restaurar Pantalla
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 w-full transition-all border border-slate-700 cursor-pointer text-xs uppercase tracking-wider"
              >
                Reiniciar Aplicación
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
