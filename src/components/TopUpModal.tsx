import React, { useState } from 'react';
import { X, Upload, DollarSign, CreditCard, Camera } from 'lucide-react';
import { compressImage } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useKFS } from '../context/KFSContext';

export const TopUpModal = ({ isOpen, onClose, amount: initialAmount, onSubmit, userType }: any) => {
  const { showToast } = useKFS() as any;
  const [screenshot, setScreenshot] = useState("");
  const [reference, setReference] = useState("");
  const [localAmount, setLocalAmount] = useState(initialAmount || "");

  // Update localAmount when modal opens with a pre-filled amount
  React.useEffect(() => {
    if (isOpen) {
      setLocalAmount(initialAmount || "");
    }
  }, [isOpen, initialAmount]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await compressImage(file, 800, 0.7);
        setScreenshot(base64String as string);
      } catch (error) {
        console.error("Error al comprimir la imagen:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localAmount || parseFloat(localAmount) <= 0) return showToast("Ingresa un monto válido", "error");
    if (!reference) return showToast("Ingresa el número de referencia", "error");
    if (!screenshot) return showToast("Sube el comprobante de pago", "error");

    onSubmit(parseFloat(localAmount), reference, screenshot);
    setLocalAmount("");
    setReference("");
    setScreenshot("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0A1128] text-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
            <h2 className="font-black text-xl flex items-center gap-2"><DollarSign className="text-green-400" /> Recargar Saldo</h2>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-[#C5A184] mb-3 flex items-center gap-2"><CreditCard size={18}/> Datos para Transferencia</h3>
              <p className="text-xs text-gray-300 leading-relaxed">Transfiere el monto deseado a la siguiente cuenta. Luego, adjunta el comprobante para validar tu saldo.</p>
              
              <div className="mt-4 space-y-2 text-sm font-mono bg-black/50 p-4 rounded-xl border border-white/10">
                <p><span className="text-gray-500">Banco:</span> Banco Nacional de Crédito (BNC)</p>
                <p><span className="text-gray-500">Cuenta:</span> 0104-XXXX-XXXX-XXXX-XXXX</p>
                <p><span className="text-gray-500">Titular:</span> Javier Castillo (KFS OS)</p>
                <p><span className="text-gray-500">RIF/CI:</span> V-25.218.648</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Monto a Recargar (USD)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" step="any" min="1" required value={localAmount} onChange={(e) => setLocalAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-black text-lg focus:outline-none focus:border-[#C5A184] transition-colors" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Referencia Bancaria</label>
                <input type="text" required value={reference} onChange={(e) => setReference(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A184] transition-colors" placeholder="Ej: 12345678" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Captura del Comprobante</label>
                {screenshot ? (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video">
                    <img src={screenshot} alt="Comprobante" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => setScreenshot("")} className="bg-red-500 hover:bg-red-600 text-white text-xs font-black py-2 px-4 rounded-lg cursor-pointer">Borrar Imagen</button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/20 hover:border-[#C5A184] rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition-colors bg-white/5">
                    <Camera size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm font-bold text-gray-300">Subir Captura</span>
                    <span className="text-[10px] text-gray-500 mt-1">PNG, JPG (Máx. 5MB)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <button type="submit" className="w-full py-4 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black rounded-xl transition-all shadow-lg shadow-green-500/20 text-lg flex items-center justify-center gap-2 mt-4 cursor-pointer">
                <Upload size={20} /> Enviar Validación
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
