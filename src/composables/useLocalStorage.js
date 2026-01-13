import { ref, watch } from 'vue'
import { generateId } from './useId'

const STORAGE_KEY = 'vue-forms-builder-data'

// Debounce helper
function debounce(fn, delay) {
  let timeoutId = null
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

// Initialize storage structure if not exists
function initStorage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const initial = { forms: {} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  try {
    return JSON.parse(stored)
  } catch {
    const initial = { forms: {} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

// Get all storage data
function getStorageData() {
  return initStorage()
}

// Save storage data
function setStorageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useLocalStorage() {
  const savedForms = ref([])
  const currentFormId = ref(null)
  const isDirty = ref(false)
  const lastSavedAt = ref(null)

  // Load list of saved forms
  function loadSavedForms() {
    const data = getStorageData()
    savedForms.value = Object.values(data.forms)
      .sort((a, b) => b.updatedAt - a.updatedAt)
    return savedForms.value
  }

  // Save form to localStorage
  function saveForm(schema, title = null, id = null) {
    const data = getStorageData()
    const formId = id || currentFormId.value || generateId()
    const now = Date.now()

    const existingForm = data.forms[formId]

    data.forms[formId] = {
      id: formId,
      title: title || schema.title || 'Formulaire sans titre',
      schema: JSON.parse(JSON.stringify(schema)),
      createdAt: existingForm?.createdAt || now,
      updatedAt: now
    }

    setStorageData(data)
    currentFormId.value = formId
    isDirty.value = false
    lastSavedAt.value = now
    loadSavedForms()

    return formId
  }

  // Save as new form (always creates new entry)
  function saveFormAs(schema, title) {
    const newId = generateId()
    return saveForm(schema, title, newId)
  }

  // Load form from localStorage
  function loadForm(id) {
    const data = getStorageData()
    const form = data.forms[id]

    if (form) {
      currentFormId.value = id
      isDirty.value = false
      lastSavedAt.value = form.updatedAt
      return JSON.parse(JSON.stringify(form.schema))
    }

    return null
  }

  // Delete form from localStorage
  function deleteForm(id) {
    const data = getStorageData()

    if (data.forms[id]) {
      delete data.forms[id]
      setStorageData(data)

      if (currentFormId.value === id) {
        currentFormId.value = null
      }

      loadSavedForms()
      return true
    }

    return false
  }

  // Rename a saved form
  function renameForm(id, newTitle) {
    const data = getStorageData()

    if (data.forms[id]) {
      data.forms[id].title = newTitle
      data.forms[id].updatedAt = Date.now()
      setStorageData(data)
      loadSavedForms()
      return true
    }

    return false
  }

  // Get form by ID
  function getFormById(id) {
    const data = getStorageData()
    return data.forms[id] || null
  }

  // Mark form as dirty (has unsaved changes)
  function markDirty() {
    isDirty.value = true
  }

  // Reset state for new form
  function resetFormState() {
    currentFormId.value = null
    isDirty.value = false
    lastSavedAt.value = null
  }

  // Create debounced auto-save function
  function createAutoSave(getSchema, delay = 2000) {
    return debounce(() => {
      if (currentFormId.value && isDirty.value) {
        const schema = getSchema()
        saveForm(schema)
      }
    }, delay)
  }

  // Setup auto-save watcher
  function setupAutoSave(schemaRef, delay = 2000) {
    const autoSave = createAutoSave(() => schemaRef.value, delay)

    watch(
      schemaRef,
      () => {
        markDirty()
        if (currentFormId.value) {
          autoSave()
        }
      },
      { deep: true }
    )

    return autoSave
  }

  // Format timestamp for display
  function formatDate(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    // Less than 1 minute
    if (diff < 60000) {
      return "A l'instant"
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `Il y a ${minutes} min`
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `Il y a ${hours}h`
    }

    // Same year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      })
    }

    // Different year
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Initialize on first use
  loadSavedForms()

  return {
    savedForms,
    currentFormId,
    isDirty,
    lastSavedAt,
    loadSavedForms,
    saveForm,
    saveFormAs,
    loadForm,
    deleteForm,
    renameForm,
    getFormById,
    markDirty,
    resetFormState,
    createAutoSave,
    setupAutoSave,
    formatDate
  }
}
