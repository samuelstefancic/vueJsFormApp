import { ref, computed } from 'vue'

/**
 * Composable for bulk field operations
 */
export function useBulkOperations() {
  const selectedIds = ref(new Set())
  const isSelectionMode = ref(false)

  const selectedCount = computed(() => selectedIds.value.size)
  const hasSelection = computed(() => selectedIds.value.size > 0)

  /**
   * Toggle selection mode
   */
  function toggleSelectionMode() {
    isSelectionMode.value = !isSelectionMode.value
    if (!isSelectionMode.value) {
      clearSelection()
    }
  }

  /**
   * Enter selection mode
   */
  function enterSelectionMode() {
    isSelectionMode.value = true
  }

  /**
   * Exit selection mode
   */
  function exitSelectionMode() {
    isSelectionMode.value = false
    clearSelection()
  }

  /**
   * Toggle selection of a single item
   */
  function toggleSelect(id) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
    // Trigger reactivity
    selectedIds.value = new Set(selectedIds.value)
  }

  /**
   * Select a single item
   */
  function select(id) {
    selectedIds.value.add(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  /**
   * Deselect a single item
   */
  function deselect(id) {
    selectedIds.value.delete(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  /**
   * Select all items
   */
  function selectAll(ids) {
    selectedIds.value = new Set(ids)
  }

  /**
   * Clear all selections
   */
  function clearSelection() {
    selectedIds.value = new Set()
  }

  /**
   * Check if an item is selected
   */
  function isSelected(id) {
    return selectedIds.value.has(id)
  }

  /**
   * Get array of selected IDs
   */
  function getSelectedIds() {
    return Array.from(selectedIds.value)
  }

  /**
   * Perform bulk delete
   */
  function bulkDelete(deleteFunction) {
    const ids = getSelectedIds()
    ids.forEach(id => deleteFunction(id))
    clearSelection()
  }

  /**
   * Perform bulk update
   */
  function bulkUpdate(updateFunction, patch) {
    const ids = getSelectedIds()
    ids.forEach(id => updateFunction(id, patch))
  }

  /**
   * Perform bulk duplicate
   */
  function bulkDuplicate(duplicateFunction) {
    const ids = getSelectedIds()
    ids.forEach(id => duplicateFunction(id))
    clearSelection()
  }

  return {
    selectedIds,
    selectedCount,
    hasSelection,
    isSelectionMode,
    toggleSelectionMode,
    enterSelectionMode,
    exitSelectionMode,
    toggleSelect,
    select,
    deselect,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedIds,
    bulkDelete,
    bulkUpdate,
    bulkDuplicate
  }
}
