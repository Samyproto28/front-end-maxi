import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToast from '../../src/components/common/AppToast.vue'
import { useToast } from '../../src/composables/useToast'

describe('AppToast', () => {
  it('renders with success type', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'success',
        message: 'Operación exitosa',
      },
    })

    expect(wrapper.props('type')).toBe('success')
    expect(wrapper.text()).toContain('Operación exitosa')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('renders with error type', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'error',
        message: 'Ha ocurrido un error',
      },
    })

    expect(wrapper.props('type')).toBe('error')
    expect(wrapper.text()).toContain('Ha ocurrido un error')
  })

  it('renders with warning type', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'warning',
        message: 'Advertencia importante',
      },
    })

    expect(wrapper.props('type')).toBe('warning')
    expect(wrapper.text()).toContain('Advertencia importante')
  })

  it('renders with info type', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'info',
        message: 'Información relevante',
      },
    })

    expect(wrapper.props('type')).toBe('info')
    expect(wrapper.text()).toContain('Información relevante')
  })

  it('defaults to info type when no type provided', () => {
    const wrapper = mount(AppToast, {
      props: {
        message: 'Test message',
      },
    })

    expect(wrapper.props('type')).toBe('info')
  })

  it('shows close button when dismissible is true (default)', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'info',
        message: 'Test message',
      },
    })

    expect(wrapper.props('dismissible')).toBe(true)
    expect(wrapper.find('button[aria-label="Cerrar notificación"]').exists()).toBe(true)
  })

  it('hides close button when dismissible is false', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'info',
        message: 'Test message',
        dismissible: false,
      },
    })

    expect(wrapper.props('dismissible')).toBe(false)
    expect(wrapper.find('button[aria-label="Cerrar notificación"]').exists()).toBe(false)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'info',
        message: 'Test message',
      },
    })

    await wrapper.find('button[aria-label="Cerrar notificación"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close').length).toBe(1)
  })

  it('has correct aria attributes for accessibility', () => {
    const wrapper = mount(AppToast, {
      props: {
        type: 'success',
        message: 'Success message',
      },
    })

    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('aria-label')).toContain('Success message')
  })
})

describe('useToast composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { clear } = useToast()
    clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a toast and adds it to the stack', () => {
    const { show, toasts } = useToast()

    const id = show({ type: 'success', message: 'Test toast' })

    expect(id).toBeTruthy()
    expect(toasts.value.length).toBe(1)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[0].message).toBe('Test toast')
  })

  it('removes a toast by id', () => {
    const { show, remove, toasts } = useToast()

    const id = show({ type: 'info', message: 'Test toast' })
    expect(toasts.value.length).toBe(1)

    remove(id)
    expect(toasts.value.length).toBe(0)
  })

  it('clears all toasts', () => {
    const { show, clear, toasts } = useToast()

    show({ type: 'success', message: 'Toast 1' })
    show({ type: 'error', message: 'Toast 2' })
    show({ type: 'warning', message: 'Toast 3' })

    expect(toasts.value.length).toBe(3)

    clear()
    expect(toasts.value.length).toBe(0)
  })

  it('auto-dismisses toast after duration', () => {
    const { show, toasts } = useToast()

    show({ type: 'info', message: 'Auto dismiss toast', duration: 3000 })
    expect(toasts.value.length).toBe(1)

    vi.advanceTimersByTime(3000)
    expect(toasts.value.length).toBe(0)
  })

  it('respects max toasts limit', () => {
    const { show, toasts } = useToast()

    // Add 6 toasts (max is 5)
    for (let i = 1; i <= 6; i++) {
      show({ type: 'info', message: `Toast ${i}`, duration: 0 })
    }

    expect(toasts.value.length).toBe(5)
    // First toast should be removed, last one should be Toast 6
    expect(toasts.value[4].message).toBe('Toast 6')
  })

  it('provides convenience methods for each type', () => {
    const { success, error, warning, info, toasts, clear } = useToast()

    success('Success message')
    expect(toasts.value[0].type).toBe('success')
    clear()

    error('Error message')
    expect(toasts.value[0].type).toBe('error')
    clear()

    warning('Warning message')
    expect(toasts.value[0].type).toBe('warning')
    clear()

    info('Info message')
    expect(toasts.value[0].type).toBe('info')
  })
})
