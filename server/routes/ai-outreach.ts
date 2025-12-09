import { Router } from 'express';
import { db } from '../db';
import OpenAI from 'openai';

export const aiOutreachRoute = Router();

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

async function generateAIOutreachMessage(leadInfo: any, businessInfo: any, templateType: string): Promise<string> {
  const openai = getOpenAI();
  
  if (!openai) {
    return `Hi ${leadInfo?.name || 'there'},\n\nWe noticed you're interested in ${businessInfo?.product || 'our services'}. We'd love to connect and discuss how we can help!\n\nBest regards,\n${businessInfo?.ownerName || 'The Team'}`;
  }

  try {
    const prompt = `Generate a personalized outreach message:
- Lead name: ${leadInfo?.name || 'Prospect'}
- Lead company: ${leadInfo?.company || 'Unknown'}
- Lead interest: ${leadInfo?.interest || 'general inquiry'}
- Business name: ${businessInfo?.name || 'Our Company'}
- Product/Service: ${businessInfo?.product || 'our services'}
- Template type: ${templateType || 'professional'}

Keep it concise, genuine, and personalized. Don't be pushy.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert at writing personalized sales outreach messages that feel genuine and not pushy. Write concise, warm messages that build rapport.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0].message.content || `Hi ${leadInfo?.name || 'there'},\n\nWe'd love to connect!`;
  } catch (error) {
    console.error('OpenAI outreach error:', error);
    return `Hi ${leadInfo?.name || 'there'},\n\nWe noticed you're interested in ${businessInfo?.product || 'our services'}. We'd love to connect and discuss how we can help!\n\nBest regards,\n${businessInfo?.ownerName || 'The Team'}`;
  }
}

aiOutreachRoute.post('/ai-outreach', async (req, res) => {
  try {
    const { userId, leadId, leadInfo, businessInfo, templateType, context } = req.body;

    console.log(`Generating AI outreach for lead ${leadId || 'unknown'}`);

    const generatedMessage = await generateAIOutreachMessage(
      leadInfo || { id: leadId },
      businessInfo || {},
      templateType || 'professional'
    );

    const hasAI = !!process.env.OPENAI_API_KEY;

    res.json({
      success: true,
      message: 'AI outreach generated successfully',
      generatedMessage,
      confidence: hasAI ? 0.85 : 0.5,
      aiPowered: hasAI
    });
  } catch (error) {
    console.error('AI outreach error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

aiOutreachRoute.post('/ai-outreach/bulk', async (req, res) => {
  try {
    const { userId, leads, businessInfo, templateType } = req.body;

    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: 'leads array is required' });
    }

    console.log(`Generating bulk AI outreach for ${leads.length} leads`);

    const results = await Promise.all(
      leads.map(async (lead: any) => {
        try {
          const message = await generateAIOutreachMessage(lead, businessInfo, templateType);
          return {
            leadId: lead.id,
            success: true,
            generatedMessage: message
          };
        } catch (err) {
          return {
            leadId: lead.id,
            success: false,
            error: err instanceof Error ? err.message : 'Generation failed'
          };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `Generated ${successCount} of ${leads.length} outreach messages`,
      results
    });
  } catch (error) {
    console.error('Bulk AI outreach error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
