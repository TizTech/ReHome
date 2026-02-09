import { create } from 'zustand'
import { loadTheme, saveTheme } from '../lib/storage'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initTheme: () => void
}

const getInitialTheme = (): Theme => {
  const saved = loadTheme()
  if (saved) return saved
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme: Theme) => {
    set({ theme })
    saveTheme(theme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      saveTheme(newTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
      return { theme: newTheme }
    })
  },
  initTheme: () => {
    const theme = getInitialTheme()
    set({ theme })
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  },
}))

