<script setup>
import { computed } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseCheckbox from '../ui/BaseCheckbox.vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  values: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:values'])

const fields = computed(() => props.schema.fields || [])

function getValue(fieldId) {
  return props.values[fieldId] ?? ''
}

function getError(fieldId) {
  const fieldErrors = props.errors[fieldId]
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : ''
}

function updateValue(fieldId, value) {
  emit('update:values', {
    ...props.values,
    [fieldId]: value
  })
}
</script>

<template>
  <form class="form-renderer" @submit.prevent>
    <TransitionGroup name="field-list" tag="div" class="form-fields">
      <div
        v-for="field in fields"
        :key="field.id"
        class="form-field"
        :class="{ 'has-error': getError(field.id) }"
      >
        <BaseInput
          v-if="field.type === 'text'"
          :model-value="getValue(field.id)"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseTextarea
          v-else-if="field.type === 'textarea'"
          :model-value="getValue(field.id)"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseInput
          v-else-if="field.type === 'number'"
          :model-value="getValue(field.id)"
          type="number"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :min="field.min"
          :max="field.max"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseSelect
          v-else-if="field.type === 'select'"
          :model-value="getValue(field.id)"
          :label="field.label"
          :options="field.options || []"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseCheckbox
          v-else-if="field.type === 'checkbox'"
          :model-value="getValue(field.id) || false"
          :label="field.label"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseInput
          v-else-if="field.type === 'date'"
          :model-value="getValue(field.id)"
          type="date"
          :label="field.label"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />
      </div>
    </TransitionGroup>

    <div v-if="fields.length === 0" class="empty-form">
      <p>Ce formulaire ne contient aucun champ.</p>
    </div>
  </form>
</template>

<style scoped>
.form-renderer {
  width: 100%;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-field {
  animation: fadeIn var(--transition-base) forwards;
}

.form-field.has-error {
  animation: shake 200ms ease-in-out;
}

.empty-form {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

/* List transitions */
.field-list-enter-active,
.field-list-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.field-list-enter-from,
.field-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.field-list-move {
  transition: transform var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>
