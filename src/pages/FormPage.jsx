/**
 * @file FormPage – Orkestrator utama form kuesioner gaya belajar.
 *
 * Bertanggung jawab atas:
 *   - State manajemen form (react-hook-form)
 *   - State navigasi antar step (useMultiStepForm)
 *   - Pemanggilan API GAS (submitForm)
 *   - State hasil prediksi & data identitas siswa
 *
 * Rendering detail setiap step didelegasikan ke komponen masing-masing:
 *   IdentityStep  – Step 0: data diri
 *   QuestionStep  – Step 1–3: kuesioner per kategori
 *   ResultView    – Halaman hasil prediksi + rekomendasi + tombol cetak PDF
 *   LoadingOverlay – Overlay saat form diproses
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { submitForm } from "../server/gas";
import { QUESTION_PAGES } from "../data/questions";
import { useMultiStepForm } from "../hooks/useMultiStepForm";

import { IdentityStep } from "../components/form/IdentityStep";
import { QuestionStep } from "../components/form/QuestionStep";
import { LoadingOverlay } from "../components/form/LoadingOverlay";
import { ResultView } from "../components/result/ResultView";

const LOADING_TEXT_COUNT = 5;

export default function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const { currentStep, progressPercentage, isLastStep, TOTAL_STEPS, goNext, goPrev, resetStep } =
    useMultiStepForm();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Siklus teks loading selama proses berlangsung
  React.useEffect(() => {
    if (!isSubmitting) {
      setLoadingTextIndex(0);
      return;
    }
    const id = setInterval(
      () => setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXT_COUNT),
      2500
    );
    return () => clearInterval(id);
  }, [isSubmitting]);

  /** Validasi field pada step saat ini sebelum melanjutkan. */
  const handleNextStep = async () => {
    if (currentStep === 0) {
      const valid = await trigger(["nama", "kelas", "no_absen", "email"]);
      if (valid) goNext();
    } else {
      const ids = QUESTION_PAGES[currentStep - 1].map((q) => q.id);
      const valid = await trigger(ids);
      if (valid) goNext();
    }
  };

  /** Submit form ke GAS, simpan hasil prediksi dan identitas siswa. */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const responseString = await submitForm(data);
      const response = JSON.parse(responseString);

      if (response.status === "success" && response.prediction) {
        setStudentData({ nama: data.nama, kelas: data.kelas, no_absen: data.no_absen });
        setPredictionResult(response.prediction);
      } else {
        throw new Error(response.message || "Gagal mendapatkan hasil prediksi.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Reset semua state ke kondisi awal untuk mengisi form siswa berikutnya. */
  const handleReset = () => {
    setPredictionResult(null);
    setStudentData(null);
    resetStep();
    reset();
  };

  return (
    <>
      {predictionResult ? (
        /* ResultView manages its own full-width layout */
        <ResultView
          predictionResult={predictionResult}
          studentData={studentData}
          onReset={handleReset}
        />
      ) : (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 font-sans">
          <div className="w-full max-w-lg sm:max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && (
                <IdentityStep register={register} errors={errors} onNext={handleNextStep} />
              )}

              {currentStep > 0 && currentStep <= TOTAL_STEPS && (
                <QuestionStep
                  questions={QUESTION_PAGES[currentStep - 1]}
                  currentStep={currentStep}
                  totalSteps={TOTAL_STEPS}
                  progressPercentage={progressPercentage}
                  register={register}
                  errors={errors}
                  watch={watch}
                  onNext={handleNextStep}
                  onPrev={goPrev}
                  isLastStep={isLastStep}
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </div>
        </div>
      )}

      {isSubmitting && <LoadingOverlay textIndex={loadingTextIndex} />}
    </>
  );

}