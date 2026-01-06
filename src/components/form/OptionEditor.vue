<script setup>
import { ref, watch } from 'vue'
import IconButton from '../ui/IconButton.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:options'])

const localOptions = ref([...props.options])

watch(() => props.options, (newOptions) => {
  localOptions.value = [...newOptions]
}, { deep: true })

function addOption() {
  const newOption = {
    value: `option_${Date.now()}`,
    label: 'Nouvelle option'
  }
  localOptions.value.push(newOption)
  emitUpdate()
}

function removeOption(index) {
  localOptions.value.splice(index, 1)
  emitUpdate()
}

function updateOptionLabel(index, label) {
  localOptions.value[index].label = label
  emitUpdate()
}

function updateOptionValue(index, value) {
  localOptions.value[index].value = value
  emitUpdate()
}

function emitUpdate() {
  emit('update:options', [...localOptions.value])
}
</script>

<template>
  <div class="option-editor">
    <TransitionGroup name="option-list" tag="div" class="options-list">
      <div
        v-for="(option, index) in localOptions"
        :key="option.value + index"
        class="option-item"
      >
        <div class="option-inputs">
          <input
            :value="option.label"
            type="text"
            class="option-input label-input"
            placeholder="Label"
            @input="updateOptionLabel(index, $event.target.value)"
          />
          <input
            :value="option.value"
            type="text"
            class="option-input value-input"
            placeholder="Valeur"
            @input="updateOptionValue(index, $event.target.value)"
          />
        </div>
        <IconButton
          variant="danger"
          size="sm"
          title="Supprimer l'option"
          :disabled="localOptions.length <= 1"
          @click="removeOption(index)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </IconButton>
      </div>
    </TransitionGroup>

    <BaseButton
      variant="secondary"
      size="sm"
      class="add-option-btn"
      @click="addOption"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Ajouter une option
    </BaseButton>
  </div>
</template>

<style scoped>
.option-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  position: relative;
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.option-inputs {
  display: flex;
  gap: var(--space-xs);
  flex: 1;
}

.option-input {
  flex: 1;
  height: 36px;
  padding: 0 var(--space-sm);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.option-input::placeholder {
  color: var(--color-text-light);
}

.option-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}

.label-input {
  flex: 1.5;
}

.value-input {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.add-option-btn {
  align-self: flex-start;
}

/* Transitions */
.option-list-enter-active,
.option-list-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.option-list-enter-from,
.option-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.option-list-leave-active {
  position: absolute;
  width: 100%;
}

.option-list-move {
  transition: transform var(--transition-base);
}
</style>
