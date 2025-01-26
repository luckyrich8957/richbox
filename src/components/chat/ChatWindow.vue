<template>
  <div class="chat-window" :class="{ 'is-open': isOpen }">
    <!-- 聊天頭部 -->
    <div class="chat-header">
      <div class="header-left">
        <img :src="adminAvatar" class="avatar" alt="客服頭像">
        <div class="info">
          <div class="name">線上客服</div>
          <div class="status">在線</div>
        </div>
      </div>
      <div class="header-right">
        <button class="icon-btn" @click="toggleChat">
          <i class="icon-close"></i>
        </button>
      </div>
    </div>

    <!-- 聊天內容 -->
    <div class="chat-body">
      <div class="messages" ref="messages">
        <!-- 日期分隔線 -->
        <div class="date-divider" v-if="showDateDivider">
          <span>今天</span>
        </div>

        <!-- 消息列表 -->
        <div v-for="(msg, index) in messages" :key="msg.id" 
             :class="['message', msg.sender, { 'unread': msg.status === 'unread' }]">
          <!-- 用戶消息 -->
          <div v-if="msg.sender === 'user'" class="message-wrapper user">
            <div class="message-content">
              <div v-if="msg.type === 'text'" class="text-message">
                {{ msg.content }}
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <img v-else-if="msg.type === 'image'" 
                   :src="msg.content" 
                   class="image-message"
                   @click="openImage(msg.content)">
            </div>
          </div>

          <!-- 客服消息 -->
          <div v-else class="message-wrapper admin">
            <img :src="adminAvatar" class="avatar" alt="客服頭像">
            <div class="message-content">
              <div v-if="msg.type === 'text'" class="text-message">
                {{ msg.content }}
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <img v-else-if="msg.type === 'image'" 
                   :src="msg.content" 
                   class="image-message"
                   @click="openImage(msg.content)">
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="chat-input">
        <div class="input-wrapper">
          <button class="icon-btn" @click="openEmojiPicker">
            <i class="icon-emoji"></i>
          </button>
          <input v-model="inputMessage" 
                 type="text" 
                 placeholder="輸入訊息..."
                 @keyup.enter="sendMessage">
          <button class="icon-btn" @click="openFilePicker">
            <i class="icon-attachment"></i>
          </button>
        </div>
        <button class="send-button" @click="sendMessage">
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true,
      inputMessage: '',
      messages: [],
      adminAvatar: '/static/images/admin-avatar.png',
      showDateDivider: true
    }
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim()) return

      const message = {
        id: Date.now(),
        sender: 'user',
        type: 'text',
        content: this.inputMessage,
        timestamp: new Date(),
        status: 'sending'
      }

      this.messages.push(message)
      this.inputMessage = ''
      this.scrollToBottom()

      try {
        // 模擬發送消息
        await new Promise(resolve => setTimeout(resolve, 500))
        message.status = 'delivered'
        
        // 模擬客服回覆
        this.simulateAdminReply()
      } catch (error) {
        console.error('發送消息失敗:', error)
        message.status = 'failed'
      }
    },
    simulateAdminReply() {
      setTimeout(() => {
        this.messages.push({
          id: Date.now(),
          sender: 'admin',
          type: 'text',
          content: '您好，請問有什麼可以幫您？',
          timestamp: new Date(),
          status: 'delivered'
        })
        this.scrollToBottom()
      }, 1000)
    },
    openEmojiPicker() {
      // 實現表情選擇功能
    },
    openFilePicker() {
      // 實現文件選擇功能
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messages
        container.scrollTop = container.scrollHeight
      })
    },
    toggleChat() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.header-left {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: bold;
  font-size: 14px;
}

.status {
  font-size: 12px;
  color: #666;
}

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message-wrapper {
  margin-bottom: 10px;
}

.message-content {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  position: relative;
}

.user .message-content {
  background: #e6f3ff;
  margin-left: auto;
}

.admin .message-content {
  background: #f1f1f1;
  margin-right: auto;
}

.message-time {
  font-size: 12px;
  color: #666;
  position: absolute;
  bottom: -18px;
  right: 0;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eee;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 10px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 5px 10px;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 5px 10px;
  outline: none;
}

.icon-btn {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.send-button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  cursor: pointer;
}

.date-divider {
  text-align: center;
  margin: 10px 0;
  position: relative;
}

.date-divider span {
  background: #fff;
  padding: 0 10px;
  position: relative;
  z-index: 1;
  color: #666;
  font-size: 12px;
}

.date-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #eee;
  z-index: 0;
}
</style>