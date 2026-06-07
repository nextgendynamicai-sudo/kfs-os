"use client";

import React, { useState } from "react";
import { CreditCard, QrCode, Shield, X } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { compressImage } from "../lib/utils";
import { motion } from "framer-motion";

export const CheckoutModal = ({ product, onConfirm, onCancel, formatUSD, isOnline = false }: any) => {
  const { db, rates } = useKFS();
  const [paymentMethod, setPaymentMethod] = useState("cash_bs");
  const [applyIva, setApplyIva] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerRif, setCustomerRif] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  
  const [splitMethod1, setSplitMethod1] = useState("cash_usd");
  const [splitAmount1, setSplitAmount1] = useState("");
  const [splitMethod2, setSplitMethod2] = useState("cash_bs");

  const [isProcessingPos, setIsProcessingPos] = useState(false);
  const [posStep, setPosStep] = useState(0);

  const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(paymentMethod);
  const price = product.priceUSD;
  const iva = applyIva ? price * 0.16 : 0;
  const igtf = isForeign ? (price + iva) * 0.03 : 0;
  const total = price + iva + igtf;
  const totalBs = total * (rates?.USD || 36.45);
  const storeOwner = db.clients?.find((c: any) => c.id === product?.clientId);

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

    onConfirm(paymentMethod, applyIva, paymentReference, customerPhone, customerName, customerRif, paymentScreenshot);
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
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-black mb-2 text-[#0A1128]">{isOnline ? "Comprar Online" : "Caja Registradora"}</h3>
        <p className="text-sm text-gray-500 mb-6">{product.name}</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Método de Pago</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]">
              <option value="cash_bs">Pago Móvil / Transferencia (Bs)</option>
              <option value="zinli">Zinli</option>
              <option value="wally_tech">Wally Tech</option>
              <option value="airtm">AirTM</option>
              <option value="ubbi_app">Ubbi App</option>
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
                  <option value="zinli">Zinli</option>
                  <option value="wally_tech">Wally Tech</option>
                  <option value="airtm">AirTM</option>
                  <option value="ubbi_app">Ubbi App</option>
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
            <div className="space-y-4">
              {(['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_bs', 'binance'].includes(paymentMethod)) && (
                <div className="bg-[#C5A184]/10 p-4 rounded-xl border border-[#C5A184]/30">
                  <h4 className="text-[10px] font-black uppercase text-[#C5A184] mb-2 tracking-widest">Datos Exactos para el Pago</h4>
                  {paymentMethod === "zinli" && (
                    <p className="text-sm font-mono text-gray-800">Email Zinli: <strong>{storeOwner?.paymentMethods?.zinli || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "wally_tech" && (
                    <p className="text-sm font-mono text-gray-800">Wally Tech: <strong>{storeOwner?.paymentMethods?.wallyTech || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "airtm" && (
                    <p className="text-sm font-mono text-gray-800">AirTM: <strong>{storeOwner?.paymentMethods?.airtm || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "ubbi_app" && (
                    <p className="text-sm font-mono text-gray-800">Ubbi App: <strong>{storeOwner?.paymentMethods?.ubbiApp || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "binance" && (
                    <p className="text-sm font-mono text-gray-800">Binance Pay ID: <strong>{storeOwner?.paymentMethods?.binance || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "cash_bs" && (
                    <div className="text-sm font-mono text-gray-800 space-y-1">
                      <p>Banco: <strong>{storeOwner?.paymentMethods?.pagoMovilBank || "No configurado"}</strong></p>
                      <p>Teléfono: <strong>{storeOwner?.paymentMethods?.pagoMovilPhone || "No configurado"}</strong></p>
                      <p>Cédula/RIF: <strong>{storeOwner?.paymentMethods?.pagoMovilId || "No configurado"}</strong></p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Número de Referencia Bancaria</label>
                <input type="text" placeholder="Ej: 034199..." value={paymentReference} onChange={e => setPaymentReference(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
                <p className="text-[10px] text-gray-400 mt-1">Obligatorio. Nuestro KFS SMS Conciliator leerá esto para aprobar tu envío.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Capture de Pantalla de la Transacción</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await compressImage(file, 600);
                          setPaymentScreenshot(base64);
                        } catch (err) {
                          alert("Error al comprimir/cargar la imagen");
                        }
                      }
                    }} 
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#C5A184]/10 file:text-[#0A1128] hover:file:bg-[#C5A184]/20 cursor-pointer"
                  />
                  {paymentScreenshot && (
                    <div className="relative inline-block w-24">
                      <img src={paymentScreenshot} alt="Capture" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                      <button 
                        type="button" 
                        onClick={() => setPaymentScreenshot("")} 
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
      </motion.div>
    </div>
  );
};
