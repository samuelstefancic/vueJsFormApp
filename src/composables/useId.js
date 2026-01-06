let counter = 0

export function generateId() {
  counter++
  return `f_${Date.now()}_${counter}`
}

export function useId() {
  return { generateId }
}
