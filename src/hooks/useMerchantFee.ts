import { KFS_BRAND } from "../config/brandConfig";
import { useKFS } from "../context/KFSContext";

export function useMerchantFee() {
  const kfs = useKFS() as any;
  // Extraemos currentUser para saber quién es el cajero
  const { db, setDb, rates, showToast, currentUser } = kfs;

  // Calculate dynamic fees based on Oracle Control with fallback to SaaS Tier
  const getMerchantFeeTier = (merchantId: string, customerPhone?: string): number => {
    const merchant = db.clients?.find((m: any) => m.id === merchantId);
    if (!merchant) return 0.05; // Default standard 5%

    // 1. Prioridad absoluta: Oráculo
    if (merchant.oracle_fee_percentage !== undefined && merchant.oracle_fee_percentage !== null) {
      return merchant.oracle_fee_percentage / 100;
    }

    // Fallback Lógica Antigua (v3.0)
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

    // Default fee tier for merchants (check kfsTier or default to 5%)
    if (merchant.kfsTier) {
      if (merchant.kfsTier === "velocity") return 0.03;
      if (merchant.kfsTier === "matrix") return 0.05;
      if (merchant.kfsTier === "monopoly") return 0.10;
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

  // Split payment handler: processes payment of Real USD + {KFS_BRAND.economy.currency}
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
      showToast(`${KFS_BRAND.economy.currency} insuficientes.`, "error");
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

      // Distribuir según el modelo del Oráculo
      const promoCutEUR = feeEUR * 0.20; // 20% Promotora
      const localAdsCutUSD = feeUSD * 0.20; // 20% Ads Local
      const kfsAdsCutEUR = feeEUR * 0.10; // 10% KFS Ads
      const cashierBonusUSD = feeUSD * 0.05; // 5% Cajero
      const kfsNetEUR = feeEUR * 0.45; // 45% KFS Holding

      let updatedPromotoras = prev.promotoras;
      const customerObj = prev.customers.find((c: any) => c.phone === customerPhone);
      const targetPromoterId = merchant?.referred_by_promoter_id || customerObj?.referred_by_promoter_id;

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

      // Vendedor Bonus
      let updatedVendedores = prev.vendedores;
      if (currentUser?.role === "vendedor") {
        updatedVendedores = (prev.vendedores || []).map((v: any) => {
          if (v.id === currentUser.id) {
            return {
              ...v,
              accumulated_bonus: (v.accumulated_bonus || 0) + cashierBonusUSD
            };
          }
          return v;
        });
      }

      // 3. Update merchant sales volume and local ads budget. 
      const updatedClients = prev.clients.map((c: any) => {
        if (c.id === merchantId) {
          return {
            ...c,
            salesUSD: (c.salesUSD || 0) + realUSDNeeded, 
            kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + feeUSD,
            localAdsBudgetUSD: (c.localAdsBudgetUSD || 0) + localAdsCutUSD
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
        vendedores: updatedVendedores || prev.vendedores,
        transactions: [...(prev.transactions || []), transactionObj],
        kreatekCore: {
          ...prev.kreatekCore,
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + feeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + kfsNetEUR,
          adsBudgetEUR: (prev.kreatekCore.adsBudgetEUR || 0) + kfsAdsCutEUR
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
