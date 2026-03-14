import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { supabase } from "../services/supabase";

const kategoriList = [
  "Rekening Penipu",
  "Link Phishing",
  "Akun Palsu",
  "SMS / WA Scam",
  "Toko Online Palsu",
  "Lainnya",
];

export default function LaporkanScamPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    kategori: "",
    nilai_terlapor: "",
    deskripsi: "",
    kerugian_rp: "",
  });
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.kategori || !form.deskripsi) {
      setError("Kategori dan deskripsi wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("laporan").insert([
      {
        kategori: form.kategori,
        nilai_terlapor: form.nilai_terlapor,
        deskripsi: form.deskripsi,
        kerugian_rp: form.kerugian_rp ? parseInt(form.kerugian_rp) : null,
      },
    ]);

    setLoading(false);
    if (err) {
      setError("Gagal mengirim laporan. Coba lagi.");
    } else {
      setSukses(true);
    }
  }

  if (sukses)
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Laporan Terkirim!
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Terima kasih. Laporan kamu akan ditinjau tim kami dan membantu
          melindungi pengguna lain.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    );

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Laporkan Scam</h1>
      <p className="text-slate-500 text-sm mb-6">
        Bantu lindungi orang lain dengan melaporkan penipuan yang kamu temui.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kategori Penipuan <span className="text-red-500">*</span>
          </label>
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Pilih kategori...</option>
            {kategoriList.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Nilai terlapor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nomor Rekening / Link / Username Penipu
          </label>
          <input
            name="nilai_terlapor"
            value={form.nilai_terlapor}
            onChange={handleChange}
            placeholder="Contoh: 1234567890 atau https://scam.xyz"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ceritakan Kronologinya <span className="text-red-500">*</span>
          </label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan bagaimana penipuan ini terjadi, agar tim kami bisa memverifikasi..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none"
          />
        </div>

        {/* Kerugian */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estimasi Kerugian (Rp)
          </label>
          <input
            name="kerugian_rp"
            type="number"
            value={form.kerugian_rp}
            onChange={handleChange}
            placeholder="Kosongkan jika tidak ada kerugian"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-200 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          {loading ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
    </main>
  );
}
