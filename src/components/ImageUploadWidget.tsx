import React, { useRef, useState } from "react";
import { UploadCloud, CheckCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { compressImage } from "../lib/utils";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Comprimir la imagen para que no pese más de lo necesario
      const compressedBase64 = await compressImage(file, 800, 0.7);
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
          preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[violet-500]/30 hover:border-[violet-500]/80 bg-white/5 hover:bg-white/10'
        }`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-[violet-500] mb-2" size={24} />
        ) : preview ? (
          <div className="relative w-full aspect-video md:aspect-square max-h-32 rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold flex items-center gap-1"><UploadCloud size={14} /> Cambiar</p>
            </div>
            <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
              <CheckCircle size={12} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[violet-500]/20 text-[violet-500] flex items-center justify-center mb-2">
              <ImageIcon size={20} />
            </div>
            <p className="text-xs font-bold text-center text-gray-300">{label}</p>
            <p className="text-[9px] text-gray-500 mt-1">Soporta JPG, PNG (Max 5MB)</p>
          </>
        )}
      </div>
    </div>
  );
}
