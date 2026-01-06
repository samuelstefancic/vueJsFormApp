<script setup>
import { computed } from 'vue'
import { useFormBuilderStore } from '../../stores/formBuilder'
import FieldItem from './FieldItem.vue'

const store = useFormBuilderStore()

const fields = computed(() => store.schema.fields)
const selectedFieldId = computed(() => store.selectedFieldId)
const hasFields = computed(() => fields.value.length > 0)

function isSelected(fieldId) {
  return fieldId === selectedFieldId.value
}

function isFirst(index) {
  return index === 0
}

function isLast(index) {
  return index === fields.value.length - 1
}
</script>

<template>
  <main class="form-canvas">
    <TransitionGroup v-if="hasFields" name="field-list" tag="div" class="fields-container">
      <FieldItem
        v-for="(field, index) in fields"
        :key="field.id"
        :field="field"
        :is-selected="isSelected(field.id)"
        :is-first="isFirst(index)"
        :is-last="isLast(index)"
      />
    </TransitionGroup>

    <div v-else class="empty-state">
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
}

.fields-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 600px;
  margin: 0 auto;
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

/* List transitions */
.field-list-enter-active {
  animation: slideUp var(--transition-base) forwards;
}

.field-list-leave-active {
  animation: fadeOut var(--transition-fast) forwards;
  position: absolute;
}

.field-list-move {
  transition: transform var(--transition-base);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
