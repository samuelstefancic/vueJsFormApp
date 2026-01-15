import { ref, computed, watch, onMounted } from 'vue'

/**
 * Available theme presets
 */
export const THEME_PRESETS = {
  DEFAULT: {
    id: 'default',
    name: 'Défaut',
    colors: {
      primary: '#6366f1',
      primaryLight: '#818cf8',
      background: '#ffffff',
      backgroundElevated: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  },
  DARK: {
    id: 'dark',
    name: 'Sombre',
    colors: {
      primary: '#818cf8',
      primaryLight: '#6366f1',
      background: '#0f172a',
      backgroundElevated: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171'
    }
  },
  OCEAN: {
    id: 'ocean',
    name: 'Océan',
    colors: {
      primary: '#0ea5e9',
      primaryLight: '#38bdf8',
      background: '#f0f9ff',
      backgroundElevated: '#e0f2fe',
      text: '#0c4a6e',
      textMuted: '#0369a1',
      border: '#bae6fd',
      success: '#14b8a6',
      warning: '#f59e0b',
      danger: '#f43f5e'
    }
  },
  FOREST: {
    id: 'forest',
    name: 'Forêt',
    colors: {
      primary: '#10b981',
      primaryLight: '#34d399',
      background: '#f0fdf4',
      backgroundElevated: '#dcfce7',
      text: '#14532d',
      textMuted: '#166534',
      border: '#bbf7d0',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#dc2626'
    }
  },
  SUNSET: {
    id: 'sunset',
    name: 'Coucher de soleil',
    colors: {
      primary: '#f97316',
      primaryLight: '#fb923c',
      background: '#fffbeb',
      backgroundElevated: '#fef3c7',
      text: '#78350f',
      textMuted: '#a16207',
      border: '#fde68a',
      success: '#84cc16',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  },
  PURPLE: {
    id: 'purple',
    name: 'Violet',
    colors: {
      primary: '#a855f7',
      primaryLight: '#c084fc',
      background: '#faf5ff',
      backgroundElevated: '#f3e8ff',
      text: '#581c87',
      textMuted: '#7c3aed',
      border: '#e9d5ff',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  }
}

const STORAGE_KEY = 'vue-forms-theme'

/**
 * Composable for theme management
 */
export function useTheme() {
  const currentTheme = ref(THEME_PRESETS.DEFAULT)
  const customColors = ref({})

  const effectiveColors = computed(() => {
    return {
      ...currentTheme.value.colors,
      ...customColors.value
    }
  })

  /**
   * Apply theme colors to CSS variables
   */
  function applyTheme() {
    const colors = effectiveColors.value
    const root = document.documentElement

    root.style.setProperty('--color-accent', colors.primary)
    root.style.setProperty('--color-accent-light', colors.primaryLight)
    root.style.setProperty('--color-bg', colors.background)
    root.style.setProperty('--color-bg-elevated', colors.backgroundElevated)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-muted', colors.textMuted)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-warning', colors.warning)
    root.style.setProperty('--color-danger', colors.danger)
  }

  /**
   * Set theme by preset ID
   */
  function setTheme(themeId) {
    const theme = Object.values(THEME_PRESETS).find(t => t.id === themeId)
    if (theme) {
      currentTheme.value = theme
      customColors.value = {}
      saveToStorage()
      applyTheme()
    }
  }

  /**
   * Set individual color
   */
  function setColor(colorKey, value) {
    customColors.value[colorKey] = value
    saveToStorage()
    applyTheme()
  }

  /**
   * Reset to default theme
   */
  function resetTheme() {
    currentTheme.value = THEME_PRESETS.DEFAULT
    customColors.value = {}
    saveToStorage()
    applyTheme()
  }

  /**
   * Save theme to localStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        themeId: currentTheme.value.id,
        customColors: customColors.value
      }))
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Load theme from localStorage
   */
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        const theme = Object.values(THEME_PRESETS).find(t => t.id === data.themeId)
        if (theme) {
          currentTheme.value = theme
        }
        if (data.customColors) {
          customColors.value = data.customColors
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Export theme configuration
   */
  function exportTheme() {
    return JSON.stringify({
      baseTheme: currentTheme.value.id,
      customColors: customColors.value
    }, null, 2)
  }

  /**
   * Import theme configuration
   */
  function importTheme(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (data.baseTheme) {
        setTheme(data.baseTheme)
      }
      if (data.customColors) {
        customColors.value = data.customColors
        saveToStorage()
        applyTheme()
      }
      return true
    } catch {
      return false
    }
  }

  /**
   * Get all theme presets as array
   */
  function getThemeList() {
    return Object.values(THEME_PRESETS)
  }

  // Watch for changes and apply
  watch([currentTheme, customColors], () => {
    applyTheme()
  }, { deep: true })

  // Load and apply on mount
  onMounted(() => {
    loadFromStorage()
    applyTheme()
  })

  return {
    currentTheme,
    customColors,
    effectiveColors,
    setTheme,
    setColor,
    resetTheme,
    exportTheme,
    importTheme,
    getThemeList,
    THEME_PRESETS
  }
}
