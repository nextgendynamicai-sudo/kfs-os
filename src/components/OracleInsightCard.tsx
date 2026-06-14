import React from 'react';

export const OracleInsightCard = ({ role, data }: any) => {
  const generateInsight = () => {
    switch (role) {
      case 'owner':
        return `🔮 Oráculo KFS: Tu producto estrella '${data?.topProduct || 'cargando...'}' se agota pronto. Estás perdiendo margen. Sugiero subir el precio $0.50 mañana.`;
      case 'cashier':
        return `💸 Oráculo KFS: ¡Racha activa! Llevas ${data?.streak || 0} ventas perfectas. Tu bono acumulado hoy es $${data?.bonusEarned || '0.00'}. Haz que paguen con K-Points.`;
      case 'promoter':
        return `🎯 Oráculo KFS: Alerta Operativa. El Nodo '${data?.inactiveNode || 'cargando...'}' lleva 4h sin ventas. Desvío sugerido para auditoría. Quedan ${data?.remainingPioneerNodes || 0} cupos de Nodos.`;
      case 'customer':
        return `🔥 Oráculo KFS: Tienes $${data?.walletBalance || '0.00'} en poder adquisitivo. A 50 metros hay un 'Combo Kreatek' por $8. Ve ahora y multiplica tus puntos.`;
      default:
        return "El Oráculo está analizando tu flujo operativo...";
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border-l-2 border-yellow-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] mb-6 flex items-start gap-3">
      <span className="text-2xl animate-pulse">👁️</span>
      <p className="text-gray-200 text-sm md:text-base font-medium leading-relaxed font-mono">
        {generateInsight()}
      </p>
    </div>
  );
};
