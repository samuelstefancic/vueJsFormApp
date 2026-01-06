export function slugify(text) {
  if (!text) return ''

  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\_\_+/g, '_')
    .replace(/^\_+/, '')
    .replace(/\_+$/, '')
}

export function generateUniqueName(label, existingNames, currentName = null) {
  const baseName = slugify(label) || 'field'

  if (currentName === baseName) {
    return baseName
  }

  if (!existingNames.includes(baseName) || baseName === currentName) {
    return baseName
  }

  let counter = 1
  let uniqueName = `${baseName}_${counter}`

  while (existingNames.includes(uniqueName) && uniqueName !== currentName) {
    counter++
    uniqueName = `${baseName}_${counter}`
  }

  return uniqueName
}
