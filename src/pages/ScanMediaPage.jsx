import { useState } from "react";
import { Image, Video, Brain, RotateCcw, Share2 } from "lucide-react";
import MediaUploader from "../components/scanner/MediaUploader";
import HasilAnalisisMedia from "../components/scanner/HasilAnalisisMedia";
import { analisaFoto, analisaVideo } from "../services/mediaAnalysisService";
import toast from "react-hot-toast";

export default function ScanMediaPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState("");

  function handleFileSelected(selectedFile) {
    setFile(selectedFile);
    setHasil(null);
    setError("");
  }

  async function handleAnalisis() {
    if (!file) {
      toast.error("Pilih foto atau video dulu!");
      return;
    }

    setIsLoading(true);
    setError("");
    setHasil(null);

    const isVideo = file.type.startsWith("video/");

    try {
      let hasilAnalisis;

      if (isVideo) {
        setProgress("Memulai analisis video...");
        hasilAnalisis = await analisaVideo(file, (msg) => setProgress(msg));
      } else {
        setProgress("Menganalisis gambar...");
        hasilAnalisis = await analisaFoto(file);
      }

      setHasil(hasilAnalisis);
    } catch (err) {
      setError(err.message || "Gagal menganalisis. Coba lagi.");
      toast.error("Analisis gagal!");
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  }

  function reset() {
    setFile(null);
    setHasil(null);
    setError("");
    setProgress("");
  }

  function shareHasil() {
    if (!hasil) return;
    const statusLabel = {
      aman: "🟢 KEMUNGKINAN ASLI",
      waspada: "🟡 PERLU DIPERIKSA",
      bahaya: "🔴 KEMUNGKINAN PALSU/AI",
    }[hasil.status];

    const pesan = `${statusLabel}

🤖 Kemungkinan dibuat AI: ${hasil.skorAI}%
🎭 Kemungkinan dimanipulasi: ${hasil.skorManipulasi}%

📋 ${hasil.penjelasan}

✅ Dicek via Beneran? — beneran.id`;

    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center">
            <Brain size={24} color="white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Scan Media — Deteksi AI & Deepfake
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Upload foto atau video untuk dicek apakah asli, dimanipulasi, atau
          dibuat dengan AI. Cocok untuk verifikasi berita viral dan konten
          mencurigakan.
        </p>
      </div>

      {/* Badge kemampuan */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {[
          { icon: "🤖", label: "Deteksi AI Generated" },
          { icon: "🎭", label: "Deepfake Detection" },
          { icon: "✂️", label: "Deteksi Manipulasi" },
          { icon: "📰", label: "Verifikasi Hoax" },
        ].map(({ icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full font-medium"
          >
            <span>{icon}</span>
            {label}
          </span>
        ))}
      </div>

      {/* Tab Foto / Video */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Image size={14} />
          Foto: JPG, PNG, WebP (maks 10MB)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Video size={14} />
          Video: MP4, WebM (maks 100MB)
        </div>
      </div>

      {/* Upload Area */}
      <MediaUploader
        onFileSelected={handleFileSelected}
        isLoading={isLoading}
      />

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Tombol Analisis */}
      {file && !hasil && (
        <button
          onClick={handleAnalisis}
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-semibold transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span className="text-sm">{progress || "Menganalisis..."}</span>
            </>
          ) : (
            <>
              <Brain size={18} />
              Mulai Analisis
            </>
          )}
        </button>
      )}

      {/* Progress detail untuk video */}
      {isLoading && progress && (
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex-shrink-0" />
            <p className="text-sm text-purple-700">{progress}</p>
          </div>
          <p className="text-xs text-purple-500 mt-2 ml-7">
            Analisis video membutuhkan 30-60 detik. Jangan tutup halaman ini.
          </p>
        </div>
      )}

      {/* Hasil */}
      {hasil && (
        <>
          <HasilAnalisisMedia hasil={hasil} />

          {/* Tombol aksi */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-600 hover:bg-slate-50 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              <RotateCcw size={15} />
              Analisis Baru
            </button>
            <button
              onClick={shareHasil}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              <Share2 size={15} />
              Bagikan ke WA
            </button>
          </div>
        </>
      )}

      {/* Tips penggunaan */}
      {!file && !hasil && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="font-semibold text-blue-800 text-sm mb-3">
            💡 Tips Penggunaan
          </p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex gap-2">
              <span className="flex-shrink-0">1.</span>
              Upload foto atau video yang ingin dicek keasliannya
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0">2.</span>
              Cocok untuk: foto viral WA, video berita, foto profil mencurigakan
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0">3.</span>
              AI akan menganalisis tanda-tanda manipulasi dan generasi AI
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0">4.</span>
              Video dianalisis per frame — proses lebih lama dari foto
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
