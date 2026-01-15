import { ref } from 'vue'

/**
 * Composable for drag and drop field reordering
 * @param {Function} onReorder - Callback when reorder completes (fromId, toId)
 */
export function useDragDrop(onReorder) {
  const draggedItem = ref(null)
  const draggedOverItem = ref(null)
  const isDragging = ref(false)

  function handleDragStart(item, event) {
    draggedItem.value = item
    isDragging.value = true

    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', item.id)
    }
  }

  function handleDragOver(item, event) {
    if (event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }

    if (draggedItem.value && item.id !== draggedItem.value.id) {
      draggedOverItem.value = item
    }
  }

  function handleDragEnter(item, event) {
    if (event) {
      event.preventDefault()
    }
    if (draggedItem.value && item.id !== draggedItem.value.id) {
      draggedOverItem.value = item
    }
  }

  function handleDragLeave(event) {
    if (event) {
      event.preventDefault()
    }
  }

  function handleDrop(event) {
    if (event) {
      event.preventDefault()
    }

    if (draggedItem.value && draggedOverItem.value) {
      onReorder(draggedItem.value.id, draggedOverItem.value.id)
    }

    resetDragState()
  }

  function handleDragEnd() {
    resetDragState()
  }

  function resetDragState() {
    draggedItem.value = null
    draggedOverItem.value = null
    isDragging.value = false
  }

  return {
    draggedItem,
    draggedOverItem,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  }
}
