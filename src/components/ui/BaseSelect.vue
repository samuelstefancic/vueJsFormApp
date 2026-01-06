<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Sélectionner...'
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-select-wrapper" :class="{ 'has-error': error, disabled }">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    <div class="select-container">
      <select
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="base-select"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="select-icon">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
.base-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.required-indicator {
  color: var(--color-danger);
  margin-left: 2px;
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-select {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-xl) 0 var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  appearance: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-select:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.base-select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}

.base-select:disabled {
  background-color: var(--color-bg);
  cursor: not-allowed;
  opacity: 0.6;
}

.select-icon {
  position: absolute;
  right: var(--space-md);
  pointer-events: none;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.has-error .base-select {
  border-color: var(--color-danger);
}

.has-error .base-select:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  font-size: var(--text-xs);
  color: var(--color-danger);
}
</style>
