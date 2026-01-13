<script setup>
import { computed, watch, ref } from 'vue'
import { useFormBuilderStore } from '../../stores/formBuilder'
import BaseInput from '../ui/BaseInput.vue'
import BaseCheckbox from '../ui/BaseCheckbox.vue'
import OptionEditor from '../form/OptionEditor.vue'

const store = useFormBuilderStore()

const selectedField = computed(() => store.selectedField)
const hasSelection = computed(() => selectedField.value !== null)

const localLabel = ref('')
const localName = ref('')
const localPlaceholder = ref('')
const localMin = ref(null)
const localMax = ref(null)
const localStep = ref(1)
const localMaxRating = ref(5)

watch(selectedField, (field) => {
  if (field) {
    localLabel.value = field.label || ''
    localName.value = field.name || ''
    localPlaceholder.value = field.placeholder || ''
    localMin.value = field.min ?? null
    localMax.value = field.max ?? null
    localStep.value = field.step ?? 1
    localMaxRating.value = field.maxRating ?? 5
  }
}, { immediate: true })

const typeLabels = {
  text: 'Champ texte',
  textarea: 'Zone de texte',
  number: 'Nombre',
  select: 'Liste déroulante',
  checkbox: 'Case à cocher',
  date: 'Date',
  time: 'Heure',
  email: 'Email',
  phone: 'Téléphone',
  url: 'URL',
  rating: 'Notation',
  radio: 'Boutons radio',
  slider: 'Curseur',
  multiselect: 'Sélection multiple'
}

function updateLabel(value) {
  localLabel.value = value
  store.updateField(selectedField.value.id, { label: value })
}

function updateName(value) {
  localName.value = value
  store.updateField(selectedField.value.id, { name: value })
}

function updateRequired(value) {
  store.updateField(selectedField.value.id, { required: value })
}

function updatePlaceholder(value) {
  localPlaceholder.value = value
  store.updateField(selectedField.value.id, { placeholder: value })
}

function updateDefaultValue(value) {
  store.updateField(selectedField.value.id, { defaultValue: value })
}

function updateMin(value) {
  const numValue = value === '' ? null : Number(value)
  localMin.value = numValue
  store.updateField(selectedField.value.id, { min: numValue })
}

function updateMax(value) {
  const numValue = value === '' ? null : Number(value)
  localMax.value = numValue
  store.updateField(selectedField.value.id, { max: numValue })
}

function updateOptions(options) {
  store.updateField(selectedField.value.id, { options })
}

function updateCheckboxDefault(value) {
  store.updateField(selectedField.value.id, { defaultValue: value })
}

function updateStep(value) {
  const numValue = value === '' ? 1 : Number(value)
  localStep.value = numValue
  store.updateField(selectedField.value.id, { step: numValue })
}

function updateMaxRating(value) {
  const numValue = value === '' ? 5 : Number(value)
  localMaxRating.value = numValue
  store.updateField(selectedField.value.id, { maxRating: numValue })
}
</script>

<template>
  <aside class="properties-panel">
    <template v-if="hasSelection">
      <header class="panel-header">
        <h2 class="panel-title">Propriétés</h2>
        <span class="field-type-badge">{{ typeLabels[selectedField.type] }}</span>
      </header>

      <div class="properties-content">
        <section class="property-section">
          <h3 class="section-title">Général</h3>

          <div class="property-group">
            <BaseInput
              :model-value="localLabel"
              label="Label"
              placeholder="Ex: Prénom"
              @update:model-value="updateLabel"
            />
          </div>

          <div class="property-group">
            <BaseInput
              :model-value="localName"
              label="Nom (identifiant)"
              placeholder="Ex: first_name"
              hint="Utilisé comme clé dans les données"
              @update:model-value="updateName"
            />
          </div>

          <div class="property-group">
            <BaseCheckbox
              :model-value="selectedField.required"
              label="Champ requis"
              @update:model-value="updateRequired"
            />
          </div>
        </section>

        <section
          v-if="['text', 'textarea', 'number', 'date', 'time', 'email', 'phone', 'url'].includes(selectedField.type)"
          class="property-section"
        >
          <h3 class="section-title">Affichage</h3>

          <div class="property-group">
            <BaseInput
              :model-value="localPlaceholder"
              label="Placeholder"
              placeholder="Texte d'aide"
              @update:model-value="updatePlaceholder"
            />
          </div>
        </section>

        <section v-if="selectedField.type === 'number'" class="property-section">
          <h3 class="section-title">Limites</h3>

          <div class="property-row">
            <div class="property-group">
              <BaseInput
                :model-value="localMin"
                type="number"
                label="Minimum"
                placeholder="—"
                @update:model-value="updateMin"
              />
            </div>
            <div class="property-group">
              <BaseInput
                :model-value="localMax"
                type="number"
                label="Maximum"
                placeholder="—"
                @update:model-value="updateMax"
              />
            </div>
          </div>
        </section>

        <section v-if="selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'multiselect'" class="property-section">
          <h3 class="section-title">Options</h3>

          <OptionEditor
            :options="selectedField.options || []"
            @update:options="updateOptions"
          />
        </section>

        <section v-if="selectedField.type === 'checkbox'" class="property-section">
          <h3 class="section-title">Valeur par défaut</h3>

          <div class="property-group">
            <BaseCheckbox
              :model-value="selectedField.defaultValue || false"
              label="Coché par défaut"
              @update:model-value="updateCheckboxDefault"
            />
          </div>
        </section>

        <section
          v-if="['text', 'number', 'email', 'phone', 'url'].includes(selectedField.type)"
          class="property-section"
        >
          <h3 class="section-title">Valeur par défaut</h3>

          <div class="property-group">
            <BaseInput
              :model-value="selectedField.defaultValue || ''"
              :type="selectedField.type === 'number' ? 'number' : 'text'"
              label="Valeur initiale"
              placeholder="Laisser vide pour aucune"
              @update:model-value="updateDefaultValue"
            />
          </div>
        </section>

        <section v-if="selectedField.type === 'slider'" class="property-section">
          <h3 class="section-title">Configuration du curseur</h3>

          <div class="property-row">
            <div class="property-group">
              <BaseInput
                :model-value="localMin"
                type="number"
                label="Minimum"
                placeholder="0"
                @update:model-value="updateMin"
              />
            </div>
            <div class="property-group">
              <BaseInput
                :model-value="localMax"
                type="number"
                label="Maximum"
                placeholder="100"
                @update:model-value="updateMax"
              />
            </div>
          </div>

          <div class="property-group">
            <BaseInput
              :model-value="localStep"
              type="number"
              label="Pas"
              placeholder="1"
              @update:model-value="updateStep"
            />
          </div>

          <div class="property-group">
            <BaseInput
              :model-value="selectedField.defaultValue || 50"
              type="number"
              label="Valeur par défaut"
              @update:model-value="updateDefaultValue"
            />
          </div>
        </section>

        <section v-if="selectedField.type === 'rating'" class="property-section">
          <h3 class="section-title">Configuration de la notation</h3>

          <div class="property-group">
            <BaseInput
              :model-value="localMaxRating"
              type="number"
              label="Nombre d'étoiles"
              placeholder="5"
              :min="1"
              :max="10"
              @update:model-value="updateMaxRating"
            />
          </div>

          <div class="property-group">
            <BaseInput
              :model-value="selectedField.defaultValue || 0"
              type="number"
              label="Valeur par défaut"
              :min="0"
              :max="selectedField.maxRating || 5"
              @update:model-value="updateDefaultValue"
            />
          </div>
        </section>
      </div>
    </template>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="M18 24H30M24 18V30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-text">
        Sélectionnez un champ pour modifier ses propriétés
      </p>
    </div>
  </aside>
</template>

<style scoped>
.properties-panel {
  width: 320px;
  height: 100%;
  background-color: var(--color-bg-elevated);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.panel-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  color: var(--color-text);
}

.field-type-badge {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  background-color: var(--color-accent-light);
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.properties-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.property-section {
  margin-bottom: var(--space-xl);
}

.property-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
}

.property-group {
  margin-bottom: var(--space-md);
}

.property-group:last-child {
  margin-bottom: 0;
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--space-xl);
}

.empty-icon {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.empty-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-width: 200px;
  line-height: 1.6;
}
</style>
