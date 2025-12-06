import { Router } from 'express';
import { db } from '../db';
import { businesses } from '@shared/schema';
import { eq, or } from 'drizzle-orm';

const router = Router();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
}

router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      logo, 
      brandColor, 
      secondaryColor, 
      description, 
      category,
      activeHours,
      socialLinks,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    const slug = generateSlug(name);

    const result = await db
      .insert(businesses)
      .values({
        name,
        slug,
        logo: logo || null,
        brandColor: brandColor || '#6366f1',
        secondaryColor: secondaryColor || '#8b5cf6',
        description: description || null,
        category: category || null,
        activeHours: activeHours || null,
        socialLinks: socialLinks || null,
        ownerId: null,
      })
      .returning();

    res.status(201).json({ business: result[0] });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

router.get('/branding/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const result = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        slug: businesses.slug,
        logo: businesses.logo,
        brandColor: businesses.brandColor,
        secondaryColor: businesses.secondaryColor,
        description: businesses.description,
        category: businesses.category,
      })
      .from(businesses)
      .where(
        or(
          eq(businesses.id, identifier),
          eq(businesses.slug, identifier)
        )
      )
      .limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json({ business: result[0] });
  } catch (error) {
    console.error('Error fetching business branding:', error);
    res.status(500).json({ error: 'Failed to fetch business branding' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json({ business: result[0] });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

export default router;
