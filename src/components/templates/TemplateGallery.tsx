import { useState, useEffect, type ElementType } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Eye, Check, Sparkles, ShoppingBag, Briefcase, FileText, Building2, Palette, Layout } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  industry?: string;
  thumbnailUrl?: string;
  componentName: string;
  features?: string[];
  isPremium?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface TemplateGalleryProps {
  businessId: string;
  onSelectTemplate: (template: Template) => void;
  currentTemplateId?: string;
}

const categoryIcons: Record<string, ElementType> = {
  ecommerce: ShoppingBag,
  service: Briefcase,
  blog: FileText,
  consulting: Building2,
  portfolio: Palette,
  landing: Layout,
};

export function TemplateGallery({ businessId, onSelectTemplate, currentTemplateId }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch('/api/templates'),
          fetch('/api/templates/categories'),
        ]);

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleApplyTemplate = async (template: Template) => {
    try {
      const response = await fetch(`/api/templates/business/${businessId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (response.ok) {
        onSelectTemplate(template);
      }
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Select a template that best fits your business type. You can customize it later.
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || Layout;
              return (
                <TabsTrigger key={category.id} value={category.id} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {category.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    currentTemplateId === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative group">
                    {template.thumbnailUrl ? (
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Layout className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">{template.name}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setPreviewTemplate(template)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                    {template.isPremium && (
                      <Badge className="absolute top-2 right-2" variant="default">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {currentTemplateId === template.id && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.industry && (
                          <p className="text-xs text-muted-foreground mt-1">{template.industry}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    {template.description && (
                      <CardDescription className="line-clamp-2 mb-3">
                        {template.description}
                      </CardDescription>
                    )}
                    {template.features && template.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      className="w-full"
                      variant={currentTemplateId === template.id ? 'secondary' : 'default'}
                      onClick={() => handleApplyTemplate(template)}
                      disabled={currentTemplateId === template.id}
                    >
                      {currentTemplateId === template.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Currently Active
                        </>
                      ) : (
                        'Use This Template'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
