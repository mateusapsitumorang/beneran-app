import { create } from 'zustand'

export const useScanStore = create((set) => ({
  // Data input dari pengguna
  inputTeks: '',
  tipeInput: null, // 'link' | 'rekening' | 'teks'

  // Hasil scan
  hasilScan: null,
  /*
    Contoh struktur hasilScan:
    {
      status: 'bahaya',        // 'aman' | 'waspada' | 'bahaya'
      skor: 92,                // 0-100
      alasan: ['Domain baru dibuat 3 hari lalu', 'Terdeteksi pola phishing'],
      saranTindakan: 'Jangan klik link ini dan laporkan ke pihak berwajib',
      detailTeknis: { ... }
    }
  */

  isLoading: false,
  error: null,

  // Actions (fungsi untuk mengubah state)
  setInput: (teks, tipe) => set({ inputTeks: teks, tipeInput: tipe }),
  setHasil: (hasil) => set({ hasilScan: hasil, isLoading: false }),
  setLoading: (val) => set({ isLoading: val, error: null }),
  setError: (pesan) => set({ error: pesan, isLoading: false }),
  reset: () => set({ inputTeks: '', tipeInput: null, hasilScan: null, error: null }),
}))