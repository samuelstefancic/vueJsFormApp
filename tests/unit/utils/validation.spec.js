import { describe, it, expect } from 'vitest'
import { validate, validateSchema } from '../../../src/utils/validation'

describe('validation utilities', () => {
  describe('validate', () => {
    it('should return empty errors for empty schema', () => {
      const errors = validate({}, { fields: [] })
      expect(errors).toEqual({})
    })

    it('should validate required text field', () => {
      const schema = {
        fields: [{
          id: 'f1',
          type: 'text',
          name: 'name',
          label: 'Name',
          required: true
        }]
      }

      const errors = validate({ f1: '' }, schema)
      expect(errors.f1).toContain('Champ requis')
    })

    it('should pass valid required text field', () => {
      const schema = {
        fields: [{
          id: 'f1',
          type: 'text',
          name: 'name',
          label: 'Name',
          required: true
        }]
      }

      const errors = validate({ f1: 'John' }, schema)
      expect(errors.f1).toBeUndefined()
    })

    it('should validate number min/max', () => {
      const schema = {
        fields: [{
          id: 'f1',
          type: 'number',
          name: 'age',
          label: 'Age',
          required: false,
          min: 0,
          max: 120
        }]
      }

      const errorsMin = validate({ f1: -5 }, schema)
      expect(errorsMin.f1).toContain('Minimum: 0')

      const errorsMax = validate({ f1: 150 }, schema)
      expect(errorsMax.f1).toContain('Maximum: 120')

      const noErrors = validate({ f1: 25 }, schema)
      expect(noErrors.f1).toBeUndefined()
    })

    it('should validate select options', () => {
      const schema = {
        fields: [{
          id: 'f1',
          type: 'select',
          name: 'color',
          label: 'Color',
          required: true,
          options: [
            { value: 'red', label: 'Red' },
            { value: 'blue', label: 'Blue' }
          ]
        }]
      }

      const errors = validate({ f1: 'green' }, schema)
      expect(errors.f1).toContain('Option invalide')

      const noErrors = validate({ f1: 'red' }, schema)
      expect(noErrors.f1).toBeUndefined()
    })

    it('should validate date format', () => {
      const schema = {
        fields: [{
          id: 'f1',
          type: 'date',
          name: 'birthday',
          label: 'Birthday',
          required: false
        }]
      }

      const errors = validate({ f1: 'not-a-date' }, schema)
      expect(errors.f1).toContain('Date invalide')

      const noErrors = validate({ f1: '2024-01-15' }, schema)
      expect(noErrors.f1).toBeUndefined()
    })
  })

  describe('validateSchema', () => {
    it('should reject non-object schema', () => {
      const result = validateSchema(null)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('JSON invalide')
    })

    it('should validate schema with version, title and fields', () => {
      const validSchema = {
        version: 1,
        title: 'Test Form',
        fields: []
      }
      const result = validateSchema(validSchema)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject schema without version', () => {
      const result = validateSchema({
        title: 'Test',
        fields: []
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('"version" manquant')
    })

    it('should reject schema with invalid fields array', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: 'not an array'
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('"fields" doit être un tableau')
    })

    it('should validate field structure', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [{
          id: 'f1',
          type: 'text',
          name: 'field1',
          label: 'Field 1'
        }]
      })
      expect(result.valid).toBe(true)
    })

    it('should reject field with invalid type', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [{
          id: 'f1',
          type: 'invalid_type',
          name: 'field1',
          label: 'Field 1'
        }]
      })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('type invalide'))).toBe(true)
    })

    it('should reject duplicate field ids', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [
          { id: 'same', type: 'text', name: 'field1', label: 'Field 1' },
          { id: 'same', type: 'text', name: 'field2', label: 'Field 2' }
        ]
      })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('id dupliqué'))).toBe(true)
    })

    it('should reject duplicate field names', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [
          { id: 'f1', type: 'text', name: 'same_name', label: 'Field 1' },
          { id: 'f2', type: 'text', name: 'same_name', label: 'Field 2' }
        ]
      })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('nom dupliqué'))).toBe(true)
    })

    it('should validate select field options', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [{
          id: 'f1',
          type: 'select',
          name: 'dropdown',
          label: 'Dropdown',
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' }
          ]
        }]
      })
      expect(result.valid).toBe(true)
    })

    it('should reject select without options', () => {
      const result = validateSchema({
        version: 1,
        title: 'Test',
        fields: [{
          id: 'f1',
          type: 'select',
          name: 'dropdown',
          label: 'Dropdown'
        }]
      })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('options manquantes'))).toBe(true)
    })
  })
})
