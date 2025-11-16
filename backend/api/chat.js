const express = require('express');
const router = express.Router();
const { ChatMessage, Symptom } = require('../database/models');
const { authenticateToken } = require('../auth/jwt');
const { body, validationResult } = require('express-validator');
const { chatWithPerplexity } = require('../services/perplexity');
const { getRAGContext } = require('../services/rag');

// Get chat history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { userId: req.user.id },
      order: [['timestamp', 'ASC']],
      limit: 50
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
});

// Send message
router.post('/', [
  authenticateToken,
  body('message').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { message } = req.body;

    // Save user message
    const userMessage = await ChatMessage.create({
      userId: req.user.id,
      role: 'user',
      content: message
    });

    // Get RAG context (retrieve relevant information from user's symptoms)
    const context = await getRAGContext(req.user.id, message);

    // Get AI response from Perplexity
    const aiResponse = await chatWithPerplexity(message, context);

    // Save assistant message
    const assistantMessage = await ChatMessage.create({
      userId: req.user.id,
      role: 'assistant',
      content: aiResponse
    });

    res.json({
      success: true,
      data: {
        id: assistantMessage.id,
        userId: assistantMessage.userId,
        role: 'assistant',
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: 'Failed to process chat' });
  }
});

module.exports = router;

