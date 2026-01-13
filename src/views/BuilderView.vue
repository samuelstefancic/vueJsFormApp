<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormBuilderStore } from '../stores/formBuilder'
import { useTemplatesStore } from '../stores/templates'
import { validateSchema } from '../utils/validation'
import FieldPalette from '../components/builder/FieldPalette.vue'
import FormCanvas from '../components/builder/FormCanvas.vue'
import FieldPropertiesPanel from '../components/builder/FieldPropertiesPanel.vue'
import TemplateGallery from '../components/builder/TemplateGallery.vue'
import SavedFormsPanel from '../components/builder/SavedFormsPanel.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import BaseToast from '../components/ui/BaseToast.vue'

const router = useRouter()
const store = useFormBuilderStore()
const templatesStore = useTemplatesStore()

// Keyboard shortcuts
function handleKeyDown(e) {
  // Don't trigger shortcuts when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
    return
  }

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const ctrlKey = isMac ? e.metaKey : e.ctrlKey

  // Ctrl/Cmd + S: Save
  if (ctrlKey && e.key === 's') {
    e.preventDefault()
    handleSave()
    return
  }

  // Ctrl/Cmd + D: Duplicate selected field
  if (ctrlKey && e.key === 'd' && store.selectedFieldId) {
    e.preventDefault()
    store.duplicateField(store.selectedFieldId)
    showToast('Champ dupliqué', 'success')
    return
  }

  // Delete/Backspace: Delete selected field
  if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedFieldId) {
    e.preventDefault()
    store.removeField(store.selectedFieldId)
    showToast('Champ supprimé', 'info')
    return
  }

  // Escape: Deselect field
  if (e.key === 'Escape') {
    if (store.selectedFieldId) {
      store.selectField(null)
    }
    return
  }

  // Arrow keys: Move field up/down
  if (e.key === 'ArrowUp' && ctrlKey && store.selectedFieldId) {
    e.preventDefault()
    store.moveField(store.selectedFieldId, 'up')
    return
  }

  if (e.key === 'ArrowDown' && ctrlKey && store.selectedFieldId) {
    e.preventDefault()
    store.moveField(store.selectedFieldId, 'down')
    return
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Auto-save setup
const AUTO_SAVE_DELAY = 2000
let autoSaveTimer = null

function triggerAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  if (store.currentFormId && store.autoSaveEnabled) {
    autoSaveTimer = setTimeout(() => {
      store.saveToStorage()
      showToast('Sauvegarde automatique', 'info')
    }, AUTO_SAVE_DELAY)
  }
}

// Watch for schema changes to trigger auto-save
watch(
  () => store.schema,
  () => {
    if (store.currentFormId && store.isDirty) {
      triggerAutoSave()
    }
  },
  { deep: true }
)

onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})

// Saved forms panel
const showSavedFormsPanel = ref(false)

function openSavedFormsPanel() {
  showSavedFormsPanel.value = true
}

function closeSavedFormsPanel() {
  showSavedFormsPanel.value = false
}

// Load confirmation dialog (when there are unsaved changes)
const showLoadConfirmModal = ref(false)
const pendingLoadForm = ref(null)

function handleLoadFromPanel(form) {
  if (store.isDirty) {
    pendingLoadForm.value = form
    showLoadConfirmModal.value = true
  } else {
    loadFormDirectly(form)
  }
}

function loadFormDirectly(form) {
  store.loadFromStorage(form.id)
  showSavedFormsPanel.value = false
  showToast(`Formulaire "${form.title}" charge`, 'success')
}

function confirmLoad() {
  if (pendingLoadForm.value) {
    loadFormDirectly(pendingLoadForm.value)
  }
  showLoadConfirmModal.value = false
  pendingLoadForm.value = null
}

function cancelLoad() {
  showLoadConfirmModal.value = false
  pendingLoadForm.value = null
}

function handleDeleteFromPanel(formId) {
  if (store.currentFormId === formId) {
    store.resetToNew()
  }
  showToast('Formulaire supprime', 'info')
}

// Save / Save As functionality
const showSaveAsModal = ref(false)
const saveAsTitle = ref('')

function handleSave() {
  store.saveToStorage()
  showToast('Formulaire sauvegarde', 'success')
}

function openSaveAsModal() {
  saveAsTitle.value = store.schema.title
  showSaveAsModal.value = true
}

function handleSaveAs() {
  if (saveAsTitle.value.trim()) {
    store.saveAsNewForm(saveAsTitle.value.trim())
    showSaveAsModal.value = false
    showToast('Formulaire sauvegarde sous un nouveau nom', 'success')
  }
}

// Format last saved time
function formatLastSaved(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return "A l'instant"
  }

  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `Il y a ${minutes} min`
  }

  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

const showTemplateGallery = ref(false)

function openTemplateGallery() {
  templatesStore.setCategory('all')
  showTemplateGallery.value = true
}

function handleTemplateSelect(template) {
  store.loadFromTemplate(template)
  showTemplateGallery.value = false
  showToast(`Modele "${template.name}" charge avec succes`, 'success')
}

// New form confirmation
const showNewFormConfirmModal = ref(false)

function handleNewForm() {
  if (store.isDirty) {
    showNewFormConfirmModal.value = true
  } else {
    createNewFormDirectly()
  }
}

function createNewFormDirectly() {
  store.resetToNew()
  showNewFormConfirmModal.value = false
  showToast('Nouveau formulaire cree', 'success')
}

function cancelNewForm() {
  showNewFormConfirmModal.value = false
}

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
        <span v-if="store.isDirty" class="unsaved-indicator" title="Modifications non sauvegardees">
          <span class="unsaved-dot"></span>
          Non sauvegarde
        </span>
        <span v-else-if="store.lastSavedAt" class="saved-indicator" :title="'Derniere sauvegarde: ' + formatLastSaved(store.lastSavedAt)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ formatLastSaved(store.lastSavedAt) }}
        </span>
      </div>

      <div class="header-actions">
        <BaseButton variant="secondary" size="sm" @click="openSavedFormsPanel">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 2V6H11V2M5 14V9H11V14" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Mes formulaires
        </BaseButton>
        <BaseButton variant="secondary" size="sm" @click="handleSave" :disabled="!store.isDirty && store.currentFormId">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 14H4C3.44772 14 3 13.5523 3 13V3C3 2.44772 3.44772 2 4 2H10L13 5V13C13 13.5523 12.5523 14 12 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 2V5H13M6 10H10M6 12H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Sauvegarder
        </BaseButton>
        <BaseButton variant="ghost" size="sm" @click="openSaveAsModal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 14H4C3.44772 14 3 13.5523 3 13V3C3 2.44772 3.44772 2 4 2H10L13 5V13C13 13.5523 12.5523 14 12 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 8H11M9 6V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Enregistrer sous
        </BaseButton>
        <BaseButton variant="ghost" size="sm" @click="handleNewForm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Nouveau
        </BaseButton>
        <BaseButton variant="secondary" size="sm" @click="openTemplateGallery">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Modeles
        </BaseButton>
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

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTemplateGallery" class="template-modal-backdrop" @click.self="showTemplateGallery = false">
          <div class="template-modal-content">
            <button class="template-modal-close" @click="showTemplateGallery = false" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <TemplateGallery
              @select="handleTemplateSelect"
              @close="showTemplateGallery = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Saved Forms Panel -->
    <SavedFormsPanel
      :open="showSavedFormsPanel"
      @close="closeSavedFormsPanel"
      @load="handleLoadFromPanel"
      @delete="handleDeleteFromPanel"
    />

    <!-- Load Confirmation Modal -->
    <BaseModal
      :open="showLoadConfirmModal"
      title="Modifications non sauvegardees"
      confirm-text="Charger quand meme"
      cancel-text="Annuler"
      variant="danger"
      @close="cancelLoad"
      @confirm="confirmLoad"
    >
      <p>Vous avez des modifications non sauvegardees. Si vous chargez un autre formulaire, ces modifications seront perdues.</p>
    </BaseModal>

    <!-- New Form Confirmation Modal -->
    <BaseModal
      :open="showNewFormConfirmModal"
      title="Modifications non sauvegardees"
      confirm-text="Nouveau formulaire"
      cancel-text="Annuler"
      variant="danger"
      @close="cancelNewForm"
      @confirm="createNewFormDirectly"
    >
      <p>Vous avez des modifications non sauvegardees. Si vous creez un nouveau formulaire, ces modifications seront perdues.</p>
    </BaseModal>

    <!-- Save As Modal -->
    <BaseModal
      :open="showSaveAsModal"
      title="Enregistrer sous"
      confirm-text="Enregistrer"
      @close="showSaveAsModal = false"
      @confirm="handleSaveAs"
    >
      <div class="save-as-content">
        <label class="save-as-label">Nom du formulaire</label>
        <input
          v-model="saveAsTitle"
          type="text"
          class="save-as-input"
          placeholder="Nom du formulaire"
          @keyup.enter="handleSaveAs"
        />
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

/* Unsaved/Saved indicators */
.unsaved-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--color-warning);
  padding: var(--space-xs) var(--space-sm);
}

.unsaved-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-warning);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.saved-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--color-success);
  padding: var(--space-xs) var(--space-sm);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
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

/* Template gallery modal */
.template-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: var(--z-modal-backdrop);
}

.template-modal-content {
  position: relative;
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  padding: var(--space-xl);
  z-index: var(--z-modal);
  overflow: hidden;
}

.template-modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  z-index: 10;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.template-modal-close:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.modal-enter-active .template-modal-content,
.modal-leave-active .template-modal-content {
  transition: transform var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .template-modal-content,
.modal-leave-to .template-modal-content {
  transform: scale(0.95);
}

/* Save As modal */
.save-as-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.save-as-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.save-as-input {
  height: 40px;
  padding: 0 var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.save-as-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--ring);
}
</style>
