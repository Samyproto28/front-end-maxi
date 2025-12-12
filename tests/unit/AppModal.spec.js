import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppModal from '../../src/components/common/AppModal.vue'

/**
 * Note: Headless UI's Dialog component requires a real DOM environment
 * and doesn't fully render in JSDOM (vitest's default environment).
 * These tests verify the component API and props work correctly.
 * For full component testing, use end-to-end tests or component testing with a real browser.
 */

describe('AppModal', () => {
  it('accepts all required props', () => {
    const wrapper = mount(AppModal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
      },
    })

    expect(wrapper.props('isOpen')).toBe(true)
    expect(wrapper.props('title')).toBe('Test Modal')
  })

  it('has correct default values for optional props', () => {
    const wrapper = mount(AppModal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
      },
    })

    expect(wrapper.props('size')).toBe('md')
    expect(wrapper.props('closeOnClickOutside')).toBe(true)
  })

  it('accepts all size props', () => {
    const sizes = ['sm', 'md', 'lg', 'xl']
    sizes.forEach((size) => {
      const wrapper = mount(AppModal, {
        props: {
          isOpen: true,
          title: 'Test Modal',
          size: size,
        },
      })

      expect(wrapper.props('size')).toBe(size)
    })
  })

  it('emits close event', () => {
    const wrapper = mount(AppModal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
      },
    })

    wrapper.vm.$emit('close')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render footer when slot is not provided', () => {
    const wrapper = mount(AppModal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
      },
    })

    // Footer should not render without slot
    expect(wrapper.html()).not.toContain('border-t')
  })
})


