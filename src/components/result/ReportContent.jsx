import { Eye, Smartphone, Hand, User, GraduationCap } from "lucide-react";
import { CONFIG } from "./resultUtils";

export const ReportContent = ({ dominant, rec, cfg, allStyles, studentData, isPrintMode }) => {
  return (
    <div className={`bg-white ${isPrintMode ? "p-12 text-black w-[1024px]" : "p-0 sm:p-4"}`}>
      
      {/* IDENTITAS SISWA & TANGGAL */}
      {(isPrintMode || studentData) && (
        <div className={`flex justify-between border-b-2 border-gray-100 ${isPrintMode ? "items-end mb-10 pb-6" : "flex-col sm:flex-row items-start sm:items-end mb-8 pb-4 gap-4"}`}>
          <div>
            <p className={`font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ${isPrintMode ? "text-sm mb-2" : "text-[11px] sm:text-xs mb-1.5"}`}>
              <GraduationCap className={isPrintMode ? "w-5 h-5" : "w-4 h-4"} /> Laporan Hasil Tes Gaya Belajar
            </p>
            <h3 className={`font-black text-gray-900 ${isPrintMode ? "text-3xl" : "text-xl sm:text-2xl"}`}>
              {studentData?.nama || "Nama Siswa"}
            </h3>
            <div className={`flex flex-wrap items-center gap-2 sm:gap-3 font-medium text-gray-600 ${isPrintMode ? "mt-3 text-base" : "mt-2 text-sm"}`}>
              {studentData?.kelas && (
                <span className="flex items-center gap-1.5">
                  <User className={isPrintMode ? "w-5 h-5 text-gray-400" : "w-4 h-4 text-gray-400"} /> Kelas: {studentData.kelas}
                </span>
              )}
              {studentData?.kelas && studentData?.no_absen && <span className="text-gray-300">•</span>}
              {studentData?.no_absen && <span>No. Absen: {studentData.no_absen}</span>}
              {studentData?.email && <span className="text-gray-300">•</span>}
              {studentData?.email && <span>{studentData.email}</span>}
            </div>
          </div>
          <div className={`text-left sm:text-right w-full sm:w-auto ${isPrintMode ? "text-right" : ""}`}>
            <p className={`font-bold text-gray-400 uppercase tracking-widest ${isPrintMode ? "text-sm mb-1.5" : "text-[11px] sm:text-xs mb-1"}`}>Tanggal Pengisian</p>
            <p className={`font-bold text-gray-800 ${isPrintMode ? "text-xl" : "text-base"}`}>
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: HASIL KLASIFIKASI */}
      <div className={`flex items-center gap-8 ${isPrintMode ? "flex-row mb-12" : "flex-col md:flex-row md:gap-12 mb-10"}`}>
        <div className={`flex-1 w-full ${isPrintMode ? "text-left" : "text-center md:text-left"}`}>
          <p className={`text-gray-900 font-bold leading-snug ${isPrintMode ? "mb-5 text-lg" : "mb-4 text-sm sm:text-base"}`}>
            Selamat hasil tes gaya belajarmu sudah<br className={isPrintMode ? "" : "hidden sm:block"} /> keluar
          </p>
          <h1 className={`font-black leading-[1.1] text-black mb-1 tracking-tight ${isPrintMode ? "text-[4.5rem]" : "text-4xl sm:text-6xl md:text-[5rem]"}`}>
            Gaya Belajar<br className={isPrintMode ? "" : "hidden sm:block"} /> Dominan:
          </h1>
          <h2 className={`font-black tracking-tight ${cfg.titleColor} ${isPrintMode ? "text-[4.5rem]" : "text-4xl sm:text-6xl md:text-[5rem]"}`}>
            {dominant?.label}
          </h2>
        </div>
        <div className={`flex-1 w-full flex ${isPrintMode ? "justify-end" : "justify-center md:justify-end"}`}>
          <div className="w-full max-w-sm aspect-[4/3] bg-gray-50 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner border border-gray-100">
            <img
              src="https://placehold.co/600x450/f8fafc/94a3b8?font=montserrat&text=Gambar+Dummy\n(Tunggu+Aset+Asli)"
              alt="Ilustrasi Pembelajaran"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-10 text-left">
        <h3 className={`font-bold text-black ${isPrintMode ? "text-xl mb-3" : "text-lg mb-2"}`}>
          Apa Artinya Menjadi Pembelajar {dominant?.label}?
        </h3>
        <p className={`text-gray-800 leading-relaxed max-w-4xl ${isPrintMode ? "text-[17px]" : "text-[15px] sm:text-base"}`}>
          {rec?.description || "Deskripsi tidak tersedia."}
        </p>
      </div>

      <div className={`${isPrintMode ? "mb-10" : "mb-6"} text-left`}>
        <h3 className={`font-bold text-black ${isPrintMode ? "text-xl mb-5" : "text-lg mb-4"}`}>
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
                <div className={`absolute top-0 left-0 w-full h-full flex items-center ${isPrintMode ? "px-6" : "px-4 sm:px-5"}`}>
                  <Icon className={`w-[18px] h-[18px] mr-3 ${barCfg.textColor}`} strokeWidth={2.5} />
                  <span className={`font-bold ${barCfg.textColor} ${isPrintMode ? "text-base" : "text-[14px] sm:text-[15px]"}`}>
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
      <div className={`${isPrintMode ? "mt-12" : "mt-10"} text-left`}>
        <h2 className={`font-black text-black tracking-tight ${isPrintMode ? "text-3xl mb-8" : "text-2xl sm:text-3xl mb-6 sm:mb-8 text-center md:text-left"}`}>
          Strategi Pembelajaran
        </h2>

        <div className={`grid gap-6 sm:gap-8 ${isPrintMode ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"}`}>
          {/* Strategi Siswa */}
          <div className={`bg-[#f0f9ff] border border-sky-100 h-full ${isPrintMode ? "rounded-[32px] p-8" : "rounded-[24px] sm:rounded-3xl p-5 sm:p-6 md:p-8"}`}>
            <h3 className={`font-bold text-[#0369a1] flex items-center gap-3 ${isPrintMode ? "text-xl mb-6" : "text-lg sm:text-xl mb-5 sm:mb-6"}`}>
              <span className={`bg-sky-100 rounded-xl text-[#0ea5e9] ${isPrintMode ? "p-3" : "p-2 sm:p-2.5"}`}>
                <User className={isPrintMode ? "w-6 h-6" : "w-5 h-5 sm:w-6 sm:h-6"} strokeWidth={2.5} />
              </span>
              Bagi Siswa
            </h3>
            <div className="space-y-5">
              <div className={`bg-white shadow-sm border border-sky-50 ${isPrintMode ? "rounded-3xl p-6" : "rounded-[16px] sm:rounded-2xl p-4 sm:p-6"}`}>
                <ul className={isPrintMode ? "space-y-4" : "space-y-3 sm:space-y-4"}>
                  {rec?.studentStrategies?.map((tip, idx) => (
                    <li key={idx} className={`flex items-start text-gray-700 ${isPrintMode ? "gap-3 text-base" : "gap-2 sm:gap-3 text-[13px] sm:text-[15px]"}`}>
                      <span className={`text-[#0ea5e9] mt-[2px] leading-none ${isPrintMode ? "text-xl" : "text-[16px] sm:text-lg"}`}>•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Strategi Guru */}
          <div className={`bg-[#fff7ed] border border-orange-100 h-full ${isPrintMode ? "rounded-[32px] p-8" : "rounded-[24px] sm:rounded-3xl p-5 sm:p-6 md:p-8"}`}>
            <h3 className={`font-bold text-[#c2410c] flex items-center gap-3 ${isPrintMode ? "text-xl mb-6" : "text-lg sm:text-xl mb-5 sm:mb-6"}`}>
              <span className={`bg-orange-100 rounded-xl text-[#ea580c] ${isPrintMode ? "p-3" : "p-2 sm:p-2.5"}`}>
                <GraduationCap className={isPrintMode ? "w-6 h-6" : "w-5 h-5 sm:w-6 sm:h-6"} strokeWidth={2.5} />
              </span>
              Bagi Guru
            </h3>
            <div className="space-y-5">
              <div className={`bg-white shadow-sm border border-orange-50 ${isPrintMode ? "rounded-3xl p-6" : "rounded-[16px] sm:rounded-2xl p-4 sm:p-6"}`}>
                <ul className={isPrintMode ? "space-y-4" : "space-y-3 sm:space-y-4"}>
                  {rec?.teacherStrategies?.map((tip, idx) => (
                    <li key={idx} className={`flex items-start text-gray-700 ${isPrintMode ? "gap-3 text-base" : "gap-2 sm:gap-3 text-[13px] sm:text-[15px]"}`}>
                      <span className={`text-[#ea580c] mt-[2px] leading-none ${isPrintMode ? "text-xl" : "text-[16px] sm:text-lg"}`}>•</span>
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
  );
};
