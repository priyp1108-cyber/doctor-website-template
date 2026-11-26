"use client";

import { useEffect } from "react";
import { initHeroSlider } from "@/lib/heroSlider";

/** Starts the hero photo rotation and its controls. */
export function HeroSliderEnhancer() {
  useEffect(() => initHeroSlider(), []);
  return null;
}
