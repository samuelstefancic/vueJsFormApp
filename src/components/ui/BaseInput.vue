<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  hint: {
    type: String,
    default: ''
  },
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <div class="base-input-wrapper" :class="{ 'has-error': error, disabled }">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      class="base-input"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-else-if="hint" class="hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.base-input-wrapper {
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

.base-input {
  height: 40px;
  padding: 0 var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-input::placeholder {
  color: var(--color-text-light);
}

.base-input:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}

.base-input:disabled {
  background-color: var(--color-bg);
  cursor: not-allowed;
  opacity: 0.6;
}

.has-error .base-input {
  border-color: var(--color-danger);
}

.has-error .base-input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  font-size: var(--text-xs);
  color: var(--color-danger);
}

.hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Number input - remove spinners */
.base-input[type="number"]::-webkit-outer-spin-button,
.base-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.base-input[type="number"] {
  -moz-appearance: textfield;
}
</style>
