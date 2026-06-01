"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Upload, ShoppingCart, TrendingUp, Users, DollarSign, 
  LogOut, Shield, Package, Activity, Search, QrCode, Lock, 
  ChevronRight, CheckCircle, CreditCard, Bell, X, Info
} from "lucide-react";

// Theme and Global Constants
const KREATEK_COLORS = {
  navy: "#0A1128",
  bronze: "#C5A184",
  white: "#F8F9FA"
};

const MOCK_BCV_RATES = {
  USD: 36.45,
  EUR: 39.20
};

const initialDB = {
  promotoras: [],
  clients: [],
  vendedores: [],
  products: [],
  transactions: [],
  kreatekCore: {
    totalTransactions: 0,
    earningsEUR: 0
  }
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

// Navbar Component
const Navbar = ({ title, currentUser, logout }: { title?: string, currentUser: any, logout: () => void }) => (
  <nav className="flex justify-between items-center p-4 border-b border-white/5 bg-[#0A1128] sticky top-0 z-40 backdrop-blur-md">
    <div className="flex items-center gap-3">
      <Shield size={24} style={{ color: KREATEK_COLORS.bronze }} />
      <span className="font-bold text-lg tracking-widest uppercase text-[#C5A184]">
        Kreatek <span className="font-light text-white hidden sm:inline-block">Flow Systems OS</span>
      </span>
    </div>
    <div className="flex items-center gap-4">
      {title && <span className="text-white/80 text-xs sm:text-sm uppercase tracking-wider font-mono bg-white/5 px-3 py-1 rounded-full">{title}</span>}
      {currentUser && (
        <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer">
          <LogOut size={20} />
        </button>
      )}
    </div>
  </nav>
);

// Setup Client Form
const RegisterClientForm = ({ onRegister, onCancel, standalone = true }: any) => {
  const [formData, setFormData] = useState({ name: "", idCard: "", company: "", avgBilling: "", phone: "", email: "", password: "", address: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister(formData); }} className={`space-y-3 ${standalone ? "text-white animate-fade-in" : "text-gray-800"}`}>
      <h3 className={`text-lg font-black mb-4 border-b pb-2 ${standalone ? "text-[#C5A184] border-[#C5A184]/30" : "text-[#0A1128] border-gray-200"}`}>Setup de Nuevo Comercio</h3>
      <input required placeholder="Nombre Completo" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required placeholder="Cédula / RIF" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, idCard: e.target.value})} />
      <input required placeholder="Nombre de la Empresa" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, company: e.target.value})} />
      <textarea required placeholder="Dirección Comercial" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, address: e.target.value})} />
      <input required type="number" placeholder="Facturación Promedio Diaria ($)" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A184] transition-all ${standalone ? "bg-[#0A1128]/80 border-[#C5A184]/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} onChange={e => setFormData({...formData, avgBilling: e.target.value})} />
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
  const [formData, setFormData] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onRegister(formData); }} className="space-y-3 text-white animate-fade-in">
      <h3 className="text-lg font-black mb-4 border-b border-[#C5A184]/30 pb-2 text-[#C5A184]">Autogestión de Promotora</h3>
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

// Login View
const LoginView = ({ handleLogin, registerClient, registerPromotora, db, setView, currentUser, logout }: any) => {
  const [activeTab, setActiveTab] = useState("marketplace"); 
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141E3A] to-[#0A1128] font-sans">
      <Navbar currentUser={currentUser} logout={logout} />
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
            <button onClick={() => setActiveTab("marketplace")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "marketplace" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Market</button>
            <button onClick={() => setActiveTab("dueño")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "dueño" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Dueño</button>
            <button onClick={() => setActiveTab("vendedor")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "vendedor" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Vendedor</button>
            <button onClick={() => setActiveTab("promotora")} className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "promotora" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_15px_rgba(197,161,132,0.4)]" : "bg-white/5 text-[#C5A184] hover:bg-white/10"}`}>Promotora</button>
            <button onClick={() => setActiveTab("core")} className={`col-span-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-[#C5A184]/30 cursor-pointer ${activeTab === "core" ? "bg-[#C5A184] text-[#0A1128] shadow-[0_0_20px_rgba(197,161,132,0.5)]" : "bg-transparent text-[#C5A184] hover:bg-white/5"}`}>KFS OS (Arquitecto)</button>
          </div>

          {activeTab === "marketplace" && (
            <button onClick={() => handleLogin("marketplace", "")} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-[#0A1128] bg-[#C5A184] cursor-pointer">
              <ShoppingCart size={20} /> Entrar al Marketplace Público
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
        </div>
      </div>
    </div>
  );
};

// Core Dashboard
const CoreDashboard = ({ db, setDb, showToast, formatUSD, formatEUR, currentUser, logout }: any) => {
  const [newPromo, setNewPromo] = useState({ name: "", email: "", password: "", binanceId: "", pagoMovil: "" });
  
  const handleAddPromotora = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.name || !newPromo.email) return;
    const promoToAdd = { ...newPromo, id: `p${Date.now()}`, setups: 0, earningsEUR: 0 };
    setDb((prev: any) => ({ ...prev, promotoras: [...prev.promotoras, promoToAdd] }));
    setNewPromo({ name: "", email: "", password: "", binanceId: "", pagoMovil: "" });
    showToast("Nueva Promotora habilitada oficialmente.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar title="KFS OS (Arquitecto)" currentUser={currentUser} logout={logout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-2">Flujo de Caja Kreatek</p>
              <h2 className="text-5xl font-black mb-2">{formatEUR(db.kreatekCore?.earningsEUR || 0)}</h2>
              <p className="text-xs text-gray-400">Recaudación silenciosa: $0.04 USD por TX</p>
            </div>
            <Activity size={100} className="absolute -right-10 -bottom-10 text-white/5" />
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Nodos Activos</p>
              <h2 className="text-5xl font-black text-[#0A1128]">{db.clients?.length || 0}</h2>
            </div>
            <div className="w-16 h-16 bg-[#C5A184]/10 rounded-2xl flex items-center justify-center">
              <Users size={32} className="text-[#C5A184]" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Transacciones</p>
              <h2 className="text-5xl font-black text-[#0A1128]">{db.kreatekCore?.totalTransactions || 0}</h2>
            </div>
            <div className="w-16 h-16 bg-[#0A1128]/5 rounded-2xl flex items-center justify-center">
              <TrendingUp size={32} className="text-[#0A1128]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black mb-6 text-[#0A1128] flex items-center gap-2"><Shield className="text-[#C5A184]"/> Control y Habilitación de Promotoras</h3>
          <form onSubmit={handleAddPromotora} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               <input required type="text" placeholder="Nombre Completo" value={newPromo.name} onChange={e => setNewPromo({...newPromo, name: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-sm text-gray-900" />
               <input required type="email" placeholder="Correo Electrónico" value={newPromo.email} onChange={e => setNewPromo({...newPromo, email: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-sm text-gray-900" />
               <input required type="text" placeholder="Clave Asignada" value={newPromo.password} onChange={e => setNewPromo({...newPromo, password: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-sm text-gray-900" />
               <input required type="text" placeholder="Binance ID" value={newPromo.binanceId} onChange={e => setNewPromo({...newPromo, binanceId: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-sm text-gray-900" />
               <input required type="text" placeholder="Pago Móvil" value={newPromo.pagoMovil} onChange={e => setNewPromo({...newPromo, pagoMovil: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] text-sm text-gray-900" />
            </div>
            <button type="submit" className="w-full md:w-auto px-8 py-3 rounded-xl font-black text-white bg-[#0A1128] hover:bg-gray-800 transition-colors shadow-lg cursor-pointer">Habilitar Perfil Oficial</button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">Promotora</th>
                  <th className="py-4 px-4">Accesos</th>
                  <th className="py-4 px-4">Datos de Pago</th>
                  <th className="py-4 px-4 text-center">Setups</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Comisiones (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {db.promotoras.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0A1128]">{p.name}</td>
                    <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">{p.email}</span><span className="text-xs font-mono">P: {p.password}</span></td>
                    <td className="py-4 px-4 text-gray-500"><span className="text-xs font-mono block">BIN: {p.binanceId || "N/A"}</span><span className="text-xs font-mono block">PM: {p.pagoMovil || "N/A"}</span></td>
                    <td className="py-4 px-4 text-center font-black">{p.setups || 0}</td>
                    <td className="py-4 px-4 text-right font-black text-green-600">{formatEUR(p.earningsEUR || 0)}</td>
                  </tr>
                ))}
                {db.promotoras.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 font-bold">No hay promotoras en la red.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black mb-6 text-[#0A1128] flex items-center gap-2"><Search className="text-[#C5A184]"/> Trazabilidad de Comercios</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                <tr>
                  <th className="py-4 px-4 rounded-tl-xl">Comercio</th>
                  <th className="py-4 px-4">Dueño / RIF</th>
                  <th className="py-4 px-4">Facturación Estimada</th>
                  <th className="py-4 px-4 text-right rounded-tr-xl">Ventas Reales (USD)</th>
                </tr>
              </thead>
              <tbody>
                {db.clients.map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0A1128]">{c.company}</td>
                    <td className="py-4 px-4 text-gray-500">{c.name}<br/><span className="text-xs font-mono">{c.idCard}</span></td>
                    <td className="py-4 px-4 font-mono">${c.avgBilling}/día</td>
                    <td className="py-4 px-4 text-right font-black text-[#0A1128]">{formatUSD(c.salesUSD || 0)}</td>
                  </tr>
                ))}
                {db.clients.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-bold">No hay comercios en la red.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Promotora Dashboard
const PromotoraDashboard = ({ db, setDb, currentUser, registerClient, formatUSD, formatEUR, logout }: any) => {
  const [showRegister, setShowRegister] = useState(false);
  const myClients = db.clients.filter((c: any) => c.promotoraId === currentUser.id);
  const myPromotoraData = db.promotoras.find((p: any) => p.id === currentUser?.id) || currentUser;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <Navbar title={`Hub: ${currentUser.name}`} currentUser={currentUser} logout={logout} />
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
            <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-4">Comisiones Liquidadas</p>
            <h2 className="text-6xl font-black mb-6">{formatEUR(myPromotoraData?.earningsEUR || 0)}</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><CreditCard size={16} className="text-[#C5A184]"/> Tarifa Setup: $32.5 USD</span>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
               <CheckCircle size={40} className="text-green-500" />
             </div>
             <h3 className="text-6xl font-black text-[#0A1128] mb-3">{myPromotoraData?.setups || 0}</h3>
             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nodos Captados</p>
          </div>
        </div>

        {!showRegister ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-[#0A1128]">Mis Comercios Activados</h3>
              <button onClick={() => setShowRegister(true)} className="bg-[#0A1128] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md cursor-pointer">+ Nuevo Setup</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                  <tr>
                    <th className="py-4 px-4">Comercio</th>
                    <th className="py-4 px-4">Contacto</th>
                    <th className="py-4 px-4">Rendimiento USD</th>
                  </tr>
                </thead>
                <tbody>
                  {myClients.map((c: any) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 px-4 font-bold text-[#0A1128]">{c.company}</td>
                      <td className="py-4 px-4 text-gray-500">{c.name}<br/><span className="text-xs font-mono">{c.phone}</span></td>
                      <td className="py-4 px-4 font-black text-green-600">{formatUSD(c.salesUSD || 0)}</td>
                    </tr>
                  ))}
                  {myClients.length === 0 && <tr><td colSpan={3} className="text-center py-10 text-gray-400 font-bold">Sin comercios en cartera.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
            <RegisterClientForm onRegister={(data: any) => { registerClient(data, currentUser.id); setShowRegister(false); }} onCancel={() => setShowRegister(false)} standalone={false} />
          </div>
        )}
      </div>
    </div>
  );
};

// Client Dashboard
const ClientDashboard = ({ db, setDb, currentUser, addProduct, showToast, formatUSD, logout }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddVendedor, setShowAddVendedor] = useState(false);
  const [newVendedor, setNewVendedor] = useState({ name: "", email: "", password: "" });
  const [newProd, setNewProd] = useState({ name: "", price: "", imgUrl: "" });
  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.id);
  const myVendedores = db.vendedores.filter((v: any) => v.clientId === currentUser.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProd({ ...newProd, imgUrl: url });
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ 
      name: newProd.name, 
      priceUSD: parseFloat(newProd.price), 
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", 
      clientId: currentUser.id, 
      clientName: currentUser.company 
    });
    setShowAddModal(false);
    setNewProd({ name: "", price: "", imgUrl: "" });
  };

  const handleAddVendedor = (e: React.FormEvent) => {
     e.preventDefault();
     const added = { ...newVendedor, id: `v${Date.now()}`, clientId: currentUser.id, company: currentUser.company };
     setDb((prev: any) => ({ ...prev, vendedores: [...prev.vendedores, added] }));
     setNewVendedor({ name: "", email: "", password: "" });
     setShowAddVendedor(false);
     showToast("Vendedor autorizado y registrado.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar title={currentUser.company} currentUser={currentUser} logout={logout} />
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <div className="bg-gradient-to-br from-[#0A1128] to-[#141E3A] text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 w-full">
            <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-4">Balance de Ventas (USD)</p>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">{formatUSD(currentUser.salesUSD || 0)}</h2>
            <p className="text-sm text-gray-400 max-w-sm">Los fondos se actualizan en tiempo real mediante ventas en el Marketplace y Terminales de Vendedores.</p>
          </div>
          <DollarSign size={200} className="absolute -right-10 -bottom-20 text-white/5" />
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
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2"><Users className="text-[#C5A184]"/> Control de Empleados</h3>
            <button onClick={() => setShowAddVendedor(true)} className="text-sm font-bold text-white bg-[#0A1128] px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">+ Añadir Vendedor</button>
          </div>
          <div className="space-y-3">
            {myVendedores.map((v: any) => (
              <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-bold text-[#0A1128]">{v.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{v.email}</span>
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
             <h3 className="font-black text-xl text-[#0A1128] flex items-center gap-2"><DollarSign className="text-[#C5A184]"/> Liquidación KFS</h3>
             <span className="bg-gray-100 text-gray-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-gray-200">Datos Oficiales</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Entidad Bancaria</span>
                 <span className="font-black text-lg text-[#0A1128]">Banco Nacional de Crédito (BNC)</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Teléfono (Pago Móvil)</span>
                 <span className="font-mono font-bold text-lg text-[#0A1128]">0412-7740041</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Cédula de Identidad</span>
                 <span className="font-mono font-bold text-lg text-[#0A1128]">V-25.218.648</span>
               </div>
             </div>
             <div className="flex flex-col justify-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <p className="text-sm text-gray-500 font-bold leading-relaxed">Realice los pagos correspondientes a comisiones de ventas o mantenimientos a las cuentas maestras y notifique al sistema Core.</p>
               <button onClick={() => showToast("Notificación de pago enviada a KFS Core.", "success")} className="w-full py-4 rounded-xl font-black text-[#0A1128] bg-[#C5A184] shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer">
                 <CheckCircle size={20} /> Notificar Pago
               </button>
             </div>
           </div>
        </div>

        <div>
          <h3 className="font-black text-xl text-[#0A1128] mb-6 pl-2">Inventario en Marketplace</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myProducts.map((p: any) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="h-40 bg-gray-100 w-full overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm truncate text-[#0A1128] mb-1">{p.name}</h4>
                  <p className="text-[#C5A184] font-black">{formatUSD(p.priceUSD)}</p>
                </div>
              </div>
            ))}
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
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
              <input required type="number" step="0.01" placeholder="Precio Final (USD)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-black text-lg text-gray-900" />
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
    </div>
  );
};

// Scanner View Component (Maintains camera and simulation logic)
const ScannerView = ({ videoRef, onClose, onScan, myProducts, formatUSD }: any) => {
  const [selectedProductToSimulate, setSelectedProductToSimulate] = useState("");
  const localStreamRef = useRef<any>(null);

  useEffect(() => {
    let active = true;
    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (active) {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          localStreamRef.current = stream;
        }
      } catch (err) {
        console.warn("Cámara física no disponible. Se activa el simulador interactivo KFS.");
      }
    };

    startCam();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [videoRef]);

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
            <span className="text-[10px] text-gray-300 font-mono flex items-center justify-center gap-1"><Info size={12}/> Buscando código QR...</span>
          </div>
        </div>

        {/* Simulation Dropdown for testing without cameras */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Simulador de Lectura (Para Pruebas)</label>
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
          <button 
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
const VendedorDashboard = ({ db, setDb, currentUser, addProduct, processPurchase, showToast, formatUSD, logout }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [newProd, setNewProd] = useState({ name: "", price: "", imgUrl: "" });

  const myProducts = db.products.filter((p: any) => p.clientId === currentUser.clientId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProd({ ...newProd, imgUrl: url });
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ 
      name: newProd.name, 
      priceUSD: parseFloat(newProd.price), 
      image: newProd.imgUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", 
      clientId: currentUser.clientId, 
      clientName: currentUser.company 
    });
    setShowAddModal(false);
    setNewProd({ name: "", price: "", imgUrl: "" });
  };

  const handleScanSuccess = (prodId: string) => {
    const prod = db.products.find((p: any) => p.id === prodId);
    if (prod) {
      processPurchase(prod);
      setShowScanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar title={`Terminal: ${currentUser.company}`} currentUser={currentUser} logout={logout} />
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        
        <div className="bg-[#0A1128] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[#C5A184] text-xs font-black uppercase tracking-widest mb-1">Sesión Operativa</p>
            <h2 className="text-3xl font-black">{currentUser.name}</h2>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Terminal en línea y asegurado.
            </p>
          </div>
          <Activity size={150} className="absolute -right-10 -bottom-10 text-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <h3 className="font-black text-[#0A1128] text-lg mb-4 flex items-center gap-2"><Package size={20} className="text-[#C5A184]"/> Catálogo de {currentUser.company}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {myProducts.map((p: any) => (
              <div key={p.id} className="border border-gray-100 rounded-2xl p-3 flex flex-col justify-between bg-gray-50/50">
                <div className="h-28 bg-gray-200 rounded-lg overflow-hidden mb-2">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <div>
                  <h4 className="font-bold text-xs truncate text-gray-900">{p.name}</h4>
                  <p className="text-xs font-black text-[#C5A184]">{formatUSD(p.priceUSD)}</p>
                </div>
                <button onClick={() => processPurchase(p)} className="mt-2 w-full py-2 bg-[#0A1128] hover:bg-gray-800 text-white font-bold rounded-lg text-[10px] cursor-pointer">
                  Cargar Venta
                </button>
              </div>
            ))}
            {myProducts.length === 0 && <p className="col-span-full text-center text-xs text-gray-400 py-6 font-bold">Sin productos. Use subir producto para poblar el inventario.</p>}
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

      {/* Modal Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#0A1128]">Nuevo Producto</h3>
            <form onSubmit={submitProduct} className="space-y-4">
              <input required type="text" placeholder="Nombre del Artículo" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-bold text-gray-900" />
              <input required type="number" step="0.01" placeholder="Precio Final (USD)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A184] font-black text-lg text-gray-900" />
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
    </div>
  );
};

// Marketplace Public View
const MarketplaceView = ({ db, processPurchase, formatUSD, logout, currentUser }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = db.products.filter((p: any) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar title="Marketplace Público" currentUser={currentUser} logout={logout} />
      
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-[#0A1128]">Catálogo de Red KFS</h2>
            <p className="text-xs text-gray-500 mt-1">Consumo en vivo de productos distribuidos en nuestros comercios activos.</p>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar artículo o comercio..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A184] text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((p: any) => (
            <div key={p.id} className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
              <div>
                <div className="h-44 bg-gray-100 w-full overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[8px] bg-[#0A1128]/80 text-[#C5A184] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#C5A184]/20 backdrop-blur-sm">
                    {p.clientName}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm text-[#0A1128] truncate mb-1">{p.name}</h4>
                  <p className="text-[#C5A184] font-black text-sm">{formatUSD(p.priceUSD)}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button onClick={() => processPurchase(p)} className="w-full py-2.5 bg-[#0A1128] hover:bg-gray-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer">
                  <ShoppingCart size={14} /> Adquirir Artículo
                </button>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-gray-400 font-bold border border-gray-100 shadow-sm">
              No se encontraron productos disponibles en el Marketplace.
            </div>
          )}
        </div>
      </div>

      {/* Back control */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button onClick={logout} className="bg-[#0A1128] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10 hover:bg-gray-900 cursor-pointer">
          <LogOut size={16} /> Salir del Marketplace
        </button>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT DEFINITION
// ==========================================
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState("login"); 
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [rates, setRates] = useState(MOCK_BCV_RATES);

  // Client-safe state initialization to prevent Next.js hydration mismatch
  const [db, setDb] = useState<any>(initialDB);

  const ghostTrapActive = useRef(true);

  // Hydration and Boot timer
  useEffect(() => {
    setIsClient(true);
    const bootTimer = setTimeout(() => setIsBooting(false), 2000);

    try {
      const saved = localStorage.getItem("kreatek_os_db");
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } catch (error) {
      console.warn("Entorno restringido detectado. Activando memoria volátil.");
    }

    return () => clearTimeout(bootTimer);
  }, []);

  // Save DB to LocalStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("kreatek_os_db", JSON.stringify(db));
    } catch (error) {
      // Ignorar bloqueos de privacidad
    }
  }, [db, isClient]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const formatUSD = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  const formatEUR = (val: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(val);

  const handleLogin = (role: string, password: string, email: string | null = null) => {
    const isProvisional = password === "123123";

    if (role === "core" && (password === "199521" || isProvisional)) {
      setCurrentUser({ role: "core", name: "El Arquitecto" });
      setView("core");
      showToast("KFS OS Accesado. Bienvenido, Arquitecto.");
    } else if (role === "promotora") {
      if (password === "1995" || isProvisional) {
        setCurrentUser({ role: "promotora", name: "Promotora Alpha", id: "p1" });
        setView("promotora");
        showToast("Sesión de Promotora Maestra Iniciada.");
      } else {
        const promo = db.promotoras.find((p: any) => p.email === email && p.password === password);
        if (promo) {
          setCurrentUser({ ...promo, role: "promotora" });
          setView("promotora");
          showToast(`Hub Promotora Accesado: ${promo.name}`);
        } else {
          showToast("Credenciales de promotora inválidas.", "error");
        }
      }
    } else if (role === "dueño") {
      if (password === "1234" || isProvisional) {
        const client = db.clients.find((c: any) => c.email === email) || db.clients[0];
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Dueño no encontrado. Regístrese.", "error");
        }
      } else {
        const client = db.clients.find((c: any) => c.email === email && c.password === password);
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Credenciales de dueño incorrectas.", "error");
        }
      }
    } else if (role === "vendedor") {
      if (isProvisional) {
        const vendedorDemo = db.vendedores[0];
        if (vendedorDemo) {
          setCurrentUser({ ...vendedorDemo, role: "vendedor" });
          setView("vendedor");
          showToast(`Terminal de Vendedor activado: ${vendedorDemo.name}`);
        } else {
          showToast("No hay vendedores registrados para usar la clave provisional.", "error");
        }
      } else {
        const vendedor = db.vendedores.find((v: any) => v.email === email && v.password === password);
        if (vendedor) {
           setCurrentUser({ ...vendedor, role: "vendedor" });
           setView("vendedor");
           showToast(`Terminal de Vendedor activado: ${vendedor.name}`);
        } else {
           showToast("Credenciales de vendedor inválidas.", "error");
        }
      }
    } else if (role === "marketplace") {
      setView("marketplace");
    } else {
      showToast("Credenciales inválidas.", "error");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView("login");
  };

  const registerClient = (clientData: any, promotoraId = "p1") => {
    const newClient = { ...clientData, id: `c${Date.now()}`, salesUSD: 0, promotoraId };
    const setupFeeUSD = 32.5;
    const setupFeeEUR = (setupFeeUSD * rates.USD) / rates.EUR;

    setDb((prev: any) => {
      const updatedPromotoras = prev.promotoras.map((p: any) => {
        if (p.id === promotoraId) {
          return { ...p, setups: (p.setups || 0) + 1, earningsEUR: (p.earningsEUR || 0) + setupFeeEUR };
        }
        return p;
      });
      return { ...prev, clients: [...prev.clients, newClient], promotoras: updatedPromotoras };
    });

    showToast("Setup de Cliente completado con éxito.");
    if (view !== "promotora") setView("login");
  };

  const registerPromotora = (promoData: any) => {
    const newPromo = { ...promoData, id: `p${Date.now()}`, setups: 0, earningsEUR: 0 };
    setDb((prev: any) => ({ ...prev, promotoras: [...prev.promotoras, newPromo] }));
    showToast("Registro de Promotora exitoso. Puede iniciar sesión.");
    setView("login");
  };

  const addProduct = (productData: any) => {
    setDb((prev: any) => ({ ...prev, products: [...prev.products, { ...productData, id: `prod${Date.now()}` }] }));
    showToast("Producto sincronizado con el Marketplace.");
  };

  const processPurchase = (product: any) => {
    const kreatekFeeUSD = 0.04;
    const kreatekFeeEUR = (kreatekFeeUSD * rates.USD) / rates.EUR;

    setDb((prev: any) => {
      const updatedClients = prev.clients.map((c: any) => 
        c.id === product.clientId ? { ...c, salesUSD: (c.salesUSD || 0) + product.priceUSD } : c
      );

      if (ghostTrapActive.current) {
        console.log(`[Ghost Protocol] Detonando captura de datos para tx_id: ${Date.now()}`);
      }

      return {
        ...prev,
        clients: updatedClients,
        transactions: [...prev.transactions, {
          id: `tx${Date.now()}`, productId: product.id, amountUSD: product.priceUSD, kreatekFeeEUR: kreatekFeeEUR
        }],
        kreatekCore: {
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekFeeEUR
        }
      };
    });
    showToast(`Compra de ${product.name} procesada.`);
  };

  if (isBooting || !isClient) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-[#C5A184]/20 border-t-[#C5A184] rounded-full animate-spin mb-6" />
          <Shield className="absolute top-6 text-[#C5A184]" size={32} />
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
          processPurchase={processPurchase} 
          formatUSD={formatUSD} 
          logout={logout} 
          currentUser={currentUser}
        />
      )}
      {view === "core" && (
        <CoreDashboard 
          db={db} 
          setDb={setDb} 
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
          showToast={showToast} 
          formatUSD={formatUSD} 
          logout={logout}
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
        />
      )}
    </div>
  );
}
