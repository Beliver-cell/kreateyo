import { Router, Request, Response } from 'express';
import { db } from '../db';
import { templates, templateBlocks, businessTemplateInstances } from '../../shared/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const activeOnly = req.query.active !== 'false';

    let allTemplates;
    
    if (category && activeOnly) {
      allTemplates = await db.select().from(templates)
        .where(and(
          eq(templates.category, category as any),
          eq(templates.isActive, true)
        ))
        .orderBy(asc(templates.sortOrder));
    } else if (category) {
      allTemplates = await db.select().from(templates)
        .where(eq(templates.category, category as any))
        .orderBy(asc(templates.sortOrder));
    } else if (activeOnly) {
      allTemplates = await db.select().from(templates)
        .where(eq(templates.isActive, true))
        .orderBy(asc(templates.sortOrder));
    } else {
      allTemplates = await db.select().from(templates)
        .orderBy(asc(templates.sortOrder));
    }

    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = [
      { id: 'ecommerce', name: 'E-commerce', description: 'Online store templates' },
      { id: 'service', name: 'Service Business', description: 'Service-based business templates' },
      { id: 'blog', name: 'Blog', description: 'Blog and content templates' },
      { id: 'consulting', name: 'Consulting', description: 'Professional consulting templates' },
      { id: 'portfolio', name: 'Portfolio', description: 'Portfolio and showcase templates' },
      { id: 'landing', name: 'Landing Page', description: 'Single-page landing templates' },
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await db.select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    if (template.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template[0]);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.get('/:id/blocks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blocks = await db.select()
      .from(templateBlocks)
      .where(eq(templateBlocks.templateId, id))
      .orderBy(asc(templateBlocks.orderIndex));

    res.json(blocks);
  } catch (error) {
    console.error('Error fetching template blocks:', error);
    res.status(500).json({ error: 'Failed to fetch template blocks' });
  }
});

router.get('/business/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const instances = await db.select({
      instance: businessTemplateInstances,
      template: templates,
    })
      .from(businessTemplateInstances)
      .innerJoin(templates, eq(businessTemplateInstances.templateId, templates.id))
      .where(eq(businessTemplateInstances.businessId, businessId));

    res.json(instances);
  } catch (error) {
    console.error('Error fetching business templates:', error);
    res.status(500).json({ error: 'Failed to fetch business templates' });
  }
});

router.post('/business/:businessId/apply', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { templateId, customizations } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'templateId is required' });
    }

    const existing = await db.select()
      .from(businessTemplateInstances)
      .where(eq(businessTemplateInstances.businessId, businessId))
      .limit(1);

    let instance;
    if (existing.length > 0) {
      [instance] = await db.update(businessTemplateInstances)
        .set({
          templateId,
          customizations: customizations || {},
          updatedAt: new Date(),
        })
        .where(eq(businessTemplateInstances.businessId, businessId))
        .returning();
    } else {
      [instance] = await db.insert(businessTemplateInstances).values({
        businessId,
        templateId,
        customizations: customizations || {},
      }).returning();
    }

    res.status(201).json(instance);
  } catch (error) {
    console.error('Error applying template:', error);
    res.status(500).json({ error: 'Failed to apply template' });
  }
});

router.patch('/business/:businessId/customize', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { customizations, blockOverrides } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (customizations) updateData.customizations = customizations;
    if (blockOverrides) updateData.blockOverrides = blockOverrides;

    const [updated] = await db.update(businessTemplateInstances)
      .set(updateData)
      .where(eq(businessTemplateInstances.businessId, businessId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Template instance not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error customizing template:', error);
    res.status(500).json({ error: 'Failed to customize template' });
  }
});

router.post('/business/:businessId/publish', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const [updated] = await db.update(businessTemplateInstances)
      .set({
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(businessTemplateInstances.businessId, businessId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Template instance not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error publishing template:', error);
    res.status(500).json({ error: 'Failed to publish template' });
  }
});

export const templatesRoute = router;
