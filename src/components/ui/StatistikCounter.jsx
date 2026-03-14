import { useStatistik } from "../../hooks/useStatistik";
import { Shield, AlertTriangle, ShieldAlert, Activity } from "lucide-react";

function formatAngka(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "jt";
  if (n >= 1000) return (n / 1000).toFixed(1) + "rb";
  return n.toLocaleString("id-ID");
}

export default function StatistikCounter() {
  const { statistik, loading } = useStatistik();

  if (loading)
    return (
      <div className="grid grid-cols-2 gap-3 my-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse"
          >
            <div className="h-6 bg-slate-200 rounded mb-2 w-16" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        ))}
      </div>
    );

  const items = [
    {
      label: "Total Scan",
      nilai: statistik.total_scan,
      Ikon: Activity,
      warna: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "Penipuan Dicegah",
      nilai: statistik.scan_bahaya,
      Ikon: ShieldAlert,
      warna: "text-red-500",
      bg: "bg-red-50 border-red-200",
    },
    {
      label: "Perlu Waspada",
      nilai: statistik.scan_waspada,
      Ikon: AlertTriangle,
      warna: "text-amber-500",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      label: "Terbukti Aman",
      nilai: statistik.scan_aman,
      Ikon: Shield,
      warna: "text-emerald-500",
      bg: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-xs text-slate-500 font-medium">
          Statistik Real-time
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, nilai, Ikon, warna, bg }) => (
          <div key={label} className={`border rounded-xl p-4 ${bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Ikon size={16} className={warna} />
              <p className={`text-2xl font-bold ${warna}`}>
                {formatAngka(nilai)}
              </p>
            </div>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
