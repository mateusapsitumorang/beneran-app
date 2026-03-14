import { useState, useEffect } from "react";
import { X, ChevronRight, Shield } from "lucide-react";

const langkah = [
  {
    emoji: "👋",
    judul: "Selamat datang di Beneran?",
    deskripsi:
      "Portal perlindungan digital Indonesia. Kami bantu kamu cek apakah sesuatu aman sebelum diklik atau ditransfer.",
  },
  {
    emoji: "🔍",
    judul: "Cara pakainya mudah!",
    deskripsi:
      'Cukup salin (copy) link, nomor rekening, atau teks pesan mencurigakan, lalu paste di kolom utama. Klik "Periksa Sekarang".',
  },
  {
    emoji: "🎨",
    judul: "Hasil langsung berwarna",
    deskripsi:
      "🟢 Hijau = Aman, 🟡 Kuning = Perlu waspada, 🔴 Merah = Bahaya. Sederhana dan langsung bisa dipahami siapa saja.",
  },
  {
    emoji: "💬",
    judul: "Ada AI yang siap membantu",
    deskripsi:
      "Kamu bisa chat dengan Beneran AI untuk konsultasi keamanan digital. Tanya apapun seputar scam, phishing, atau keamanan akun.",
  },
  {
    emoji: "🆘",
    judul: "Sudah terlanjur tertipu?",
    deskripsi:
      'Klik tombol merah "Darurat" di navbar. Kami siapkan panduan langkah demi langkah yang harus kamu lakukan segera.',
  },
];

export default function OnboardingTour() {
  const [tampil, setTampil] = useState(false);
  const [langkahAktif, setLangkahAktif] = useState(0);

  useEffect(() => {
    const sudahLihat = localStorage.getItem("beneran-onboarding-done");
    if (!sudahLihat) {
      // Tampilkan setelah 1 detik agar halaman load dulu
      const timer = setTimeout(() => setTampil(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function tutup() {
    localStorage.setItem("beneran-onboarding-done", "true");
    setTampil(false);
  }

  function lanjut() {
    if (langkahAktif < langkah.length - 1) {
      setLangkahAktif((prev) => prev + 1);
    } else {
      tutup();
    }
  }

  if (!tampil) return null;

  const step = langkah[langkahAktif];
  const isLast = langkahAktif === langkah.length - 1;

  return (
    // Overlay backdrop
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        {/* Tombol tutup */}
        <button
          onClick={tutup}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        {/* Ikon Shield kecil */}
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Beneran? — Panduan Singkat
          </span>
        </div>

        {/* Konten step */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{step.emoji}</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {step.judul}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {step.deskripsi}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {langkah.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === langkahAktif
                  ? "w-5 h-2 bg-blue-600"
                  : i < langkahAktif
                    ? "w-2 h-2 bg-blue-300"
                    : "w-2 h-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Tombol navigasi */}
        <div className="flex gap-2">
          <button
            onClick={tutup}
            className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm transition-colors"
          >
            Lewati
          </button>
          <button
            onClick={lanjut}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            {isLast ? (
              "🚀 Mulai Pakai"
            ) : (
              <>
                Lanjut <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
