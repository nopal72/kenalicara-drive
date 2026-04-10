import { useRef } from "react";
import { useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import {
  Eye, Headphones, Activity,
  BookOpen, PenLine, MonitorPlay,
  MessageCircle, Mic, Music,
  FlaskConical, Users, MoveRight,
  User, School, Hash,
  Printer, RotateCcw, Zap,
} from "lucide-react";
import { LEARNING_RECOMMENDATIONS } from "../../data/recommendations";

export const LABEL_MAP = ["Auditori", "Kinestetik", "Visual"];

const STYLE_CONFIG = {
  Auditori: {
    icon: Headphones,
    color: "#7c3aed",
    tw: {
      text: "text-purple-700",
      bgLight: "bg-purple-50",
      bgMid: "bg-purple-100",
      border: "border-purple-200",
      dot: "bg-purple-500",
      badge: "bg-purple-100 text-purple-800",
    },
    strategyIcons: [MessageCircle, Mic, Music],
  },
  Kinestetik: {
    icon: Activity,
    color: "#15803d",
    tw: {
      text: "text-green-700",
      bgLight: "bg-green-50",
      bgMid: "bg-green-100",
      border: "border-green-200",
      dot: "bg-green-500",
      badge: "bg-green-100 text-green-800",
    },
    strategyIcons: [FlaskConical, Users, MoveRight],
  },
  Visual: {
    icon: Eye,
    color: "#1d4ed8",
    tw: {
      text: "text-blue-700",
      bgLight: "bg-blue-50",
      bgMid: "bg-blue-100",
      border: "border-blue-200",
      dot: "bg-blue-500",
      badge: "bg-blue-100 text-blue-800",
    },
    strategyIcons: [BookOpen, PenLine, MonitorPlay],
  },
};

function buildStyleList(predictionResult) {
  return LABEL_MAP.map((label) => {
    const prob = predictionResult.all_probabilities
      ? predictionResult.all_probabilities[label]
      : label === predictionResult.result
        ? parseFloat(predictionResult.percentage) / 100
        : 0;
    return { label, probability: prob ?? 0, percentage: ((prob ?? 0) * 100).toFixed(1) };
  });
}

function ProbabilityBarChart({ styles }) {
  const BAR_H = 28;
  const GAP = 18;
  const LABEL_W = 82;
  const VALUE_W = 46;
  const BAR_MAX_W = 200;
  const svgW = LABEL_W + BAR_MAX_W + VALUE_W + 8;
  const svgH = styles.length * (BAR_H + GAP) - GAP + 8;
  const maxProb = Math.max(...styles.map((s) => s.probability));

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full max-w-xs sm:max-w-sm"
      aria-label="Probability bar chart"
    >
      {styles.map((s, i) => {
        const cfg = STYLE_CONFIG[s.label];
        const pct = parseFloat(s.percentage);
        const barW = Math.max(4, (pct / 100) * BAR_MAX_W);
        const y = i * (BAR_H + GAP);
        const isDominant = s.probability === maxProb;

        return (
          <g key={s.label}>
            <text
              x={LABEL_W - 8}
              y={y + BAR_H / 2 + 5}
              textAnchor="end"
              fontSize="10"
              fontWeight={isDominant ? "800" : "600"}
              fill={isDominant ? cfg.color : "#6b7280"}
              letterSpacing="0.5"
            >
              {s.label.toUpperCase()}
            </text>
            <rect x={LABEL_W} y={y} width={BAR_MAX_W} height={BAR_H} rx={BAR_H / 2} fill="#f3f4f6" />
            <rect x={LABEL_W} y={y} width={barW} height={BAR_H} rx={BAR_H / 2} fill={cfg.color} opacity={isDominant ? 1 : 0.45} />
            <text
              x={LABEL_W + BAR_MAX_W + 6}
              y={y + BAR_H / 2 + 5}
              fontSize="10"
              fontWeight={isDominant ? "800" : "600"}
              fill={isDominant ? cfg.color : "#9ca3af"}
            >
              {s.percentage}%
            </text>
            {isDominant && (
              <text x={LABEL_W + barW - 14} y={y + BAR_H / 2 + 5} fontSize="11" fill="white" fontWeight="900">
                ★
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function StrategyCard({ strategy, Icon, BgIcon, tw }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl ${tw.bgMid}`}>
          <Icon className={`w-5 h-5 ${tw.text}`} />
        </div>
        <BgIcon className="w-10 h-10 text-gray-100" />
      </div>
      <h3 className="font-black text-xs text-gray-800 uppercase tracking-wide leading-tight mb-3">
        {strategy.title}
      </h3>
      <div className={`${tw.bgMid} rounded-xl flex items-center justify-center py-5 mb-3`}>
        <Icon className={`w-14 h-14 ${tw.text} opacity-60`} />
      </div>
      <ul className="space-y-2 flex-1">
        {strategy.tips.map((tip, j) => (
          <li key={j} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${tw.dot}`} />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultView({ predictionResult, studentData, onReset }) {
  const contentRef = useRef(null);
  const allStyles = buildStyleList(predictionResult);
  const dominant = allStyles.find((s) => s.label === predictionResult.result);
  const cfg = STYLE_CONFIG[dominant?.label] ?? STYLE_CONFIG.Visual;
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

      // Allow DOM modifications or styling fixes before taking snapshot if needed
      await new Promise((resolve) => setTimeout(resolve, 300)); 

      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white font-sans">
      <div ref={contentRef} className="bg-gradient-to-b from-amber-50 via-white to-white">

        <div className="text-center pt-6 pb-4 px-6">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            <span className="text-blue-950">HASIL ANALISIS</span>
            <br />
            <span className="text-amber-500">GAYA BELAJAR</span>
          </h1>
        </div>

        {studentData && (
          <div className="flex justify-center px-4 mb-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 w-full max-w-xs">
              <div className={`w-14 h-14 rounded-full ${cfg.tw.bgMid} flex items-center justify-center flex-shrink-0`}>
                <User className={`w-8 h-8 ${cfg.tw.text}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Profil Siswa</p>
                <p className="text-sm font-black text-gray-900 uppercase leading-tight">{studentData.nama}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><School className="w-3 h-3" />{studentData.kelas}</span>
                  <span className="flex items-center gap-1"><Hash className="w-3 h-3" />No. Absen: {studentData.no_absen}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 max-w-2xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex flex-col items-start gap-3 flex-shrink-0 w-full sm:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Probabilitas Gaya Belajar</p>
              <ProbabilityBarChart styles={allStyles} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.tw.badge} mb-4`}>
                <Zap className="w-3 h-3" />
                Gaya Belajar Dominan
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-950 leading-tight mb-1">
                GAYA BELAJAR DOMINAN ANDA:
              </h2>
              <p className={`text-2xl sm:text-3xl font-black italic ${cfg.tw.text} mb-4`}>
                {dominant?.label.toUpperCase()}!
              </p>
              {rec && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  {rec.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {rec && (
          <div className="px-4 max-w-2xl mx-auto mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rec.strategies.map((strategy, i) => (
                <StrategyCard
                  key={i}
                  strategy={strategy}
                  Icon={cfg.strategyIcons[i] ?? cfg.icon}
                  BgIcon={cfg.strategyIcons[(i + 1) % cfg.strategyIcons.length] ?? cfg.icon}
                  tw={cfg.tw}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 px-4 max-w-2xl mx-auto py-6">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className={`flex-1 inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md ${isDownloading ? "opacity-70 cursor-wait" : "hover:-translate-y-0.5"}`}
        >
          <Printer className="w-5 h-5" />
          {isDownloading ? "Memproses PDF..." : "Unduh PDF"}
        </button>
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5"
        >
          <RotateCcw className="w-5 h-5" />
          Isi Formulir Lagi
        </button>
      </div>
    </div>
  );
}
