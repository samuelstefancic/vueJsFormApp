import { defineStore } from 'pinia'
import { generateId } from '../composables/useId'
import { slugify, generateUniqueName } from '../utils/slugify'
import { validateSchema } from '../utils/validation'

const STORAGE_KEY = 'vue-forms-builder-data'
const AUTO_SAVE_DELAY = 2000

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

// Storage helpers
function getStorageData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { forms: {} }
    return JSON.parse(stored)
  } catch {
    return { forms: {} }
  }
}

function setStorageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function createField(type, existingNames) {
  const id = generateId()
  const typeLabels = {
    text: 'Champ texte',
    textarea: 'Zone de texte',
    number: 'Nombre',
    select: 'Liste déroulante',
    checkbox: 'Case à cocher',
    date: 'Date',
    time: 'Heure',
    email: 'Email',
    phone: 'Téléphone',
    url: 'URL',
    rating: 'Notation',
    radio: 'Boutons radio',
    slider: 'Curseur',
    multiselect: 'Sélection multiple'
  }

  const label = typeLabels[type] || 'Nouveau champ'
  const name = generateUniqueName(label, existingNames)
  const baseField = { id, type, name, label, required: false }

  switch (type) {
    case 'text':
    case 'textarea':
      return { ...baseField, placeholder: '', defaultValue: '' }
    case 'number':
      return { ...baseField, placeholder: '', min: null, max: null, defaultValue: null }
    case 'select':
      return {
        ...baseField,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ],
        defaultValue: ''
      }
    case 'checkbox':
      return { ...baseField, defaultValue: false }
    case 'date':
      return { ...baseField, placeholder: 'jj/mm/aaaa', defaultValue: '' }
    case 'email':
      return { ...baseField, placeholder: 'exemple@domaine.com', defaultValue: '' }
    case 'phone':
      return { ...baseField, placeholder: '06 12 34 56 78', defaultValue: '' }
    case 'url':
      return { ...baseField, placeholder: 'https://exemple.com', defaultValue: '' }
    case 'rating':
      return { ...baseField, maxRating: 5, defaultValue: 0 }
    case 'radio':
      return {
        ...baseField,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ],
        defaultValue: ''
      }
    case 'slider':
      return { ...baseField, min: 0, max: 100, step: 1, defaultValue: 50 }
    case 'time':
      return { ...baseField, placeholder: 'HH:MM', defaultValue: '' }
    case 'multiselect':
      return {
        ...baseField,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        defaultValue: []
      }
    default:
      return baseField
  }
}

export const useFormBuilderStore = defineStore('formBuilder', {
  state: () => ({
    schema: {
      version: 1,
      title: 'Nouveau formulaire',
      fields: []
    },
    selectedFieldId: null,
    // Local storage persistence state
    currentFormId: null,
    isDirty: false,
    lastSavedAt: null,
    autoSaveEnabled: true
  }),

  getters: {
    selectedField(state) {
      if (!state.selectedFieldId) return null
      return state.schema.fields.find(f => f.id === state.selectedFieldId) || null
    },

    fieldNames(state) {
      return state.schema.fields.map(f => f.name)
    },

    fieldCount(state) {
      return state.schema.fields.length
    },

    hasFields(state) {
      return state.schema.fields.length > 0
    },

    hasUnsavedChanges(state) {
      return state.isDirty
    },

    isNewForm(state) {
      return state.currentFormId === null
    }
  },

  actions: {
    addField(type) {
      const field = createField(type, this.fieldNames)
      this.schema.fields.push(field)
      this.selectedFieldId = field.id
      this.markDirty()
    },

    removeField(id) {
      const index = this.schema.fields.findIndex(f => f.id === id)
      if (index !== -1) {
        this.schema.fields.splice(index, 1)

        if (this.selectedFieldId === id) {
          if (this.schema.fields.length > 0) {
            const newIndex = Math.min(index, this.schema.fields.length - 1)
            this.selectedFieldId = this.schema.fields[newIndex].id
          } else {
            this.selectedFieldId = null
          }
        }
        this.markDirty()
      }
    },

    duplicateField(id) {
      const sourceField = this.schema.fields.find(f => f.id === id)
      if (!sourceField) return

      const index = this.schema.fields.findIndex(f => f.id === id)
      const newField = {
        ...JSON.parse(JSON.stringify(sourceField)),
        id: generateId(),
        name: generateUniqueName(sourceField.label, this.fieldNames),
        label: `${sourceField.label} (copie)`
      }

      this.schema.fields.splice(index + 1, 0, newField)
      this.selectedFieldId = newField.id
      this.markDirty()
    },

    updateField(id, patch) {
      const field = this.schema.fields.find(f => f.id === id)
      if (!field) return

      if (patch.label !== undefined && patch.name === undefined) {
        const oldSlugifiedLabel = slugify(field.label)
        if (field.name === oldSlugifiedLabel || field.name === '') {
          patch.name = generateUniqueName(
            patch.label,
            this.fieldNames.filter(n => n !== field.name)
          )
        }
      }

      if (patch.name !== undefined && patch.name !== field.name) {
        const otherNames = this.fieldNames.filter(n => n !== field.name)
        if (otherNames.includes(patch.name)) {
          patch.name = generateUniqueName(patch.name, otherNames)
        }
      }

      Object.assign(field, patch)
      this.markDirty()
    },

    selectField(id) {
      this.selectedFieldId = id
    },

    moveField(id, direction) {
      const index = this.schema.fields.findIndex(f => f.id === id)
      if (index === -1) return

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= this.schema.fields.length) return

      const temp = this.schema.fields[index]
      this.schema.fields[index] = this.schema.fields[newIndex]
      this.schema.fields[newIndex] = temp
      this.markDirty()
    },

    updateTitle(title) {
      this.schema.title = title
      this.markDirty()
    },

    importSchema(json) {
      try {
        const parsed = JSON.parse(json)
        const validation = validateSchema(parsed)

        if (!validation.valid) {
          return false
        }

        this.schema = parsed
        this.selectedFieldId = null
        this.currentFormId = null
        this.isDirty = true
        this.lastSavedAt = null
        return true
      } catch {
        return false
      }
    },

    exportSchema() {
      return JSON.stringify(this.schema, null, 2)
    },

    reset() {
      this.schema = {
        version: 1,
        title: 'Nouveau formulaire',
        fields: []
      }
      this.selectedFieldId = null
      this.currentFormId = null
      this.isDirty = false
      this.lastSavedAt = null
    },

    loadFromTemplate(template) {
      const fields = template.fields.map(field => ({
        ...JSON.parse(JSON.stringify(field)),
        id: generateId()
      }))

      this.schema = {
        version: 1,
        title: template.name,
        fields
      }
      this.selectedFieldId = fields.length > 0 ? fields[0].id : null
      this.markDirty()
    },

    // Local Storage Persistence Actions
    markDirty() {
      this.isDirty = true
    },

    markClean() {
      this.isDirty = false
    },

    // Save current form to localStorage
    saveToStorage(title = null, forceNewId = false) {
      const data = getStorageData()
      const formId = forceNewId ? generateId() : (this.currentFormId || generateId())
      const now = Date.now()

      const existingForm = data.forms[formId]

      data.forms[formId] = {
        id: formId,
        title: title || this.schema.title || 'Formulaire sans titre',
        schema: JSON.parse(JSON.stringify(this.schema)),
        createdAt: existingForm?.createdAt || now,
        updatedAt: now
      }

      setStorageData(data)
      this.currentFormId = formId
      this.isDirty = false
      this.lastSavedAt = now

      return formId
    },

    // Save as new form (always creates new entry)
    saveAsNewForm(title) {
      return this.saveToStorage(title, true)
    },

    // Load form from localStorage
    loadFromStorage(id) {
      const data = getStorageData()
      const form = data.forms[id]

      if (form) {
        this.schema = JSON.parse(JSON.stringify(form.schema))
        this.currentFormId = id
        this.isDirty = false
        this.lastSavedAt = form.updatedAt
        this.selectedFieldId = null
        return true
      }

      return false
    },

    // Delete form from localStorage
    deleteFromStorage(id) {
      const data = getStorageData()

      if (data.forms[id]) {
        delete data.forms[id]
        setStorageData(data)

        if (this.currentFormId === id) {
          this.currentFormId = null
        }

        return true
      }

      return false
    },

    // Get list of saved forms
    getSavedForms() {
      const data = getStorageData()
      return Object.values(data.forms).sort((a, b) => b.updatedAt - a.updatedAt)
    },

    // Rename a saved form
    renameInStorage(id, newTitle) {
      const data = getStorageData()

      if (data.forms[id]) {
        data.forms[id].title = newTitle
        data.forms[id].updatedAt = Date.now()
        setStorageData(data)
        return true
      }

      return false
    },

    // Reset to new form
    resetToNew() {
      this.schema = {
        version: 1,
        title: 'Nouveau formulaire',
        fields: []
      }
      this.selectedFieldId = null
      this.currentFormId = null
      this.isDirty = false
      this.lastSavedAt = null
    },

    // Enable/disable auto-save
    setAutoSave(enabled) {
      this.autoSaveEnabled = enabled
    }
  }
})
