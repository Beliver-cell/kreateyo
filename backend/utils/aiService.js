const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = 'gpt-4o-mini';
const ADVANCED_MODEL = 'gpt-4o';

exports.generateResponse = async ({ messages, systemPrompt, temperature = 0.7, knowledgeBase = [] }) => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('[AI MOCK] No API key configured');
    return "I'm currently unavailable. Please try again later.";
  }

  try {
    let contextPrompt = systemPrompt;
    
    if (knowledgeBase && knowledgeBase.length > 0) {
      const knowledgeContext = knowledgeBase
        .map(kb => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join('\n\n');
      
      contextPrompt += `\n\nKnowledge Base:\n${knowledgeContext}`;
    }

    const apiMessages = [
      { role: 'system', content: contextPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: apiMessages,
      temperature,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

exports.generateContent = async ({ type, prompt, context }) => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('[AI MOCK] No API key configured');
    return getFallbackContent(type);
  }

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

    const response = await openai.chat.completions.create({
      model: ADVANCED_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return getFallbackContent(type);
  }
};

exports.analyzeSentiment = async (text) => {
  if (!process.env.OPENAI_API_KEY) {
    return 'neutral';
  }

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment of the text and respond with only one word: positive, neutral, or negative.'
        },
        { role: 'user', content: text }
      ],
      max_tokens: 10,
    });

    const sentiment = response.choices[0].message.content.trim().toLowerCase();
    return ['positive', 'neutral', 'negative'].includes(sentiment) ? sentiment : 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    return 'neutral';
  }
};

exports.generateEmailContent = async ({ subject, recipientType, businessContext, campaignGoal }) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      subject: subject || 'Check out our latest updates!',
      body: `Dear ${recipientType || 'Customer'},\n\nWe have exciting news to share with you!\n\nBest regards,\nThe Team`
    };
  }

  try {
    const prompt = `Generate a marketing email with the following details:
- Subject line suggestion: ${subject || 'Create an appropriate subject'}
- Target audience: ${recipientType || 'general customers'}
- Business context: ${businessContext || 'e-commerce store'}
- Campaign goal: ${campaignGoal || 'engagement'}

Respond with JSON format: { "subject": "...", "body": "..." }`;

    const response = await openai.chat.completions.create({
      model: ADVANCED_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert email marketing copywriter. Generate compelling email content.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return {
        subject: subject || 'Check out our latest updates!',
        body: response.choices[0].message.content
      };
    }
  } catch (error) {
    console.error('Email generation error:', error.message);
    return {
      subject: subject || 'Check out our latest updates!',
      body: `Dear ${recipientType || 'Customer'},\n\nWe have exciting news to share with you!\n\nBest regards,\nThe Team`
    };
  }
};

exports.generateOutreachMessage = async ({ leadInfo, businessInfo, templateType }) => {
  if (!process.env.OPENAI_API_KEY) {
    return `Hi ${leadInfo?.name || 'there'},\n\nI noticed you're interested in ${businessInfo?.product || 'our services'}. I'd love to connect and discuss how we can help!\n\nBest,\n${businessInfo?.ownerName || 'The Team'}`;
  }

  try {
    const prompt = `Generate a personalized outreach message:
- Lead name: ${leadInfo?.name || 'Prospect'}
- Lead interest: ${leadInfo?.interest || 'general inquiry'}
- Business name: ${businessInfo?.name || 'Our Company'}
- Product/Service: ${businessInfo?.product || 'our services'}
- Template type: ${templateType || 'professional'}

Keep it concise and personalized.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert at writing personalized sales outreach messages that feel genuine and not pushy.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Outreach generation error:', error.message);
    return `Hi ${leadInfo?.name || 'there'},\n\nI noticed you're interested in ${businessInfo?.product || 'our services'}. I'd love to connect and discuss how we can help!\n\nBest,\n${businessInfo?.ownerName || 'The Team'}`;
  }
};

function getFallbackContent(type) {
  const fallbacks = {
    blog_post: 'This is a sample blog post. Configure your OpenAI API key to generate custom content.',
    product_description: 'This product offers great value. Configure your OpenAI API key for custom descriptions.',
    service_description: 'Our professional service delivers results. Configure your OpenAI API key for custom descriptions.',
    email: 'Dear Customer,\n\nWe have exciting news to share!\n\nBest regards,\nThe Team',
    social_media: 'Check out our latest updates! #trending'
  };
  return fallbacks[type] || 'Configure your OpenAI API key to enable AI-generated content.';
}
