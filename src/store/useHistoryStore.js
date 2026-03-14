import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      riwayat: [], // maks 50 item tersimpan

      tambahRiwayat: (item) => {
        const baru = {
          id: Date.now(),
          input: item.input,
          tipeInput: item.tipeInput,
          status: item.status,
          alasan: item.alasan,
          sumber: item.sumber,
          waktu: new Date().toISOString(),
        }
        set((state) => ({
          riwayat: [baru, ...state.riwayat].slice(0, 50),
        }))
      },

      hapusItem: (id) => set((state) => ({
        riwayat: state.riwayat.filter(item => item.id !== id),
      })),

      hapusSemua: () => set({ riwayat: [] }),
    }),
    {
      name: 'beneran-history', // key di localStorage
    }
  )
)