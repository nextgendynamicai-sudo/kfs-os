"use client";

import React from "react";
import { AxisNitroPOS } from "../../components/AxisNitroPOS";

export default function PosPage() {
  return (
    <div suppressHydrationWarning className="min-h-screen">
      <AxisNitroPOS />
    </div>
  );
}
