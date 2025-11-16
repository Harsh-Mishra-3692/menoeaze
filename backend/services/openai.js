const OpenAI = require('openai');
const { ChatMessage } = require('../database/models');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function chatWithOpenAI(userId, userMessage, context = '') {
  try {
    // Get recent conversation history
    const recentMessages = await ChatMessage.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']],
      limit: 10
    });

    const messages = [
      {
        role: 'system',
        content: `You are a compassionate and knowledgeable AI assistant helping women navigate menopause. 
        Provide evidence-based, supportive, and personalized advice. Always prioritize user privacy and health.
        ${context ? `\n\nRelevant context: ${context}` : ''}`
      },
      ...recentMessages.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: messages,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get AI response');
  }
}

module.exports = {
  chatWithOpenAI
};

