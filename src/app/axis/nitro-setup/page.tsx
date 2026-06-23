'use client';
import React, { useState, useEffect } from 'react';
import { useKFS } from '../../../context/KFSContext';
import { supabase } from '../../../context/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Link2, CheckCircle, AlertCircle, ArrowRight, Lock, Sparkles } from 'lucide-react';

export default function NitroHubSetup() {
  const { currentUser, db, showToast } = useKFS() as any;
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [status, setStatus] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter clients based on user role to allow Promotoras or Core Admins to deploy for specific merchants
  const myClients = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'promotora') {
      return db.clients.filter((c: any) => c.promotoraId === currentUser.id);
    }
    if (currentUser.role === 'core') {
      return db.clients;
    }
    return [];
  }, [currentUser, db.clients]);

  // Pre-populate if logged in as a Client (dueño)
  useEffect(() => {
    if (currentUser && currentUser.role === 'dueño') {
      setStoreName(currentUser.company || '');
      const suggestedSlug = (currentUser.company || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(suggestedSlug);
    }
  }, [currentUser]);

  // Pre-populate when a client is selected by a promoter/admin
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = db.clients.find((c: any) => c.id === clientId);
    if (client) {
      setStoreName(client.company || '');
      const suggestedSlug = (client.company || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(suggestedSlug);
    } else {
      setStoreName('');
      setSlug('');
    }
  };

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !slug.trim()) {
      showToast("Por favor ingresa un nombre y enlace válido.", "error");
      return;
    }

    setLoading(true);
    setStatus('Desplegando Nodo Comercial...');
    setErrorStatus('');

    // Determine owner_id based on who the hub belongs to
    let ownerId = null;
    if (currentUser?.role === 'dueño') {
      // Direct owner
      ownerId = currentUser.auth_user_id || null;
    } else if (selectedClientId) {
      // Promoter/Admin selected a client
      const selectedClient = db.clients.find((c: any) => c.id === selectedClientId);
      ownerId = selectedClient?.auth_user_id || null;
    }

    // Try to fallback to current Supabase Auth session if we don't have it locally
    if (!ownerId) {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.user.id)) {
          ownerId = data.user.id;
        }
      } catch (err) {
        console.warn("No active Supabase session.");
      }
    }

    try {
      // Check if slug is unique beforehand to show a nice error
      const { data: existing } = await supabase
        .from('axis_nitro_hubs')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        setErrorStatus('El enlace de tienda (slug) ya está siendo utilizado por otro comercio. Por favor, elige uno diferente.');
        setStatus('');
        setLoading(false);
        showToast("Enlace duplicado", "error");
        return;
      }

      const { error } = await supabase.from('axis_nitro_hubs').insert([{
        owner_id: ownerId,
        store_name: storeName,
        slug: slug
      }]);

      if (error) {
        setErrorStatus(`Error al crear en Supabase: ${error.message}`);
        setStatus('');
        setLoading(false);
        showToast("Error de creación", "error");
        return;
      }
      
      setStatus('¡Axis Nitro Hub Activado! Ya puedes subir productos.');
      showToast("Hub creado con éxito", "success");
    } catch (err: any) {
      setErrorStatus(`Error: ${err.message}`);
      setStatus('');
    }
    setLoading(false);
  };

  const isFormDisabled = loading || (currentUser?.role !== 'dueño' && !selectedClientId && myClients.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 selection:bg-violet-600 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/85 p-8 rounded-[2.5rem] shadow-2xl relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-800/40 text-[10px] font-black uppercase tracking-widest text-violet-400">
            <Sparkles size={10} className="animate-pulse" /> Activación Hub
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent tracking-tight">
            Axis Nitro Hub Setup
          </h1>
          <p className="text-xs text-slate-400">
            Configura el entorno virtual y la URL transaccional de tu tienda.
          </p>
        </div>

        {/* Auth Check Warning */}
        {!currentUser && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-200">Sesión no iniciada</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Para que el Hub se enlace a tu catálogo e-commerce en Nitro Market, te recomendamos iniciar sesión como Comercio en KFS OS antes de activarlo.
              </p>
              <a href="/#login" className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 hover:underline pt-1">
                Ir a Iniciar Sesión <ArrowRight size={12} />
              </a>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateHub} className="space-y-4">
          
          {/* If Promoter or Admin, show Client Selection */}
          {currentUser && (currentUser.role === 'promotora' || currentUser.role === 'core') && myClients.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Seleccionar Comercio</label>
              <select 
                value={selectedClientId} 
                onChange={(e) => handleClientChange(e.target.value)} 
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-bold cursor-pointer"
                required
              >
                <option value="">— Seleccionar Cliente Afiliado —</option>
                {myClients.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.company || c.name} ({c.email})</option>
                ))}
              </select>
            </div>
          )}

          {/* Store Name Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre del Comercio</label>
            <div className="relative">
              <Store className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={(currentUser?.role === 'dueño') || loading}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                placeholder="Ej: Burgers V2"
                required 
              />
            </div>
          </div>

          {/* Slug Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enlace de tu Tienda (Slug)</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
              <span className="inline-flex items-center px-4 border-r border-slate-800/80 bg-slate-900 text-slate-500 text-xs font-mono select-none">
                kfs-os.vercel.app/nitro/
              </span>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'))}
                disabled={(currentUser?.role === 'dueño') || loading}
                className="flex-1 min-w-0 block px-4 py-3.5 bg-transparent text-sm text-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed font-mono text-sky-400"
                placeholder="burgers-v2"
                required 
              />
            </div>
            <p className="text-[9px] text-slate-500 ml-1">Solo letras, números y guiones. URL permanente.</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isFormDisabled}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase transition-all transform hover:scale-[1.01] active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 border-none shadow-lg shadow-violet-950/30 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>Desplegar Nodo Comercial <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        {/* Dynamic Status / Actions Block */}
        <AnimatePresence mode="wait">
          {status && (
            <motion.div 
              key="success-block"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle size={18} />
                <span>{status}</span>
              </div>
              
              {status.includes('¡Axis Nitro Hub Activado!') && (
                <div className="space-y-4 pt-3 border-t border-emerald-900/30 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[11px]">Tu tienda online está en vivo:</p>
                    <a 
                      href={`/nitro/${slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-sm font-black text-sky-400 hover:underline break-all"
                    >
                      <Link2 size={14} /> kfs-os.vercel.app/nitro/{slug}
                    </a>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5 leading-relaxed text-[11px] text-slate-400">
                    <p className="font-bold text-slate-200">¿Cómo subir inventario al catálogo?</p>
                    <p>
                      Inicia sesión con tu correo en el panel central de KFS OS. Los productos que añadas en tu sección "Inventario" se mostrarán instantáneamente en este Hub y en el Nitro Market central.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <a 
                      href="/#login" 
                      className="flex-1 text-center bg-violet-600 hover:bg-violet-500 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-colors no-underline shadow-md shadow-violet-950/20"
                    >
                      Iniciar Sesión / Registro
                    </a>
                    <a 
                      href={`/nitro/${slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors no-underline border border-slate-700"
                    >
                      Ver Tienda Online
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {errorStatus && (
            <motion.div 
              key="error-block"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/20 border border-red-800/40 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-300">Fallo en el despliegue</p>
                <p className="text-[11px] text-red-200/80 leading-relaxed">{errorStatus}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
