<template>
  <div id="app">
    <!-- 3D 場景背景 -->
    <div class="scene-container">
      <three-d-scene />
    </div>

    <!-- 主內容區域 -->
    <div class="main-content">
      <!-- 導航欄 -->
      <nav-bar />

      <!-- 路由視圖 -->
      <router-view />

      <!-- 即時聊天浮窗 -->
      <chat-window />
    </div>

    <!-- 全局通知 -->
    <notification-center />
  </div>
</template>

<script>
import ThreeDScene from '@/components/ThreeDScene.vue'
import NavBar from '@/components/NavBar.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'

export default {
  components: {
    ThreeDScene,
    NavBar,
    ChatWindow,
    NotificationCenter
  },
  metaInfo: {
    title: this.$toTraditional('超級抽盲盒遊戲'),
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: this.$toTraditional('探索驚喜，開啟你的專屬盲盒體驗') },
      { name: 'keywords', content: this.$toTraditional('盲盒,潮玩,驚喜,收藏,3D抽獎') },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { property: 'og:title', content: this.$toTraditional('超級抽盲盒遊戲') },
      { property: 'og:description', content: this.$toTraditional('3D互動式盲盒抽獎體驗') },
      { property: 'og:type', content: 'website' }
    ]
  },
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    this.checkDeviceType()
    window.addEventListener('resize', this.checkDeviceType)
  },
  methods: {
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';

#app {
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans TC', sans-serif;
  color: $text-color;
  background: linear-gradient(135deg, $primary-color, $secondary-color);

  .scene-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .main-content {
    position: relative;
    z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  #app {
    .main-content {
      padding: 10px;
      border-radius: 0;
    }
  }
}
</style>
