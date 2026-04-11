import { EmojiAngry, EmojiFrown, EmojiNeutral, EmojiSmile, EmojiGrin } from "@/assets/emoji.jsx";
import { Info, ArrowRight } from "lucide-react";

const GUIDELINE_SCALES = [
  { value: 1, label: "Sangat Tidak Sesuai", Emoji: EmojiAngry },
  { value: 2, label: "Tidak Sesuai", Emoji: EmojiFrown },
  { value: 3, label: "Netral", Emoji: EmojiNeutral },
  { value: 4, label: "Sesuai", Emoji: EmojiSmile },
  { value: 5, label: "Sangat Sesuai", Emoji: EmojiGrin },
];

export function GuidelineStep({ onNext }) {
  return (
    <div className="bg-white shadow-xl shadow-slate-200/40 rounded-[24px] p-6 sm:p-10 border border-slate-100 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
        <Info className="w-8 h-8" />
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">Petunjuk Pengisian Kuesioner</h1>
      
      <div className="space-y-5 mb-10 w-full max-w-xl">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            1
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
            Lengkapi <strong>Data Diri</strong> Anda terlebih dahulu dengan benar.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            2
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
            Kuesioner ini dirancang untuk mengetahui <strong>Gaya Belajar</strong> dominan Anda. Tidak ada jawaban yang benar atau salah, jawablah secara jujur sesuai dengan kebiasaan belajar Anda sehari-hari.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            3
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
            Pada tahap selanjutnya, pilih salah satu <strong>emoji</strong> yang paling menggambarkan tingkat kesesuaian pernyataan dengan diri Anda berdasarkan skala berikut:
          </p>
        </div>
      </div>

      {/* Skala Emoji */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-10">
        {GUIDELINE_SCALES.map(({ value, label, Emoji }) => (
          <div key={value} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <Emoji className="w-12 h-12 drop-shadow-sm scale-110" />
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full border-t border-slate-100 pt-8">
        <button
          type="button"
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
        >
          Lanjut ke Data Diri
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
