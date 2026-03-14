import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flag, RotateCcw } from "lucide-react";
import { useScanStore } from "../store/useScanStore";
import StatusIndicator from "../components/ui/StatusIndicator";

const labelTipe = {
  link: "🔗 Link",
  rekening: "💳 Nomor Rekening",
  teks: "💬 Teks Pesan",
};

export default function CheckerPage() {
  const navigate = useNavigate();
  const { hasilScan, inputTeks, isLoading, error, reset } = useScanStore();

  useEffect(() => {
    if (!isLoading && !hasilScan && !error) navigate("/");
  }, [hasilScan, isLoading, error]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-slate-500 font-medium">Sedang menganalisis...</p>
        <p className="text-xs text-slate-400">Mohon tunggu sebentar</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="text-blue-600 underline text-sm"
        >
          Kembali dan coba lagi
        </button>
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Tombol kembali */}
      <button
        onClick={() => {
          reset();
          navigate("/");
        }}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm"
      >
        <ArrowLeft size={15} />
        Periksa yang lain
      </button>

      {/* Tipe input */}
      {hasilScan?.tipeInput && (
        <p className="text-xs text-slate-400 mb-2 font-medium">
          {labelTipe[hasilScan.tipeInput] || "Input"}
        </p>
      )}

      {/* Input yang dipindai */}
      <div className="bg-slate-100 rounded-xl p-4 mb-6 break-all">
        <p className="text-slate-700 text-sm font-mono">{inputTeks}</p>
      </div>

      {/* Hasil scan */}
      {hasilScan && (
        <StatusIndicator
          status={hasilScan.status}
          alasan={hasilScan.alasan || []}
          saran={hasilScan.saran}
          sumber={hasilScan.sumber}
          detail={hasilScan.detail}
        />
      )}

      {hasilScan?.sumber && (
        <p className="text-center text-xs text-slate-400 mt-3">
          Dianalisis menggunakan: {hasilScan.sumber}
        </p>
      )}

      {/* Tombol aksi */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="flex items-center justify-center gap-2 border border-slate-300 text-slate-600 hover:bg-slate-50 py-3 rounded-xl transition-colors text-sm font-medium"
        >
          <RotateCcw size={15} />
          Scan Baru
        </button>
        <button
          onClick={() => navigate("/lapor")}
          className="flex items-center justify-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors text-sm font-medium"
        >
          <Flag size={15} />
          Laporkan Penipuan
        </button>
      </div>
    </main>
  );
}
