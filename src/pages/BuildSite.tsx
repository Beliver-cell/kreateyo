import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Eye, Check } from 'lucide-react';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import cozaPreview from '@/assets/templates/coza-store-preview.jpg';
import maleFashionPreview from '@/assets/templates/male-fashion-preview.jpg';

// Generate placeholder preview images for templates without images
const generatePlaceholderImage = (gradient: string, name: string) => {
  return `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${gradient.includes('slate') ? '1e293b' : gradient.includes('purple') ? '581c87' : gradient.includes('pink') ? 'ec4899' : gradient.includes('blue') ? '1e3a8a' : gradient.includes('green') ? '065f46' : gradient.includes('amber') ? '78350f' : gradient.includes('indigo') ? '312e81' : gradient.includes('gray') ? '1f2937' : gradient.includes('rose') ? 'e11d48' : '1e293b'};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${gradient.includes('cyan') ? '0e7490' : gradient.includes('teal') ? '0f766e' : gradient.includes('yellow') ? 'ca8a04' : gradient.includes('orange') ? 'ea580c' : '64748b'};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`;
};

const templates = {
  ecommerce: [
    {
      id: 'ecom-modern',
      name: 'Modern Minimalist',
      description: 'Clean design with large product imagery and smooth animations',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      features: ['Hero slider', 'Quick view', 'Instagram feed'],
      popular: true,
      previewImage: generatePlaceholderImage('from-slate-900 via-purple-900 to-slate-900', 'Modern Minimalist')
    },
    {
      id: 'ecom-coza',
      name: 'Coza Store',
      description: 'Professional fashion store with elegant product showcase',
      gradient: 'from-gray-900 via-gray-700 to-gray-900',
      features: ['Free shipping banner', 'Quick view', 'Category filters'],
      popular: true,
      previewImage: cozaPreview
    },
    {
      id: 'ecom-male',
      name: 'Male Fashion',
      description: 'Modern masculine design perfect for menswear brands',
      gradient: 'from-slate-800 via-blue-900 to-slate-800',
      features: ['Category showcase', 'Instagram feed', 'Rating system'],
      previewImage: maleFashionPreview
    },
    {
      id: 'ecom-vibrant',
      name: 'Vibrant Store',
      description: 'Bold colors and dynamic layouts perfect for fashion and lifestyle',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
      features: ['Mega menu', 'Video sections', 'Collection filters'],
      previewImage: generatePlaceholderImage('from-pink-500 via-red-500 to-yellow-500', 'Vibrant Store')
    },
    {
      id: 'ecom-luxury',
      name: 'Luxury Boutique',
      description: 'Elegant and sophisticated design for premium products',
      gradient: 'from-amber-900 via-yellow-600 to-amber-900',
      features: ['Parallax effects', 'Lookbook', 'Size guide'],
      previewImage: generatePlaceholderImage('from-amber-900 via-yellow-600 to-amber-900', 'Luxury Boutique')
    }
  ],
  services: [
    {
      id: 'serv-professional',
      name: 'Professional Services',
      description: 'Trust-building design ideal for consultants and agencies',
      gradient: 'from-blue-900 via-blue-700 to-cyan-900',
      features: ['Team showcase', 'Case studies', 'Testimonials'],
      popular: true,
      previewImage: generatePlaceholderImage('from-blue-900 via-blue-700 to-cyan-900', 'Professional Services')
    },
    {
      id: 'serv-wellness',
      name: 'Wellness & Health',
      description: 'Calming design perfect for yoga, spa, and wellness businesses',
      gradient: 'from-green-800 via-teal-600 to-green-800',
      features: ['Class schedule', 'Instructor bios', 'Pricing tables'],
      previewImage: generatePlaceholderImage('from-green-800 via-teal-600 to-green-800', 'Wellness & Health')
    },
    {
      id: 'serv-creative',
      name: 'Creative Studio',
      description: 'Bold and artistic layout for designers and photographers',
      gradient: 'from-purple-900 via-pink-800 to-purple-900',
      features: ['Portfolio grid', 'Project showcase', 'Client logos'],
      previewImage: generatePlaceholderImage('from-purple-900 via-pink-800 to-purple-900', 'Creative Studio')
    },
    {
      id: 'serv-customer-care',
      name: 'AI Customer Care',
      description: 'Modern support platform with AI-powered chat and help center',
      gradient: 'from-indigo-900 via-purple-700 to-indigo-900',
      features: ['Live chat widget', 'Help center', 'Support tickets'],
      popular: true,
      previewImage: generatePlaceholderImage('from-indigo-900 via-purple-700 to-indigo-900', 'AI Customer Care')
    },
    {
      id: 'serv-marketing-sales',
      name: 'Prixima Marketing',
      description: 'High-converting design for marketing agencies and sales teams',
      gradient: 'from-orange-900 via-red-700 to-orange-900',
      features: ['Lead capture', 'Service showcase', 'ROI calculator'],
      popular: true,
      previewImage: generatePlaceholderImage('from-orange-900 via-red-700 to-orange-900', 'Prixima Marketing')
    }
  ],
  blog: [
    {
      id: 'blog-magazine',
      name: 'Digital Magazine',
      description: 'Editorial layout with featured stories and categories',
      gradient: 'from-indigo-900 via-blue-800 to-indigo-900',
      features: ['Featured posts', 'Author boxes', 'Related articles'],
      popular: true,
      previewImage: generatePlaceholderImage('from-indigo-900 via-blue-800 to-indigo-900', 'Digital Magazine')
    },
    {
      id: 'blog-minimal',
      name: 'Minimal Blog',
      description: 'Distraction-free reading experience with clean typography',
      gradient: 'from-gray-800 via-gray-700 to-gray-900',
      features: ['Reading time', 'Table of contents', 'Dark mode'],
      previewImage: generatePlaceholderImage('from-gray-800 via-gray-700 to-gray-900', 'Minimal Blog')
    },
    {
      id: 'blog-lifestyle',
      name: 'Lifestyle Blog',
      description: 'Instagram-style layout perfect for lifestyle and travel content',
      gradient: 'from-rose-500 via-orange-500 to-yellow-500',
      features: ['Image galleries', 'Social sharing', 'Newsletter popup'],
      previewImage: generatePlaceholderImage('from-rose-500 via-orange-500 to-yellow-500', 'Lifestyle Blog')
    }
  ]
};


export default function BuildSite() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const businessType = businessProfile.type || 'ecommerce';
  const currentTemplates = templates[businessType as keyof typeof templates] || templates.ecommerce;

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected!",
      description: `${templateName} is ready to customize.`,
    });
  };

  const handleEdit = () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a template",
        description: "Please select a template first.",
        variant: "destructive"
      });
      return;
    }
    // API call will be made here for editing
    toast({
      title: "Opening Editor",
      description: "Preparing your template for editing...",
    });
  };

  const handlePreview = () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a template",
        description: "Please select a template first.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/template-preview?template=${selectedTemplate}`);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Build My Site</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Choose a template for your {businessType} business
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} size="sm" variant="outline" className="flex-1 sm:flex-none">
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="sm:inline">Edit</span>
          </Button>
          <Button onClick={handlePreview} size="sm" className="flex-1 sm:flex-none">
            <Eye className="w-4 h-4 sm:mr-2" />
            <span className="sm:inline">Preview</span>
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto pb-4 px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentTemplates.map((template) => (
            <Card
              key={template.id}
              className={`group cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelectTemplate(template.id, template.name)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
                {(template as any).previewImage ? (
                  <img 
                    src={(template as any).previewImage} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${template.gradient} flex items-center justify-center`} />
                )}
                {template.popular && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">{template.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
