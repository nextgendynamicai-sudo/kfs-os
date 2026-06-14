import React, { useState } from "react";
import { Send, Link as LinkIcon, Image as ImageIcon, Users } from "lucide-react";

export function PushCommandCenter({ currentUser }: any) {
  const [roles, setRoles] = useState<Record<string, boolean>>({
    todos: false,
    clientes: false,
    dueños: false,
    promotoras: false,
    vendedores: false,
    riders: false
  });
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [destinationType, setDestinationType] = useState("app"); // app, external, local, product
  const [destinationValue, setDestinationValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleRoleChange = (role: string) => {
    if (role === 'todos') {
      const newVal = !roles.todos;
      setRoles({
        todos: newVal,
        clientes: newVal,
        dueños: newVal,
        promotoras: newVal,
        vendedores: newVal,
        riders: newVal
      });
    } else {
      setRoles(prev => ({ ...prev, [role]: !prev[role], todos: false }));
    }
  };

  const handleSend = async () => {
    if (!title || !message) {
      alert("Título y Mensaje son obligatorios.");
      return;
    }

    const selectedRoles = Object.entries(roles).filter(([k, v]) => v && k !== 'todos').map(([k]) => k);
    if (selectedRoles.length === 0) {
      alert("Selecciona al menos una audiencia.");
      return;
    }

    setIsSending(true);
    try {
      const { supabase } = await import("../context/supabase");
      const { data, error } = await supabase.functions.invoke('push-notify', {
        body: {
          title,
          body: message,
          image: imageUrl,
          roles: selectedRoles,
          destinationType,
          destinationValue
        }
      });

      if (error) throw new Error("Error enviando push: " + error.message);
      
      alert("Notificaciones enviadas exitosamente!");
      setTitle("");
      setMessage("");
      setImageUrl("");
      setDestinationValue("");
    } catch (error) {
      console.error(error);
      alert("Error al enviar la notificación. Revisa la consola.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-3 bg-violet-100 rounded-xl">
          <Send size={24} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-violet-900">Broadcast Center</h2>
          <p className="text-sm text-gray-500">Centro de comando para Notificaciones Push</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Audience */}
        <div>
          <label className="text-xs font-bold text-violet-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users size={16} /> 1. Audiencia (Roles)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(roles).map((role) => (
              <label key={role} className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-violet-200 transition-colors">
                <input 
                  type="checkbox" 
                  checked={roles[role]} 
                  onChange={() => handleRoleChange(role)}
                  className="accent-violet-600 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700 capitalize">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-violet-900 uppercase tracking-wider block mb-2">2. Título de Notificación</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. ¡Oferta Relámpago!"
                className="w-full bg-white px-4 py-3 rounded-xl border-none shadow-inner focus:ring-2 focus:ring-violet-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-violet-900 uppercase tracking-wider block mb-2">3. Mensaje Principal</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe el cuerpo del mensaje..."
                rows={3}
                className="w-full bg-white px-4 py-3 rounded-xl border-none shadow-inner focus:ring-2 focus:ring-violet-400 outline-none text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-violet-900 uppercase tracking-wider block mb-2 flex items-center gap-2">
                <ImageIcon size={14} /> 4. URL de Imagen (Opcional)
              </label>
              <input 
                type="url" 
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full bg-white px-4 py-3 rounded-xl border-none shadow-inner focus:ring-2 focus:ring-violet-400 outline-none text-sm"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[#EEF2F5] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] rounded-2xl p-6 flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Preview en Dispositivo</span>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 border border-gray-100 flex flex-col">
              {imageUrl ? (
                <div className="h-32 bg-gray-100 w-full">
                  <img src={imageUrl} alt="Push preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/kfs-logo.png")} />
                </div>
              ) : (
                <div className="h-32 bg-gray-100 w-full flex items-center justify-center border-b border-gray-100">
                  <ImageIcon size={32} className="text-gray-300" />
                </div>
              )}
              <div className="p-4 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">{title || "Título"}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{message || "El mensaje aparecerá aquí..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Linking */}
        <div className="bg-white/50 p-6 rounded-2xl border border-gray-200">
          <label className="text-xs font-bold text-violet-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LinkIcon size={16} /> 5. Destino (Deep Linking) al Tocar
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              value={destinationType} 
              onChange={e => setDestinationType(e.target.value)}
              className="bg-white px-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-violet-400 outline-none text-sm w-full md:w-1/3 font-bold text-gray-700"
            >
              <option value="app">App Principal</option>
              <option value="external">URL Externa</option>
              <option value="local">Local / Tienda Específica</option>
              <option value="product">Producto Específico</option>
            </select>
            
            {destinationType !== 'app' && (
              <input 
                type="text" 
                value={destinationValue}
                onChange={e => setDestinationValue(e.target.value)}
                placeholder={destinationType === 'external' ? 'https://...' : destinationType === 'local' ? 'ID del Local' : 'ID del Producto'}
                className="w-full md:w-2/3 bg-white px-4 py-3 rounded-xl border-none shadow-inner focus:ring-2 focus:ring-violet-400 outline-none text-sm"
              />
            )}
          </div>
        </div>

        <button 
          onClick={handleSend}
          disabled={isSending}
          className="w-full bg-violet-600 text-white font-black py-4 rounded-xl shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={20} /> {isSending ? "Enviando Broadcast..." : "Lanzar Push Notification"}
        </button>
      </div>
    </div>
  );
}
