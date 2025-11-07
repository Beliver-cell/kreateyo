const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Generate chatbot response
exports.generateResponse = async ({ messages, systemPrompt, temperature = 0.7, knowledgeBase = [] }) => {
  try {
    // Build context from knowledge base
    let contextPrompt = systemPrompt;
    
    if (knowledgeBase && knowledgeBase.length > 0) {
      const knowledgeContext = knowledgeBase
        .map(kb => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join('\n\n');
      
      contextPrompt += `\n\nKnowledge Base:\n${knowledgeContext}`;
    }

    // Prepare messages for API
    const apiMessages = [
      { role: 'system', content: contextPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-5-2025-08-07',
        messages: apiMessages,
        max_completion_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};

// Generate content (blog posts, product descriptions, etc.)
exports.generateContent = async ({ type, prompt, context }) => {
  try {
    let systemPrompt = '';

    switch (type) {
      case 'blog_post':
        systemPrompt = 'You are a professional content writer. Generate engaging, SEO-friendly blog posts.';
        break;
      case 'product_description':
        systemPrompt = 'You are an e-commerce copywriter. Create compelling product descriptions that drive sales.';
        break;
      case 'service_description':
        systemPrompt = 'You are a service marketing expert. Write clear, benefit-focused service descriptions.';
        break;
      case 'email':
        systemPrompt = 'You are an email marketing specialist. Create engaging email content.';
        break;
      case 'social_media':
        systemPrompt = 'You are a social media expert. Create engaging social media posts.';
        break;
      default:
        systemPrompt = 'You are a helpful AI assistant.';
    }

    const fullPrompt = context ? `${prompt}\n\nContext: ${context}` : prompt;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
        max_completion_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate content');
  }
};

// Analyze sentiment
exports.analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the text and respond with only one word: positive, neutral, or negative.'
          },
          { role: 'user', content: text }
        ],
        max_completion_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const sentiment = response.data.choices[0].message.content.trim().toLowerCase();
    return ['positive', 'neutral', 'negative'].includes(sentiment) ? sentiment : 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'neutral';
  }
};
