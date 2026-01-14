<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useLocalStorage'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import BaseToast from '../components/ui/BaseToast.vue'

const router = useRouter()
const { savedSubmissions, loadSubmissions, deleteSubmission, getFormById, formatDate } = useLocalStorage()

onMounted(() => {
  loadSubmissions()
})

const submissions = computed(() => savedSubmissions.value)

const selectedSubmission = ref(null)
const showDeleteConfirm = ref(false)
const submissionToDelete = ref(null)

function viewSubmission(submission) {
  selectedSubmission.value = submission
}

function closeDetail() {
  selectedSubmission.value = null
}

function confirmDelete(submission, event) {
  event.stopPropagation()
  submissionToDelete.value = submission
  showDeleteConfirm.value = true
}

function handleDelete() {
  if (submissionToDelete.value) {
    deleteSubmission(submissionToDelete.value.id)
    if (selectedSubmission.value?.id === submissionToDelete.value.id) {
      selectedSubmission.value = null
    }
    showToast('Soumission supprimée', 'success')
  }
  showDeleteConfirm.value = false
  submissionToDelete.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  submissionToDelete.value = null
}

function goToBuilder() {
  router.push('/builder')
}

function editForm(submission, event) {
  if (event) event.stopPropagation()

  if (submission.formId) {
    const form = getFormById(submission.formId)
    if (form) {
      router.push({ path: '/builder', query: { loadForm: submission.formId } })
      return
    }
  }
  showToast('Formulaire original non trouvé', 'error')
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

function formatSubmissionData(data) {
  return JSON.stringify(data, null, 2)
}
</script>

<template>
  <div class="submissions-view">
    <header class="submissions-header">
      <div class="header-left">
        <button class="back-button" @click="goToBuilder" title="Retour au builder">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="title-section">
          <span class="page-label">Mes formulaires</span>
          <h1 class="page-title">Soumissions</h1>
        </div>
      </div>

      <div class="header-actions">
        <span class="submission-count">{{ submissions.length }} soumission{{ submissions.length !== 1 ? 's' : '' }}</span>
      </div>
    </header>

    <div class="submissions-content">
      <div class="submissions-list-container">
        <div v-if="submissions.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M20 28H44M20 36H36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="empty-title">Aucune soumission</h3>
          <p class="empty-description">
            Les formulaires validés apparaîtront ici.
          </p>
          <BaseButton @click="goToBuilder">
            Retour au builder
          </BaseButton>
        </div>

        <ul v-else class="submissions-list">
          <li
            v-for="submission in submissions"
            :key="submission.id"
            :class="['submission-item', { selected: selectedSubmission?.id === submission.id }]"
            @click="viewSubmission(submission)"
          >
            <div class="submission-info">
              <span class="submission-title">{{ submission.formTitle }}</span>
              <span class="submission-date">{{ formatDate(submission.submittedAt) }}</span>
            </div>
            <div class="submission-actions">
              <button
                v-if="submission.formId"
                class="action-button edit-button"
                @click="editForm(submission, $event)"
                title="Modifier le formulaire"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.5 2.5L13.5 4.5M2 14L2.5 11.5L11 3L13 5L4.5 13.5L2 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                class="action-button delete-button"
                @click="confirmDelete(submission, $event)"
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

      <Transition name="slide">
        <aside v-if="selectedSubmission" class="detail-panel">
          <div class="detail-header">
            <h3 class="detail-title">{{ selectedSubmission.formTitle }}</h3>
            <button class="close-button" @click="closeDetail" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="detail-meta">
            <span>Soumis le {{ formatDate(selectedSubmission.submittedAt) }}</span>
          </div>
          <div v-if="selectedSubmission.formId" class="detail-actions">
            <BaseButton size="sm" @click="editForm(selectedSubmission)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5L13.5 4.5M2 14L2.5 11.5L11 3L13 5L4.5 13.5L2 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Modifier le formulaire
            </BaseButton>
          </div>
          <div class="detail-content">
            <h4 class="data-title">Données</h4>
            <pre class="data-json">{{ formatSubmissionData(selectedSubmission.data) }}</pre>
          </div>
        </aside>
      </Transition>
    </div>

    <BaseModal
      :open="showDeleteConfirm"
      title="Supprimer la soumission"
      confirm-text="Supprimer"
      variant="danger"
      @close="cancelDelete"
      @confirm="handleDelete"
    >
      <p>
        Êtes-vous sûr de vouloir supprimer cette soumission ?
        Cette action est irréversible.
      </p>
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
.submissions-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg);
}

.submissions-header {
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

.page-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-title {
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

.submission-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.submissions-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.submissions-list-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-2xl);
  height: 100%;
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

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 600px;
}

.submission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.submission-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.submission-item.selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.submission-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.submission-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.submission-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.submission-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  opacity: 0;
  transition:
    opacity var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.submission-item:hover .action-button {
  opacity: 1;
}

.edit-button:hover {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.delete-button:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.detail-panel {
  width: 400px;
  background-color: var(--color-bg-elevated);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.detail-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  color: var(--color-text);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.close-button:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.detail-meta {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.detail-actions {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.detail-content {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
}

.data-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.data-json {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text);
  background-color: var(--color-bg);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
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
