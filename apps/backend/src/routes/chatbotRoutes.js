const express = require('express');
const {
  handleMessage,
  getChatbotStatus
} = require('../controllers/chatbotController');

const router = express.Router();

// ========================================
// CHATBOT ROUTES
// ========================================

// POST /chatbot/message - Handle customer message
router.post('/message', handleMessage);

// GET /chatbot/status - Get chatbot status
router.get('/status', getChatbotStatus);

module.exports = router;
