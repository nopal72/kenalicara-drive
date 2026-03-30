import { useState } from "react";

/** Total halaman kuesioner: Visual, Auditori, Kinestetik */
const TOTAL_STEPS = 3;

/**
 * Mengelola state navigasi form multi-langkah.
 * Step 0 = Identitas diri
 * Step 1–3 = Halaman kuesioner (Visual, Auditori, Kinestetik)
 */
export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const progressPercentage = currentStep > 0 ? (currentStep / TOTAL_STEPS) * 100 : 0;
  const isLastStep = currentStep === TOTAL_STEPS;

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const resetStep = () => setCurrentStep(0);

  return { currentStep, progressPercentage, isLastStep, TOTAL_STEPS, goNext, goPrev, resetStep };
}
