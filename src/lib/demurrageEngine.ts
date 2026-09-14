export const applyDemurrageToCustomers = (customers: any[] = []) => {
  const now = Date.now();
  let updated = false;

  const newCustomers = customers.map((c: any) => {
    let hasChanges = false;
    const newC = { ...c };

    // 1. Axis Bonus Expiry (7 days irreversible)
    if (newC.k_point_bonus_expiry && newC.k_point_bonus_balance > 0) {
      const expiryTime = new Date(newC.k_point_bonus_expiry).getTime();
      if (now > expiryTime) {
        hasChanges = true;
        newC.k_point_bonus_balance = 0;
        newC.k_point_bonus_expiry = null;
      }
    }

    // 2. Normal AOF (0.5% degradation every 5 days)
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

  return { newCustomers, updated };
};
