<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormBuilderStore } from '../stores/formBuilder'
import { validate } from '../utils/validation'
import FormRenderer from '../components/form/FormRenderer.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseToast from '../components/ui/BaseToast.vue'

const router = useRouter()
const store = useFormBuilderStore()

const formValues = ref({})
const formErrors = ref({})
const isSubmitted = ref(false)
const isValid = ref(false)

onMounted(() => {
  initializeFormValues()
})

function initializeFormValues() {
  const values = {}
  for (const field of store.schema.fields) {
    if (field.defaultValue !== undefined && field.defaultValue !== null && field.defaultValue !== '') {
      values[field.id] = field.defaultValue
    } else if (field.type === 'checkbox') {
      values[field.id] = false
    } else {
      values[field.id] = ''
    }
  }
  formValues.value = values
}

function updateValues(values) {
  formValues.value = values

  if (isSubmitted.value) {
    formErrors.value = validate(formValues.value, store.schema)
  }
}

function validateForm() {
  formErrors.value = validate(formValues.value, store.schema)
  isSubmitted.value = true
  isValid.value = Object.keys(formErrors.value).length === 0

  if (isValid.value) {
    showToast('Formulaire valide !', 'success')
  } else {
    showToast('Veuillez corriger les erreurs', 'error')
  }
}

function resetForm() {
  initializeFormValues()
  formErrors.value = {}
  isSubmitted.value = false
  isValid.value = false
}

function goToBuilder() {
  router.push('/builder')
}

const toast = ref({
  visible: false,
  message: '',
  type: 'info'
})

function showToast(message, type = 'info') {
  toast.value = { visible: true, message, type }
}

function hideToast() {
  toast.value.visible = false
}

const hasFields = computed(() => store.schema.fields.length > 0)
const showJsonPreview = ref(false)
const formData = computed(() => {
  const data = {}
  for (const field of store.schema.fields) {
    data[field.name] = formValues.value[field.id] ?? null
  }
  return JSON.stringify(data, null, 2)
})
</script>

<template>
  <div class="preview-view">
    <header class="preview-header">
      <div class="header-left">
        <button class="back-button" @click="goToBuilder" title="Retour au builder">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="title-section">
          <span class="preview-label">Prévisualisation</span>
          <h1 class="form-title">{{ store.schema.title }}</h1>
        </div>
      </div>

      <div class="header-actions">
        <BaseButton variant="secondary" size="sm" @click="showJsonPreview = !showJsonPreview">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ showJsonPreview ? 'Masquer JSON' : 'Voir JSON' }}
        </BaseButton>
        <BaseButton variant="secondary" size="sm" @click="resetForm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8C2 4.68629 4.68629 2 8 2C10.5 2 12.6 3.5 13.5 5.5M14 8C14 11.3137 11.3137 14 8 14C5.5 14 3.4 12.5 2.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M13 2V6H9M3 14V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Réinitialiser
        </BaseButton>
      </div>
    </header>

    <div class="preview-content">
      <div class="preview-main">
        <div v-if="hasFields" class="form-card">
          <div class="form-card-header">
            <h2 class="card-title">{{ store.schema.title }}</h2>
            <p class="card-description">Remplissez le formulaire et validez pour tester la validation.</p>
          </div>

          <div class="form-card-body">
            <FormRenderer
              :schema="store.schema"
              :values="formValues"
              :errors="formErrors"
              @update:values="updateValues"
            />
          </div>

          <div class="form-card-footer">
            <div v-if="isSubmitted && isValid" class="success-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Formulaire valide !</span>
            </div>
            <BaseButton @click="validateForm">
              Valider le formulaire
            </BaseButton>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M20 28H44M20 36H36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="empty-title">Formulaire vide</h3>
          <p class="empty-description">
            Votre formulaire ne contient aucun champ. Retournez au builder pour ajouter des champs.
          </p>
          <BaseButton @click="goToBuilder">
            Retour au builder
          </BaseButton>
        </div>
      </div>

      <Transition name="slide">
        <aside v-if="showJsonPreview && hasFields" class="json-panel">
          <div class="json-header">
            <h3 class="json-title">Données du formulaire</h3>
          </div>
          <pre class="json-content">{{ formData }}</pre>
        </aside>
      </Transition>
    </div>

    <BaseToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
  </div>
</template>

<style scoped>
.preview-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* Header */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.back-button:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* Content */
.preview-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.preview-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2xl);
  display: flex;
  justify-content: center;
}

/* Form card */
.form-card {
  width: 100%;
  max-width: 560px;
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: scaleIn var(--transition-base) forwards;
}

.form-card-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.form-card-body {
  padding: var(--space-xl);
}

.form-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.success-message {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-success);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-2xl);
}

.empty-icon {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.empty-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.empty-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-width: 300px;
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

/* JSON panel */
.json-panel {
  width: 360px;
  background-color: var(--color-bg-elevated);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.json-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.json-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  color: var(--color-text);
}

.json-content {
  flex: 1;
  padding: var(--space-lg);
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text);
  background-color: var(--color-bg);
  margin: 0;
  line-height: 1.6;
}

/* Animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
