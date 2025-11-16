const axios = require('axios');

// TODO: Add your Perplexity AI API key to backend/.env as PERPLEXITY_API_KEY
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

async function chatWithPerplexity(userMessage, context = '') {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured. Add PERPLEXITY_API_KEY to .env file.');
    }

    const messages = [
      {
        role: 'system',
        content: `You are a compassionate and knowledgeable AI assistant helping women navigate menopause. 
        Provide evidence-based, supportive, and personalized advice. Always prioritize user privacy and health.
        Be empathetic, clear, and actionable in your responses.
        ${context ? `\n\nRelevant context about the user: ${context}` : ''}`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response. Please check your API key.');
  }
}

module.exports = {
  chatWithPerplexity
};

