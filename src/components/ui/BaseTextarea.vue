<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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
  },
  rows: {
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <div class="base-textarea-wrapper" :class="{ 'has-error': error, disabled }">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      class="base-textarea"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    ></textarea>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
.base-textarea-wrapper {
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

.base-textarea {
  padding: var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 80px;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-textarea::placeholder {
  color: var(--color-text-light);
}

.base-textarea:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.base-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}

.base-textarea:disabled {
  background-color: var(--color-bg);
  cursor: not-allowed;
  opacity: 0.6;
}

.has-error .base-textarea {
  border-color: var(--color-danger);
}

.has-error .base-textarea:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  font-size: var(--text-xs);
  color: var(--color-danger);
}
</style>
