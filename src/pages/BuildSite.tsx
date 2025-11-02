import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Eye, Check } from 'lucide-react';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const templates = {
  ecommerce: [
    {
      id: 'ecom-modern',
      name: 'Modern Minimalist',
      description: 'Clean design with large product imagery and smooth animations',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      features: ['Hero slider', 'Quick view', 'Instagram feed'],
      popular: true
    },
    {
      id: 'ecom-vibrant',
      name: 'Vibrant Store',
      description: 'Bold colors and dynamic layouts perfect for fashion and lifestyle',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
      features: ['Mega menu', 'Video sections', 'Collection filters']
    },
    {
      id: 'ecom-luxury',
      name: 'Luxury Boutique',
      description: 'Elegant and sophisticated design for premium products',
      gradient: 'from-amber-900 via-yellow-600 to-amber-900',
      features: ['Parallax effects', 'Lookbook', 'Size guide']
    }
  ],
  services: [
    {
      id: 'serv-professional',
      name: 'Professional Services',
      description: 'Trust-building design ideal for consultants and agencies',
      gradient: 'from-blue-900 via-blue-700 to-cyan-900',
      features: ['Team showcase', 'Case studies', 'Testimonials'],
      popular: true
    },
    {
      id: 'serv-wellness',
      name: 'Wellness & Health',
      description: 'Calming design perfect for yoga, spa, and wellness businesses',
      gradient: 'from-green-800 via-teal-600 to-green-800',
      features: ['Class schedule', 'Instructor bios', 'Pricing tables']
    },
    {
      id: 'serv-creative',
      name: 'Creative Studio',
      description: 'Bold and artistic layout for designers and photographers',
      gradient: 'from-purple-900 via-pink-800 to-purple-900',
      features: ['Portfolio grid', 'Project showcase', 'Client logos']
    }
  ],
  blog: [
    {
      id: 'blog-magazine',
      name: 'Digital Magazine',
      description: 'Editorial layout with featured stories and categories',
      gradient: 'from-indigo-900 via-blue-800 to-indigo-900',
      features: ['Featured posts', 'Author boxes', 'Related articles'],
      popular: true
    },
    {
      id: 'blog-minimal',
      name: 'Minimal Blog',
      description: 'Distraction-free reading experience with clean typography',
      gradient: 'from-gray-800 via-gray-700 to-gray-900',
      features: ['Reading time', 'Table of contents', 'Dark mode']
    },
    {
      id: 'blog-lifestyle',
      name: 'Lifestyle Blog',
      description: 'Instagram-style layout perfect for lifestyle and travel content',
      gradient: 'from-rose-500 via-orange-500 to-yellow-500',
      features: ['Image galleries', 'Social sharing', 'Newsletter popup']
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
    navigate('/template-preview');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Build My Site</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Choose a template for your {businessType} business
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button onClick={handlePreview} size="sm">
            <Eye className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className={`grid gap-3 md:gap-4 ${
          selectedTemplate 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}>
          {currentTemplates.map((template) => (
            <Card
              key={template.id}
              className={`group cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : 'hover:shadow-md hover:scale-102'
              } ${selectedTemplate && selectedTemplate !== template.id ? 'opacity-60' : ''}`}
              onClick={() => handleSelectTemplate(template.id, template.name)}
            >
              <div className={`aspect-video bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden rounded-t-lg`}>
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2 md:p-3">
                <h3 className="font-semibold text-xs md:text-sm text-center truncate">
                  {template.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
