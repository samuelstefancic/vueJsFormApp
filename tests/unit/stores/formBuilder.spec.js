import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormBuilderStore } from '../../../src/stores/formBuilder'

describe('formBuilder store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFormBuilderStore()
  })

  describe('initial state', () => {
    it('should have initial schema with version, title and empty fields', () => {
      expect(store.schema.version).toBe(1)
      expect(store.schema.title).toBe('Nouveau formulaire')
      expect(store.schema.fields).toEqual([])
    })

    it('should have no selected field initially', () => {
      expect(store.selectedFieldId).toBeNull()
      expect(store.selectedField).toBeNull()
    })
  })

  describe('addField', () => {
    it('should add a text field', () => {
      store.addField('text')
      expect(store.schema.fields).toHaveLength(1)
      expect(store.schema.fields[0].type).toBe('text')
      expect(store.schema.fields[0].label).toBe('Champ texte')
    })

    it('should add an email field', () => {
      store.addField('email')
      expect(store.schema.fields).toHaveLength(1)
      expect(store.schema.fields[0].type).toBe('email')
      expect(store.schema.fields[0].placeholder).toBe('exemple@domaine.com')
    })

    it('should add a rating field with maxRating', () => {
      store.addField('rating')
      expect(store.schema.fields).toHaveLength(1)
      expect(store.schema.fields[0].type).toBe('rating')
      expect(store.schema.fields[0].maxRating).toBe(5)
    })

    it('should add a slider field with min/max/step', () => {
      store.addField('slider')
      expect(store.schema.fields).toHaveLength(1)
      expect(store.schema.fields[0].type).toBe('slider')
      expect(store.schema.fields[0].min).toBe(0)
      expect(store.schema.fields[0].max).toBe(100)
      expect(store.schema.fields[0].step).toBe(1)
    })

    it('should select the newly added field', () => {
      store.addField('text')
      expect(store.selectedFieldId).toBe(store.schema.fields[0].id)
    })

    it('should generate unique names for same field types', () => {
      store.addField('text')
      store.addField('text')
      const names = store.schema.fields.map(f => f.name)
      expect(new Set(names).size).toBe(names.length)
    })
  })

  describe('removeField', () => {
    beforeEach(() => {
      store.addField('text')
      store.addField('email')
    })

    it('should remove a field by id', () => {
      const idToRemove = store.schema.fields[0].id
      store.removeField(idToRemove)
      expect(store.schema.fields).toHaveLength(1)
      expect(store.schema.fields[0].type).toBe('email')
    })

    it('should select next field after removing selected field', () => {
      const firstId = store.schema.fields[0].id
      store.selectField(firstId)
      store.removeField(firstId)
      expect(store.selectedFieldId).toBe(store.schema.fields[0].id)
    })

    it('should set selectedFieldId to null when removing last field', () => {
      store.removeField(store.schema.fields[0].id)
      store.removeField(store.schema.fields[0].id)
      expect(store.selectedFieldId).toBeNull()
    })
  })

  describe('duplicateField', () => {
    it('should create a copy of the field', () => {
      store.addField('text')
      const originalId = store.schema.fields[0].id
      store.duplicateField(originalId)

      expect(store.schema.fields).toHaveLength(2)
      expect(store.schema.fields[1].type).toBe('text')
      expect(store.schema.fields[1].label).toContain('(copie)')
    })

    it('should generate unique id for duplicated field', () => {
      store.addField('text')
      const originalId = store.schema.fields[0].id
      store.duplicateField(originalId)

      expect(store.schema.fields[0].id).not.toBe(store.schema.fields[1].id)
    })
  })

  describe('moveField', () => {
    beforeEach(() => {
      store.addField('text')
      store.addField('email')
      store.addField('number')
    })

    it('should move field up', () => {
      const middleId = store.schema.fields[1].id
      store.moveField(middleId, 'up')
      expect(store.schema.fields[0].id).toBe(middleId)
    })

    it('should move field down', () => {
      const middleId = store.schema.fields[1].id
      store.moveField(middleId, 'down')
      expect(store.schema.fields[2].id).toBe(middleId)
    })

    it('should not move first field up', () => {
      const firstId = store.schema.fields[0].id
      const originalOrder = [...store.schema.fields.map(f => f.id)]
      store.moveField(firstId, 'up')
      expect(store.schema.fields.map(f => f.id)).toEqual(originalOrder)
    })
  })

  describe('importSchema', () => {
    it('should import valid schema', () => {
      const validSchema = JSON.stringify({
        version: 1,
        title: 'Test Form',
        fields: [{
          id: 'f1',
          type: 'text',
          name: 'test_field',
          label: 'Test Field',
          required: false
        }]
      })

      const result = store.importSchema(validSchema)
      expect(result).toBe(true)
      expect(store.schema.title).toBe('Test Form')
      expect(store.schema.fields).toHaveLength(1)
    })

    it('should reject invalid JSON', () => {
      const result = store.importSchema('not valid json')
      expect(result).toBe(false)
    })

    it('should reject schema without required fields', () => {
      const invalidSchema = JSON.stringify({
        title: 'Missing version',
        fields: []
      })
      const result = store.importSchema(invalidSchema)
      expect(result).toBe(false)
    })
  })

  describe('exportSchema', () => {
    it('should export schema as JSON string', () => {
      store.addField('text')
      const exported = store.exportSchema()
      const parsed = JSON.parse(exported)

      expect(parsed.version).toBe(1)
      expect(parsed.fields).toHaveLength(1)
    })
  })

  describe('reset', () => {
    it('should reset to initial state', () => {
      store.addField('text')
      store.addField('email')
      store.updateTitle('My Form')

      store.reset()

      expect(store.schema.title).toBe('Nouveau formulaire')
      expect(store.schema.fields).toHaveLength(0)
      expect(store.selectedFieldId).toBeNull()
    })
  })

  describe('getters', () => {
    it('fieldCount should return correct count', () => {
      expect(store.fieldCount).toBe(0)
      store.addField('text')
      expect(store.fieldCount).toBe(1)
      store.addField('email')
      expect(store.fieldCount).toBe(2)
    })

    it('hasFields should return correct boolean', () => {
      expect(store.hasFields).toBe(false)
      store.addField('text')
      expect(store.hasFields).toBe(true)
    })

    it('fieldNames should return array of names', () => {
      store.addField('text')
      store.addField('email')
      expect(store.fieldNames).toHaveLength(2)
      expect(store.fieldNames.every(n => typeof n === 'string')).toBe(true)
    })
  })
})
