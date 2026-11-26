"use client";

import { useEffect } from "react";
import { initTreatmentsMenu } from "@/lib/treatmentsMenu";

/** Adds keyboard, hover-intent and click behaviour to the header menus. */
export function TreatmentsMenuEnhancer() {
  useEffect(() => initTreatmentsMenu(), []);
  return null;
}
