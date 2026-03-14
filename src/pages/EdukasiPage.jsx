const artikel = [
  {
    icon: "🔐",
    judul: "Cara Mengamankan Akun M-Banking",
    deskripsi:
      "Langkah-langkah praktis melindungi rekening dari kejahatan siber.",
    tag: "Keamanan Finansial",
  },
  {
    icon: "📱",
    judul: "Ciri-Ciri Video Deepfake yang Wajib Kamu Tahu",
    deskripsi:
      "Cara membedakan video asli dan palsu di era AI seperti sekarang.",
    tag: "Literasi Digital",
  },
  {
    icon: "🛒",
    judul: "Belanja Aman di Instagram dan Facebook",
    deskripsi:
      "Tips verifikasi toko online sebelum transfer agar tidak tertipu.",
    tag: "Belanja Online",
  },
  {
    icon: "💬",
    judul: 'Modus "Mama Minta Pulsa" dan Variasinya',
    deskripsi:
      "Kenali berbagai variasi penipuan klasik yang masih makan korban.",
    tag: "Waspada Scam",
  },
  {
    icon: "🔗",
    judul: "Cara Membaca URL Sebelum Diklik",
    deskripsi: "Skill dasar yang bisa menyelamatkanmu dari phishing.",
    tag: "Literasi Digital",
  },
  {
    icon: "👴",
    judul: "Panduan Digital untuk Orang Tua dan Lansia",
    deskripsi:
      "Bagikan ke anggota keluarga yang kurang familiar dengan teknologi.",
    tag: "Untuk Semua Usia",
  },
];

export default function EdukasiPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Edukasi & Tips</h1>
      <p className="text-slate-500 text-sm mb-8">
        Tingkatkan literasi digitalmu agar tidak mudah menjadi korban penipuan.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {artikel.map((a, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-colors cursor-pointer"
          >
            <span className="text-3xl">{a.icon}</span>
            <span className="inline-block mt-3 mb-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {a.tag}
            </span>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{a.judul}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {a.deskripsi}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
