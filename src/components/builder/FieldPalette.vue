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
