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

function toggleMultiselectOption(fieldId, optionValue, isChecked) {
  const currentValues = props.values[fieldId] || []
  let newValues

  if (isChecked) {
    newValues = [...currentValues, optionValue]
  } else {
    newValues = currentValues.filter(v => v !== optionValue)
  }

  emit('update:values', {
    ...props.values,
    [fieldId]: newValues
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

        <div v-else-if="field.type === 'checkbox'" class="checkbox-field-wrapper">
          <BaseCheckbox
            :model-value="getValue(field.id) || false"
            :label="field.label"
            :disabled="readonly"
            :error="getError(field.id)"
            @update:model-value="updateValue(field.id, $event)"
          />
          <span v-if="field.required" class="checkbox-required-mark">*</span>
        </div>

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

        <BaseInput
          v-else-if="field.type === 'email'"
          :model-value="getValue(field.id)"
          type="email"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseInput
          v-else-if="field.type === 'phone'"
          :model-value="getValue(field.id)"
          type="tel"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <BaseInput
          v-else-if="field.type === 'url'"
          :model-value="getValue(field.id)"
          type="url"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <div v-else-if="field.type === 'rating'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>
          <div class="rating-field">
            <button
              v-for="star in (field.maxRating || 5)"
              :key="star"
              type="button"
              class="rating-star"
              :class="{ active: star <= (getValue(field.id) || 0) }"
              :disabled="readonly"
              @click="updateValue(field.id, star)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.09 8.26L21 9L16 14L17.18 21L12 17.77L6.82 21L8 14L3 9L9.91 8.26L12 2Z"
                  :fill="star <= (getValue(field.id) || 0) ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <span v-if="getError(field.id)" class="field-error">{{ getError(field.id) }}</span>
        </div>

        <div v-else-if="field.type === 'radio'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>
          <div class="radio-group">
            <label
              v-for="option in (field.options || [])"
              :key="option.value"
              class="radio-option"
            >
              <input
                type="radio"
                :name="field.id"
                :value="option.value"
                :checked="getValue(field.id) === option.value"
                :disabled="readonly"
                @change="updateValue(field.id, option.value)"
              />
              <span class="radio-indicator"></span>
              <span class="radio-label">{{ option.label }}</span>
            </label>
          </div>
          <span v-if="getError(field.id)" class="field-error">{{ getError(field.id) }}</span>
        </div>

        <div v-else-if="field.type === 'slider'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>
          <div class="slider-field">
            <input
              type="range"
              class="slider-input"
              :value="getValue(field.id) ?? field.defaultValue ?? 50"
              :min="field.min ?? 0"
              :max="field.max ?? 100"
              :step="field.step ?? 1"
              :disabled="readonly"
              @input="updateValue(field.id, Number($event.target.value))"
            />
            <span class="slider-value">{{ getValue(field.id) ?? field.defaultValue ?? 50 }}</span>
          </div>
          <div class="slider-labels">
            <span>{{ field.min ?? 0 }}</span>
            <span>{{ field.max ?? 100 }}</span>
          </div>
          <span v-if="getError(field.id)" class="field-error">{{ getError(field.id) }}</span>
        </div>

        <BaseInput
          v-else-if="field.type === 'time'"
          :model-value="getValue(field.id)"
          type="time"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="readonly"
          :error="getError(field.id)"
          @update:model-value="updateValue(field.id, $event)"
        />

        <div v-else-if="field.type === 'multiselect'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>
          <div class="multiselect-options">
            <label
              v-for="option in (field.options || [])"
              :key="option.value"
              class="multiselect-option"
            >
              <input
                type="checkbox"
                :value="option.value"
                :checked="(getValue(field.id) || []).includes(option.value)"
                :disabled="readonly"
                @change="toggleMultiselectOption(field.id, option.value, $event.target.checked)"
              />
              <span class="multiselect-checkbox"></span>
              <span class="multiselect-label">{{ option.label }}</span>
            </label>
          </div>
          <span v-if="getError(field.id)" class="field-error">{{ getError(field.id) }}</span>
        </div>
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

/* Custom field wrapper styles */
.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.required-mark {
  color: var(--color-danger);
  margin-left: 2px;
}

.field-error {
  font-size: var(--text-xs);
  color: var(--color-danger);
}

/* Checkbox field styles */
.checkbox-field-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.checkbox-required-mark {
  color: var(--color-danger);
  font-size: var(--text-sm);
  margin-left: -4px;
}

/* Rating field styles */
.rating-field {
  display: flex;
  gap: var(--space-xs);
}

.rating-star {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.rating-star:hover {
  transform: scale(1.1);
}

.rating-star.active {
  color: var(--color-warning, #f59e0b);
}

.rating-star:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Radio group styles */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  background-color: var(--color-bg);
  position: relative;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.radio-option input[type="radio"]:checked + .radio-indicator {
  border-color: var(--color-accent);
}

.radio-option input[type="radio"]:checked + .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: var(--color-accent);
  border-radius: 50%;
}

.radio-option input[type="radio"]:disabled + .radio-indicator {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-label {
  font-size: var(--text-sm);
  color: var(--color-text);
}

/* Slider field styles */
.slider-field {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.slider-input {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border);
  border-radius: var(--radius-full);
  outline: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-accent);
  border-radius: 50%;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 4px var(--color-accent-light);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-accent);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.slider-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.slider-input:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.slider-value {
  min-width: 40px;
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  background-color: var(--color-accent-light);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Multiselect field styles */
.multiselect-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.multiselect-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.multiselect-option:hover {
  background-color: var(--color-bg-hover);
}

.multiselect-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.multiselect-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  position: relative;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
  flex-shrink: 0;
}

.multiselect-option input[type="checkbox"]:checked + .multiselect-checkbox {
  border-color: var(--color-accent);
  background-color: var(--color-accent);
}

.multiselect-option input[type="checkbox"]:checked + .multiselect-checkbox::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 6px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.multiselect-option input[type="checkbox"]:disabled + .multiselect-checkbox {
  opacity: 0.6;
  cursor: not-allowed;
}

.multiselect-label {
  font-size: var(--text-sm);
  color: var(--color-text);
}
</style>
