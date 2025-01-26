const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Pusher配置
const pusher = new Pusher({
  appId: "YOUR_APP_ID",
  key: "YOUR_APP_KEY",
  secret: "YOUR_APP_SECRET",
  cluster: "YOUR_APP_CLUSTER",
  useTLS: true
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 发送消息的端点
app.post('/api/messages', async (req, res) => {
  const { message, sender, room } = req.body;
  
  try {
    await pusher.trigger(room || 'chat-room', 'message', {
      message,
      sender,
      timestamp: new Date().toISOString()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 用户在线状态
app.post('/api/presence', async (req, res) => {
  const { userId, status } = req.body;
  
  try {
    await pusher.trigger('presence', 'status', {
      userId,
      status,
      timestamp: new Date().toISOString()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update presence' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
