"use client";

import React from "react";
import { usePreset, PresetMetadata } from "../context/PresetContext";

interface FeatureFlagProps {
  name: keyof PresetMetadata["features"];
  children: React.ReactNode;
}

export function FeatureFlag({ name, children }: FeatureFlagProps) {
  const { presetMetadata } = usePreset();

  // Short-circuit: if feature is inactive, return null immediately
  if (!presetMetadata.features[name]) {
    return null;
  }

  return <>{children}</>;
}
export default FeatureFlag;
