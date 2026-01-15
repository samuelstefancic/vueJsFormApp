/**
 * Conditional Logic Operators
 */
export const OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_OR_EQUAL: 'greater_or_equal',
  LESS_OR_EQUAL: 'less_or_equal',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  IN_LIST: 'in_list',
  NOT_IN_LIST: 'not_in_list'
}

/**
 * Operator labels for UI
 */
export const OPERATOR_LABELS = {
  [OPERATORS.EQUALS]: 'Est égal à',
  [OPERATORS.NOT_EQUALS]: 'N\'est pas égal à',
  [OPERATORS.CONTAINS]: 'Contient',
  [OPERATORS.NOT_CONTAINS]: 'Ne contient pas',
  [OPERATORS.GREATER_THAN]: 'Est supérieur à',
  [OPERATORS.LESS_THAN]: 'Est inférieur à',
  [OPERATORS.GREATER_OR_EQUAL]: 'Est supérieur ou égal à',
  [OPERATORS.LESS_OR_EQUAL]: 'Est inférieur ou égal à',
  [OPERATORS.IS_EMPTY]: 'Est vide',
  [OPERATORS.IS_NOT_EMPTY]: 'N\'est pas vide',
  [OPERATORS.STARTS_WITH]: 'Commence par',
  [OPERATORS.ENDS_WITH]: 'Se termine par',
  [OPERATORS.IN_LIST]: 'Est dans la liste',
  [OPERATORS.NOT_IN_LIST]: 'N\'est pas dans la liste'
}

/**
 * Check if a value is empty
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

/**
 * Evaluate a single condition
 * @param {Object} condition - The condition to evaluate
 * @param {Object} formValues - Current form values keyed by field ID
 * @returns {boolean} Whether the condition is met
 */
export function evaluateCondition(condition, formValues) {
  // No condition means always visible
  if (!condition) return true

  const { fieldId, operator, value } = condition
  const fieldValue = formValues[fieldId]

  switch (operator) {
    case OPERATORS.EQUALS:
      return fieldValue === value

    case OPERATORS.NOT_EQUALS:
      return fieldValue !== value

    case OPERATORS.CONTAINS:
      return String(fieldValue || '').toLowerCase().includes(String(value).toLowerCase())

    case OPERATORS.NOT_CONTAINS:
      return !String(fieldValue || '').toLowerCase().includes(String(value).toLowerCase())

    case OPERATORS.GREATER_THAN:
      return Number(fieldValue) > Number(value)

    case OPERATORS.LESS_THAN:
      return Number(fieldValue) < Number(value)

    case OPERATORS.GREATER_OR_EQUAL:
      return Number(fieldValue) >= Number(value)

    case OPERATORS.LESS_OR_EQUAL:
      return Number(fieldValue) <= Number(value)

    case OPERATORS.IS_EMPTY:
      return isEmpty(fieldValue)

    case OPERATORS.IS_NOT_EMPTY:
      return !isEmpty(fieldValue)

    case OPERATORS.STARTS_WITH:
      return String(fieldValue || '').toLowerCase().startsWith(String(value).toLowerCase())

    case OPERATORS.ENDS_WITH:
      return String(fieldValue || '').toLowerCase().endsWith(String(value).toLowerCase())

    case OPERATORS.IN_LIST:
      const list = Array.isArray(value) ? value : String(value).split(',').map(v => v.trim())
      return list.includes(fieldValue)

    case OPERATORS.NOT_IN_LIST:
      const notList = Array.isArray(value) ? value : String(value).split(',').map(v => v.trim())
      return !notList.includes(fieldValue)

    default:
      return true
  }
}

/**
 * Evaluate multiple conditions with AND/OR logic
 * @param {Object} conditions - Conditions configuration
 * @param {Object} formValues - Current form values
 * @returns {boolean} Whether all conditions are met
 */
export function evaluateConditions(conditions, formValues) {
  if (!conditions || !conditions.rules || conditions.rules.length === 0) {
    return true
  }

  const { rules, logic = 'AND' } = conditions

  if (logic === 'AND') {
    return rules.every(rule => evaluateCondition(rule, formValues))
  } else {
    return rules.some(rule => evaluateCondition(rule, formValues))
  }
}

/**
 * Get operators applicable for a field type
 */
export function getOperatorsForFieldType(fieldType) {
  const textOperators = [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.CONTAINS,
    OPERATORS.NOT_CONTAINS,
    OPERATORS.STARTS_WITH,
    OPERATORS.ENDS_WITH,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ]

  const numberOperators = [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.GREATER_THAN,
    OPERATORS.LESS_THAN,
    OPERATORS.GREATER_OR_EQUAL,
    OPERATORS.LESS_OR_EQUAL,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ]

  const selectOperators = [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.IN_LIST,
    OPERATORS.NOT_IN_LIST,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ]

  const booleanOperators = [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS
  ]

  switch (fieldType) {
    case 'number':
    case 'slider':
    case 'rating':
      return numberOperators

    case 'select':
    case 'radio':
    case 'multiselect':
      return selectOperators

    case 'checkbox':
      return booleanOperators

    case 'text':
    case 'textarea':
    case 'email':
    case 'phone':
    case 'url':
    case 'date':
    case 'time':
    default:
      return textOperators
  }
}
