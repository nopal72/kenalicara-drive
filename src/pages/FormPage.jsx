import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { submitForm } from "../server/gas";
import { ArrowLeft, Eye, Headphones, Activity, Loader2, Sparkles, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "Menganalisis jawaban Anda...",
    "Menghubungkan dengan database pintar...",
    "Mengidentifikasi pola belajar...",
    "Sedikit lagi selesai...",
    "Hampir siap..."
  ];
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Identity, 1 = Visual, 2 = Auditory, 3 = Kinesthetic
  
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const visualQuestions = [
    { id: "v1", category: "Visual Learning", icon: Eye, label: "Saya belajar lebih baik dengan membaca apa yang ditulis guru di papan tulis.", desc: "Pikirkan apakah Anda mengandalkan tulisan atau gambar di kelas." },
    { id: "v2", category: "Visual Learning", icon: Eye, label: "Ketika saya membaca petunjuk, saya lebih mudah mengingatnya.", desc: "Apakah teks tertulis lebih membekas di ingatan Anda?" },
    { id: "v3", category: "Visual Learning", icon: Eye, label: "Saya lebih memahami ketika membaca petunjuk.", desc: "Seberapa penting membaca instruksi tertulis bagi Anda?" },
    { id: "v4", category: "Visual Learning", icon: Eye, label: "Saya lebih mudah mengingat sesuatu jika saya menuliskannya kembali.", desc: "Apakah mencatat membantu proses menghafal Anda?" },
    { id: "v5", category: "Visual Learning", icon: Eye, label: "Saya lebih suka membaca buku daripada mendengarkan cerita.", desc: "Bandingkan preferensi Anda antara buku teks dan penjelasan lisan." }
  ];

  const auditoryQuestions = [
    { id: "a1", category: "Auditory Learning", icon: Headphones, label: "Ketika guru memberi tahu saya instruksi, saya mengerti dengan lebih baik.", desc: "Pikirkan bagaimana Anda belajar dari instruksi lisan di kelas." },
    { id: "a2", category: "Auditory Learning", icon: Headphones, label: "Ketika seseorang menjelaskan cara melakukan sesuatu di kelas, saya lebih mudah memahaminya.", desc: "Seberapa penting penjelasan lisan bagi Anda?" },
    { id: "a3", category: "Auditory Learning", icon: Headphones, label: "Saya lebih mengingat hal-hal yang saya dengar di kelas daripada hal-hal yang saya baca.", desc: "Bandingkan ingatan Anda antara mendengar dan membaca." },
    { id: "a4", category: "Auditory Learning", icon: Headphones, label: "Saya belajar lebih baik di kelas ketika guru memberikan ceramah.", desc: "Apakah Anda lebih suka ceramah langsung dari guru?" },
    { id: "a5", category: "Auditory Learning", icon: Headphones, label: "Saya belajar lebih baik di kelas ketika mendengarkan seseorang.", desc: "Seberapa efektif mendengarkan bagi gaya belajar Anda?" }
  ];

  const kinestheticQuestions = [
    { id: "k1", category: "Kinesthetic Learning", icon: Activity, label: "Saya lebih suka belajar dengan melakukan sesuatu di kelas.", desc: "Apakah Anda lebih suka praktek langsung?" },
    { id: "k2", category: "Kinesthetic Learning", icon: Activity, label: "Ketika saya melakukan hal-hal di kelas, saya belajar dengan lebih baik.", desc: "Seberapa penting aktivitas fisik dalam proses belajar Anda?" },
    { id: "k3", category: "Kinesthetic Learning", icon: Activity, label: "Saya senang belajar di kelas dengan melakukan eksperimen.", desc: "Apakah mencoba langsung membuat meteri lebih mudah dipahami?" },
    { id: "k4", category: "Kinesthetic Learning", icon: Activity, label: "Saya lebih memahami materi di kelas ketika saya ikut serta dalam peran-peran.", desc: "Apakah bermain peran (role-play) membantu Anda?" },
    { id: "k5", category: "Kinesthetic Learning", icon: Activity, label: "Saya belajar paling baik di kelas ketika saya dapat berpartisipasi dalam kegiatan yang terkait.", desc: "Seberapa penting keterlibatan aktif Anda di kelas?" }
  ];

  const questionPages = [visualQuestions, auditoryQuestions, kinestheticQuestions];
  const totalSteps = questionPages.length;
  const progressPercentage = currentStep > 0 ? (currentStep / totalSteps) * 100 : 0;

  // Handle cycling loading texts
  React.useEffect(() => {
    let intervalId;
    if (isSubmitting) {
      intervalId = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2500); // Change text every 2.5 seconds
    } else {
      setLoadingTextIndex(0); // Reset when done
    }
    return () => clearInterval(intervalId);
  }, [isSubmitting, loadingTexts.length]);

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
    setPredictionResult(null);
    setCurrentStep(0);
    reset();
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const isIdentityValid = await trigger(["nama", "kelas", "no_absen", "email"]);
      if (isIdentityValid) setCurrentStep(1);
    } else if (currentStep <= totalSteps) {
      const currentQuestions = questionPages[currentStep - 1];
      const questionIds = currentQuestions.map(q => q.id);
      const isPageValid = await trigger(questionIds);
      if (isPageValid) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentQuestionsToRender = currentStep > 0 && currentStep <= totalSteps ? questionPages[currentStep - 1] : [];
  
  // Icon for category
  const IconComponent = currentQuestionsToRender.length > 0 ? currentQuestionsToRender[0].icon : null;
  const categoryName = currentQuestionsToRender.length > 0 ? currentQuestionsToRender[0].category : "";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl">
        {predictionResult ? (
          <div className="bg-white shadow-xl rounded-2xl px-6 sm:px-10 py-10 mb-4 text-center animate-fade-in">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Hasil Prediksi</h1>
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-6 my-6 rounded-xl shadow-sm">
              <p className="text-lg font-medium text-blue-600 mb-2">Gaya belajar dominan Anda adalah</p>
              <p className="text-4xl font-extrabold my-2 text-blue-700">{predictionResult.result}</p>
              <p className="text-sm mt-4 text-blue-600/80">Tingkat keyakinan: <span className="font-bold">{predictionResult.percentage}%</span></p>
            </div>
            <p className="text-gray-500 mb-8">Terima kasih telah mengisi kuesioner. Anda dapat mengisi kembali untuk siswa lain.</p>
            <button
              onClick={handleResetForm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              Isi Formulir Lagi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* --- STEP 0: Identitas Diri --- */}
            {currentStep === 0 && (
              <div className="bg-white shadow-xl rounded-2xl p-8 mb-4 border border-gray-100">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Diri Siswa</h1>
                  <p className="text-gray-500">Lengkapi data diri Anda sebelum memulai kuesioner</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Nama Lengkap</label>
                    <input
                      {...register("nama", { required: "Nama wajib diisi" })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.nama ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"} outline-none transition-all bg-gray-50 focus:bg-white`}
                      type="text"
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.nama && <p className="text-red-500 text-sm mt-1.5">{errors.nama.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Kelas</label>
                    <input
                      {...register("kelas", { required: "Kelas wajib diisi" })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.kelas ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"} outline-none transition-all bg-gray-50 focus:bg-white`}
                      type="text"
                      placeholder="Contoh: XII IPA 1"
                    />
                    {errors.kelas && <p className="text-red-500 text-sm mt-1.5">{errors.kelas.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Nomor Absen</label>
                    <input
                      {...register("no_absen", { required: "Nomor absen wajib diisi" })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.no_absen ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"} outline-none transition-all bg-gray-50 focus:bg-white`}
                      type="number"
                      placeholder="Masukkan nomor absen"
                    />
                    {errors.no_absen && <p className="text-red-500 text-sm mt-1.5">{errors.no_absen.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <input
                      {...register("email", { 
                        required: "Email wajib diisi",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Format email tidak valid" }
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"} outline-none transition-all bg-gray-50 focus:bg-white`}
                      type="email"
                      placeholder="email@sekolah.sch.id"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                  >
                    Mulai Kuesioner
                  </button>
                </div>
              </div>
            )}

            {/* --- STEP 1-3: Kuesioner (5 Pertanyaan per halaman) --- */}
            {currentStep > 0 && currentStep <= totalSteps && (
              <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <button type="button" onClick={prevStep} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <h1 className="font-semibold text-gray-900">Learning Style Discovery</h1>
                  <div className="w-9"></div> {/* Placeholder to perfectly center title since Skip is removed */}
                </div>

                {/* Progress */}
                <div className="mb-10">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-medium text-gray-500">Session {currentStep} of {totalSteps}</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-gray-100" />
                </div>

                {/* Category Badge for Session */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {categoryName}
                </div>

                {/* Render All 5 Questions in This Session */}
                <div className="space-y-12">
                  {currentQuestionsToRender.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                      {/* Question Text */}
                      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-8 leading-tight">
                        {question.label}
                      </h2>

                      {/* Rating Scale */}
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
                                    ${isSelected 
                                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-110' 
                                      : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 group-hover:text-blue-500'}`}
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

                {/* Footer Nav */}
                <div className="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100"
                  >
                    Previous
                  </button>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200 transform hover:-translate-y-0.5"
                    >
                      Next
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-green-200 transform hover:-translate-y-0.5 ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Results"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* --- Catchy Fullscreen Loading Overlay --- */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center max-w-sm w-[90%] mx-auto text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-8 mt-4">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                <div className="bg-blue-600 text-white p-4 rounded-full relative shadow-lg">
                  <Brain className="w-10 h-10 animate-bounce" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Memproses Data</h3>
              
              <div className="h-6 mb-6">
                <p className="text-blue-600 font-medium animate-fade-in-up text-sm">
                  {loadingTexts[loadingTextIndex]}
                </p>
              </div>

              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}