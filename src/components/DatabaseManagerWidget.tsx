import React, { useState } from 'react';
import { Database, Trash2, Plus, Store, Users, Briefcase, Car, Shield } from 'lucide-react';

export const DatabaseManagerWidget = ({ db, deleteClient, deleteCustomer, deletePromotora, deleteVendedor, rejectRider, showToast, setActiveTab }: any) => {
  const [activeCollection, setActiveCollection] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Para simplificar, el Admin forzará los IDs o dejará que el componente los llene (esto es un atajo para "Dios")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });

  const collections = [
    { id: "clients", icon: Store, label: "Nodos (Comercios)" },
    { id: "customers", icon: Users, label: "Clientes Finales" },
    { id: "riders", icon: Car, label: "Deliveries" },
    { id: "promotoras", icon: Shield, label: "Gobernadoras" },
    { id: "vendedores", icon: Briefcase, label: "Cajeros" }
  ];

  const getCollectionData = () => {
    switch (activeCollection) {
      case "clients": return db.clients || [];
      case "customers": return db.customers || [];
      case "riders": return db.riders || [];
      case "promotoras": return db.promotoras || [];
      case "vendedores": return db.vendedores || [];
      default: return [];
    }
  };

  const handleDelete = (id: string, collection: string) => {
    if (!window.confirm(`🚨 ADVERTENCIA: Estás a punto de eliminar permanentemente este registro (${id}). ¿Estás absolutamente seguro?`)) return;

    try {
      switch (collection) {
        case "clients": deleteClient(id); break;
        case "customers": deleteCustomer(id); break;
        case "riders": 
          if(rejectRider) rejectRider(id); 
          else showToast("Función rejectRider no disponible en el motor", "error");
          break;
        case "promotoras": deletePromotora(id); break;
        case "vendedores": deleteVendedor(id); break;
      }
      showToast("Registro purgado exitosamente de la Matrix.", "success");
    } catch (e: any) {
      showToast(`Error eliminando registro: ${e.message}`, "error");
    }
  };

  const handleForceAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name && !formData.company) {
      showToast("Se requiere al menos un Nombre o Empresa", "error");
      return;
    }
    // Como somos 'Dios', redirigiremos al Admin a las vistas de creación de la plataforma ya hechas 
    // en lugar de re-escribir lógica compleja que podría romper la validación.
    setShowAddModal(false);
    switch(activeCollection) {
        case "clients": setActiveTab("register"); break;
        case "promotoras": setActiveTab("registerPromo"); break;
        case "customers": setActiveTab("registerCustomer"); break;
        case "riders": setActiveTab("registerRider"); break;
        case "vendedores": showToast("Abre un Nodo (Comercio) primero y ve a Personal para añadir un cajero.", "info"); break;
    }
    showToast("Redirigiendo a formulario oficial de onboarding...", "success");
  };

  const data = getCollectionData();
  const filteredData = data.filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 flex flex-col animate-fade-in relative">
      <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-black text-[violet-900] flex items-center gap-3">
              <Database className="w-8 h-8 text-[violet-600]" />
              Gestor de Base de Datos
            </h2>
            <p className="text-gray-500 font-bold mt-2">Control absoluto (CRUD) sobre las entidades del ecosistema KFS.</p>
          </div>
          <button 
            onClick={() => handleForceAdd({ preventDefault: () => {} } as any)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors border-none cursor-pointer shadow-lg hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            Añadir Registro Oficial
          </button>
        </div>

        {/* Collection Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {collections.map(col => {
            const Icon = col.icon;
            const isActive = activeCollection === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer border-none ${
                  isActive 
                  ? 'bg-violet-600 text-white shadow-[0_5px_15px_rgba(139,92,246,0.3)]' 
                  : 'bg-white text-gray-500 shadow-sm hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {col.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Buscar en ${collections.find(c => c.id === activeCollection)?.label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-none rounded-2xl px-6 py-4 text-gray-800 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-black">ID / Identificador</th>
                  <th className="p-4 font-black">Nombre / Empresa</th>
                  <th className="p-4 font-black">Email / Contacto</th>
                  <th className="p-4 font-black">Referido Por</th>
                  <th className="p-4 font-black text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg font-bold">{item.id}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {item.company || item.name || 'Sin Nombre'}
                    </td>
                    <td className="p-4 text-gray-500 font-bold">
                      {item.email || item.phone || 'Sin Contacto'}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {(() => {
                        const refId = item.referredBy || item.promotoraId || item.referred_by_promoter_id;
                        if (!refId) return <span className="text-gray-300">-</span>;
                        const refUser = db.promotoras?.find((p:any) => p.id === refId) || db.clients?.find((c:any) => c.id === refId);
                        return (
                          <div className="flex flex-col">
                            <span className="font-bold text-violet-600">{refUser?.name || refUser?.company || 'ID:'}</span>
                            <span className="font-mono text-[10px]">{refId}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, activeCollection)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                        title="Eliminar Registro Permanentemente"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                      No se encontraron registros en esta colección.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
