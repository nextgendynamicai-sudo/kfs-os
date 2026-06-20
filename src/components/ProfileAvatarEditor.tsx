import { KFS_BRAND } from "../config/brandConfig";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Loader2 } from "lucide-react";
import { useKFS } from "../context/KFSContext";
import { ImageUploadWidget } from "./ImageUploadWidget";

interface ProfileAvatarEditorProps {
  currentUser: any;
}

export function ProfileAvatarEditor({ currentUser }: ProfileAvatarEditorProps) {
  const { updateUserAvatar, showToast } = useKFS() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intentamos obtener el avatar de diferentes fuentes dependiendo del rol
  const currentAvatar = currentUser?.avatar || currentUser?.profilePicUrl || "https://cdn-icons-png.flaticon.com/512/3063/3063822.png";
  
  const handleSaveAvatar = async (base64: string) => {
    setIsUploading(true);
    try {
      await updateUserAvatar(currentUser.id, currentUser.role || currentUser.type, base64);
      showToast("Foto de perfil actualizada exitosamente", "success");
      setIsEditing(false);
    } catch (error) {
      showToast("Error al actualizar la foto de perfil", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg relative bg-[#141E3A]">
        {isUploading ? (
          <div className="absolute inset-0 bg-sky-950/60 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-sky-950 mb-1" size={24} />
            <span className="text-[8px] text-sky-950 font-bold uppercase tracking-widest">Subiendo</span>
          </div>
        ) : (
          <>
            <img 
              src={currentAvatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"; }}
            />
            <div 
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-sky-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
            >
              <Camera className="text-sky-950 mb-1" size={24} />
              <span className="text-[10px] text-sky-950 font-bold uppercase tracking-widest text-center px-2">Editar Foto</span>
            </div>
          </>
        )}
      </div>

      {isEditing && mounted && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" style={{ zIndex: 999999 }}>
          <div className="bg-white border border-sky-100 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-sky-950"
            >
              ✕
            </button>
            <h3 className="text-lg font-black text-sky-950 mb-2 flex items-center gap-2">
              <Camera className="text-violet-400" /> Actualizar Perfil
            </h3>
            <p className="text-xs text-slate-500 mb-6">Esta imagen será visible públicamente en tus comercios y/o enlaces {KFS_BRAND.productAcronym}.</p>
            
            <ImageUploadWidget 
              label="Selecciona una nueva foto" 
              currentImage={currentAvatar}
              onImageSelected={handleSaveAvatar} 
            />
            
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-sky-50 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
