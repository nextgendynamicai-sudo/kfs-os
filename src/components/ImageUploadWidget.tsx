import React, { useRef, useState } from "react";
import { UploadCloud, CheckCircle, Image as ImageIcon, Loader2, Maximize2, X } from "lucide-react";
import { compressImage } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadWidgetProps {
  label?: string;
  onImageSelected: (base64: string) => void;
  currentImage?: string;
  className?: string;
}

export function ImageUploadWidget({ label = "Subir Imagen", onImageSelected, currentImage, className = "" }: ImageUploadWidgetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, etc.).");
      return;
    }

    // Validar tamaño de archivo (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("La imagen excede el límite de tamaño de 5MB.");
      return;
    }

    setIsLoading(true);
    try {
      // Comprimir la imagen para que no pese más de lo necesario
      const compressedBase64 = await compressImage(file, 600, 0.5);
      setPreview(compressedBase64);
      onImageSelected(compressedBase64);
    } catch (error) {
      console.error("Error al procesar imagen", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
          preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-violet-500/30 hover:border-violet-500/80 bg-white/5 hover:bg-white/10'
        }`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-violet-500 mb-2" size={24} />
        ) : preview ? (
          <div className="relative w-full aspect-video md:aspect-square max-h-32 rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold p-2 rounded-xl text-[10px] flex items-center gap-1 transition-all cursor-pointer"
              >
                <UploadCloud size={12} /> Cambiar
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold p-2 rounded-xl text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                title="Ampliar Imagen"
              >
                <Maximize2 size={12} /> Ampliar
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
              <CheckCircle size={12} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center mb-2">
              <ImageIcon size={20} />
            </div>
            <p className="text-xs font-bold text-center text-gray-300">{label}</p>
            <p className="text-[9px] text-gray-500 mt-1">Soporta JPG, PNG (Max 5MB)</p>
          </>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomed && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-[85vh] rounded-2xl overflow-hidden bg-white/5 p-2 border border-white/10 shadow-2xl flex items-center justify-center"
            >
              <img 
                src={preview} 
                alt="Vista Ampliada" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl select-none"
              />
            </motion.div>
            
            <p className="text-white/60 text-xs font-mono mt-4 font-bold select-none">Toca en cualquier parte para cerrar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
