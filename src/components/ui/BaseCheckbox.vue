<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
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
  <div class="base-checkbox-wrapper" :class="{ 'has-error': error, disabled }">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="checkbox-input"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="checkbox-box">
        <svg
          v-if="modelValue"
          class="checkbox-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span v-if="label" class="label-text">{{ label }}</span>
    </label>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
.base-checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-elevated);
  color: white;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.checkbox-input:checked + .checkbox-box {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.checkbox-input:focus-visible + .checkbox-box {
  box-shadow: var(--ring);
}

.checkbox-label:hover .checkbox-box {
  border-color: var(--color-border-hover);
}

.checkbox-input:checked + .checkbox-box:hover {
  background-color: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.checkbox-input:disabled + .checkbox-box {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-icon {
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.checkbox-input:checked + .checkbox-box .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.label-text {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.disabled .label-text {
  opacity: 0.5;
}

.disabled .checkbox-label {
  cursor: not-allowed;
}

.has-error .checkbox-box {
  border-color: var(--color-danger);
}

.error-message {
  font-size: var(--text-xs);
  color: var(--color-danger);
  margin-left: 28px;
}
</style>
