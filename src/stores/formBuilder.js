import { defineStore } from 'pinia'
import { generateId } from '../composables/useId'
import { slugify, generateUniqueName } from '../utils/slugify'
import { validateSchema } from '../utils/validation'

function createField(type, existingNames) {
  const id = generateId()
  const typeLabels = {
    text: 'Champ texte',
    textarea: 'Zone de texte',
    number: 'Nombre',
    select: 'Liste déroulante',
    checkbox: 'Case à cocher',
    date: 'Date'
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
    selectedFieldId: null
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
    }
  },

  actions: {
    addField(type) {
      const field = createField(type, this.fieldNames)
      this.schema.fields.push(field)
      this.selectedFieldId = field.id
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
    },

    updateTitle(title) {
      this.schema.title = title
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
    }
  }
})
