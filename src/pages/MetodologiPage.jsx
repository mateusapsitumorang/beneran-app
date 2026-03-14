import { Shield, Eye, Database, Brain, Users } from "lucide-react";

const metode = [
  {
    Ikon: Database,
    judul: "Database Komunitas Beneran?",
    warna: "bg-blue-50 border-blue-200 text-blue-700",
    ikonWarna: "text-blue-500",
    deskripsi:
      "Kami membangun database blacklist dari laporan masyarakat yang telah diverifikasi. Setiap laporan melalui proses validasi upvote/downvote dari komunitas sebelum masuk ke database resmi.",
    detail: [
      "Data rekening penipu terverifikasi",
      "Domain phishing yang dilaporkan",
      "Akun media sosial palsu",
      "Diperbarui secara real-time",
    ],
  },
  {
    Ikon: Shield,
    judul: "Google Safe Browsing API",
    warna: "bg-green-50 border-green-200 text-green-700",
    ikonWarna: "text-green-500",
    deskripsi:
      "Teknologi yang sama digunakan oleh Google Chrome untuk melindungi miliaran pengguna dari situs berbahaya setiap harinya. Database diperbarui setiap 30 menit oleh tim keamanan Google.",
    detail: [
      "Deteksi malware & virus",
      "Identifikasi phishing",
      "Blokir software berbahaya",
      "Coverage: 4 miliar URL",
    ],
  },
  {
    Ikon: Eye,
    judul: "VirusTotal — 70+ Antivirus",
    warna: "bg-purple-50 border-purple-200 text-purple-700",
    ikonWarna: "text-purple-500",
    deskripsi:
      "Setiap URL yang dicek dikirim ke VirusTotal dan dianalisis oleh lebih dari 70 mesin antivirus secara bersamaan. Hasilnya transparan — kamu bisa lihat antivirus mana yang mendeteksi ancaman.",
    detail: [
      "70+ antivirus sekaligus",
      "Kaspersky, Avast, Bitdefender, dll",
      "Hasil dalam hitungan detik",
      "Skor transparan 0 hingga 70+",
    ],
  },
  {
    Ikon: Brain,
    judul: "AI Analysis — Llama 3.1 via Groq",
    warna: "bg-amber-50 border-amber-200 text-amber-700",
    ikonWarna: "text-amber-500",
    deskripsi:
      "Untuk analisis teks pesan, kami menggunakan model AI Llama 3.1 yang dijalankan di infrastruktur Groq. AI ini telah dilatih khusus untuk memahami pola manipulasi psikologis dalam bahasa Indonesia.",
    detail: [
      "Deteksi pola manipulasi psikologis",
      "Analisis konteks percakapan",
      "Pemahaman bahasa Indonesia",
      "Respons dalam milidetik",
    ],
  },
  {
    Ikon: Users,
    judul: "Analisis Pola Komunitas",
    warna: "bg-teal-50 border-teal-200 text-teal-700",
    ikonWarna: "text-teal-500",
    deskripsi:
      "Tim kami secara rutin menganalisis modus penipuan terbaru yang beredar di Indonesia dan memperbarui database pola deteksi. Ini memastikan sistem tetap relevan dengan trik penipuan terkini.",
    detail: [
      "Update mingguan pola scam baru",
      "Monitoring grup WA & Telegram",
      "Kolaborasi dengan komunitas anti-hoax",
      "Laporan bulanan publik",
    ],
  },
];

const batasan = [
  "Hasil scan bukan jaminan 100% aman. Selalu gunakan akal sehat.",
  "Database blacklist bergantung pada laporan komunitas — ada jeda antara modus baru dan terdeteksi.",
  "Kami tidak menyimpan konten pesan yang kamu scan — hanya metadata untuk statistik.",
  "Untuk kasus keuangan, selalu konfirmasi langsung ke bank atau platform resmi.",
];

export default function MetodologiPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <Shield size={28} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Bagaimana Beneran? Bekerja
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Transparansi adalah fondasi kepercayaan. Berikut penjelasan lengkap
          teknologi dan metode yang kami gunakan untuk melindungimu.
        </p>
      </div>

      {/* Alur kerja singkat */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
          Alur Analisis
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            "Input Pengguna",
            "→",
            "Deteksi Tipe",
            "→",
            "Cek Database",
            "→",
            "API Eksternal",
            "→",
            "AI Analysis",
            "→",
            "Hasil",
          ].map((item, i) => (
            <span
              key={i}
              className={`text-sm ${item === "→" ? "text-slate-300" : "bg-white border border-slate-200 px-3 py-1 rounded-lg font-medium text-slate-700"}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Metode detail */}
      <div className="space-y-4 mb-8">
        {metode.map((m, i) => {
          const { Ikon } = m;
          return (
            <div key={i} className={`border rounded-2xl p-5 ${m.warna}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                  <Ikon size={20} className={m.ikonWarna} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{m.judul}</h3>
                  <p className="text-sm opacity-80 mb-3 leading-relaxed">
                    {m.deskripsi}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {m.detail.map((d, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-1.5 text-xs opacity-70"
                      >
                        <span>✓</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batasan */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          ⚠️ Batasan yang Perlu Kamu Tahu
        </p>
        <ul className="space-y-2">
          {batasan.map((b, i) => (
            <li key={i} className="text-sm text-amber-700 flex gap-2">
              <span className="flex-shrink-0">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Privacy note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400">
          🔒 Privasi kamu terlindungi. Kami tidak menyimpan data scan secara
          permanen. Lihat{" "}
          <a href="#" className="underline">
            Kebijakan Privasi
          </a>{" "}
          kami.
        </p>
      </div>
    </main>
  );
}
