/**
 * @file Definisi data kuesioner gaya belajar.
 * Setiap pertanyaan terdiri dari id, kategori, icon, label pertanyaan,
 * dan deskripsi pembantu.
 *
 * QUESTION_PAGES adalah urutan halaman kuesioner yang ditampilkan ke siswa:
 * [0] Visual → [1] Auditori → [2] Kinestetik
 */

import { Eye, Headphones, Activity } from "lucide-react";

export const VISUAL_QUESTIONS = [
  { id: "v1", category: "Visual Learning", icon: Eye, label: "Saya belajar lebih baik dengan membaca apa yang ditulis guru di papan tulis.", desc: "Pikirkan apakah Anda mengandalkan tulisan atau gambar di kelas." },
  { id: "v2", category: "Visual Learning", icon: Eye, label: "Ketika saya membaca petunjuk, saya lebih mudah mengingatnya.", desc: "Apakah teks tertulis lebih membekas di ingatan Anda?" },
  { id: "v3", category: "Visual Learning", icon: Eye, label: "Saya lebih memahami ketika membaca petunjuk.", desc: "Seberapa penting membaca instruksi tertulis bagi Anda?" },
  { id: "v4", category: "Visual Learning", icon: Eye, label: "Saya lebih mudah mengingat sesuatu jika saya menuliskannya kembali.", desc: "Apakah mencatat membantu proses menghafal Anda?" },
  { id: "v5", category: "Visual Learning", icon: Eye, label: "Saya lebih suka membaca buku daripada mendengarkan cerita.", desc: "Bandingkan preferensi Anda antara buku teks dan penjelasan lisan." },
];

export const AUDITORY_QUESTIONS = [
  { id: "a1", category: "Auditory Learning", icon: Headphones, label: "Ketika guru memberi tahu saya instruksi, saya mengerti dengan lebih baik.", desc: "Pikirkan bagaimana Anda belajar dari instruksi lisan di kelas." },
  { id: "a2", category: "Auditory Learning", icon: Headphones, label: "Ketika seseorang menjelaskan cara melakukan sesuatu di kelas, saya lebih mudah memahaminya.", desc: "Seberapa penting penjelasan lisan bagi Anda?" },
  { id: "a3", category: "Auditory Learning", icon: Headphones, label: "Saya lebih mengingat hal-hal yang saya dengar di kelas daripada hal-hal yang saya baca.", desc: "Bandingkan ingatan Anda antara mendengar dan membaca." },
  { id: "a4", category: "Auditory Learning", icon: Headphones, label: "Saya belajar lebih baik di kelas ketika guru memberikan ceramah.", desc: "Apakah Anda lebih suka ceramah langsung dari guru?" },
  { id: "a5", category: "Auditory Learning", icon: Headphones, label: "Saya belajar lebih baik di kelas ketika mendengarkan seseorang.", desc: "Seberapa efektif mendengarkan bagi gaya belajar Anda?" },
];

export const KINESTHETIC_QUESTIONS = [
  { id: "k1", category: "Kinesthetic Learning", icon: Activity, label: "Saya lebih suka belajar dengan melakukan sesuatu di kelas.", desc: "Apakah Anda lebih suka praktek langsung?" },
  { id: "k2", category: "Kinesthetic Learning", icon: Activity, label: "Ketika saya melakukan hal-hal di kelas, saya belajar dengan lebih baik.", desc: "Seberapa penting aktivitas fisik dalam proses belajar Anda?" },
  { id: "k3", category: "Kinesthetic Learning", icon: Activity, label: "Saya senang belajar di kelas dengan melakukan eksperimen.", desc: "Apakah mencoba langsung membuat materi lebih mudah dipahami?" },
  { id: "k4", category: "Kinesthetic Learning", icon: Activity, label: "Saya lebih memahami materi di kelas ketika saya ikut serta dalam peran-peran.", desc: "Apakah bermain peran (role-play) membantu Anda?" },
  { id: "k5", category: "Kinesthetic Learning", icon: Activity, label: "Saya belajar paling baik di kelas ketika saya dapat berpartisipasi dalam kegiatan yang terkait.", desc: "Seberapa penting keterlibatan aktif Anda di kelas?" },
];

/** Urutan halaman kuesioner yang ditampilkan ke siswa */
export const QUESTION_PAGES = [VISUAL_QUESTIONS, AUDITORY_QUESTIONS, KINESTHETIC_QUESTIONS];
