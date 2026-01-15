<script setup>
import { ref, computed } from 'vue'
import { useFormBuilderStore } from '../../stores/formBuilder'
import IconButton from '../ui/IconButton.vue'
import BaseModal from '../ui/BaseModal.vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dragstart', 'dragend', 'dragover', 'drop'])

const store = useFormBuilderStore()

// Drag and drop state (for reordering existing fields)
const isDragging = ref(false)
const isDragOver = ref(false)

const showDeleteModal = ref(false)

const typeIcons = {
  text: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4H13M3 8H10M3 12H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  textarea: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4H13M3 7H13M3 10H13M3 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  number: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5 4L3 6M3 6L5 8M3 6H7M9 4V12M9 4H11M9 12H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  select: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6 8L8 10L10 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  checkbox: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  date: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2 7H14M5 1V4M11 1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  time: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 4V8L10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  email: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2 5L8 9L14 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  phone: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 3C3 2.45 3.45 2 4 2H6L7 5L5.5 6.5C6.4 8.3 7.7 9.6 9.5 10.5L11 9L14 10V12C14 12.55 13.55 13 13 13C7.5 13 3 8.5 3 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  url: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 10L10 6M7 5H5C3.9 5 3 5.9 3 7C3 8.1 3.9 9 5 9H7M9 5H11C12.1 5 13 5.9 13 7C13 8.1 12.1 9 11 9H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  rating: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L9.5 5.5L13 6L10.5 8.5L11 12L8 10.5L5 12L5.5 8.5L3 6L6.5 5.5L8 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  radio: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="5" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="5" cy="5" r="1" fill="currentColor"/>
    <circle cx="5" cy="11" r="2.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M10 5H14M10 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  slider: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="10" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5" fill="var(--color-bg)"/>
  </svg>`,
  multiselect: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <path d="M3.5 4.5L4.5 5.5L6.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <path d="M3.5 11.5L4.5 12.5L6.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 5H14M10 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  // New field type icons
  heading: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 3V13M3 8H10M10 3V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  paragraph: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4H14M2 7H14M2 10H10M2 13H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  divider: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  hidden: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8C2 8 5 4 8 4C11 4 14 8 14 8C14 8 11 12 8 12C5 12 2 8 2 8Z" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2 2L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  file: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 11V5M8 5L5 8M8 5L11 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 11V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  signature: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 13C4 11 5 8 7 8C9 8 8 12 10 12C12 12 13 10 14 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M11 2L14 5L8 11H5V8L11 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

const typeLabels = {
  text: 'Texte',
  textarea: 'Zone de texte',
  number: 'Nombre',
  select: 'Liste',
  checkbox: 'Case à cocher',
  date: 'Date',
  time: 'Heure',
  email: 'Email',
  phone: 'Téléphone',
  url: 'URL',
  rating: 'Notation',
  radio: 'Boutons radio',
  slider: 'Curseur',
  multiselect: 'Multi-sélection',
  // New field types
  heading: 'Titre',
  paragraph: 'Paragraphe',
  divider: 'Séparateur',
  hidden: 'Champ caché',
  file: 'Fichier',
  signature: 'Signature'
}

const typeLabel = computed(() => typeLabels[props.field.type] || props.field.type)

function selectField() {
  store.selectField(props.field.id)
}

function moveUp() {
  store.moveField(props.field.id, 'up')
}

function moveDown() {
  store.moveField(props.field.id, 'down')
}

function duplicate() {
  store.duplicateField(props.field.id)
}

function confirmDelete() {
  showDeleteModal.value = true
}

function deleteField() {
  store.removeField(props.field.id)
  showDeleteModal.value = false
}

// Drag and drop handlers (for reordering existing fields only)
function handleDragStart(event) {
  isDragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.field.id)
  emit('dragstart', props.field.id)
}

function handleDragEnd() {
  isDragging.value = false
  emit('dragend')
}

function handleDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
  emit('dragover', props.field.id)
}

function handleDragLeave(event) {
  // Check if we're actually leaving the element (not entering a child)
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
  }
}

function handleDrop(event) {
  event.preventDefault()
  const draggedData = event.dataTransfer.getData('text/plain')

  // Only handle reordering existing fields (palette drops are handled by FormCanvas)
  if (draggedData && !draggedData.startsWith('new:') && draggedData !== props.field.id) {
    store.reorderField(draggedData, props.field.id)
    emit('drop', props.field.id)
  }

  isDragOver.value = false
}
</script>

<template>
  <div
    class="field-item"
    :class="{
      selected: isSelected,
      dragging: isDragging,
      'drag-over': isDragOver
    }"
    draggable="true"
    @click="selectField"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Drag handle -->
    <div class="drag-handle" title="Glisser pour réorganiser">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="3" cy="2" r="1" fill="currentColor"/>
        <circle cx="9" cy="2" r="1" fill="currentColor"/>
        <circle cx="3" cy="6" r="1" fill="currentColor"/>
        <circle cx="9" cy="6" r="1" fill="currentColor"/>
        <circle cx="3" cy="10" r="1" fill="currentColor"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
      </svg>
    </div>

    <div class="field-content">
      <span class="field-icon" v-html="typeIcons[field.type]"></span>
      <div class="field-info">
        <span class="field-label">{{ field.label || 'Sans titre' }}</span>
        <div class="field-meta">
          <span class="field-type">{{ typeLabel }}</span>
          <span v-if="field.required" class="required-badge">Requis</span>
        </div>
      </div>
    </div>

    <div class="field-actions" @click.stop>
      <IconButton
        variant="ghost"
        size="sm"
        title="Monter"
        :disabled="isFirst"
        @click="moveUp"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </IconButton>
      <IconButton
        variant="ghost"
        size="sm"
        title="Descendre"
        :disabled="isLast"
        @click="moveDown"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 3V11M7 11L3 7M7 11L11 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </IconButton>
      <IconButton
        variant="ghost"
        size="sm"
        title="Dupliquer"
        @click="duplicate"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 4V3C10 2.17 9.33 1.5 8.5 1.5H3C2.17 1.5 1.5 2.17 1.5 3V8.5C1.5 9.33 2.17 10 3 10H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </IconButton>
      <IconButton
        variant="danger"
        size="sm"
        title="Supprimer"
        @click="confirmDelete"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 4H12M5 4V3C5 2.45 5.45 2 6 2H8C8.55 2 9 2.45 9 3V4M11 4V11C11 11.55 10.55 12 10 12H4C3.45 12 3 11.55 3 11V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </IconButton>
    </div>
  </div>

  <BaseModal
    :open="showDeleteModal"
    title="Supprimer le champ"
    confirm-text="Supprimer"
    cancel-text="Annuler"
    variant="danger"
    @close="showDeleteModal = false"
    @confirm="deleteField"
  >
    <p>
      Êtes-vous sûr de vouloir supprimer le champ
      <strong>"{{ field.label || 'Sans titre' }}"</strong> ?
      Cette action est irréversible.
    </p>
  </BaseModal>
</template>

<style scoped>
.field-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md);
  padding-left: var(--space-sm);
  background-color: var(--color-bg-elevated);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.field-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.field-item.selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

/* Drag handle */
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 36px;
  color: var(--color-text-light);
  cursor: grab;
  opacity: 0.4;
  transition: opacity var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}

.drag-handle:active {
  cursor: grabbing;
}

.field-item:hover .drag-handle {
  opacity: 1;
  color: var(--color-text-muted);
}

/* Dragging state */
.field-item.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent);
}

/* Drop target state for reordering existing fields */
.field-item.drag-over {
  border-color: var(--color-accent);
  border-style: dashed;
  background-color: var(--color-accent-light);
}

.field-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  min-width: 0;
  flex: 1;
}

.field-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.selected .field-icon {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.field-type {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.required-badge {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  background-color: var(--color-accent-light);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.field-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.field-item:hover .field-actions,
.field-item.selected .field-actions {
  opacity: 1;
}
</style>
