import { create } from 'zustand'

export const useScanStore = create((set) => ({
  inputTeks: '',
  tipeInput: null,
  hasilScan: null,
  isLoading: false,
  error: null,

  setInput: (teks, tipe) => set({ inputTeks: teks, tipeInput: tipe }),
  setHasil: (hasil) => set({ hasilScan: hasil, isLoading: false }),
  setLoading: (val) => set({ isLoading: val, error: null }),
  setError: (pesan) => set({ error: pesan, isLoading: false }),
  reset: () => set({ inputTeks: '', tipeInput: null, hasilScan: null, error: null }),
}))