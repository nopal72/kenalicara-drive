import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

/**
 * Step 1–3 – Menampilkan 5 pertanyaan per sesi dengan skala rating 1–5.
 *
 * @param {{
 *   questions: object[],
 *   currentStep: number,
 *   totalSteps: number,
 *   progressPercentage: number,
 *   register: Function,
 *   errors: object,
 *   watch: Function,
 *   onNext: Function,
 *   onPrev: Function,
 *   isLastStep: boolean,
 *   isSubmitting: boolean,
 * }} props
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
  const CategoryIcon = questions[0]?.icon;
  const categoryName = questions[0]?.category ?? "";

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onPrev}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-900">Learning Style Discovery</h1>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-gray-500">
            Session {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-gray-100" />
      </div>

      {/* Category badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
        {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
        {categoryName}
      </div>

      {/* Questions */}
      <div className="space-y-12">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-8 leading-tight">
              {question.label}
            </h2>

            <div className="bg-white border border-gray-100 shadow-sm p-5 sm:p-8 rounded-2xl">
              <div className="flex justify-between text-xs font-bold text-gray-400 tracking-widest mb-6">
                <span>DISAGREE</span>
                <span>AGREE</span>
              </div>

              <div className="flex justify-between items-center gap-1 sm:gap-4">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isSelected = watch(question.id) === String(value);
                  return (
                    <label key={value} className="relative cursor-pointer group">
                      <input
                        type="radio"
                        value={value}
                        {...register(question.id, { required: "Silakan pilih salah satu jawaban" })}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 text-base sm:text-xl font-medium transition-all duration-200
                          ${
                            isSelected
                              ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-110"
                              : "border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 group-hover:text-blue-500"
                          }`}
                      >
                        {value}
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-4 text-center font-medium animate-pulse">
                  {errors[question.id].message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100"
        >
          Previous
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200 transform hover:-translate-y-0.5"
          >
            Next
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-green-200 transform hover:-translate-y-0.5 ${
              isSubmitting ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Results"}
          </button>
        )}
      </div>
    </div>
  );
}
