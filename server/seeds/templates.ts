import { db } from '../db';
import { templates, templateBlocks } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const templateData = [
  {
    name: 'Coza Store',
    slug: 'coza-store',
    description: 'Modern e-commerce template with clean design, perfect for fashion and lifestyle stores',
    category: 'ecommerce' as const,
    industry: 'Fashion & Lifestyle',
    componentName: 'CozaStoreTemplate',
    features: ['Product Grid', 'Shopping Cart', 'Checkout Flow', 'Product Categories', 'Search'],
    sortOrder: 1,
  },
  {
    name: 'Male Fashion',
    slug: 'male-fashion',
    description: 'Sleek e-commerce template designed for men\'s fashion and accessories',
    category: 'ecommerce' as const,
    industry: 'Fashion',
    componentName: 'MaleFashionTemplate',
    features: ['Product Grid', 'Size Guide', 'Wishlist', 'Quick View', 'Newsletter'],
    sortOrder: 2,
  },
  {
    name: 'General E-commerce',
    slug: 'general-ecommerce',
    description: 'Versatile e-commerce template suitable for any online store',
    category: 'ecommerce' as const,
    industry: 'General Retail',
    componentName: 'EcommerceTemplate',
    features: ['Product Catalog', 'Cart', 'Checkout', 'Reviews', 'Filters'],
    sortOrder: 3,
  },
  {
    name: 'Service Business',
    slug: 'service-business',
    description: 'Professional template for service-based businesses with booking capabilities',
    category: 'service' as const,
    industry: 'Professional Services',
    componentName: 'ServiceTemplate',
    features: ['Service Listing', 'Booking System', 'Team Profiles', 'Testimonials', 'Contact Form'],
    sortOrder: 4,
  },
  {
    name: 'Proxima Services',
    slug: 'proxima-services',
    description: 'Modern service template with elegant design and appointment scheduling',
    category: 'service' as const,
    industry: 'Professional Services',
    componentName: 'PriximaTemplate',
    features: ['Appointment Booking', 'Service Packages', 'Portfolio', 'FAQ', 'Contact'],
    sortOrder: 5,
  },
  {
    name: 'AI Customer Care',
    slug: 'ai-customer-care',
    description: 'Template with integrated AI chatbot for automated customer support',
    category: 'service' as const,
    industry: 'Customer Service',
    componentName: 'AiCustomerCareTemplate',
    features: ['AI Chatbot', 'Knowledge Base', 'Ticket System', 'Live Chat', 'FAQ'],
    sortOrder: 6,
  },
  {
    name: 'Foste Consulting',
    slug: 'foste-consulting',
    description: 'Premium consulting template for professional advisory firms',
    category: 'consulting' as const,
    industry: 'Consulting',
    componentName: 'FosteConsultingTemplate',
    features: ['Case Studies', 'Team Profiles', 'Service Areas', 'Client Logos', 'Testimonials'],
    sortOrder: 7,
  },
  {
    name: 'Consulting Pro',
    slug: 'consulting-pro',
    description: 'Executive consulting template with sophisticated design',
    category: 'consulting' as const,
    industry: 'Business Consulting',
    componentName: 'ConsultingProTemplate',
    features: ['Services Grid', 'Industry Focus', 'Insights Blog', 'Contact Form', 'Case Studies'],
    sortOrder: 8,
  },
  {
    name: 'Blog',
    slug: 'blog-template',
    description: 'Clean and modern blog template for content creators',
    category: 'blog' as const,
    industry: 'Media & Content',
    componentName: 'BlogTemplate',
    features: ['Post Grid', 'Categories', 'Tags', 'Author Profiles', 'Comments', 'Newsletter'],
    sortOrder: 9,
  },
];

const blockConfigs: Record<string, Array<{ blockType: string; name: string; defaultContent: any; schema: any; isRequired: boolean }>> = {
  'ecommerce': [
    {
      blockType: 'header',
      name: 'Navigation Header',
      defaultContent: { logo: 'Your Store', links: ['Home', 'Shop', 'About', 'Contact'] },
      schema: { properties: { logo: { type: 'string', title: 'Logo Text' }, links: { type: 'array', title: 'Navigation Links' } } },
      isRequired: true,
    },
    {
      blockType: 'hero',
      name: 'Hero Banner',
      defaultContent: { title: 'Welcome to Our Store', subtitle: 'Discover amazing products', buttonText: 'Shop Now', buttonLink: '/shop' },
      schema: { properties: { title: { type: 'string' }, subtitle: { type: 'string' }, buttonText: { type: 'string' }, buttonLink: { type: 'string' } } },
      isRequired: true,
    },
    {
      blockType: 'products',
      name: 'Featured Products',
      defaultContent: { title: 'Featured Products', showCount: 8 },
      schema: { properties: { title: { type: 'string' }, showCount: { type: 'number' } } },
      isRequired: true,
    },
    {
      blockType: 'features',
      name: 'Store Features',
      defaultContent: { title: 'Why Shop With Us', features: [{ title: 'Free Shipping', description: 'On orders over $50' }, { title: 'Secure Payment', description: '100% secure checkout' }, { title: 'Easy Returns', description: '30-day return policy' }] },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'testimonials',
      name: 'Customer Reviews',
      defaultContent: { title: 'What Customers Say', testimonials: [{ name: 'Jane Doe', text: 'Great products!', role: 'Customer' }] },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'cta',
      name: 'Newsletter Signup',
      defaultContent: { title: 'Subscribe to Our Newsletter', description: 'Get updates on new arrivals and special offers', buttonText: 'Subscribe' },
      schema: { properties: { title: { type: 'string' }, description: { type: 'string' }, buttonText: { type: 'string' } } },
      isRequired: false,
    },
    {
      blockType: 'footer',
      name: 'Footer',
      defaultContent: { copyright: '© 2024 Your Store. All rights reserved.', socialLinks: ['Facebook', 'Instagram', 'Twitter'] },
      schema: { properties: { copyright: { type: 'string' }, socialLinks: { type: 'array' } } },
      isRequired: true,
    },
  ],
  'service': [
    {
      blockType: 'header',
      name: 'Navigation Header',
      defaultContent: { logo: 'Your Business', links: ['Home', 'Services', 'About', 'Contact'] },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'hero',
      name: 'Hero Section',
      defaultContent: { title: 'Professional Services', subtitle: 'Expert solutions for your needs', buttonText: 'Book Now', buttonLink: '/booking' },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'services',
      name: 'Services Grid',
      defaultContent: { title: 'Our Services', services: [{ title: 'Service 1', description: 'Description', price: '$99' }] },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'about',
      name: 'About Section',
      defaultContent: { title: 'About Us', description: 'We are dedicated to providing the best service.' },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'testimonials',
      name: 'Testimonials',
      defaultContent: { title: 'Client Testimonials', testimonials: [] },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'contact',
      name: 'Contact Form',
      defaultContent: { title: 'Get In Touch', buttonText: 'Send Message' },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'footer',
      name: 'Footer',
      defaultContent: { copyright: '© 2024 Your Business' },
      schema: {},
      isRequired: true,
    },
  ],
  'consulting': [
    {
      blockType: 'header',
      name: 'Navigation Header',
      defaultContent: { logo: 'Consulting Firm', links: ['Home', 'Services', 'Case Studies', 'Team', 'Contact'] },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'hero',
      name: 'Hero Section',
      defaultContent: { title: 'Strategic Business Consulting', subtitle: 'Transform your business with expert guidance', buttonText: 'Schedule Consultation', buttonLink: '/contact' },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'features',
      name: 'Expertise Areas',
      defaultContent: { title: 'Our Expertise', features: [{ title: 'Strategy', description: 'Business strategy development' }, { title: 'Operations', description: 'Process optimization' }, { title: 'Digital', description: 'Digital transformation' }] },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'about',
      name: 'About the Firm',
      defaultContent: { title: 'About Our Firm', description: 'With decades of experience, we help businesses achieve their goals.' },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'testimonials',
      name: 'Client Success Stories',
      defaultContent: { title: 'Client Success Stories', testimonials: [] },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'cta',
      name: 'Call to Action',
      defaultContent: { title: 'Ready to Transform Your Business?', description: 'Schedule a free consultation today', buttonText: 'Get Started' },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'footer',
      name: 'Footer',
      defaultContent: { copyright: '© 2024 Consulting Firm' },
      schema: {},
      isRequired: true,
    },
  ],
  'blog': [
    {
      blockType: 'header',
      name: 'Blog Header',
      defaultContent: { logo: 'My Blog', links: ['Home', 'Categories', 'About', 'Contact'] },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'hero',
      name: 'Featured Post',
      defaultContent: { title: 'Welcome to My Blog', subtitle: 'Thoughts, stories, and ideas', buttonText: 'Read Latest', buttonLink: '/posts' },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'posts',
      name: 'Recent Posts',
      defaultContent: { title: 'Recent Posts', showCount: 6 },
      schema: {},
      isRequired: true,
    },
    {
      blockType: 'about',
      name: 'About Author',
      defaultContent: { title: 'About Me', description: 'Welcome to my blog where I share my thoughts and experiences.' },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'cta',
      name: 'Newsletter',
      defaultContent: { title: 'Subscribe to Updates', description: 'Get notified when new posts are published', buttonText: 'Subscribe' },
      schema: {},
      isRequired: false,
    },
    {
      blockType: 'footer',
      name: 'Footer',
      defaultContent: { copyright: '© 2024 My Blog' },
      schema: {},
      isRequired: true,
    },
  ],
};

export async function seedTemplates() {
  console.log('Seeding templates...');

  for (const template of templateData) {
    let templateId: string;
    
    const existing = await db.select().from(templates).where(
      eq(templates.slug, template.slug)
    ).limit(1);

    if (existing.length === 0) {
      const [newTemplate] = await db.insert(templates).values({
        ...template,
        isActive: true,
        isPremium: false,
      }).returning();
      templateId = newTemplate.id;
      console.log(`Created template: ${template.name}`);
    } else {
      templateId = existing[0].id;
      console.log(`Template already exists: ${template.name}`);
    }

    const blocks = blockConfigs[template.category];
    if (blocks) {
      const existingBlocks = await db.select().from(templateBlocks).where(
        eq(templateBlocks.templateId, templateId)
      );

      if (existingBlocks.length === 0) {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          await db.insert(templateBlocks).values({
            templateId,
            blockType: block.blockType,
            name: block.name,
            defaultContent: block.defaultContent,
            schema: block.schema,
            orderIndex: i,
            isRequired: block.isRequired,
          });
        }
        console.log(`  Added ${blocks.length} blocks to ${template.name}`);
      }
    }
  }

  console.log('Template seeding complete!');
}

seedTemplates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding templates:', error);
    process.exit(1);
  });
