import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'

// 配置 socket.io
const socket = io(process.env.VUE_APP_SOCKET_URL || 'http://localhost:3000')
Vue.prototype.$socket = socket

// 全局樣式
import '@/assets/styles/main.scss'

// 全局組件
import NavBar from '@/components/NavBar.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'

Vue.component('NavBar', NavBar)
Vue.component('ChatWindow', ChatWindow)
Vue.component('NotificationCenter', NotificationCenter)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Socket 事件監聽
socket.on('connect', () => {
  console.log('Socket connected')
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.on('error', (error) => {
  console.error('Socket error:', error)
})
