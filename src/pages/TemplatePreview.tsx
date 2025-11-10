import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EcommerceTemplate from '@/components/templates/EcommerceTemplate';
import CozaStoreTemplate from '@/components/templates/CozaStoreTemplate';
import MaleFashionTemplate from '@/components/templates/MaleFashionTemplate';
import BlogTemplate from '@/components/templates/BlogTemplate';
import ServiceTemplate from '@/components/templates/ServiceTemplate';

export default function TemplatePreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template');
  const mockBusinessId = "preview-business-123";
  
  const renderTemplate = () => {
    switch (templateId) {
      case 'ecom-coza':
        return <CozaStoreTemplate businessId={mockBusinessId} />;
      case 'ecom-male':
        return <MaleFashionTemplate businessId={mockBusinessId} />;
      case 'ecom-modern':
        return <EcommerceTemplate />;
      case 'serv-professional':
      case 'serv-wellness':
      case 'serv-creative':
        return <ServiceTemplate />;
      case 'blog-magazine':
      case 'blog-minimal':
      case 'blog-lifestyle':
        return <BlogTemplate />;
      default:
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Template Selected</h2>
              <p className="text-muted-foreground mb-4">Please select a template from Build Site page</p>
              <Button onClick={() => navigate('/build')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Build Site
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="h-full w-full overflow-auto bg-background">
      {templateId && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/build')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
            <span className="text-sm text-muted-foreground">Preview Mode</span>
          </div>
        </div>
      )}
      {renderTemplate()}
    </div>
  );
}
