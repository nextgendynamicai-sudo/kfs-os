"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Upload, ShoppingCart, TrendingUp, Users, DollarSign, 
  LogOut, Shield, Package, Activity, Search, QrCode, Lock, 
  ChevronRight, CheckCircle, CreditCard, Bell, X, Info,
  Store, Star, ChevronLeft, Clock, UserCheck, Palette,
  Zap, BookOpen, Printer, Smartphone, Settings, DownloadCloud
} from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Theme and Global Constants
const KREATEK_COLORS = {
  navy: "#0A1128",
  bronze: "#C5A184",
  white: "#F8F9FA"
};

// ==========================================
// BUSINESS ECOSYSTEM SUBCOMPONENTS
// ==========================================

const CheckoutModal = ({ product, onConfirm, onCancel, formatUSD, isOnline = false }: any) => {
  const { db, rates } = useKFS();
  const [paymentMethod, setPaymentMethod] = useState("cash_bs");
  const [applyIva, setApplyIva] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerRif, setCustomerRif] = useState("");
  
  const [splitMethod1, setSplitMethod1] = useState("cash_usd");
  const [splitAmount1, setSplitAmount1] = useState("");
  const [splitMethod2, setSplitMethod2] = useState("cash_bs");

  const [isProcessingPos, setIsProcessingPos] = useState(false);
  const [posStep, setPosStep] = useState(0);

  const isForeign = ['zelle', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(paymentMethod);
  const price = product.priceUSD;
  const iva = applyIva ? price * 0.16 : 0;
  const igtf = isForeign ? (price + iva) * 0.03 : 0;
  const total = price + iva + igtf;
  const totalBs = total * (rates?.USD || 36.45);

  const handleConfirm = async () => {
    if (isOnline && !paymentReference) {
      alert("Debes ingresar el número de referencia del pago para validar tu orden.");
      return;
    }
    if (paymentMethod === "vale_credit") {
      if (!customerPhone) {
        alert("Debes ingresar el Código del Vale (Ej. VALE-1234) o Teléfono del Cliente para validar el crédito.");
        return;
      }
      const activeVale: any = db.vales?.find((v: any) => (v.recipientName === customerPhone || v.id === customerPhone) && v.status === "pending");
      if (!activeVale) {
        alert(`No se encontró ningún Vale de Crédito PENDIENTE asociado a: "${customerPhone}".`);
        return;
      }
      if (activeVale.totalDueUSD < total) {
        alert(`El saldo del Vale (${formatUSD(activeVale.totalDueUSD)}) es insuficiente para cubrir la compra de ${formatUSD(total)}.`);
        return;
      }
    }

    if (paymentMethod === "nfc_web") {
      setIsProcessingPos(true);
      setPosStep(3); // Esperando tarjeta NFC
      if ('NDEFReader' in window) {
        try {
          const ndef = new (window as any).NDEFReader();
          await ndef.scan();
          ndef.onreading = (event: any) => {
            setPosStep(4);
            setTimeout(() => {
              onConfirm(paymentMethod, applyIva, `NFC-${Math.floor(100000 + Math.random() * 900000)}`, customerPhone, customerName, customerRif);
            }, 1500);
          };
          ndef.onerror = () => {
            alert("Error de lectura NFC. Acerque la tarjeta nuevamente.");
            setIsProcessingPos(false);
          };
        } catch (error) {
          alert("Error iniciando NFC: " + error);
          setIsProcessingPos(false);
        }
      } else {
        alert("El pago por contacto (NFC) no está soportado en este dispositivo o navegador (requiere Chrome en Android con HTTPS).");
        setIsProcessingPos(false);
      }
      return;
    }

    if (paymentMethod === "pos_integrated") {
      setIsProcessingPos(true);
      setPosStep(1);
      setTimeout(() => setPosStep(2), 1200);
      setTimeout(() => setPosStep(3), 2400);
      setTimeout(() => {
        setPosStep(4);
        setTimeout(() => {
          onConfirm(paymentMethod, applyIva, `POS-${Math.floor(100000 + Math.random() * 900000)}`, customerPhone, customerName, customerRif);
        }, 1000);
      }, 3600);
      return;
    }

    onConfirm(paymentMethod, applyIva, paymentReference, customerPhone, customerName, customerRif);
  };

  if (isProcessingPos) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-[#0A1128] text-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-white/5 relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A184] via-amber-200 to-[#C5A184] animate-pulse"></div>
          
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-spin border-4 border-[#C5A184]/10 border-t-[#C5A184]">
              {paymentMethod === "nfc_web" ? <CreditCard size={32} className="text-[#C5A184] animate-pulse" /> : <QrCode size={32} className="text-[#C5A184] animate-pulse" />}
            </div>
          </div>

          <h3 className="text-xl font-black uppercase tracking-widest text-[#C5A184]">
            {paymentMethod === "nfc_web" ? "Acerca tu Tarjeta (NFC)" : "Enlace Pinpad POS"}
          </h3>

          <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-left font-mono text-[10px] text-gray-400 space-y-2 leading-relaxed">
            {paymentMethod !== "nfc_web" && (
              <>
                <p className={`${posStep >= 1 ? "text-green-400 font-bold" : "opacity-30"}`}>
                  &gt; [IoT Edge] Abriendo socket local con puerto POS...
                </p>
                <p className={`${posStep >= 2 ? "text-green-400 font-bold" : "opacity-30"}`}>
                  &gt; [COM-RS232] Transmitiendo cobro SPDH por {formatUSD(total)} (Bs. {totalBs.toFixed(2)})
                </p>
              </>
            )}
            <p className={`${posStep >= 3 ? "text-amber-400 font-bold animate-pulse" : "opacity-30"}`}>
              &gt; {paymentMethod === "nfc_web" ? "[WebNFC] Escaneando frecuencia 13.56 MHz (Contactless)..." : "[Pinpad] Esperando tarjeta y clave bancaria del cliente..."}
            </p>
            {posStep >= 4 && (
              <p className="text-green-400 font-black animate-bounce pt-1">
                &gt; [Banco] ¡Cobro aprobado con éxito! Código: {paymentMethod === "nfc_web" ? "NFC-" : "POS-"}{Math.floor(100000 + Math.random() * 900000)}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 font-bold">
            No desconecte el terminal. Sincronización criptográfica directa en curso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
        <h3 className="text-2xl font-black mb-2 text-[#0A1128]">{isOnline ? "Comprar Online" : "Caja Registradora"}</h3>
        <p className="text-sm text-gray-500 mb-6">{product.name}</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Método de Pago</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]">
              <option value="cash_bs">Pago Móvil / Transferencia (Bs)</option>
              <option value="zelle">Zelle</option>
              <option value="binance">Binance Pay</option>
              {!isOnline && (
                <>
                  <option value="pos_integrated">⚡ Tarjeta (POS Integrado KFS)</option>
                  <option value="nfc_web">💳 Tarjeta (NFC Contactless)</option>
                  <option value="cash_usd">Efectivo (USD)</option>
                  <option value="cash_eur">Efectivo (EUR)</option>
                  <option value="vale_credit">🎫 Vale / Crédito de Tienda</option>
                  <option value="split_currency">🔀 Pago Mixto Coercitivo (USD + Bs)</option>
                </>
              )}
            </select>
          </div>

          {paymentMethod === "split_currency" && (
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-3">
              <label className="text-[10px] font-black text-red-900 uppercase tracking-widest block">Fraccionar Pago (El sistema exige el cálculo exacto)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={splitMethod1} onChange={e => setSplitMethod1(e.target.value)} className="w-full sm:w-1/2 bg-white border border-red-200 rounded-lg px-2 py-2 text-xs font-bold text-red-900 focus:outline-none">
                  <option value="cash_usd">Efectivo (USD)</option>
                  <option value="zelle">Zelle</option>
                </select>
                <input type="number" step="0.01" placeholder="Monto USD recibido" value={splitAmount1} onChange={e => setSplitAmount1(e.target.value)} className="w-full sm:w-1/2 bg-white border border-red-200 rounded-lg px-2 py-2 text-xs font-bold text-red-900 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={splitMethod2} onChange={e => setSplitMethod2(e.target.value)} className="w-full sm:w-1/2 bg-white border border-red-200 rounded-lg px-2 py-2 text-xs font-bold text-red-900 focus:outline-none">
                  <option value="cash_bs">Pago Móvil (Bs Oficial)</option>
                </select>
                <div className="w-full sm:w-1/2 bg-white border border-red-200 rounded-lg px-2 py-2 text-xs font-black text-red-900 flex items-center justify-between">
                  <span>Faltante Bs:</span>
                  <span>{((total - (parseFloat(splitAmount1) || 0)) > 0 ? (total - (parseFloat(splitAmount1) || 0)) * (rates?.USD || 36.45) : 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {isOnline && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Número de Referencia</label>
              <input type="text" placeholder="Ej: 034199..." value={paymentReference} onChange={e => setPaymentReference(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
              <p className="text-[10px] text-gray-400 mt-1">Requerido para que el comercio valide tu compra.</p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nombre del Cliente</label>
            <input type="text" placeholder="Ej: Juan Pérez" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
              {isOnline ? "Tu Teléfono de Contacto" : "Teléfono del Cliente (WhatsApp)"}
            </label>
            <input type="text" placeholder="Ej: 04141234567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
            <p className="text-[10px] text-gray-400 mt-1">Opcional. {isOnline ? "Para que el comercio te contacte." : "Para enviar el recibo electrónico por WhatsApp."}</p>
          </div>
          
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={applyIva} onChange={e => setApplyIva(e.target.checked)} className="w-5 h-5 text-[#C5A184] rounded focus:ring-[#C5A184]" />
            <span className="font-bold text-[#0A1128]">Generar Factura Fiscal (IVA 16%)</span>
          </label>

          {applyIva && (
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-4 animate-fade-in">
              <label className="text-[10px] font-black text-amber-900 uppercase tracking-widest block flex items-center gap-2">
                <Shield size={12} className="text-amber-600" />
                Datos Fiscales Obligatorios (SENIAT)
              </label>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">RIF / Cédula</label>
                <input required type="text" placeholder="Ej: V-12345678, J-98765432-1" value={customerRif} onChange={e => setCustomerRif(e.target.value.toUpperCase())} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm font-bold text-gray-600"><span>Subtotal:</span> <span>{formatUSD(price)}</span></div>
            {applyIva && <div className="flex justify-between text-sm font-bold text-gray-600"><span>IVA (16%):</span> <span className="text-red-500">+{formatUSD(iva)}</span></div>}
            {isForeign && <div className="flex justify-between text-sm font-bold text-gray-600"><span>IGTF (3%):</span> <span className="text-red-500">+{formatUSD(igtf)}</span></div>}
            <div className="flex justify-between text-lg font-black text-[#0A1128] pt-2 border-t border-gray-200 mt-2"><span>Total a Pagar:</span> <span>{formatUSD(total)}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="button" onClick={onCancel} className="w-full sm:w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
            <button 
              disabled={(paymentMethod === 'split_currency' && ((parseFloat(splitAmount1) || 0) <= 0 || (parseFloat(splitAmount1) || 0) > total)) || (applyIva && !customerRif)}
              onClick={handleConfirm} 
              className="w-full sm:w-2/3 py-3 rounded-xl font-black text-[#0A1128] bg-[#C5A184] shadow-lg hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isOnline ? "Enviar Pago a Revisión" : applyIva ? "Emitir Factura Fiscal" : "Cobrar Cliente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ tx, product, onClose, formatUSD, triggerGhostTrap, showToast, currentUser }: any) => {
  const [isPrinting, setIsPrinting] = useState(true);
  const [isTorn, setIsTorn] = useState(false);

  useEffect(() => {
    if (!tx) return;
    setIsPrinting(true);
    
    // Play paper feed tick sounds
    let tickCount = 0;
    const playTick = () => {
      if (tickCount >= 3) {
        setIsPrinting(false);
        return;
      }
      playCashDrawerSound(); // Play cash chime or quick feed tick
      tickCount++;
      setTimeout(playTick, 250);
    };
    playTick();
  }, [tx]);

  if (!tx) return null;

  const handleTearPaper = () => {
    setIsTorn(true);
    playCashDrawerSound();
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Physical Printer Bezel Box */}
        <div className="w-full bg-[#1A1F2C] rounded-t-[2.5rem] border border-white/10 p-5 shadow-2xl relative flex flex-col items-center gap-2">
          {/* Status Telemetry Light */}
          <div className="absolute left-6 top-6 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-green-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[8px] font-mono font-black text-green-400 tracking-widest">{tx.isFiscal ? "TFHKA / Fiscal Link Activo" : "WebUSB ESC/POS DIRECTA"}</span>
          </div>

          <div className="h-4"></div>

          {/* Printer Output Mouth */}
          <div className="w-full bg-[#0F131E] h-5 rounded-lg border-b border-black flex justify-center items-center shadow-inner relative overflow-hidden">
            <div className="w-48 h-1 bg-red-500/20 animate-pulse relative">
              <div className="absolute top-0 left-0 h-full bg-[#C5A184] w-2 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Paper Receipt Roll-out Container */}
        <div className={`w-[90%] bg-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-out border-x border-gray-200 ${isPrinting ? "h-0 opacity-0" : "h-auto opacity-100"} ${isTorn ? "translate-y-4 rotate-2 opacity-0 scale-95" : ""}`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 98%, 97% 100%, 94% 98%, 91% 100%, 88% 98%, 85% 100%, 82% 98%, 79% 100%, 76% 98%, 73% 100%, 70% 98%, 67% 100%, 64% 98%, 61% 100%, 58% 98%, 55% 100%, 52% 98%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 37% 100%, 34% 98%, 31% 100%, 28% 98%, 25% 100%, 22% 98%, 19% 100%, 16% 98%, 13% 100%, 10% 98%, 7% 100%, 4% 98%, 0% 100%)' }}>
          
          <div className="p-6 pt-4 font-mono text-[#0A1128] text-xs space-y-4">
            
            {/* Header Receipt */}
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <h3 className="text-sm font-black tracking-widest uppercase mb-1">{product?.clientName || "KFS ECOSISTEMA"}</h3>
              <p className="text-[10px] text-gray-500 font-bold">RIF: J-50201438-9</p>
              <p className="text-[10px] text-gray-500">BOS CONTROL DIGITAL</p>
              <p className="text-[9px] text-gray-400 font-mono mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>

            {/* Receipt Control Barcode (Pure CSS) */}
            <div className="flex flex-col items-center gap-1 border-b border-dashed border-gray-300 pb-3 mt-3">
              <span className="text-[8px] text-gray-400 uppercase tracking-widest">{tx.isFiscal ? "Factura Fiscal" : "Recibo KFS Control"}</span>
              <div className="flex justify-center items-center gap-[1px] h-8 bg-gray-50 px-3 py-1 border border-gray-200/50 rounded">
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1.5 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-1.5 h-6 bg-black"></div>
                <div className="w-1 h-6 bg-black"></div>
                <div className="w-0.5 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-700">{tx.isFiscal ? `FACTURA NRO: 00-${Math.floor(10000 + Math.random() * 89999)}` : tx.receiptNumber}</span>
              {tx.isFiscal && <span className="text-[8px] font-mono text-gray-500">MÁQUINA FISCAL: Z1F-00129841</span>}
            </div>

            {/* Financial Ledger Details */}
            <div className="space-y-1 text-[11px] font-bold text-gray-700 border-b border-dashed border-gray-300 pb-3 mt-3">
              <div className="flex justify-between"><span>PRODUCTO:</span> <span className="text-gray-900 font-black uppercase text-right truncate max-w-[130px]">{product?.name} {tx.isFiscal ? "(G)" : "(E)"}</span></div>
              <div className="flex justify-between"><span>{tx.isFiscal ? "BASE IMPONIBLE:" : "SUBTOTAL:"}</span> <span className="text-gray-900">{formatUSD(tx.baseUSD || tx.amountUSD)}</span></div>
              {tx.isFiscal && <div className="flex justify-between"><span>EXENTO (E):</span> <span className="text-gray-900 font-black">$0.00</span></div>}
              {tx.ivaUSD > 0 && <div className="flex justify-between"><span>IVA (16%):</span> <span className="text-gray-900 font-black">+{formatUSD(tx.ivaUSD)}</span></div>}
              {tx.igtfUSD > 0 && <div className="flex justify-between"><span>IGTF (3%):</span> <span className="text-gray-900 font-black">+{formatUSD(tx.igtfUSD)}</span></div>}
              <div className="flex justify-between"><span>METODO:</span> <span className="text-gray-900 uppercase">{tx.paymentMethod.replace('_', ' ')}</span></div>
              {tx.reference && <div className="flex justify-between"><span>REF:</span> <span className="text-gray-900 font-mono">{tx.reference}</span></div>}
            </div>

            {/* SUNDDE Compliance Section */}
            <div className="space-y-1 text-[10px] font-bold text-gray-500 border-b border-dashed border-gray-300 pb-3 mt-3">
              <div className="flex justify-between"><span>TASA OFICIAL BCV:</span> <span>{tx.exchangeRateBCV?.toFixed(2)} Bs</span></div>
              <div className="flex justify-between text-xs text-gray-900 font-black mt-1"><span>TOTAL Bs:</span> <span>{(tx.amountUSD * (tx.exchangeRateBCV || 36.5)).toFixed(2)} Bs</span></div>
            </div>

            {/* Large Final Total */}
            <div className="text-center py-2 bg-gray-50 border border-gray-100 rounded-xl mt-3">
              <span className="text-[9px] text-gray-400 font-black uppercase block tracking-widest">Total Cancelado</span>
              <span className="text-3xl font-black text-[#0A1128] block">{formatUSD(tx.amountUSD)}</span>
              {tx.kfsPointsEarned > 0 && (
                <div className="mt-1 bg-[#C5A184]/10 rounded-lg py-1 px-2 inline-block">
                  <span className="text-[10px] font-black text-[#C5A184]">+{tx.kfsPointsEarned.toFixed(1)} KFS Pts Ganados</span>
                </div>
              )}
            </div>

            {/* Passive Split Suggestion */}
            <div className="text-center text-[9px] text-gray-400 border-t border-dashed border-gray-300 pt-3 flex flex-col gap-0.5 font-bold mt-3">
              <span>Split KFS: Acreditación Directa Promotora</span>
              <span className="font-mono text-green-600 uppercase">Procesado Exitosamente</span>
            </div>
          </div>
        </div>

        {/* Tactile Hardware Drawer Base */}
        <div className="w-full bg-[#151924] rounded-b-[2.5rem] border border-white/10 p-5 shadow-2xl flex flex-col gap-3 z-10 -mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button 
              onClick={playCashDrawerSound} 
              className="py-3 rounded-xl font-black text-xs text-[#C5A184] bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              💸 Abrir Gaveta
            </button>
            
            {tx.customerPhone ? (
              <a 
                href={`https://wa.me/58${tx.customerPhone.replace(/^0+/, '').replace(/[^0-9]/g, '')}?text=Hola ${tx.customerName || 'Cliente'}, ¡Gracias por tu compra en ${product?.clientName}!%0A%0A*Recibo KFS: ${tx.receiptNumber}*${tx.isFiscal ? `%0A*Factura Fiscal / Control: 00-${Math.floor(10000 + Math.random() * 89999)}*` : ''}%0AProducto: ${product?.name} ${tx.isFiscal ? '(G)' : '(E)'}%0A${tx.isFiscal ? `Base Imponible: ${formatUSD(tx.baseUSD)}%0A` : ''}IVA: ${formatUSD(tx.ivaUSD)}%0AIGTF: ${formatUSD(tx.igtfUSD)}%0A%0ATasa Oficial BCV: ${tx.exchangeRateBCV?.toFixed(2)} Bs%0A*Total Pagado (USD): ${formatUSD(tx.amountUSD)}*%0A*Total Pagado (Bs): ${(tx.amountUSD * (tx.exchangeRateBCV || 36.5)).toFixed(2)} Bs*${tx.kfsPointsEarned > 0 ? `%0A%0A🎁 ¡Felicidades! Acumulaste +${tx.kfsPointsEarned.toFixed(1)} KFS Points con esta compra.` : ''}%0A%0ARecibo Digital Oficial KFS.`}
                target="_blank"
                rel="noreferrer"
                className="py-3 rounded-xl font-black text-xs text-[#0A1128] bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                💬 Recibo WhatsApp
              </a>
            ) : (
              <button disabled className="py-3 rounded-xl font-bold text-xs text-gray-500 bg-white/5 border border-white/5 flex items-center justify-center gap-1.5 cursor-not-allowed">
                Sin Teléfono CRM
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button 
              onClick={() => {
                showToast("Procesando anulación...", "error");
                setTimeout(() => {
                  triggerGhostTrap(currentUser.id, tx.amountUSD, tx.paymentMethod);
                  window.location.reload();
                }, 1500);
              }}
              className="w-full sm:w-1/3 py-4 bg-red-900/50 hover:bg-red-800 text-red-100 font-black rounded-2xl text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer border border-red-500/20"
            >
              Anular
            </button>
            <button 
              onClick={handleTearPaper}
              disabled={isPrinting}
              className="w-full sm:w-2/3 py-4 bg-[#C5A184] hover:bg-[#b08d70] disabled:bg-gray-700 text-[#0A1128] font-black rounded-2xl text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
            ✂️ Rasgar Recibo y Volver
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUBCOMPONENTS (DEFINED OUTSIDE PARENT TO PREVENT UNMOUNT RESETS)
// ==========================================

// Toast Component
const Toast = ({ toast }: { toast: any }) => {
  if (!toast.show) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-2xl backdrop-blur-md font-bold text-sm transition-all duration-300 flex items-center gap-2 ${toast.type === "error" ? "bg-red-500/90 text-white border border-red-400" : "bg-[#C5A184]/90 text-[#0A1128] border border-white/20"}`}>
      {toast.type === "success" ? <CheckCircle size={18} /> : <Activity size={18} />}
      {toast.message}
    </div>
  );
};

// SMS Bank Notification Simulator (Smart Conciliator Sim with Live Terminal Logs)
const SMSConciliatorSimulator = () => {
  const { smsConciliator, showToast, db } = useKFS();
  const [isOpen, setIsOpen] = useState(false);
  const [bank, setBank] = useState("Mercantil");
  const [amount, setAmount] = useState("450,00");
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("04141234567");
  const [customSMS, setCustomSMS] = useState("");
  
  const [logs, setLogs] = useState<string[]>([
    `[15:40:01] companion_ping: Local socket connection: ACTIVE`,
    `[15:40:02] local_ip: Listening on 192.168.1.45:8080`,
    `[15:40:02] hardware_listener: SMS Sync active on telemetry port 443.`
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    let text = "";
    if (bank === "Mercantil") {
      text = `Mercantil: PagoMovil por Bs ${amount} de ${phone} recibido. Ref: ${reference || "123456"}`;
    } else if (bank === "Banesco") {
      text = `Banesco: Recibio Pago Movil por Bs ${amount} de MARIA PEREZ. Ref: ${reference || "987654"}`;
    } else if (bank === "Provincial") {
      text = `Pago Movil Provincial: Recibido Bs ${amount} de ${phone}, Ref: ${reference || "554433"}`;
    } else {
      text = `Zelle: Recibiste un pago de $${amount} de JAVIER CASTILLO. Confirmacion: ${reference || "ZELLE99"}`;
    }
    setCustomSMS(text);
  }, [bank, amount, reference, phone]);

  // Auto scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  const pendingOrders = db.orders?.filter((o: any) => o.status === 'pending') || [];
  
  const handleAutofillReference = (ref: string, amt: number, ph: string) => {
    setReference(ref);
    const bsAmount = (amt * 36.45).toFixed(2).replace('.', ',');
    setAmount(bsAmount);
    setPhone(ph || "04141234567");
    addLog(`autofill: Parsed pending order reference ${ref} and amount Bs ${amt * 36.45}`);
    showToast("Campos auto-rellenados.", "success");
  };

  const handleSimulateSync = () => {
    if (!customSMS) return;
    
    addLog(`sms_inbound: Intercepted push SMS payload from bank channel`);
    addLog(`parser_engine: Extracting amount, reference, telf...`);
    
    setTimeout(() => {
      const result = smsConciliator(customSMS);
      
      addLog(`parser_result: Bank: ${result.bank || "N/A"}, Amount: ${result.amount || 0}, Ref: ${result.reference || "N/A"}`);
      
      if (result.matched) {
        addLog(`match_result: 100% reference hit on pending online order!`);
        addLog(`payout_split: Transmitting 20% hot commission splits to promoter wallet...`);
        addLog(`database: Resolving order status: APPROVED`);
        playPremiumChime();
        
        const flash = document.createElement("div");
        flash.className = "fixed inset-0 pointer-events-none z-[99999] flex items-center justify-center animate-fade-in";
        flash.innerHTML = `
          <div class="absolute inset-0 bg-[#C5A184]/20 backdrop-blur-sm transition-all duration-1000"></div>
          <div class="bg-[#0A1128] border-2 border-[#C5A184] p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center max-w-sm text-center transform scale-95 animate-scale-up animate-pulse" style="box-shadow: 0 0 50px rgba(197, 161, 132, 0.4)">
            <div class="w-16 h-16 bg-[#C5A184]/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-3xl">🛎️</span>
            </div>
            <h2 class="text-2xl font-black text-[#C5A184] mb-2 uppercase tracking-widest">Pago Conciliado</h2>
            <p class="text-xs text-white/80 font-mono mb-4">Smart SMS Sync Engine</p>
            <div class="bg-white/5 border border-white/10 p-4 rounded-2xl w-full mb-2">
              <span class="text-[10px] text-gray-400 font-bold block uppercase">Referencia</span>
              <span class="text-lg font-black text-white font-mono">${result.reference}</span>
            </div>
            <p class="text-xs text-green-400 font-bold">¡Liberación de orden instantánea aprobada!</p>
          </div>
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
          flash.classList.add("opacity-0");
          setTimeout(() => flash.remove(), 1000);
        }, 3500);

        showToast(`¡Pago Móvil Conciliado! Ref: ${result.reference} aprobada.`, "success");
      } else {
        addLog(`match_result: FAILED. No pending order matched reference.`);
        showToast(`SMS analizado con éxito, pero: ${result.error}`, "error");
      }
    }, 400);
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[80] w-14 h-14 bg-gradient-to-br from-[#C5A184] to-[#a38063] rounded-full shadow-[0_4px_20px_rgba(197,161,132,0.4)] flex items-center justify-center text-[#0A1128] hover:scale-110 active:scale-95 transition-all cursor-pointer group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">🛎️</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
          SIM
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#0A1128]/95 backdrop-blur-xl border-r border-white/10 z-[90] shadow-2xl p-6 overflow-y-auto animate-slide-right flex flex-col justify-between text-white">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛎️</span>
                <div>
                  <h3 className="font-black text-sm tracking-wide text-[#C5A184]">KFS SMART CONCILIATOR</h3>
                  <p className="text-[9px] text-gray-400 font-mono">Simulador de Telemetría SMS</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-black text-[#C5A184] uppercase tracking-widest block font-mono">Órdenes Pendientes</span>
              {pendingOrders.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold">No hay órdenes online pendientes. Crea una en Flow Express para probar el auto-llenado.</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {pendingOrders.map((o: any) => (
                    <button 
                      key={o.id} 
                      type="button"
                      onClick={() => handleAutofillReference(o.paymentReference, o.amountUSD, o.customerPhone)}
                      className="w-full text-left bg-white/5 hover:bg-[#C5A184]/15 border border-white/10 p-2.5 rounded-xl transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div>
                        <span className="text-[9px] font-mono block text-gray-400 group-hover:text-white">Ref: {o.paymentReference}</span>
                        <span className="text-[10px] font-bold text-white block">Telf: {o.customerPhone || "N/A"}</span>
                      </div>
                      <span className="text-xs font-black text-green-400">${o.amountUSD} &rarr;</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Configurador de Mensaje</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Banco</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full bg-[#0A1128] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#C5A184] text-white">
                    <option value="Mercantil">Mercantil</option>
                    <option value="Banesco">Banesco</option>
                    <option value="Provincial">Provincial</option>
                    <option value="Zelle">Zelle</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Monto (Bs o $)</label>
                  <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#0A1128] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#C5A184] text-white font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Referencia</label>
                  <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full bg-[#0A1128] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#C5A184] text-white font-mono" placeholder="Ej: 123456" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Teléfono Emisor</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0A1128] border border-white/20 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#C5A184] text-white font-mono" />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">SMS Simulado (Editar Libremente)</label>
                <textarea 
                  value={customSMS} 
                  onChange={e => setCustomSMS(e.target.value)} 
                  rows={3} 
                  className="w-full bg-[#0A1128] border border-white/20 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#C5A184] text-white font-mono"
                />
              </div>
            </div>

            {/* Live Terminal Telemetry Console */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block font-mono flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Telemetría Logs SMS Sync
              </span>
              <div className="bg-black/90 p-4 border border-white/5 rounded-xl font-mono text-[9px] text-green-400 space-y-1 h-32 overflow-y-auto select-text w-full hide-scrollbar">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 mt-6">
            <button 
              type="button"
              onClick={handleSimulateSync}
              className="w-full py-4 bg-gradient-to-br from-[#C5A184] to-[#a38063] text-[#0A1128] font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex justify-center items-center gap-2 cursor-pointer"
            >
              🚀 Detonar Conciliación Zero-Clic
            </button>
            <p className="text-[9px] text-gray-500 font-mono text-center">Simula la intercepción de notificaciones de pago KFS SMS Companion.</p>
          </div>
        </div>
      )}
    </>
  );
};

// Módulo Interactivo de Gobernanza Financiera (Split Visual Dinámico)
const KFSFinancialSplitCalculator = ({ formatUSD, formatEUR, clientFeePercentage = 0.03 }: { formatUSD: any, formatEUR: any, clientFeePercentage?: number }) => {
  const [inputAmt, setInputAmt] = useState(100);
  const [feePercentage, setFeePercentage] = useState(clientFeePercentage);
  const { rates } = useKFS();

  const kfsFeeTotalUSD = inputAmt * feePercentage + 0.04;
  const commerceNetUSD = inputAmt - kfsFeeTotalUSD;

  // Split calculations
  const kfsFeeTotalEUR = (kfsFeeTotalUSD * rates.USD) / rates.EUR;
  const promoterEUR = kfsFeeTotalEUR * 0.20;
  const kfsNetEUR = kfsFeeTotalEUR - promoterEUR;
  const adBudgetEUR = kfsNetEUR * 0.20;
  const finalNetEUR = kfsNetEUR - adBudgetEUR;

  return (
    <div className="bg-[#0A1128] text-white p-6 md:p-8 rounded-[2rem] border border-[#C5A184]/30 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-[#C5A184]/20 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#C5A184] tracking-wide uppercase">Oráculo Financiero & Splits</h3>
            <p className="text-[10px] text-gray-400 font-mono">Simulador de Ecosistema KFS OS</p>
          </div>
          <span className="bg-[#C5A184]/15 border border-[#C5A184]/30 text-[#C5A184] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider font-mono">Fórmula SaaS + POS</span>
        </div>

        {/* Interactive controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Monto de Venta de Ejemplo</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="1000" 
                value={inputAmt} 
                onChange={(e) => setInputAmt(parseInt(e.target.value))} 
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A184]"
              />
              <span className="text-xl font-black font-mono text-[#C5A184] min-w-[70px] text-right">${inputAmt}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tarifa BOS del Comercio</label>
            <div className="grid grid-cols-3 gap-2">
              {[0.03, 0.05, 0.10].map((pct) => (
                <button 
                  key={pct}
                  type="button"
                  onClick={() => setFeePercentage(pct)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${feePercentage === pct ? "bg-[#C5A184] text-[#0A1128]" : "bg-white/5 text-[#C5A184] border border-[#C5A184]/20 hover:bg-white/10"}`}
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time splits visualization */}
        <div className="space-y-4 pt-4 border-t border-[#C5A184]/15">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Distribución del Flujo de Capital</span>
          
          {/* 1. Commerce share */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>Ingreso Neto Comercio (Tienda)</span>
              <span className="text-green-400 font-black">{formatUSD(commerceNetUSD)} ({((commerceNetUSD / inputAmt) * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${(commerceNetUSD / inputAmt) * 100}%` }}></div>
            </div>
          </div>

          {/* 2. Total KFS Fee split */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-black text-[#C5A184]">Comisión Total Kreatek KFS</span>
              <span className="text-red-400 font-mono font-black text-sm">{formatUSD(kfsFeeTotalUSD)}</span>
            </div>
            <p className="text-[9px] text-gray-400 leading-normal mb-2">Se distribuye en caliente de forma instantánea al registrar el cobro:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Promotora (20% share)</span>
                <span className="text-sm font-black text-yellow-400 block mt-1">{formatEUR(promoterEUR)}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Directo a Wallet (EUR)</span>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Publicidad (20% neto)</span>
                <span className="text-sm font-black text-indigo-400 block mt-1">{formatEUR(adBudgetEUR)}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Inyección de Campañas</span>
              </div>

              <div className="bg-[#C5A184]/10 border border-[#C5A184]/20 p-3 rounded-xl">
                <span className="text-[9px] text-[#C5A184] font-black block uppercase tracking-wider">Arquitecto (Neto Neto)</span>
                <span className="text-sm font-black text-green-400 block mt-1">{formatEUR(finalNetEUR)}</span>
                <span className="text-[8px] text-gray-400 font-mono block">Ganancia Neta KFS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background icon design */}
      <DollarSign size={150} className="absolute -right-16 -bottom-16 text-white/5 pointer-events-none" />
    </div>
  );
};

// Sincro-Shield Fiscal Setup Widget (SENIAT)
const FiscalPrinterSetupWidget = () => {
  const { showToast } = useKFS();
  const [proxyUrl, setProxyUrl] = useState("http://localhost:8080");
  const [status, setStatus] = useState("disconnected");
  const [details, setDetails] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await fetch(`${proxyUrl}/status`);
      const data = await res.json();
      if (data.status === "connected") {
        setStatus("connected");
        setDetails(data);
        showToast("Sincro-Shield Fiscal conectado al proxy local con éxito.", "success");
      } else {
        setStatus("disconnected");
        setDetails(null);
        showToast("Proxy local respondió pero la tiquetera fiscal está desconectada.", "error");
      }
    } catch (err) {
      setStatus("disconnected");
      setDetails(null);
      showToast("Proxy local fuera de línea en " + proxyUrl + ". Ejecuta 'node fiscal-proxy.js'.", "error");
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const downloadProxyScript = () => {
    const link = document.createElement("a");
    link.href = "/fiscal-proxy.js";
    link.download = "fiscal-proxy.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Descargando script fiscal-proxy.js...", "success");
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0A1128] uppercase tracking-wider">🛡️ Sincro-Shield Fiscal (SENIAT)</h3>
            <p className="text-[10px] text-gray-500 mt-1">Conexión con impresoras fiscales de Venezuela en red local.</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[8px] uppercase tracking-wider border ${status === "connected" ? "bg-green-50 text-green-700 border-green-200 animate-pulse" : "bg-red-50 text-red-700 border-red-200"}`}>
          {status === "connected" ? "CONECTADO" : "DESCONECTADO"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Dirección IP del Proxy Local</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={proxyUrl} 
                onChange={(e) => setProxyUrl(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-900 focus:outline-none font-mono" 
              />
              <button 
                type="button"
                onClick={testConnection} 
                disabled={testing}
                className="bg-[#0A1128] text-white px-4 rounded-xl font-bold text-xs hover:bg-gray-800 disabled:opacity-50 flex-shrink-0 cursor-pointer"
              >
                {testing ? "Probando..." : "Probar"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-[9px] text-gray-500 space-y-1">
            <p className="font-bold text-[#0A1128] uppercase tracking-wider text-[8px]">Telemetría Local:</p>
            {details ? (
              <>
                <p>• Impresora: <span className="text-green-600 font-bold">{details.model}</span></p>
                <p>• Puerto COM: <span className="text-green-600 font-bold">{details.port}</span></p>
                <p>• Registro Fiscal: <span className="text-green-600 font-bold">{details.machineSerial}</span></p>
              </>
            ) : (
              <p className="text-red-500 italic">No se detectó el Spooler de impresión fiscal local en el equipo.</p>
            )}
          </div>
        </div>

        <div className="bg-[#0A1128] text-white p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Descarga el script `fiscal-proxy.js` y ejecútalo en la PC que tenga la impresora fiscal física conectada por serial.
          </p>
          <button 
            type="button"
            onClick={downloadProxyScript}
            className="w-full mt-2 py-2 bg-[#C5A184] hover:bg-[#b08e72] text-[#0A1128] font-black rounded-lg text-xs transition-colors cursor-pointer text-center"
          >
            Descargar fiscal-proxy.js
          </button>
        </div>
      </div>
    </div>
  );
};

// Consola de Ajustes de Conectividad IoT Edge (WebUSB/WebBluetooth)
const KFSIoTEdgeConsole = ({ showToast }: { showToast: any }) => {
  const [devices, setDevices] = useState<string[]>(["Tiquetera Virtual KFS (Loopback)"]);
  const [isScanningUSB, setIsScanningUSB] = useState(false);
  const [isScanningBT, setIsScanningBT] = useState(false);

  const handleScanUSB = async () => {
    setIsScanningUSB(true);
    showToast("Buscando tiqueteras térmicas WebUSB...");
    try {
      const nav = navigator as any;
      if (nav.usb) {
        const device = await nav.usb.requestDevice({ filters: [] });
        if (device) {
          setDevices(prev => [...prev, `${device.productName || "Impresora Genérica"} (USB)`]);
          showToast(`¡Tiquetera USB Vinculada: ${device.productName}!`, "success");
          playCashDrawerSound();
        }
      } else {
        setTimeout(() => {
          setDevices(prev => [...prev, "Xprinter XP-80 (USB Emulada)"]);
          showToast("WebUSB emulado: ¡Xprinter XP-80 vinculada con éxito!", "success");
          playCashDrawerSound();
        }, 1500);
      }
    } catch (e) {
      setTimeout(() => {
        setDevices(prev => [...prev, "Xprinter XP-80 (USB Emulada)"]);
        showToast("WebUSB emulado: ¡Xprinter XP-80 vinculada con éxito!", "success");
        playCashDrawerSound();
      }, 1200);
    }
    setIsScanningUSB(false);
  };

  const handleScanBluetooth = async () => {
    setIsScanningBT(true);
    showToast("Buscando dispositivos WebBluetooth...");
    try {
      const nav = navigator as any;
      if (nav.bluetooth) {
        const device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true
        });
        if (device) {
          setDevices(prev => [...prev, `${device.name || "Impresora Bluetooth"} (Bluetooth)`]);
          showToast(`¡Tiquetera Bluetooth Vinculada: ${device.name}!`, "success");
          playCashDrawerSound();
        }
      } else {
        setTimeout(() => {
          setDevices(prev => [...prev, "Zebra ZQ320 (Bluetooth Emulada)"]);
          showToast("WebBluetooth emulado: Zebra ZQ320 vinculada con éxito!", "success");
          playCashDrawerSound();
        }, 1500);
      }
    } catch (e) {
      setTimeout(() => {
        setDevices(prev => [...prev, "Zebra ZQ320 (Bluetooth Emulada)"]);
        showToast("WebBluetooth emulado: Zebra ZQ320 vinculada con éxito!", "success");
        playCashDrawerSound();
      }, 1200);
    }
    setIsScanningBT(false);
  };

  return (
    <div className="bg-[#0A1128] text-white p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in w-full">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            <div>
              <h3 className="text-sm font-black text-[#C5A184] tracking-wide uppercase">CONEXIÓN IoT EDGE & HARDWARE</h3>
              <p className="text-[9px] text-gray-400 font-mono">Controladores de Caja y Gaveta de 5V</p>
            </div>
          </div>
          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span> Canales Activos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action buttons */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Vincular Dispositivos</span>
            
            <button 
              type="button"
              onClick={handleScanUSB}
              disabled={isScanningUSB}
              className="w-full py-3 bg-white/5 hover:bg-[#C5A184]/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              🔌 {isScanningUSB ? "Buscando USB..." : "Conectar Tiquetera USB (WebUSB)"}
            </button>

            <button 
              type="button"
              onClick={handleScanBluetooth}
              disabled={isScanningBT}
              className="w-full py-3 bg-white/5 hover:bg-[#C5A184]/15 border border-white/15 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              📡 {isScanningBT ? "Escaneando BT..." : "Vincular por Bluetooth (WebBluetooth)"}
            </button>
          </div>

          {/* Connected devices list */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">Canales de Impresión Configurados</span>
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 max-h-32 overflow-y-auto">
              {devices.map((dev, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> {dev}
                  </span>
                  <span className="text-[8px] text-[#C5A184] uppercase font-black">Activo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Kreatek Logo Component (Removes white background dynamically)
const KreatekLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.src = "/kreatek-logo.jpg";
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Make near-white pixels transparent to remove background
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 230 && data[i+1] > 230 && data[i+2] > 230) {
          data[i+3] = 0; // Set alpha to 0
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setSrc(canvas.toDataURL("image/png"));
    };
  }, []);

  if (!src) return <div className={`animate-pulse bg-[#C5A184]/20 rounded ${className}`} style={{ minWidth: "1.5rem" }}></div>;
  
  return (
    <img 
      src={src} 
      className={className} 
      alt="Kreatek" 
      style={{ filter: "drop-shadow(0px 0px 4px rgba(197, 161, 132, 0.4))", objectFit: "contain" }} 
    />
  );
};

// Play gorgeous major-chord progressive audio chimes completely offline using Web Audio API
const playPremiumChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration); // decay
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    
    // Play a gorgeous progressive C major chord
    playNote(261.63, 0.0, 1.2); // C4
    playNote(329.63, 0.1, 1.2); // E4
    playNote(392.00, 0.2, 1.2); // G4
    playNote(523.25, 0.3, 1.5); // C5
  } catch (e) {
    console.error("Audio Context not supported", e);
  }
};

const playSyncChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.03); // quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration); // decay
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    
    playNote(392.00, 0.0, 0.6); // G4
    playNote(523.25, 0.08, 0.6); // C5
    playNote(659.25, 0.16, 0.6); // E5
    playNote(783.99, 0.24, 1.0); // G5
  } catch (e) {
    console.error("Audio Context error", e);
  }
};

const playCashDrawerSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
};

// Navbar Component with state-aware interactive P2P Telemetry and profile avatar
const Navbar = ({ title, showBack = false, onBack }: { title?: string, showBack?: boolean, onBack?: () => void }) => {
  const { networkState, setNetworkState, showToast, currentUser, setCurrentUser, setDb } = useKFS();
  const [isSyncing, setIsSyncing] = useState(false);

  const cycleNetworkState = () => {
    if (isSyncing) return;

    if (networkState === "online") {
      setNetworkState("mesh");
      showToast("Modo: RED DE MALLA LOCAL (P2P Mesh) activada. Inventarios locales vinculados.", "success");
    } else if (networkState === "mesh") {
      setNetworkState("offline");
      showToast("Modo: DESCONECTADO (Stand-alone). Guardado en LocalStorage activado.", "error");
    } else {
      setIsSyncing(true);
      showToast("Sincronizando base de datos local P2P con el servidor en la nube...", "success");
      
      // Simulate sync animation
      setTimeout(() => {
        setNetworkState("online");
        setIsSyncing(false);
        playSyncChime();
        showToast("¡Base de datos sincronizada! 100% de consistencia en la nube.", "success");
      }, 2000);
    }
  };

  const getNetworkDetails = () => {
    switch (networkState) {
      case "online":
        return { color: "bg-green-500", border: "border-green-400/50", label: "ONLINE (NUBE)", text: "text-green-400" };
      case "mesh":
        return { color: "bg-amber-500", border: "border-amber-400/50", label: "LOCAL MESH (P2P)", text: "text-amber-400" };
      case "offline":
        return { color: "bg-red-500", border: "border-red-400/50", label: "OFFLINE (STAND-ALONE)", text: "text-red-400" };
    }
  };

  const net = getNetworkDetails();

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 bg-[#0A1128] sticky top-0 z-40 backdrop-blur-md gap-3 w-full">
      <div className="flex items-center gap-3">
        <KreatekLogo className="h-8 w-auto" />
        <span className="font-bold text-lg tracking-widest uppercase text-[#C5A184]">
          KFS <span className="font-light text-white hidden md:inline-block">Operating System</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        {/* Network Telemetry Trigger */}
        <button 
          onClick={cycleNetworkState} 
          disabled={isSyncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${net.border} cursor-pointer group disabled:opacity-50`}
          title="Tocar para cambiar estado de red (Simulación Mesh)"
        >
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.color}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${net.color}`}></span>
          </span>
          <span className={`font-mono text-[10px] font-black ${net.text} tracking-wider`}>
            {isSyncing ? "SINCRONIZANDO..." : net.label}
          </span>
        </button>

        {title && <span className="text-white/80 text-xs sm:text-sm uppercase tracking-wider font-mono bg-white/5 px-3 py-1.5 rounded-full">{title}</span>}
        
        {currentUser && currentUser.role !== "marketplace" && (
          <label className="relative w-8 h-8 rounded-full border border-[#C5A184]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all shadow-inner group" title="Toca tu foto para actualizar tu imagen de perfil">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setDb((prev: any) => {
                      let updated = { ...prev };
                      if (currentUser.role === "dueño") {
                        updated.clients = prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, avatar: base64String } : c);
                      } else if (currentUser.role === "promotora") {
                        updated.promotoras = prev.promotoras.map((p: any) => p.id === currentUser.id ? { ...p, avatar: base64String } : p);
                      } else if (currentUser.role === "vendedor") {
                        updated.vendedores = prev.vendedores.map((v: any) => v.id === currentUser.id ? { ...v, avatar: base64String } : v);
                      }
                      return updated;
                    });
                    
                    setCurrentUser((prev: any) => ({ ...prev, avatar: base64String }));
                    showToast("Foto de perfil actualizada con éxito.", "success");
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
            {currentUser.avatar ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" />
            ) : (
              <div className="w-full h-full bg-[#C5A184] text-[#0A1128] font-black text-[10px] flex items-center justify-center">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : (currentUser.company ? currentUser.company.slice(0, 2).toUpperCase() : "KF")}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[8px] text-white font-black">⚙️</span>
            </div>
          </label>
        )}

        {showBack && onBack && (
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-xl transition-colors text-white cursor-pointer text-sm font-bold">
            <ChevronLeft size={16} /> Volver
          </button>
        )}
      </div>
    </nav>
  );
};

const RegisterClientForm = ({ onRegister, onCancel, standalone = true }: any) => {
  const [formData, setFormData] = useState({ name: "", idCard: "", company: "", avgBilling: "", phone: "", email: "", password: "", address: "", kfsFeePercentage: 0.03, avatar: "" });
  const [avatar, setAvatar] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister(formData); }} className={`space-y-3 ${standalone ? "text-white animate-fade-in" : "text-gray-800"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-[#C5A184] border-[#C5A184]/30" : "text-[#0A1128] border-gray-200"}`}>Setup de Nuevo Comercio</h3>
      
      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-[#C5A184]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[#0A1128]/40 hover:bg-[#0A1128]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1">Foto</span>
            </div>
          )}
        </label>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${standalone ? "text-gray-400" : "text-gray-500"}`}>Logo / Foto Comercio</span>
      </div>

      <input required placeholder="Nombre Completo" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required placeholder="Cédula / RIF" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, idCard: e.target.value})} />
      <input required placeholder="Nombre de la Empresa" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, company: e.target.value})} />
      <textarea required placeholder="Dirección Comercial" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, address: e.target.value})} />
      <input required type="number" placeholder="Facturación Promedio Diaria ($)" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, avgBilling: e.target.value})} />
      
      <div className="flex flex-col mb-2">
        <label className={`text-xs font-bold mb-2 uppercase tracking-widest ${standalone ? "text-gray-400" : "text-gray-500"}`}>Tarifa BOS (Comisión Kreatek)</label>
        <select required value={formData.kfsFeePercentage} onChange={e => setFormData({...formData, kfsFeePercentage: parseFloat(e.target.value)})} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all font-bold ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`}>
          <option value={0.03}>Plan Base (3%)</option>
          <option value={0.05}>Plan Estándar (5%)</option>
          <option value={0.10}>Plan Premium (10%)</option>
        </select>
      </div>

      <input required placeholder="Teléfono Personal" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, phone: e.target.value})} />
      <input required type="email" placeholder="Correo Electrónico" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, email: e.target.value})} />
      <input required type="password" placeholder="Crear Clave de Acceso" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, password: e.target.value})} />
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl bg-gray-200/20 hover:bg-gray-200/30 text-white font-bold transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[#0A1128] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer" style={{ backgroundColor: KREATEK_COLORS.bronze }}>Aprobar Setup</button>
      </div>
    </form>
  );
};

// Setup Promotora Form
const RegisterPromotoraForm = ({ onRegister, onCancel }: any) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "", avatar: "" });
  const [avatar, setAvatar] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister(formData); }} className="space-y-3 text-white animate-fade-in">
      <h3 className="text-lg font-black mb-4 border-b border-[#C5A184]/30 pb-2 text-[#C5A184]">Autogestión de Promotora</h3>
      
      <div className="flex flex-col items-center gap-2 mb-4">
        <label className="relative w-20 h-20 rounded-full border-2 border-dashed border-[#C5A184]/50 cursor-pointer overflow-hidden flex items-center justify-center bg-[#0A1128]/40 hover:bg-[#0A1128]/60 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-white transition-colors">
              <Camera size={24} className="mx-auto" />
              <span className="text-[8px] font-bold block mt-1">Foto</span>
            </div>
          )}
        </label>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Foto de Perfil</span>
      </div>

      <input required placeholder="Nombre Completo" className="w-full bg-[#0A1128]/80 border border-[#C5A184]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required type="email" placeholder="Correo Electrónico" className="w-full bg-[#0A1128]/80 border border-[#C5A184]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
      <input required type="password" placeholder="Crear Clave de Acceso" className="w-full bg-[#0A1128]/80 border border-[#C5A184]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all" onChange={e => setFormData({...formData, password: e.target.value})} />
      <input required placeholder="Binance ID (Ej: 184592...)" className="w-full bg-[#0A1128]/80 border border-[#C5A184]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all" onChange={e => setFormData({...formData, binanceId: e.target.value})} />
      <input required placeholder="Pago Móvil (Ej: 0412...)" className="w-full bg-[#0A1128]/80 border border-[#C5A184]/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all" onChange={e => setFormData({...formData, pagoMovil: e.target.value})} />
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-xl bg-gray-200/20 hover:bg-gray-200/30 text-white font-bold transition-all text-sm cursor-pointer">Cancelar</button>
        <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[#0A1128] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer" style={{ backgroundColor: KREATEK_COLORS.bronze }}>Registrar Perfil</button>
      </div>
    </form>
  );
};

// Landing Page View
const LandingPageView = ({ setView }: any) => {
  return (
    <div className="min-h-screen bg-[#0A1128] text-white font-sans overflow-x-hidden selection:bg-[#C5A184] selection:text-[#0A1128]">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#0A1128]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 sm:px-10 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <Shield className="text-[#C5A184]" size={28} />
          <span className="font-black text-xl tracking-tighter">Kreatek<span className="text-[#C5A184]">OS</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView("login")} className="text-sm font-bold text-gray-300 hover:text-white transition-colors cursor-pointer hidden sm:block pt-2">
            Iniciar Sesión
          </button>
          <button onClick={() => setView("login")} className="bg-[#C5A184] text-[#0A1128] px-5 py-2 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(197,161,132,0.3)] cursor-pointer">
            Acceso al Sistema
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C5A184]/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#C5A184] uppercase tracking-widest backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            El Ecosistema Financiero Definitivo
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Gobierna tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A184] to-yellow-200">
              Comercio Local
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Punto de venta físico, E-Commerce sincronizado, proxy fiscal SENIAT y auto-conciliación de Pago Móvil en una sola plataforma en la nube.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => setView("login")} className="bg-white text-[#0A1128] px-8 py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2">
              <Zap size={20} /> Empezar Ahora
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative z-10">
           <div className="bg-gradient-to-tr from-[#0A1128] to-[#141E3A] border border-white/10 rounded-[2rem] p-2 shadow-2xl transition-transform duration-700 ease-out">
             <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-auto rounded-xl opacity-80" />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Todo lo que necesitas, <span className="text-[#C5A184]">sin licencias extra</span>.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Reemplazamos tu sistema viejo, el hardware obsoleto y las comisiones ocultas por un hub centralizado de alto rendimiento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-[#C5A184]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart className="text-[#C5A184]" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-white">Flow Express (E-Commerce)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Tu inventario físico se refleja automáticamente en tu tienda online gratuita. Vende 24/7 sin comisiones por plataforma.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Printer className="text-blue-400" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-white">Sincro-Shield Fiscal</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Conéctate directamente a tu impresora fiscal (PnP) cumpliendo normativas del SENIAT sin pagar licencias de terceros.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="text-green-400" size={28} />
            </div>
            <h3 className="text-xl font-black mb-3 text-white">Auto-Conciliación SMS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Olvídate de las capturas falsas. El sistema lee el SMS de tu banco y aprueba las órdenes online de Pago Móvil instantáneamente.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 sm:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#C5A184]/10 -z-10"></div>
        <h2 className="text-4xl md:text-5xl font-black mb-6">Moderniza tu tienda hoy.</h2>
        <p className="text-xl text-[#C5A184] mb-10 font-bold">Únete a la red de Kreatek Flow Systems.</p>
        <button onClick={() => setView("login")} className="bg-[#C5A184] text-[#0A1128] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(197,161,132,0.4)] cursor-pointer">
          Acceder al Sistema
        </button>
      </section>
    </div>
  );
};

// Login View
const LoginView = ({ handleLogin, registerClient, registerPromotora, db, setView, currentUser, logout }: any) => {
  const [activeTab, setActiveTab] = useState("marketplace"); 
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141E3A] to-[#0A1128] font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#C5A184]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A184]/30">
              <Shield className="text-[#C5A184]" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">KFS Core <span className="text-[#C5A184]">Access</span></h1>
            <p className="text-sm text-gray-400 mt-2 font-mono">Seleccione su vector de entrada</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-8">
            <button onClick={() => setActiveTab("marketplace")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "marketplace" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Flow Exp.</button>
            <button onClick={() => setActiveTab("dueño")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "dueño" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Dueño</button>
            <button onClick={() => setActiveTab("vendedor")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "vendedor" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Vendedor</button>
            <button onClick={() => setActiveTab("promotora")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "promotora" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Promotora</button>
            <button onClick={() => setActiveTab("core")} className={`col-span-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-[#C5A184]/30 cursor-pointer ${activeTab === "core" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_20px_rgba(197,161,132,0.5)]" : "bg-transparent text-[#C5A184] hover:bg-white/5"}`}>KFS OS (Arquitecto)</button>
          </div>

          {activeTab === "marketplace" && (
            <button onClick={() => handleLogin("marketplace", "")} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-[#0A1128] bg-[#C5A184] cursor-pointer">
              <ShoppingCart size={20} /> Entrar a Flow Express
            </button>
          )}

          {(activeTab === "core" || activeTab === "promotora" || activeTab === "dueño" || activeTab === "vendedor") && (
            <div className="space-y-4">
              {(activeTab === "dueño" || activeTab === "vendedor" || activeTab === "promotora") && (
                <input type="email" placeholder="Correo Electrónico de Usuario" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0A1128]/80 border border-[#C5A184]/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C5A184] focus:ring-1 focus:ring-[#C5A184] transition-all" />
              )}
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-[#C5A184]/50" size={20} />
                <input type="password" placeholder="Clave de Seguridad" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0A1128]/80 border border-[#C5A184]/30 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#C5A184] focus:ring-1 focus:ring-[#C5A184] transition-all" />
              </div>
              <button onClick={() => handleLogin(activeTab, password, email)} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-[#0A1128] bg-[#C5A184] cursor-pointer">
                Desbloquear Terminal <ChevronRight size={20} />
              </button>
              {activeTab === "dueño" && (
                <button onClick={() => setActiveTab("register")} className="w-full text-center text-sm font-bold text-[#C5A184] hover:text-white transition-colors mt-4 cursor-pointer">
                  ¿Comercio nuevo? Iniciar Setup
                </button>
              )}
              {activeTab === "promotora" && (
                <button onClick={() => setActiveTab("registerPromo")} className="w-full text-center text-sm font-bold text-[#C5A184] hover:text-white transition-colors mt-4 cursor-pointer">
                  ¿Nueva Promotora? Registrarse
                </button>
              )}
            </div>
          )}

          {activeTab === "register" && <RegisterClientForm onRegister={registerClient} onCancel={() => setActiveTab("dueño")} />}
          {activeTab === "registerPromo" && <RegisterPromotoraForm onRegister={registerPromotora} onCancel={() => setActiveTab("promotora")} />}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button onClick={() => setView("landing")} className="text-sm font-black text-[#C5A184] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto">
              <Star size={16} /> Ver Landing de Ventas - KFS OS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CoreDashboard
const CoreDashboard = ({ db, setDb, approvePromotora, rejectPromotora, settlePromotoraEarnings, showToast, formatUSD, formatEUR, currentUser, logout }: any) => {
  const { impersonateClient } = useKFS();
  const [searchPromotora, setSearchPromotora] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchVendedor, setSearchVendedor] = useState("");

  useEffect(() => {
    const handleGlobalSale = (e: any) => {
      showToast(`⚡ KFS Network: Venta reportada de ${e.detail.name} por ${formatUSD(e.detail.priceUSD)}`, "success");
    };
    const handlePaymentAlert = (e: any) => {
      showToast(`🔔 ALERTA DE PAGO: ${e.detail.company} reportó transferencia por ${formatUSD(e.detail.amount)}`, "success");
    };
    window.addEventListener("kfs-purchase", handleGlobalSale);
    window.addEventListener("kfs-payment-alert", handlePaymentAlert);
    return () => {
      window.removeEventListener("kfs-purchase", handleGlobalSale);
      window.removeEventListener("kfs-payment-alert", handlePaymentAlert);
    };
  }, [showToast, formatUSD]);

  const totalPromotoras = db.promotoras.length;
  const totalSetups = db.promotoras.reduce((acc: number, p: any) => acc + (p.setups || 0), 0);
  const totalDueños = db.clients.length;
  const globalSalesUSD = db.clients.reduce((acc: number, c: any) => acc + (c.salesUSD || 0), 0);
  const globalDebtUSD = db.clients.reduce((acc: number, c: any) => acc + (c.kfsFeesOwedUSD || 0), 0);

  const chartData = db.transactions.map((t: any, index: number) => ({
    name: `TX-${index + 1}`,
    kreatekFee: t.kreatekFeeEUR
  })).slice(-15);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar title="KFS OS (Arquitecto)" showBack={true} onBack={logout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Nodos Globales</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-[#0A1128]">{totalDueños}</h2>
              <span className="text-xs text-gray-400 font-bold">comercios</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fuerza de Ventas</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-[#0A1128]">{totalPromotoras}</h2>
              <span className="text-xs text-gray-400 font-bold">promotoras</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold mt-1">{totalSetups} setups históricos</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Facturación Global KFS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-green-600">{formatUSD(globalSalesUSD)}</h2>
            </div>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col">
            <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Deuda Total x Cobrar</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-red-600">{formatUSD(globalDebtUSD)}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14} className="text-green-500" /> Ganancia Neta KFS</p>
              <h2 className="text-5xl font-black mb-1 text-green-400">{formatEUR(db.kreatekCore?.netEarningsEUR || 0)}</h2>
              <p className="text-xs text-gray-400 mt-2">Libre de pago a promotoras y fondos.</p>
            </div>
            <Activity size={100} className="absolute -right-10 -bottom-10 text-white/5" />
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-[2rem] shadow-lg border border-indigo-800 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-2">Fondo Publicidad KFS</p>
              <h2 className="text-5xl font-black text-white">{formatEUR(db.kreatekCore?.adBudgetEUR || 0)}</h2>
              <p className="text-xs text-indigo-200 mt-2">Fondo sugerido para inyección días 13-17 y 28-2.</p>
            </div>
          </div>
        </div>

        <KFSFinancialSplitCalculator formatUSD={formatUSD} formatEUR={formatEUR} />

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black mb-6 text-[#0A1128] flex items-center gap-2"><TrendingUp className="text-[#C5A184]"/> Flujo de Comisiones KFS</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" fontSize={10} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="kreatekFee" stroke="#C5A184" strokeWidth={4} dot={{ r: 4, fill: "#0A1128" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#0A1128] flex items-center gap-2"><Shield className="text-[#C5A184]"/> Control y Gobernanza de Promotoras</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar promotora..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchPromotora} onChange={e => setSearchPromotora(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">Promotora</th>
                  <th className="py-4 px-4">Accesos</th>
                  <th className="py-4 px-4">Datos de Pago</th>
                  <th className="py-4 px-4 text-center">Estado / Métricas</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {db.promotoras.filter((p: any) => p.name.toLowerCase().includes(searchPromotora.toLowerCase()) || p.email.toLowerCase().includes(searchPromotora.toLowerCase())).map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0A1128]">{p.name}</td>
                    <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">{p.email}</span><span className="text-xs font-mono">P: {p.password}</span></td>
                    <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">BIN: {p.binanceId || "N/A"}</span><span className="text-xs font-mono block">PM: {p.pagoMovil || "N/A"}</span></td>
                    <td className="py-4 px-4 text-center">
                      {p.status === 'pending' ? (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Pendiente</span>
                      ) : (
                        <div>
                          <span className="font-black text-[#0A1128] block">{p.setups || 0} Setups</span>
                          <span className="font-black text-green-600 block">{formatEUR(p.earningsEUR || 0)}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {p.status === 'pending' ? (
                        <>
                          <button onClick={() => approvePromotora(p.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-green-700 cursor-pointer">Aprobar</button>
                          <button onClick={() => rejectPromotora(p.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-700 cursor-pointer">Denegar</button>
                        </>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-2 rounded-lg uppercase tracking-wider flex items-center">Habilitada</span>
                          {(p.passiveEarningsEUR || 0) > 0 && (
                            <button onClick={() => settlePromotoraEarnings(p.id)} className="bg-[#C5A184] text-[#0A1128] px-3 py-1.5 rounded-lg font-bold text-xs shadow-md hover:bg-[#b08d70] cursor-pointer inline-flex items-center gap-1">
                              <CheckCircle size={14} /> Liquidar Regalías
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {db.promotoras.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay promotoras en la red.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#0A1128] flex items-center gap-2"><DollarSign className="text-red-500"/> Estado de Cobranza Diaria (BOS)</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar comercio..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                  <th className="py-4 px-4">Teléfono (WhatsApp)</th>
                  <th className="py-4 px-4">Facturación Bruta USD</th>
                  <th className="py-4 px-4">Deuda Actual USD</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Acciones de Cobro</th>
                </tr>
              </thead>
              <tbody>
                {db.clients.filter((c: any) => c.company.toLowerCase().includes(searchClient.toLowerCase()) || c.name.toLowerCase().includes(searchClient.toLowerCase())).map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0A1128]">{c.company}</td>
                    <td className="py-4 px-4 text-gray-500 font-mono">{c.phone}</td>
                    <td className="py-4 px-4 font-black text-green-600">{formatUSD(c.salesUSD || 0)}</td>
                    <td className="py-4 px-4 font-black text-red-500">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button onClick={() => impersonateClient(c)} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">
                        👁️ Ver Panel
                      </button>
                      <button onClick={() => {
                        const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                        // Check if venezuelan
                        const targetPhone = cleanPhone.startsWith('04') ? `58${cleanPhone.substring(1)}` : cleanPhone;
                        window.open(`https://wa.me/${targetPhone}?text=Hola ${c.name}, te escribimos de *Kreatek*. Te recordamos realizar el pago de tu mantenimiento BOS diario por un monto de *${formatUSD(c.kfsFeesOwedUSD || 0)}*. Puedes usar el botón en tu panel de control para reportar la transferencia. ¡Gracias!`, '_blank');
                      }} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-1">
                        <Activity size={12} /> Enviar Cobro WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
                {db.clients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay comercios en la red para cobrar.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black mb-6 text-[#0A1128] flex items-center gap-2"><Store className="text-[#C5A184]"/> Catálogo Global de Productos</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black sticky top-0">
                  <tr>
                    <th className="py-4 px-4 rounded-tl-xl">Producto</th>
                    <th className="py-4 px-4">Comercio</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4 text-right rounded-tr-xl">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {db.products.map((prod: any) => {
                    const client = db.clients.find((c: any) => c.id === prod.clientId);
                    return (
                      <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#0A1128]">{prod.name}</td>
                        <td className="py-4 px-4 text-gray-500 text-xs">{client?.company || "N/A"}</td>
                        <td className="py-4 px-4 text-gray-500 font-mono">{prod.stock}</td>
                        <td className="py-4 px-4 text-right font-black text-green-600">{formatUSD(prod.price)}</td>
                      </tr>
                    );
                  })}
                  {db.products.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-bold">No hay productos en el ecosistema.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#0A1128] flex items-center gap-2"><UserCheck className="text-[#C5A184]"/> Fuerza Laboral (Vendedores)</h3>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar vendedor..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black sticky top-0">
                  <tr>
                    <th className="py-4 px-4 rounded-tl-xl">Vendedor</th>
                    <th className="py-4 px-4">Comercio</th>
                    <th className="py-4 px-4 text-right rounded-tr-xl">Credenciales</th>
                  </tr>
                </thead>
                <tbody>
                  {(db.vendedores || []).filter((v: any) => v.name.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email.toLowerCase().includes(searchVendedor.toLowerCase())).map((vend: any) => {
                    const client = db.clients.find((c: any) => c.id === vend.clientId);
                    return (
                      <tr key={vend.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#0A1128]">{vend.name}</td>
                        <td className="py-4 px-4 text-gray-500 text-xs">{client?.company || "N/A"}</td>
                        <td className="py-4 px-4 text-right text-gray-500">
                          <span className="text-[10px] font-mono block">{vend.email}</span>
                          <span className="text-[10px] font-mono block">P: {vend.password}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {(db.vendedores || []).length === 0 && <tr><td colSpan={3} className="text-center py-10 text-gray-400 font-bold">No hay vendedores registrados.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-red-50/30 rounded-[2rem] shadow-sm border border-red-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-red-900 flex items-center gap-2"><Lock className="text-red-500"/> Ghost Trap Forensics (Alertas de Anulación Silenciosa)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-red-100/50 text-red-800 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">ID Fraude</th>
                  <th className="py-4 px-4">Vendedor / Comercio</th>
                  <th className="py-4 px-4">Fecha de Detonación</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Monto Absorbido</th>
                </tr>
              </thead>
              <tbody>
                {(db.ghostLogs || []).map((log: any) => {
                  const vendedor = db.vendedores?.find((v: any) => v.id === log.vendedorId);
                  const client = db.clients?.find((c: any) => c.id === vendedor?.clientId);
                  return (
                    <tr key={log.id} className="border-b border-red-100/50 hover:bg-red-50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-red-900 font-bold">{log.id}</td>
                      <td className="py-4 px-4 font-bold text-red-900">
                        {vendedor?.name || "Desconocido"} <span className="text-xs font-normal opacity-70">({client?.company || "N/A"})</span>
                      </td>
                      <td className="py-4 px-4 text-red-800 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-black text-red-600">+{formatUSD(log.amountUSD)}</td>
                    </tr>
                  );
                })}
                {(db.ghostLogs || []).length === 0 && <tr><td colSpan={4} className="text-center py-6 text-green-700 font-bold">No se han detectado intentos de anulación. Sistema blindado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#0A1128] flex items-center gap-2"><Lock className="text-[#C5A184]"/> Auditoría de Cierre (Reportes Z Globales)</h3>
            <div className="flex gap-2">
              <button onClick={() => showToast("Comando TFHKA Z (SENIAT) enviado al Spooler...", "success")} className="bg-amber-100 text-amber-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-2 border border-amber-300">
                 Emitir Z Fiscal
              </button>
              <button onClick={() => window.print()} className="bg-[#0A1128] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2">
                 Imprimir Listado
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                  <th className="py-4 px-4">Fecha / Vendedor</th>
                  <th className="py-4 px-4">Operaciones</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Total USD</th>
                </tr>
              </thead>
              <tbody>
                {(db.zReports || []).map((z: any) => {
                  const client = db.clients.find((c: any) => c.id === z.clientId);
                  const vendedor = db.vendedores?.find((v: any) => v.id === z.vendedorId);
                  return (
                    <tr key={z.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#0A1128]">{client?.company || "N/A"}</td>
                      <td className="py-4 px-4 text-gray-500">
                        <span className="block font-mono text-xs">{new Date(z.timestamp).toLocaleString()}</span>
                        <span className="block font-bold text-[#0A1128] text-xs">Operador: {vendedor?.name || "N/A"}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-gray-500">{z.txCount} TXs</td>
                      <td className="py-4 px-4 text-right font-black text-green-600">{formatUSD(z.totalUSD)}</td>
                    </tr>
                  );
                })}
                {(db.zReports || []).length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-bold">No hay reportes Z emitidos aún.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Promotora Dashboard
const PromotoraDashboard = ({ db, setDb, currentUser, registerClient, settlePromotoraEarnings, formatUSD, formatEUR, logout }: any) => {
  const [showRegister, setShowRegister] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [customizingClient, setCustomizingClient] = useState<any>(null);
  const { updateStoreSettings } = useKFS();
  const myClients = db.clients.filter((c: any) => c.promotoraId === currentUser.id);
  const filteredClients = myClients.filter((c: any) => c.company.toLowerCase().includes(searchClient.toLowerCase()) || c.name.toLowerCase().includes(searchClient.toLowerCase()));
  const myPromotoraData = db.promotoras.find((p: any) => p.id === currentUser?.id) || currentUser;

  const [activeManual, setActiveManual] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <Navbar title={`Portal Promotora: ${currentUser.name}`} showBack={true} onBack={logout} />
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
            <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-4">Regalías Liquidadas (BOS)</p>
            <h2 className="text-6xl font-black mb-6 text-green-400">{formatEUR(myPromotoraData?.passiveEarningsEUR || 0)}</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><CreditCard size={16} className="text-[#C5A184]"/> Modelo Revenue Share (20%)</span>
            </div>
            {(myPromotoraData?.passiveEarningsEUR || 0) > 0 && (
              <button onClick={() => settlePromotoraEarnings(currentUser.id)} className="w-full bg-[#C5A184] text-[#0A1128] py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform cursor-pointer shadow-lg flex justify-center items-center gap-2 mt-2">
                <CheckCircle size={18} /> Confirmar Pago Recibido
              </button>
            )}
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
               <CheckCircle size={40} className="text-green-500" />
             </div>
             <h3 className="text-6xl font-black text-[#0A1128] mb-3">{myPromotoraData?.setups || 0}</h3>
             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nodos Captados</p>
          </div>
        </div>

        {/* Manuals Section */}
        <div className="bg-[#0A1128] text-white p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
          <h3 className="text-xl font-black mb-6">Centro de Aprendizaje y Manuales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => setActiveManual('sales')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
              <BookOpen size={32} className="text-[#C5A184]" />
              <span className="font-bold text-sm">Manual de Ventas</span>
            </button>
            <button onClick={() => setActiveManual('implementation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
              <Settings size={32} className="text-[#C5A184]" />
              <span className="font-bold text-sm">Guía de Implementación</span>
            </button>
            <button onClick={() => setActiveManual('installation')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
              <DownloadCloud size={32} className="text-[#C5A184]" />
              <span className="font-bold text-sm">Setup Fiscal Proxy</span>
            </button>
          </div>
        </div>

        {!showRegister ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-[#0A1128]">Mis Comercios Activados</h3>
              <div className="flex gap-4">
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Buscar comercio..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchClient} onChange={e => setSearchClient(e.target.value)} />
                </div>
                <button onClick={() => setShowRegister(true)} className="bg-[#0A1128] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md cursor-pointer">+ Nuevo Setup</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                  <tr>
                    <th className="py-4 px-4">Nodo Comercial</th>
                    <th className="py-4 px-4">Contacto</th>
                    <th className="py-4 px-4">Tarifa BOS</th>
                    <th className="py-4 px-4 text-center">Tienda</th>
                    <th className="py-4 px-4 text-right">Deuda KFS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((c: any) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#0A1128]">{c.company}</td>
                      <td className="py-4 px-4 text-gray-500">{c.name}<br/><span className="text-xs font-mono">{c.phone}</span></td>
                      <td className="py-4 px-4 font-bold text-[#C5A184]">{(c.kfsFeePercentage || 0.03) * 100}%</td>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => setCustomizingClient(c)} className="bg-gray-100 hover:bg-gray-200 text-[#0A1128] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 mx-auto">
                          <Palette size={14} /> Diseño
                        </button>
                      </td>
                      <td className="py-4 px-4 font-black text-red-500 text-right">{formatUSD(c.kfsFeesOwedUSD || 0)}</td>
                    </tr>
                  ))}
                  {myClients.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">Sin nodos comerciales supervisados.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
            <RegisterClientForm onRegister={(data: any) => { registerClient(data, currentUser.id, data.kfsFeePercentage); setShowRegister(false); }} onCancel={() => setShowRegister(false)} standalone={false} />
          </div>
        )}
      </div>

      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl">
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-[#0A1128] transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            <StorefrontCustomizer client={customizingClient} updateStoreSettings={(id: string, settings: any) => {
              updateStoreSettings(id, settings);
              setCustomizingClient(null);
            }} />
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-[#0A1128] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[#0A1128]">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[#0A1128] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
            
            {activeManual === 'sales' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[#C5A184]" size={28} /> Manual de Ventas: KFS Ecosistema</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. Elevator Pitch (El Gancho):</p>
                    <p>Kreatek Flow Systems OS no es solo un punto de venta. Es un sistema operativo integral que fusiona facturación fiscal, control de inventario y un marketplace E-Commerce automatizado llamado "Flow Express".</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Beneficio Principal (Comercio):</p>
                    <p>Eliminación de hardware obsoleto. Nuestro Sincro-Shield fiscal proxy permite conectar la nube directamente con impresoras fiscales sin pagar licencias de terceros anuales altísimas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Beneficio Principal (Tú como Promotor):</p>
                    <p>Recibes <span className="font-black text-green-600">20% de Revenue Share (Regalías)</span> de por vida sobre las comisiones generadas por los nodos comerciales que afilies. Esto es ingreso pasivo real y escalable.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">4. Manejo de Objeciones:</p>
                    <p>"Ya tengo un sistema". Respuesta: "KFS es gratis de instalar y de licencia perpetua en la nube. Reemplazamos sus licencias caras y les damos E-Commerce gratis integrado en una sola app web."</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'implementation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings className="text-[#C5A184]" size={28} /> Guía de Implementación KFS</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. Registro del Comercio:</p>
                    <p>En este panel, haz clic en "+ Nuevo Setup". Llena los datos reales del comercio, asignando el email del dueño y una clave genérica para su primer acceso.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Configuración de Tarifa BOS:</p>
                    <p>El default es 3% del total facturado. Puedes negociar hasta un 1% para clientes de alto volumen. Ese % es de lo que tú ganarás el 20%.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Personalización UI:</p>
                    <p>Usa el botón "Diseño" en la tabla de comercios para subir el logo del cliente, fondo y colores de su Flow Express Marketplace.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">4. Carga de Inventario:</p>
                    <p>Acompaña al dueño en la creación de los primeros 5 productos para asegurar que entienda cómo funciona el código de barras y la vinculación de precios base.</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'installation' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><DownloadCloud className="text-[#C5A184]" size={28} /> Setup Sincro-Shield Fiscal</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
                    <p className="font-black text-red-800 text-xs uppercase tracking-widest mb-1">Obligatorio por Ley SENIAT</p>
                    <p className="text-red-700 text-xs">Esta integración garantiza que el comercio cumpla con las normativas fiscales venezolanas.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. Requisitos de Hardware:</p>
                    <p>Máquina fiscal compatible (Ej: The Factory HKA modelo Bixolon, Aclas) conectada por cable USB a la PC principal de Caja (Windows/Mac).</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Descarga del Proxy Local:</p>
                    <p>En el dashboard del Cliente o Vendedor, se debe descargar "Sincro-Shield Fiscal Proxy" y tener Node.js instalado en el sistema operativo del cliente.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Ejecución y Servicio:</p>
                    <p>Abrir una terminal en la PC de la caja y ejecutar <code>node fiscal-proxy.js</code>. Opcionalmente configurar PM2 para arranque automático. Se mantendrá corriendo en el puerto 8080.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">4. Pruebas de Transmisión:</p>
                    <p>En KFS OS (Caja), abrir el Setup Sincro-Shield y presionar "Probar Conexión Proxy". Si responde, marcar la casilla "Imprimir Copias Fiscales por Defecto".</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StorefrontCustomizer = ({ client, updateStoreSettings }: { client: any, updateStoreSettings: any }) => {
  const [settings, setSettings] = useState(client.storeSettings || {
    profilePicUrl: "",
    coverPhotoUrl: "",
    bioText: "",
    themeColor: "#C5A184",
    typography: "font-sans",
    layoutType: "grid"
  });

  const handleSave = () => {
    updateStoreSettings(client.id, settings);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 h-full">
      <h4 className="font-black text-[#0A1128] text-lg flex items-center gap-2"><Palette className="text-[#C5A184]"/> Personalizar Tienda</h4>
      <p className="text-xs text-gray-500">Ajusta la apariencia visual de tu vitrina pública en Flow Express.</p>
      
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Logo / Foto de Perfil (URL)</label>
            <input type="text" value={settings.profilePicUrl} onChange={e => setSettings({...settings, profilePicUrl: e.target.value})} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Banner Portada (URL)</label>
            <input type="text" value={settings.coverPhotoUrl} onChange={e => setSettings({...settings, coverPhotoUrl: e.target.value})} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Biografía o Eslogan (Max 150 char)</label>
          <textarea maxLength={150} value={settings.bioText} onChange={e => setSettings({...settings, bioText: e.target.value})} placeholder="Los mejores productos..." className="w-full h-16 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] resize-none" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Color Principal</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.themeColor} onChange={e => setSettings({...settings, themeColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={settings.themeColor} onChange={e => setSettings({...settings, themeColor: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none font-mono" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tipografía</label>
            <select value={settings.typography} onChange={e => setSettings({...settings, typography: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none">
              <option value="font-sans">Moderna (Sans)</option>
              <option value="font-serif">Clásica (Serif)</option>
              <option value="font-mono">Técnica (Mono)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Disposición (Layout)</label>
          <select value={settings.layoutType} onChange={e => setSettings({...settings, layoutType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none">
            <option value="grid">Grilla de Tarjetas (Recomendado)</option>
            <option value="list">Lista Compacta</option>
          </select>
        </div>

        <button onClick={handleSave} className="w-full mt-4 bg-[#0A1128] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Guardar Diseño
        </button>
      </div>
    </div>
  );
};

const ClientDashboard = ({ db, setDb, currentUser, addProduct, addExpense, showToast, formatUSD, formatEUR, logout, approveOrder, rejectOrder }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddVendedor, setShowAddVendedor] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [searchVendedor, setSearchVendedor] = useState("");
  
  const [newProd, setNewProd] = useState({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [newVendedor, setNewVendedor] = useState({ name: "", email: "", password: "", avatar: "" });
  const [newExpense, setNewExpense] = useState({ description: "", amountUSD: "" });
  const [smsInput, setSmsInput] = useState("");
  const [activeManual, setActiveManual] = useState<string | null>(null);
  const { createVale, payVale, queryGlobalBarcode, smsConciliator, rates, toggleLoyaltyProgram, updateStoreSettings, toggleProductFeatured, stopImpersonating } = useKFS();

  const handleManualSmsConciliation = () => {
    if (!smsInput.trim()) return;
    const result = smsConciliator(smsInput);
    if (result.matched) {
      playPremiumChime();
      showToast(`¡Conciliación Exitosa! Orden auto-aprobada por SMS. Ref: ${result.reference}`, "success");
      setSmsInput("");
    } else {
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(`SMS leído (Ref: ${result.reference || "Desconocida"}, Bs. ${result.amount || 0}), pero no coincide con ninguna orden online pendiente.`, "error");
      }
    }
  };

  const shieldMargin = (productId: string, newPrice: number) => {
    setDb((prev: any) => ({
      ...prev,
      products: prev.products.map((p: any) => p.id === productId ? { ...p, priceUSD: parseFloat(newPrice.toFixed(2)) } : p)
    }));
    showToast("Margen blindado con éxito en el canal POS y Flow Express.", "success");
  };

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode) return;
    setIsFetchingBarcode(true);
    try {
      // 1. Consultar el Catálogo Nacional de Venezuela (Garantía offline-first)
      const globalProd = await queryGlobalBarcode(barcode);
      if (globalProd) {
        setNewProd(prev => ({
          ...prev,
          name: globalProd.name,
          imgUrl: globalProd.imgUrl,
          category: globalProd.category || prev.category
        }));
        showToast(`¡Producto encontrado en Catálogo Venezolano! (${globalProd.brand})`, "success");
        setIsFetchingBarcode(false);
        return;
      }

      // 2. Fallback a Open Food Facts global
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setNewProd(prev => ({
          ...prev,
          name: data.product.product_name || data.product.product_name_es || prev.name,
          imgUrl: data.product.image_url || prev.imgUrl
        }));
        showToast("¡Producto encontrado en la base global!", "success");
      } else {
        showToast("Producto no encontrado en base global. Complete manualmente.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error consultando base de datos. Complete manualmente.");
    }
    setIsFetchingBarcode(false);
  };

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.id);
  const myVendedores = db.vendedores?.filter((v: any) => v.clientId === currentUser.id) || [];
  const myExpenses = db.expenses?.filter((e: any) => e.clientId === currentUser.id) || [];
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.id && o.status === 'pending') || [];

  const totalExpensesUSD = myExpenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amountUSD), 0);
  const grossSalesUSD = currentUser.salesUSD || 0;
  const netProfitUSD = grossSalesUSD - totalExpensesUSD;

  const myTransactions = db.transactions.filter((tx: any) => 
    db.products.find((p: any) => p.id === tx.productId)?.clientId === currentUser.id
  );
  const clientChartData = myTransactions.map((t: any, index: number) => ({
    name: `Venta ${index + 1}`,
    amount: t.amountUSD
  })).slice(-15);

  const lowStockProducts = myProducts.filter((p: any) => p.stock !== undefined && p.stock < 5);
  const stagnantProducts = myProducts.filter((p: any) => {
    if (p.stock === undefined || p.stock <= 0) return false;
    const daysSinceSold = p.lastSoldAt ? (new Date().getTime() - new Date(p.lastSoldAt).getTime()) / (1000 * 3600 * 24) : 16; // default 16 if never sold
    return daysSinceSold > 15;
  });
  
  // Filter CRM to this client's transactions? Wait, CRM is global right now based on phone.
  // Actually, we'll just show the global CRM filtered by those who bought from this client
  const myClientTxs = db.transactions.filter((tx: any) => tx.clientId === currentUser.id && tx.customerPhone);
  const myUniquePhones = Array.from(new Set(myClientTxs.map((tx: any) => tx.customerPhone)));
  const myCrm = db.crm?.filter((c: any) => myUniquePhones.includes(c.phone)) || [];

  const myZReports = db.zReports?.filter((z: any) => z.clientId === currentUser.id) || [];

  useEffect(() => {
    const handleStoreSale = (e: any) => {
      if (e.detail.clientId === currentUser.id) {
        showToast(`💰 Venta registrada en tu red: ${e.detail.name} (+${formatUSD(e.detail.priceUSD)})`);
      }
    };
    window.addEventListener("kfs-purchase", handleStoreSale);
    return () => window.removeEventListener("kfs-purchase", handleStoreSale);
  }, [currentUser.id, showToast, formatUSD]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd(prev => ({ ...prev, imgUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ 
      name: newProd.name, 
      priceUSD: parseFloat(newProd.price), 
      costUSD: parseFloat(newProd.cost) || 0,
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", 
      clientId: currentUser.id, 
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode,
      timestamp: new Date().toISOString()
    });
    setNewProd({ name: "", price: "", cost: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "" });
    setShowAddModal(false);
  };

  const changeTier = (tier: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === currentUser.id ? { ...c, kfsTier: tier } : c)
    }));
    showToast(`Nivel Operativo actualizado a ${tier.toUpperCase()}`, "success");
  };

  const handleAddVendedor = (e: React.FormEvent) => {
     e.preventDefault();
     const added = { ...newVendedor, id: `v${Date.now()}`, clientId: currentUser.id, company: currentUser.company };
     setDb((prev: any) => ({ ...prev, vendedores: [...prev.vendedores, added] }));
     setNewVendedor({ name: "", email: "", password: "", avatar: "" });
     setShowAddVendedor(false);
     showToast("Vendedor autorizado y registrado.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {currentUser?.isImpersonated && (
        <div className="bg-amber-500 text-[#0A1128] px-4 py-3 font-bold text-center flex items-center justify-center gap-4 text-sm shadow-md animate-pulse sticky top-[64px] z-50">
          <span>⚠️ MODO IMPERSONACIÓN ACTIVO: Estás controlando el panel de {currentUser.company}</span>
          <button onClick={stopImpersonating} className="bg-[#0A1128] text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors shadow cursor-pointer">
            Regresar a Panel Core
          </button>
        </div>
      )}
      <Navbar title={currentUser.company} showBack={true} onBack={logout} />
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-4">Ganancia Neta (USD)</p>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">{formatUSD(netProfitUSD)}</h2>
              <div className="flex gap-4 text-sm font-bold text-gray-400">
                <span>Ventas Brutas: <span className="text-green-400">{formatUSD(grossSalesUSD)}</span></span>
                <span>Gastos: <span className="text-red-400">-{formatUSD(totalExpensesUSD)}</span></span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <span className="text-xs font-bold text-gray-300">Nivel KFS:</span>
                <select 
                  value={currentUser.kfsTier || 'velocity'} 
                  onChange={(e) => changeTier(e.target.value)}
                  className="bg-transparent text-sm font-black text-white focus:outline-none cursor-pointer"
                >
                  <option value="velocity" className="text-black">Flow Velocity (3%)</option>
                  <option value="matrix" className="text-black">Flow Matrix AI (5%)</option>
                  <option value="monopoly" className="text-black">Flow Monopoly OS (10%)</option>
                </select>
              </div>
              <button onClick={() => setShowExpenseModal(true)} className="bg-[#C5A184] text-[#0A1128] font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform">
                Registrar Gasto
              </button>
            </div>
          <DollarSign size={200} className="absolute -right-10 -bottom-20 text-white/5" />
        </div>

        <StorefrontCustomizer client={currentUser} updateStoreSettings={updateStoreSettings} />

        <FiscalPrinterSetupWidget />

        {/* Manuals Section for Client (Owner) */}
        <div className="bg-[#0A1128] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden mt-6 mb-6">
          <h3 className="text-xl font-black mb-6">Centro de Aprendizaje (Dueño de Negocio)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setActiveManual('owner')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
              <BookOpen size={32} className="text-[#C5A184]" />
              <span className="font-bold text-sm">Manual de Uso del Sistema</span>
            </button>
            <button onClick={() => setActiveManual('benefits')} className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border border-white/10">
              <Star size={32} className="text-[#C5A184]" />
              <span className="font-bold text-sm">Whitepaper de Beneficios KFS</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <button onClick={() => setShowAddModal(true)} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-5 hover:border-[#C5A184]/50 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-[#0A1128]/5 rounded-full flex items-center justify-center">
              <Upload size={32} className="text-[#0A1128]" />
            </div>
            <span className="font-black text-lg text-[#0A1128]">Subir Producto</span>
          </button>
          <button onClick={() => window.open("https://wa.me/584125455777?text=Solicito%20asistencia%20KFS", "_blank")} className="bg-[#0A1128] text-white p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-5 hover:bg-gray-900 transition-all relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-red-500/20 animate-pulse group-hover:bg-red-500/40 transition-colors"></div>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center relative z-10">
              <Bell size={32} className="text-red-400" />
            </div>
            <span className="font-black text-lg text-white relative z-10">Alerta KFS (Soporte)</span>
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-xl text-[#0A1128] mb-6 flex items-center gap-2"><TrendingUp className="text-[#C5A184]"/> Rendimiento de Ventas</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientChartData}>
                <XAxis dataKey="name" fontSize={10} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="amount" stroke="#0A1128" strokeWidth={4} dot={{ r: 4, fill: "#C5A184" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2"><Users className="text-[#C5A184]"/> Control de Empleados</h3>
            <div className="flex gap-4">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar vendedor..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchVendedor} onChange={e => setSearchVendedor(e.target.value)} />
              </div>
              <button onClick={() => setShowAddVendedor(true)} className="text-sm font-bold text-white bg-[#0A1128] px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">+ Añadir Vendedor</button>
            </div>
          </div>
          <div className="space-y-3">
            {myVendedores.filter((v: any) => v.name.toLowerCase().includes(searchVendedor.toLowerCase()) || v.email.toLowerCase().includes(searchVendedor.toLowerCase())).map((v: any) => (
              <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  {v.avatar ? (
                    <img src={v.avatar} className="w-10 h-10 rounded-full object-cover border border-[#C5A184]/40" alt="Avatar" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0A1128]/10 text-[#0A1128] font-black text-xs flex items-center justify-center border border-[#0A1128]/20">
                      {v.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0A1128]">{v.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{v.email}</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Activo</span>
              </div>
            ))}
            {myVendedores.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin empleados. Añada vendedores para usar los terminales móviles.</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A184]/5 rounded-bl-[100px] -z-10"></div>
           <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
             <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2"><DollarSign className="text-[#C5A184]"/> Datos Oficiales de Liquidación KFS</h3>
             <span className="bg-gray-100 text-gray-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-gray-200">Transferencia Directa</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Entidad Bancaria</span>
               <span className="font-black text-sm text-[#0A1128]">Banco Nacional de Crédito (BNC)</span>
             </div>
             <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Teléfono (Pago Móvil)</span>
               <span className="font-mono font-bold text-sm text-[#0A1128]">0412-7740041</span>
             </div>
             <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Cédula de Identidad</span>
               <span className="font-mono font-bold text-sm text-[#0A1128]">V-25.218.648</span>
             </div>
           </div>
        </div>

        {/* Widget de Cierre y Publicidad para el Dueño */}
        <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A184]/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10">
            
            {/* Columna 1: Liquidación Obligatoria al Cierre */}
            <div className="flex-1 flex flex-col justify-between p-6 bg-white/5 rounded-2xl border border-white/10 relative">
              <div className="space-y-2">
                <span className="text-[#C5A184] text-[10px] font-black uppercase tracking-widest block font-mono">Cierre de Caja & Liquidación</span>
                <h3 className="text-xl font-black text-white">Pago Requerido al Cierre</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Para habilitar la sincronización en la nube de tu terminal el día de mañana, debes liquidar tu balance de comisiones BOS de la jornada actual.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">TOTAL A REPORTAR:</span>
                  <span className="text-3xl font-black text-red-400 font-mono">{formatUSD(currentUser.kfsFeesOwedUSD || 0)}</span>
                </div>
                <button 
                  onClick={() => {
                    window.open(`https://wa.me/584127740041?text=Hola Kreatek, soy el local *${currentUser.company}*. Adjunto comprobante de pago de BOS diario correspondiente a la deuda de *${formatUSD(currentUser.kfsFeesOwedUSD || 0)}*.`, '_blank');
                    window.dispatchEvent(new CustomEvent('kfs-payment-alert', { detail: { company: currentUser.company, amount: currentUser.kfsFeesOwedUSD } }));
                    showToast("Abriendo WhatsApp y notificando a KFS Core...", "success");
                  }}
                  className="bg-[#C5A184] text-[#0A1128] font-black text-xs px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} /> Reportar Pago
                </button>
              </div>
            </div>

            {/* Columna 2: Inversión en Publicidad del Día Siguiente */}
            <div className="flex-1 flex flex-col justify-between p-6 bg-indigo-950/40 rounded-2xl border border-indigo-500/20 relative">
              <div className="space-y-2">
                <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest block font-mono">Plan de Tracción de Tráfico</span>
                <h3 className="text-xl font-black text-white">Inversión en Publicidad KFS</h3>
                <p className="text-xs text-indigo-200/70 leading-relaxed">
                  El oráculo de KFS OS reinyecta automáticamente el **20% de tu tarifa BOS diaria** en campañas de publicidad geolocalizada mañana.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-500/20 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] text-indigo-300 block font-bold">PRESUPUESTO ASIGNADO PARA MAÑANA:</span>
                  <span className="text-3xl font-black text-green-400 font-mono">
                    {formatUSD((currentUser.kfsFeesOwedUSD || 0) * 0.20)}
                  </span>
                </div>
                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[9px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Tráfico Garantizado
                </span>
              </div>
            </div>

          </div>
        </div>
        
        <KFSIoTEdgeConsole showToast={showToast} />

        {/* Vales & Créditos Widget */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2 text-[#C5A184]">
              🎫 Vales y Créditos Digitales
            </h3>
            <span className="bg-[#C5A184]/15 border border-[#C5A184]/30 text-[#C5A184] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Conciliación Automática
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emitir Vale Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Emitir Nuevo Vale / Crédito</span>
              <form onSubmit={e => {
                e.preventDefault();
                const target = e.target as any;
                const recipientName = target.recipient.value;
                const type = target.type.value;
                const amountUSD = parseFloat(target.amount.value);
                const surchargePct = parseFloat(target.surcharge.value);
                const dueDate = target.dueDate.value;

                createVale({
                  recipientName,
                  type,
                  amountUSD,
                  surchargePct,
                  dueDate
                });

                target.reset();
              }} className="space-y-3">
                <input required name="recipient" placeholder="Telf. Cliente CRM o Nombre Vendedor" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none" />
                <select name="type" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                  <option value="credito_cliente">Crédito a Cliente (CRM)</option>
                  <option value="adelanto_nomina">Adelanto de Nómina</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input required type="number" step="0.01" name="amount" placeholder="Monto ($)" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none" />
                  <select name="surcharge" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                    <option value="0.00">Sin Recargo</option>
                    <option value="0.03">Recargo 3%</option>
                    <option value="0.05">Recargo 5%</option>
                    <option value="0.08">Recargo 8%</option>
                    <option value="0.10">Recargo 10%</option>
                  </select>
                </div>
                <input required type="date" name="dueDate" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-mono" />
                <button type="submit" className="w-full py-3 bg-[#0A1128] hover:bg-gray-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                  Emitir Vale Criptográfico &rarr;
                </button>
              </form>
            </div>

            {/* List of active Vales */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Gobernanza de Cuentas y Adelantos Pendientes</span>
              <div className="overflow-x-auto max-h-60 border border-gray-100 rounded-xl bg-gray-50/50 p-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] font-black sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Vale / Beneficiario</th>
                      <th className="py-2.5 px-2">Tipo</th>
                      <th className="py-2.5 px-2">Vencimiento</th>
                      <th className="py-2.5 px-2">Total Adeudado</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.vales || []).map((v: any) => (
                      <tr key={v.id} className="border-b border-gray-100/50 hover:bg-white transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-[#0A1128] block">{v.id}</span>
                          <span className="text-[10px] text-gray-500 font-bold block">{v.recipientName}</span>
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-600">
                          {v.type === "adelanto_nomina" ? "💼 Nómina" : "🛍️ Cliente"}
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-500">{v.dueDate}</td>
                        <td className="py-3 px-2">
                          <span className="font-black text-red-500">{formatUSD(v.totalDueUSD)}</span>
                          {v.surchargePct > 0 && <span className="text-[9px] text-orange-500 font-bold block">Recargo: +{v.surchargePct * 100}%</span>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {v.status === "pending" ? (
                            <button onClick={() => {
                              const payAmount = parseFloat(prompt("Ingrese el monto del abono en USD ($):", v.totalDueUSD.toFixed(2)) || "0");
                              if (payAmount > 0) {
                                payVale(v.id, payAmount);
                              }
                            }} className="bg-green-100 text-green-700 font-black px-2.5 py-1.5 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                              Abonar
                            </button>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 font-black px-2 py-1 rounded uppercase tracking-wider text-[8px]">Cancelado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(db.vales || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 font-bold">No hay vales ni créditos pendientes registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Gobernanza de Puntos de Venta (Multi-POS Integrado) */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2 text-[#C5A184]">
              🔌 Gobernanza de Puntos de Venta (Multi-POS Integrado)
            </h3>
            <span className="bg-[#C5A184]/15 border border-[#C5A184]/30 text-[#C5A184] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Sincronización Directa PCI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Formulario de Registro/Enlace POS */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Enlazar y Certificar POS Físico</span>
              <form onSubmit={e => {
                e.preventDefault();
                const target = e.target as any;
                const name = target.posName.value;
                const connectionType = target.connectionType.value;
                const connectionInfo = target.connectionInfo.value;
                const assignedVendedorId = target.assignedVendedorId.value || null;

                const { registerPosTerminal } = useKFS() as any;
                registerPosTerminal({
                  name,
                  connectionType,
                  connectionInfo,
                  assignedVendedorId,
                  clientId: currentUser.id
                });

                target.reset();
              }} className="space-y-3">
                <input required name="posName" placeholder="Nombre POS (Ej: Pax A920 - Caja 1)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none" />
                
                <div className="grid grid-cols-2 gap-2">
                  <select name="connectionType" className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-900 focus:outline-none font-bold">
                    <option value="TCP_IP">Red Local (IP)</option>
                    <option value="SERIAL">Puerto COM (Serial)</option>
                  </select>
                  <input required name="connectionInfo" placeholder="IP (192...) o COM3" className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-900 focus:outline-none font-mono" />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-widest">Cajero Asignado</label>
                  <select name="assignedVendedorId" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none font-bold">
                    <option value="">Sin Asignar</option>
                    {myVendedores.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full py-3 bg-[#0A1128] hover:bg-gray-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                  ⚡ Conectar POS Integrado &rarr;
                </button>
              </form>
            </div>

            {/* Listado de POS enlazados y telemetría en vivo */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Telemetría y Facturación Real por Punto</span>
              <div className="overflow-x-auto max-h-60 border border-gray-100 rounded-xl bg-gray-50/50 p-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] font-black sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">POS Físico / Canal</th>
                      <th className="py-2.5 px-2">Cajero</th>
                      <th className="py-2.5 px-2">Telemetría</th>
                      <th className="py-2.5 px-2">Facturación Real</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).map((p: any) => {
                      const vendedor = myVendedores.find((v: any) => v.id === p.assignedVendedorId);
                      return (
                        <tr key={p.id} className="border-b border-gray-100/50 hover:bg-white transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#0A1128] block">{p.name}</span>
                            <span className="text-[9px] text-gray-400 font-mono block uppercase">ID: {p.id} | {p.connectionType}: {p.connectionInfo}</span>
                          </td>
                          <td className="py-3 px-2 font-bold text-gray-600">
                            {vendedor ? (
                              <span className="flex items-center gap-1.5 text-[#0A1128]">
                                <UserCheck size={12} className="text-[#C5A184]" /> {vendedor.name}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">No Asignado</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-full font-black text-[8px] uppercase tracking-wider border border-green-200">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                              </span>
                              Conectado
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-black text-green-600 block">{formatUSD(p.totalAmountUSD || 0)}</span>
                            <span className="text-[9px] text-gray-400 font-bold block">{p.transactionsCount || 0} TXs Directas</span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button 
                              onClick={() => {
                                const { deletePosTerminal } = useKFS() as any;
                                deletePosTerminal(p.id);
                              }}
                              className="text-[9px] bg-red-50 hover:bg-red-100 text-red-600 font-black px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Retirar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(db.posTerminals || []).filter((p: any) => p.clientId === currentUser.id).length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 font-bold">No hay puntos de venta integrados en este local comercial.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {myOrders.length > 0 && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-200 bg-orange-50/30">
            <h3 className="font-black text-xl text-[#0A1128] mb-6 flex items-center gap-2 text-orange-600">
              <Clock className="text-orange-500" /> Órdenes Online por Validar ({myOrders.length})
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna Izquierda: Lista de Órdenes */}
              <div className="lg:col-span-2 space-y-4">
                {myOrders.map((order: any) => {
                  const product = db.products.find((p: any) => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-2xl border border-orange-100 shadow-sm gap-4 animate-fade-in">
                      <div>
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Pendiente</span>
                        <h4 className="font-bold text-[#0A1128]">{product?.name || "Producto Desconocido"}</h4>
                        <p className="text-sm text-gray-500 font-mono mt-1">Ref: <span className="font-bold text-gray-900">{order.paymentReference}</span> | Método: {order.paymentMethod}</p>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="text-right flex-1 md:flex-none">
                          <p className="font-black text-lg text-green-600">{formatUSD(order.amountUSD)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => rejectOrder(order.id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors cursor-pointer" title="Rechazar y devolver stock"><X size={20} /></button>
                          <button onClick={() => approveOrder(order.id)} className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={20} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: Conciliador SMS Real */}
              <div className="bg-[#0A1128] border border-[#C5A184]/20 rounded-3xl p-6 text-[#F8F9FA] relative overflow-hidden shadow-xl flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A184]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-[#C5A184]/15 text-[#C5A184]">
                      <Bell size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm tracking-wide">CONCILIADOR SMS</h4>
                      <p className="text-[9px] text-[#C5A184] font-mono uppercase tracking-widest">Tecnología Inteligente KFS</p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">
                    Pega el SMS de Pago Móvil o Zelle. El motor KFS extraerá la referencia y el monto para conciliar y liberar la orden al instante sin intervención manual.
                  </p>
                  
                  <textarea 
                    placeholder="Pega el mensaje de texto bancario recibido aquí..."
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#C5A184] placeholder:text-gray-600 resize-none leading-relaxed"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={handleManualSmsConciliation}
                  className="w-full mt-4 py-3 rounded-xl font-black text-xs text-[#0A1128] bg-[#C5A184] hover:bg-[#b08e72] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ⚡ Conciliar SMS Real
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-xl text-[#0A1128] mb-6 flex items-center gap-2">Registro de Egresos Operativos</h3>
          <div className="space-y-3">
            {myExpenses.map((e: any) => (
              <div key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-[#0A1128]">{e.description}</span>
                <span className="text-red-500 font-black">-{formatUSD(e.amountUSD)}</span>
              </div>
            ))}
            {myExpenses.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay egresos registrados.</p>}
          </div>
        </div>

        {/* Módulos Fase 15 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Low Stock Widget */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-100 bg-red-50/20">
            <h3 className="font-black text-xl text-[#0A1128] mb-6 flex items-center gap-2 text-red-500">
              <Activity className="text-red-500" /> Alertas de Inventario
            </h3>
            <div className="space-y-3">
              {lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0A1128]">{p.name} <span className="text-[10px] font-black text-white bg-green-500 px-2 py-0.5 rounded-full ml-2">Alerta Verde</span></span>
                    <span className="text-xs text-red-500 font-black">{p.stock} unidades restantes</span>
                  </div>
                  <button onClick={() => window.open(`https://wa.me/?text=Hola,%20necesito%20reabastecer:%20${p.name}`, '_blank')} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">Reabastecer</button>
                </div>
              ))}
              {stagnantProducts.map((p: any) => (
                <div key={`stg-${p.id}`} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0A1128]">{p.name} <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full ml-2">Alerta Roja</span></span>
                    <span className="text-xs text-red-500 font-black">Estancado (&gt;15 días sin ventas)</span>
                  </div>
                  <button onClick={() => showToast(`Iniciando campaña de Retargeting forzado para ${p.name}...`)} className="text-xs font-bold bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">Forzar Descuento</button>
                </div>
              ))}
              {lowStockProducts.length === 0 && stagnantProducts.length === 0 && <p className="text-sm text-gray-400 font-bold">El inventario está estable.</p>}
            </div>
          </div>

          {/* CRM Widget */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2 text-[#C5A184]">
                <Users className="text-[#C5A184]" /> Clientes Frecuentes (CRM)
              </h3>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-600">Programa Fidelidad KFS</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={currentUser.loyaltyProgramActive || false} onChange={e => toggleLoyaltyProgram(currentUser.id, e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A184]"></div>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              {myCrm.map((c: any) => (
                <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0A1128] font-mono">{c.phone} {c.name && <span className="text-gray-500 font-sans font-medium text-xs ml-1">({c.name})</span>}</span>
                    <span className="text-xs text-gray-500">{c.purchasesCount} compras registradas</span>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-green-600 font-black block">{formatUSD(c.totalSpent)}</span>
                      {c.kfsPoints > 0 && <span className="text-[10px] font-bold text-[#C5A184] bg-[#C5A184]/10 px-2 py-0.5 rounded-full">{c.kfsPoints.toFixed(1)} KFS Pts</span>}
                    </div>
                    <a 
                      href={`https://wa.me/58${c.phone.replace(/^0+/, '').replace(/[^0-9]/g, '')}?text=Hola ${c.name || ''}, ¡Te extrañamos en ${currentUser.company}! 🎁 Tienes puntos acumulados por tus compras.`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#0A1128] text-white p-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center"
                      title="Re-Marketing (WhatsApp)"
                    >
                      <Users size={16} />
                    </a>
                  </div>
                </div>
              ))}
              {myCrm.length === 0 && <p className="text-sm text-gray-400 font-bold">Sin clientes registrados con teléfono.</p>}
            </div>
          </div>
        </div>

        {/* Z-Reports Widget */}
        {myZReports.length > 0 && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-xl text-[#0A1128] mb-6 flex items-center gap-2">
              <Lock className="text-[#0A1128]" /> Cortes de Caja (Reportes Z)
            </h3>
            <div className="space-y-3">
              {myZReports.map((z: any) => {
                const vendedor = myVendedores.find((v:any) => v.id === z.vendedorId);
                return (
                  <div key={z.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex flex-col">
                      <span className="font-black text-[#0A1128] uppercase tracking-wider text-sm">{vendedor?.name || "Vendedor"} - {new Date(z.timestamp).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-500">{z.txCount} transacciones procesadas</span>
                    </div>
                    <span className="font-black text-xl text-[#0A1128]">{formatUSD(z.totalUSD)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-black text-xl text-[#0A1128] mb-6 pl-2">Inventario en Flow Express</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myProducts.map((p: any) => {
              const hasCost = p.costUSD !== undefined && p.costUSD > 0;
              const margin = hasCost ? ((p.priceUSD - p.costUSD) / p.priceUSD) * 100 : 0;
              const recPrice = hasCost ? p.costUSD / 0.65 : 0;
              const marginVulnerable = hasCost && p.priceUSD < recPrice - 0.01;

              return (
                <div key={p.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${marginVulnerable ? "border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-gray-100"}`}>
                  <div className="h-40 bg-gray-100 w-full overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    {marginVulnerable && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse shadow-md">
                        ⚠️ Margen Vulnerado
                      </span>
                    )}
                    <button 
                      onClick={() => toggleProductFeatured(p.id, !p.isFeatured)} 
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
                      title={p.isFeatured ? "Quitar de Destacados" : "Marcar como Estrella"}
                    >
                      <Star size={16} className={p.isFeatured ? "fill-yellow-400 text-yellow-500" : "text-gray-400"} />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm truncate text-[#0A1128] mb-0.5">{p.name}</h4>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category || "General"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[10px] font-mono leading-tight">
                      <div className="flex flex-col text-gray-500">
                        <span>Costo:</span>
                        <span className="text-[#0A1128] font-bold">{hasCost ? formatUSD(p.costUSD) : "N/D"}</span>
                      </div>
                      <div className="flex flex-col text-gray-500 text-right">
                        <span>Margen:</span>
                        <span className={`font-black ${margin >= 35 ? "text-green-600" : margin > 0 ? "text-orange-500 animate-pulse" : "text-gray-400"}`}>
                          {hasCost ? `${margin.toFixed(1)}%` : "N/D"}
                        </span>
                      </div>
                    </div>

                    {marginVulnerable && (
                      <div className="bg-red-50/50 border border-red-100 p-2 rounded-lg text-center space-y-1.5">
                        <p className="text-[9px] font-bold text-red-600">Sugerido KFS: <span className="font-black text-xs">{formatUSD(recPrice)}</span></p>
                        <button 
                          onClick={() => shieldMargin(p.id, recPrice)} 
                          className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow transition-colors cursor-pointer"
                        >
                          🛡️ Blindar Margen
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t border-gray-100 mt-2">
                      <div>
                        <p className="text-[#0A1128] font-black text-sm">{formatUSD(p.priceUSD)}</p>
                        <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {p.stock && p.stock > 0 ? `${p.stock} unids` : "Agotado"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {myProducts.length === 0 && <div className="col-span-2 md:col-span-4 text-center py-10 bg-white rounded-2xl text-gray-400 font-bold">Catálogo vacío.</div>}
          </div>
        </div>
      </div>

      {/* Modal Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#0A1128]">Nuevo Producto</h3>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({...newProd, barcode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-mono text-gray-900" />
                <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-[#0A1128] text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                  <Search size={18} />
                </button>
              </div>
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Costo Insumo</label>
                  <input required type="number" step="0.01" placeholder="Costo ($)" value={newProd.cost} onChange={e => setNewProd({...newProd, cost: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Precio Venta</label>
                  <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-black text-gray-900 text-center" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock</label>
                  <input required type="number" placeholder="Cant" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900 text-center" />
                </div>
              </div>
              <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900">
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Ropa y Calzado">Ropa y Calzado</option>
                <option value="Tecnología">Tecnología y Electrónica</option>
                <option value="Salud y Belleza">Salud y Belleza</option>
                <option value="Hogar">Hogar y Muebles</option>
                <option value="Servicios">Servicios Generales</option>
              </select>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {newProd.imgUrl ? (
                   <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Camera size={40} className="mb-3" />
                    <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[#0A1128] bg-[#C5A184] shadow-lg cursor-pointer">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Vendedor */}
      {showAddVendedor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#0A1128]">Nuevo Empleado</h3>
            <form onSubmit={handleAddVendedor} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-4">
                <label className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewVendedor(prev => ({ ...prev, avatar: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  {newVendedor.avatar ? (
                    <img src={newVendedor.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                      <Camera size={20} className="mx-auto" />
                      <span className="text-[7px] font-bold block mt-0.5">Foto</span>
                    </div>
                  )}
                </label>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Foto del Empleado</span>
              </div>

              <input required type="text" placeholder="Nombre del Vendedor" value={newVendedor.name} onChange={e => setNewVendedor({...newVendedor, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-gray-900" />
              <input required type="email" placeholder="Correo (Usuario de Acceso)" value={newVendedor.email} onChange={e => setNewVendedor({...newVendedor, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-gray-900" />
              <input required type="password" placeholder="Clave de Acceso" value={newVendedor.password} onChange={e => setNewVendedor({...newVendedor, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-gray-900" />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddVendedor(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-[#0A1128] shadow-lg cursor-pointer">Crear Acceso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Gasto */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#0A1128]">Registrar Gasto (Egreso)</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              addExpense({
                description: newExpense.description,
                amountUSD: parseFloat(newExpense.amountUSD) || 0,
                clientId: currentUser.id
              });
              setNewExpense({ description: "", amountUSD: "" });
              setShowExpenseModal(false);
            }} className="space-y-4">
              <input required type="text" placeholder="Concepto (Ej. Alquiler, Proveedor)" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-gray-900" />
              <input required type="number" step="0.01" placeholder="Monto Total (USD)" value={newExpense.amountUSD} onChange={e => setNewExpense({...newExpense, amountUSD: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-gray-900" />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg cursor-pointer">Descontar Saldo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-[#0A1128] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[#0A1128]">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[#0A1128] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
            
            {activeManual === 'owner' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[#C5A184]" size={28} /> Manual de Uso del Dueño</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. ¿Qué es KFS OS?</p>
                    <p>Es tu centro de comando. Desde aquí controlas tus ventas físicas, tu E-Commerce (Flow Express Marketplace), empleados e inventario en un solo lugar.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Control de Inventario:</p>
                    <p>Usa la sección "Inventario" para cargar tus productos. Recomendamos usar código de barras reales (EAN/UPC) para que la búsqueda en caja sea instantánea.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Control de Empleados (Vendedores):</p>
                    <p>Crea usuarios y contraseñas temporales para tus cajeros. Ellos accederán desde sus propios dispositivos o la PC de la tienda al panel de Caja Registradora.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">4. Liquidación y Tarifas:</p>
                    <p>Tus ganancias netas están en la cima de este panel. La deuda KFS se calcula basada en tu tarifa operativa y debe ser cancelada en los datos de transferencia mostrados abajo.</p>
                  </div>
                </div>
              </div>
            )}
            {activeManual === 'benefits' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Star className="text-[#C5A184]" size={28} /> Whitepaper de Beneficios KFS</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                    <p className="font-black text-blue-800 text-xs uppercase tracking-widest mb-1">El Ecosistema Financiero</p>
                    <p className="text-blue-700 text-xs">Ahorros masivos al eliminar software de terceros obsoleto.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. E-Commerce Flow Express Gratuito:</p>
                    <p>Tu inventario está conectado en tiempo real al marketplace Flow Express. Cualquier cliente puede comprar online con pago móvil, Zelle o Binance Pay sin comisiones adicionales.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Sincro-Shield Fiscal Gratuito:</p>
                    <p>No necesitas pagar licencias anuales a intermediarios. Nuestro proxy conecta tu PC directo a la impresora fiscal bajo las normativas del SENIAT.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Conciliación Automática SMS:</p>
                    <p>Si activas la función SMS, el sistema verificará pagos móviles entrantes de forma autónoma. Se acabaron los fraudes de capturas falsas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// Scanner View Component (Maintains camera and simulation logic)
const ScannerView = ({ videoRef, onClose, onScan, myProducts, formatUSD }: any) => {
  const [selectedProductToSimulate, setSelectedProductToSimulate] = useState("");
  const [selectedScanType, setSelectedScanType] = useState("product");
  const [selectedCedula, setSelectedCedula] = useState("PDF417:V25218648JAVIER_CASTILLO_M28051995");
  const localStreamRef = useRef<any>(null);

  useEffect(() => {
    let active = true;
    let detectorInterval: any;

    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (active) {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          localStreamRef.current = stream;

          if ('BarcodeDetector' in window) {
            try {
              const detector = new (window as any).BarcodeDetector({ 
                formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'] 
              });
              
              detectorInterval = setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                  try {
                    const barcodes = await detector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                      clearInterval(detectorInterval);
                      onScan(barcodes[0].rawValue);
                    }
                  } catch (e) {
                    // Ignore transient detection errors
                  }
                }
              }, 500);
            } catch (e) {
              console.warn("BarcodeDetector API no soportada totalmente en este navegador.");
            }
          }
        }
      } catch (err) {
        console.warn("Cámara física no disponible. Se activa el simulador interactivo KFS.");
      }
    };

    startCam();

    return () => {
      active = false;
      if (detectorInterval) clearInterval(detectorInterval);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [videoRef, onScan]);

  const handleSimulatedScan = () => {
    if (!selectedProductToSimulate) return;
    onScan(selectedProductToSimulate);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#0A1128] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white cursor-pointer">
          <X size={24} />
        </button>
        <h3 className="text-xl font-black text-[#C5A184] mb-4 flex items-center gap-2"><QrCode /> Terminal de Escaneo KFS</h3>
        
        {/* Scan Frame */}
        <div className="relative w-full aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center mb-6">
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
          
          {/* Laser animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse border-b-2 border-red-400 z-10" style={{ animationDuration: "1.5s", animationIterationCount: "infinite" }} />
          
          {/* Crosshair target brackets */}
          <div className="absolute top-12 left-12 w-8 h-8 border-t-4 border-l-4 border-[#C5A184] rounded-tl z-10" />
          <div className="absolute top-12 right-12 w-8 h-8 border-t-4 border-r-4 border-[#C5A184] rounded-tr z-10" />
          <div className="absolute bottom-12 left-12 w-8 h-8 border-b-4 border-l-4 border-[#C5A184] rounded-bl z-10" />
          <div className="absolute bottom-12 right-12 w-8 h-8 border-b-4 border-r-4 border-[#C5A184] rounded-br z-10" />

          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-center z-10">
            <span className="text-[10px] text-gray-300 font-mono flex items-center justify-center gap-1"><Info size={12}/> Buscando QR o Código de Barras...</span>
          </div>
        </div>

        {/* Simulation Dropdown for testing without cameras */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
            <button 
              type="button"
              onClick={() => setSelectedScanType("product")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "product" ? "bg-[#C5A184] text-[#0A1128]" : "bg-white/5 text-gray-400"}`}
            >
              📦 Producto
            </button>
            <button 
              type="button"
              onClick={() => setSelectedScanType("cedula")}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedScanType === "cedula" ? "bg-[#C5A184] text-[#0A1128]" : "bg-white/5 text-gray-400"}`}
            >
              🪪 Cédula PDF417
            </button>
          </div>

          {selectedScanType === "product" ? (
            <select 
              className="w-full bg-[#0A1128] text-white border border-[#C5A184]/30 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
              value={selectedProductToSimulate}
              onChange={(e) => setSelectedProductToSimulate(e.target.value)}
            >
              <option value="">-- Seleccionar Producto a Escanear --</option>
              {myProducts.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} - {formatUSD(p.priceUSD)}</option>
              ))}
            </select>
          ) : (
            <select 
              className="w-full bg-[#0A1128] text-white border border-[#C5A184]/30 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-mono"
              value={selectedCedula}
              onChange={(e) => setSelectedCedula(e.target.value)}
            >
              <option value="PDF417:V25218648JAVIER_CASTILLO_M28051995">V-25.218.648 Javier Castillo (M)</option>
              <option value="PDF417:V12345678MARIA_PEREZ_F15081985">V-12.345.678 Maria Perez (F)</option>
              <option value="PDF417:E87654321PEDRO_GOMEZ_M10101974">E-87.654.321 Pedro Gomez (M)</option>
            </select>
          )}

          <button 
            type="button"
            onClick={handleSimulatedScan} 
            className="w-full py-3 bg-[#C5A184] text-[#0A1128] font-black rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Detonar Escaneo Simulado
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="px-6 py-2 border border-white/15 text-xs text-gray-300 font-bold rounded-lg cursor-pointer">
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};

// Vendedor Dashboard
const VendedorDashboard = ({ db, setDb, currentUser, addProduct, processPurchase, showToast, formatUSD, logout, approveOrder, rejectOrder, generateZReport, registerCrmExpress, triggerGhostTrap }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const [scannedGlobalProduct, setScannedGlobalProduct] = useState<any>(null);
  const [smsInput, setSmsInput] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const { queryGlobalBarcode, smsConciliator, rates } = useKFS();

  const handleManualSmsConciliation = () => {
    if (!smsInput.trim()) return;
    const result = smsConciliator(smsInput);
    if (result.matched) {
      playPremiumChime();
      showToast(`¡Conciliación Exitosa! Orden auto-aprobada por SMS. Ref: ${result.reference}`, "success");
      setSmsInput("");
    } else {
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast(`SMS leído (Ref: ${result.reference || "Desconocida"}, Bs. ${result.amount || 0}), pero no coincide con ninguna orden online pendiente.`, "error");
      }
    }
  };
  
  const [newProd, setNewProd] = useState({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "" });
  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);
  const [activeManual, setActiveManual] = useState<string | null>(null);

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode) return;
    setIsFetchingBarcode(true);
    try {
      // 1. Consultar el Catálogo Nacional de Venezuela (Garantía offline-first)
      const globalProd = await queryGlobalBarcode(barcode);
      if (globalProd) {
        setNewProd(prev => ({
          ...prev,
          name: globalProd.name,
          imgUrl: globalProd.imgUrl,
          category: globalProd.category || prev.category
        }));
        showToast(`¡Producto encontrado en Catálogo Venezolano! (${globalProd.brand})`, "success");
        setIsFetchingBarcode(false);
        return;
      }

      // 2. Fallback a Open Food Facts global
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setNewProd(prev => ({
          ...prev,
          name: data.product.product_name || data.product.product_name_es || prev.name,
          imgUrl: data.product.image_url || prev.imgUrl
        }));
        showToast("¡Producto encontrado en la base global!", "success");
      } else {
        showToast("Producto no encontrado en base global. Complete manualmente.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error consultando base de datos. Complete manualmente.");
    }
    setIsFetchingBarcode(false);
  };

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.clientId);
  const myOrders = db.orders?.filter((o: any) => o.clientId === currentUser.clientId && o.status === 'pending') || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd(prev => ({ ...prev, imgUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ 
      name: newProd.name, 
      priceUSD: parseFloat(newProd.price), 
      stock: parseInt(newProd.stock) || 0,
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", 
      clientId: currentUser.clientId, 
      clientName: currentUser.company,
      category: newProd.category,
      barcode: newProd.barcode
    });
    setShowAddModal(false);
    setNewProd({ name: "", price: "", stock: "", imgUrl: "", category: "Alimentos", barcode: "" });
  };

  const handleScanSuccess = async (prodIdOrBarcode: string) => {
    // Intercept PDF417 Cédula Scanner
    if (prodIdOrBarcode.startsWith("PDF417:")) {
      const payload = prodIdOrBarcode.substring(7); // remove prefix
      const match = payload.match(/^([V|E])([0-9]+)([A-Z_]+)_([A-Z_]+)_([M|F])([0-9]{8})$/);
      if (match) {
        const type = match[1];
        const cedula = match[2];
        const name = match[3].replace(/_/g, ' ');
        const surname = match[4].replace(/_/g, ' ');
        
        const crmPhone = `0414-${Math.floor(1000000 + Math.random() * 9000000)}`;
        registerCrmExpress(`${type}-${cedula}`, name, surname, crmPhone);
        
        playPremiumChime();
        showToast(`CRM Express: ¡Cédula ${type}-${cedula} (${name} ${surname}) registrada en CRM!`, "success");
      } else {
        showToast("Error decodificando código PDF417 de la Cédula.", "error");
      }
      setShowScanner(false);
      return;
    }

    // 1. Buscar por ID o código de barras localmente
    let prod = db.products.find((p: any) => p.id === prodIdOrBarcode || p.barcode === prodIdOrBarcode);
    
    if (prod) {
      setCheckoutProduct(prod);
      setShowScanner(false);
      return;
    }

    // 2. Consulta en el Catálogo Nacional de Venezuela (Garantía offline-first)
    const globalProd = await queryGlobalBarcode(prodIdOrBarcode);
    if (globalProd) {
      playPremiumChime();
      setScannedGlobalProduct({
        barcode: prodIdOrBarcode,
        name: globalProd.name,
        imgUrl: globalProd.imgUrl,
        category: globalProd.category || "Alimentos",
        brand: globalProd.brand || "Venezuela",
        source: globalProd.source
      });
      setShowScanner(false);
      return;
    }

    // 3. Fallback a Open Food Facts global
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${prodIdOrBarcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const productName = data.product.product_name || data.product.product_name_es || "Producto Desconocido";
        const imgUrl = data.product.image_url || "";
        playPremiumChime();
        setScannedGlobalProduct({
          barcode: prodIdOrBarcode,
          name: productName,
          imgUrl: imgUrl,
          category: "Alimentos",
          brand: "Importado / Global",
          source: "openfoodfacts"
        });
      } else {
        showToast("Producto no encontrado en las bases de datos.");
      }
    } catch (e) {
      showToast("Producto no reconocido y error de red.");
    }
    setShowScanner(false);
  };

  const handleConfirmCheckout = (paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string, customerName: string, customerRif: string) => {
    const tx = processPurchase(checkoutProduct, paymentMethod, applyIva, customerPhone, customerName, customerRif);
    if (tx) {
      setReceiptTx(tx);
    }
    setCheckoutProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <nav className="flex justify-between items-center p-4 border-b border-white/5 bg-[#0A1128] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Shield size={24} style={{ color: KREATEK_COLORS.bronze }} />
          <span className="font-bold text-lg tracking-widest uppercase text-[#C5A184] hidden sm:inline-block">
            Terminal: {currentUser.company}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => showToast("Comando TFHKA Reporte X enviado...", "success")} className="flex items-center gap-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-4 py-2 rounded-xl transition-colors text-sm font-bold">
              Reporte X
            </button>
            <button onClick={() => { generateZReport(currentUser.id, currentUser.clientId); showToast("Comando TFHKA Z enviado. Sesión cerrada.", "success"); }} className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-colors text-sm font-bold">
              Cerrar Caja (Z)
            </button>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors text-white cursor-pointer text-sm font-bold">
            Salir
          </button>
        </div>
      </nav>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        
        <div className="bg-[#0A1128] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative z-10">
            <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-1">Sesión Operativa</p>
            <h2 className="text-3xl font-black">{currentUser.name}</h2>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Terminal en línea y asegurado.
            </p>
          </div>
          
          <div className="relative z-10 bg-black/50 border border-green-500/30 p-4 rounded-xl flex flex-col items-end">
             <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Cumplimiento SUNDDE</span>
             <span className="text-2xl font-black text-white">Tasa Oficial BCV: {rates?.USD?.toFixed(2)} Bs</span>
             <span className="text-[10px] text-gray-400 mt-1">Gaceta Oficial Banco Central de Venezuela</span>
          </div>

          <Activity size={150} className="absolute -right-10 -bottom-10 text-white/5" />
        </div>

        <KFSIoTEdgeConsole showToast={showToast} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => setShowAddModal(true)} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:border-[#C5A184]/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-[#0A1128]/5 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-[#0A1128]" />
            </div>
            <span className="font-black text-[#0A1128]">Subir Producto</span>
          </button>
          <button onClick={() => { setShowScanner(true); showToast("Cámara de escaneo activada."); }} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:border-[#C5A184]/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-[#0A1128]/5 rounded-full flex items-center justify-center">
              <QrCode size={24} className="text-[#0A1128]" />
            </div>
            <span className="font-black text-[#0A1128]">Escanear QR / Compra</span>
          </button>
          <button onClick={() => setActiveManual('operator')} className="bg-[#0A1128] text-white p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4 hover:bg-gray-900 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-[#C5A184]" />
            </div>
            <span className="font-black text-white">Manual de Operación</span>
          </button>
        </div>

        {myOrders.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-200 bg-orange-50/30">
            <h3 className="font-black text-xl text-[#0A1128] mb-4 flex items-center gap-2 text-orange-600">
              <Clock className="text-orange-500" /> Órdenes Online ({myOrders.length})
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Lista de Órdenes */}
              <div className="lg:col-span-2 space-y-3">
                {myOrders.map((order: any) => {
                  const product = db.products.find((p: any) => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-xl border border-orange-100 shadow-sm gap-3 animate-fade-in">
                      <div>
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider mb-1 inline-block">Validación Pendiente</span>
                        <h4 className="font-bold text-sm text-[#0A1128]">{product?.name || "Producto Desconocido"}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">Ref: <span className="font-bold text-gray-900">{order.paymentReference}</span> | {order.paymentMethod}</p>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-right flex-1 md:flex-none">
                          <p className="font-black text-base text-green-600">{formatUSD(order.amountUSD)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => rejectOrder(order.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer" title="Rechazar"><X size={18} /></button>
                          <button onClick={() => approveOrder(order.id)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors cursor-pointer" title="Aprobar Pago"><CheckCircle size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: Conciliador SMS Real */}
              <div className="bg-[#0A1128] border border-[#C5A184]/20 rounded-3xl p-5 text-[#F8F9FA] relative overflow-hidden shadow-xl flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A184]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-[#C5A184]/15 text-[#C5A184]">
                      <Bell size={16} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs tracking-wide">CONCILIADOR SMS</h4>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                    Pega el SMS de notificación del Pago Móvil recibido para conciliar y auto-aprobar la orden del cliente de inmediato.
                  </p>
                  
                  <textarea 
                    placeholder="Pega el SMS recibido..."
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#C5A184] placeholder:text-gray-600 resize-none leading-relaxed"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={handleManualSmsConciliation}
                  className="w-full mt-3 py-2.5 rounded-xl font-black text-xs text-[#0A1128] bg-[#C5A184] hover:bg-[#b08e72] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ⚡ Conciliar SMS
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h3 className="font-black text-[#0A1128] text-lg flex items-center gap-2"><Package size={20} className="text-[#C5A184]"/> Catálogo de {currentUser.company}</h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar producto o barcode..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184]" value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {myProducts.filter((p: any) => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).map((p: any) => (
              <div key={p.id} className="border border-gray-100 rounded-2xl p-3 flex flex-col justify-between bg-gray-50/50">
                <div className="h-28 bg-gray-200 rounded-lg overflow-hidden mb-2">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <div>
                  <h4 className="font-bold text-xs truncate text-gray-900">{p.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <p className="text-xs font-black text-[#C5A184]">{formatUSD(p.priceUSD)}</p>
                      <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock && p.stock > 0 ? `${p.stock} u.` : "Agotado"}
                    </span>
                  </div>
                </div>
                <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} className="mt-2 w-full py-2 bg-[#0A1128] disabled:bg-gray-400 hover:bg-gray-800 text-white font-bold rounded-lg text-[10px] cursor-pointer disabled:cursor-not-allowed">
                  {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Cargar Venta"}
                </button>
              </div>
            ))}
            {myProducts.filter((p: any) => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || (p.barcode && p.barcode.includes(searchProduct))).length === 0 && <p className="col-span-full text-center text-xs text-gray-400 py-6 font-bold">Sin resultados o sin productos cargados.</p>}
          </div>
        </div>
      </div>

      {/* Scanner View Integration */}
      {showScanner && (
        <ScannerView 
          videoRef={videoRef} 
          onClose={() => setShowScanner(false)} 
          onScan={handleScanSuccess} 
          myProducts={myProducts} 
          formatUSD={formatUSD}
        />
      )}

      {checkoutProduct && (
        <CheckoutModal 
          product={checkoutProduct} 
          onConfirm={handleConfirmCheckout} 
          onCancel={() => setCheckoutProduct(null)} 
          formatUSD={formatUSD} 
        />
      )}
      
      {receiptTx && (
        <ReceiptModal 
          tx={receiptTx} 
          product={db.products.find((p:any) => p.id === receiptTx.productId)}
          onClose={() => setReceiptTx(null)} 
          formatUSD={formatUSD}
          triggerGhostTrap={triggerGhostTrap}
          showToast={showToast}
          currentUser={currentUser}
        />
      )}

      {/* Modal Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#0A1128]">Nuevo Producto</h3>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Código de Barras (Opcional)" value={newProd.barcode} onChange={e => setNewProd({...newProd, barcode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-mono text-gray-900" />
                <button type="button" onClick={() => handleBarcodeSearch(newProd.barcode)} disabled={isFetchingBarcode} className="bg-[#0A1128] text-white px-4 rounded-xl font-bold flex-shrink-0 disabled:opacity-50">
                  <Search size={18} />
                </button>
              </div>
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" placeholder="Precio ($)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-black text-lg text-gray-900" />
                <input required type="number" placeholder="Stock" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
              </div>
              <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900">
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Ropa y Calzado">Ropa y Calzado</option>
                <option value="Tecnología">Tecnología y Electrónica</option>
                <option value="Salud y Belleza">Salud y Belleza</option>
                <option value="Hogar">Hogar y Muebles</option>
                <option value="Servicios">Servicios Generales</option>
              </select>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {newProd.imgUrl ? (
                   <img src={newProd.imgUrl} className="mx-auto h-32 object-cover rounded-lg shadow-md" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Camera size={40} className="mb-3" />
                    <span className="text-sm font-bold">Tocar para seleccionar de Galería</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="w-2/3 py-3 rounded-xl font-black text-[#0A1128] bg-[#C5A184] shadow-lg cursor-pointer">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Producto Detectado en Catálogo Global / Nacional */}
      {scannedGlobalProduct && (
        <div className="fixed inset-0 bg-[#0A1128]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-[#0A1128] border border-[#C5A184]/30 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            {/* Efecto de brillo de fondo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A184]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-[#C5A184]/10 text-[#C5A184]">
                <Package size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F8F9FA]">Producto Detectado</h3>
                <p className="text-xs text-[#C5A184] font-bold tracking-widest uppercase animate-pulse">
                  {scannedGlobalProduct.source === "local_venezuela" || scannedGlobalProduct.source === "supabase_cloud"
                    ? "Catálogo Nacional de Venezuela"
                    : "Base de Datos Global (OpenFoodFacts)"}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              El artículo escaneado está registrado en la base de datos central, pero <span className="text-[#C5A184] font-bold">no existe aún en tu inventario local</span>. Puedes agregarlo instantáneamente.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex gap-4 items-center">
              {scannedGlobalProduct.imgUrl ? (
                <img 
                  src={scannedGlobalProduct.imgUrl} 
                  alt={scannedGlobalProduct.name} 
                  className="w-20 h-20 object-cover rounded-xl border border-white/10 shadow-lg flex-shrink-0 bg-white/10 animate-fade-in" 
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#C5A184]">
                  <Camera size={28} />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[#F8F9FA] font-black text-lg truncate" title={scannedGlobalProduct.name}>
                  {scannedGlobalProduct.name}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Marca: <span className="text-gray-300 font-semibold">{scannedGlobalProduct.brand}</span> • Categoría: <span className="text-gray-300 font-semibold">{scannedGlobalProduct.category}</span>
                </p>
                <p className="text-[#C5A184] font-mono text-xs mt-2 bg-[#C5A184]/10 border border-[#C5A184]/20 rounded px-2.5 py-1 inline-block">
                  {scannedGlobalProduct.barcode}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setScannedGlobalProduct(null)} 
                className="w-1/3 py-3.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold cursor-pointer transition-colors"
              >
                Ignorar
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setNewProd({
                    name: scannedGlobalProduct.name,
                    price: "",
                    stock: "20",
                    imgUrl: scannedGlobalProduct.imgUrl || "",
                    category: scannedGlobalProduct.category || "Alimentos",
                    barcode: scannedGlobalProduct.barcode
                  });
                  setScannedGlobalProduct(null);
                  setShowAddModal(true);
                }} 
                className="w-2/3 py-3.5 rounded-xl font-black text-[#0A1128] bg-[#C5A184] hover:bg-[#b08e72] shadow-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Registrar en Inventario
              </button>
            </div>
          </div>
        </div>
      )}

      {activeManual && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-[#0A1128] rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-8 shadow-2xl border-4 border-[#0A1128]">
            <button onClick={() => setActiveManual(null)} className="absolute top-6 right-6 text-gray-500 hover:text-[#0A1128] transition-colors cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
            
            {activeManual === 'operator' && (
              <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-[#C5A184]" size={28} /> Manual del Operador (Caja)</h2>
                <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">1. Registro de Compras Físicas:</p>
                    <p>Usa el botón "Escanear QR / Compra" o busca el producto manualmente. Selecciona el método de pago e ingresa el RIF o Cédula del cliente si requiere Factura Fiscal.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">2. Validar Órdenes Online (E-Commerce):</p>
                    <p>Las compras realizadas por clientes en la tienda online aparecerán en el panel "Órdenes Online". Copia el mensaje SMS del banco (Pago Móvil) y pégalo en el "Conciliador SMS" para aprobar la orden automáticamente.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">3. Cierre de Caja (Reporte Z):</p>
                    <p>Al final del turno, debes presionar "Cerrar Caja (Z)" en el menú superior. Esto enviará la totalización al dueño y cerrará tu sesión operativa.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-black text-[#0A1128] mb-1">4. Impresión Fiscal:</p>
                    <p>Asegúrate de que la aplicación "Sincro-Shield Proxy" esté corriendo en la PC de caja para que el sistema KFS pueda emitir los recibos por la impresora conectada.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Marketplace Public View
const MarketplaceView = ({ db, submitOnlineOrder, formatUSD, logout, currentUser }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [receiptTx, setReceiptTx] = useState<any>(null);
  const { rates, triggerGhostTrap, showToast } = useKFS();
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleConfirmCheckout = (paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string, customerName: string, customerRif: string) => {
    submitOnlineOrder(checkoutProduct, paymentMethod, applyIva, paymentReference, customerPhone, customerName, customerRif);
    setCheckoutProduct(null);
  };
  
  const filteredClients = db.clients.filter((c: any) => 
    c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStore = activeStoreId ? db.clients.find((c: any) => c.id === activeStoreId) : null;
  const storeProducts = activeStore ? db.products.filter((p: any) => p.clientId === activeStoreId) : [];
  
  const filteredProducts = storeProducts.filter((p: any) => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredProducts = storeProducts.filter((p: any) => p.isFeatured);

  const categories = ["All", "Alimentos", "Ropa y Calzado", "Tecnología", "Salud y Belleza", "Hogar", "Servicios"];

  const settings = activeStore?.storeSettings || {};
  const themeColor = settings.themeColor || "#C5A184";
  const typography = settings.typography || "font-sans";
  const layoutType = settings.layoutType || "grid";
  const profilePicUrl = settings.profilePicUrl || "";

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${activeStore ? typography : "font-sans"}`}>
      <Navbar title={activeStore ? `Mall: ${activeStore.company}` : "Flow Express"} showBack={true} onBack={logout} />
      
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {activeStore && settings.coverPhotoUrl ? (
          <div className="relative rounded-3xl overflow-hidden shadow-sm mb-8 border border-gray-100">
            <div className="h-48 w-full bg-gray-200">
              <img src={settings.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white p-6 pt-12 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="absolute -top-12 left-6">
                <img src={profilePicUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&auto=format&fit=crop&q=60"} alt="Store Logo" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white" style={{ borderColor: themeColor }} />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-28">
                <h2 className="text-3xl font-black text-[#0A1128]">{activeStore.company}</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">{settings.bioText || "Catálogo exclusivo de este negocio."}</p>
              </div>
              <div className="relative w-full sm:w-80 shrink-0">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar en esta tienda..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A184] text-gray-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              {activeStore && profilePicUrl && (
                <img src={profilePicUrl} alt="Store Logo" className="w-16 h-16 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: themeColor }} />
              )}
              <div>
                <h2 className="text-2xl font-black text-[#0A1128]">{activeStore ? activeStore.company : "Centros Comerciales KFS"}</h2>
                <p className="text-xs text-gray-500 mt-1">{activeStore ? (settings.bioText || "Catálogo exclusivo de este negocio.") : "Explora nuestras tiendas destacadas y descubre sus productos."}</p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={activeStore ? "Buscar en esta tienda..." : "Buscar comercio..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A184] text-gray-900"
              />
            </div>
          </div>
        )}

        {!activeStoreId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredClients.map((c: any) => {
               const pCount = db.products.filter((p: any) => p.clientId === c.id).length;
               return (
                <div key={c.id} onClick={() => setActiveStoreId(c.id)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 transition-transform group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-[#0A1128]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#C5A184]/10 transition-colors">
                      <Store size={32} className="text-[#0A1128] group-hover:text-[#C5A184] transition-colors" />
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                      <Star size={12} className="fill-yellow-600" /> {c.rating || "5.0"}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-[#0A1128]">{c.company}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{c.address || "Comercio Afiliado"}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                    <span>{pCount} Productos</span>
                    <span className="text-[#C5A184]">Entrar a la tienda &rarr;</span>
                  </div>
                </div>
               );
            })}
            {filteredClients.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
                No se encontraron comercios.
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { setActiveStoreId(null); setSearchQuery(""); }} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0A1128] transition-colors">
                <ChevronLeft size={16} /> Volver a Tiendas
              </button>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={selectedCategory === cat ? { backgroundColor: themeColor, color: '#fff' } : {}}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? "shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
                >
                  {cat === "All" ? "Todos los Productos" : cat}
                </button>
              ))}
            </div>

            {featuredProducts.length > 0 && selectedCategory === "All" && searchQuery === "" && (
              <div className="mb-8">
                <h3 className="text-lg font-black text-[#0A1128] mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" /> Productos Estrella
                </h3>
                <div className={`grid gap-6 ${layoutType === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                  {featuredProducts.map((p: any) => (
                    <div key={p.id} className={`bg-gradient-to-br from-yellow-50 to-white rounded-[1.5rem] shadow-sm overflow-hidden border border-yellow-200 flex ${layoutType === 'list' ? 'flex-row items-center h-32' : 'flex-col justify-between'} transition-transform duration-200 hover:-translate-y-1 relative`}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/20 rounded-bl-[100%] z-0 pointer-events-none"></div>
                      <div className={`relative z-10 ${layoutType === 'list' ? 'flex flex-row w-full h-full' : 'w-full'}`}>
                        <div className={`${layoutType === 'list' ? 'w-32 h-full' : 'h-44 w-full'} bg-gray-100 overflow-hidden relative shrink-0`}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-[8px] bg-yellow-500 text-white font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                            Destacado
                          </span>
                        </div>
                        <div className={`p-4 flex flex-col justify-between ${layoutType === 'list' ? 'w-full' : ''}`}>
                          <div>
                            <h4 className="font-bold text-sm text-[#0A1128] truncate mb-1">{p.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <p className="font-black text-sm" style={{ color: themeColor }}>{formatUSD(p.priceUSD)}</p>
                                <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                          <div className={layoutType === 'list' ? 'mt-2' : 'mt-4'}>
                            <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} style={p.stock > 0 ? { backgroundColor: themeColor } : {}} className="w-full py-2 disabled:bg-gray-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-md hover:brightness-90 transition-all">
                              <ShoppingCart size={14} /> {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Comprar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`grid gap-6 ${layoutType === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {filteredProducts.map((p: any) => (
                <div key={p.id} className={`bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex ${layoutType === 'list' ? 'flex-row items-center h-32' : 'flex-col justify-between'} transition-transform duration-200 hover:-translate-y-1`}>
                  <div className={layoutType === 'list' ? 'flex flex-row w-full h-full' : 'w-full'}>
                    <div className={`${layoutType === 'list' ? 'w-32 h-full' : 'h-44 w-full'} bg-gray-100 overflow-hidden relative shrink-0`}>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 text-[8px] bg-[#0A1128]/80 text-[#C5A184] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#C5A184]/20 backdrop-blur-sm">
                        {p.category || "General"}
                      </span>
                    </div>
                    <div className={`p-4 flex flex-col justify-between ${layoutType === 'list' ? 'w-full' : ''}`}>
                      <div>
                        <h4 className="font-bold text-sm text-[#0A1128] truncate mb-1">{p.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="font-black text-sm" style={{ color: themeColor }}>{formatUSD(p.priceUSD)}</p>
                            <p className="text-[10px] font-bold text-gray-500">Bs. {(p.priceUSD * (rates?.USD || 36.45)).toFixed(2)}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock && p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {p.stock && p.stock > 0 ? `${p.stock} disp.` : "Agotado"}
                          </span>
                        </div>
                      </div>
                      <div className={layoutType === 'list' ? 'mt-2' : 'mt-4'}>
                        <button disabled={p.stock !== undefined && p.stock <= 0} onClick={() => setCheckoutProduct(p)} style={p.stock > 0 ? { backgroundColor: themeColor } : {}} className="w-full py-2 disabled:bg-gray-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-md hover:brightness-90 transition-all">
                          <ShoppingCart size={14} /> {p.stock !== undefined && p.stock <= 0 ? "Agotado" : "Comprar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
                  Esta tienda no tiene productos en esta categoría.
                </div>
              )}
            </div>
          </>
        )}
      </div>



      {checkoutProduct && (
        <CheckoutModal 
          product={checkoutProduct} 
          onConfirm={handleConfirmCheckout} 
          onCancel={() => setCheckoutProduct(null)} 
          formatUSD={formatUSD}
          isOnline={true} 
        />
      )}
      
      {receiptTx && (
        <ReceiptModal 
          tx={receiptTx} 
          product={db.products.find((p:any) => p.id === receiptTx.productId)}
          onClose={() => setReceiptTx(null)} 
          formatUSD={formatUSD}
          triggerGhostTrap={triggerGhostTrap}
          showToast={showToast}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT DEFINITION
// ==========================================
export default function Home() {
  const {
    isClient, isBooting, view, setView, currentUser, setCurrentUser,
    toast, db, setDb, formatUSD, formatEUR, showToast,
    handleLogin, logout, registerClient, registerPromotora, approvePromotora, rejectPromotora, settlePromotoraEarnings, addProduct, addExpense, processPurchase,
    submitOnlineOrder, approveOrder, rejectOrder, generateZReport, registerCrmExpress,
    ghostTrapLocked, setGhostTrapLocked, triggerGhostTrap
  } = useKFS();

  const [ghostPassword, setGhostPassword] = useState("");
  const [ghostError, setGhostError] = useState("");

  const handleUnlockGhostTrap = () => {
    if (ghostPassword === "1234" || ghostPassword === "199521") {
      setGhostTrapLocked(false);
      setGhostPassword("");
      setGhostError("");
      showToast("Terminal desbloqueado con éxito.", "success");
    } else {
      setGhostError("Clave incorrecta. Acceso denegado.");
    }
  };

  if (isBooting || !isClient) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-[#C5A184]/20 border-t-[#C5A184] rounded-full animate-spin mb-6" />
          <KreatekLogo className="absolute top-[22px] h-8 w-auto" />
          <h1 className="text-xl font-bold tracking-widest uppercase text-[#C5A184] animate-pulse">
            Kreatek <span className="font-light text-white">Flow OS</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-2">Loading core vectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1128]">
      <Toast toast={toast} />

      {ghostTrapLocked && (
        <div className="fixed inset-0 bg-[#0B0104]/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1A050A] border-2 border-red-500/30 rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 animate-pulse"></div>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-950/50 border border-red-500/40 rounded-full flex items-center justify-center animate-bounce text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <Lock size={36} className="animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
              🚨 GHOST TRAP ACTIVATED 🚨
            </h2>
            <p className="text-red-400 font-mono text-xs uppercase tracking-widest mb-6">
              Auditoría Criptográfica en Curso
            </p>

            <div className="bg-black/55 border border-red-500/10 rounded-2xl p-6 mb-6 text-left font-mono text-xs text-red-300 space-y-3 leading-relaxed">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ TERMINAL ]</span> 
                <span className="text-white font-bold">{currentUser?.name || "Vendedor Terminal"} ({currentUser?.role || "Terminal"})</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ ACCIÓN ]</span> 
                <span className="text-red-500 font-black">RECHAZO SOSPECHOSO DE ORDEN ONLINE</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>[ PROTOCOLO ]</span> 
                <span className="text-yellow-500 font-black">BLOQUEO ANTIFRAUDE INMEDIATO</span>
              </p>
              <p className="flex justify-between">
                <span>[ TIMESTAMP ]</span> 
                <span className="text-white">{new Date().toLocaleString()}</span>
              </p>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Este terminal de ventas ha sido congelado. Se requiere el ingreso de la contraseña maestra del dueño o del arquitecto para continuar.
            </p>

            <div className="space-y-4">
              <div>
                <input 
                  type="password" 
                  placeholder="Master Password (Dueño/Arquitecto)" 
                  value={ghostPassword} 
                  onChange={(e) => setGhostPassword(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockGhostTrap()}
                  className="w-full bg-black/60 border-2 border-red-500/20 focus:border-red-500 rounded-xl px-5 py-4 text-center font-black tracking-widest text-white text-lg focus:outline-none focus:ring-0 placeholder:text-gray-600 transition-colors"
                />
                {ghostError && <p className="text-xs text-red-500 font-bold mt-2">{ghostError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`https://wa.me/584141234567?text=ALERTA%20DE%20SEGURIDAD%20KFS%20OS:%20Se%20ha%20detonado%20el%20Protocolo%20Ghost%20Trap%20en%20el%20terminal%20de%20ventas.%20Operador:%20${currentUser?.name || "Vendedor"}.%20Acción:%20Rechazo%20de%20Orden.%20Favor%20auditar.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-4 rounded-xl font-black text-xs text-green-400 bg-green-950/20 border border-green-500/20 hover:bg-green-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  💬 Reportar a WhatsApp
                </a>
                
                <button 
                  onClick={handleUnlockGhostTrap}
                  className="py-4 rounded-xl font-black text-xs text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-red-600/20"
                >
                  🔓 Desbloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "landing" && <LandingPageView setView={setView} />}
      
      {view === "login" && (
        <LoginView 
          handleLogin={handleLogin} 
          registerClient={registerClient} 
          registerPromotora={registerPromotora} 
          db={db} 
          setView={setView}
          currentUser={currentUser}
          logout={logout}
        />
      )}
      {view === "marketplace" && (
        <MarketplaceView 
          db={db} 
          submitOnlineOrder={submitOnlineOrder} 
          formatUSD={formatUSD} 
          logout={logout} 
          currentUser={currentUser}
        />
      )}
      {view === "core" && (
        <CoreDashboard 
          db={db} 
          setDb={setDb} 
          approvePromotora={approvePromotora}
          rejectPromotora={rejectPromotora}
          settlePromotoraEarnings={settlePromotoraEarnings}
          showToast={showToast} 
          formatUSD={formatUSD} 
          formatEUR={formatEUR} 
          currentUser={currentUser}
          logout={logout}
        />
      )}
      {view === "promotora" && (
        <PromotoraDashboard 
          db={db} 
          setDb={setDb} 
          currentUser={currentUser} 
          registerClient={registerClient} 
          settlePromotoraEarnings={settlePromotoraEarnings}
          formatUSD={formatUSD} 
          formatEUR={formatEUR} 
          logout={logout}
        />
      )}
      {view === "client" && (
        <ClientDashboard 
          db={db} 
          setDb={setDb} 
          currentUser={currentUser} 
          addProduct={addProduct} 
          addExpense={addExpense}
          showToast={showToast} 
          formatUSD={formatUSD} 
          formatEUR={formatEUR} 
          logout={logout}
          approveOrder={approveOrder}
          rejectOrder={rejectOrder}
        />
      )}
      {view === "vendedor" && (
        <VendedorDashboard 
          db={db} 
          setDb={setDb} 
          currentUser={currentUser} 
          addProduct={addProduct} 
          processPurchase={processPurchase} 
          showToast={showToast} 
          formatUSD={formatUSD} 
          logout={logout}
          approveOrder={approveOrder}
          rejectOrder={rejectOrder}
          generateZReport={generateZReport}
          registerCrmExpress={registerCrmExpress}
        />
      )}
      {null}
    </div>
  );
}
