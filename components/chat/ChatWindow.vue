<template>
  <div class="shopee-chat-window" :class="{ 'is-open': isOpen }">
    <!-- 聊天窗口最小化按鈕 -->
    <div class="chat-minimized" v-if="!isOpen" @click="toggleChat">
      <u-icon name="chat" size="24"></u-icon>
      <span class="unread-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </div>

    <!-- 完整聊天窗口 -->
    <div class="chat-container" v-else>
      <!-- 聊天頭部 -->
      <div class="chat-header">
        <div class="header-info">
          <span class="admin-name">{{ adminName }}</span>
          <span class="admin-status" :class="{ 'online': adminOnline }">
            {{ adminOnline ? '在線' : '離線' }}
          </span>
        </div>
        <div class="header-actions">
          <u-icon name="search" @click="toggleSearch"></u-icon>
          <u-icon name="minus" @click="toggleChat"></u-icon>
        </div>
      </div>

      <!-- 搜索面板 -->
      <div class="search-panel" v-if="showSearch">
        <div class="search-input">
          <u-input
            v-model="searchQuery"
            placeholder="搜索聊天記錄"
            :clearable="true"
            @confirm="handleSearch"
          >
            <u-icon slot="suffix" name="search" @click="handleSearch"></u-icon>
          </u-input>
        </div>
      </div>

      <!-- 聊天記錄 -->
      <scroll-view 
        class="chat-messages"
        scroll-y
        :scroll-top="scrollTop"
        @scrolltoupper="loadMoreHistory"
        :refresher-enabled="true"
        @refresherrefresh="onRefresh"
      >
        <div 
          v-for="(msg, index) in messages"
          :key="msg.id"
          class="message-item"
          :class="{ 'message-admin': msg.isAdmin, 'message-user': !msg.isAdmin }"
        >
          <!-- 日期分隔線 -->
          <div class="date-divider" v-if="showDateDivider(index)">
            {{ formatDate(msg.timestamp) }}
          </div>
          
          <div class="message-content">
            <!-- 文字消息 -->
            <div v-if="msg.type === 'text'" class="text-message">
              {{ msg.content }}
            </div>
            <!-- 圖片消息 -->
            <div v-else-if="msg.type === 'image'" class="image-message">
              <image 
                :src="msg.content"
                mode="widthFix"
                @click="previewImage(msg.content)"
              />
            </div>
            <!-- 已讀狀態 -->
            <span class="read-status" v-if="!msg.isAdmin">
              {{ msg.isRead ? '已讀' : '未讀' }}
            </span>
          </div>
        </div>
      </scroll-view>

      <!-- 輸入區域 -->
      <div class="chat-input">
        <div class="input-actions">
          <u-icon name="photo" @click="chooseImage"></u-icon>
        </div>
        <div class="input-box">
          <u-input
            v-model="messageText"
            type="text"
            placeholder="輸入消息..."
            :confirm-type="'send'"
            @confirm="sendMessage"
          ></u-input>
        </div>
        <u-button 
          class="send-btn"
          type="primary"
          size="mini"
          @click="sendMessage"
          :disabled="!messageText.trim() && !selectedImage"
        >發送</u-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      showSearch: false,
      searchQuery: '',
      messageText: '',
      selectedImage: null,
      scrollTop: 0,
      adminName: '客服人員',
      adminOnline: true,
      messages: [],
      unreadCount: 0,
      page: 1,
      loading: false
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.markAllAsRead()
      }
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    async handleSearch() {
      if (!this.searchQuery.trim()) return
      try {
        const response = await this.$api.chat.searchMessages({
          query: this.searchQuery,
          userId: this.userId
        })
        this.messages = response.data
      } catch (error) {
        this.$u.toast('搜索失敗')
      }
    },
    async sendMessage() {
      if (!this.messageText.trim() && !this.selectedImage) return
      
      const message = {
        id: Date.now().toString(),
        type: this.selectedImage ? 'image' : 'text',
        content: this.selectedImage || this.messageText,
        timestamp: new Date().toISOString(),
        isAdmin: false,
        isRead: false
      }

      try {
        await this.$api.chat.sendMessage({
          ...message,
          userId: this.userId
        })
        this.messages.push(message)
        this.messageText = ''
        this.selectedImage = null
        this.scrollToBottom()
      } catch (error) {
        this.$u.toast('發送失敗')
      }
    },
    async chooseImage() {
      try {
        const [tempFile] = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        const uploadRes = await this.$api.upload.uploadFile(tempFile.path)
        this.selectedImage = uploadRes.url
        this.sendMessage()
      } catch (error) {
        this.$u.toast('圖片上傳失敗')
      }
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    showDateDivider(index) {
      if (index === 0) return true
      const currentDate = new Date(this.messages[index].timestamp).toDateString()
      const prevDate = new Date(this.messages[index - 1].timestamp).toDateString()
      return currentDate !== prevDate
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async loadMoreHistory() {
      if (this.loading) return
      this.loading = true
      try {
        const response = await this.$api.chat.getMessages({
          userId: this.userId,
          page: this.page + 1
        })
        if (response.data.length) {
          this.messages.unshift(...response.data)
          this.page++
        }
      } catch (error) {
        this.$u.toast('載入失敗')
      } finally {
        this.loading = false
      }
    },
    markAllAsRead() {
      this.unreadCount = 0
      this.$api.chat.markAsRead(this.userId)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this)
        query.select('.chat-messages').boundingClientRect(data => {
          this.scrollTop = data.height
        }).exec()
      })
    }
  },
  mounted() {
    this.loadMoreHistory()
  }
}
</script>

<style lang="scss" scoped>
.shopee-chat-window {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  
  .chat-minimized {
    background: #ee4d2d;
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    
    .unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff5722;
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }
  
  .chat-container {
    width: 350px;
    height: 480px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    
    .chat-header {
      padding: 12px;
      background: #ee4d2d;
      color: white;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-info {
        .admin-name {
          font-weight: bold;
          margin-right: 8px;
        }
        
        .admin-status {
          font-size: 12px;
          opacity: 0.8;
          
          &.online {
            color: #4caf50;
          }
        }
      }
      
      .header-actions {
        display: flex;
        gap: 12px;
      }
    }
    
    .chat-messages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      
      .message-item {
        margin-bottom: 12px;
        
        &.message-admin {
          .message-content {
            background: #f5f5f5;
            margin-right: auto;
          }
        }
        
        &.message-user {
          .message-content {
            background: #ee4d2d;
            color: white;
            margin-left: auto;
          }
        }
        
        .message-content {
          max-width: 70%;
          padding: 8px 12px;
          border-radius: 16px;
          word-break: break-word;
          
          .image-message {
            image {
              max-width: 200px;
              border-radius: 8px;
            }
          }
          
          .read-status {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 4px;
            text-align: right;
          }
        }
      }
      
      .date-divider {
        text-align: center;
        margin: 16px 0;
        font-size: 12px;
        color: #999;
      }
    }
    
    .chat-input {
      padding: 12px;
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .input-box {
        flex: 1;
      }
      
      .send-btn {
        background: #ee4d2d;
        color: white;
        
        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
