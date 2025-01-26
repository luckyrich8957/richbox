const handler = (req, res) => {
  try {
    res.status(200).json({
      message: 'API is working!',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = handler;
