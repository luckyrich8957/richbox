<template>
  <div class="notification-list">
    <div v-if="hasUnread" class="notification-badge">
      {{ unreadCount }}
    </div>
    
    <div class="notification-item" 
         v-for="notification in notifications" 
         :key="notification.id"
         :class="{ unread: !notification.read }"
         @click="markAsRead(notification)">
      <div class="notification-icon">
        <i :class="iconClass(notification.type)"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">{{ notification.title }}</div>
        <div class="notification-message">{{ notification.message }}</div>
        <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'NotificationList',
  
  computed: {
    ...mapState('notifications', ['notifications']),
    ...mapGetters('notifications', ['unreadCount', 'hasUnread'])
  },

  methods: {
    ...mapActions('notifications', ['markAsRead']),
    
    iconClass(type: string) {
      return {
        'order': 'fas fa-shopping-cart',
        'promotion': 'fas fa-tag',
        'system': 'fas fa-exclamation-circle'
      }[type];
    },

    formatTime(timestamp: string) {
      return new Date(timestamp).toLocaleString();
    }
  }
});
</script>

<style scoped>
.notification-list {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 1000;
}

.notification-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.notification-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item.unread {
  background: #f8f9fa;
}

.notification-item:hover {
  background: #f0f0f0;
}

.notification-icon {
  float: left;
  margin-right: 12px;
  font-size: 18px;
}

.notification-content {
  overflow: hidden;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-message {
  color: #666;
  font-size: 14px;
}

.notification-time {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}
</style>