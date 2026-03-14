import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

const config = {
  aman: {
    container: "bg-emerald-50 border-emerald-300",
    ring: "bg-emerald-500",
    teks: "text-emerald-800",
    saran: "bg-emerald-100",
    label: "AMAN",
    sublabel: "Tidak terindikasi ancaman",
    Ikon: ShieldCheck,
  },
  waspada: {
    container: "bg-amber-50 border-amber-300",
    ring: "bg-amber-500",
    teks: "text-amber-800",
    saran: "bg-amber-100",
    label: "WASPADA",
    sublabel: "Perlu pengecekan lebih lanjut",
    Ikon: AlertTriangle,
  },
  bahaya: {
    container: "bg-red-50 border-red-400",
    ring: "bg-red-500",
    teks: "text-red-800",
    saran: "bg-red-100",
    label: "BAHAYA",
    sublabel: "Terindikasi penipuan",
    Ikon: ShieldAlert,
  },
};

export default function StatusIndicator({
  status,
  alasan = [],
  saran,
  sumber,
  detail,
}) {
  const cfg = config[status] || config.waspada;
  const { Ikon } = cfg;

  return (
    <div className={`rounded-2xl border-2 p-6 ${cfg.container} ${cfg.teks}`}>
      {/* Header — sama seperti sebelumnya */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className={`w-14 h-14 rounded-full ${cfg.ring} flex items-center justify-center flex-shrink-0`}
        >
          <Ikon size={26} color="white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{cfg.label}</p>
          <p className="text-sm opacity-60">{cfg.sublabel}</p>
        </div>
      </div>

      {/* Alasan */}
      {alasan.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2">
            Alasan
          </p>
          <ul className="space-y-1.5">
            {alasan.map((item, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="opacity-40 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saran */}
      {saran && (
        <div className={`${cfg.saran} rounded-xl p-4 mb-4`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-1">
            Saran Tindakan
          </p>
          <p className="text-sm">{saran}</p>
        </div>
      )}

      {/* VirusTotal Score — hanya muncul kalau ada data */}
      {detail && (
        <div className="bg-white/60 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3">
            Hasil VirusTotal ({detail.total} antivirus)
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">
                {detail.malicious}
              </p>
              <p className="text-xs opacity-60">Berbahaya</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-600">
                {detail.suspicious}
              </p>
              <p className="text-xs opacity-60">Mencurigakan</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600">
                {detail.harmless}
              </p>
              <p className="text-xs opacity-60">Aman</p>
            </div>
          </div>
          {/* Progress bar visual */}
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
            <div
              className="bg-red-500 h-full transition-all"
              style={{ width: `${(detail.malicious / detail.total) * 100}%` }}
            />
            <div
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${(detail.suspicious / detail.total) * 100}%` }}
            />
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${(detail.harmless / detail.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Sumber data */}
      {sumber && (
        <p className="text-xs opacity-40 mt-3 text-center">
          Dianalisis menggunakan: {sumber}
        </p>
      )}
    </div>
  );
}
