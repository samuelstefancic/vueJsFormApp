import { ref, computed, watch } from 'vue'

/**
 * Composable for validation summary display
 */
export function useValidationSummary(errors, schema) {
  const isExpanded = ref(false)
  const focusedErrorIndex = ref(-1)

  /**
   * List of errors with field information
   */
  const errorList = computed(() => {
    if (!errors.value || !schema.value?.fields) return []

    const list = []

    Object.entries(errors.value).forEach(([fieldId, fieldErrors]) => {
      if (!fieldErrors || fieldErrors.length === 0) return

      const field = schema.value.fields.find(f => f.id === fieldId)
      if (!field) return

      fieldErrors.forEach((message, index) => {
        list.push({
          id: `${fieldId}_${index}`,
          fieldId,
          fieldLabel: field.label || field.name,
          fieldType: field.type,
          message,
          index: list.length
        })
      })
    })

    return list
  })

  /**
   * Total error count
   */
  const errorCount = computed(() => errorList.value.length)

  /**
   * Has errors
   */
  const hasErrors = computed(() => errorCount.value > 0)

  /**
   * Fields with errors
   */
  const fieldsWithErrors = computed(() => {
    const fieldIds = new Set(errorList.value.map(e => e.fieldId))
    return Array.from(fieldIds)
  })

  /**
   * Fields with errors count
   */
  const fieldErrorCount = computed(() => fieldsWithErrors.value.length)

  /**
   * Toggle expanded state
   */
  function toggle() {
    isExpanded.value = !isExpanded.value
  }

  /**
   * Expand summary
   */
  function expand() {
    isExpanded.value = true
  }

  /**
   * Collapse summary
   */
  function collapse() {
    isExpanded.value = false
  }

  /**
   * Focus on a specific error (scroll to field)
   */
  function focusError(errorIndex) {
    if (errorIndex >= 0 && errorIndex < errorList.value.length) {
      focusedErrorIndex.value = errorIndex
      const error = errorList.value[errorIndex]

      // Try to scroll to and focus the field
      const fieldElement = document.querySelector(
        `[data-testid="render-field-${error.fieldId}"]`
      ) || document.querySelector(`[data-field-id="${error.fieldId}"]`)

      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Try to focus the input
        const input = fieldElement.querySelector('input, textarea, select')
        if (input) {
          setTimeout(() => input.focus(), 300)
        }
      }
    }
  }

  /**
   * Focus next error
   */
  function focusNextError() {
    if (errorList.value.length === 0) return

    const nextIndex = (focusedErrorIndex.value + 1) % errorList.value.length
    focusError(nextIndex)
  }

  /**
   * Focus previous error
   */
  function focusPreviousError() {
    if (errorList.value.length === 0) return

    const prevIndex = focusedErrorIndex.value <= 0
      ? errorList.value.length - 1
      : focusedErrorIndex.value - 1
    focusError(prevIndex)
  }

  /**
   * Get summary message
   */
  const summaryMessage = computed(() => {
    if (!hasErrors.value) {
      return 'Aucune erreur'
    }

    if (fieldErrorCount.value === 1) {
      return `${errorCount.value} erreur dans 1 champ`
    }

    return `${errorCount.value} erreur${errorCount.value > 1 ? 's' : ''} dans ${fieldErrorCount.value} champs`
  })

  /**
   * Reset focus
   */
  function resetFocus() {
    focusedErrorIndex.value = -1
  }

  // Auto-expand when errors appear
  watch(hasErrors, (has) => {
    if (has) {
      isExpanded.value = true
      focusedErrorIndex.value = 0
    } else {
      isExpanded.value = false
      focusedErrorIndex.value = -1
    }
  })

  return {
    errorList,
    errorCount,
    hasErrors,
    fieldsWithErrors,
    fieldErrorCount,
    isExpanded,
    focusedErrorIndex,
    summaryMessage,
    toggle,
    expand,
    collapse,
    focusError,
    focusNextError,
    focusPreviousError,
    resetFocus
  }
}
