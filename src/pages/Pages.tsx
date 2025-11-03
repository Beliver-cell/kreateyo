import { useState } from 'react';
import { Plus, Search, Globe, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageDialog } from '@/components/PageDialog';
import { toast } from '@/hooks/use-toast';

const mockPages = [
  {
    id: 1,
    title: 'About Us',
    slug: '/about',
    status: 'published',
    lastEdited: 'Jan 15, 2024',
    views: 543
  },
  {
    id: 2,
    title: 'Contact',
    slug: '/contact',
    status: 'published',
    lastEdited: 'Jan 12, 2024',
    views: 432
  },
  {
    id: 3,
    title: 'Privacy Policy',
    slug: '/privacy',
    status: 'published',
    lastEdited: 'Jan 10, 2024',
    views: 234
  },
  {
    id: 4,
    title: 'Terms of Service',
    slug: '/terms',
    status: 'published',
    lastEdited: 'Jan 8, 2024',
    views: 189
  },
  {
    id: 5,
    title: 'New Landing Page',
    slug: '/landing',
    status: 'draft',
    lastEdited: 'Jan 16, 2024',
    views: 0
  },
];

export default function Pages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const filteredPages = mockPages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setDialogOpen(true);
  };

  const handleView = (page: any) => {
    toast({ title: "Opening page", description: `Viewing ${page.title}` });
    window.open(page.slug, '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your site's static pages
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => {
            setSelectedPage(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{page.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-mono">{page.slug}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last edited:</span>
                      <span className="font-medium">{page.lastEdited}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Page views:</span>
                      <span className="font-medium">{page.views}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleView(page)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <PageDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        page={selectedPage}
      />
    </div>
  );
}
