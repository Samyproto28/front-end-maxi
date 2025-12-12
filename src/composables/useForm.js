/**
 * Composable para gestión de formularios con validación
 *
 * Proporciona un sistema reactivo para manejar formularios con validación,
 * inspirado en Formik/VeeValidate pero más simple y directo.
 */

import { reactive, ref } from 'vue'

/**
 * @param {Object} options - Configuración del formulario
 * @param {Object} options.initialValues - Valores iniciales del formulario
 * @param {Object} options.validationSchema - Esquema de validación con funciones validadoras
 * @param {Function} options.onSubmit - Función a ejecutar cuando el formulario sea válido
 * @returns {Object} - API del formulario reactiva
 */
export function useForm({ initialValues = {}, validationSchema = {}, onSubmit }) {
  // Estado reactivo del formulario usando reactive()
  // Esto permite que values sea reactivo y sus propiedades accesibles directamente
  const values = reactive({ ...initialValues })

  // Estado para errores de validación
  const errors = ref({})

  // Estado para campos tocados (cuando el usuario ha interactuado con ellos)
  const touched = ref({})

  // Estado para indicar si el formulario se está enviando
  const isSubmitting = ref(false)

  /**
   * Actualiza un valor del formulario y ejecuta validación
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Nuevo valor del campo
   */
  const handleChange = (fieldName, value) => {
    // Actualizar el valor del campo
    values[fieldName] = value

    // Ejecutar validación si existe un validador para este campo
    if (validationSchema[fieldName]) {
      const validationResult = validationSchema[fieldName](value)

      // Los validadores pueden retornar:
      // - String con mensaje de error
      // - {valid: boolean, error: string}
      // - null/undefined si es válido
      let errorMessage = null

      if (typeof validationResult === 'string') {
        errorMessage = validationResult
      } else if (validationResult && typeof validationResult === 'object') {
        errorMessage = validationResult.valid ? null : validationResult.error
      }

      // Actualizar errores
      if (errorMessage) {
        errors.value[fieldName] = errorMessage
      } else {
        delete errors.value[fieldName]
      }
    }
  }

  /**
   * Marca un campo como "touched" (cuando el usuario sale del campo)
   * @param {string} fieldName - Nombre del campo
   */
  const handleBlur = (fieldName) => {
    touched.value[fieldName] = true
  }

  /**
   * Ejecuta validación en todos los campos del formulario
   * @returns {Object} - Objeto con errores encontrados
   */
  const validateAll = () => {
    const newErrors = {}

    // Validar cada campo que tenga un validador definido
    Object.keys(validationSchema).forEach(fieldName => {
      const validationResult = validationSchema[fieldName](values[fieldName])

      let errorMessage = null

      if (typeof validationResult === 'string') {
        errorMessage = validationResult
      } else if (validationResult && typeof validationResult === 'object') {
        errorMessage = validationResult.valid ? null : validationResult.error
      }

      if (errorMessage) {
        newErrors[fieldName] = errorMessage
      }
    })

    errors.value = newErrors
    return newErrors
  }

  /**
   * Maneja el envío del formulario
   * Ejecuta validación completa y llama a onSubmit solo si el formulario es válido
   * @param {Event} event - Evento del formulario
   */
  const handleSubmit = async (event) => {
    // Prevenir comportamiento por defecto del formulario
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    // Marcar todos los campos como tocados
    Object.keys(validationSchema).forEach(fieldName => {
      touched.value[fieldName] = true
    })

    // Marcar como enviando
    isSubmitting.value = true

    try {
      // Validar todos los campos
      const validationErrors = validateAll()

      // Si hay errores, no ejecutar onSubmit
      if (Object.keys(validationErrors).length > 0) {
        return
      }

      // Si no hay errores, ejecutar onSubmit
      if (typeof onSubmit === 'function') {
        await onSubmit({ ...values })
      }
    } catch (error) {
      // Manejar errores silenciosamente para evitar romper la UI
      // Los errores pueden ser loggeados aquí si es necesario
      console.error('Error en handleSubmit:', error)
    } finally {
      // Asegurar que isSubmitting se resetee al finalizar
      isSubmitting.value = false
    }
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  const reset = () => {
    // Restaurar valores iniciales
    Object.keys(values).forEach(key => {
      delete values[key]
    })
    Object.assign(values, { ...initialValues })

    // Limpiar errores
    errors.value = {}

    // Limpiar campos tocados
    touched.value = {}

    // Resetear estado de envío
    isSubmitting.value = false
  }

  // Retornar API del formulario
  return {
    // Estado reactivo
    values,
    errors,
    touched,
    isSubmitting,

    // Métodos
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  }
}
