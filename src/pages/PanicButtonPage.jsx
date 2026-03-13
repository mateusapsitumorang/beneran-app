import { Phone, Shield, CreditCard, MessageSquare } from "lucide-react";

const langkahDarurat = [
  {
    nomor: 1,
    judul: "Segera hubungi bank kamu",
    deskripsi:
      "Telepon call center bank dan minta BLOKIR KARTU atau FREEZE akun. Jangan tunggu besok.",
    kontakBank: [
      { nama: "BCA", telepon: "1500888" },
      { nama: "BRI", telepon: "14017" },
      { nama: "Mandiri", telepon: "14000" },
      { nama: "BNI", telepon: "1500046" },
      {
        nama: "GoPay/OVO/Dana",
        telepon: "Buka aplikasi → Pusat Bantuan → Laporkan masalah",
      },
    ],
    ikon: Phone,
    warna: "bg-red-50 border-red-200",
  },
  {
    nomor: 2,
    judul: "Amankan akun yang terhubung",
    deskripsi:
      "Ganti password email, media sosial, dan e-wallet yang mungkin sudah diakses penipu.",
    langkah: [
      "Ganti password email utama",
      "Aktifkan 2FA (verifikasi dua langkah)",
      "Periksa perangkat yang login ke akunmu",
    ],
    ikon: Shield,
    warna: "bg-amber-50 border-amber-200",
  },
  {
    nomor: 3,
    judul: "Kumpulkan bukti",
    deskripsi: "Sebelum lapor polisi, siapkan semua bukti agar laporanmu kuat.",
    langkah: [
      "Screenshot semua percakapan dengan penipu",
      "Catat nomor rekening tujuan transfer",
      "Simpan bukti transfer dari mobile banking",
    ],
    ikon: CreditCard,
    warna: "bg-blue-50 border-blue-200",
  },
  {
    nomor: 4,
    judul: "Laporkan ke pihak berwajib",
    deskripsi:
      "Laporan resmi bisa membantu memblokir rekening penipu dan melindungi orang lain.",
    kontak: [
      {
        nama: "Patroli Siber Polri",
        url: "https://patrolisiber.id",
        label: "patrolisiber.id",
      },
      { nama: "Lapor.go.id", url: "https://lapor.go.id", label: "lapor.go.id" },
      { nama: "Hotline Kominfo", telepon: "159" },
    ],
    ikon: MessageSquare,
    warna: "bg-emerald-50 border-emerald-200",
  },
];

export default function PanicButtonPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🆘</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Panduan Darurat Korban Penipuan
        </h1>
        <p className="text-slate-500">
          Tetap tenang. Ikuti langkah-langkah berikut sesuai urutan.
        </p>
      </div>

      <div className="space-y-4">
        {langkahDarurat.map((langkah) => {
          const Ikon = langkah.ikon;
          return (
            <div
              key={langkah.nomor}
              className={`border rounded-2xl p-5 ${langkah.warna}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center flex-shrink-0">
                  <Ikon size={18} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      LANGKAH {langkah.nomor}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    {langkah.judul}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {langkah.deskripsi}
                  </p>

                  {/* Kontak bank */}
                  {langkah.kontakBank && (
                    <div className="grid grid-cols-2 gap-2">
                      {langkah.kontakBank.map((bank) => (
                        <div
                          key={bank.nama}
                          className="bg-white rounded-lg p-2 text-xs"
                        >
                          <p className="font-semibold text-slate-700">
                            {bank.nama}
                          </p>
                          <p className="text-slate-500">{bank.telepon}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Langkah-langkah */}
                  {langkah.langkah && (
                    <ul className="space-y-1">
                      {langkah.langkah.map((l, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-600 flex gap-2"
                        >
                          <span className="text-slate-400">{i + 1}.</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Link laporan */}
                  {langkah.kontak && (
                    <div className="space-y-2">
                      {langkah.kontak.map((k) => (
                        <div
                          key={k.nama}
                          className="bg-white rounded-lg p-2 text-xs flex justify-between items-center"
                        >
                          <span className="font-semibold text-slate-700">
                            {k.nama}
                          </span>
                          {k.url ? (
                            <a
                              href={k.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              {k.label}
                            </a>
                          ) : (
                            <span className="text-slate-500">
                              ☎ {k.telepon}
                            </span>
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
    </main>
  );
}
