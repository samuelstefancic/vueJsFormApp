export function validate(values, schema) {
  const errors = {}

  if (!schema?.fields || !Array.isArray(schema.fields)) {
    return errors
  }

  for (const field of schema.fields) {
    const fieldErrors = validateField(values[field.id], field)
    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors
    }
  }

  return errors
}

function validateField(value, field) {
  const errors = []

  if (field.required) {
    if (!isValuePresent(value, field.type)) {
      errors.push('Champ requis')
      return errors
    }
  }

  if (!isValuePresent(value, field.type)) {
    return errors
  }

  switch (field.type) {
    case 'number':
      errors.push(...validateNumber(value, field))
      break
    case 'select':
      errors.push(...validateSelect(value, field))
      break
    case 'text':
    case 'textarea':
      errors.push(...validateText(value, field))
      break
    case 'date':
      errors.push(...validateDate(value, field))
      break
  }

  return errors
}

function isValuePresent(value, type) {
  if (value === null || value === undefined) {
    return false
  }

  if (type === 'checkbox') {
    return typeof value === 'boolean'
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (typeof value === 'number') {
    return !isNaN(value)
  }

  return true
}

function validateNumber(value, field) {
  const errors = []
  const numValue = Number(value)

  if (isNaN(numValue)) {
    errors.push('Nombre invalide')
    return errors
  }

  if (field.min !== null && field.min !== undefined && numValue < field.min) {
    errors.push(`Minimum: ${field.min}`)
  }

  if (field.max !== null && field.max !== undefined && numValue > field.max) {
    errors.push(`Maximum: ${field.max}`)
  }

  return errors
}

function validateSelect(value, field) {
  const errors = []

  if (!field.options || !Array.isArray(field.options)) {
    return errors
  }

  const validValues = field.options.map(opt => opt.value)
  if (!validValues.includes(value)) {
    errors.push('Option invalide')
  }

  return errors
}

function validateText(value, field) {
  const errors = []
  const strValue = String(value)

  if (field.minLength && strValue.length < field.minLength) {
    errors.push(`Min. ${field.minLength} caractères`)
  }

  if (field.maxLength && strValue.length > field.maxLength) {
    errors.push(`Max. ${field.maxLength} caractères`)
  }

  return errors
}

function validateDate(value) {
  const errors = []
  const dateValue = new Date(value)

  if (isNaN(dateValue.getTime())) {
    errors.push('Date invalide')
  }

  return errors
}

export function validateSchema(schema) {
  const errors = []

  if (!schema || typeof schema !== 'object') {
    return { valid: false, errors: ['JSON invalide'] }
  }

  if (schema.version === undefined) {
    errors.push('"version" manquant')
  }

  if (typeof schema.title !== 'string') {
    errors.push('"title" invalide')
  }

  if (!Array.isArray(schema.fields)) {
    errors.push('"fields" doit être un tableau')
    return { valid: false, errors }
  }

  const validTypes = ['text', 'textarea', 'number', 'select', 'checkbox', 'date']
  const fieldNames = new Set()
  const fieldIds = new Set()

  schema.fields.forEach((field, index) => {
    const n = index + 1

    if (!field.id || typeof field.id !== 'string') {
      errors.push(`Champ ${n}: "id" invalide`)
    } else if (fieldIds.has(field.id)) {
      errors.push(`Champ ${n}: id dupliqué`)
    } else {
      fieldIds.add(field.id)
    }

    if (!field.type || !validTypes.includes(field.type)) {
      errors.push(`Champ ${n}: type invalide`)
    }

    if (!field.name || typeof field.name !== 'string') {
      errors.push(`Champ ${n}: "name" invalide`)
    } else if (fieldNames.has(field.name)) {
      errors.push(`Champ ${n}: nom dupliqué`)
    } else {
      fieldNames.add(field.name)
    }

    if (!field.label || typeof field.label !== 'string') {
      errors.push(`Champ ${n}: "label" invalide`)
    }

    if (field.type === 'select') {
      if (!Array.isArray(field.options) || field.options.length === 0) {
        errors.push(`Champ ${n}: options manquantes`)
      } else {
        field.options.forEach((opt, optIndex) => {
          if (!opt.value || !opt.label) {
            errors.push(`Champ ${n}, Option ${optIndex + 1}: incomplet`)
          }
        })
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
