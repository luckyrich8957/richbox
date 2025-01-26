const express = require('express');
const cors = require('cors');

const app = express();

// 啟用 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json());

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 盲盒開啟
app.post('/api/box/open', (req, res) => {
  try {
    const { userId, boxId } = req.body || {};
    
    res.json({
      success: true,
      data: {
        prize: {
          id: '1',
          name: 'Test Prize',
          type: 'normal'
        },
        userId,
        boxId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 導出為 Vercel Serverless Function
module.exports = (req, res) => {
  res.status(200).json({ name: 'API is working' });
}
