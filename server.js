const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 文件上傳配置
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// 確保上傳目錄存在
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// 數據存儲路徑
const DATA_PATH = path.join(__dirname, 'data');
const CHAT_DATA_PATH = path.join(DATA_PATH, 'chat.json');
const USER_DATA_PATH = path.join(DATA_PATH, 'users.json');
const PAYMENT_DATA_PATH = path.join(DATA_PATH, 'payments.json');
const BOX_DATA_PATH = path.join(DATA_PATH, 'boxes.json');
const MODEL_DATA_PATH = path.join(DATA_PATH, 'models.json');

// 確保數據目錄存在
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH);
}

// 初始化數據
let chatData = { messages: [], users: {} };
let userData = { users: {} };
let paymentData = { orders: [], settings: {} };
let boxData = { boxes: {}, settings: {} };
let modelData = { boxes: {} };

// 加載數據
function loadData() {
  try {
    if (fs.existsSync(CHAT_DATA_PATH)) {
      chatData = JSON.parse(fs.readFileSync(CHAT_DATA_PATH, 'utf8'));
    }
    if (fs.existsSync(USER_DATA_PATH)) {
      userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
    }
    if (fs.existsSync(PAYMENT_DATA_PATH)) {
      paymentData = JSON.parse(fs.readFileSync(PAYMENT_DATA_PATH, 'utf8'));
    }
    if (fs.existsSync(BOX_DATA_PATH)) {
      boxData = JSON.parse(fs.readFileSync(BOX_DATA_PATH, 'utf8'));
    }
    if (fs.existsSync(MODEL_DATA_PATH)) {
      modelData = JSON.parse(fs.readFileSync(MODEL_DATA_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load data:', err);
  }
}

// 保存數據
function saveData() {
  try {
    fs.writeFileSync(CHAT_DATA_PATH, JSON.stringify(chatData, null, 2));
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(userData, null, 2));
    fs.writeFileSync(PAYMENT_DATA_PATH, JSON.stringify(paymentData, null, 2));
    fs.writeFileSync(BOX_DATA_PATH, JSON.stringify(boxData, null, 2));
    fs.writeFileSync(MODEL_DATA_PATH, JSON.stringify(modelData, null, 2));
  } catch (err) {
    console.error('Failed to save data:', err);
  }
}

// 每5分鐘自動保存一次
setInterval(saveData, 5 * 60 * 1000);

// Socket.IO 聊天功能
let io;
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // 用戶加入聊天
    socket.on('joinChat', ({ userId, username }) => {
      if (!chatData.users[userId]) {
        chatData.users[userId] = {
          username,
          socketId: socket.id,
          online: true,
          unreadCount: 0
        };
      } else {
        chatData.users[userId].socketId = socket.id;
        chatData.users[userId].online = true;
      }
      saveData();
      io.emit('userStatusChanged', { userId, online: true });
    });

    // 發送消息
    socket.on('sendMessage', ({ userId, message, type = 'text' }) => {
      const newMessage = {
        id: Date.now().toString(),
        userId,
        type,
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      chatData.messages.push(newMessage);
      saveData();

      // 通知所有用戶有新消息
      io.emit('newMessage', newMessage);

      // 更新未讀計數
      Object.values(chatData.users).forEach(user => {
        if (user.userId !== userId && user.online) {
          user.unreadCount++;
        }
      });
    });

    // 標記消息為已讀
    socket.on('markAsRead', ({ userId, messageId }) => {
      const message = chatData.messages.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
        saveData();
        io.emit('messageRead', { messageId, userId });
      }
    });

    // 用戶斷開連接
    socket.on('disconnect', () => {
      const user = Object.values(chatData.users).find(u => u.socketId === socket.id);
      if (user) {
        user.online = false;
        saveData();
        io.emit('userStatusChanged', { userId: user.userId, online: false });
      }
    });
  });

  // 圖片上傳API
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });

  // 獲取聊天記錄API
  app.get('/api/chat/history', (req, res) => {
    const { userId, limit = 50, offset = 0 } = req.query;
    
    const messages = chatData.messages
      .filter(m => m.userId === userId || m.type === 'admin')
      .slice(offset, offset + limit);

    res.json({ success: true, messages });
  });

  // 獲取未讀消息數量API
  app.get('/api/chat/unread', (req, res) => {
    const { userId } = req.query;
    
    if (!chatData.users[userId]) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      count: chatData.users[userId].unreadCount 
    });
  });

  // 盲盒API
  app.post('/api/box/open', (req, res) => {
    const { userId, boxId } = req.body;
    
    if (!userId || !boxId) {
      return res.status(400).json({ 
        success: false,
        error: 'userId and boxId are required'
      });
    }

    // 檢查每日抽獎次數
    const today = new Date().toISOString().split('T')[0];
    if (!boxData.users) boxData.users = {};
    if (!boxData.users[userId]) {
      boxData.users[userId] = {
        lastDrawDate: today,
        drawCount: 0
      };
    }

    if (boxData.users[userId].lastDrawDate !== today) {
      boxData.users[userId].lastDrawDate = today;
      boxData.users[userId].drawCount = 0;
    }

    if (boxData.users[userId].drawCount >= (boxData.settings.dailyLimit || 5)) {
      return res.status(400).json({ 
        success: false,
        error: 'Daily draw limit reached'
      });
    }

    // 獲取盲盒配置
    const box = boxData.boxes[boxId];
    if (!box) {
      return res.status(404).json({ 
        success: false,
        error: 'Box not found'
      });
    }

    // 隨機抽取獎品
    const totalWeight = box.prizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = null;

    for (const prize of box.prizes) {
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // 檢查是否觸發彩蛋
    let eggTriggered = false;
    let eggAmount = 0;
    if (box.eggSettings?.enabled) {
      const eggProbability = Math.random();
      if (eggProbability <= (box.eggSettings.probability || 0)) {
        eggTriggered = true;
        eggAmount = Math.floor(
          Math.random() * (box.eggSettings.maxAmount - box.eggSettings.minAmount + 1)
        ) + box.eggSettings.minAmount;

        // 添加彩蛋獎勵
        if (!userData.users[userId]) {
          userData.users[userId] = {
            balance: 0,
            transactions: []
          };
        }

        userData.users[userId].balance += eggAmount;
        userData.users[userId].transactions.push({
          type: 'egg_reward',
          amount: eggAmount,
          boxId: boxId,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 更新抽獎記錄
    boxData.users[userId].drawCount++;
    saveData();

    res.json({
      success: true,
      data: {
        prize: selectedPrize,
        eggTriggered,
        eggAmount,
        drawCount: boxData.users[userId].drawCount,
        dailyLimit: boxData.settings.dailyLimit || 5
      }
    });
  });

  // 3D互動API
  app.post('/api/box/interact', (req, res) => {
    const { userId, boxId, action, intensity } = req.body;
    
    if (!userId || !boxId || !action) {
      return res.status(400).json({ 
        success: false,
        error: 'userId, boxId and action are required'
      });
    }

    // 初始化互動記錄
    if (!modelData.boxes[boxId]) {
      modelData.boxes[boxId] = {
        interactions: []
      };
    }

    // 記錄互動數據
    modelData.boxes[boxId].interactions.push({
      userId,
      action,
      intensity: intensity || 0,
      timestamp: new Date().toISOString()
    });

    saveData();

    res.json({
      success: true
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    loadData();
  });
}
