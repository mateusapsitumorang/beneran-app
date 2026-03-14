import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { useHistoryStore } from "../store/useHistoryStore";
import { useScanStore } from "../store/useScanStore";

const ikonStatus = {
  aman: {
    Ikon: ShieldCheck,
    warna: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
  },
  waspada: {
    Ikon: AlertTriangle,
    warna: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
  },
  bahaya: {
    Ikon: ShieldAlert,
    warna: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
};

const labelTipe = {
  link: "🔗",
  rekening: "💳",
  teks: "💬",
};

function formatWaktu(iso) {
  const d = new Date(iso);
  const sekarang = new Date();
  const selisihMs = sekarang - d;
  const selisihMenit = Math.floor(selisihMs / 60000);
  const selisihJam = Math.floor(selisihMenit / 60);
  const selisihHari = Math.floor(selisihJam / 24);

  if (selisihMenit < 1) return "Baru saja";
  if (selisihMenit < 60) return `${selisihMenit} menit lalu`;
  if (selisihJam < 24) return `${selisihJam} jam lalu`;
  if (selisihHari < 7) return `${selisihHari} hari lalu`;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RiwayatPage() {
  const navigate = useNavigate();
  const { riwayat, hapusItem, hapusSemua } = useHistoryStore();
  const { setInput, setHasil, setLoading, setError } = useScanStore();

  async function scanUlang(item) {
    const { jalankanScan } = await import("../services/scannerService");
    setLoading(true);
    setInput(item.input, null);
    try {
      const hasil = await jalankanScan(item.input);
      setHasil(hasil);
      navigate("/cek");
    } catch (err) {
      setError("Gagal scan ulang.");
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Riwayat Scan</h1>
            <p className="text-xs text-slate-400">
              {riwayat.length} scan tersimpan
            </p>
          </div>
        </div>
        {riwayat.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Hapus semua riwayat?")) hapusSemua();
            }}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
            Hapus Semua
          </button>
        )}
      </div>

      {/* Kosong */}
      {riwayat.length === 0 && (
        <div className="text-center py-20">
          <Clock size={40} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Belum ada riwayat scan</p>
          <p className="text-slate-400 text-sm mt-1">
            Scan sesuatu dulu dari halaman utama
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            Mulai Scan
          </button>
        </div>
      )}

      {/* List Riwayat */}
      <div className="space-y-3">
        {riwayat.map((item) => {
          const cfg = ikonStatus[item.status] || ikonStatus.waspada;
          const { Ikon } = cfg;
          return (
            <div key={item.id} className={`border rounded-xl p-4 ${cfg.bg}`}>
              <div className="flex items-start gap-3">
                <Ikon
                  size={18}
                  className={`${cfg.warna} flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {labelTipe[item.tipeInput] || "📄"}
                    </span>
                    <p className="text-sm font-mono text-slate-700 truncate flex-1">
                      {item.input}
                    </p>
                  </div>
                  {item.alasan?.[0] && (
                    <p className="text-xs text-slate-500 mb-2 truncate">
                      {item.alasan[0]}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {formatWaktu(item.waktu)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => hapusItem(item.id)}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => scanUlang(item)}
                        className="text-xs bg-white border border-slate-200 hover:border-blue-300 text-slate-600 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Scan Ulang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
