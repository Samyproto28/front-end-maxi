/**
 * Configuración global para tests
 * Se ejecuta antes de cada test
 */

// Mock de fetch global
global.fetch = vi.fn()

// Polyfill para ResizeObserver (requerido por Headless UI)
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Configuración de ViGlobals
beforeEach(() => {
  // Limpiar todos los mocks antes de cada test
  vi.clearAllMocks()
})
