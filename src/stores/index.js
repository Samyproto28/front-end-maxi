import { createPinia } from 'pinia'

// Crear e instalar Pinia
const pinia = createPinia()

// Exportar la instancia de Pinia
export default pinia

// Exportar todos los stores para fácil acceso
export { useProvinciaStore } from './provinciaStore'
export { useListaStore } from './listaStore'
export { useMesaStore } from './mesaStore'
export { useTelegramaStore } from './telegramaStore'
export { useResultadoStore } from './resultadoStore'
