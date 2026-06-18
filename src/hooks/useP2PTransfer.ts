import { useKFS } from "../context/KFSContext";

export function useP2PTransfer() {
  const kfs = useKFS() as any;
  const { db, setDb, showToast } = kfs;

  const transferP2P = (
    senderPhone: string,
    recipientQuery: string, // phone or name
    amount: number,
    type: "real_balance" | "k_point_cash_balance" | "k_points_balance" | "k_point_bonus_balance"
  ) => {
    if (amount <= 0) {
      showToast("Monto inválido para transferencia.", "error");
      return false;
    }

    if (type === "k_point_bonus_balance") {
      showToast("Los K-Point Bonus son intransferibles.", "error");
      return false;
    }

    const cleanQuery = recipientQuery.trim().toLowerCase();
    if (!cleanQuery) {
      showToast("Por favor ingresa el teléfono o nombre del destinatario.", "error");
      return false;
    }

    // Find sender
    const sender = db.customers?.find((c: any) => c.phone === senderPhone);
    if (!sender) {
      showToast("Remitente no encontrado.", "error");
      return false;
    }

    // Find recipient by phone or name (case insensitive)
    const recipient = db.customers?.find(
      (c: any) =>
        c.phone === cleanQuery ||
        c.name?.toLowerCase().includes(cleanQuery)
    );

    if (!recipient) {
      showToast("Destinatario no encontrado. Verifica los datos.", "error");
      return false;
    }

    if (recipient.phone === senderPhone) {
      showToast("No puedes transferirte a ti mismo.", "error");
      return false;
    }

    let success = false;

    setDb((prev: any) => {
      const updatedCustomers = prev.customers.map((c: any) => {
        if (c.phone === sender.phone) {
          if (type === "real_balance") {
            const currentReal = c.real_balance || 0;
            if (currentReal < amount) {
              setTimeout(() => showToast("Reserva Central (USD) insuficiente.", "error"), 10);
              return c;
            }
            success = true;
            return { ...c, real_balance: currentReal - amount };
          } 
          
          else if (type === "k_point_cash_balance") {
            const currentCash = c.k_point_cash_balance || 0;
            if (currentCash < amount) {
              setTimeout(() => showToast("K-Point Cash insuficiente.", "error"), 10);
              return c;
            }
            success = true;
            return { ...c, k_point_cash_balance: currentCash - amount };
          }
          
          else if (type === "k_points_balance") {
            const currentKP = c.k_points_balance || 0;
            const requiredKP = amount * 1.30; // 30% Transfer Fee
            
            if (currentKP >= requiredKP) {
              success = true;
              return { ...c, k_points_balance: currentKP - requiredKP };
            } 
            
            // Auto-Fill Módulo
            const deficitKP = requiredKP - currentKP;
            const equivalentUSD = deficitKP / 1000;
            const usdRequiredWithFee = equivalentUSD * 1.01; // 1% Conversion Fee
            
            const currentReal = c.real_balance || 0;
            if (currentReal >= usdRequiredWithFee) {
              success = true;
              setTimeout(() => showToast("Auto-Fill Activado: Liquidación USD (1% fee) aplicada.", "success"), 10);
              return { 
                ...c, 
                k_points_balance: 0, 
                real_balance: currentReal - usdRequiredWithFee 
              };
            } else {
              setTimeout(() => showToast("K-Points Insuficientes y Auto-Fill fallido por falta de Reserva USD.", "error"), 10);
              return c;
            }
          }
        }

        if (c.phone === recipient.phone) {
          if (type === "real_balance") {
            return { ...c, real_balance: (c.real_balance || 0) + amount };
          } else if (type === "k_point_cash_balance") {
            return { ...c, k_point_cash_balance: (c.k_point_cash_balance || 0) + amount };
          } else if (type === "k_points_balance") {
            // El destinatario recibe el amount base. El 30% se quemó / se cobró como comisión.
            const newExpiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
            return {
              ...c,
              k_points_balance: (c.k_points_balance || 0) + amount,
              k_points_expiry: newExpiry
            };
          }
        }

        return c;
      });

      if (!success) return prev;

      // Log transaction
      const transactionObj = {
        id: `tx_p2p_${Date.now()}`,
        amountUSD: type === "real_balance" ? amount : amount / 1000,
        paymentMethod: "p2p_transfer",
        p2p_type: type,
        senderPhone: sender.phone,
        customerPhone: recipient.phone, // receiver
        timestamp: new Date().toISOString()
      };

      const auditLog = {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor: sender.name,
        action: `P2P_TRANSFER_${type.toUpperCase()}`,
        details: `Transfirió ${amount} ${type === "real_balance" ? "USD" : "K-Points"} a ${recipient.name} (${recipient.phone})`
      };

      setTimeout(() => {
        showToast(
          `¡Transferencia exitosa de ${amount} ${type === "real_balance" ? "USD" : "K-Points"} a ${recipient.name}!`,
          "success"
        );
      }, 10);

      return {
        ...prev,
        customers: updatedCustomers,
        transactions: [...(prev.transactions || []), transactionObj],
        auditLogs: [...(prev.auditLogs || []), auditLog]
      };
    });

    return success;
  };

  return {
    transferP2P
  };
}
