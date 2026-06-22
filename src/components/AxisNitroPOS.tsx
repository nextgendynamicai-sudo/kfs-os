"use client";

import React, { useState, useMemo } from "react";
import { useKFS } from "../context/KFSContext";
import { usePreset } from "../context/PresetContext";
import { FeatureFlag } from "./FeatureFlag";
import { 
  Flame, Cpu, Database, DollarSign, Gift, Layers, CheckCircle2, 
  PlusCircle, Sliders, ToggleLeft, ToggleRight, Sparkles, Scale,
  Calendar, TableProperties, Binary
} from "lucide-react";

export function AxisNitroPOS() {
  const { db, formatUSD, rates, showToast, processPurchase } = useKFS() as any;
  const { businessPreset, presetMetadata, refreshPreset } = usePreset();

  // Mock controls so the user can test the visual flags in real-time in the demo
  const [demoFeatures, setDemoFeatures] = useState({
    escandallos: presetMetadata.features.escandallos,
    serial_tracking: presetMetadata.features.serial_tracking,
    room_management: presetMetadata.features.room_management,
    weight_scale: presetMetadata.features.weight_scale,
    booking_system: presetMetadata.features.booking_system,
  });

  // Keep state synced with context unless modified in demo
  React.useEffect(() => {
    setDemoFeatures({
      escandallos: presetMetadata.features.escandallos,
      serial_tracking: presetMetadata.features.serial_tracking,
      room_management: presetMetadata.features.room_management,
      weight_scale: presetMetadata.features.weight_scale,
      booking_system: presetMetadata.features.booking_system,
    });
  }, [presetMetadata]);

  // Demo item selection
  const [selectedProduct, setSelectedProduct] = useState({
    name: "Cerveza Polar Pilsen (Tercio)",
    priceUSD: 1.50,
    stock: 45
  });

  const [applyIva, setApplyIva] = useState(false);
  const [axisPointsToBurn, setAxisPointsToBurn] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash_usd");

  // Core Financial calculations (Flat Rate 2%, Axis Points logic, Ghost Trap)
  const basePrice = selectedProduct.priceUSD;
  const flatRateFee = basePrice * 0.02; // Core 2% flat rate
  const netStoreUSD = basePrice - flatRateFee;
  
  const iva = applyIva ? basePrice * 0.16 : 0;
  const pointsDiscount = axisPointsToBurn * 0.001; // 1000 points = $1.00 USD
  const totalDueUSD = Math.max(0, basePrice + iva - pointsDiscount);

  // Ghost Trap calculations (Hybrid payments simulation)
  const ghostTrapSplit = useMemo(() => {
    if (paymentMethod === "hybrid") {
      const pointsUSDValue = pointsDiscount;
      const cashNeededUSD = Math.max(0, totalDueUSD);
      return {
        pointsBurned: axisPointsToBurn,
        pointsUSD: pointsUSDValue,
        cashUSD: cashNeededUSD,
        cashBs: cashNeededUSD * (rates?.USD || 36.45)
      };
    }
    return null;
  }, [paymentMethod, totalDueUSD, axisPointsToBurn, rates]);

  const handleChargeSubmit = () => {
    // Triggering mock transaction or real purchase
    showToast("Ejecutando cobro financiero de alta precisión...", "success");
    
    // Core payment deduction alert demonstrating compliance and immutability
    setTimeout(() => {
      alert(
        `--- COMPROBANTE DE TRANSACCIÓN AXIS NITRO POS ---\n` +
        `Producto: ${selectedProduct.name}\n` +
        `Subtotal: ${formatUSD(basePrice)}\n` +
        `Deducción de Tasa Flat Rate (2%): -${formatUSD(flatRateFee)} (Nodos Pilares)\n` +
        `Monto Neto a Comercio: ${formatUSD(netStoreUSD)}\n` +
        `Descuento Axis Points: -${formatUSD(pointsDiscount)}\n` +
        `Total Cobrado: ${formatUSD(totalDueUSD)} (Bs. ${(totalDueUSD * (rates?.USD || 36.45)).toFixed(2)})\n` +
        `Método de Pago: ${paymentMethod.toUpperCase()}\n` +
        `-----------------------------------------------\n` +
        `ESTADO: APROBADO (Procesado por Ghost Trap y validado en Euro BCV)`
      );
    }, 500);
  };

  return (
    <div className="bg-slate-950 text-white rounded-[2.5rem] border border-violet-900/50 p-6 md:p-8 shadow-[0_20px_60px_rgba(30,20,80,0.5)] space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Upper Brand Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-violet-900/30 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-900/30 px-3 py-1 rounded-full border border-violet-800/50 flex items-center gap-1.5 w-fit mb-2">
            <Sparkles size={10} className="text-violet-400 animate-pulse" /> Axis Nitro Core System
          </span>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-sky-300 bg-clip-text text-transparent">
            Axis Nitro POS Interface
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Demostración de inyección visual mediante Feature Flags con blindaje del núcleo financiero.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 border border-violet-800/30 p-3 rounded-2xl">
          <Cpu className="text-violet-400" size={20} />
          <div className="text-left">
            <span className="text-[9px] text-slate-500 uppercase font-black block">Preset Activo</span>
            <span className="text-xs font-bold text-sky-400">{businessPreset}</span>
          </div>
        </div>
      </div>

      {/* Grid: Toggles & Interactive Testing (Left) | POS Modules & Flags (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Preset Testing & Controls */}
        <div className="lg:col-span-4 space-y-6 bg-slate-900/50 border border-violet-900/25 p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="text-violet-400 w-4 h-4" />
            <h3 className="font-bold text-sm text-slate-200">Panel de Control de Flags (Simulado)</h3>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Activa o desactiva las características en tiempo real para observar la inyección dinámica de componentes en la vista del cajero.
          </p>

          <div className="space-y-3 pt-2">
            {Object.keys(demoFeatures).map((key) => {
              const name = key as keyof typeof demoFeatures;
              const isEnabled = demoFeatures[name];
              return (
                <button
                  key={name}
                  onClick={() => setDemoFeatures(prev => ({ ...prev, [name]: !prev[name] }))}
                  className="flex items-center justify-between w-full p-3 rounded-xl border border-violet-950 bg-black/30 hover:bg-black/50 transition-all text-left cursor-pointer group"
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 capitalize block">
                      {name.replace("_", " ")}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      FeatureFlag name="{name}"
                    </span>
                  </div>
                  {isEnabled ? (
                    <ToggleRight className="text-emerald-400 w-8 h-8 transition-transform group-active:scale-95" />
                  ) : (
                    <ToggleLeft className="text-slate-600 w-8 h-8 transition-transform group-active:scale-95" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-violet-950/20 border border-violet-900/50 rounded-2xl p-4 text-left">
            <span className="text-[9px] font-black uppercase text-violet-400 flex items-center gap-1.5 mb-1.5">
              <Layers size={12} /> Nota de Ingeniería
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Las flags modifican de forma inmediata la estructura del DOM evitando montar nodos inútiles mediante lógica cortocircuito (Short-circuit Evaluation).
            </p>
          </div>
        </div>

        {/* Right column: POS Cashier Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main cashier console */}
          <div className="bg-black/40 border border-violet-900/30 rounded-[2rem] p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-violet-950 pb-4">
              <h4 className="font-black text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Database size={16} className="text-violet-400" /> Venta en Proceso
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Terminal ID: AXIS-POS-1002</span>
            </div>

            {/* Product card */}
            <div className="bg-slate-900/80 border border-violet-900/20 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Artículo Seleccionado</p>
                <p className="text-lg font-black text-white mt-0.5">{selectedProduct.name}</p>
                <p className="text-xs text-violet-300 font-bold mt-1">Precio Base: {formatUSD(basePrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{formatUSD(basePrice)}</p>
                <p className="text-[9px] text-slate-500">En stock: {selectedProduct.stock} u.</p>
              </div>
            </div>

            {/* Visual injection of Flag-Dependent modules */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-violet-400 tracking-wider">
                Módulos de Negocio Dinámicos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* 1. Module Escandallos (Añadir Mililitros) */}
                {demoFeatures.escandallos && (
                  <div className="bg-gradient-to-r from-violet-900/30 to-violet-950/20 border border-violet-800/40 p-4 rounded-2xl flex flex-col justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Flame className="text-amber-500 w-4 h-4" />
                      <span className="text-xs font-black text-slate-200">Módulo de Escandallos (Fluidos)</span>
                    </div>
                    <button 
                      onClick={() => showToast("Simulado: Se añadieron +100ml de cerveza de barril al cálculo de receta.", "success")}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-black py-2.5 rounded-xl cursor-pointer transition-colors border-none flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle size={14} /> Añadir Mililitros
                    </button>
                  </div>
                )}

                {/* 2. Module Serial Tracking */}
                {demoFeatures.serial_tracking && (
                  <div className="bg-gradient-to-r from-violet-900/30 to-violet-950/20 border border-violet-800/40 p-4 rounded-2xl flex flex-col justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Binary className="text-sky-400 w-4 h-4" />
                      <span className="text-xs font-black text-slate-200">Registro de Lote / Serial</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Escriba Serial o Lote..." 
                      className="bg-black/50 border border-violet-900/50 rounded-lg p-2 text-xs font-mono text-sky-300 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                )}

                {/* 3. Module Room Management */}
                {demoFeatures.room_management && (
                  <div className="bg-gradient-to-r from-violet-900/30 to-violet-950/20 border border-violet-800/40 p-4 rounded-2xl flex flex-col justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <TableProperties className="text-[#3B82F6] w-4 h-4" />
                      <span className="text-xs font-black text-slate-200">Distribución de Espacios</span>
                    </div>
                    <select className="bg-black/50 border border-violet-900/50 rounded-lg p-2 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer">
                      <option value="barra">Barra Central</option>
                      <option value="mesa1">Mesa N° 1</option>
                      <option value="mesa2">Mesa N° 2</option>
                      <option value="terraza">Terraza VIP</option>
                    </select>
                  </div>
                )}

                {/* 4. Module Weight Scale */}
                {demoFeatures.weight_scale && (
                  <div className="bg-gradient-to-r from-violet-900/30 to-violet-950/20 border border-violet-800/40 p-4 rounded-2xl flex flex-col justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Scale className="text-emerald-400 w-4 h-4" />
                      <span className="text-xs font-black text-slate-200">Balanza Electrónica</span>
                    </div>
                    <div className="bg-black/60 border border-violet-900/30 rounded-xl p-2.5 text-center">
                      <span className="font-mono text-base font-black text-emerald-400 animate-pulse">0.456 kg</span>
                      <span className="text-[8px] text-slate-500 block uppercase font-bold mt-0.5">Sincronizado vía IoT Edge</span>
                    </div>
                  </div>
                )}

                {/* 5. Module Booking System */}
                {demoFeatures.booking_system && (
                  <div className="bg-gradient-to-r from-violet-900/30 to-violet-950/20 border border-violet-800/40 p-4 rounded-2xl flex flex-col justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-[#F59E0B] w-4 h-4" />
                      <span className="text-xs font-black text-slate-200">Agendar Cita / Reserva</span>
                    </div>
                    <input 
                      type="datetime-local" 
                      className="bg-black/50 border border-violet-900/50 rounded-lg p-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                    />
                  </div>
                )}

              </div>
              
              {/* If no flags are enabled, show simple feedback */}
              {!demoFeatures.escandallos && !demoFeatures.serial_tracking && !demoFeatures.room_management && !demoFeatures.weight_scale && !demoFeatures.booking_system && (
                <div className="border border-dashed border-violet-900/20 bg-violet-950/5 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold">
                  Ningún módulo adicional inyectado para este Preset. El POS opera en modo puro estándar.
                </div>
              )}
            </div>

            {/* Unaltered Financial Core block */}
            <div className="bg-slate-900/90 border border-violet-900/40 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <h5 className="font-black text-xs uppercase tracking-wider">Núcleo Financiero Protegido (Axis Core)</h5>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium border-b border-violet-950 pb-3">
                <div className="space-y-1">
                  <p className="text-slate-500">Base Imponible:</p>
                  <p className="text-white font-bold">{formatUSD(basePrice)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-500">Tasa Flat Rate Operativa (2%):</p>
                  <p className="text-red-400 font-bold">-{formatUSD(flatRateFee)}</p>
                </div>
              </div>

              {/* Accumulation/Redemption Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-violet-300">Canjear Axis Points</span>
                  <span className="text-slate-400">Disponible: 15,000 AP</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1500"
                  step="100"
                  value={axisPointsToBurn}
                  onChange={(e) => setAxisPointsToBurn(parseInt(e.target.value) || 0)}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-[11px] font-black text-violet-400">
                  <span>{axisPointsToBurn} Axis Points</span>
                  <span>Descuento: -{formatUSD(pointsDiscount)}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Método de Cobro</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="w-full bg-black/60 border border-violet-900/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer font-bold"
                >
                  <option value="cash_usd">Efectivo (USD)</option>
                  <option value="cash_bs">Pago Móvil (Bs)</option>
                  <option value="hybrid">Ghost Trap (Pago Mixto)</option>
                </select>
              </div>

              {/* Ghost Trap split details */}
              {ghostTrapSplit && (
                <div className="bg-violet-950/20 border border-violet-900/30 p-3 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-300">
                  <p className="text-amber-400 font-black flex items-center gap-1.5">
                    <Sliders size={12} /> PROTOCOLO GHOST TRAP ACTIVADO
                  </p>
                  <p>&gt; Puntos a debitar: {ghostTrapSplit.pointsBurned} AP (equivale a {formatUSD(ghostTrapSplit.pointsUSD)})</p>
                  <p>&gt; Balance Cash faltante: {formatUSD(ghostTrapSplit.cashUSD)}</p>
                  <p>&gt; Tasa de conversión BCV: {rates?.USD || 36.45} Bs/USD</p>
                  <p>&gt; Pago en Bs requerido: {ghostTrapSplit.cashBs.toFixed(2)} Bs.</p>
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-between items-center pt-3 border-t border-violet-950 font-black">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Monto Total a Recibir</p>
                  <p className="text-2xl text-white">{formatUSD(totalDueUSD)}</p>
                </div>
                <button 
                  onClick={handleChargeSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-6 py-3.5 rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.3)] cursor-pointer border-none uppercase tracking-wider"
                >
                  Confirmar Cobro
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
export default AxisNitroPOS;
