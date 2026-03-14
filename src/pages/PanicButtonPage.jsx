import { useNavigate } from "react-router-dom";
import {
  Phone,
  Shield,
  FileText,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

const langkah = [
  {
    nomor: 1,
    judul: "Segera blokir rekening atau kartu",
    deskripsi:
      "Hubungi call center bank SEKARANG. Minta blokir akun atau freeze kartu.",
    Ikon: Phone,
    warna: "border-red-200 bg-red-50",
    konten: [
      { nama: "BCA", info: "1500888" },
      { nama: "BRI", info: "14017" },
      { nama: "Mandiri", info: "14000" },
      { nama: "BNI", info: "1500046" },
      { nama: "BSI", info: "14040" },
      { nama: "GoPay / OVO / Dana", info: "Buka app → Pusat Bantuan" },
    ],
    tipe: "kontak",
  },
  {
    nomor: 2,
    judul: "Amankan semua akun digital",
    deskripsi:
      "Ganti password dan aktifkan verifikasi 2 langkah sebelum penipu masuk lebih dalam.",
    Ikon: Shield,
    warna: "border-amber-200 bg-amber-50",
    konten: [
      "Ganti password email utama kamu",
      "Aktifkan 2FA di semua akun penting",
      "Cek perangkat mana saja yang login ke akunmu",
      "Cabut akses aplikasi yang mencurigakan",
    ],
    tipe: "list",
  },
  {
    nomor: 3,
    judul: "Kumpulkan semua bukti",
    deskripsi: "Bukti yang lengkap akan memperkuat laporan polisimu.",
    Ikon: FileText,
    warna: "border-blue-200 bg-blue-50",
    konten: [
      "Screenshot semua percakapan dengan penipu",
      "Simpan bukti transfer dari mobile banking",
      "Catat nomor rekening tujuan transfer",
      "Catat nama, nomor HP, dan akun penipu",
    ],
    tipe: "list",
  },
  {
    nomor: 4,
    judul: "Laporkan ke pihak berwajib",
    deskripsi:
      "Laporan resmi bisa membantu memblokir rekening penipu dan melindungi korban lain.",
    Ikon: MessageSquare,
    warna: "border-emerald-200 bg-emerald-50",
    konten: [
      {
        nama: "Patroli Siber Polri",
        info: "patrolisiber.id",
        url: "https://patrolisiber.id",
      },
      { nama: "Lapor.go.id", info: "lapor.go.id", url: "https://lapor.go.id" },
      { nama: "Hotline Kominfo", info: "Telp: 159" },
      {
        nama: "Cekrekening.id",
        info: "cekrekening.id",
        url: "https://cekrekening.id",
      },
    ],
    tipe: "kontak",
  },
];

export default function PanicButtonPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm"
      >
        <ArrowLeft size={15} /> Kembali
      </button>

      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🆘</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Panduan Darurat Korban Penipuan
        </h1>
        <p className="text-slate-500 text-sm">
          Tetap tenang. Ikuti langkah-langkah ini sesuai urutan.
        </p>
      </div>

      <div className="space-y-4">
        {langkah.map((l) => {
          const { Ikon } = l;
          return (
            <div
              key={l.nomor}
              className={`border-2 rounded-2xl p-5 ${l.warna}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <Ikon size={18} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                    Langkah {l.nomor}
                  </p>
                  <h3 className="font-bold text-slate-800 mb-1">{l.judul}</h3>
                  <p className="text-sm text-slate-600 mb-3">{l.deskripsi}</p>

                  {l.tipe === "list" && (
                    <ul className="space-y-1.5">
                      {l.konten.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-700 flex gap-2"
                        >
                          <span className="text-slate-400 flex-shrink-0">
                            {i + 1}.
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {l.tipe === "kontak" && (
                    <div className="grid grid-cols-2 gap-2">
                      {l.konten.map((k, i) => (
                        <div key={i} className="bg-white rounded-xl p-3">
                          <p className="text-xs font-semibold text-slate-700">
                            {k.nama}
                          </p>
                          {k.url ? (
                            <a
                              href={k.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 underline"
                            >
                              {k.info}
                            </a>
                          ) : (
                            <p className="text-xs text-slate-500">{k.info}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border border-slate-200 rounded-xl p-4 bg-white text-center">
        <p className="text-sm text-slate-600 mb-3">
          Sudah tahu kronologinya? Bantu pengguna lain dengan melaporkan.
        </p>
        <button
          onClick={() => navigate("/lapor")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          Laporkan ke Database Beneran?
        </button>
      </div>
    </main>
  );
}
