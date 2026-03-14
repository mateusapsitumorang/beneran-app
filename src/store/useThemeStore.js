import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => {
        const next = !state.isDark
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDark: next }
      }),
      init: (isDark) => {
        if (isDark) document.documentElement.classList.add('dark')
        return { isDark }
      }
    }),
    { name: 'beneran-theme' }
  )
)