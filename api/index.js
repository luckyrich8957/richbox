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
  const { userId, boxId } = req.body;
  
  // 簡單回應測試
  res.json({
    success: true,
    data: {
      prize: {
        id: '1',
        name: 'Test Prize',
        type: 'normal'
      }
    }
  });
});

// 導出為 Vercel Serverless Function
module.exports = app;
