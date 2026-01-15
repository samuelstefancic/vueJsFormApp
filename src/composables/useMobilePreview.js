import { ref, computed } from 'vue'

/**
 * Device presets for mobile preview
 */
export const DEVICE_PRESETS = {
  DESKTOP: {
    id: 'desktop',
    name: 'Bureau',
    width: '100%',
    height: '100%',
    icon: 'desktop'
  },
  TABLET_LANDSCAPE: {
    id: 'tablet-landscape',
    name: 'Tablette (paysage)',
    width: 1024,
    height: 768,
    icon: 'tablet'
  },
  TABLET_PORTRAIT: {
    id: 'tablet-portrait',
    name: 'Tablette (portrait)',
    width: 768,
    height: 1024,
    icon: 'tablet'
  },
  MOBILE_LARGE: {
    id: 'mobile-large',
    name: 'Mobile (grand)',
    width: 428,
    height: 926,
    icon: 'phone'
  },
  MOBILE_MEDIUM: {
    id: 'mobile-medium',
    name: 'Mobile (moyen)',
    width: 390,
    height: 844,
    icon: 'phone'
  },
  MOBILE_SMALL: {
    id: 'mobile-small',
    name: 'Mobile (petit)',
    width: 375,
    height: 667,
    icon: 'phone'
  }
}

/**
 * Composable for mobile preview viewport simulation
 */
export function useMobilePreview() {
  const currentDevice = ref(DEVICE_PRESETS.DESKTOP)
  const isRotated = ref(false)
  const zoom = ref(100)

  const viewportStyle = computed(() => {
    const device = currentDevice.value

    if (device.id === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        transform: 'none'
      }
    }

    const width = isRotated.value ? device.height : device.width
    const height = isRotated.value ? device.width : device.height

    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${zoom.value / 100})`,
      transformOrigin: 'top center'
    }
  })

  const deviceFrame = computed(() => {
    const device = currentDevice.value

    if (device.id === 'desktop') {
      return null
    }

    return {
      isMobile: device.id.startsWith('mobile'),
      isTablet: device.id.startsWith('tablet'),
      hasNotch: device.id === 'mobile-large' || device.id === 'mobile-medium'
    }
  })

  /**
   * Set device preset
   */
  function setDevice(deviceId) {
    const device = Object.values(DEVICE_PRESETS).find(d => d.id === deviceId)
    if (device) {
      currentDevice.value = device
      isRotated.value = false
    }
  }

  /**
   * Toggle device rotation
   */
  function toggleRotation() {
    if (currentDevice.value.id !== 'desktop') {
      isRotated.value = !isRotated.value
    }
  }

  /**
   * Set zoom level (25-200%)
   */
  function setZoom(level) {
    zoom.value = Math.min(200, Math.max(25, level))
  }

  /**
   * Reset to desktop view
   */
  function resetToDesktop() {
    currentDevice.value = DEVICE_PRESETS.DESKTOP
    isRotated.value = false
    zoom.value = 100
  }

  /**
   * Get all device presets as array
   */
  function getDeviceList() {
    return Object.values(DEVICE_PRESETS)
  }

  return {
    currentDevice,
    isRotated,
    zoom,
    viewportStyle,
    deviceFrame,
    setDevice,
    toggleRotation,
    setZoom,
    resetToDesktop,
    getDeviceList,
    DEVICE_PRESETS
  }
}
