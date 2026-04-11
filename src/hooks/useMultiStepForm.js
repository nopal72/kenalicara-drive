import { useState } from "react";

/** Total halaman: 1 Guideline, 1 Identity, 3 Kuesioner (Visual, Auditori, Kinestetik) -> Total step terakhir adalah 4 */
const TOTAL_STEPS = 4;

/**
 * Mengelola state navigasi form multi-langkah.
 * Step 0 = Guideline
 * Step 1 = Identitas diri
 * Step 2–4 = Halaman kuesioner (Visual, Auditori, Kinestetik)
 */
export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  // Progress bar hanya untuk halaman kuesioner (Step 2, 3, 4)
  const progressPercentage = currentStep >= 2 ? ((currentStep - 1) / 3) * 100 : 0;
  const isLastStep = currentStep === TOTAL_STEPS;

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const resetStep = () => setCurrentStep(0);

  return { currentStep, progressPercentage, isLastStep, TOTAL_STEPS, goNext, goPrev, resetStep };
}
