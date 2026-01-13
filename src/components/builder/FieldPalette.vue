<script setup>
import { useFormBuilderStore } from '../../stores/formBuilder'

const store = useFormBuilderStore()

const fieldTypes = [
  {
    type: 'text',
    label: 'Texte',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5H16M4 10H12M4 15H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Champ de saisie simple'
  },
  {
    type: 'textarea',
    label: 'Zone de texte',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5H16M4 8H16M4 11H16M4 14H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Texte multiligne'
  },
  {
    type: 'number',
    label: 'Nombre',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 5L5 7M5 7L7 9M5 7H9M11 5V15M11 5H14M11 15H14M5 13L7 15M5 13H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Valeur numérique'
  },
  {
    type: 'select',
    label: 'Liste',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 10L10 13L13 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Liste déroulante'
  },
  {
    type: 'checkbox',
    label: 'Case à cocher',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Oui / Non'
  },
  {
    type: 'date',
    label: 'Date',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 8H17M7 2V5M13 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Sélecteur de date'
  },
  {
    type: 'email',
    label: 'Email',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 6L10 11L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Adresse email'
  },
  {
    type: 'phone',
    label: 'Téléphone',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4C3 3.44772 3.44772 3 4 3H7L8.5 7L6.5 8.5C7.57096 10.6715 9.32848 12.429 11.5 13.5L13 11.5L17 13V16C17 16.5523 16.5523 17 16 17C9.37258 17 4 11.6274 4 5V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Numéro de téléphone'
  },
  {
    type: 'url',
    label: 'URL',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 12L12 8M9 7H7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13H9M11 7H13C14.6569 7 16 8.34315 16 10C16 11.6569 14.6569 13 13 13H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Lien web'
  },
  {
    type: 'rating',
    label: 'Notation',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L12.09 6.26L17 7L13.5 10.5L14.18 15.5L10 13.27L5.82 15.5L6.5 10.5L3 7L7.91 6.26L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Notation par étoiles'
  },
  {
    type: 'radio',
    label: 'Boutons radio',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="6" cy="14" r="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 6H17M12 14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Choix unique'
  },
  {
    type: 'slider',
    label: 'Curseur',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5" fill="var(--color-bg)"/>
    </svg>`,
    description: 'Valeur avec curseur'
  },
  {
    type: 'time',
    label: 'Heure',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 6V10L13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Sélecteur d\'heure'
  },
  {
    type: 'multiselect',
    label: 'Sélection multiple',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4.5 6L5.5 7L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4.5 14L5.5 15L7.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 6H17M12 14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    description: 'Plusieurs choix possibles'
  }
]

function addField(type) {
  store.addField(type)
}
</script>

<template>
  <aside class="field-palette">
    <header class="palette-header">
      <h2 class="palette-title">Champs</h2>
      <p class="palette-subtitle">Cliquez pour ajouter</p>
    </header>

    <div class="field-types">
      <button
        v-for="field in fieldTypes"
        :key="field.type"
        class="field-type-button"
        @click="addField(field.type)"
      >
        <span class="field-icon" v-html="field.icon"></span>
        <span class="field-info">
          <span class="field-label">{{ field.label }}</span>
          <span class="field-description">{{ field.description }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.field-palette {
  width: 220px;
  height: 100%;
  background-color: var(--color-bg-elevated);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.palette-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.palette-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.palette-subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.field-types {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.field-type-button {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: left;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.field-type-button:hover {
  background-color: var(--color-bg-elevated);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.field-type-button:active {
  transform: translateY(0);
}

.field-type-button:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.field-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--color-accent-light);
  color: var(--color-accent);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.field-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.field-description {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
