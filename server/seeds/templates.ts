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

export async function seedTemplates() {
  console.log('Seeding templates...');

  for (const template of templateData) {
    const existing = await db.select().from(templates).where(
      eq(templates.slug, template.slug)
    ).limit(1);

    if (existing.length === 0) {
      await db.insert(templates).values({
        ...template,
        isActive: true,
        isPremium: false,
      });
      console.log(`Created template: ${template.name}`);
    } else {
      console.log(`Template already exists: ${template.name}`);
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
