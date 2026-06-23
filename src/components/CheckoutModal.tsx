"use client";

import { KFS_BRAND } from "../config/brandConfig";
import React, { useState } from "react";
import { CreditCard, QrCode, Shield, X } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { compressImage } from "../lib/utils";
import { motion } from "framer-motion";

export const CheckoutModal = ({ product, onConfirm, onCancel, formatUSD, isOnline = false, storeOwner, currentUser }: any) => {
  const { db, rates, showToast } = useKFS() as any;
  const [paymentMethod, setPaymentMethod] = useState("cash_bs");
  const [applyIva, setApplyIva] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerRif, setCustomerRif] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [kPointsToBurn, setKPointsToBurn] = useState(0);
  
  const [splitMethod1, setSplitMethod1] = useState("cash_usd");
  const [splitAmount1, setSplitAmount1] = useState("");
  const [splitMethod2, setSplitMethod2] = useState("cash_bs");

  const [isProcessingPos, setIsProcessingPos] = useState(false);
  const [posStep, setPosStep] = useState(0);

  // Real-time validations
  const validatePhone = (phone: string, prefix: string) => {
    if (!phone) return false;
    const clean = phone.replace(/[^0-9]/g, "");
    let rawBody = clean;
    if (rawBody.startsWith('0')) {
      rawBody = rawBody.slice(1);
    }
    if (prefix === "+58") {
      return /^(412|414|424|416|426|415|425)\d{7}$/.test(rawBody);
    }
    return rawBody.length >= 7 && rawBody.length <= 12;
  };

  const validateRif = (rif: string) => {
    if (!rif) return false;
    return /^[VJGvjgEep]-[0-9]{8}-[0-9]$/.test(rif);
  };

  const handleRifChange = (val: string) => {
    let clean = val.toUpperCase().replace(/[^VGEJP0-9-]/g, "");
    let stripped = clean.replace(/-/g, "");
    if (stripped.length > 0) {
      let letter = stripped[0];
      if (/[VGEJP]/.test(letter)) {
        let body = stripped.slice(1, 9).replace(/[^0-9]/g, "");
        let verifier = stripped.slice(9, 10).replace(/[^0-9]/g, "");
        let formatted = letter;
        if (body.length > 0) formatted += "-" + body;
        if (verifier.length > 0) formatted += "-" + verifier;
        setCustomerRif(formatted);
      } else {
        setCustomerRif(clean);
      }
    } else {
      setCustomerRif("");
    }
  };

  const getLoadingMessage = (method: string) => {
    switch (method) {
      case "cash_usd":
      case "cash_eur":
        return "Registrando efectivo en caja de seguridad...";
      case "vale_credit":
        return "Validando y quemando código de vale...";
      case "split_currency":
        return "Conciliando desglose de pago mixto...";
      default:
        return "Enviando transacción al KFS SMS Conciliator...";
    }
  };

  const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(paymentMethod);
  const price = product.priceUSD;
  const iva = applyIva ? price * 0.16 : 0;
  const igtf = isForeign ? (price + iva) * 0.03 : 0;
  
  // Calcular descuento por {KFS_BRAND.economy.currency} (100 puntos = $0.10 -> 1 punto = $0.001)
  const discountUSD = kPointsToBurn * 0.001;
  const total = Math.max(0, price + iva + igtf - discountUSD);
  
  const totalBs = total * (rates?.USD || 36.45);
  const resolvedStoreOwner = storeOwner || db.clients?.find((c: any) => c.id === product?.clientId);
  const foundCustomer = db.customers?.find((c: any) => c.phone === customerPhone);
  const availableKPoints = foundCustomer?.k_points_balance || 0;

  const handleConfirm = async () => {
    if (currentUser?.id === product?.clientId) {
      showToast("Operación inválida: No puedes comprar tus propios productos.", "error");
      return;
    }
    
    if (isOnline && !paymentReference) {
      showToast("Debes ingresar el número de referencia del pago para validar tu orden.", "error");
      return;
    }
    if (paymentMethod === "vale_credit") {
      if (!customerPhone) {
        showToast("Debes ingresar el Código del Vale (Ej. VALE-1234) o Teléfono del Cliente para validar el crédito.", "error");
        return;
      }
      const activeVale: any = db.vales?.find((v: any) => (v.recipientName === customerPhone || v.id === customerPhone) && v.status === "pending");
      if (!activeVale) {
        showToast(`No se encontró ningún Vale de Crédito PENDIENTE asociado a: "${customerPhone}".`, "error");
        return;
      }
      if (activeVale.totalDueUSD < total) {
        showToast(`El saldo del Vale (${formatUSD(activeVale.totalDueUSD)}) es insuficiente para cubrir la compra de ${formatUSD(total)}.`, "error");
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
            }, 2000);
          };
          ndef.onerror = (err: any) => {
            showToast("Error de lectura NFC. Acerque la tarjeta nuevamente.", "error");
            setIsProcessingPos(false);
          };
        } catch (error) {
          showToast("Error iniciando NFC: " + error, "error");
          setIsProcessingPos(false);
        }
      } else {
        showToast("El pago por contacto (NFC) no está soportado en este dispositivo o navegador (requiere Chrome en Android con HTTPS).", "error");
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
        }, 2000);
      }, 3600);
      return;
    }

    // Unified loading transition for standard checkouts
    setIsProcessingPos(true);
    setPosStep(1);
    setTimeout(() => {
      setPosStep(4); // Trigger success checkmark
      setTimeout(() => {
        onConfirm(paymentMethod, applyIva, paymentReference, customerPhone, customerName, customerRif, paymentScreenshot, kPointsToBurn);
      }, 2000);
    }, 1500);
  };

  if (isProcessingPos) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in font-sans">
        <div className="bg-white/95 backdrop-blur-xl text-sky-950 rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-sky-100 relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-indigo-400 to-violet-600 animate-pulse"></div>
          
          <div className="flex justify-center">
            {posStep === 4 ? (
              <div className="flex justify-center my-2">
                <motion.svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  initial="hidden"
                  animate="visible"
                  className="text-emerald-500"
                >
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: { pathLength: 1, transition: { duration: 0.8 } }
                    }}
                  />
                  <motion.path
                    d="M32 50 L45 63 L68 36"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="transparent"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: { pathLength: 1, transition: { delay: 0.4, duration: 0.4 } }
                    }}
                  />
                </motion.svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center animate-spin border-4 border-violet-100 border-t-violet-600">
                {paymentMethod === "nfc_web" ? <CreditCard size={32} className="text-violet-600 animate-pulse" /> : <QrCode size={32} className="text-violet-600 animate-pulse" />}
              </div>
            )}
          </div>

          <h3 className="text-xl font-black uppercase tracking-widest text-violet-900">
            {posStep === 4 ? "¡Procesado!" : paymentMethod === "nfc_web" ? "Acerca tu Tarjeta (NFC)" : paymentMethod === "pos_integrated" ? "Enlace Pinpad POS" : "Procesando Pago"}
          </h3>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left font-mono text-[10px] text-slate-600 space-y-2 leading-relaxed shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
            {paymentMethod === "pos_integrated" ? (
              <>
                <p className={`${posStep >= 1 ? "text-emerald-600 font-bold" : "opacity-35"}`}>
                  &gt; [IoT Edge] Abriendo socket local con puerto POS...
                </p>
                <p className={`${posStep >= 2 ? "text-emerald-600 font-bold" : "opacity-35"}`}>
                  &gt; [COM-RS232] Transmitiendo cobro SPDH por {formatUSD(total)} (Bs. {totalBs.toFixed(2)})
                </p>
              </>
            ) : paymentMethod === "nfc_web" ? (
              <>
                <p className={`${posStep >= 3 ? "text-amber-600 font-bold animate-pulse" : "opacity-35"}`}>
                  &gt; [WebNFC] Escaneando frecuencia 13.56 MHz (Contactless)...
                </p>
              </>
            ) : (
              <>
                <p className="text-emerald-600 font-bold">&gt; {getLoadingMessage(paymentMethod)}</p>
              </>
            )}
            {posStep >= 4 && (
              <p className="text-emerald-600 font-black animate-bounce pt-1">
                &gt; [Ledger] ¡Transacción aprobada y firmada! Código: {paymentMethod === "nfc_web" ? "NFC-" : paymentMethod === "pos_integrated" ? "POS-" : "TX-"}{Math.floor(100000 + Math.random() * 900000)}
              </p>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {posStep === 4 ? "Sincronizando ledger..." : "No desconecte el terminal. Enlace criptográfico activo."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in font-sans">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/95 backdrop-blur-2xl rounded-[2rem] w-full max-w-md p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
      >
        <h3 className="text-2xl font-black mb-2 text-[#0A1128]">{isOnline ? "Comprar Online" : "Caja Registradora"}</h3>
        <p className="text-sm text-gray-500 mb-6">{product.name}</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Método de Pago</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184] cursor-pointer">
              <option value="cash_bs">Pago Móvil / Transferencia (Bs)</option>
              <option value="zinli">Zinli</option>
              <option value="wally_tech">Wally Tech</option>
              <option value="airtm">AirTM</option>
              <option value="ubbi_app">Ubbi App</option>
              <option value="binance">Binance Pay</option>
              {!isOnline && (
                <>
                  <option value="pos_integrated">⚡ Tarjeta (POS Integrado {KFS_BRAND.productAcronym})</option>
                  <option value="nfc_web">💳 Tarjeta (NFC Contactless)</option>
                  <option value="cash_usd">Efectivo (USD)</option>
                  <option value="cash_eur">Efectivo (EUR)</option>
                  <option value="vale_credit">🎫 Vale / Crédito de {KFS_BRAND.modules.marketplace}</option>
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
                    <p className="text-sm font-mono text-gray-800">Email Zinli: <strong>{resolvedStoreOwner?.paymentMethods?.zinli || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "wally_tech" && (
                    <p className="text-sm font-mono text-gray-800">Wally Tech: <strong>{resolvedStoreOwner?.paymentMethods?.wallyTech || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "airtm" && (
                    <p className="text-sm font-mono text-gray-800">AirTM: <strong>{resolvedStoreOwner?.paymentMethods?.airtm || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "ubbi_app" && (
                    <p className="text-sm font-mono text-gray-800">Ubbi App: <strong>{resolvedStoreOwner?.paymentMethods?.ubbiApp || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "binance" && (
                    <p className="text-sm font-mono text-gray-800">Binance Pay ID: <strong>{resolvedStoreOwner?.paymentMethods?.binance || "No configurado (Pregunte al vendedor)"}</strong></p>
                  )}
                  {paymentMethod === "cash_bs" && (
                    <div className="text-sm font-mono text-gray-800 space-y-1">
                      <p>Banco: <strong>{resolvedStoreOwner?.paymentMethods?.pagoMovilBank || "No configurado"}</strong></p>
                      <p>Teléfono: <strong>{resolvedStoreOwner?.paymentMethods?.pagoMovilPhone || "No configurado"}</strong></p>
                      <p>Cédula/RIF: <strong>{resolvedStoreOwner?.paymentMethods?.pagoMovilId || "No configurado"}</strong></p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Número de Referencia Bancaria</label>
                <input type="text" placeholder="Ej: 034199..." value={paymentReference} onChange={e => setPaymentReference(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
                <p className="text-[10px] text-gray-400 mt-1">Obligatorio. Nuestro {KFS_BRAND.productAcronym} SMS Conciliator leerá esto para aprobar tu envío.</p>
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
                          const base64 = await compressImage(file, 400, 0.6);
                          setPaymentScreenshot(base64);
                        } catch (err) {
                          showToast("Error al comprimir/cargar la imagen", "error");
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                {isOnline ? "Tu Teléfono de Contacto" : "Teléfono del Cliente (WhatsApp)"}
              </label>
              {customerPhone && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${validatePhone(customerPhone, "+58") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {validatePhone(customerPhone, "+58") ? "✓ Teléfono Válido" : "✗ Formato Inválido"}
                </span>
              )}
            </div>
            <input type="text" placeholder="Ej: 04141234567" value={customerPhone} onChange={e => { setCustomerPhone(e.target.value); setKPointsToBurn(0); }} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A184]" />
            <p className="text-[10px] text-gray-400 mt-1">Opcional. {isOnline ? "Para que el comercio te contacte." : "Para enviar el recibo electrónico por WhatsApp."}</p>
          </div>

          {availableKPoints > 0 && product.allowKPoints !== false && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2 animate-fade-in">
              <label className="text-[10px] font-black text-purple-900 uppercase tracking-widest flex justify-between">
                <span>Quemar {KFS_BRAND.economy.currency} Disponibles</span>
                <span>Max: {availableKPoints}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max={Math.min(availableKPoints, (price + iva + igtf) / 0.001)} 
                step="10" 
                value={kPointsToBurn} 
                onChange={(e) => setKPointsToBurn(parseInt(e.target.value) || 0)}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-xs font-bold text-purple-800">
                <span>{kPointsToBurn} {KFS_BRAND.economy.currency}</span>
                <span>Descuento: -${discountUSD.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={applyIva} onChange={e => setApplyIva(e.target.checked)} className="w-5 h-5 text-[#C5A184] rounded focus:ring-[#C5A184]" />
            <span className="font-bold text-[#0A1128]">Generar Factura Fiscal (IVA 16%)</span>
          </label>

          {applyIva && (
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-amber-900 uppercase tracking-widest block flex items-center gap-1.5">
                  <Shield size={12} className="text-amber-600" />
                  Datos Fiscales Obligatorios (SENIAT)
                </label>
                {customerRif && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${validateRif(customerRif) ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {validateRif(customerRif) ? "✓ Formato RIF Válido" : "✗ Formato: V-12345678-9"}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">RIF / Cédula</label>
                <input required type="text" placeholder="Ej: V-12345678-9" value={customerRif} onChange={e => handleRifChange(e.target.value)} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm font-bold text-gray-600"><span>Subtotal:</span> <span>{formatUSD(price)}</span></div>
            {applyIva && <div className="flex justify-between text-sm font-bold text-gray-600"><span>IVA (16%):</span> <span className="text-red-500">+{formatUSD(iva)}</span></div>}
            {isForeign && <div className="flex justify-between text-sm font-bold text-gray-600"><span>IGTF (3%):</span> <span className="text-red-500">+{formatUSD(igtf)}</span></div>}
            {kPointsToBurn > 0 && <div className="flex justify-between text-sm font-bold text-purple-600"><span>Descuento {KFS_BRAND.economy.currency}:</span> <span>-{formatUSD(discountUSD)}</span></div>}
            <div className="flex justify-between text-lg font-black text-[#0A1128] pt-2 border-t border-gray-200 mt-2"><span>Total a Pagar:</span> <span>{formatUSD(total)}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="button" onClick={onCancel} className="w-full sm:w-1/3 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer">Cancelar</button>
            <button 
              disabled={(paymentMethod === 'split_currency' && ((parseFloat(splitAmount1) || 0) <= 0 || (parseFloat(splitAmount1) || 0) > total)) || (applyIva && !validateRif(customerRif))}
              onClick={handleConfirm} 
              className="w-full sm:w-2/3 py-3 rounded-xl font-black text-[#0A1128] bg-[#C5A184] shadow-lg hover:shadow-[0_0_20px_rgba(197,161,132,0.6)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isOnline ? "Enviar Pago a Revisión" : applyIva ? "Emitir Factura Fiscal" : "Cobrar Cliente"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
