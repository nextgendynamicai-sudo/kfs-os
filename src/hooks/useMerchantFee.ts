import { useKFS } from "../context/KFSContext";

export function useMerchantFee() {
  const kfs = useKFS() as any;
  const { db, setDb, rates, showToast } = kfs;

  // Calculate dynamic fees based on merchant founder status and customer referrals
  const getMerchantFeeTier = (merchantId: string, customerPhone?: string): number => {
    const merchant = db.clients?.find((m: any) => m.id === merchantId);
    if (!merchant) return 0.05; // Default standard 5%

    // 1% royalty fee for Founders
    if (merchant.is_founder) {
      return 0.01;
    }

    // Drops to 3% if the merchant onboarded/referred this paying customer
    if (customerPhone) {
      const customer = db.customers?.find((c: any) => c.phone === customerPhone);
      if (customer && customer.referred_by_merchant_id === merchantId) {
        return 0.03;
      }
    }

    // Default fee tier for merchants (check fee_tier or default to 5%)
    if (merchant.fee_tier) {
      if (merchant.fee_tier === "1%") return 0.01;
      if (merchant.fee_tier === "3%") return 0.03;
      if (merchant.fee_tier === "5%") return 0.05;
    }

    return 0.05; // Standard 5%
  };

  // Calculate the detailed fee amounts for a transaction
  const calculateTransactionFees = (merchantId: string, amountUSD: number, customerPhone?: string) => {
    const feePercentage = getMerchantFeeTier(merchantId, customerPhone);
    const feeUSD = amountUSD * feePercentage;
    return {
      feePercentage,
      feeUSD
    };
  };

  // Split payment handler: processes payment of Real USD + K-Points
  const processSplitPayment = (
    merchantId: string,
    customerPhone: string,
    totalPriceUSD: number,
    kPointsToUse: number // e.g. 5000 KP (worth $5.00)
  ) => {
    const kpUSDValue = kPointsToUse / 1000;
    const realUSDNeeded = Math.max(0, totalPriceUSD - kpUSDValue);

    // Find customer & merchant
    const customer = db.customers?.find((c: any) => c.phone === customerPhone);
    const merchant = db.clients?.find((m: any) => m.id === merchantId);

    if (!customer) {
      showToast("Cliente no encontrado.", "error");
      return null;
    }
    if (!merchant) {
      showToast("Comercio no encontrado.", "error");
      return null;
    }

    // Verify balances
    if ((customer.k_points_balance || 0) < kPointsToUse) {
      showToast("K-Points insuficientes.", "error");
      return null;
    }
    if ((customer.real_balance || 0) < realUSDNeeded) {
      showToast("Saldo Real insuficiente.", "error");
      return null;
    }

    let transactionObj: any = null;

    setDb((prev: any) => {
      // 1. Deduct customer balances
      const updatedCustomers = prev.customers.map((c: any) => {
        if (c.phone === customerPhone) {
          const newKP = (c.k_points_balance || 0) - kPointsToUse;
          return {
            ...c,
            k_points_balance: newKP,
            real_balance: (c.real_balance || 0) - realUSDNeeded,
            // Clear expiry if points become 0
            k_points_expiry: newKP <= 0 ? null : c.k_points_expiry
          };
        }
        return c;
      });

      // 2. Calculate dynamic merchant fees based on the TOTAL price (or real portion? Total price is standard)
      const feePercentage = getMerchantFeeTier(merchantId, customerPhone);
      const feeUSD = totalPriceUSD * feePercentage;

      // Converter fees for promoter / core
      const rateUSD = rates.USD || 36.45;
      const rateEUR = rates.EUR || 39.20;
      const feeEUR = (feeUSD * rateUSD) / rateEUR;

      let updatedPromotoras = prev.promotoras;
      // If customer has a referred promoter, they get 20% commission on merchant royalty
      const customerObj = prev.customers.find((c: any) => c.phone === customerPhone);
      const targetPromoterId = customerObj?.referred_by_promoter_id;
      const promoCutEUR = feeEUR * 0.20;
      const coreCutEUR = feeEUR - promoCutEUR;

      if (targetPromoterId) {
        updatedPromotoras = prev.promotoras.map((p: any) => {
          if (p.id === targetPromoterId) {
            return {
              ...p,
              passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promoCutEUR
            };
          }
          return p;
        });
      }

      // 3. Update merchant sales volume. The merchant gets the real USD portion instantly in their drawer,
      // and owes the KFS system fees.
      const updatedClients = prev.clients.map((c: any) => {
        if (c.id === merchantId) {
          return {
            ...c,
            salesUSD: (c.salesUSD || 0) + realUSDNeeded, // local receives real portion instantly
            kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + feeUSD
          };
        }
        return c;
      });

      // 4. Record transaction log
      const receiptNumber = `HYB-${Date.now().toString().slice(-4)}`;
      transactionObj = {
        id: `tx_hyb_${Date.now()}`,
        clientId: merchantId,
        amountUSD: totalPriceUSD,
        realAmountUSD: realUSDNeeded,
        kPointsUsed: kPointsToUse,
        paymentMethod: "hybrid",
        receiptNumber,
        kreatekFeeEUR: feeEUR,
        customerPhone,
        timestamp: new Date().toISOString(),
        exchangeRateBCV: rateUSD
      };

      const auditLog = {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor: customer.name,
        action: "HYBRID_PURCHASE",
        details: `Compra híbrida en ${merchant.company} por $${totalPriceUSD}. Pagó $${realUSDNeeded} real + ${kPointsToUse} KP.`
      };

      return {
        ...prev,
        customers: updatedCustomers,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        transactions: [...(prev.transactions || []), transactionObj],
        kreatekCore: {
          ...prev.kreatekCore,
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + feeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + coreCutEUR
        },
        auditLogs: [...(prev.auditLogs || []), auditLog]
      };
    });

    showToast("Compra procesada con éxito via Pago Híbrido!", "success");
    return transactionObj;
  };

  return {
    getMerchantFeeTier,
    calculateTransactionFees,
    processSplitPayment
  };
}
