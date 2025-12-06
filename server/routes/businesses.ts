import { Router } from 'express';
import { db } from '../db';
import { businesses } from '@shared/schema';
import { eq, or } from 'drizzle-orm';

const router = Router();

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
