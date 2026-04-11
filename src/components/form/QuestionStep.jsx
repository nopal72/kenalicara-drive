import { ArrowLeft, ArrowRight } from "lucide-react";
import { EmojiAngry, EmojiFrown, EmojiNeutral, EmojiSmile, EmojiGrin } from "@/assets/emoji.jsx";

/** Ordered array of emoji components indexed by scale value (1-based). */
const SCALE_EMOJIS = [null, EmojiAngry, EmojiFrown, EmojiNeutral, EmojiSmile, EmojiGrin];

/** Label for each scale value. */
const SCALE_LABELS = ["", "Sangat Tidak Sesuai", "Tidak Sesuai", "Netral", "Sesuai", "Sangat Sesuai"];

export function QuestionStep({
  questions,
  currentStep,
  totalSteps,
  progressPercentage,
  register,
  errors,
  watch,
  onNext,
  onFinalSubmit,
  onPrev,
  isLastStep,
  isSubmitting,
}) {
  // Render helper to avoid full component remounting
  const renderEmojiOption = (question, value) => {
    const isSelected = watch(question.id) === String(value);
    const EmojiIcon = SCALE_EMOJIS[value];
    return (
      <label key={value} className="cursor-pointer group flex flex-col items-center flex-1" title={SCALE_LABELS[value]}>
        <input
          type="radio"
          value={value}
          {...register(question.id, { required: "Silakan pilih salah satu jawaban" })}
          className="sr-only"
        />
        <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 mb-1">
          <EmojiIcon
            className={`transition-all duration-200 select-none w-10 h-10 sm:w-11 sm:h-11 ${
              isSelected
                ? "drop-shadow-md opacity-100"
                : "grayscale opacity-30 group-hover:grayscale-[50%] group-hover:opacity-60"
            }`}
          />
        </div>
        <span
          className={`text-[9px] sm:text-[10px] font-bold text-center leading-tight max-w-[64px] ${
            isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
          }`}
        >
          {SCALE_LABELS[value]}
        </span>
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

        {/* Question rows */}
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="flex flex-col sm:grid sm:items-center py-0 sm:py-6 border-b-0 sm:border-b sm:border-slate-100 last:border-b-0 sm:grid-cols-[1fr_350px] mb-10 sm:mb-0"
          >
            {/* Question text */}
            <p className="font-bold text-slate-800 text-[15px] sm:text-base leading-snug mb-5 sm:mb-0 sm:pr-8">
              {index + 1}.&nbsp;&nbsp;{question.label}
            </p>

            {/* 5 emoji inputs */}
            <div className="flex justify-between items-start gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((value) => renderEmojiOption(question, value))}
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
            type="button"
            onClick={onFinalSubmit}
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
