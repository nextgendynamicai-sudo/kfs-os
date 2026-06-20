import { KFS_BRAND } from "../config/brandConfig";
import { useKFS } from "../context/KFSContext";

export function useWalletEngine() {
  const kfs = useKFS() as any;
  const { db, setDb, rates, showToast } = kfs;

  // 100 K-Points = $0.10 USD (meaning 1000 KP = $1.00 USD)
  const usdToKPoints = (usd: number): number => {
    return Math.round(usd * 1000);
  };

  const kPointsToUSD = (points: number): number => {
    return points / 1000;
  };

  // Process Double Ledger Demurrage (AOF and Bonus Expiry)
  const processDoubleLedgerDemurrage = () => {
    const now = Date.now();
    let updated = false;

    const newCustomers = (db.customers || []).map((c: any) => {
      let hasChanges = false;
      let newC = { ...c };

      // 1. K-Point Bonus Expiry (7 days irreversible)
      if (newC.k_point_bonus_expiry && newC.k_point_bonus_balance > 0) {
        const expiryTime = new Date(newC.k_point_bonus_expiry).getTime();
        if (now > expiryTime) {
          hasChanges = true;
          newC.k_point_bonus_balance = 0;
          newC.k_point_bonus_expiry = null;
        }
      }

      // 2. {KFS_BRAND.economy.currency} Normal AOF (0.5% degradation every 5 days)
      if (!newC.isFlowMaster && newC.k_points_expiry && newC.k_points_balance > 0) {
        const aofTime = new Date(newC.k_points_expiry).getTime();
        if (now > aofTime) {
          hasChanges = true;
          newC.k_points_balance = Math.max(0, newC.k_points_balance * 0.995); // 0.5% degrade
          newC.k_points_expiry = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
        }
      }

      if (hasChanges) updated = true;
      return newC;
    });

    if (updated) {
      setDb((prev: any) => ({
        ...prev,
        customers: newCustomers
      }));
      console.log("[WalletEngine] Demurrage processado: Bonos expirados y AOF aplicado.");
    }
  };

  // Perform a wallet recharge
  const rechargeCustomerWallet = (phone: string, amountUSD: number, promoterId?: string) => {
    let bonusKP = 0;
    let promoterCommissionUSD = 0;

    // Whale recharge ladders
    if (amountUSD === 5) {
      bonusKP = 2000;
      promoterCommissionUSD = 1.00;
    } else if (amountUSD === 10) {
      bonusKP = 5000;
      promoterCommissionUSD = 1.50;
    } else if (amountUSD === 20) {
      bonusKP = 12000;
      promoterCommissionUSD = 2.00;
    }

    const expiryDateStr = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 120 hours

    setDb((prev: any) => {
      // Find customer
      const customerIndex = prev.customers?.findIndex((c: any) => c.phone === phone);
      if (customerIndex === -1 || customerIndex === undefined) return prev;

      const customer = prev.customers[customerIndex];
      const updatedCustomers = [...prev.customers];

      // Update customer balances
      const updatedCustomer = {
        ...customer,
        real_balance: (customer.real_balance || 0) + amountUSD,
        k_points_balance: (customer.k_points_balance || 0) + bonusKP,
        k_points_expiry: bonusKP > 0 ? expiryDateStr : customer.k_points_expiry,
        // Set referred_by_promoter_id if passed or keep existing
        referred_by_promoter_id: promoterId || customer.referred_by_promoter_id || null
      };
      updatedCustomers[customerIndex] = updatedCustomer;

      // Update promoter earnings if applicable
      const targetPromoterId = updatedCustomer.referred_by_promoter_id;
      let updatedPromotoras = prev.promotoras;

      if (targetPromoterId && promoterCommissionUSD > 0) {
        const rateUSD = rates.USD || 36.45;
        const rateEUR = rates.EUR || 39.20;
        const commissionEUR = (promoterCommissionUSD * rateUSD) / rateEUR;

        updatedPromotoras = prev.promotoras.map((p: any) => {
          if (p.id === targetPromoterId) {
            return {
              ...p,
              passiveEarningsEUR: (p.passiveEarningsEUR || 0) + commissionEUR
            };
          }
          return p;
        });
      }

      // Record transaction
      const transactionObj = {
        id: `tx_rec_${Date.now()}`,
        amountUSD: amountUSD,
        paymentMethod: "recharge",
        kfsPointsEarned: bonusKP,
        customerPhone: phone,
        timestamp: new Date().toISOString(),
        exchangeRateBCV: rates.USD || 36.45
      };

      // Create log
      const auditLog = {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor: "System",
        action: "RECHARGE_WALLET",
        details: `Usuario ${phone} recargó $${amountUSD} USD. Recibe bono: ${bonusKP} KP. Promotora: ${targetPromoterId || "ninguna"}`
      };

      return {
        ...prev,
        customers: updatedCustomers,
        promotoras: updatedPromotoras,
        transactions: [...(prev.transactions || []), transactionObj],
        auditLogs: [...(prev.auditLogs || []), auditLog]
      };
    });

    showToast(`Recarga exitosa de $${amountUSD} USD! ${bonusKP > 0 ? `Bono de +${bonusKP} {KFS_BRAND.economy.currency} asignado.` : ""}`, "success");
  };

  // Award cashback (1% on real USD spent)
  const awardCashback = (phone: string, realUSDSpent: number) => {
    if (realUSDSpent <= 0) return;

    const cashbackKP = Math.round(realUSDSpent * 0.01 * 1000);
    const expiryDateStr = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days

    setDb((prev: any) => {
      const customerIndex = prev.customers?.findIndex((c: any) => c.phone === phone);
      if (customerIndex === -1 || customerIndex === undefined) return prev;

      const customer = prev.customers[customerIndex];
      const updatedCustomers = [...prev.customers];

      updatedCustomers[customerIndex] = {
        ...customer,
        k_points_balance: (customer.k_points_balance || 0) + cashbackKP,
        k_points_expiry: expiryDateStr
      };

      const auditLog = {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor: "System",
        action: "AWARD_CASHBACK",
        details: `Usuario ${phone} recibió cashback de ${cashbackKP} KP por gastar $${realUSDSpent} USD reales.`
      };

      return {
        ...prev,
        customers: updatedCustomers,
        auditLogs: [...(prev.auditLogs || []), auditLog]
      };
    });
  };

  return {
    usdToKPoints,
    kPointsToUSD,
    rechargeCustomerWallet,
    awardCashback,
    processDoubleLedgerDemurrage
  };
}
