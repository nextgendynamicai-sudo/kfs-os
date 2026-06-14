import React, { useState } from 'react';
import { Database, Search, Gift, Users, Store, Shield, Car, CheckCircle } from 'lucide-react';

export const KPointsIssuerWidget = ({ db, transferKFSPoints }: any) => {
  const [activeCollection, setActiveCollection] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const collections = [
    { id: "customers", icon: Users, label: "Clientes Finales" },
    { id: "clients", icon: Store, label: "Comercios" },
    { id: "riders", icon: Car, label: "Deliveries" },
    { id: "promotoras", icon: Shield, label: "Gobernadoras" }
  ];

  const getCollectionData = () => {
    switch (activeCollection) {
      case "clients": return db.clients || [];
      case "customers": return db.customers || [];
      case "riders": return db.riders || [];
      case "promotoras": return db.promotoras || [];
      default: return [];
    }
  };

  const handleEmit = () => {
    if (!selectedUser) return;
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    transferKFSPoints(selectedUser.id, activeCollection, numAmount);
    setAmount("");
    setSelectedUser(null);
  };

  const data = getCollectionData();
  const filteredData = data.filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Show only top 5 results to save space

  return (
    <div className="bg-gradient-to-br from-[violet-900] to-[#141E3A] shadow-2xl border-none rounded-[2rem] p-8 animate-fade-in text-white relative overflow-hidden">
      <Gift size={120} className="absolute -right-10 -bottom-10 text-white/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-violet-600 p-3 rounded-2xl">
            <Database size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Central del Oráculo</h2>
            <p className="text-violet-200 text-sm">Emisión y Transferencia Universal de K-Points</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Collection Selector */}
          <div>
            <label className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2 block">1. Entidad Destino</label>
            <div className="flex flex-wrap gap-2">
              {collections.map(col => {
                const Icon = col.icon;
                const isActive = activeCollection === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setActiveCollection(col.id);
                      setSelectedUser(null);
                      setSearchTerm("");
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer border-none text-xs ${
                      isActive 
                      ? 'bg-violet-500 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]' 
                      : 'bg-white/10 text-violet-200 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {col.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Search */}
          <div>
            <label className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2 block">2. Seleccionar Usuario</label>
            {!selectedUser ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, empresa o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-bold"
                  />
                </div>
                {searchTerm.length > 1 && (
                  <div className="bg-[#1a2542] rounded-xl border border-white/10 overflow-hidden max-h-48 overflow-y-auto">
                    {filteredData.length > 0 ? filteredData.map((item: any) => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedUser(item)}
                        className="p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-sm">{item.company || item.name}</p>
                          <p className="text-xs text-violet-300 font-mono">{item.phone || item.email || item.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-violet-400 uppercase">Saldo Actual</p>
                          <p className="font-black text-green-400 text-sm">{item.k_points_balance || 0} KP</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-violet-400 text-sm font-bold">Sin resultados</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-green-400 text-sm">{selectedUser.company || selectedUser.name}</p>
                    <p className="text-xs text-green-500/70 font-mono">{selectedUser.phone || selectedUser.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Amount and Confirm */}
          {selectedUser && (
            <div className="animate-fade-in space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2 block">3. Cantidad de K-Points a Emitir</label>
                <input
                  type="number"
                  placeholder="Ej: 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-xl font-black placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-center"
                />
              </div>
              <button
                onClick={handleEmit}
                disabled={!amount || parseInt(amount) <= 0}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <Gift size={24} /> 
                Transferir K-Points
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
