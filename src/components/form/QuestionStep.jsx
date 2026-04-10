import { ArrowLeft, ArrowRight } from "lucide-react";
import { SCALE_EMOJIS, SCALE_LABELS } from "@/assets/emoji.jsx";

/**
 * Step 1–3 – Menampilkan 5 pertanyaan per sesi dengan skala emoji 1–5.
 *
 * Mobile  : pertanyaan stacked vertikal, label skala per pertanyaan.
 * Desktop : dua kolom — teks kiri, 5 emoji kanan — label skala tampil
 *           sekali sebagai header pills di atas kolom emoji.
 */
export function QuestionStep({
  questions,
  currentStep,
  totalSteps,
  progressPercentage,
  register,
  errors,
  watch,
  onNext,
  onPrev,
  isLastStep,
  isSubmitting,
}) {
  /** Shared emoji radio per value. */
  const EmojiOption = ({ question, value }) => {
    const isSelected = watch(question.id) === String(value);
    const EmojiIcon = SCALE_EMOJIS[value];
    return (
      <label className="cursor-pointer group" title={SCALE_LABELS[value]}>
        <input
          type="radio"
          value={value}
          {...register(question.id, { required: "Silakan pilih salah satu jawaban" })}
          className="sr-only"
        />
        <EmojiIcon
          className={`transition-all duration-200 select-none ${isSelected ? "w-10 h-10 sm:w-10 sm:h-10 drop-shadow-lg scale-110" : "w-10 h-10 sm:w-10 sm:h-10 grayscale brightness-75 opacity-60 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-90 group-hover:scale-105"}`}
        />
      </label>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">

      {/* ── Top navigation row ── */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={onPrev}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex-1">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400 tabular-nums shrink-0">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* ── Session title & instruction ── */}
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Sesi Kuesioner {currentStep}
      </h1>
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        Bacalah setiap pernyataan dan pilih emoji yang paling menggambarkan dirimu.
      </p>

      <div className="space-y-8 sm:space-y-0">
        {/* Scale label header row (Desktop only) */}
        <div className="hidden sm:grid items-center mb-3 sm:grid-cols-[1fr_300px]">
          <div /> {/* spacer for question column */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              Sangat Tidak Sesuai
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white">
              Sangat Sesuai
            </span>
          </div>
        </div>

        {/* Question rows */}
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="flex flex-col sm:grid sm:items-center py-0 sm:py-4 border-b-0 sm:border-b sm:border-slate-100 last:border-b-0 sm:grid-cols-[1fr_300px] mb-8 sm:mb-0"
          >
            {/* Question text */}
            <p className="font-bold text-slate-800 text-base leading-snug mb-4 sm:mb-0 sm:pr-8">
              {index + 1}.&nbsp;&nbsp;{question.label}
            </p>

            {/* Mobile Scale labels (Hidden on Desktop) */}
            <div className="flex justify-between text-xs text-slate-400 mb-2 px-1 sm:hidden">
              <span>Sangat Tidak Sesuai</span>
              <span>Sangat Sesuai</span>
            </div>

            {/* 5 emoji inputs */}
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <EmojiOption key={value} question={question} value={value} />
              ))}
            </div>

            {/* Error — spans full width on desktop */}
            {errors[question.id] && (
              <p className="sm:col-span-2 text-red-500 text-xs mt-2 sm:mt-1 font-medium">
                {errors[question.id].message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Navigation footer ── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Kembali
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm ${isSubmitting ? "opacity-70 cursor-wait" : ""
              }`}
          >
            {isSubmitting ? "Menyimpan..." : "Kirim Hasil"}
          </button>
        )}
      </div>
    </div>
  );
}
