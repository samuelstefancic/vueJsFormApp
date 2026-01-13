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
    case 'radio':
      errors.push(...validateSelect(value, field))
      break
    case 'text':
    case 'textarea':
      errors.push(...validateText(value, field))
      break
    case 'date':
      errors.push(...validateDate(value, field))
      break
    case 'email':
      errors.push(...validateEmail(value))
      break
    case 'phone':
      errors.push(...validatePhone(value))
      break
    case 'url':
      errors.push(...validateUrl(value))
      break
    case 'rating':
      errors.push(...validateRating(value, field))
      break
    case 'slider':
      errors.push(...validateSlider(value, field))
      break
  }

  return errors
}

function isValuePresent(value, type) {
  if (value === null || value === undefined) {
    return false
  }

  // For checkbox, required means it must be checked (true)
  if (type === 'checkbox') {
    return value === true
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

function validateEmail(value) {
  const errors = []
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(String(value))) {
    errors.push('Email invalide')
  }

  return errors
}

function validatePhone(value) {
  const errors = []
  // Accepts various phone formats: +33, 06, spaces, dots, dashes
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/

  if (!phoneRegex.test(String(value)) || String(value).replace(/\D/g, '').length < 6) {
    errors.push('Numéro de téléphone invalide')
  }

  return errors
}

function validateUrl(value) {
  const errors = []
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i

  if (!urlRegex.test(String(value))) {
    errors.push('URL invalide')
  }

  return errors
}

function validateRating(value, field) {
  const errors = []
  const numValue = Number(value)
  const maxRating = field.maxRating || 5

  if (isNaN(numValue) || numValue < 1 || numValue > maxRating) {
    errors.push(`Notation entre 1 et ${maxRating}`)
  }

  return errors
}

function validateSlider(value, field) {
  const errors = []
  const numValue = Number(value)
  const min = field.min ?? 0
  const max = field.max ?? 100

  if (isNaN(numValue)) {
    errors.push('Valeur invalide')
    return errors
  }

  if (numValue < min) {
    errors.push(`Minimum: ${min}`)
  }

  if (numValue > max) {
    errors.push(`Maximum: ${max}`)
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

  const validTypes = ['text', 'textarea', 'number', 'select', 'checkbox', 'date', 'email', 'phone', 'url', 'rating', 'radio', 'slider']
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

    if (field.type === 'select' || field.type === 'radio') {
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
