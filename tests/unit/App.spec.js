import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import App from '../../App.vue'

Vue.config.productionTip = false

describe('App.vue', () => {
  it('renders main container', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.find('.app-container').exists()).toBe(true)
  })

  it('renders child components', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.findComponent({ name: 'Modal' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ChatWindow' }).exists()).toBe(true)
  })
})