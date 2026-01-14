<script setup>
import { watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'error', 'info'].includes(v)
  },
  duration: {
    type: Number,
    default: 3000
  },
  visible: {
    type: Boolean,
    default: false
  },
  link: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

let timeout = null

function startTimer() {
  if (timeout) clearTimeout(timeout)
  if (props.duration > 0) {
    timeout = setTimeout(() => {
      emit('close')
    }, props.duration)
  }
}

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    startTimer()
  }
})

onMounted(() => {
  if (props.visible) {
    startTimer()
  }
})

const icons = {
  success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
    <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
    <path d="M10 9V14M10 6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" :class="['toast', `toast-${type}`]">
        <span class="toast-icon" v-html="icons[type]"></span>
        <div class="toast-content">
          <span class="toast-message">{{ message }}</span>
          <RouterLink v-if="link" :to="link.to" class="toast-link" @click="$emit('close')">
            {{ link.text }}
          </RouterLink>
        </div>
        <button class="toast-close" @click="$emit('close')" aria-label="Fermer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-toast);
  max-width: 400px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.toast-message {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.toast-link {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  text-decoration: underline;
  transition: color var(--transition-fast);
}

.toast-link:hover {
  color: var(--color-accent-hover);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--space-sm);
  padding: var(--space-xs);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.toast-close:hover {
  background-color: var(--color-bg-hover);
}

/* Types */
.toast-success {
  border-left: 3px solid var(--color-success);
}

.toast-success .toast-icon {
  color: var(--color-success);
}

.toast-error {
  border-left: 3px solid var(--color-danger);
}

.toast-error .toast-icon {
  color: var(--color-danger);
}

.toast-info {
  border-left: 3px solid var(--color-accent);
}

.toast-info .toast-icon {
  color: var(--color-accent);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
