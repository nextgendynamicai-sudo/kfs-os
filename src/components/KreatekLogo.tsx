"use client";

import React from "react";

export const KreatekLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <img
      src="/kfs-logo.png"
      className={className}
      alt="Kreatek Flow Systems"
      style={{ objectFit: "contain" }}
    />
  );
}
