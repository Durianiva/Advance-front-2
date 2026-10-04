const baseQuestions = [
  ["Apa tujuan utama tahap pengenalan materi?", "Memahami konsep dan ruang lingkup dasar", "Menghafal semua istilah", "Melewati latihan", "Langsung mengikuti ujian"],
  ["Cara belajar yang paling efektif adalah...", "Mencatat poin penting dan mempraktikkannya", "Memutar video tanpa fokus", "Menunda semua latihan", "Hanya membaca judul"],
  ["Mengapa pre-test dikerjakan di awal?", "Mengukur pemahaman awal", "Menentukan harga kelas", "Menggantikan seluruh video", "Menerbitkan sertifikat"],
  ["Apa yang sebaiknya dilakukan setelah menonton video?", "Meninjau rangkuman dan mencoba latihan", "Menutup kelas", "Menghapus progres", "Melewati kuis"],
  ["Rangkuman modul membantu peserta untuk...", "Mengingat kembali inti materi", "Mengganti profil", "Membayar kelas", "Membatalkan pesanan"],
  ["Kapan sebuah konsep dianggap dipahami?", "Saat dapat dijelaskan dan diterapkan", "Saat judulnya sudah dibaca", "Saat videonya dibuka", "Saat halaman dimuat"],
  ["Apa fungsi kuis akhir modul?", "Memeriksa pemahaman setelah belajar", "Mengubah nama tutor", "Memilih metode pembayaran", "Menghapus kelas"],
  ["Jika nilai kuis belum memenuhi batas, peserta sebaiknya...", "Meninjau materi lalu mencoba kembali", "Berhenti belajar", "Mengabaikan hasil", "Membuat akun baru"],
  ["Progres kelas akan bertambah ketika...", "Aktivitas belajar diselesaikan", "Halaman disegarkan", "Warna tombol berubah", "Menu dibuka"],
  ["Sertifikat tersedia setelah...", "Seluruh aktivitas wajib selesai", "Satu video dibuka", "Checkout dimulai", "Katalog dilihat"],
];

export function buildCourseModules(course) {
  const topic = course.title;
  return [
    {
      id: "foundation",
      title: `Introduction to ${topic}`,
      items: [
        { id: "pretest", type: "pretest", title: `Pre-Test: ${topic}`, meta: "10 Pertanyaan" },
        { id: "video-1", type: "video", title: `Mengenal ${topic}`, meta: "12 Menit", description: `Pelajari konteks, tujuan, dan peluang utama dalam ${topic}.` },
        { id: "video-2", type: "video", title: "Konsep dan istilah penting", meta: "14 Menit", description: "Bangun fondasi yang kuat melalui konsep inti dan contoh sehari-hari." },
        { id: "video-3", type: "video", title: "Alur kerja profesional", meta: "11 Menit", description: "Ikuti proses kerja dari perencanaan, pelaksanaan, sampai evaluasi." },
        { id: "video-4", type: "video", title: "Studi kasus dan praktik terbaik", meta: "15 Menit", description: "Terapkan prinsip utama pada studi kasus yang menyerupai situasi kerja." },
        { id: "summary-1", type: "summary", title: `Rangkuman: ${topic}`, meta: "Bacaan 5 Menit" },
        { id: "quiz-1", type: "quiz", title: `Quiz: ${topic}`, meta: "10 Pertanyaan" },
      ],
    },
    {
      id: "practice",
      title: `Praktik ${topic}`,
      items: [
        { id: "video-5", type: "video", title: "Menyiapkan proyek praktik", meta: "10 Menit", description: "Siapkan tujuan, kebutuhan, dan indikator keberhasilan untuk proyek praktik." },
        { id: "video-6", type: "video", title: "Mengerjakan studi kasus", meta: "18 Menit", description: "Kerjakan studi kasus tahap demi tahap menggunakan metode yang sudah dipelajari." },
        { id: "summary-2", type: "summary", title: "Rangkuman praktik", meta: "Bacaan 5 Menit" },
        { id: "quiz-2", type: "quiz", title: "Quiz praktik", meta: "10 Pertanyaan" },
        { id: "final-exam", type: "quiz", title: `Ujian Akhir: ${topic}`, meta: "10 Pertanyaan" },
      ],
    },
  ];
}

export function getQuestions(courseTitle, type) {
  return baseQuestions.map(([question, correct, ...wrong], index) => ({
    id: `${type}-${index + 1}`,
    question: question.replace("materi", courseTitle),
    options: [correct, ...wrong],
    answer: 0,
  }));
}

export function flattenLearningItems(course) {
  return buildCourseModules(course).flatMap((module) => module.items);
}

export const typeIcons = {
  pretest: "ri-file-list-3-line",
  video: "ri-play-circle-line",
  summary: "ri-file-text-line",
  quiz: "ri-draft-line",
};
