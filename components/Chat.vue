<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ 'my-message': msg.sender === currentUser }">
        <div class="message-content">
          <div class="sender">{{ msg.sender }}</div>
          <div class="text">{{ msg.message }}</div>
          <div class="time">{{ formatTime(msg.timestamp) }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        type="text"
      >
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js';

export default {
  name: 'Chat',
  
  data() {
    return {
      pusher: null,
      channel: null,
      messages: [],
      newMessage: '',
      currentUser: 'User_' + Math.random().toString(36).substr(2, 9),
    }
  },
  
  mounted() {
    this.initializePusher();
    this.scrollToBottom();
  },
  
  methods: {
    initializePusher() {
      this.pusher = new Pusher('YOUR_APP_KEY', {
        cluster: 'YOUR_APP_CLUSTER'
      });
      
      this.channel = this.pusher.subscribe('chat-room');
      this.channel.bind('message', data => {
        this.messages.push(data);
        this.$nextTick(this.scrollToBottom);
      });
    },
    
    async sendMessage() {
      if (!this.newMessage.trim()) return;
      
      try {
        const response = await fetch('http://localhost:3000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: this.newMessage,
            sender: this.currentUser,
            room: 'chat-room'
          }),
        });
        
        if (!response.ok) throw new Error('Failed to send message');
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  },
  
  beforeDestroy() {
    if (this.channel) {
      this.channel.unbind_all();
      this.channel.unsubscribe();
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  margin-bottom: 10px;
}

.message-content {
  background: #f0f2f5;
  padding: 10px;
  border-radius: 12px;
  position: relative;
}

.my-message {
  align-self: flex-end;
}

.my-message .message-content {
  background: #0084ff;
  color: white;
}

.sender {
  font-size: 0.8em;
  margin-bottom: 4px;
  font-weight: bold;
}

.time {
  font-size: 0.7em;
  margin-top: 4px;
  opacity: 0.7;
}

.chat-input {
  display: flex;
  padding: 20px;
  gap: 10px;
  border-top: 1px solid #ddd;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

button {
  padding: 10px 20px;
  background: #0084ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0073e6;
}
</style>
