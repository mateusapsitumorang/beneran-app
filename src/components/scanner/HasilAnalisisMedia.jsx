import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Brain,
  Eye,
} from "lucide-react";

const statusConfig = {
  aman: {
    label: "KEMUNGKINAN ASLI",
    sublabel: "Tidak terdeteksi manipulasi signifikan",
    bg: "bg-emerald-50 border-emerald-300",
    teks: "text-emerald-800",
    ring: "bg-emerald-500",
    Ikon: ShieldCheck,
  },
  waspada: {
    label: "PERLU DIPERIKSA",
    sublabel: "Ada indikasi manipulasi atau AI",
    bg: "bg-amber-50 border-amber-300",
    teks: "text-amber-800",
    ring: "bg-amber-500",
    Ikon: AlertTriangle,
  },
  bahaya: {
    label: "KEMUNGKINAN PALSU / AI",
    sublabel: "Terdeteksi tanda-tanda manipulasi kuat",
    bg: "bg-red-50 border-red-400",
    teks: "text-red-800",
    ring: "bg-red-500",
    Ikon: ShieldAlert,
  },
};

function SkorBar({ label, nilai, warna }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-700">{nilai}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${warna}`}
          style={{ width: `${nilai}%` }}
        />
      </div>
    </div>
  );
}

export default function HasilAnalisisMedia({ hasil }) {
  if (!hasil) return null;

  const cfg = statusConfig[hasil.status] || statusConfig.waspada;
  const { Ikon } = cfg;

  return (
    <div className="space-y-4 mt-6">
      {/* Status utama */}
      <div className={`rounded-2xl border-2 p-6 ${cfg.bg} ${cfg.teks}`}>
        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-14 h-14 rounded-full ${cfg.ring} flex items-center justify-center flex-shrink-0`}
          >
            <Ikon size={26} color="white" />
          </div>
          <div>
            <p className="text-xl font-bold">{cfg.label}</p>
            <p className="text-sm opacity-60">{cfg.sublabel}</p>
          </div>
        </div>

        {/* Skor AI & Manipulasi */}
        <div className="space-y-3 mb-4">
          <SkorBar
            label="Kemungkinan dibuat AI"
            nilai={hasil.skorAI}
            warna={
              hasil.skorAI >= 70
                ? "bg-red-500"
                : hasil.skorAI >= 40
                  ? "bg-amber-400"
                  : "bg-emerald-500"
            }
          />
          <SkorBar
            label="Kemungkinan dimanipulasi"
            nilai={hasil.skorManipulasi}
            warna={
              hasil.skorManipulasi >= 70
                ? "bg-red-500"
                : hasil.skorManipulasi >= 40
                  ? "bg-amber-400"
                  : "bg-emerald-500"
            }
          />
        </div>

        {/* Penjelasan */}
        {hasil.penjelasan && (
          <div className="bg-white/60 rounded-xl p-4 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mb-1">
              Analisis AI
            </p>
            <p className="text-sm leading-relaxed">{hasil.penjelasan}</p>
          </div>
        )}

        {/* Tanda-tanda */}
        {hasil.tandaTanda?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mb-2">
              Tanda yang Ditemukan
            </p>
            <ul className="space-y-1">
              {hasil.tandaTanda.map((tanda, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="opacity-40 flex-shrink-0">•</span>
                  <span>{tanda}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rekomendasi */}
        {hasil.rekomendasi && (
          <div className="bg-white/60 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mb-1">
              Rekomendasi
            </p>
            <p className="text-sm">{hasil.rekomendasi}</p>
          </div>
        )}
      </div>

      {/* Sightengine detail — kalau ada */}
      {hasil.stAnalisis && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-purple-500" />
            <p className="font-semibold text-slate-700 text-sm">
              Detail Sightengine AI Detector
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">
                {Math.round(hasil.stAnalisis.ai_generated * 100)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Kemungkinan AI Generated
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {hasil.stAnalisis.wajah_terdeteksi}
              </p>
              <p className="text-xs text-slate-500 mt-1">Wajah Terdeteksi</p>
            </div>
            {hasil.stAnalisis.deepfake > 0 && (
              <div className="col-span-2 bg-red-50 rounded-xl p-3 text-center border border-red-200">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(hasil.stAnalisis.deepfake * 100)}%
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Kemungkinan Deepfake
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hasil per frame — untuk video */}
      {hasil.tipe === "video" && hasil.hasilPerFrame?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-blue-500" />
            <p className="font-semibold text-slate-700 text-sm">
              Analisis per Frame ({hasil.hasilPerFrame.length} frame)
            </p>
          </div>
          <div className="space-y-3">
            {hasil.hasilPerFrame.map((frame, i) => (
              <div key={i} className="flex gap-3 items-start">
                {/* Thumbnail frame */}
                <img
                  src={frame.preview}
                  alt={`Frame ${i + 1}`}
                  className="w-20 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-600">
                      Detik ke-{frame.waktu}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        frame.kemungkinan_ai >= 70
                          ? "bg-red-100 text-red-700"
                          : frame.kemungkinan_ai >= 40
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      AI: {frame.kemungkinan_ai}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {frame.penjelasan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-400 leading-relaxed">
          ⚠️ Hasil analisis ini tidak 100% akurat. Teknologi deteksi deepfake
          terus berkembang dan ada kemungkinan false positive/negative. Selalu
          gunakan akal sehat dan verifikasi dari sumber terpercaya.
        </p>
      </div>
    </div>
  );
}
