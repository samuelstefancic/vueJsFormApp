<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'danger'].includes(v)
  }
})

const emit = defineEmits(['close', 'confirm'])

function handleKeydown(e) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-content" role="dialog" aria-modal="true">
          <header class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="close-button" @click="$emit('close')" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </header>
          <div class="modal-body">
            <slot></slot>
          </div>
          <footer class="modal-footer">
            <BaseButton variant="secondary" @click="$emit('close')">
              {{ cancelText }}
            </BaseButton>
            <BaseButton
              :variant="variant === 'danger' ? 'danger' : 'primary'"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </BaseButton>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: var(--z-modal-backdrop);
}

.modal-content {
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 420px;
  z-index: var(--z-modal);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.close-button:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.modal-body {
  padding: var(--space-lg);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
