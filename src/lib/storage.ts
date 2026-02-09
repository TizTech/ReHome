const STORAGE_KEYS = {
  LISTINGS: 'rehome_listings',
  THEME: 'rehome_theme',
  FILTERS: 'rehome_filters',
} as const

export function saveListings(listings: unknown) {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings))
  } catch (error) {
    console.error('Failed to save listings to localStorage:', error)
  }
}

export function loadListings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LISTINGS)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load listings from localStorage:', error)
    return null
  }
}

export function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error)
  }
}

export function loadTheme(): 'light' | 'dark' | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error)
    return null
  }
}

export function clearAllStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

