"use client";

import React from "react";
import { useKFS } from "../../context/KFSContext";
import { RiderDashboard } from "../../components/dashboards/RiderDashboard";
import { AppEnforcer } from "../../components/AppEnforcer";

export default function RiderPage() {
  const kfs = useKFS() as any;
  const { db, currentUser, confirmDelivery, markAsPickedUp, updateRiderGPS, riderCheckIn, riderCheckOut, logout } = kfs;

  return (
    <AppEnforcer currentUser={currentUser} updatePwaStatus={() => {}}>
      <RiderDashboard
        db={db}
        currentUser={currentUser || { role: "rider", name: "Rider Logístico Axis Nitro", id: "rider_demo" }}
        confirmDelivery={confirmDelivery}
        markAsPickedUp={markAsPickedUp}
        updateRiderGPS={updateRiderGPS}
        riderCheckIn={riderCheckIn}
        riderCheckOut={riderCheckOut}
        logout={logout}
      />
    </AppEnforcer>
  );
}
