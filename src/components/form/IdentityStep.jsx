import { Info, ArrowLeft, ArrowRight } from "lucide-react";

/** @type {import("../../../data/questions").QuestionField[]} */
const IDENTITY_FIELDS = [
  {
    name: "nama",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukkan nama lengkap",
    rules: { required: "Nama wajib diisi" },
  },
  {
    name: "sekolah",
    label: "Asal Sekolah",
    type: "text",
    placeholder: "Masukkan asal sekolah",
    rules: { required: "Asal sekolah wajib diisi" },
  },
  {
    name: "kelas",
    label: "Kelas",
    type: "text",
    placeholder: "Contoh: XII IPA 1",
    rules: { required: "Kelas wajib diisi" },
  },
  {
    name: "no_absen",
    label: "Nomor Absen",
    type: "number",
    placeholder: "Masukkan nomor absen",
    rules: { required: "Nomor absen wajib diisi" },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "email@sekolah.sch.id",
    rules: {
      required: "Email wajib diisi",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Format email tidak valid",
      },
    },
  },
];

/**
 * Step 1 – Formulir identitas diri siswa.
 * @param {{ register: Function, errors: object, onNext: Function, onPrev: Function }} props
 */
export function IdentityStep({ register, errors, onNext, onPrev }) {
  return (
    <div className="bg-white shadow-lg shadow-slate-200/40 rounded-[24px] p-6 sm:p-8 border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Data Diri Siswa</h1>
        <p className="text-slate-500 text-sm">Lengkapi data diri Anda sebelum memulai kuesioner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {IDENTITY_FIELDS.map(({ name, label, type, placeholder, rules }) => (
          <div key={name} className={name === "nama" || name === "email" ? "md:col-span-2" : ""}>
            <label className="block text-slate-700 text-sm font-semibold mb-2">{label}</label>
            <input
              {...register(name, rules)}
              type={type}
              placeholder={placeholder}
              className={`w-full px-4 py-3.5 rounded-xl border text-sm ${
                errors[name]
                  ? "border-red-500 ring-1 ring-red-500 bg-red-50"
                  : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              } outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 bg-slate-50 focus:bg-white`}
            />
            {errors[name] && (
              <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {errors[name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
        >
          Mulai Kuesioner
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
