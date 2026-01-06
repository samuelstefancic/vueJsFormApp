import { useFormBuilderStore } from '../stores/formBuilder'
import { storeToRefs } from 'pinia'

export function useFormSchema() {
  const store = useFormBuilderStore()
  const { schema, selectedFieldId, selectedField, fieldNames } = storeToRefs(store)

  function getFieldById(id) {
    return schema.value.fields.find(f => f.id === id)
  }

  function getFieldIndex(id) {
    return schema.value.fields.findIndex(f => f.id === id)
  }

  function isNameUnique(name, excludeId = null) {
    return !schema.value.fields.some(f => f.name === name && f.id !== excludeId)
  }

  function getDefaultFieldProps(type) {
    const base = {
      label: '',
      name: '',
      required: false,
      placeholder: '',
      defaultValue: type === 'checkbox' ? false : ''
    }

    switch (type) {
      case 'text':
      case 'textarea':
        return { ...base, placeholder: '' }
      case 'number':
        return { ...base, min: null, max: null, defaultValue: null }
      case 'select':
        return { ...base, options: [], defaultValue: '' }
      case 'checkbox':
        return { ...base, defaultValue: false }
      case 'date':
        return { ...base, placeholder: 'jj/mm/aaaa' }
      default:
        return base
    }
  }

  function getFieldTypeLabel(type) {
    const labels = {
      text: 'Texte',
      textarea: 'Zone de texte',
      number: 'Nombre',
      select: 'Liste déroulante',
      checkbox: 'Case à cocher',
      date: 'Date'
    }
    return labels[type] || type
  }

  function getFieldTypeIcon(type) {
    const icons = {
      text: 'T',
      textarea: '¶',
      number: '#',
      select: '▼',
      checkbox: '☑',
      date: '📅'
    }
    return icons[type] || '?'
  }

  return {
    schema,
    selectedFieldId,
    selectedField,
    fieldNames,
    addField: store.addField,
    removeField: store.removeField,
    duplicateField: store.duplicateField,
    updateField: store.updateField,
    selectField: store.selectField,
    moveField: store.moveField,
    updateTitle: store.updateTitle,
    importSchema: store.importSchema,
    exportSchema: store.exportSchema,
    getFieldById,
    getFieldIndex,
    isNameUnique,
    getDefaultFieldProps,
    getFieldTypeLabel,
    getFieldTypeIcon
  }
}
