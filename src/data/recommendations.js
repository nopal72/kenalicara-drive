/**
 * @file Konten rekomendasi belajar per gaya belajar.
 *
 * ⚠️  FILE INI BERISI KONTEN DUMMY.
 *     Ganti seluruh teks yang dimulai dengan "[DUMMY]" dengan konten yang sesungguhnya.
 *
 * Struktur tiap gaya belajar:
 *   description  – Paragraf pengantar tentang gaya belajar tersebut
 *   strategies   – Daftar kelompok strategi, masing-masing berisi:
 *       title    – Judul strategi (boleh pakai emoji)
 *       tips     – Array kiat/langkah konkret
 */

export const LEARNING_RECOMMENDATIONS = {
  // ── VISUAL ────────────────────────────────────────────────────────────────
  Visual: {
    description:
      "[DUMMY] Kamu adalah pelajar Visual! Kamu menyerap informasi paling efektif melalui indera penglihatan. Teks tertulis, diagram, grafik, dan visualisasi adalah kunci keberhasilan belajarmu.",
    strategies: [
      {
        title: "🗺️ Gunakan Mind Map & Diagram",
        tips: [
          "[DUMMY] Buat mind map untuk merangkum materi setelah selesai membaca",
          "[DUMMY] Gambar diagram alur untuk memahami proses atau urutan kejadian",
          "[DUMMY] Gunakan warna berbeda untuk setiap subtopik agar lebih mudah diingat",
        ],
      },
      {
        title: "🎨 Teknik Highlight & Color Coding",
        tips: [
          "[DUMMY] Tandai kata kunci dengan stabilo warna berbeda",
          "[DUMMY] Buat catatan ringkas menggunakan warna dan simbol visual",
          "[DUMMY] Tulis ulang materi penting dalam format tabel atau grafik",
        ],
      },
      {
        title: "📹 Manfaatkan Media Visual",
        tips: [
          "[DUMMY] Tonton video pembelajaran untuk materi yang sulit dipahami",
          "[DUMMY] Gunakan aplikasi mind mapping seperti Canva atau MindMeister",
          "[DUMMY] Buat flashcard bergambar untuk menghafal konsep penting",
        ],
      },
    ],
  },

  // ── AUDITORI ──────────────────────────────────────────────────────────────
  Auditori: {
    description:
      "[DUMMY] Kamu adalah pelajar Auditori! Pendengaran adalah kekuatan utamamu. Kamu belajar paling baik melalui penjelasan lisan, diskusi, dan pengulangan verbal.",
    strategies: [
      {
        title: "🎙️ Diskusi & Pengajaran Aktif",
        tips: [
          "[DUMMY] Ajari materi kepada teman sebayamu untuk memperkuat pemahaman",
          "[DUMMY] Ikuti diskusi kelompok dan aktif bertanya di kelas",
          "[DUMMY] Gunakan metode tanya-jawab saat belajar mandiri",
        ],
      },
      {
        title: "🎧 Rekam & Putar Ulang",
        tips: [
          "[DUMMY] Rekam penjelasan guru atau catatan kamu sendiri dengan suara",
          "[DUMMY] Dengarkan rekaman tersebut saat beristirahat atau bepergian",
          "[DUMMY] Baca materi pelajaran dengan suara nyaring untuk memperkuat ingatan",
        ],
      },
      {
        title: "🎶 Gunakan Musik & Ritme",
        tips: [
          "[DUMMY] Buat mnemonic atau jingle untuk menghafal rumus dan istilah",
          "[DUMMY] Dengarkan musik instrumental saat belajar untuk meningkatkan fokus",
          "[DUMMY] Hubungkan informasi baru dengan irama atau lagu yang sudah kamu kenal",
        ],
      },
    ],
  },

  // ── KINESTETIK ────────────────────────────────────────────────────────────
  Kinestetik: {
    description:
      "[DUMMY] Kamu adalah pelajar Kinestetik! Kamu belajar paling baik melalui gerakan, praktik langsung, dan pengalaman nyata. Keterlibatan fisik dan aktivitas adalah kunci suksesmu.",
    strategies: [
      {
        title: "🔬 Praktik & Eksperimen Langsung",
        tips: [
          "[DUMMY] Cari kesempatan praktik langsung untuk setiap materi teori",
          "[DUMMY] Buat proyek atau model fisik untuk memahami konsep abstrak",
          "[DUMMY] Ikuti kegiatan laboratorium atau simulasi dengan penuh antusias",
        ],
      },
      {
        title: "🎭 Role Play & Simulasi",
        tips: [
          "[DUMMY] Perankan karakter atau situasi yang sedang dipelajari bersama teman",
          "[DUMMY] Gunakan permainan edukatif atau kuis interaktif berbasis skenario",
          "[DUMMY] Ciptakan situasi nyata untuk menerapkan isi materi pelajaran",
        ],
      },
      {
        title: "🚶 Belajar Sambil Bergerak",
        tips: [
          "[DUMMY] Baca atau hafal materi sambil berjalan perlahan di ruangan",
          "[DUMMY] Gunakan gestur tangan saat menghafal urutan atau langkah-langkah",
          "[DUMMY] Ambil jeda aktif setiap 25–30 menit sebelum melanjutkan belajar",
        ],
      },
    ],
  },
};
