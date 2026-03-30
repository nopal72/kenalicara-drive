/**
 * @file ResultView – Halaman hasil klasifikasi gaya belajar.
 *
 * Desain mengacu pada template "Student Learning Style Report":
 *   - Header besar dengan gradient warm background
 *   - Student profile card (nama, kelas, no. absen)
 *   - SVG donut chart (vector, aman untuk print) + info gaya dominan
 *   - 3-column strategy cards dengan lucide icon sebagai ilustrasi
 *
 * Gambar/ilustrasi menggunakan lucide-react icons (SVG inline) karena:
 *   1) Tidak bergantung URL eksternal (aman untuk GAS)
 *   2) Vector — tercetak tajam di PDF
 *   3) Tidak menambah bundle size signifikan
 *
 * PRINT LAYOUT: 1 halaman A4
 *   Semua konten dicompact via print: Tailwind variants.
 *   @page rule di index.css mengatur margin A4.
 */

import {
  Eye, Headphones, Activity,
  BookOpen, PenLine, MonitorPlay,
  MessageCircle, Mic, Music,
  FlaskConical, Users, MoveRight,
  User, School, Hash,
  Printer, RotateCcw, Zap,
} from "lucide-react";
import { LEARNING_RECOMMENDATIONS } from "../../data/recommendations";

// ── Konfigurasi per gaya belajar ─────────────────────────────────────────────
/** Urutan index sesuai output model XGBoost: 0=Auditori, 1=Kinestetik, 2=Visual */
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildStyleList(predictionResult) {
  return LABEL_MAP.map((label, idx) => {
    const prob = predictionResult.all_probabilities
      ? predictionResult.all_probabilities[idx]
      : label === predictionResult.result
        ? parseFloat(predictionResult.percentage) / 100
        : 0;
    return { label, probability: prob, percentage: (prob * 100).toFixed(1) };
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * SVG donut chart murni — berbasis vektor sehingga tercetak tajam di PDF.
 * Tidak menggunakan recharts agar tidak ada isu hydration saat print.
 */
function DonutChart({ percentage, color, label }) {
  const r = 72;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min((percentage / 100) * circumference, circumference);
  return (
    <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-52 sm:h-52 print:w-32 print:h-32">
      {/* Track */}
      <circle cx="100" cy="100" r={r} fill="none" stroke="#e5e7eb" strokeWidth="20" />
      {/* Progress arc */}
      <circle
        cx="100" cy="100" r={r}
        fill="none"
        stroke={color}
        strokeWidth="20"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
      {/* Center text */}
      <text x="100" y="93" textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>
        {percentage}%
      </text>
      <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="600" fill="#9ca3af" letterSpacing="2">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

/** Satu card strategi belajar dengan icon ilustrasi dari lucide-react. */
function StrategyCard({ strategy, Icon, BgIcon, tw }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col print-avoid-break">
      {/* Top: active icon (kiri) + faded bg icon (kanan) */}
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl ${tw.bgMid}`}>
          <Icon className={`w-5 h-5 ${tw.text}`} />
        </div>
        <BgIcon className="w-10 h-10 text-gray-100" />
      </div>

      {/* Title */}
      <h3 className="font-black text-xs text-gray-800 uppercase tracking-wide leading-tight mb-3">
        {strategy.title}
      </h3>

      {/* Illustration area – lucide icon as visual placeholder */}
      <div className={`${tw.bgMid} rounded-xl flex items-center justify-center py-5 mb-3`}>
        <Icon className={`w-14 h-14 ${tw.text} opacity-60`} />
      </div>

      {/* Tips */}
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

// ── Main component ────────────────────────────────────────────────────────────
/**
 * @param {{
 *   predictionResult: { result: string, percentage: string, all_probabilities?: number[] },
 *   studentData: { nama: string, kelas: string, no_absen: string } | null,
 *   onReset: Function,
 * }} props
 */
export function ResultView({ predictionResult, studentData, onReset }) {
  const allStyles = buildStyleList(predictionResult);
  const dominant = allStyles.find((s) => s.label === predictionResult.result);
  const cfg = STYLE_CONFIG[dominant?.label] ?? STYLE_CONFIG.Visual;
  const rec = LEARNING_RECOMMENDATIONS[dominant?.label];

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white font-sans print:bg-white print:min-h-0">

      {/* ── Page title ─────────────────────────────────────────────────── */}
      <div className="text-center pt-6 pb-4 px-6 print:pt-4">
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
          <span className="text-blue-950">STUDENT </span>
          <span className="text-amber-500">LEARNING STYLE</span>
          <br />
          <span className="text-blue-950">REPORT</span>
        </h1>
      </div>

      {/* ── Student profile card ────────────────────────────────────────── */}
      {studentData && (
        <div className="flex justify-center px-4 mb-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 w-full max-w-xs">
            <div className={`w-14 h-14 rounded-full ${cfg.tw.bgMid} flex items-center justify-center flex-shrink-0`}>
              <User className={`w-8 h-8 ${cfg.tw.text}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Student Profile
              </p>
              <p className="text-sm font-black text-gray-900 uppercase leading-tight">
                {studentData.nama}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <School className="w-3 h-3" />{studentData.kelas}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />Roll Number: {studentData.no_absen}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Donut chart + Dominant style info ──────────────────────────── */}
      <div className="px-6 max-w-2xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">

          {/* Chart + legend */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            {dominant && (
              <>
                {/* Confidence badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.tw.badge}`}>
                  <span className="inline-block w-2 h-2 rounded-full bg-current" />
                  {dominant.percentage}% Confidence
                </div>

                <DonutChart
                  percentage={parseFloat(dominant.percentage)}
                  color={cfg.color}
                  label={dominant.label}
                />
              </>
            )}

            {/* Legend — semua gaya belajar */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {allStyles.map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${STYLE_CONFIG[s.label].tw.dot}`} />
                  {s.label.toUpperCase()} ({s.percentage}%)
                </span>
              ))}
            </div>
          </div>

          {/* Dominant info */}
          <div className="flex-1 text-center sm:text-left">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.tw.badge} mb-4`}>
              <Zap className="w-3 h-3" />
              Dominant Style
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 leading-tight mb-1">
              YOUR DOMINANT<br />LEARNING STYLE:
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

      {/* ── Strategy cards ──────────────────────────────────────────────── */}
      {rec && (
        <div className="px-4 max-w-2xl mx-auto mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            {rec.strategies.map((strategy, i) => {
              const Icon = cfg.strategyIcons[i] ?? cfg.icon;
              const BgIcon = cfg.strategyIcons[(i + 1) % cfg.strategyIcons.length] ?? cfg.icon;
              return (
                <StrategyCard
                  key={i}
                  strategy={strategy}
                  Icon={Icon}
                  BgIcon={BgIcon}
                  tw={cfg.tw}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action buttons — hidden on print ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 px-4 max-w-2xl mx-auto pb-8 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5"
        >
          <Printer className="w-5 h-5" />
          Cetak / Unduh PDF
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
