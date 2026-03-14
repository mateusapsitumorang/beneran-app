import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const emojiBahaya = { bahaya: "🔴", waspada: "🟡", aman: "🟢" };
const labelBahaya = { bahaya: "BAHAYA", waspada: "WASPADA", aman: "AMAN" };

export function buatPesanWA(input, hasil) {
  const emoji = emojiBahaya[hasil.status];
  const label = labelBahaya[hasil.status];
  const tipe =
    { link: "🔗 Link", rekening: "💳 Rekening", teks: "💬 Pesan" }[
      hasil.tipeInput
    ] || "📄";
  const alasan =
    hasil.alasan
      ?.slice(0, 2)
      .map((a) => `  • ${a}`)
      .join("\n") || "";
  const vtInfo = hasil.detail
    ? `\n📊 VirusTotal: ${hasil.detail.malicious} berbahaya dari ${hasil.detail.total} antivirus`
    : "";

  return `${emoji} *${label}* — Hasil Cek Beneran?

${tipe}: \`${input.slice(0, 80)}${input.length > 80 ? "..." : ""}\`

📋 *Alasan:*
${alasan}${vtInfo}

🛡️ Saran: ${hasil.saran || "-"}

✅ Dicek via *Beneran?* — Portal Perlindungan Digital Indonesia
🔗 https://beneran.id`;
}

export default function ShareButton({ input, hasil }) {
  const [copied, setCopied] = useState(false);

  if (!hasil) return null;

  const pesan = buatPesanWA(input, hasil);
  const pesanEncoded = encodeURIComponent(pesan);

  function shareKeWA() {
    window.open(`https://wa.me/?text=${pesanEncoded}`, "_blank");
  }

  function shareKeSosmed() {
    const teks = `Saya baru saja mengecek keamanan digital menggunakan Beneran? 🛡️\n\nHasilnya: ${labelBahaya[hasil.status]}\n\nCek juga di https://beneran.id`;
    if (navigator.share) {
      navigator.share({
        title: "Hasil Cek Beneran?",
        text: teks,
        url: "https://beneran.id",
      });
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(teks)}`,
        "_blank",
      );
    }
  }

  async function salinPesan() {
    try {
      await navigator.clipboard.writeText(pesan);
      setCopied(true);
      toast.success("Pesan berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin pesan");
    }
  }

  return (
    <div className="mt-4">
      <p className="text-xs text-slate-400 text-center mb-3 font-medium uppercase tracking-wide">
        Bagikan hasil ini
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* Share ke WA */}
        <button
          onClick={shareKeWA}
          className="flex flex-col items-center gap-1.5 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-xs font-medium">WhatsApp</span>
        </button>

        {/* Share ke Sosmed */}
        <button
          onClick={shareKeSosmed}
          className="flex flex-col items-center gap-1.5 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
        >
          <Share2 size={18} />
          <span className="text-xs font-medium">Bagikan</span>
        </button>

        {/* Salin Teks */}
        <button
          onClick={salinPesan}
          className="flex flex-col items-center gap-1.5 p-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="text-xs font-medium">
            {copied ? "Tersalin!" : "Salin"}
          </span>
        </button>
      </div>

      {/* Preview pesan WA */}
      <details className="mt-3">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 text-center">
          Lihat preview pesan WA
        </summary>
        <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3">
          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {pesan}
          </pre>
        </div>
      </details>
    </div>
  );
}
