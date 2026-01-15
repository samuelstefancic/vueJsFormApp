/**
 * Extended Field Types Configuration
 * Includes all 14 original types + 5 new display/special types
 */

export const FIELD_CATEGORIES = {
  INPUT: 'input',
  CHOICE: 'choice',
  DATE_TIME: 'datetime',
  SPECIAL: 'special',
  DISPLAY: 'display',
  FILE: 'file'
}

export const CATEGORY_LABELS = {
  [FIELD_CATEGORIES.INPUT]: 'Saisie',
  [FIELD_CATEGORIES.CHOICE]: 'Choix',
  [FIELD_CATEGORIES.DATE_TIME]: 'Date & Heure',
  [FIELD_CATEGORIES.SPECIAL]: 'Spécial',
  [FIELD_CATEGORIES.DISPLAY]: 'Affichage',
  [FIELD_CATEGORIES.FILE]: 'Fichiers'
}

/**
 * Complete field type definitions (14 original + 5 new)
 */
export const FIELD_TYPES = {
  // === INPUT FIELDS ===
  text: {
    type: 'text',
    label: 'Texte',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Champ de saisie simple',
    icon: 'text',
    defaultProps: {
      placeholder: '',
      defaultValue: '',
      minLength: null,
      maxLength: null
    },
    hasValidation: true
  },

  textarea: {
    type: 'textarea',
    label: 'Zone de texte',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Texte multiligne',
    icon: 'textarea',
    defaultProps: {
      placeholder: '',
      defaultValue: '',
      rows: 4,
      minLength: null,
      maxLength: null
    },
    hasValidation: true
  },

  number: {
    type: 'number',
    label: 'Nombre',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Valeur numérique',
    icon: 'number',
    defaultProps: {
      placeholder: '',
      defaultValue: null,
      min: null,
      max: null,
      step: 1
    },
    hasValidation: true
  },

  email: {
    type: 'email',
    label: 'Email',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Adresse email',
    icon: 'email',
    defaultProps: {
      placeholder: 'exemple@domaine.com',
      defaultValue: ''
    },
    hasValidation: true
  },

  phone: {
    type: 'phone',
    label: 'Téléphone',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Numéro de téléphone',
    icon: 'phone',
    defaultProps: {
      placeholder: '06 12 34 56 78',
      defaultValue: ''
    },
    hasValidation: true
  },

  url: {
    type: 'url',
    label: 'URL',
    category: FIELD_CATEGORIES.INPUT,
    description: 'Lien web',
    icon: 'link',
    defaultProps: {
      placeholder: 'https://exemple.com',
      defaultValue: ''
    },
    hasValidation: true
  },

  // === CHOICE FIELDS ===
  select: {
    type: 'select',
    label: 'Liste déroulante',
    category: FIELD_CATEGORIES.CHOICE,
    description: 'Choix unique dans une liste',
    icon: 'select',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ],
      defaultValue: ''
    },
    hasOptions: true,
    hasValidation: true
  },

  radio: {
    type: 'radio',
    label: 'Boutons radio',
    category: FIELD_CATEGORIES.CHOICE,
    description: 'Choix unique',
    icon: 'radio',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ],
      defaultValue: '',
      layout: 'vertical' // vertical | horizontal
    },
    hasOptions: true,
    hasValidation: true
  },

  multiselect: {
    type: 'multiselect',
    label: 'Sélection multiple',
    category: FIELD_CATEGORIES.CHOICE,
    description: 'Plusieurs choix possibles',
    icon: 'multiselect',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      defaultValue: [],
      minSelect: null,
      maxSelect: null
    },
    hasOptions: true,
    hasValidation: true
  },

  checkbox: {
    type: 'checkbox',
    label: 'Case à cocher',
    category: FIELD_CATEGORIES.CHOICE,
    description: 'Oui / Non',
    icon: 'checkbox',
    defaultProps: {
      defaultValue: false
    },
    hasValidation: true
  },

  // === DATE & TIME FIELDS ===
  date: {
    type: 'date',
    label: 'Date',
    category: FIELD_CATEGORIES.DATE_TIME,
    description: 'Sélecteur de date',
    icon: 'calendar',
    defaultProps: {
      placeholder: 'jj/mm/aaaa',
      defaultValue: '',
      minDate: null,
      maxDate: null
    },
    hasValidation: true
  },

  time: {
    type: 'time',
    label: 'Heure',
    category: FIELD_CATEGORIES.DATE_TIME,
    description: 'Sélecteur d\'heure',
    icon: 'clock',
    defaultProps: {
      placeholder: 'HH:MM',
      defaultValue: '',
      minTime: null,
      maxTime: null
    },
    hasValidation: true
  },

  // === SPECIAL FIELDS ===
  rating: {
    type: 'rating',
    label: 'Notation',
    category: FIELD_CATEGORIES.SPECIAL,
    description: 'Notation par étoiles',
    icon: 'star',
    defaultProps: {
      maxRating: 5,
      defaultValue: 0,
      allowHalf: false
    },
    hasValidation: true
  },

  slider: {
    type: 'slider',
    label: 'Curseur',
    category: FIELD_CATEGORIES.SPECIAL,
    description: 'Valeur avec curseur',
    icon: 'slider',
    defaultProps: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      showValue: true
    },
    hasValidation: true
  },

  // === NEW: DISPLAY FIELDS (Priority 3) ===
  heading: {
    type: 'heading',
    label: 'Titre',
    category: FIELD_CATEGORIES.DISPLAY,
    description: 'Titre de section',
    icon: 'heading',
    defaultProps: {
      text: 'Titre de section',
      level: 2, // h1, h2, h3, h4
      align: 'left' // left, center, right
    },
    isDisplay: true,
    hasValidation: false
  },

  paragraph: {
    type: 'paragraph',
    label: 'Paragraphe',
    category: FIELD_CATEGORIES.DISPLAY,
    description: 'Texte d\'information',
    icon: 'paragraph',
    defaultProps: {
      text: 'Texte explicatif ou instructions...',
      align: 'left'
    },
    isDisplay: true,
    hasValidation: false
  },

  divider: {
    type: 'divider',
    label: 'Séparateur',
    category: FIELD_CATEGORIES.DISPLAY,
    description: 'Ligne de séparation',
    icon: 'minus',
    defaultProps: {
      style: 'solid', // solid, dashed, dotted
      spacing: 'medium' // small, medium, large
    },
    isDisplay: true,
    hasValidation: false
  },

  hidden: {
    type: 'hidden',
    label: 'Champ caché',
    category: FIELD_CATEGORIES.SPECIAL,
    description: 'Valeur invisible',
    icon: 'eye-off',
    defaultProps: {
      defaultValue: ''
    },
    isHidden: true,
    hasValidation: false
  },

  // === NEW: FILE FIELDS (Priority 3) ===
  file: {
    type: 'file',
    label: 'Fichier',
    category: FIELD_CATEGORIES.FILE,
    description: 'Upload de fichier',
    icon: 'upload',
    defaultProps: {
      accept: '*/*', // MIME types or extensions
      maxSize: 5242880, // 5MB in bytes
      multiple: false,
      maxFiles: 1
    },
    hasValidation: true
  },

  signature: {
    type: 'signature',
    label: 'Signature',
    category: FIELD_CATEGORIES.SPECIAL,
    description: 'Signature manuscrite',
    icon: 'pen',
    defaultProps: {
      width: 400,
      height: 200,
      penColor: '#000000',
      backgroundColor: '#ffffff'
    },
    hasValidation: true
  }
}

/**
 * Get all field types as array
 */
export function getFieldTypesList() {
  return Object.values(FIELD_TYPES)
}

/**
 * Get field types by category
 */
export function getFieldTypesByCategory(category) {
  return Object.values(FIELD_TYPES).filter(ft => ft.category === category)
}

/**
 * Get field type definition
 */
export function getFieldTypeDefinition(type) {
  return FIELD_TYPES[type] || null
}

/**
 * Check if field type has options
 */
export function fieldTypeHasOptions(type) {
  return FIELD_TYPES[type]?.hasOptions || false
}

/**
 * Check if field type is display-only
 */
export function isDisplayField(type) {
  return FIELD_TYPES[type]?.isDisplay || false
}

/**
 * Check if field type should be hidden in preview
 */
export function isHiddenField(type) {
  return FIELD_TYPES[type]?.isHidden || false
}

/**
 * Get all categories with their fields
 */
export function getGroupedFieldTypes() {
  const grouped = {}

  Object.values(FIELD_CATEGORIES).forEach(category => {
    grouped[category] = {
      label: CATEGORY_LABELS[category],
      fields: getFieldTypesByCategory(category)
    }
  })

  return grouped
}
