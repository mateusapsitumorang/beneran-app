import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-3">
              <Shield size={20} className="text-blue-600" />
              Beneran?
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Portal perlindungan digital Indonesia. Cek dulu, baru klik.
            </p>
          </div>

          {/* Fitur */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Fitur
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600">
                  Scanner Utama
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-blue-600">
                  Tanya AI
                </Link>
              </li>
              <li>
                <Link to="/database-hitam" className="hover:text-blue-600">
                  Database Hitam
                </Link>
              </li>
              <li>
                <Link to="/darurat" className="hover:text-blue-600">
                  Panic Button
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Informasi
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/metodologi" className="hover:text-blue-600">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link to="/edukasi" className="hover:text-blue-600">
                  Edukasi Digital
                </Link>
              </li>
              <li>
                <Link to="/lapor" className="hover:text-blue-600">
                  Laporkan Scam
                </Link>
              </li>
              <li>
                <Link to="/riwayat" className="hover:text-blue-600">
                  Riwayat Scan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & API -->*/}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Lainnya
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="mailto:halo@beneran.id"
                  className="hover:text-blue-600"
                >
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a
                  href="https://patrolisiber.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600"
                >
                  Patroli Siber
                </a>
              </li>
              <li>
                <a
                  href="https://cekrekening.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600"
                >
                  CekRekening.id
                </a>
              </li>
              <li>
                <a
                  href="https://mafindo.or.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600"
                >
                  Mafindo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © 2025 Beneran? — Dibuat dengan ❤️ untuk keamanan digital Indonesia
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Powered by:</span>
            <span className="font-medium">Google Safe Browsing</span>
            <span>•</span>
            <span className="font-medium">VirusTotal</span>
            <span>•</span>
            <span className="font-medium">Groq AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
