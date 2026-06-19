import React, { useState } from "react";
import { Store, ShieldCheck, CreditCard, ArrowRight, Download, Printer, CheckCircle } from "lucide-react";
import { useKFS } from "../context/KFSContext";

interface B2BSelfOnboardingProps {
  setView: (view: string) => void;
}

export function B2BSelfOnboarding({ setView }: B2BSelfOnboardingProps) {
  const { registerClient, db, showToast } = useKFS() as any;

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    password: "",
    phone: "",
    rif: "",
    address: ""
  });
  const [promoterId, setPromoterId] = useState<string>("core-self");
  const [agreedToContract, setAgreedToContract] = useState<boolean>(false);
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("binance");
  const [newMerchantId, setNewMerchantId] = useState<string>("");

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.company || !formData.email || !formData.password || !formData.phone || !formData.rif) {
        showToast("Por favor completa todos los campos de registro.", "error");
        return;
      }
      setStep(2);
    }
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      showToast("Debes aceptar el contrato de regalías del 5% para continuar.", "error");
      return;
    }
    if (!paymentRef) {
      showToast("Por favor ingresa la referencia de pago de $75 USD.", "error");
      return;
    }

    const merchantId = `c${Date.now()}`;
    const clientData = {
      ...formData,
      id: merchantId,
      kfsTier: "matrix", // 5% tier
      is_founder: false,
      fee_tier: "5%",
      onboardedAt: new Date().toISOString()
    };

    // Register merchant in DB using KFSContext handler
    registerClient(clientData, promoterId || "core-self", 0.05);

    setNewMerchantId(merchantId);
    setStep(3);
    showToast("¡Onboarding completado con éxito! Comercio registrado.", "success");
  };

  return (
    <div className="min-h-screen bg-white text-white font-sans flex flex-col justify-between selection:bg-[#C5A184] selection:text-[#0A1128]">
      {/* Header navbar */}
      <nav className="border-b border-white/5 py-4 px-6 sm:px-10 flex justify-between items-center bg-white/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Store className="text-[#C5A184] h-6 w-auto" />
          <span className="font-black tracking-tight text-lg">KFS B2B Portal</span>
        </div>
        <button
          onClick={() => setView("landing")}
          className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Volver al Inicio
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 px-6">
          {[
            { label: "Registro", num: 1 },
            { label: "Acuerdo & Pago", num: 2 },
            { label: "Activación", num: 3 }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= s.num
                    ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs font-bold ${step >= s.num ? "text-gray-200" : "text-gray-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-100 flex items-center gap-2">
                Afiliación Comercial Nacional
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Únete a la red Kreatek Flow Systems OS en minutos. Completa los datos primarios de tu comercio.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Nombre Comercial de la Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Bodegón Chacao, C.A."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Correo Electrónico Corporativo</label>
                  <input
                    type="email"
                    placeholder="empresa@kfs.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Contraseña de Acceso</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Teléfono Móvil (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="Ej: 04121234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Registro de Información Fiscal (RIF)</label>
                  <input
                    type="text"
                    placeholder="Ej: J-12345678-9"
                    value={formData.rif}
                    onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Dirección Física de Local / Almacén</label>
                <textarea
                  rows={2}
                  placeholder="Calle, Edificio, Local, Chacao, Caracas"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">ID de Promotora Aliada (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: p1 (dejar vacío si no aplica)"
                  value={promoterId}
                  onChange={(e) => setPromoterId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-[#C5A184] text-[#0A1128] font-black py-4 rounded-xl mt-6 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Continuar al Contrato <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Contract and Setup payment */}
        {step === 2 && (
          <form
            onSubmit={handleOnboardSubmit}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-100 flex items-center gap-2">
                Acuerdo Comercial & Setup Fee
              </h2>
              <p className="text-xs text-gray-400">
                Acepta las comisiones de regalías y realiza el pago único de instalación técnica.
              </p>
            </div>

            {/* Contract terms card */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black text-[#C5A184] flex items-center gap-1.5">
                <ShieldCheck size={16} /> Términos del Peaje Gamificado
              </h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A184] font-black">•</span>
                  <span><strong>Regalía Base:</strong> KFS OS cobra una comisión estándar del 5% sobre la facturación procesada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A184] font-black">•</span>
                  <span><strong>Reducción de Comisión:</strong> Si el comercio afilia clientes directamente desde el mostrador (descarga y recarga de $5), la regalía bajará permanentemente al <strong>3%</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A184] font-black">•</span>
                  <span><strong>Setup Inicial:</strong> Cobro único de <strong>$75.00 USD</strong> por inicialización del software, proxy fiscal virtual, y generación de QR de comercio.</span>
                </li>
              </ul>

              <label className="flex items-center gap-3 pt-3 border-t border-white/5 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToContract}
                  onChange={(e) => setAgreedToContract(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-[#C5A184] focus:ring-0 cursor-pointer h-4 w-4"
                />
                <span className="text-xs text-gray-200 font-bold select-none">
                  Acepto el contrato de regalías base (5%) y setup.
                </span>
              </label>
            </div>

            {/* Setup Fee Payment */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-gray-200 flex items-center gap-1.5">
                <CreditCard size={16} /> Pago de Setup Fee ($75.00 USD)
              </h3>
              <p className="text-[10px] text-gray-400">
                Realiza la recarga/transferencia a una de nuestras cuentas oficiales y proporciona la referencia de validación.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {["binance", "zinli", "pago_movil"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === m
                        ? "bg-[#C5A184]/15 border-[#C5A184] text-white"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {m === "binance" ? "Binance Pay" : m === "zinli" ? "Zinli" : "Pago Móvil"}
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-white/5 p-3 rounded-xl text-[10px] text-gray-400 leading-relaxed font-mono">
                {paymentMethod === "binance" && "Binance Pay ID: 252186489 (Holding Kreatek OS)"}
                {paymentMethod === "zinli" && "Zinli: corporativo@kreatek.com"}
                {paymentMethod === "pago_movil" && "Pago Móvil: Banesco (0102), Teléfono: 0412-2521864, RIF: J-25218648-9"}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Referencia del Pago</label>
                <input
                  type="text"
                  placeholder="Ingresa los últimos 6 u 8 dígitos"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A184] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-white/10 hover:border-white/20 text-white font-bold py-4 rounded-xl cursor-pointer transition-colors"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="w-2/3 bg-[#C5A184] text-[#0A1128] font-black py-4 rounded-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                Pagar y Activar Comercio
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success & Download QR Code Card */}
        {step === 3 && (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/10 rounded-full border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
              <CheckCircle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-100">¡Comercio Activado Exitosamente!</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Tu pago ha sido validado y tu terminal de KFS OS está listo para operar bajo la licencia base del 5%.
              </p>
            </div>

            {/* Virtual QR Code Card */}
            <div className="bg-white border border-[#C5A184]/30 rounded-3xl p-6 max-w-sm mx-auto space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A184]/5 rounded-full blur-xl -z-1"></div>
              
              <div className="flex justify-between items-center text-left border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-black tracking-tight text-white truncate max-w-[150px]">
                    {formData.company}
                  </h4>
                  <p className="text-[8px] text-gray-400 font-mono">RIF: {formData.rif}</p>
                </div>
                <span className="bg-[#C5A184]/10 border border-[#C5A184]/35 text-[#C5A184] text-[8px] font-mono px-2 py-0.5 rounded">
                  ID: {newMerchantId}
                </span>
              </div>

              {/* QR Representation */}
              <div className="bg-white p-3 rounded-2xl w-40 h-40 mx-auto flex flex-col justify-between relative shadow-lg">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-black rounded"></div>
                  <div className="w-8 h-8 border-4 border-black rounded"></div>
                </div>
                {/* Simulated QR block layout */}
                <div className="flex flex-col gap-1 w-full px-2">
                  <div className="h-1 bg-black w-full"></div>
                  <div className="h-1 bg-black w-3/4 self-center"></div>
                  <div className="h-1 bg-black w-5/6"></div>
                  <div className="h-1 bg-black w-2/3 self-end"></div>
                  <div className="h-1 bg-black w-11/12"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-black rounded"></div>
                  <div className="w-8 h-8 border-4 border-black flex items-center justify-center rounded">
                    <div className="w-3 h-3 bg-black"></div>
                  </div>
                </div>
                {/* Logo in center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md border border-gray-200">
                  <Store size={14} className="text-[#0A1128]" />
                </div>
              </div>

              <p className="text-[9px] text-gray-400 leading-normal text-center">
                Código QR autogenerado para acceso rápido de clientes a tu tienda digital y escaneo de mostrador.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => showToast("Imprimiendo código QR...", "success")}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Printer size={12} /> Imprimir QR
                </button>
                <button
                  onClick={() => showToast("Guardando imagen de QR...", "success")}
                  className="flex-1 bg-[#C5A184]/15 hover:bg-[#C5A184]/25 text-[#C5A184] text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download size={12} /> Descargar QR
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
              <button
                onClick={() => setView("login")}
                className="w-full bg-[#C5A184] text-[#0A1128] font-black text-sm py-4 rounded-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
              >
                Ir a Terminal de Venta / POS
              </button>
              <button
                onClick={() => setView("landing")}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Volver al Portal de Inicio
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-[10px] text-gray-500">
        KFS OS Overdrive. Todos los derechos reservados. B2B self-onboarding automatizado.
      </footer>
    </div>
  );
}
