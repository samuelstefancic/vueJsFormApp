<script setup>
import { ref, computed } from 'vue'
import { useTemplatesStore } from '../../stores/templates'
import BaseButton from '../ui/BaseButton.vue'

const emit = defineEmits(['select', 'close'])

const templatesStore = useTemplatesStore()
const hoveredTemplate = ref(null)

const categories = computed(() => templatesStore.categories)
const selectedCategory = computed(() => templatesStore.selectedCategory)
const templates = computed(() => templatesStore.filteredTemplates)

function selectCategory(categoryId) {
  templatesStore.setCategory(categoryId)
}

function selectTemplate(template) {
  emit('select', template)
}

function handleMouseEnter(template) {
  hoveredTemplate.value = template.id
}

function handleMouseLeave() {
  hoveredTemplate.value = null
}
</script>

<template>
  <div class="template-gallery">
    <div class="gallery-header">
      <h3 class="gallery-title">Choisir un modele</h3>
      <p class="gallery-subtitle">Demarrez avec un formulaire pre-configure</p>
    </div>

    <nav class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['category-tab', { active: selectedCategory === category.id }]"
        @click="selectCategory(category.id)"
      >
        {{ category.label }}
      </button>
    </nav>

    <div class="templates-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        @mouseenter="handleMouseEnter(template)"
        @mouseleave="handleMouseLeave"
      >
        <div class="template-thumbnail">
          <span class="template-emoji">{{ template.thumbnail }}</span>
        </div>
        <div class="template-info">
          <h4 class="template-name">{{ template.name }}</h4>
          <p class="template-description">{{ template.description }}</p>
          <span class="template-fields-count">{{ template.fields.length }} champs</span>
        </div>

        <Transition name="preview-fade">
          <div v-if="hoveredTemplate === template.id" class="template-preview">
            <div class="preview-header">Apercu des champs</div>
            <ul class="preview-fields">
              <li v-for="field in template.fields" :key="field.id" class="preview-field">
                <span class="preview-field-type">{{ field.type }}</span>
                <span class="preview-field-label">{{ field.label }}</span>
                <span v-if="field.required" class="preview-field-required">*</span>
              </li>
            </ul>
          </div>
        </Transition>

        <div class="template-actions">
          <BaseButton size="sm" @click="selectTemplate(template)">
            Utiliser ce modele
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="templates.length === 0" class="no-templates">
      <p>Aucun modele dans cette categorie</p>
    </div>
  </div>
</template>

<style scoped>
.template-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-height: 70vh;
}

.gallery-header {
  text-align: center;
}

.gallery-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-normal);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.gallery-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.category-tabs {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.category-tab {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.category-tab:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.category-tab.active {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
  overflow-y: auto;
  padding: var(--space-xs);
}

.template-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.template-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.template-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--color-accent-light);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
}

.template-emoji {
  font-size: 28px;
  line-height: 1;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.template-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text);
  margin: 0;
}

.template-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.template-fields-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-sm);
  align-self: flex-start;
  margin-top: var(--space-sm);
}

.template-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.preview-header {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-sm);
}

.preview-fields {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.preview-field {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.preview-field-type {
  padding: 2px var(--space-xs);
  background-color: var(--color-accent-light);
  color: var(--color-accent);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  font-size: 10px;
}

.preview-field-label {
  color: var(--color-text);
  flex: 1;
}

.preview-field-required {
  color: var(--color-danger);
  font-weight: var(--font-bold);
}

.template-actions {
  margin-top: var(--space-lg);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 20;
}

.no-templates {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-muted);
}

/* Transitions */
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity var(--transition-fast);
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
