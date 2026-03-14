import { useState } from "react";
import { Search, Link, CreditCard, FileText } from "lucide-react";

const contohInput = [
  {
    ikon: Link,
    label: "Cek Link",
    nilai: "https://bpjs-gratis-promo.xyz/daftar",
  },
  { ikon: CreditCard, label: "Cek Rekening", nilai: "1234567890" },
  {
    ikon: FileText,
    label: "Cek Pesan",
    nilai:
      "Selamat! Anda terpilih menang hadiah Rp100 juta. Klik link sekarang!",
  },
];

export default function ScanInput({ onScan, isLoading }) {
  const [teks, setTeks] = useState("");

  function handleSubmit() {
    if (!teks.trim() || isLoading) return;
    onScan(teks);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tempel link, nomor rekening, atau teks pesan mencurigakan di sini..."
        rows={4}
        className="w-full text-slate-700 text-base resize-none outline-none placeholder-slate-300"
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Link • Rekening • Teks Pesan</p>
        <button
          onClick={handleSubmit}
          disabled={!teks.trim() || isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>
              <Search size={15} />
              Periksa Sekarang
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {contohInput.map(({ ikon: Ikon, label, nilai }) => (
          <button
            key={label}
            onClick={() => setTeks(nilai)}
            className="flex flex-col items-center gap-1.5 p-3 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Ikon size={18} className="text-blue-500" />
            <span className="text-xs font-medium text-slate-600">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
