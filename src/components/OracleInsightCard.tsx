import { KFS_BRAND } from "../config/brandConfig";
import React, { useState, useEffect } from 'react';
import { requestPushPermission, triggerLocalPush } from '../lib/pushNotifications';

export const OracleInsightCard = ({ role, data }: any) => {
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const generateInsight = () => {
    switch (role) {
      case 'owner':
        return `🔮 Oráculo {KFS_BRAND.productAcronym}: Tu producto estrella '${data?.topProduct || 'cargando...'}' se agota pronto. Estás perdiendo margen. Sugiero subir el precio $0.50 mañana.`;
      case 'cashier':
        return `💸 Oráculo {KFS_BRAND.productAcronym}: ¡Racha activa! Llevas ${data?.streak || 0} ventas perfectas. Tu bono acumulado hoy es $${data?.bonusEarned || '0.00'}. Haz que paguen con {KFS_BRAND.economy.currency}.`;
      case 'promoter':
        return `🎯 Oráculo {KFS_BRAND.productAcronym}: Alerta Operativa. El Nodo '${data?.inactiveNode || 'cargando...'}' lleva 4h sin ventas. Desvío sugerido para auditoría. Quedan ${data?.remainingPioneerNodes || 0} cupos de Nodos.`;
      case 'customer':
        return `🔥 Oráculo {KFS_BRAND.productAcronym}: Tienes $${data?.walletBalance || '0.00'} en poder adquisitivo. A 50 metros hay un 'Combo Kreatek' por $8. Ve ahora y multiplica tus puntos.`;
      default:
        return "El Oráculo está analizando tu flujo operativo...";
    }
  };

  const handlePushAlert = async () => {
    let granted = pushEnabled;
    if (!granted) {
      granted = await requestPushPermission();
      setPushEnabled(granted);
    }
    
    if (granted) {
      triggerLocalPush(`Oráculo ${KFS_BRAND.productAcronym}`, generateInsight());
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border-l-2 border-yellow-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] mb-6 mt-8 flex flex-col md:flex-row items-start gap-3 relative z-30">
      <span className="text-2xl animate-pulse flex-shrink-0">👁️</span>
      <div className="flex-1">
        <p className="text-gray-200 text-sm md:text-base font-medium leading-relaxed font-mono">
          {generateInsight()}
        </p>
      </div>
      <button 
        onClick={handlePushAlert}
        className="mt-3 md:mt-0 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
      >
        {pushEnabled ? "🔔 Enviar Push" : "🔔 Activar Alertas"}
      </button>
    </div>
  );
};
