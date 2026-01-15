import { ref, watch, onUnmounted } from 'vue'

/**
 * Autosave status states
 */
export const AUTOSAVE_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
  DISABLED: 'disabled'
}

/**
 * Composable for autosave functionality with visual indicator
 * @param {Object} options - Configuration options
 */
export function useAutosave(options = {}) {
  const {
    delay = 2000,
    onSave,
    enabled = true
  } = options

  const status = ref(enabled ? AUTOSAVE_STATUS.IDLE : AUTOSAVE_STATUS.DISABLED)
  const lastSavedAt = ref(null)
  const errorMessage = ref(null)
  const isEnabled = ref(enabled)

  let saveTimeout = null
  let statusTimeout = null

  /**
   * Format the last saved time
   */
  function formatLastSaved() {
    if (!lastSavedAt.value) return null

    const now = Date.now()
    const diff = now - lastSavedAt.value

    if (diff < 60000) {
      return 'À l\'instant'
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `Il y a ${minutes} min`
    } else {
      const date = new Date(lastSavedAt.value)
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  /**
   * Trigger autosave with debounce
   */
  function triggerSave() {
    if (!isEnabled.value) return

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    // Set status to idle (pending save)
    status.value = AUTOSAVE_STATUS.IDLE

    // Schedule save
    saveTimeout = setTimeout(async () => {
      await performSave()
    }, delay)
  }

  /**
   * Perform the actual save
   */
  async function performSave() {
    if (!isEnabled.value || !onSave) return

    status.value = AUTOSAVE_STATUS.SAVING
    errorMessage.value = null

    try {
      await onSave()
      lastSavedAt.value = Date.now()
      status.value = AUTOSAVE_STATUS.SAVED

      // Reset to idle after showing "saved" for a moment
      if (statusTimeout) {
        clearTimeout(statusTimeout)
      }
      statusTimeout = setTimeout(() => {
        if (status.value === AUTOSAVE_STATUS.SAVED) {
          status.value = AUTOSAVE_STATUS.IDLE
        }
      }, 3000)
    } catch (error) {
      status.value = AUTOSAVE_STATUS.ERROR
      errorMessage.value = error.message || 'Erreur de sauvegarde'
    }
  }

  /**
   * Force immediate save
   */
  async function saveNow() {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
    await performSave()
  }

  /**
   * Enable/disable autosave
   */
  function setEnabled(value) {
    isEnabled.value = value
    status.value = value ? AUTOSAVE_STATUS.IDLE : AUTOSAVE_STATUS.DISABLED

    if (!value && saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
  }

  /**
   * Get status label for display
   */
  function getStatusLabel() {
    switch (status.value) {
      case AUTOSAVE_STATUS.SAVING:
        return 'Sauvegarde...'
      case AUTOSAVE_STATUS.SAVED:
        return 'Sauvegardé'
      case AUTOSAVE_STATUS.ERROR:
        return errorMessage.value || 'Erreur'
      case AUTOSAVE_STATUS.DISABLED:
        return 'Auto-save désactivé'
      default:
        return lastSavedAt.value ? formatLastSaved() : ''
    }
  }

  /**
   * Get status icon
   */
  function getStatusIcon() {
    switch (status.value) {
      case AUTOSAVE_STATUS.SAVING:
        return 'spinner'
      case AUTOSAVE_STATUS.SAVED:
        return 'check'
      case AUTOSAVE_STATUS.ERROR:
        return 'error'
      default:
        return 'cloud'
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (saveTimeout) clearTimeout(saveTimeout)
    if (statusTimeout) clearTimeout(statusTimeout)
  })

  return {
    status,
    lastSavedAt,
    errorMessage,
    isEnabled,
    triggerSave,
    saveNow,
    setEnabled,
    getStatusLabel,
    getStatusIcon,
    formatLastSaved,
    AUTOSAVE_STATUS
  }
}
