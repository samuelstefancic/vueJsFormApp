<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFormBuilderStore } from '../stores/formBuilder'
import { validateSchema } from '../utils/validation'
import FieldPalette from '../components/builder/FieldPalette.vue'
import FormCanvas from '../components/builder/FormCanvas.vue'
import FieldPropertiesPanel from '../components/builder/FieldPropertiesPanel.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import BaseToast from '../components/ui/BaseToast.vue'

const router = useRouter()
const store = useFormBuilderStore()

const isEditingTitle = ref(false)
const editedTitle = ref('')

function startEditingTitle() {
  editedTitle.value = store.schema.title
  isEditingTitle.value = true
}

function saveTitle() {
  store.updateTitle(editedTitle.value || 'Nouveau formulaire')
  isEditingTitle.value = false
}

function cancelEditTitle() {
  isEditingTitle.value = false
}

const showImportModal = ref(false)
const importJson = ref('')
const importError = ref('')

function openImportModal() {
  importJson.value = ''
  importError.value = ''
  showImportModal.value = true
}

function handleImport() {
  try {
    const parsed = JSON.parse(importJson.value)
    const validation = validateSchema(parsed)

    if (!validation.valid) {
      importError.value = validation.errors.join('\n')
      return
    }

    const success = store.importSchema(importJson.value)
    if (success) {
      showImportModal.value = false
      showToast('Formulaire importé avec succès', 'success')
    } else {
      importError.value = 'Erreur lors de l\'import du schéma'
    }
  } catch (e) {
    importError.value = 'JSON invalide: ' + e.message
  }
}

async function handleExport() {
  const json = store.exportSchema()

  try {
    await navigator.clipboard.writeText(json)
  } catch (e) {}

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugifyTitle(store.schema.title)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showToast('JSON copié et téléchargé', 'success')
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'formulaire'
}

function goToPreview() {
  router.push('/preview')
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

const fieldCount = computed(() => store.schema.fields.length)
</script>

<template>
  <div class="builder-view">
    <header class="builder-header">
      <div class="header-left">
        <div class="title-section">
          <template v-if="isEditingTitle">
            <input
              v-model="editedTitle"
              type="text"
              class="title-input"
              placeholder="Nom du formulaire"
              @keyup.enter="saveTitle"
              @keyup.escape="cancelEditTitle"
              @blur="saveTitle"
              autofocus
            />
          </template>
          <template v-else>
            <h1 class="form-title" @click="startEditingTitle">
              {{ store.schema.title }}
            </h1>
            <button class="edit-title-btn" @click="startEditingTitle" title="Modifier le titre">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5L13.5 4.5M2 14L2.5 11.5L11 3L13 5L4.5 13.5L2 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </template>
        </div>
        <span class="field-count">{{ fieldCount }} champ{{ fieldCount !== 1 ? 's' : '' }}</span>
      </div>

      <div class="header-actions">
        <BaseButton variant="secondary" size="sm" @click="openImportModal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 10V2M8 10L5 7M8 10L11 7M2 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Importer
        </BaseButton>
        <BaseButton variant="secondary" size="sm" @click="handleExport">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V10M8 2L5 5M8 2L11 5M2 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Exporter
        </BaseButton>
        <BaseButton size="sm" @click="goToPreview">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
          </svg>
          Prévisualiser
        </BaseButton>
      </div>
    </header>

    <div class="builder-content">
      <FieldPalette />
      <FormCanvas />
      <FieldPropertiesPanel />
    </div>

    <BaseModal
      :open="showImportModal"
      title="Importer un formulaire"
      confirm-text="Importer"
      @close="showImportModal = false"
      @confirm="handleImport"
    >
      <div class="import-content">
        <p class="import-hint">Collez le JSON de votre formulaire ci-dessous :</p>
        <textarea
          v-model="importJson"
          class="import-textarea"
          placeholder='{ "version": 1, "title": "...", "fields": [...] }'
          rows="10"
        ></textarea>
        <p v-if="importError" class="import-error">{{ importError }}</p>
      </div>
    </BaseModal>

    <BaseToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
  </div>
</template>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header */
.builder-header {
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
  gap: var(--space-lg);
}

.title-section {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.form-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  cursor: pointer;
  padding: var(--space-xs) 0;
  border-bottom: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.form-title:hover {
  border-color: var(--color-accent);
}

.title-input {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text);
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--color-accent);
  padding: var(--space-xs) 0;
  min-width: 200px;
}

.title-input:focus {
  outline: none;
}

.edit-title-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  opacity: 0;
  transition:
    opacity var(--transition-fast),
    background-color var(--transition-fast);
}

.title-section:hover .edit-title-btn {
  opacity: 1;
}

.edit-title-btn:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.field-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-bg);
  border-radius: var(--radius-full);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* Main content */
.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Import modal */
.import-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.import-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.import-textarea {
  width: 100%;
  padding: var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 200px;
}

.import-textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}

.import-error {
  font-size: var(--text-xs);
  color: var(--color-danger);
  white-space: pre-wrap;
  padding: var(--space-sm);
  background-color: var(--color-danger-light);
  border-radius: var(--radius-sm);
}
</style>
