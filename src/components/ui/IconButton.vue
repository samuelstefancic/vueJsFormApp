<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'danger', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    :class="['icon-button', `variant-${variant}`, `size-${size}`]"
    :disabled="disabled"
    :title="title"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
  flex-shrink: 0;
}

.icon-button:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.icon-button:active:not(:disabled) {
  transform: scale(0.95);
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Sizes */
.size-sm {
  width: 28px;
  height: 28px;
  font-size: var(--text-xs);
}

.size-md {
  width: 36px;
  height: 36px;
  font-size: var(--text-sm);
}

/* Variants */
.variant-default {
  background-color: var(--color-bg-elevated);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.variant-default:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
  border-color: var(--color-border-hover);
}

.variant-danger {
  background-color: transparent;
  color: var(--color-text-muted);
  border: 1px solid transparent;
}

.variant-danger:hover:not(:disabled) {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  border-color: var(--color-danger);
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
</style>
