const fs = require('fs');
let content = fs.readFileSync('src/context/KFSContext.tsx', 'utf8');

const updatedValidateTopUp = `
  const validateTopUp = (topupId: string, status: 'approved' | 'rejected', approverId: string) => {
    setDb((prev: any) => {
      const topup = (prev.topups || []).find((t: any) => t.id === topupId);
      if (!topup || topup.status !== 'pending') return prev;

      if (status === 'approved') {
        if (topup.userType === 'client') {
          prev.clients = prev.clients.map((c: any) => 
            c.id === topup.userId ? { ...c, walletBalanceUSD: (c.walletBalanceUSD || 0) + topup.amountUSD } : c
          );
        } else {
          let bonusKP = 0;
          let promoterCommissionUSD = 0;

          if (topup.amountUSD >= 5) {
            bonusKP = topup.amountUSD === 5 ? 2000 : (topup.amountUSD === 10 ? 5000 : 12000);
            promoterCommissionUSD = topup.amountUSD === 5 ? 1.00 : (topup.amountUSD === 10 ? 1.50 : 2.00);
            
            // Check if referring customer exists
            const user = prev.customers.find((c: any) => c.id === topup.userId);
            if (user && user.referred_by_customer_id && !user.has_first_topup) {
              prev.customers = prev.customers.map((c: any) => 
                c.id === user.referred_by_customer_id 
                  ? { ...c, kfsPoints: (c.kfsPoints || 0) + 500 } // Reward referring customer
                  : c
              );
            }
          }
          const expiryDateStr = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

          prev.customers = prev.customers.map((c: any) => {
            if (c.id === topup.userId) {
              const targetPromoterId = c.referred_by_promoter_id;
              if (targetPromoterId && promoterCommissionUSD > 0) {
                const rateUSD = prev.rates?.USD || 36.45;
                const rateEUR = prev.rates?.EUR || 39.20;
                const commissionEUR = (promoterCommissionUSD * rateUSD) / rateEUR;
                prev.promotoras = (prev.promotoras || []).map((p: any) => 
                  p.id === targetPromoterId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + commissionEUR } : p
                );
              }

              return {
                ...c,
                real_balance: (c.real_balance || 0) + topup.amountUSD,
                k_points_balance: (c.k_points_balance || 0) + bonusKP,
                k_points_expiry: bonusKP > 0 ? expiryDateStr : c.k_points_expiry,
                has_first_topup: true
              };
            }
            return c;
          });
        }
`;

content = content.replace(/const validateTopUp = \(topupId: string, status: 'approved' \| 'rejected', approverId: string\) => \{[\s\S]*?real_balance: \(c\.real_balance \|\| 0\) \+ topup\.amountUSD,[\s\S]*?k_points_balance: \(c\.k_points_balance \|\| 0\) \+ bonusKP,[\s\S]*?k_points_expiry: bonusKP > 0 \? expiryDateStr : c\.k_points_expiry[\s\S]*?\};[\s\S]*?\}[\s\S]*?return c;[\s\S]*?\}\);[\s\S]*?\}/, updatedValidateTopUp.trim());

fs.writeFileSync('src/context/KFSContext.tsx', content);
