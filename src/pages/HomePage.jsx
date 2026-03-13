import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Link, CreditCard, FileText, AlertCircle } from "lucide-react";
import { useScanStore } from "../store/useScanStore";
import { jalankanScan } from "../services/scannerService";

export default function HomePage() {
  const navigate = useNavigate();
  const { setInput, setHasil, setLoading, setError } = useScanStore();
  const [teks, setTeks] = useState("");

  async function handleScan() {
    if (!teks.trim()) return;

    setLoading(true);
    setInput(teks, null);

    try {
      const hasil = await jalankanScan(teks);
      setHasil(hasil);
      navigate("/cek"); // Pindah ke halaman hasil
    } catch (err) {
      setError(err.message);
    }
  }

  function handleQuickScan(contoh) {
    setTeks(contoh);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Beneran? 🔍</h1>
        <p className="text-slate-500 text-lg">
          Tempel link, nomor rekening, atau teks mencurigakan. Kami cek
          kebenarannya dalam hitungan detik.
        </p>
      </div>

      {/* Kotak Input Utama */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
        <textarea
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Contoh: https://tokopedia-promo.xyz/hadiah atau 1234567890 atau 'Selamat! Anda menang Rp100 juta...'"
          className="w-full h-32 text-slate-700 text-base resize-none outline-none placeholder-slate-300"
        />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Mendukung: Link • Nomor Rekening • Teks Pesan
          </p>
          <button
            onClick={handleScan}
            disabled={!teks.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <Search size={16} />
            Periksa Sekarang
          </button>
        </div>
      </div>

      {/* Quick Scan Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          {
            ikon: Link,
            label: "Cek Link",
            contoh: "https://bpjs-gratis-promo.xyz",
          },
          { ikon: CreditCard, label: "Cek Rekening", contoh: "1234567890" },
          {
            ikon: FileText,
            label: "Cek Berita",
            contoh:
              "Pemerintah bagikan kuota 50GB gratis, klik link ini sekarang!",
          },
        ].map(({ ikon: Ikon, label, contoh }) => (
          <button
            key={label}
            onClick={() => handleQuickScan(contoh)}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Ikon size={20} className="text-blue-500" />
            <span className="text-sm font-medium text-slate-600">{label}</span>
          </button>
        ))}
      </div>

      {/* Live Counter */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mb-6">
        <p className="text-emerald-700 font-semibold">
          🛡️ <span className="text-2xl font-bold">1.240</span> penipuan berhasil
          dicegah hari ini
        </p>
      </div>

      {/* Panic Button */}
      <button
        onClick={() => navigate("/darurat")}
        className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg transition-colors"
      >
        <AlertCircle size={22} />
        Saya Baru Saja Tertipu — Apa yang Harus Dilakukan?
      </button>
    </main>
  );
}
