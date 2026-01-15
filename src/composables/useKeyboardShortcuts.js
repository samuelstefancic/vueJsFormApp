import { onMounted, onUnmounted } from 'vue'

/**
 * Keyboard shortcuts configuration
 */
export const SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true, shift: false, description: 'Annuler' },
  REDO: { key: 'y', ctrl: true, shift: false, description: 'Rétablir' },
  REDO_ALT: { key: 'z', ctrl: true, shift: true, description: 'Rétablir' },
  SAVE: { key: 's', ctrl: true, shift: false, description: 'Sauvegarder' },
  DUPLICATE: { key: 'd', ctrl: true, shift: false, description: 'Dupliquer' },
  DELETE: { key: 'Delete', ctrl: false, shift: false, description: 'Supprimer' },
  DELETE_ALT: { key: 'Backspace', ctrl: false, shift: false, description: 'Supprimer' },
  MOVE_UP: { key: 'ArrowUp', ctrl: false, shift: false, description: 'Déplacer vers le haut' },
  MOVE_DOWN: { key: 'ArrowDown', ctrl: false, shift: false, description: 'Déplacer vers le bas' },
  DESELECT: { key: 'Escape', ctrl: false, shift: false, description: 'Désélectionner' },
  PREVIEW: { key: 'p', ctrl: true, shift: false, description: 'Aperçu' },
  NEW_FORM: { key: 'n', ctrl: true, shift: false, description: 'Nouveau formulaire' },
  EXPORT: { key: 'e', ctrl: true, shift: false, description: 'Exporter' }
}

/**
 * Check if user is typing in an input field
 */
function isTyping() {
  const activeElement = document.activeElement
  if (!activeElement) return false

  const tagName = activeElement.tagName.toUpperCase()
  const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
  const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'

  return isInput || isContentEditable
}

/**
 * Composable for keyboard shortcuts
 * @param {Object} actions - Object with action handlers
 */
export function useKeyboardShortcuts(actions) {
  function handleKeydown(event) {
    const key = event.key
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey

    // Undo: Ctrl+Z
    if (ctrl && key.toLowerCase() === 'z' && !shift) {
      event.preventDefault()
      actions.undo?.()
      return
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if ((ctrl && key.toLowerCase() === 'y') || (ctrl && shift && key.toLowerCase() === 'z')) {
      event.preventDefault()
      actions.redo?.()
      return
    }

    // Save: Ctrl+S
    if (ctrl && key.toLowerCase() === 's') {
      event.preventDefault()
      actions.save?.()
      return
    }

    // Duplicate: Ctrl+D
    if (ctrl && key.toLowerCase() === 'd') {
      event.preventDefault()
      actions.duplicate?.()
      return
    }

    // Preview: Ctrl+P
    if (ctrl && key.toLowerCase() === 'p') {
      event.preventDefault()
      actions.preview?.()
      return
    }

    // New Form: Ctrl+N
    if (ctrl && key.toLowerCase() === 'n') {
      event.preventDefault()
      actions.newForm?.()
      return
    }

    // Export: Ctrl+E
    if (ctrl && key.toLowerCase() === 'e') {
      event.preventDefault()
      actions.export?.()
      return
    }

    // Actions that should NOT work when typing in inputs
    if (isTyping()) return

    // Delete: Delete or Backspace
    if (key === 'Delete' || key === 'Backspace') {
      event.preventDefault()
      actions.delete?.()
      return
    }

    // Move Up: Arrow Up
    if (key === 'ArrowUp' && !ctrl) {
      event.preventDefault()
      actions.moveUp?.()
      return
    }

    // Move Down: Arrow Down
    if (key === 'ArrowDown' && !ctrl) {
      event.preventDefault()
      actions.moveDown?.()
      return
    }

    // Deselect: Escape
    if (key === 'Escape') {
      actions.deselect?.()
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    SHORTCUTS
  }
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut) {
  const parts = []
  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.shift) parts.push('Shift')
  parts.push(shortcut.key.toUpperCase())
  return parts.join('+')
}
