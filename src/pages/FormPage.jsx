import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { submitForm } from "../server/gas";

export default function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const questions = [
    { id: "a1", label: "Ketika guru memberi tahu saya instruksi, saya mengerti dengan lebih baik." },
    { id: "a2", label: "Ketika seseorang menjelaskan cara melakukan sesuatu di kelas, saya lebih mudah memahaminya." },
    { id: "a3", label: "Saya lebih mengingat hal-hal yang saya dengar di kelas daripada hal-hal yang saya baca." },
    { id: "a4", label: "Saya belajar lebih baik di kelas ketika guru memberikan ceramah." },
    { id: "a5", label: "Saya belajar lebih baik di kelas ketika mendengarkan seseorang." },
    { id: "v1", label: "Saya belajar lebih baik dengan membaca apa yang ditulis guru di papan tulis." },
    { id: "v2", label: "Ketika saya membaca petunjuk, saya lebih mudah mengingatnya." },
    { id: "v3", label: "Saya lebih memahami ketika membaca petunjuk." },
    { id: "v4", label: "Saya lebih mudah mengingat sesuatu jika saya menuliskannya kembali." },
    { id: "v5", label: "Saya lebih suka membaca buku daripada mendengarkan cerita." },
    { id: "k1", label: "Saya lebih suka belajar dengan melakukan sesuatu di kelas." },
    { id: "k2", label: "Ketika saya melakukan hal-hal di kelas, saya belajar dengan lebih baik." },
    { id: "k3", label: "Saya senang belajar di kelas dengan melakukan eksperimen." },
    { id: "k4", label: "Saya lebih memahami materi di kelas ketika saya ikut serta dalam peran-peran." },
    { id: "k5", label: "Saya belajar paling baik di kelas ketika saya dapat berpartisipasi dalam kegiatan yang terkait." },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const responseString = await submitForm(data);
      const response = JSON.parse(responseString); 
      console.log("Response dari Server:", response);

      if (response.status === 'success' && response.prediction) {
        setPredictionResult(response.prediction); 
      } else {
        throw new Error(response.message || "Gagal mendapatkan hasil prediksi.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setPredictionResult(null); // Sembunyikan kartu hasil
    reset(); // Kosongkan semua field form
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {predictionResult ? (
          <div className="bg-white shadow-md rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4 text-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Hasil Prediksi Gaya Belajar</h1>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-6 rounded-lg">
              <p className="text-lg">Gaya belajar dominan Anda adalah:</p>
              <p className="text-3xl font-extrabold my-2">{predictionResult.result}</p>
              <p className="text-sm">Tingkat keyakinan: <strong>{predictionResult.percentage}%</strong></p>
            </div>
            <p className="text-gray-600 mb-6">Terima kasih telah mengisi kuesioner. Anda dapat mengisi kembali untuk siswa lain.</p>
            <button
              onClick={handleResetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
            >
              Isi Formulir Lagi
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Formulir Data & Kuesioner Siswa
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Bagian Identitas Diri --- */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Identitas Diri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    {...register("nama", { required: "Nama wajib diisi" })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.nama ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Nama Lengkap"
                  />
                  {errors.nama && <p className="text-red-500 text-xs italic mt-1">{errors.nama.message}</p>}
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kelas
                  </label>
                  <input
                    {...register("kelas", { required: "Kelas wajib diisi" })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.kelas ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Contoh: XII IPA 1"
                  />
                  {errors.kelas && <p className="text-red-500 text-xs italic mt-1">{errors.kelas.message}</p>}
                </div>

                {/* Nomor Absen */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nomor Absen
                  </label>
                  <input
                    {...register("no_absen", { required: "Nomor absen wajib diisi" })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.no_absen ? "border-red-500" : ""}`}
                    type="number"
                    placeholder="Nomor Absen"
                  />
                  {errors.no_absen && <p className="text-red-500 text-xs italic mt-1">{errors.no_absen.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    {...register("email", { 
                      required: "Email wajib diisi",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Format email tidak valid"
                      }
                    })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
                    type="email"
                    placeholder="email@sekolah.sch.id"
                  />
                  {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* --- Bagian Kuesioner --- */}
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Kuesioner (Skala 1-5)
              </h2>
              <p className="text-sm text-gray-600 italic bg-blue-50 p-2 rounded">
                Keterangan: 1 = Sangat Tidak Setuju, 5 = Sangat Setuju
              </p>

              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="font-medium text-gray-800 mb-3">
                    {index + 1}. {q.label}
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="inline-flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded transition">
                        <input
                          type="radio"
                          value={value}
                          {...register(q.id, { required: "Pilih salah satu" })}
                          className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-gray-700 font-medium">{value}</span>
                      </label>
                    ))}
                  </div>
                  {errors[q.id] && <p className="text-red-500 text-xs italic mt-1">{errors[q.id].message}</p>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end mt-6 pt-4 border-t">
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 w-full md:w-auto ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
              </button>
            </div>
          </form>
          </div>
        )}
        </div>
      </div>
  );
}