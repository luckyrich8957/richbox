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
module.exports = async (req, res) => {
  // 設置 CORS 頭
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 健康檢查
  if (req.url === '/api/health') {
    return res.json({ status: 'ok' });
  }

  // 盲盒開啟
  if (req.url === '/api/box/open' && req.method === 'POST') {
    try {
      const { userId, boxId } = req.body || {};
      
      return res.json({
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
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // 404 處理
  return res.status(404).json({
    error: 'Not Found',
    path: req.url
  });
};
