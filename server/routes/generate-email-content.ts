import { Router } from 'express';
import { db } from '../db';
import OpenAI from 'openai';

export const generateEmailContentRoute = Router();

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

interface EmailContent {
  subject: string;
  body: string;
  html: string;
}

async function generateAIEmailContent(
  emailType: string,
  context: any,
  variables: any
): Promise<EmailContent> {
  const openai = getOpenAI();

  const fallbackContent: EmailContent = {
    subject: `Your ${emailType} Information`,
    body: `Hello!\n\nHere's your ${emailType} content.\n\nBest regards,\nThe Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Hello!</h1>
      <p>Here's your ${emailType} content.</p>
      <p style="margin-top: 30px; color: #666;">Best regards,<br>The Team</p>
    </div>`
  };

  if (!openai) {
    return fallbackContent;
  }

  try {
    const systemPrompt = getSystemPromptForEmailType(emailType);
    const userPrompt = buildEmailPrompt(emailType, context, variables);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const content = response.choices[0].message.content || '';

    try {
      const parsed = JSON.parse(content);
      return {
        subject: parsed.subject || fallbackContent.subject,
        body: parsed.body || fallbackContent.body,
        html: parsed.html || generateHtmlFromBody(parsed.body || fallbackContent.body)
      };
    } catch {
      return {
        subject: fallbackContent.subject,
        body: content,
        html: generateHtmlFromBody(content)
      };
    }
  } catch (error) {
    console.error('AI email generation error:', error);
    return fallbackContent;
  }
}

function getSystemPromptForEmailType(emailType: string): string {
  const prompts: Record<string, string> = {
    marketing: 'You are an expert email marketing copywriter. Create compelling marketing emails that drive engagement and conversions.',
    transactional: 'You are a professional email writer. Create clear, informative transactional emails.',
    welcome: 'You are a warm and friendly copywriter. Create welcoming emails that make new customers feel valued.',
    follow_up: 'You are a professional sales copywriter. Create follow-up emails that maintain interest without being pushy.',
    promotional: 'You are an expert promotional copywriter. Create exciting promotional emails that highlight offers and drive action.',
    newsletter: 'You are a skilled newsletter writer. Create engaging newsletters that inform and entertain readers.',
    announcement: 'You are a professional communications writer. Create clear announcement emails that effectively communicate important updates.'
  };

  return prompts[emailType] || 'You are a professional email copywriter. Create effective, well-written emails.';
}

function buildEmailPrompt(emailType: string, context: any, variables: any): string {
  let prompt = `Generate a ${emailType} email with the following requirements:

Email Type: ${emailType}
`;

  if (context) {
    if (context.businessName) prompt += `Business Name: ${context.businessName}\n`;
    if (context.recipientName) prompt += `Recipient Name: ${context.recipientName}\n`;
    if (context.purpose) prompt += `Purpose: ${context.purpose}\n`;
    if (context.tone) prompt += `Tone: ${context.tone}\n`;
    if (context.additionalInfo) prompt += `Additional Info: ${context.additionalInfo}\n`;
  }

  if (variables) {
    prompt += `\nVariables to include:\n`;
    Object.entries(variables).forEach(([key, value]) => {
      prompt += `- ${key}: ${value}\n`;
    });
  }

  prompt += `
Respond with a JSON object containing:
- "subject": The email subject line
- "body": The plain text body of the email
- "html": The HTML formatted body (use inline styles, max-width 600px container)

Make the email professional, engaging, and appropriate for the email type.`;

  return prompt;
}

function generateHtmlFromBody(body: string): string {
  const paragraphs = body.split('\n\n').map(p => p.trim()).filter(Boolean);
  const htmlContent = paragraphs.map(p => `<p style="margin: 0 0 16px 0; line-height: 1.6;">${p.replace(/\n/g, '<br>')}</p>`).join('');

  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    ${htmlContent}
  </div>`;
}

generateEmailContentRoute.post('/generate-email-content', async (req, res) => {
  try {
    const { userId, emailType, context, variables } = req.body;

    console.log(`Generating email content: ${emailType}`);

    const emailContent = await generateAIEmailContent(
      emailType || 'general',
      context || {},
      variables || {}
    );

    const hasAI = !!process.env.OPENAI_API_KEY;

    res.json({
      success: true,
      message: 'Email content generated successfully',
      emailContent,
      aiPowered: hasAI
    });
  } catch (error) {
    console.error('Generate email content error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

generateEmailContentRoute.post('/generate-email-content/batch', async (req, res) => {
  try {
    const { userId, emails } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'emails array is required' });
    }

    console.log(`Generating batch email content for ${emails.length} emails`);

    const results = await Promise.all(
      emails.map(async (emailRequest: any) => {
        try {
          const content = await generateAIEmailContent(
            emailRequest.emailType || 'general',
            emailRequest.context || {},
            emailRequest.variables || {}
          );
          return {
            id: emailRequest.id,
            success: true,
            emailContent: content
          };
        } catch (err) {
          return {
            id: emailRequest.id,
            success: false,
            error: err instanceof Error ? err.message : 'Generation failed'
          };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `Generated ${successCount} of ${emails.length} email contents`,
      results
    });
  } catch (error) {
    console.error('Batch generate email content error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
