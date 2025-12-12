/**
 * Tests unitarios para useForm composable
 * Verifica que el composable maneja correctamente el estado del formulario,
 * validación y envío
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useForm } from '../useForm'
import { validateRequerido, validateEmail, validateNumeroPositivo } from '../../utils/validators'

// Mock de eventos de formulario
const createMockEvent = () => ({
  preventDefault: vi.fn()
})

describe('useForm', () => {
  describe('Inicialización', () => {
    it('debe retornar todas las propiedades esperadas', () => {
      const initialValues = { nombre: '', email: '' }
      const validationSchema = {}
      const onSubmit = vi.fn()

      const form = useForm({ initialValues, validationSchema, onSubmit })

      expect(form).toHaveProperty('values')
      expect(form).toHaveProperty('errors')
      expect(form).toHaveProperty('touched')
      expect(form).toHaveProperty('isSubmitting')
      expect(form).toHaveProperty('handleChange')
      expect(form).toHaveProperty('handleBlur')
      expect(form).toHaveProperty('handleSubmit')
      expect(form).toHaveProperty('reset')
    })

    it('debe tener values reactivo con valores iniciales', () => {
      const initialValues = { nombre: 'Juan', edad: 25 }
      const form = useForm({ initialValues, validationSchema: {}, onSubmit: vi.fn() })

      expect(form.values.nombre).toBe('Juan')
      expect(form.values.edad).toBe(25)
    })

    it('debe inicializar errors y touched como objetos vacíos', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      expect(form.errors.value).toEqual({})
      expect(form.touched.value).toEqual({})
    })

    it('debe inicializar isSubmitting como false', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      expect(form.isSubmitting.value).toBe(false)
    })

    it('debe manejar valores iniciales vacíos', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      expect(form.values).toEqual({})
    })
  })

  describe('handleChange', () => {
    it('debe actualizar el valor del campo correctamente', () => {
      const initialValues = { nombre: '', email: '' }
      const form = useForm({ initialValues, validationSchema: {}, onSubmit: vi.fn() })

      form.handleChange('nombre', 'Pedro')

      expect(form.values.nombre).toBe('Pedro')
    })

    it('debe ejecutar validación al cambiar un campo', () => {
      const validationSchema = {
        nombre: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('nombre', '')

      expect(form.errors.value.nombre).toBe('Este campo es requerido')
    })

    it('debe limpiar error cuando el campo es válido', () => {
      const validationSchema = {
        nombre: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      // Establecer error primero
      form.handleChange('nombre', '')
      expect(form.errors.value.nombre).toBe('Este campo es requerido')

      // Corregir valor
      form.handleChange('nombre', 'Juan')
      expect(form.errors.value.nombre).toBeUndefined()
    })

    it('debe validar campos con validador de email', () => {
      const validationSchema = {
        email: validateEmail
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('email', 'email-invalido')

      expect(form.errors.value.email).toBe('Email debe tener un formato válido')

      form.handleChange('email', 'usuario@example.com')

      expect(form.errors.value.email).toBeUndefined()
    })

    it('debe validar campos con validador de número positivo', () => {
      const validationSchema = {
        edad: validateNumeroPositivo
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('edad', -5)

      expect(form.errors.value.edad).toBe('El número debe ser mayor o igual a 0')

      form.handleChange('edad', 25)

      expect(form.errors.value.edad).toBeUndefined()
    })

    it('debe manejar validadores que retornan objeto {valid, error}', () => {
      const customValidator = (value) => {
        if (value === 'admin') {
          return { valid: false, error: 'Nombre no permitido' }
        }
        return { valid: true, error: '' }
      }

      const validationSchema = {
        nombre: customValidator
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('nombre', 'admin')

      expect(form.errors.value.nombre).toBe('Nombre no permitido')

      form.handleChange('nombre', 'Pedro')

      expect(form.errors.value.nombre).toBeUndefined()
    })

    it('debe manejar validadores que retornan string con error', () => {
      const customValidator = (value) => {
        if (value.length < 3) {
          return 'Debe tener al menos 3 caracteres'
        }
        return null
      }

      const validationSchema = {
        nombre: customValidator
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('nombre', 'ab')

      expect(form.errors.value.nombre).toBe('Debe tener al menos 3 caracteres')

      form.handleChange('nombre', 'Juan')

      expect(form.errors.value.nombre).toBeUndefined()
    })

    it('debe actualizar múltiples campos de forma independiente', () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('nombre', 'Juan')
      form.handleChange('email', 'email-invalido')

      expect(form.errors.value.nombre).toBeUndefined()
      expect(form.errors.value.email).toBe('Email debe tener un formato válido')

      form.handleChange('email', 'juan@example.com')

      expect(form.errors.value.email).toBeUndefined()
      expect(form.errors.value.nombre).toBeUndefined()
    })
  })

  describe('handleBlur', () => {
    it('debe marcar campo como touched', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      form.handleBlur('nombre')

      expect(form.touched.value.nombre).toBe(true)
    })

    it('debe marcar múltiples campos como touched', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      form.handleBlur('nombre')
      form.handleBlur('email')

      expect(form.touched.value.nombre).toBe(true)
      expect(form.touched.value.email).toBe(true)
    })
  })

  describe('handleSubmit', () => {
    it('debe prevenir el comportamiento por defecto del formulario', () => {
      const onSubmit = vi.fn()
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit })

      const mockEvent = createMockEvent()
      form.handleSubmit(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('debe marcar todos los campos como touched al enviar', async () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail
      }
      const onSubmit = vi.fn()
      const form = useForm({ initialValues: {}, validationSchema, onSubmit })

      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      expect(form.touched.value.nombre).toBe(true)
      expect(form.touched.value.email).toBe(true)
    })

    it('debe validar todos los campos antes de enviar', async () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail
      }
      const onSubmit = vi.fn()
      const form = useForm({ initialValues: {}, validationSchema, onSubmit })

      // Enviar formulario vacío (debe fallar validación)
      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      expect(form.errors.value.nombre).toBe('Este campo es requerido')
      expect(form.errors.value.email).toBe('Email es requerido')
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('debe ejecutar onSubmit solo si el formulario es válido', async () => {
      const validationSchema = {
        nombre: validateRequerido
      }
      const onSubmit = vi.fn()
      const form = useForm({ initialValues: {}, validationSchema, onSubmit })

      // Formulario inválido
      form.handleChange('nombre', '')
      const mockEvent1 = createMockEvent()
      await form.handleSubmit(mockEvent1)
      expect(onSubmit).not.toHaveBeenCalled()

      // Formulario válido
      form.handleChange('nombre', 'Juan')
      const mockEvent2 = createMockEvent()
      await form.handleSubmit(mockEvent2)
      expect(onSubmit).toHaveBeenCalledWith({ nombre: 'Juan' })
    })

    it('debe pasar valores actuales a onSubmit', async () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail
      }
      const onSubmit = vi.fn()
      const form = useForm({
        initialValues: { nombre: '', email: '' },
        validationSchema,
        onSubmit
      })

      form.handleChange('nombre', 'Juan Pérez')
      form.handleChange('email', 'juan@example.com')

      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      expect(onSubmit).toHaveBeenCalledWith({
        nombre: 'Juan Pérez',
        email: 'juan@example.com'
      })
    })

    it('debe cambiar isSubmitting durante el envío', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit })

      form.handleChange('nombre', 'Juan')

      const mockEvent = createMockEvent()
      const submitPromise = form.handleSubmit(mockEvent)

      // Durante el envío
      expect(form.isSubmitting.value).toBe(true)

      await submitPromise

      // Después del envío
      expect(form.isSubmitting.value).toBe(false)
    })

    it('debe resetear isSubmitting incluso si hay errores', async () => {
      const onSubmit = vi.fn()
      const validationSchema = {
        nombre: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit })

      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      // isSubmitting debe ser false después del intento de envío
      expect(form.isSubmitting.value).toBe(false)
      // onSubmit no debe llamarse porque el formulario tiene errores de validación
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('debe manejar onSubmit asíncrono correctamente', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const form = useForm({
        initialValues: { nombre: 'Juan' },
        validationSchema: {},
        onSubmit
      })

      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      expect(onSubmit).toHaveBeenCalled()
      expect(form.isSubmitting.value).toBe(false)
    })

    it('debe manejar errores en onSubmit y resetear isSubmitting', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Error del servidor'))
      const form = useForm({
        initialValues: { nombre: 'Juan' },
        validationSchema: {},
        onSubmit
      })

      const mockEvent = createMockEvent()

      // No debe lanzar error, pero sí resetear isSubmitting
      await form.handleSubmit(mockEvent)

      expect(onSubmit).toHaveBeenCalled()
      expect(form.isSubmitting.value).toBe(false)
    })

    it('debe funcionar sin event object (llamada programática)', async () => {
      const onSubmit = vi.fn()
      const form = useForm({
        initialValues: { nombre: 'Juan' },
        validationSchema: {},
        onSubmit
      })

      // Llamar sin event object
      await form.handleSubmit()

      expect(onSubmit).toHaveBeenCalledWith({ nombre: 'Juan' })
    })
  })

  describe('reset', () => {
    it('debe restaurar valores a initialValues', () => {
      const initialValues = { nombre: 'Juan', edad: 25 }
      const form = useForm({ initialValues, validationSchema: {}, onSubmit: vi.fn() })

      // Cambiar valores
      form.handleChange('nombre', 'Pedro')
      form.handleChange('edad', 30)

      // Resetear
      form.reset()

      expect(form.values.nombre).toBe('Juan')
      expect(form.values.edad).toBe(25)
    })

    it('debe limpiar todos los errores', () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      // Generar errores
      form.handleChange('nombre', '')
      form.handleChange('email', 'invalido')

      expect(Object.keys(form.errors.value).length).toBeGreaterThan(0)

      // Resetear
      form.reset()

      expect(form.errors.value).toEqual({})
    })

    it('debe limpiar touched', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: vi.fn() })

      form.handleBlur('nombre')
      form.handleBlur('email')

      expect(Object.keys(form.touched.value).length).toBeGreaterThan(0)

      // Resetear
      form.reset()

      expect(form.touched.value).toEqual({})
    })

    it('debe resetear isSubmitting a false', () => {
      const onSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit })

      const mockEvent = createMockEvent()
      form.handleSubmit(mockEvent)

      // isSubmitting debe estar en true durante el envío
      expect(form.isSubmitting.value).toBe(true)

      // Resetear
      form.reset()

      expect(form.isSubmitting.value).toBe(false)
    })

    it('debe eliminar propiedades que no están en initialValues', () => {
      const initialValues = { nombre: 'Juan' }
      const form = useForm({ initialValues, validationSchema: {}, onSubmit: vi.fn() })

      // Agregar nueva propiedad
      form.handleChange('edad', 25)

      expect(form.values.edad).toBe(25)

      // Resetear debe eliminar la propiedad
      form.reset()

      expect(form.values.edad).toBeUndefined()
    })
  })

  describe('Integración con validators existentes', () => {
    it('debe funcionar con validateRequerido', () => {
      const validationSchema = {
        username: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('username', '')

      expect(form.errors.value.username).toBe('Este campo es requerido')
    })

    it('debe funcionar con validateEmail', () => {
      const validationSchema = {
        correo: validateEmail
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('correo', 'formato-incorrecto')

      expect(form.errors.value.correo).toBe('Email debe tener un formato válido')
    })

    it('debe funcionar con validateNumeroPositivo', () => {
      const validationSchema = {
        cantidad: validateNumeroPositivo
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('cantidad', -10)

      expect(form.errors.value.cantidad).toBe('El número debe ser mayor o igual a 0')
    })

    it('debe validar formulario completo con múltiples validadores', async () => {
      const validationSchema = {
        nombre: validateRequerido,
        email: validateEmail,
        edad: validateNumeroPositivo
      }
      const onSubmit = vi.fn()
      const form = useForm({ initialValues: {}, validationSchema, onSubmit })

      // Completar formulario correctamente
      form.handleChange('nombre', 'Juan Pérez')
      form.handleChange('email', 'juan@example.com')
      form.handleChange('edad', 30)

      // No debe haber errores
      expect(Object.keys(form.errors.value).length).toBe(0)

      // Debe permitir envío
      const mockEvent = createMockEvent()
      await form.handleSubmit(mockEvent)

      expect(onSubmit).toHaveBeenCalledWith({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        edad: 30
      })
    })
  })

  describe('Casos edge', () => {
    it('debe manejar campos con valores null o undefined', () => {
      const validationSchema = {
        valor: validateRequerido
      }
      const form = useForm({ initialValues: { valor: 'test' }, validationSchema, onSubmit: vi.fn() })

      form.handleChange('valor', null)

      expect(form.errors.value.valor).toBe('Este campo es requerido')
    })

    it('debe manejar campos con strings vacíos', () => {
      const validationSchema = {
        comentario: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('comentario', '')

      expect(form.errors.value.comentario).toBe('Este campo es requerido')
    })

    it('debe permitir valores numéricos válidos', () => {
      const validationSchema = {
        precio: validateNumeroPositivo
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('precio', 0)
      expect(form.errors.value.precio).toBeUndefined()

      form.handleChange('precio', 100.50)
      expect(form.errors.value.precio).toBeUndefined()
    })

    it('debe mantener reactividad después de múltiples cambios', () => {
      const validationSchema = {
        nombre: validateRequerido
      }
      const form = useForm({ initialValues: {}, validationSchema, onSubmit: vi.fn() })

      form.handleChange('nombre', 'A')
      expect(form.values.nombre).toBe('A')

      form.handleChange('nombre', 'AB')
      expect(form.values.nombre).toBe('AB')

      form.handleChange('nombre', 'Juan Pérez')
      expect(form.values.nombre).toBe('Juan Pérez')

      // Verificar que sigue siendo reactivo
      form.handleChange('nombre', '')
      expect(form.errors.value.nombre).toBe('Este campo es requerido')
    })

    it('debe manejar campos sin validación', () => {
      const form = useForm({
        initialValues: { campoSinValidacion: 'valor' },
        validationSchema: {},
        onSubmit: vi.fn()
      })

      form.handleChange('campoSinValidacion', 'nuevo-valor')

      expect(form.values.campoSinValidacion).toBe('nuevo-valor')
      expect(Object.keys(form.errors.value).length).toBe(0)
    })

    it('debe funcionar sin onSubmit', () => {
      const form = useForm({ initialValues: {}, validationSchema: {}, onSubmit: undefined })

      form.handleChange('nombre', 'Juan')

      // No debe lanzar error al enviar sin onSubmit
      const mockEvent = createMockEvent()
      expect(async () => await form.handleSubmit(mockEvent)).not.toThrow()
    })
  })
})
