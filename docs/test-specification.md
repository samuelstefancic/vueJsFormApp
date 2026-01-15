# Test Specification

> 🧪 **Author:** Murat (Master Test Architect Agent)
> **Scope:** Complete test coverage for all 14 field types
> **Frameworks:** Angular (Jasmine/Jest) + Spring Boot (JUnit 5)

---

## Test Strategy Overview

```
                        ▲
                       / \
                      / E2E \           Critical user flows
                     /───────\          (Cypress/Playwright)
                    /         \
                   / Integration\       API + Component integration
                  /─────────────\       (TestBed, MockMvc)
                 /               \
                /    Unit Tests   \     All 14 field types
               /───────────────────\    (Jasmine, JUnit)
```

**Test Distribution Target:**
| Level | Coverage Target | Count |
|-------|-----------------|-------|
| Unit | 80%+ | ~150 tests |
| Integration | Key flows | ~30 tests |
| E2E | Critical paths | ~10 tests |

---

## Angular Unit Tests

### Test File Structure

```
src/app/form-builder/
├── services/
│   ├── field-factory.service.spec.ts
│   ├── form-builder.service.spec.ts
│   ├── validation.service.spec.ts
│   └── form-api.service.spec.ts
│
├── components/
│   ├── builder/
│   │   ├── field-palette/field-palette.component.spec.ts
│   │   ├── form-canvas/form-canvas.component.spec.ts
│   │   ├── field-item/field-item.component.spec.ts
│   │   └── properties-panel/properties-panel.component.spec.ts
│   │
│   ├── preview/
│   │   └── form-renderer/form-renderer.component.spec.ts
│   │
│   └── shared/
│       ├── base-input/base-input.component.spec.ts
│       └── ...
```

---

### FieldFactoryService Tests

```typescript
// field-factory.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FieldFactoryService } from './field-factory.service';
import { FieldType } from '../models/field.model';

describe('FieldFactoryService', () => {
  let service: FieldFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldFactoryService);
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = service.generateId();
      const id2 = service.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should follow f_{timestamp}_{counter} pattern', () => {
      const id = service.generateId();
      expect(id).toMatch(/^f_\d+_\d+$/);
    });
  });

  describe('createField', () => {
    // Test ALL 14 field types
    const fieldTypes: FieldType[] = [
      'text', 'textarea', 'number', 'email', 'phone', 'url',
      'select', 'radio', 'multiselect', 'checkbox',
      'date', 'time', 'rating', 'slider'
    ];

    fieldTypes.forEach((type) => {
      it(`should create ${type} field with required properties`, () => {
        const field = service.createField(type);

        expect(field.id).toBeTruthy();
        expect(field.type).toBe(type);
        expect(field.name).toBeTruthy();
        expect(field.label).toBeTruthy();
        expect(field.required).toBe(false);
      });
    });

    // Type-specific tests
    it('should create text field with placeholder', () => {
      const field = service.createField('text');
      expect(field.placeholder).toBeDefined();
    });

    it('should create email field with email placeholder', () => {
      const field = service.createField('email');
      expect(field.placeholder).toContain('@');
    });

    it('should create select field with empty options array', () => {
      const field = service.createField('select');
      expect(field.options).toEqual([]);
    });

    it('should create radio field with empty options array', () => {
      const field = service.createField('radio');
      expect(field.options).toEqual([]);
    });

    it('should create multiselect field with empty options and array default', () => {
      const field = service.createField('multiselect');
      expect(field.options).toEqual([]);
      expect(field.defaultValue).toEqual([]);
    });

    it('should create checkbox field with false default', () => {
      const field = service.createField('checkbox');
      expect(field.defaultValue).toBe(false);
    });

    it('should create number field with null min/max', () => {
      const field = service.createField('number');
      expect(field.min).toBeNull();
      expect(field.max).toBeNull();
    });

    it('should create rating field with maxRating 5', () => {
      const field = service.createField('rating');
      expect(field.maxRating).toBe(5);
      expect(field.defaultValue).toBe(0);
    });

    it('should create slider field with 0-100 range', () => {
      const field = service.createField('slider');
      expect(field.min).toBe(0);
      expect(field.max).toBe(100);
      expect(field.step).toBe(1);
      expect(field.defaultValue).toBe(50);
    });

    it('should create date field with date placeholder', () => {
      const field = service.createField('date');
      expect(field.placeholder).toBeTruthy();
    });

    it('should create time field with time placeholder', () => {
      const field = service.createField('time');
      expect(field.placeholder).toBe('HH:MM');
    });
  });

  describe('cloneField', () => {
    it('should create copy with new ID', () => {
      const original = service.createField('text');
      const clone = service.cloneField(original);

      expect(clone.id).not.toBe(original.id);
      expect(clone.type).toBe(original.type);
    });

    it('should append (copy) to label', () => {
      const original = service.createField('text');
      original.label = 'Test Field';
      const clone = service.cloneField(original);

      expect(clone.label).toContain('(copy)');
    });

    it('should deep clone options for select fields', () => {
      const original = service.createField('select');
      original.options = [{ value: 'a', label: 'A' }];
      const clone = service.cloneField(original);

      clone.options![0].label = 'Modified';
      expect(original.options![0].label).toBe('A');
    });
  });
});
```

---

### FormBuilderService Tests

```typescript
// form-builder.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FormBuilderService } from './form-builder.service';
import { FieldFactoryService } from './field-factory.service';

describe('FormBuilderService', () => {
  let service: FormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilderService, FieldFactoryService]
    });
    service = TestBed.inject(FormBuilderService);
  });

  describe('initial state', () => {
    it('should have schema with version 1', () => {
      expect(service.schema.version).toBe(1);
    });

    it('should have default title', () => {
      expect(service.schema.title).toBe('New Form');
    });

    it('should have empty fields array', () => {
      expect(service.schema.fields).toEqual([]);
    });

    it('should have no selected field', () => {
      expect(service.selectedFieldId).toBeNull();
      expect(service.selectedField).toBeNull();
    });
  });

  describe('addField', () => {
    it('should add field to schema', () => {
      service.addField('text');
      expect(service.schema.fields.length).toBe(1);
      expect(service.schema.fields[0].type).toBe('text');
    });

    it('should auto-select new field', () => {
      service.addField('text');
      expect(service.selectedFieldId).toBe(service.schema.fields[0].id);
    });

    it('should mark form as dirty', (done) => {
      service.isDirty$.subscribe((dirty) => {
        if (dirty) {
          expect(dirty).toBe(true);
          done();
        }
      });
      service.addField('text');
    });

    it('should generate unique names for same type', () => {
      service.addField('text');
      service.addField('text');
      const names = service.schema.fields.map(f => f.name);
      expect(new Set(names).size).toBe(2);
    });
  });

  describe('removeField', () => {
    beforeEach(() => {
      service.addField('text');
      service.addField('email');
      service.addField('number');
    });

    it('should remove field by ID', () => {
      const idToRemove = service.schema.fields[0].id;
      service.removeField(idToRemove);
      expect(service.schema.fields.length).toBe(2);
      expect(service.schema.fields.find(f => f.id === idToRemove)).toBeUndefined();
    });

    it('should select next field when removing selected', () => {
      const firstId = service.schema.fields[0].id;
      const secondId = service.schema.fields[1].id;
      service.selectField(firstId);
      service.removeField(firstId);
      expect(service.selectedFieldId).toBe(secondId);
    });

    it('should select previous field when removing last', () => {
      const lastId = service.schema.fields[2].id;
      const previousId = service.schema.fields[1].id;
      service.selectField(lastId);
      service.removeField(lastId);
      expect(service.selectedFieldId).toBe(previousId);
    });

    it('should clear selection when removing only field', () => {
      service.schema.fields.forEach(f => service.removeField(f.id));
      service.addField('text');
      const onlyId = service.schema.fields[0].id;
      service.removeField(onlyId);
      expect(service.selectedFieldId).toBeNull();
    });
  });

  describe('duplicateField', () => {
    it('should create copy after original', () => {
      service.addField('text');
      const originalId = service.schema.fields[0].id;
      service.duplicateField(originalId);

      expect(service.schema.fields.length).toBe(2);
      expect(service.schema.fields[1].type).toBe('text');
    });

    it('should select duplicated field', () => {
      service.addField('text');
      service.duplicateField(service.schema.fields[0].id);

      expect(service.selectedFieldId).toBe(service.schema.fields[1].id);
    });

    it('should deep clone options', () => {
      service.addField('select');
      service.updateField(service.schema.fields[0].id, {
        options: [{ value: 'a', label: 'A' }]
      });
      service.duplicateField(service.schema.fields[0].id);

      expect(service.schema.fields[1].options).toEqual([{ value: 'a', label: 'A' }]);
    });
  });

  describe('moveField', () => {
    beforeEach(() => {
      service.addField('text');
      service.addField('email');
      service.addField('number');
    });

    it('should move field up', () => {
      const middleId = service.schema.fields[1].id;
      service.moveField(middleId, 'up');
      expect(service.schema.fields[0].id).toBe(middleId);
    });

    it('should move field down', () => {
      const middleId = service.schema.fields[1].id;
      service.moveField(middleId, 'down');
      expect(service.schema.fields[2].id).toBe(middleId);
    });

    it('should not move first field up', () => {
      const firstId = service.schema.fields[0].id;
      const originalOrder = service.schema.fields.map(f => f.id);
      service.moveField(firstId, 'up');
      expect(service.schema.fields.map(f => f.id)).toEqual(originalOrder);
    });

    it('should not move last field down', () => {
      const lastId = service.schema.fields[2].id;
      const originalOrder = service.schema.fields.map(f => f.id);
      service.moveField(lastId, 'down');
      expect(service.schema.fields.map(f => f.id)).toEqual(originalOrder);
    });
  });

  describe('importSchema', () => {
    it('should import valid schema', () => {
      const validSchema = JSON.stringify({
        version: 1,
        title: 'Imported Form',
        fields: [{
          id: 'f1',
          type: 'text',
          name: 'test',
          label: 'Test',
          required: false
        }]
      });

      const result = service.importSchema(validSchema);
      expect(result).toBe(true);
      expect(service.schema.title).toBe('Imported Form');
    });

    it('should reject invalid JSON', () => {
      const result = service.importSchema('not json');
      expect(result).toBe(false);
    });

    it('should reject schema without version', () => {
      const result = service.importSchema(JSON.stringify({
        title: 'No Version',
        fields: []
      }));
      expect(result).toBe(false);
    });

    it('should reject schema without fields array', () => {
      const result = service.importSchema(JSON.stringify({
        version: 1,
        title: 'No Fields'
      }));
      expect(result).toBe(false);
    });
  });

  describe('exportSchema', () => {
    it('should export valid JSON', () => {
      service.addField('text');
      const exported = service.exportSchema();
      const parsed = JSON.parse(exported);

      expect(parsed.version).toBe(1);
      expect(parsed.fields.length).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      service.addField('text');
      service.updateTitle('Modified Title');
      service.reset();

      expect(service.schema.title).toBe('New Form');
      expect(service.schema.fields).toEqual([]);
      expect(service.selectedFieldId).toBeNull();
    });
  });
});
```

---

### ValidationService Tests (All 14 Types)

```typescript
// validation.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { FormSchema, Field } from '../models/field.model';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  // Helper to create test schema
  function createSchema(field: Partial<Field>): FormSchema {
    return {
      version: 1,
      title: 'Test',
      fields: [{
        id: 'test_field',
        type: 'text',
        name: 'test',
        label: 'Test',
        required: false,
        ...field
      } as Field]
    };
  }

  // ============ REQUIRED VALIDATION ============

  describe('required validation', () => {
    it('should fail for empty string when required', () => {
      const schema = createSchema({ type: 'text', required: true });
      const errors = service.validate({ test_field: '' }, schema);
      expect(errors['test_field']).toContain('Ce champ est requis');
    });

    it('should fail for null when required', () => {
      const schema = createSchema({ type: 'text', required: true });
      const errors = service.validate({ test_field: null }, schema);
      expect(errors['test_field']).toContain('Ce champ est requis');
    });

    it('should pass for non-empty when required', () => {
      const schema = createSchema({ type: 'text', required: true });
      const errors = service.validate({ test_field: 'value' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should pass for empty when not required', () => {
      const schema = createSchema({ type: 'text', required: false });
      const errors = service.validate({ test_field: '' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });
  });

  // ============ TEXT VALIDATION ============

  describe('text field validation', () => {
    it('should validate minLength', () => {
      const schema = createSchema({ type: 'text', minLength: 5 });
      const errors = service.validate({ test_field: 'abc' }, schema);
      expect(errors['test_field']).toContain('Min. 5 caractères');
    });

    it('should validate maxLength', () => {
      const schema = createSchema({ type: 'text', maxLength: 5 });
      const errors = service.validate({ test_field: 'abcdefgh' }, schema);
      expect(errors['test_field']).toContain('Max. 5 caractères');
    });

    it('should pass valid length', () => {
      const schema = createSchema({ type: 'text', minLength: 2, maxLength: 10 });
      const errors = service.validate({ test_field: 'hello' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });
  });

  // ============ NUMBER VALIDATION ============

  describe('number field validation', () => {
    it('should fail for non-numeric value', () => {
      const schema = createSchema({ type: 'number' });
      const errors = service.validate({ test_field: 'abc' }, schema);
      expect(errors['test_field']).toContain('Nombre invalide');
    });

    it('should validate min value', () => {
      const schema = createSchema({ type: 'number', min: 10 });
      const errors = service.validate({ test_field: 5 }, schema);
      expect(errors['test_field']).toContain('Minimum: 10');
    });

    it('should validate max value', () => {
      const schema = createSchema({ type: 'number', max: 10 });
      const errors = service.validate({ test_field: 15 }, schema);
      expect(errors['test_field']).toContain('Maximum: 10');
    });

    it('should pass valid number in range', () => {
      const schema = createSchema({ type: 'number', min: 1, max: 100 });
      const errors = service.validate({ test_field: 50 }, schema);
      expect(errors['test_field']).toBeUndefined();
    });
  });

  // ============ EMAIL VALIDATION ============

  describe('email field validation', () => {
    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
      'spaces in@email.com'
    ];

    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'user+tag@company.co.uk'
    ];

    invalidEmails.forEach((email) => {
      it(`should reject invalid email: ${email}`, () => {
        const schema = createSchema({ type: 'email' });
        const errors = service.validate({ test_field: email }, schema);
        expect(errors['test_field']).toContain('Email invalide');
      });
    });

    validEmails.forEach((email) => {
      it(`should accept valid email: ${email}`, () => {
        const schema = createSchema({ type: 'email' });
        const errors = service.validate({ test_field: email }, schema);
        expect(errors['test_field']).toBeUndefined();
      });
    });
  });

  // ============ PHONE VALIDATION ============

  describe('phone field validation', () => {
    const validPhones = [
      '+33 6 12 34 56 78',
      '06 12 34 56 78',
      '+1 555 123 4567',
      '0612345678'
    ];

    const invalidPhones = [
      '12345',  // too short
      'not a phone'
    ];

    validPhones.forEach((phone) => {
      it(`should accept valid phone: ${phone}`, () => {
        const schema = createSchema({ type: 'phone' });
        const errors = service.validate({ test_field: phone }, schema);
        expect(errors['test_field']).toBeUndefined();
      });
    });

    invalidPhones.forEach((phone) => {
      it(`should reject invalid phone: ${phone}`, () => {
        const schema = createSchema({ type: 'phone' });
        const errors = service.validate({ test_field: phone }, schema);
        expect(errors['test_field']).toContain('Numéro de téléphone invalide');
      });
    });
  });

  // ============ URL VALIDATION ============

  describe('url field validation', () => {
    const validUrls = [
      'https://example.com',
      'http://example.com',
      'example.com',
      'www.example.com/path'
    ];

    const invalidUrls = [
      'not a url',
      'ftp://invalid'
    ];

    validUrls.forEach((url) => {
      it(`should accept valid URL: ${url}`, () => {
        const schema = createSchema({ type: 'url' });
        const errors = service.validate({ test_field: url }, schema);
        expect(errors['test_field']).toBeUndefined();
      });
    });

    invalidUrls.forEach((url) => {
      it(`should reject invalid URL: ${url}`, () => {
        const schema = createSchema({ type: 'url' });
        const errors = service.validate({ test_field: url }, schema);
        expect(errors['test_field']).toContain('URL invalide');
      });
    });
  });

  // ============ SELECT VALIDATION ============

  describe('select field validation', () => {
    it('should accept valid option', () => {
      const schema = createSchema({
        type: 'select',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const errors = service.validate({ test_field: 'a' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject invalid option', () => {
      const schema = createSchema({
        type: 'select',
        options: [{ value: 'a', label: 'A' }]
      });
      const errors = service.validate({ test_field: 'invalid' }, schema);
      expect(errors['test_field']).toContain('Option invalide');
    });
  });

  // ============ RADIO VALIDATION ============

  describe('radio field validation', () => {
    it('should accept valid option', () => {
      const schema = createSchema({
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      });
      const errors = service.validate({ test_field: 'yes' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject invalid option', () => {
      const schema = createSchema({
        type: 'radio',
        options: [{ value: 'yes', label: 'Yes' }]
      });
      const errors = service.validate({ test_field: 'maybe' }, schema);
      expect(errors['test_field']).toContain('Option invalide');
    });
  });

  // ============ MULTISELECT VALIDATION ============

  describe('multiselect field validation', () => {
    it('should accept valid options array', () => {
      const schema = createSchema({
        type: 'multiselect',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const errors = service.validate({ test_field: ['a', 'b'] }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject invalid option in array', () => {
      const schema = createSchema({
        type: 'multiselect',
        options: [{ value: 'a', label: 'A' }]
      });
      const errors = service.validate({ test_field: ['a', 'invalid'] }, schema);
      expect(errors['test_field']).toContain('Option(s) invalide(s)');
    });

    it('should require at least one when required', () => {
      const schema = createSchema({
        type: 'multiselect',
        required: true,
        options: [{ value: 'a', label: 'A' }]
      });
      const errors = service.validate({ test_field: [] }, schema);
      expect(errors['test_field']).toContain('Ce champ est requis');
    });
  });

  // ============ CHECKBOX VALIDATION ============

  describe('checkbox field validation', () => {
    it('should pass when checked and required', () => {
      const schema = createSchema({ type: 'checkbox', required: true });
      const errors = service.validate({ test_field: true }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should fail when unchecked and required', () => {
      const schema = createSchema({ type: 'checkbox', required: true });
      const errors = service.validate({ test_field: false }, schema);
      expect(errors['test_field']).toContain('Ce champ est requis');
    });
  });

  // ============ DATE VALIDATION ============

  describe('date field validation', () => {
    it('should accept valid date', () => {
      const schema = createSchema({ type: 'date' });
      const errors = service.validate({ test_field: '2024-01-15' }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject invalid date', () => {
      const schema = createSchema({ type: 'date' });
      const errors = service.validate({ test_field: 'not-a-date' }, schema);
      expect(errors['test_field']).toContain('Date invalide');
    });
  });

  // ============ TIME VALIDATION ============

  describe('time field validation', () => {
    const validTimes = ['09:30', '23:59', '00:00', '12:00'];
    const invalidTimes = ['25:00', '9:30', '12:60', 'noon'];

    validTimes.forEach((time) => {
      it(`should accept valid time: ${time}`, () => {
        const schema = createSchema({ type: 'time' });
        const errors = service.validate({ test_field: time }, schema);
        expect(errors['test_field']).toBeUndefined();
      });
    });

    invalidTimes.forEach((time) => {
      it(`should reject invalid time: ${time}`, () => {
        const schema = createSchema({ type: 'time' });
        const errors = service.validate({ test_field: time }, schema);
        expect(errors['test_field']).toContain('Format invalide (HH:MM)');
      });
    });
  });

  // ============ RATING VALIDATION ============

  describe('rating field validation', () => {
    it('should accept valid rating', () => {
      const schema = createSchema({ type: 'rating', maxRating: 5 });
      const errors = service.validate({ test_field: 4 }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject rating below 1', () => {
      const schema = createSchema({ type: 'rating', maxRating: 5 });
      const errors = service.validate({ test_field: 0 }, schema);
      expect(errors['test_field']).toContain('Notation entre 1 et 5');
    });

    it('should reject rating above maxRating', () => {
      const schema = createSchema({ type: 'rating', maxRating: 5 });
      const errors = service.validate({ test_field: 6 }, schema);
      expect(errors['test_field']).toContain('Notation entre 1 et 5');
    });

    it('should respect custom maxRating', () => {
      const schema = createSchema({ type: 'rating', maxRating: 10 });
      const errors = service.validate({ test_field: 8 }, schema);
      expect(errors['test_field']).toBeUndefined();
    });
  });

  // ============ SLIDER VALIDATION ============

  describe('slider field validation', () => {
    it('should accept value within range', () => {
      const schema = createSchema({ type: 'slider', min: 0, max: 100 });
      const errors = service.validate({ test_field: 50 }, schema);
      expect(errors['test_field']).toBeUndefined();
    });

    it('should reject value below min', () => {
      const schema = createSchema({ type: 'slider', min: 10, max: 100 });
      const errors = service.validate({ test_field: 5 }, schema);
      expect(errors['test_field']).toContain('Minimum: 10');
    });

    it('should reject value above max', () => {
      const schema = createSchema({ type: 'slider', min: 0, max: 50 });
      const errors = service.validate({ test_field: 75 }, schema);
      expect(errors['test_field']).toContain('Maximum: 50');
    });

    it('should handle edge values', () => {
      const schema = createSchema({ type: 'slider', min: 0, max: 100 });
      expect(service.validate({ test_field: 0 }, schema)['test_field']).toBeUndefined();
      expect(service.validate({ test_field: 100 }, schema)['test_field']).toBeUndefined();
    });
  });
});
```

---

## Spring Boot Tests (JUnit 5)

### ValidationService Tests

```java
// ValidationServiceTest.java
package com.yourcompany.formsapi.service;

import com.yourcompany.formsapi.dto.ValidationResultDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

class ValidationServiceTest {

    private ValidationService validationService;

    @BeforeEach
    void setUp() {
        validationService = new ValidationService();
    }

    private Map<String, Object> createSchema(Map<String, Object> field) {
        Map<String, Object> defaultField = new HashMap<>();
        defaultField.put("id", "test_field");
        defaultField.put("type", "text");
        defaultField.put("name", "test");
        defaultField.put("label", "Test");
        defaultField.put("required", false);
        defaultField.putAll(field);

        return Map.of(
            "version", 1,
            "title", "Test Form",
            "fields", List.of(defaultField)
        );
    }

    @Nested
    @DisplayName("Required Validation")
    class RequiredValidation {

        @Test
        void shouldFailForEmptyStringWhenRequired() {
            var schema = createSchema(Map.of("required", true));
            var result = validationService.validateSubmission(
                Map.of("test_field", ""),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Ce champ est requis");
        }

        @Test
        void shouldPassForNonEmptyWhenRequired() {
            var schema = createSchema(Map.of("required", true));
            var result = validationService.validateSubmission(
                Map.of("test_field", "value"),
                schema
            );
            assertThat(result.getErrors()).isEmpty();
        }
    }

    @Nested
    @DisplayName("Email Validation")
    class EmailValidation {

        @ParameterizedTest
        @ValueSource(strings = {
            "test@example.com",
            "user.name@domain.org",
            "user+tag@company.co.uk"
        })
        void shouldAcceptValidEmails(String email) {
            var schema = createSchema(Map.of("type", "email"));
            var result = validationService.validateSubmission(
                Map.of("test_field", email),
                schema
            );
            assertThat(result.getErrors()).isEmpty();
        }

        @ParameterizedTest
        @ValueSource(strings = {
            "notanemail",
            "missing@domain",
            "@nodomain.com"
        })
        void shouldRejectInvalidEmails(String email) {
            var schema = createSchema(Map.of("type", "email"));
            var result = validationService.validateSubmission(
                Map.of("test_field", email),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Email invalide");
        }
    }

    @Nested
    @DisplayName("Number Validation")
    class NumberValidation {

        @Test
        void shouldValidateMinValue() {
            var schema = createSchema(Map.of(
                "type", "number",
                "min", 10
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", 5),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Minimum: 10");
        }

        @Test
        void shouldValidateMaxValue() {
            var schema = createSchema(Map.of(
                "type", "number",
                "max", 10
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", 15),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Maximum: 10");
        }
    }

    @Nested
    @DisplayName("Rating Validation")
    class RatingValidation {

        @Test
        void shouldAcceptValidRating() {
            var schema = createSchema(Map.of(
                "type", "rating",
                "maxRating", 5
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", 4),
                schema
            );
            assertThat(result.getErrors()).isEmpty();
        }

        @Test
        void shouldRejectRatingAboveMax() {
            var schema = createSchema(Map.of(
                "type", "rating",
                "maxRating", 5
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", 6),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Notation entre 1 et 5");
        }
    }

    @Nested
    @DisplayName("Multiselect Validation")
    class MultiselectValidation {

        @Test
        void shouldAcceptValidOptionsArray() {
            var schema = createSchema(Map.of(
                "type", "multiselect",
                "options", List.of(
                    Map.of("value", "a", "label", "A"),
                    Map.of("value", "b", "label", "B")
                )
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", List.of("a", "b")),
                schema
            );
            assertThat(result.getErrors()).isEmpty();
        }

        @Test
        void shouldRejectInvalidOptionInArray() {
            var schema = createSchema(Map.of(
                "type", "multiselect",
                "options", List.of(
                    Map.of("value", "a", "label", "A")
                )
            ));
            var result = validationService.validateSubmission(
                Map.of("test_field", List.of("a", "invalid")),
                schema
            );
            assertThat(result.getErrors().get("test_field"))
                .contains("Option(s) invalide(s)");
        }
    }
}
```

---

## E2E Tests (Cypress/Playwright)

```typescript
// e2e/form-builder.spec.ts
describe('Form Builder E2E', () => {

  beforeEach(() => {
    cy.visit('/forms');
  });

  describe('Create Form Flow', () => {
    it('should create a form with all field types', () => {
      // Add each field type
      const fieldTypes = [
        'text', 'textarea', 'number', 'email', 'phone', 'url',
        'select', 'radio', 'multiselect', 'checkbox',
        'date', 'time', 'rating', 'slider'
      ];

      fieldTypes.forEach((type) => {
        cy.get(`[data-testid="add-field-${type}"]`).click();
      });

      // Verify all fields added
      cy.get('[data-testid="field-item"]').should('have.length', 14);
    });

    it('should save and load form', () => {
      // Add a text field
      cy.get('[data-testid="add-field-text"]').click();

      // Configure field
      cy.get('[data-testid="field-label-input"]').clear().type('Test Field');

      // Save form
      cy.get('[data-testid="save-form"]').click();

      // Reload page
      cy.reload();

      // Open saved forms
      cy.get('[data-testid="saved-forms-btn"]').click();

      // Load form
      cy.get('[data-testid="load-form"]').first().click();

      // Verify field exists
      cy.get('[data-testid="field-item"]').should('have.length', 1);
    });
  });

  describe('Preview and Submit Flow', () => {
    it('should validate required fields', () => {
      // Add required text field
      cy.get('[data-testid="add-field-text"]').click();
      cy.get('[data-testid="field-required-checkbox"]').click();

      // Go to preview
      cy.get('[data-testid="preview-btn"]').click();

      // Submit empty form
      cy.get('[data-testid="submit-form"]').click();

      // Verify error shown
      cy.get('[data-testid="field-error"]').should('contain', 'Ce champ est requis');
    });

    it('should submit valid form', () => {
      // Add text field
      cy.get('[data-testid="add-field-text"]').click();

      // Go to preview
      cy.get('[data-testid="preview-btn"]').click();

      // Fill field
      cy.get('[data-testid="field-input"]').type('Test Value');

      // Submit
      cy.get('[data-testid="submit-form"]').click();

      // Verify success
      cy.get('[data-testid="success-message"]').should('be.visible');
    });
  });
});
```

---

## Test Coverage Matrix

| Component/Service | Unit | Integration | E2E |
|-------------------|------|-------------|-----|
| FieldFactoryService | ✅ 20+ | - | - |
| FormBuilderService | ✅ 25+ | - | - |
| ValidationService | ✅ 50+ | ✅ | - |
| FormApiService | ✅ | ✅ | - |
| FieldPalette | ✅ | - | ✅ |
| FormCanvas | ✅ | - | ✅ |
| PropertiesPanel | ✅ | - | - |
| FormRenderer | ✅ | - | ✅ |
| Spring Controllers | ✅ | ✅ | - |
| Spring Services | ✅ | ✅ | - |

---

*Document generated by Murat (Master Test Architect Agent) for complete test coverage.*
