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
 * Step 0 – Formulir identitas diri siswa.
 * @param {{ register: Function, errors: object, onNext: Function }} props
 */
export function IdentityStep({ register, errors, onNext }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mb-4 border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Diri Siswa</h1>
        <p className="text-gray-500">Lengkapi data diri Anda sebelum memulai kuesioner</p>
      </div>

      <div className="space-y-5">
        {IDENTITY_FIELDS.map(({ name, label, type, placeholder, rules }) => (
          <div key={name}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
              {...register(name, rules)}
              type={type}
              placeholder={placeholder}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors[name]
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              } outline-none transition-all bg-gray-50 focus:bg-white`}
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1.5">{errors[name].message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
        >
          Mulai Kuesioner
        </button>
      </div>
    </div>
  );
}
