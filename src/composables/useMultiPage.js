import { ref, computed } from 'vue'

/**
 * Composable for multi-page/step form navigation
 */
export function useMultiPage(pages = []) {
  const currentPageIndex = ref(0)
  const pageHistory = ref([0])

  const totalPages = computed(() => pages.length || 1)

  const currentPage = computed(() => {
    if (pages.length === 0) return null
    return pages[currentPageIndex.value] || pages[0]
  })

  const isFirstPage = computed(() => currentPageIndex.value === 0)
  const isLastPage = computed(() => currentPageIndex.value >= totalPages.value - 1)

  const progress = computed(() => {
    if (totalPages.value <= 1) return 100
    return Math.round(((currentPageIndex.value + 1) / totalPages.value) * 100)
  })

  const progressSteps = computed(() => {
    return pages.map((page, index) => ({
      ...page,
      index,
      isCompleted: index < currentPageIndex.value,
      isCurrent: index === currentPageIndex.value,
      isUpcoming: index > currentPageIndex.value
    }))
  })

  /**
   * Go to next page
   */
  function nextPage() {
    if (!isLastPage.value) {
      currentPageIndex.value++
      pageHistory.value.push(currentPageIndex.value)
    }
  }

  /**
   * Go to previous page
   */
  function previousPage() {
    if (!isFirstPage.value) {
      currentPageIndex.value--
      // Don't add to history when going back
    }
  }

  /**
   * Go to specific page by index
   */
  function goToPage(index) {
    if (index >= 0 && index < totalPages.value) {
      currentPageIndex.value = index
      pageHistory.value.push(index)
    }
  }

  /**
   * Go to specific page by ID
   */
  function goToPageById(pageId) {
    const index = pages.findIndex(p => p.id === pageId)
    if (index !== -1) {
      goToPage(index)
    }
  }

  /**
   * Reset to first page
   */
  function reset() {
    currentPageIndex.value = 0
    pageHistory.value = [0]
  }

  /**
   * Check if can proceed to next page (for validation)
   */
  function canProceed(validateFn) {
    if (!validateFn) return true
    return validateFn(currentPage.value)
  }

  return {
    currentPageIndex,
    currentPage,
    totalPages,
    isFirstPage,
    isLastPage,
    progress,
    progressSteps,
    pageHistory,
    nextPage,
    previousPage,
    goToPage,
    goToPageById,
    reset,
    canProceed
  }
}
