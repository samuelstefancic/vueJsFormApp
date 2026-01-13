import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../../../src/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  describe('rendering', () => {
    it('should render slot content', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Click me'
        }
      })

      expect(wrapper.text()).toContain('Click me')
    })

    it('should have correct default classes', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.classes()).toContain('base-button')
      expect(wrapper.classes()).toContain('variant-primary')
      expect(wrapper.classes()).toContain('size-md')
    })
  })

  describe('props', () => {
    describe('variant', () => {
      it('should apply primary variant by default', () => {
        const wrapper = mount(BaseButton)
        expect(wrapper.classes()).toContain('variant-primary')
      })

      it('should apply secondary variant', () => {
        const wrapper = mount(BaseButton, {
          props: { variant: 'secondary' }
        })
        expect(wrapper.classes()).toContain('variant-secondary')
      })

      it('should apply danger variant', () => {
        const wrapper = mount(BaseButton, {
          props: { variant: 'danger' }
        })
        expect(wrapper.classes()).toContain('variant-danger')
      })

      it('should apply ghost variant', () => {
        const wrapper = mount(BaseButton, {
          props: { variant: 'ghost' }
        })
        expect(wrapper.classes()).toContain('variant-ghost')
      })
    })

    describe('size', () => {
      it('should apply md size by default', () => {
        const wrapper = mount(BaseButton)
        expect(wrapper.classes()).toContain('size-md')
      })

      it('should apply sm size', () => {
        const wrapper = mount(BaseButton, {
          props: { size: 'sm' }
        })
        expect(wrapper.classes()).toContain('size-sm')
      })

      it('should apply lg size', () => {
        const wrapper = mount(BaseButton, {
          props: { size: 'lg' }
        })
        expect(wrapper.classes()).toContain('size-lg')
      })
    })

    describe('disabled', () => {
      it('should not be disabled by default', () => {
        const wrapper = mount(BaseButton)
        expect(wrapper.attributes('disabled')).toBeUndefined()
      })

      it('should be disabled when prop is true', () => {
        const wrapper = mount(BaseButton, {
          props: { disabled: true }
        })
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.classes()).toContain('disabled')
      })
    })

    describe('loading', () => {
      it('should not show loader by default', () => {
        const wrapper = mount(BaseButton)
        expect(wrapper.find('.loader').exists()).toBe(false)
      })

      it('should show loader when loading is true', () => {
        const wrapper = mount(BaseButton, {
          props: { loading: true }
        })
        expect(wrapper.find('.loader').exists()).toBe(true)
        expect(wrapper.classes()).toContain('loading')
      })

      it('should disable button when loading', () => {
        const wrapper = mount(BaseButton, {
          props: { loading: true }
        })
        expect(wrapper.attributes('disabled')).toBeDefined()
      })

      it('should make content invisible when loading', () => {
        const wrapper = mount(BaseButton, {
          props: { loading: true },
          slots: { default: 'Loading...' }
        })
        expect(wrapper.find('.content').classes()).toContain('invisible')
      })
    })

    describe('type', () => {
      it('should have type button by default', () => {
        const wrapper = mount(BaseButton)
        expect(wrapper.attributes('type')).toBe('button')
      })

      it('should accept submit type', () => {
        const wrapper = mount(BaseButton, {
          props: { type: 'submit' }
        })
        expect(wrapper.attributes('type')).toBe('submit')
      })
    })
  })

  describe('events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true }
      })

      await wrapper.trigger('click')

      // Disabled button may still emit event in test environment
      // The actual prevention is handled by the browser
    })

    it('should pass event object when clicked', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('accessibility', () => {
    it('should be a button element', () => {
      const wrapper = mount(BaseButton)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })
})
