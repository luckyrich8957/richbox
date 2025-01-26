const express = require('express');
const cors = require('cors');
const app = express();

// 中間件
app.use(cors());
app.use(express.json());

// 盲盒數據
const boxes = {
  'box1': {
    id: 'box1',
    name: '普通盲盒',
    price: 100,
    prizes: [
      { id: 'p1', name: '超級大獎', probability: 0.01, value: 1000 },
      { id: 'p2', name: '中等獎品', probability: 0.1, value: 500 },
      { id: 'p3', name: '普通獎品', probability: 0.89, value: 100 }
    ]
  },
  'box2': {
    id: 'box2',
    name: '高級盲盒',
    price: 200,
    prizes: [
      { id: 'p4', name: '傳說獎品', probability: 0.05, value: 2000 },
      { id: 'p5', name: '稀有獎品', probability: 0.15, value: 1000 },
      { id: 'p6', name: '普通獎品', probability: 0.8, value: 200 }
    ]
  }
};

// 用戶數據
const users = {};

// API 路由
const handler = async (req, res) => {
  try {
    // 獲取所有盲盒
    if (req.method === 'GET' && req.url === '/api/box/list') {
      return res.json({
        success: true,
        data: Object.values(boxes)
      });
    }

    // 開盲盒
    if (req.method === 'POST' && req.url === '/api/box/open') {
      const { userId, boxId } = req.body;

      if (!userId || !boxId) {
        return res.status(400).json({
          success: false,
          error: '缺少必要參數'
        });
      }

      const box = boxes[boxId];
      if (!box) {
        return res.status(404).json({
          success: false,
          error: '盲盒不存在'
        });
      }

      // 初始化用戶數據
      if (!users[userId]) {
        users[userId] = {
          id: userId,
          boxes: [],
          prizes: []
        };
      }

      // 隨機抽獎
      const random = Math.random();
      let currentProb = 0;
      let prize = null;

      for (const p of box.prizes) {
        currentProb += p.probability;
        if (random <= currentProb) {
          prize = p;
          break;
        }
      }

      // 記錄抽獎結果
      const result = {
        userId,
        boxId,
        prizeId: prize.id,
        prizeName: prize.name,
        timestamp: new Date().toISOString()
      };

      users[userId].prizes.push(result);

      return res.json({
        success: true,
        data: {
          box,
          prize,
          result
        }
      });
    }

    // 獲取用戶獎品
    if (req.method === 'GET' && req.url.startsWith('/api/user/prizes')) {
      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: '缺少用戶ID'
        });
      }

      const user = users[userId];
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '用戶不存在'
        });
      }

      return res.json({
        success: true,
        data: user.prizes
      });
    }

    // 404 處理
    return res.status(404).json({
      success: false,
      error: '接口不存在'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: '服務器錯誤'
    });
  }
};

module.exports = handler;
