<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :class="['base-button', `variant-${variant}`, `size-${size}`, { loading, disabled }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loader"></span>
    <span class="content" :class="{ invisible: loading }">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  position: relative;
  white-space: nowrap;
}

.base-button:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Sizes */
.size-sm {
  height: 32px;
  padding: 0 var(--space-md);
  font-size: var(--text-sm);
}

.size-md {
  height: 40px;
  padding: 0 var(--space-lg);
  font-size: var(--text-sm);
}

.size-lg {
  height: 48px;
  padding: 0 var(--space-xl);
  font-size: var(--text-base);
}

/* Variants */
.variant-primary {
  background-color: var(--color-accent);
  color: white;
  border: none;
}

.variant-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.variant-secondary {
  background-color: var(--color-bg-elevated);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.variant-secondary:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.variant-danger {
  background-color: var(--color-danger);
  color: white;
  border: none;
}

.variant-danger:hover:not(:disabled) {
  background-color: var(--color-danger-hover);
  box-shadow: var(--shadow-md);
}

.variant-ghost {
  background-color: transparent;
  color: var(--color-text-muted);
  border: none;
}

.variant-ghost:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

/* Disabled state */
.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading state */
.loader {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content.invisible {
  visibility: hidden;
}
</style>
