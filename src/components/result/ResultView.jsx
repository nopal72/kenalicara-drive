import { useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { Eye, Smartphone, Hand, User, GraduationCap, Printer, RotateCcw } from "lucide-react";
import { LEARNING_RECOMMENDATIONS } from "../../data/recommendations";

export const LABEL_MAP = ["Visual", "Auditori", "Kinestetik"];

const CONFIG = {
  Visual: {
    icon: Eye,
    titleColor: "text-[#0ea5e9]",
    fillBg: "bg-[#0ea5e9]",
    barBg: "bg-[#e0f2fe]",
    textColor: "text-white",
    theme: "blue",
  },
  Auditori: {
    icon: Smartphone,
    titleColor: "text-[#3b82f6]",
    fillBg: "bg-[#3b82f6]",
    barBg: "bg-[#e0f2fe]",
    textColor: "text-white",
    theme: "blue",
  },
  Kinestetik: {
    icon: Hand,
    titleColor: "text-[#ea580c]",
    fillBg: "bg-[#ea580c]",
    barBg: "bg-[#ffedd5]",
    textColor: "text-white",
    theme: "orange",
  },
};

function buildStyleList(predictionResult) {
  return LABEL_MAP.map((label) => {
    const prob = predictionResult.all_probabilities
      ? predictionResult.all_probabilities[label]
      : label === predictionResult.result
        ? parseFloat(predictionResult.percentage) / 100
        : 0;
    return {
      label,
      probability: prob ?? 0,
      percentage: ((prob ?? 0) * 100).toFixed(0),
    };
  });
}

export function ResultView({ predictionResult, studentData, onReset }) {
  const contentRef = useRef(null);
  const allStyles = buildStyleList(predictionResult);
  const dominant = allStyles.find((s) => s.label === predictionResult.result);
  const cfg = CONFIG[dominant?.label] ?? CONFIG.Visual;
  const rec = LEARNING_RECOMMENDATIONS[dominant?.label];

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;

    try {
      setIsDownloading(true);
      const filename = studentData?.nama
        ? `Laporan_Gaya_Belajar_${studentData.nama.replace(/\s+/g, "_")}.pdf`
        : "Laporan_Gaya_Belajar.pdf";

      await new Promise((resolve) => setTimeout(resolve, 300));
      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      // If document needs multiple pages, jsPDF standard usage with addImage doesn't auto-split.
      // But creating a long custom PDF is acceptable for now.
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // Adjust page size to fit the whole image
        pdf.internal.pageSize.setHeight(pdfHeight);
      }

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-3 sm:p-8 font-sans">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm w-full max-w-5xl p-3 sm:p-10 md:p-12 relative border border-gray-100">

        {/* Konten yang akan diunduh sebagai PDF */}
        <div ref={contentRef} className="bg-white p-3 sm:p-4">

          {/* SECTION 1: HASIL KLASIFIKASI */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-10">
            <div className="flex-1 w-full text-center md:text-left">
              <p className="text-gray-900 font-bold mb-4 text-sm sm:text-base leading-snug">
                Selamat hasil tes gaya belajarmu sudah<br className="hidden sm:block" /> keluar
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-black leading-[1.1] text-black mb-1 tracking-tight">
                Gaya Belajar<br className="hidden sm:block" /> Dominan:
              </h1>
              <h2 className={`text-4xl sm:text-6xl md:text-[5rem] font-black tracking-tight ${cfg.titleColor}`}>
                {dominant?.label}
              </h2>
            </div>
            <div className="flex-1 w-full flex justify-center md:justify-end">
              <div className="w-full max-w-sm aspect-[4/3] bg-gray-50 flex items-center justify-center rounded-2xl overflow-hidden">
                <img
                  src={rec?.imageUrl}
                  alt="Ilustrasi Pembelajaran"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-10 text-left">
            <h3 className="text-lg font-bold text-black mb-2">
              Apa Artinya Menjadi Pembelajar {dominant?.label}?
            </h3>
            <p className="text-[15px] sm:text-base text-gray-800 leading-relaxed max-w-4xl">
              {rec?.description || "Deskripsi tidak tersedia."}
            </p>
          </div>

          <div className="mb-6 text-left">
            <h3 className="text-lg font-bold text-black mb-4">
              Probabilitas Gaya Belajar:
            </h3>
            <div className="space-y-4 max-w-4xl">
              {allStyles.map((s) => {
                const barCfg = CONFIG[s.label];
                const Icon = barCfg.icon;
                return (
                  <div key={s.label} className={`relative w-full rounded-full h-11 ${barCfg.barBg} overflow-hidden`}>
                    <div
                      className={`absolute top-0 left-0 h-full ${barCfg.fillBg} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.max(s.percentage, 15)}%` }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center px-4 sm:px-5">
                      <Icon className={`w-[18px] h-[18px] mr-3 ${barCfg.textColor}`} strokeWidth={2.5} />
                      <span className={`text-[14px] sm:text-[15px] font-bold ${barCfg.textColor}`}>
                        {s.label} ({s.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="my-10 border-gray-200 border-2" />

          {/* SECTION 2: STRATEGI PEMBELAJARAN */}
          <div className="mt-10 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-6 sm:mb-8 text-center md:text-left tracking-tight">
              Strategi Pembelajaran
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Strategi Siswa */}
              <div className="bg-[#f0f9ff] rounded-[24px] sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-sky-100 h-full">
                <h3 className="text-lg sm:text-xl font-bold text-[#0369a1] mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="p-2 sm:p-2.5 bg-sky-100 rounded-xl text-[#0ea5e9]">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </span>
                  Bagi Siswa
                </h3>
                <div className="space-y-5">
                  <div className="bg-white rounded-[16px] sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-sky-50 transition-shadow hover:shadow-md">
                    <ul className="space-y-3 sm:space-y-4">
                      {rec?.studentStrategies?.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 text-[13px] sm:text-[15px] text-gray-700">
                          <span className="text-[#0ea5e9] mt-[2px] text-[16px] sm:text-lg leading-none">•</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Strategi Guru */}
              <div className="bg-[#fff7ed] rounded-[24px] sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-orange-100 h-full">
                <h3 className="text-lg sm:text-xl font-bold text-[#c2410c] mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="p-2 sm:p-2.5 bg-orange-100 rounded-xl text-[#ea580c]">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </span>
                  Bagi Guru
                </h3>
                <div className="space-y-5">
                  <div className="bg-white rounded-[16px] sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-orange-50 transition-shadow hover:shadow-md">
                    <ul className="space-y-3 sm:space-y-4">
                      {rec?.teacherStrategies?.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 text-[13px] sm:text-[15px] text-gray-700">
                          <span className="text-[#ea580c] mt-[2px] text-[16px] sm:text-lg leading-none">•</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-12 bg-white pt-2 sm:pt-4 pb-2">
          <button
            onClick={onReset}
            className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-gray-700 font-bold text-[15px] sm:text-[17px] transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Isi Formulir Lagi
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-[#0284c7] hover:bg-sky-700 text-white font-bold text-[15px] sm:text-[17px] transition-colors shadow-sm ${isDownloading ? "opacity-70 cursor-wait" : ""
              }`}
          >
            <Printer className="w-5 h-5" />
            {isDownloading ? "Memproses..." : "Cetak"}
          </button>
        </div>
      </div>
    </div>
  );
}
