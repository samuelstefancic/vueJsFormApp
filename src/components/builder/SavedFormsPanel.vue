<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '../../composables/useLocalStorage'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseModal from '../ui/BaseModal.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'load', 'delete'])

const {
  savedForms,
  loadSavedForms,
  deleteForm,
  renameForm,
  formatDate
} = useLocalStorage()

// Refresh list when panel opens
const localForms = computed(() => {
  if (props.open) {
    loadSavedForms()
  }
  return savedForms.value
})

// Delete confirmation
const showDeleteConfirm = ref(false)
const formToDelete = ref(null)

function confirmDelete(form) {
  formToDelete.value = form
  showDeleteConfirm.value = true
}

function handleDelete() {
  if (formToDelete.value) {
    deleteForm(formToDelete.value.id)
    emit('delete', formToDelete.value.id)
  }
  showDeleteConfirm.value = false
  formToDelete.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  formToDelete.value = null
}

// Rename functionality
const editingFormId = ref(null)
const editedTitle = ref('')

function startRename(form) {
  editingFormId.value = form.id
  editedTitle.value = form.title
}

function saveRename(formId) {
  if (editedTitle.value.trim()) {
    renameForm(formId, editedTitle.value.trim())
  }
  editingFormId.value = null
  editedTitle.value = ''
}

function cancelRename() {
  editingFormId.value = null
  editedTitle.value = ''
}

function handleLoad(form) {
  emit('load', form)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="open" class="panel-backdrop" @click.self="$emit('close')">
        <aside class="saved-forms-panel">
          <header class="panel-header">
            <h2 class="panel-title">Formulaires sauvegardés</h2>
            <button class="close-button" @click="$emit('close')" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <div class="panel-content">
            <div v-if="localForms.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 14H32M16 22H28M16 30H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <p class="empty-text">Aucun formulaire sauvegardé</p>
              <p class="empty-hint">Utilisez le bouton "Sauvegarder" pour enregistrer votre formulaire</p>
            </div>

            <ul v-else class="forms-list">
              <li
                v-for="form in localForms"
                :key="form.id"
                class="form-item"
              >
                <div class="form-info">
                  <template v-if="editingFormId === form.id">
                    <input
                      v-model="editedTitle"
                      type="text"
                      class="rename-input"
                      @keyup.enter="saveRename(form.id)"
                      @keyup.escape="cancelRename"
                      @blur="saveRename(form.id)"
                      autofocus
                    />
                  </template>
                  <template v-else>
                    <span class="form-title" @dblclick="startRename(form)">
                      {{ form.title }}
                    </span>
                  </template>
                  <span class="form-meta">
                    <span class="form-date">{{ formatDate(form.updatedAt) }}</span>
                    <span class="form-fields">
                      {{ form.schema?.fields?.length || 0 }} champ{{ (form.schema?.fields?.length || 0) !== 1 ? 's' : '' }}
                    </span>
                  </span>
                </div>

                <div class="form-actions">
                  <button
                    class="action-button rename-button"
                    @click="startRename(form)"
                    title="Renommer"
                    v-if="editingFormId !== form.id"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.5 2.5L13.5 4.5M2 14L2.5 11.5L11 3L13 5L4.5 13.5L2 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    class="action-button edit-button"
                    @click="handleLoad(form)"
                    title="Modifier dans le builder"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 14H14M3 11L11.5 2.5L13.5 4.5L5 13H3V11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="confirmDelete(form)"
                    title="Supprimer"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4H13M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <BaseModal
    :open="showDeleteConfirm"
    title="Supprimer le formulaire"
    confirm-text="Supprimer"
    variant="danger"
    @close="cancelDelete"
    @confirm="handleDelete"
  >
    <p>
      Êtes-vous sûr de vouloir supprimer
      <strong>"{{ formToDelete?.title }}"</strong> ?
      Cette action est irréversible.
    </p>
  </BaseModal>
</template>

<style scoped>
.panel-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: var(--z-modal-backdrop);
}

.saved-forms-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100%;
  background-color: var(--color-bg-elevated);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  z-index: var(--z-modal);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.panel-title {
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

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
}

.empty-icon {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.empty-text {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Forms list */
.forms-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  list-style: none;
  padding: 0;
  margin: 0;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.form-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.form-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.form-title:hover {
  color: var(--color-accent);
}

.rename-input {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--color-accent);
  padding: 0;
  width: 100%;
}

.rename-input:focus {
  outline: none;
}

.form-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.form-date::after {
  content: '•';
  margin-left: var(--space-sm);
}

.form-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-left: var(--space-md);
  opacity: 0;
  pointer-events: none;
  flex-shrink: 0;
  transition: opacity var(--transition-fast);
}

.form-item:hover .form-actions {
  opacity: 1;
  pointer-events: auto;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.action-button:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.edit-button:hover {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.delete-button:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

/* Panel transitions */
.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--transition-base);
}

.panel-enter-active .saved-forms-panel,
.panel-leave-active .saved-forms-panel {
  transition: transform var(--transition-base);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .saved-forms-panel,
.panel-leave-to .saved-forms-panel {
  transform: translateX(100%);
}
</style>
