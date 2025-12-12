import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from '../../src/components/common/AppSelect.vue'

describe('AppSelect', () => {
  it('accepts all required props', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        modelValue: null,
        options: options,
      },
    })

    expect(wrapper.props('modelValue')).toBe(null)
    expect(wrapper.props('options')).toEqual(options)
  })

  it('has correct default values for optional props', () => {
    const wrapper = mount(AppSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' }
        ],
      },
    })

    expect(wrapper.props('label')).toBe('')
    expect(wrapper.props('placeholder')).toBe('Seleccionar...')
    expect(wrapper.props('searchable')).toBe(false)
    expect(wrapper.props('error')).toBe('')
  })

  it('displays placeholder when no value is selected', () => {
    const wrapper = mount(AppSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ],
        placeholder: 'Choose an option',
      },
    })

    expect(wrapper.props('placeholder')).toBe('Choose an option')
  })

  it('displays selected option label when value is set', async () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: '1',
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.props('modelValue')).toBe('1')
  })

  it('emits update:modelValue when selection changes', async () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: null,
      },
    })

    wrapper.vm.$emit('update:modelValue', '1')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['1'])
  })

  it('filters options when searchable is true and user types', async () => {
    const options = [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Banana' },
      { value: '3', label: 'Cherry' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: null,
        searchable: true,
      },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    await input.setValue('ban')

    expect(wrapper.vm.searchQuery).toBe('ban')
    expect(wrapper.vm.filteredOptions).toEqual([
      { value: '2', label: 'Banana' }
    ])
  })

  it('shows all options when searchable is true and query is empty', () => {
    const options = [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Banana' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: null,
        searchable: true,
      },
    })

    expect(wrapper.vm.filteredOptions).toEqual(options)
  })

  it('displays error message when error prop is provided', () => {
    const wrapper = mount(AppSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' }
        ],
        error: 'This field is required',
      },
    })

    expect(wrapper.props('error')).toBe('This field is required')
    expect(wrapper.html()).toContain('This field is required')
  })

  it('shows custom label when label prop is provided', () => {
    const wrapper = mount(AppSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' }
        ],
        label: 'Select an option',
      },
    })

    expect(wrapper.props('label')).toBe('Select an option')
    expect(wrapper.html()).toContain('Select an option')
  })

  it('displays correct display value based on selected option', () => {
    const options = [
      { value: '1', label: 'First Option' },
      { value: '2', label: 'Second Option' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: '2',
      },
    })

    expect(wrapper.vm.displayValue).toBe('Second Option')
  })

  it('returns empty string for display value when modelValue is null', () => {
    const options = [
      { value: '1', label: 'First Option' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: null,
      },
    })

    expect(wrapper.vm.displayValue).toBe('')
  })

  it('updates selectedValue when modelValue prop changes', async () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        modelValue: '1',
      },
    })

    await wrapper.setProps({ modelValue: '2' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedValue).toBe('2')
  })

  it('filters options case-insensitively when searchable', async () => {
    const options = [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'apple pie' },
      { value: '3', label: 'Banana' }
    ]
    const wrapper = mount(AppSelect, {
      props: {
        options: options,
        searchable: true,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('APPLE')

    expect(wrapper.vm.filteredOptions.length).toBe(2)
    expect(wrapper.vm.filteredOptions).toEqual([
      { value: '1', label: 'Apple' },
      { value: '2', label: 'apple pie' }
    ])
  })
})
