import { ref, computed } from 'vue'

/**
 * Composable for undo/redo history management
 * @param {number} maxHistory - Maximum number of states to keep (default 50)
 */
export function useHistory(maxHistory = 50) {
  const history = ref([])
  const historyIndex = ref(-1)

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const currentState = computed(() => {
    if (historyIndex.value >= 0 && historyIndex.value < history.value.length) {
      return history.value[historyIndex.value]
    }
    return null
  })

  /**
   * Push a new state to history
   * @param {any} state - The state to save (will be deep cloned)
   */
  function pushState(state) {
    // Remove any future states if we're not at the end (after undo)
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // Deep clone the state to prevent reference issues
    const clonedState = JSON.parse(JSON.stringify(state))
    history.value.push(clonedState)

    // Limit history size
    if (history.value.length > maxHistory) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  /**
   * Undo to previous state
   * @returns {any|null} The previous state or null if can't undo
   */
  function undo() {
    if (canUndo.value) {
      historyIndex.value--
      return JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
    return null
  }

  /**
   * Redo to next state
   * @returns {any|null} The next state or null if can't redo
   */
  function redo() {
    if (canRedo.value) {
      historyIndex.value++
      return JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
    return null
  }

  /**
   * Clear all history
   */
  function clear() {
    history.value = []
    historyIndex.value = -1
  }

  /**
   * Get history stats
   */
  function getStats() {
    return {
      total: history.value.length,
      current: historyIndex.value,
      canUndo: canUndo.value,
      canRedo: canRedo.value
    }
  }

  return {
    history,
    historyIndex,
    canUndo,
    canRedo,
    currentState,
    pushState,
    undo,
    redo,
    clear,
    getStats
  }
}
