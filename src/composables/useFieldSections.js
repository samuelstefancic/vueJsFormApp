import { ref, computed } from 'vue'
import { generateId } from './useId'

/**
 * Composable for managing field sections/groups
 */
export function useFieldSections(schema) {
  const expandedSections = ref(new Set())

  /**
   * Create a new section
   */
  function createSection(title = 'Nouvelle section', description = '') {
    return {
      id: generateId(),
      type: 'section',
      title,
      description,
      collapsible: true,
      defaultExpanded: true,
      fields: []
    }
  }

  /**
   * Get sections from schema
   */
  const sections = computed(() => {
    if (!schema.value?.sections) {
      // If no sections defined, create a default section with all fields
      return [{
        id: 'default',
        title: '',
        description: '',
        collapsible: false,
        defaultExpanded: true,
        fields: schema.value?.fields || []
      }]
    }

    return schema.value.sections.map(section => ({
      ...section,
      fields: section.fieldIds
        ? section.fieldIds
            .map(id => schema.value.fields.find(f => f.id === id))
            .filter(Boolean)
        : []
    }))
  })

  /**
   * Check if section is expanded
   */
  function isSectionExpanded(sectionId) {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section?.collapsible) return true

    if (expandedSections.value.has(sectionId)) {
      return true
    }

    // Check default state if not explicitly set
    return section?.defaultExpanded !== false
  }

  /**
   * Toggle section expanded state
   */
  function toggleSection(sectionId) {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section?.collapsible) return

    if (expandedSections.value.has(sectionId)) {
      expandedSections.value.delete(sectionId)
    } else {
      expandedSections.value.add(sectionId)
    }
    // Trigger reactivity
    expandedSections.value = new Set(expandedSections.value)
  }

  /**
   * Expand all sections
   */
  function expandAll() {
    sections.value.forEach(section => {
      if (section.collapsible) {
        expandedSections.value.add(section.id)
      }
    })
    expandedSections.value = new Set(expandedSections.value)
  }

  /**
   * Collapse all sections
   */
  function collapseAll() {
    expandedSections.value = new Set()
  }

  /**
   * Add field to section
   */
  function addFieldToSection(fieldId, sectionId) {
    if (!schema.value?.sections) return false

    const section = schema.value.sections.find(s => s.id === sectionId)
    if (!section) return false

    // Remove from other sections first
    schema.value.sections.forEach(s => {
      if (s.fieldIds) {
        s.fieldIds = s.fieldIds.filter(id => id !== fieldId)
      }
    })

    // Add to target section
    if (!section.fieldIds) {
      section.fieldIds = []
    }
    section.fieldIds.push(fieldId)

    return true
  }

  /**
   * Remove field from section
   */
  function removeFieldFromSection(fieldId, sectionId) {
    if (!schema.value?.sections) return false

    const section = schema.value.sections.find(s => s.id === sectionId)
    if (!section?.fieldIds) return false

    section.fieldIds = section.fieldIds.filter(id => id !== fieldId)
    return true
  }

  /**
   * Move field within section
   */
  function moveFieldInSection(sectionId, fieldId, direction) {
    if (!schema.value?.sections) return false

    const section = schema.value.sections.find(s => s.id === sectionId)
    if (!section?.fieldIds) return false

    const index = section.fieldIds.indexOf(fieldId)
    if (index === -1) return false

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= section.fieldIds.length) return false

    // Swap
    const temp = section.fieldIds[index]
    section.fieldIds[index] = section.fieldIds[newIndex]
    section.fieldIds[newIndex] = temp

    return true
  }

  /**
   * Get section progress (for multi-step forms)
   */
  function getSectionProgress(sectionId, formValues, validate) {
    const section = sections.value.find(s => s.id === sectionId)
    if (!section) return { total: 0, completed: 0, percentage: 0 }

    const requiredFields = section.fields.filter(f => f.required)
    const total = requiredFields.length

    if (total === 0) return { total: 0, completed: 0, percentage: 100 }

    let completed = 0
    requiredFields.forEach(field => {
      const value = formValues[field.id]
      const errors = validate ? validate(field, value) : []
      if (errors.length === 0 && value !== undefined && value !== '' && value !== null) {
        completed++
      }
    })

    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100)
    }
  }

  return {
    sections,
    expandedSections,
    createSection,
    isSectionExpanded,
    toggleSection,
    expandAll,
    collapseAll,
    addFieldToSection,
    removeFieldFromSection,
    moveFieldInSection,
    getSectionProgress
  }
}
