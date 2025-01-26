<template>
  <div class="notification-center">
    <transition-group name="notification">
      <div v-for="(notification, index) in notifications" 
           :key="notification.id"
           :class="['notification-item', notification.type]"
           @click="removeNotification(index)">
        <div class="notification-icon">
          <i :class="iconClass(notification.type)"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">
            {{ notification.title }}
          </div>
          <div class="notification-message">
            {{ notification.message }}
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
      nextId: 0
    }
  },
  methods: {
    addNotification(notification) {
      const id = this.nextId++
      this.notifications.push({
        id,
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        duration: notification.duration || 5000
      })
      
      setTimeout(() => {
        this.removeNotificationById(id)
      }, notification.duration || 5000)
    },
    removeNotification(index) {
      this.notifications.splice(index, 1)
    },
    removeNotificationById(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },
    iconClass(type) {
      return {
        'icon-info': type === 'info',
        'icon-success': type === 'success',
        'icon-warning': type === 'warning',
        'icon-error': type === 'error'
      }
    }
  },
  mounted() {
    this.$root.$on('addNotification', this.addNotification)
  },
  beforeDestroy() {
    this.$root.$off('addNotification', this.addNotification)
  }
}
</script>

<style scoped>
.notification-center {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification-item {
  display: flex;
  align-items: center;
  width: 300px;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.notification-item.info {
  background: var(--info-color);
}

.notification-item.success {
  background: var(--success-color);
}

.notification-item.warning {
  background: var(--warning-color);
}

.notification-item.error {
  background: var(--error-color);
}

.notification-icon {
  margin-right: 15px;
  font-size: 1.5rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.notification-message {
  font-size: 0.9rem;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-enter,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .notification-center {
    width: 100%;
    right: 0;
    padding: 0 10px;
  }

  .notification-item {
    width: 100%;
  }
}
</style>