import { ref, computed, onMounted } from 'vue'

const ANALYTICS_STORAGE_KEY = 'vue-forms-analytics'

/**
 * Analytics event types
 */
export const EVENT_TYPES = {
  FORM_VIEW: 'form_view',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ABANDON: 'form_abandon',
  FIELD_FOCUS: 'field_focus',
  FIELD_BLUR: 'field_blur',
  FIELD_CHANGE: 'field_change',
  VALIDATION_ERROR: 'validation_error',
  PAGE_CHANGE: 'page_change'
}

/**
 * Composable for form analytics tracking
 */
export function useAnalytics(formId = null) {
  const events = ref([])
  const sessionId = ref(generateSessionId())
  const startTime = ref(Date.now())
  const isEnabled = ref(true)

  /**
   * Generate unique session ID
   */
  function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Track an event
   */
  function trackEvent(type, data = {}) {
    if (!isEnabled.value) return

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      formId: formId || data.formId,
      sessionId: sessionId.value,
      timestamp: Date.now(),
      timeFromStart: Date.now() - startTime.value,
      data
    }

    events.value.push(event)
    saveToStorage()

    return event
  }

  /**
   * Track form view
   */
  function trackFormView(id) {
    return trackEvent(EVENT_TYPES.FORM_VIEW, { formId: id })
  }

  /**
   * Track form start (first interaction)
   */
  function trackFormStart(id) {
    return trackEvent(EVENT_TYPES.FORM_START, { formId: id })
  }

  /**
   * Track form submission
   */
  function trackFormSubmit(id, success = true, errors = []) {
    return trackEvent(EVENT_TYPES.FORM_SUBMIT, {
      formId: id,
      success,
      errors,
      completionTime: Date.now() - startTime.value
    })
  }

  /**
   * Track form abandon
   */
  function trackFormAbandon(id, lastFieldId = null, progress = 0) {
    return trackEvent(EVENT_TYPES.FORM_ABANDON, {
      formId: id,
      lastFieldId,
      progress,
      timeSpent: Date.now() - startTime.value
    })
  }

  /**
   * Track field interaction
   */
  function trackFieldInteraction(fieldId, type, value = null) {
    return trackEvent(type, { fieldId, value })
  }

  /**
   * Track validation error
   */
  function trackValidationError(fieldId, errorMessage) {
    return trackEvent(EVENT_TYPES.VALIDATION_ERROR, { fieldId, errorMessage })
  }

  /**
   * Get analytics summary
   */
  const summary = computed(() => {
    const formEvents = events.value.filter(e => e.formId === formId)

    const views = formEvents.filter(e => e.type === EVENT_TYPES.FORM_VIEW).length
    const starts = formEvents.filter(e => e.type === EVENT_TYPES.FORM_START).length
    const submits = formEvents.filter(e => e.type === EVENT_TYPES.FORM_SUBMIT).length
    const successfulSubmits = formEvents.filter(
      e => e.type === EVENT_TYPES.FORM_SUBMIT && e.data.success
    ).length
    const abandons = formEvents.filter(e => e.type === EVENT_TYPES.FORM_ABANDON).length

    const completionTimes = formEvents
      .filter(e => e.type === EVENT_TYPES.FORM_SUBMIT && e.data.success)
      .map(e => e.data.completionTime)

    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0

    const fieldErrors = formEvents
      .filter(e => e.type === EVENT_TYPES.VALIDATION_ERROR)
      .reduce((acc, e) => {
        acc[e.data.fieldId] = (acc[e.data.fieldId] || 0) + 1
        return acc
      }, {})

    return {
      views,
      starts,
      submits,
      successfulSubmits,
      abandons,
      conversionRate: views > 0 ? (successfulSubmits / views * 100).toFixed(1) : 0,
      completionRate: starts > 0 ? (successfulSubmits / starts * 100).toFixed(1) : 0,
      abandonRate: starts > 0 ? (abandons / starts * 100).toFixed(1) : 0,
      avgCompletionTime: Math.round(avgCompletionTime / 1000), // seconds
      fieldErrors,
      totalEvents: formEvents.length
    }
  })

  /**
   * Get field-level analytics
   */
  function getFieldAnalytics(fieldId) {
    const fieldEvents = events.value.filter(e => e.data?.fieldId === fieldId)

    const focuses = fieldEvents.filter(e => e.type === EVENT_TYPES.FIELD_FOCUS).length
    const blurs = fieldEvents.filter(e => e.type === EVENT_TYPES.FIELD_BLUR).length
    const changes = fieldEvents.filter(e => e.type === EVENT_TYPES.FIELD_CHANGE).length
    const errors = fieldEvents.filter(e => e.type === EVENT_TYPES.VALIDATION_ERROR).length

    // Calculate average time spent on field
    const focusBlurPairs = []
    let lastFocus = null

    fieldEvents.forEach(e => {
      if (e.type === EVENT_TYPES.FIELD_FOCUS) {
        lastFocus = e.timestamp
      } else if (e.type === EVENT_TYPES.FIELD_BLUR && lastFocus) {
        focusBlurPairs.push(e.timestamp - lastFocus)
        lastFocus = null
      }
    })

    const avgTimeSpent = focusBlurPairs.length > 0
      ? focusBlurPairs.reduce((a, b) => a + b, 0) / focusBlurPairs.length
      : 0

    return {
      fieldId,
      focuses,
      blurs,
      changes,
      errors,
      errorRate: focuses > 0 ? (errors / focuses * 100).toFixed(1) : 0,
      avgTimeSpent: Math.round(avgTimeSpent / 1000) // seconds
    }
  }

  /**
   * Export analytics data
   */
  function exportAnalytics() {
    return JSON.stringify({
      formId,
      summary: summary.value,
      events: events.value
    }, null, 2)
  }

  /**
   * Clear analytics data
   */
  function clearAnalytics() {
    events.value = []
    saveToStorage()
  }

  /**
   * Enable/disable analytics
   */
  function setEnabled(enabled) {
    isEnabled.value = enabled
  }

  /**
   * Save to localStorage
   */
  function saveToStorage() {
    try {
      const allAnalytics = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}')
      allAnalytics[formId || 'global'] = events.value.slice(-1000) // Keep last 1000 events
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(allAnalytics))
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Load from localStorage
   */
  function loadFromStorage() {
    try {
      const allAnalytics = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}')
      if (allAnalytics[formId || 'global']) {
        events.value = allAnalytics[formId || 'global']
      }
    } catch {
      // Ignore storage errors
    }
  }

  onMounted(() => {
    loadFromStorage()
  })

  return {
    events,
    sessionId,
    summary,
    isEnabled,
    trackEvent,
    trackFormView,
    trackFormStart,
    trackFormSubmit,
    trackFormAbandon,
    trackFieldInteraction,
    trackValidationError,
    getFieldAnalytics,
    exportAnalytics,
    clearAnalytics,
    setEnabled,
    EVENT_TYPES
  }
}
