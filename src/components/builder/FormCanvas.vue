<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useFormBuilderStore } from '../../stores/formBuilder'
import FieldItem from './FieldItem.vue'

const store = useFormBuilderStore()

const fields = computed(() => store.schema.fields)
const selectedFieldId = computed(() => store.selectedFieldId)
const hasFields = computed(() => fields.value.length > 0)

// Drag state tracking - centralized
const isDraggingFromPalette = ref(false)
const insertAtIndex = ref(null) // The index where we'll insert the new field
const fieldsListRef = ref(null)

function isSelected(fieldId) {
  return fieldId === selectedFieldId.value
}

function isFirst(index) {
  return index === 0
}

function isLast(index) {
  return index === fields.value.length - 1
}

// Calculate insert position based on cursor Y position
function calculateInsertIndex(clientY) {
  if (!fieldsListRef.value) return null

  const fieldElements = fieldsListRef.value.querySelectorAll('.field-wrapper')
  if (fieldElements.length === 0) return 0

  // Find which field the cursor is closest to
  for (let i = 0; i < fieldElements.length; i++) {
    const rect = fieldElements[i].getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2

    // If cursor is above the midpoint of this field, insert before it
    if (clientY < midpoint) {
      return i
    }
  }

  // If we're past all fields, insert at the end
  return fieldElements.length
}

// Throttle helper to reduce stutter
let lastUpdate = 0
const THROTTLE_MS = 16 // ~60fps

function throttledUpdateInsertIndex(clientY) {
  const now = Date.now()
  if (now - lastUpdate < THROTTLE_MS) return
  lastUpdate = now

  const newIndex = calculateInsertIndex(clientY)
  if (newIndex !== insertAtIndex.value) {
    insertAtIndex.value = newIndex
  }
}

// Check if field should shift down to make room
function shouldShiftDown(index) {
  if (insertAtIndex.value === null || !isDraggingFromPalette.value) return false
  return index >= insertAtIndex.value
}

// Canvas-level drag handlers - centralized control
function handleCanvasDragOver(event) {
  if (!event.dataTransfer.types.includes('text/plain')) return

  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
  isDraggingFromPalette.value = true

  // Calculate insert position based on cursor
  throttledUpdateInsertIndex(event.clientY)
}

function handleCanvasDragLeave(event) {
  // Only reset if leaving the canvas entirely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDraggingFromPalette.value = false
    insertAtIndex.value = null
  }
}

function handleCanvasDrop(event) {
  event.preventDefault()
  const data = event.dataTransfer.getData('text/plain')

  if (data && data.startsWith('new:')) {
    const fieldType = data.replace('new:', '')
    const index = insertAtIndex.value !== null ? insertAtIndex.value : fields.value.length
    store.addFieldAtIndex(fieldType, index)
  }

  // Reset state
  isDraggingFromPalette.value = false
  insertAtIndex.value = null
}

// Empty state drop handler
function handleEmptyDrop(event) {
  event.preventDefault()
  event.stopPropagation() // Prevent bubbling to canvas handler
  const data = event.dataTransfer.getData('text/plain')

  if (data && data.startsWith('new:')) {
    const fieldType = data.replace('new:', '')
    store.addField(fieldType)
  }

  isDraggingFromPalette.value = false
}

function handleEmptyDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
  isDraggingFromPalette.value = true
}
</script>

<template>
  <main
    class="form-canvas"
    :class="{ 'is-dragging': isDraggingFromPalette }"
    @dragover="handleCanvasDragOver"
    @dragleave="handleCanvasDragLeave"
    @drop="handleCanvasDrop"
  >
    <div v-if="hasFields" class="fields-container">
      <div ref="fieldsListRef" class="fields-list">
        <!-- Placeholder at the top when inserting at index 0 -->
        <div
          v-if="isDraggingFromPalette && insertAtIndex === 0"
          class="drop-placeholder"
        >
          <div class="placeholder-line"></div>
          <span class="placeholder-text">Nouveau champ</span>
        </div>

        <template v-for="(field, index) in fields" :key="field.id">
          <div
            class="field-wrapper"
            :class="{ 'shift-down': shouldShiftDown(index) }"
          >
            <FieldItem
              :field="field"
              :is-selected="isSelected(field.id)"
              :is-first="isFirst(index)"
              :is-last="isLast(index)"
            />
          </div>

          <!-- Placeholder after this field when inserting at index + 1 -->
          <div
            v-if="isDraggingFromPalette && insertAtIndex === index + 1"
            class="drop-placeholder"
          >
            <div class="placeholder-line"></div>
            <span class="placeholder-text">Nouveau champ</span>
          </div>
        </template>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
      :class="{ 'drop-target': isDraggingFromPalette }"
      @dragover="handleEmptyDragOver"
      @drop="handleEmptyDrop"
    >
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2"/>
          <path d="M16 24H32M16 32H48M16 40H40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="52" cy="52" r="10" fill="var(--color-accent)" stroke="var(--color-bg-elevated)" stroke-width="3"/>
          <path d="M52 48V56M48 52H56" stroke="var(--color-bg-elevated)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">Aucun champ</h3>
      <p class="empty-description">
        Ajoutez un champ depuis la palette à gauche pour commencer à construire votre formulaire.
      </p>
    </div>
  </main>
</template>

<style scoped>
.form-canvas {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-bg);
  padding: var(--space-xl);
  transition: background-color var(--transition-fast);
}

.form-canvas.is-dragging {
  background-color: color-mix(in srgb, var(--color-accent) 5%, var(--color-bg));
}

.fields-container {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field-wrapper {
  display: flex;
  flex-direction: column;
}

/* Drop placeholder - appears where new field will be inserted */
.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  padding: var(--space-md);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-accent) 8%, transparent),
    color-mix(in srgb, var(--color-accent) 15%, transparent)
  );
  border: 2px dashed var(--color-accent);
  border-radius: var(--radius-lg);
  animation: placeholderAppear 200ms cubic-bezier(0.2, 0, 0, 1) forwards;
}

.placeholder-line {
  width: 60%;
  height: 3px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-xs);
  animation: pulse 1.5s ease-in-out infinite;
}

.placeholder-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  opacity: 0.8;
}

@keyframes placeholderAppear {
  from {
    opacity: 0;
    transform: scaleY(0.5);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scaleX(0.9); }
  50% { opacity: 1; transform: scaleX(1); }
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--space-2xl);
}

.empty-icon {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.empty-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.empty-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-width: 300px;
  line-height: 1.6;
}

.empty-state.drop-target {
  background-color: var(--color-accent-light);
  border: 2px dashed var(--color-accent);
  border-radius: var(--radius-lg);
}

</style>
