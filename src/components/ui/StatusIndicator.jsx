import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

const config = {
  aman: {
    warna: "bg-emerald-50 border-emerald-400 text-emerald-800",
    warnaRing: "bg-emerald-500",
    ikon: ShieldCheck,
    label: "AMAN",
    subLabel: "Tidak terindikasi ancaman",
  },
  waspada: {
    warna: "bg-amber-50 border-amber-400 text-amber-800",
    warnaRing: "bg-amber-500",
    ikon: AlertTriangle,
    label: "WASPADA",
    subLabel: "Perlu pemeriksaan lebih lanjut",
  },
  bahaya: {
    warna: "bg-red-50 border-red-500 text-red-800",
    warnaRing: "bg-red-500",
    ikon: ShieldAlert,
    label: "BAHAYA",
    subLabel: "Terindikasi penipuan",
  },
};

export default function StatusIndicator({ status, alasan = [], saran }) {
  const cfg = config[status] || config.waspada;
  const Ikon = cfg.ikon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className={`rounded-2xl border-2 p-6 ${cfg.warna}`}
    >
      {/* Header status */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-full ${cfg.warnaRing} flex items-center justify-center`}
        >
          <Ikon size={28} color="white" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-wide">{cfg.label}</p>
          <p className="text-sm opacity-70">{cfg.subLabel}</p>
        </div>
      </div>

      {/* Daftar alasan */}
      {alasan.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm mb-2">Alasan:</p>
          <ul className="space-y-1">
            {alasan.map((item, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saran tindakan */}
      {saran && (
        <div className="bg-white/50 rounded-xl p-3 mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
            Saran Tindakan
          </p>
          <p className="text-sm">{saran}</p>
        </div>
      )}
    </motion.div>
  );
}
