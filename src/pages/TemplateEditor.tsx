import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TemplateEditor } from '@/components/templates/TemplateEditor';
import { TemplateGallery } from '@/components/templates/TemplateGallery';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface TemplateInstance {
  instance: {
    id: string;
    templateId: string;
  };
  template: Template;
}

export default function TemplateEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const businessId = searchParams.get('businessId') || user?.id || '';
  
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchCurrentTemplate();
    } else {
      setLoading(false);
      setShowGallery(true);
    }
  }, [businessId]);

  const fetchCurrentTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/business/${businessId}`);
      if (response.ok) {
        const instances: TemplateInstance[] = await response.json();
        if (instances.length > 0) {
          setCurrentTemplate(instances[0].template);
        } else {
          setShowGallery(true);
        }
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      setShowGallery(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setCurrentTemplate(template);
    setShowGallery(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showGallery || !currentTemplate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <TemplateGallery
          businessId={businessId}
          onSelectTemplate={handleTemplateSelect}
          currentTemplateId={currentTemplate?.id}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background border-b px-4 py-2 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowGallery(true)}>
          Change Template
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <TemplateEditor
          businessId={businessId}
          templateId={currentTemplate.id}
          templateName={currentTemplate.name}
          onSave={() => console.log('Template saved')}
          onPublish={() => console.log('Template published')}
        />
      </div>
    </div>
  );
}
