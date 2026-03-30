import { Brain, Sparkles } from "lucide-react";

const LOADING_TEXTS = [
  "Menganalisis jawaban Anda...",
  "Menghubungkan dengan database pintar...",
  "Mengidentifikasi pola belajar...",
  "Sedikit lagi selesai...",
  "Hampir siap...",
];

/**
 * Overlay fullscreen yang ditampilkan saat form sedang diproses.
 * @param {{ textIndex: number }} props
 */
export function LoadingOverlay({ textIndex }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center max-w-sm w-[90%] mx-auto text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8 mt-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 animate-pulse" />
            <div className="bg-blue-600 text-white p-4 rounded-full relative shadow-lg">
              <Brain className="w-10 h-10 animate-bounce" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Memproses Data</h3>

          <div className="h-6 mb-6">
            <p className="text-blue-600 font-medium text-sm">{LOADING_TEXTS[textIndex]}</p>
          </div>

          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
