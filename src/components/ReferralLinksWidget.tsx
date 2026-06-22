import { KFS_BRAND } from "../config/brandConfig";
import React, { useState } from 'react';
import { Link, Copy, Store, Users, Car, Shield, CheckCircle } from 'lucide-react';

export const ReferralLinksWidget = ({ userId, showToast }: { userId: string, showToast: any }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin + window.location.pathname;
    }
    return "https://kfs-os.vercel.app/";
  };

  const links = [
    { id: "dueño", label: "Referir Dueño (Comercio)", role: "dueño", icon: Store, description: "Crea una tienda y únete al ecosistema." },
    { id: "cliente", label: "Referir Cliente (Customer)", role: "customer", icon: Users, description: "Afiliar a un cliente consumidor final." },
    { id: "promotora", label: "Referir Gobernadora", role: "promotora", icon: Shield, description: "Invita a un líder de territorio." },
    { id: "rider", label: "Referir Delivery (Rider)", role: "rider", icon: Car, description: `Atrae flotilla para ${KFS_BRAND.productAcronym}.` }
  ];

  const handleCopy = (role: string) => {
    const url = `${getBaseUrl()}?role=${role}&ref=${userId}#login`;
    navigator.clipboard.writeText(url);
    setCopiedLink(role);
    showToast(`Enlace para ${role} copiado al portapapeles.`, "success");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-violet-900 flex items-center gap-3">
            <Link className="w-8 h-8 text-violet-600" />
            Red de Referidos
          </h2>
          <p className="text-gray-500 font-bold mt-2">Comparte tus enlaces directos. Cualquier persona que se registre quedará anclada a ti.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map(link => {
          const Icon = link.icon;
          const isCopied = copiedLink === link.role;
          return (
            <div key={link.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-violet-300 transition-colors group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 text-violet-600">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-violet-900">{link.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleCopy(link.role)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border-none ${
                  isCopied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-[#EEF2F5] text-violet-900 hover:bg-violet-600 hover:text-white'
                }`}
              >
                {isCopied ? <><CheckCircle size={18} /> Copiado</> : <><Copy size={18} /> Copiar Enlace Directo</>}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 font-bold">Nota: Los Vendedores (Cajeros) se registran internamente desde el panel del Dueño de la tienda, por seguridad no poseen enlace público.</p>
      </div>
    </div>
  );
};
