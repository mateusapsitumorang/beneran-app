import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "../services/supabase";
import Badge from "../components/ui/Badge";

export default function DatabaseHitamPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function fetchData() {
    setLoading(true);
    let query = supabase
      .from("blacklist")
      .select("*")
      .order("jumlah_laporan", { ascending: false });
    if (filter !== "semua") query = query.eq("tipe", filter);
    const { data } = await query;
    if (data) setData(data);
    setLoading(false);
  }

  const dataFiltered = data.filter((item) =>
    item.nilai.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Database Hitam</h1>
      <p className="text-slate-500 text-sm mb-6">
        Kumpulan rekening, domain, dan akun yang terindikasi penipuan
        berdasarkan laporan masyarakat.
      </p>

      {/* Filter & Search */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor rekening atau domain..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 bg-white"
          />
        </div>
        <div className="flex gap-1.5">
          {["semua", "rekening", "domain", "username"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Memuat data...</div>
      ) : dataFiltered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>Tidak ada data yang cocok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dataFiltered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono font-semibold text-slate-800 truncate">
                  {item.nilai}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.nama_bank && `Bank: ${item.nama_bank} • `}
                  Dilaporkan {item.jumlah_laporan}x
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge tipe="info">{item.tipe}</Badge>
                <Badge tipe={item.status === "terbukti" ? "bahaya" : "waspada"}>
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
