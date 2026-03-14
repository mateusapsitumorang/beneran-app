import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, TrendingUp, Shield } from "lucide-react";
import { useScanStore } from "../store/useScanStore";
import { jalankanScan } from "../services/scannerService";
import { supabase } from "../services/supabase";
import { MessageCircle } from "lucide-react";
import { cekRateLimit } from "../utils/rateLimiter";
import ScanInput from "../components/scanner/ScanInput";
import Badge from "../components/ui/Badge";

export default function HomePage() {
  const navigate = useNavigate();
  const { setInput, setHasil, setLoading, setError, isLoading } =
    useScanStore();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    supabase
      .from("trending_modus")
      .select("*")
      .eq("aktif", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setTrending(data);
      });
  }, []);

  async function handleScan(teks) {
    setLoading(true);
    setInput(teks, null);
    try {
      const hasil = await jalankanScan(teks);
      setHasil(hasil);
      navigate("/cek");
    } catch (err) {
      setError("Gagal menganalisis. Coba lagi.");
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Shield size={14} />
          Lapis Pertahanan Digital Indonesia
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Cek dulu, baru klik. 🔍
        </h1>
        <p className="text-slate-500 text-lg">
          Tempel link, nomor rekening, atau teks mencurigakan. Kami analisis
          dalam hitungan detik.
        </p>
      </div>

      {/* Input Scanner */}
      <ScanInput onScan={handleScan} isLoading={isLoading} />

      {/* Live Counter */}
      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
        <p className="text-emerald-700 font-medium">
          🛡️ <span className="text-2xl font-bold">1.240</span> penipuan berhasil
          dicegah hari ini
        </p>
      </div>

      {/* Trending Modus */}
      {trending.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-red-500" />
            <p className="font-semibold text-slate-700 text-sm">
              Modus Penipuan Sedang Viral
            </p>
          </div>
          <div className="space-y-2">
            {trending.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {item.judul}
                    </p>
                    <Badge
                      tipe={
                        item.level_bahaya === "tinggi"
                          ? "bahaya"
                          : item.level_bahaya === "sedang"
                            ? "waspada"
                            : "info"
                      }
                    >
                      {item.level_bahaya}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => navigate("/chat")}
        className="w-full mb-3 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors"
      >
        <MessageCircle size={18} />
        Tanya Beneran AI — Konsultasi Keamanan Digital
      </button>

      {/* Panic Button */}
      <button
        onClick={() => navigate("/darurat")}
        className="w-full mt-6 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-base transition-colors"
      >
        <AlertCircle size={20} />
        Saya Baru Saja Tertipu — Panduan Darurat
      </button>
    </main>
  );
  async function handleScan(teks) {
    // Cek rate limit dulu
    const { diizinkan, pesan } = cekRateLimit("scan");
    if (!diizinkan) {
      toast.error(pesan); // pakai react-hot-toast
      return;
    }

    setLoading(true);
    setInput(teks, null);
    try {
      const hasil = await jalankanScan(teks);
      setHasil(hasil);
      navigate("/cek");
    } catch (err) {
      setError("Gagal menganalisis. Coba lagi.");
    }
  }
}
