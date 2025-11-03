import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Film, 
  Music,
  Search,
  Grid3x3,
  List,
  Filter,
  Download,
  Trash2,
  Copy
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const mockFiles = [
  { id: 1, name: 'product-hero.jpg', type: 'image', size: '2.4 MB', tags: ['product', 'hero'], date: '2024-03-15' },
  { id: 2, name: 'blog-banner.png', type: 'image', size: '1.8 MB', tags: ['blog', 'banner'], date: '2024-03-14' },
  { id: 3, name: 'service-preview.jpg', type: 'image', size: '3.1 MB', tags: ['service'], date: '2024-03-13' },
  { id: 4, name: 'brand-guidelines.pdf', type: 'document', size: '5.2 MB', tags: ['brand'], date: '2024-03-12' },
  { id: 5, name: 'promo-video.mp4', type: 'video', size: '45.8 MB', tags: ['promo', 'video'], date: '2024-03-10' },
  { id: 6, name: 'background-music.mp3', type: 'audio', size: '8.3 MB', tags: ['audio', 'background'], date: '2024-03-08' },
];

export default function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('all');

  const filteredFiles = selectedType === 'all' 
    ? mockFiles 
    : mockFiles.filter(f => f.type === selectedType);

  const handleUpload = () => {
    toast({ 
      title: "Upload Files", 
      description: "Opening file upload dialog..." 
    });
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = () => {
      toast({ title: "Files uploaded", description: "Your files have been added to the library." });
    };
    input.click();
  };

  const handleCopy = (file: any) => {
    navigator.clipboard.writeText(file.name);
    toast({ title: "URL copied", description: `${file.name} URL copied to clipboard.` });
  };

  const handleDownload = (file: any) => {
    toast({ title: "Downloading", description: `Downloading ${file.name}...` });
  };

  const handleDelete = (file: any) => {
    toast({ 
      title: "File deleted", 
      description: `${file.name} has been removed from the library.`,
      variant: "destructive"
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'document': return FileText;
      case 'video': return Film;
      case 'audio': return Music;
      default: return FileText;
    }
  };

  const stats = [
    { label: 'Total Files', value: mockFiles.length, type: 'all' },
    { label: 'Images', value: mockFiles.filter(f => f.type === 'image').length, type: 'image' },
    { label: 'Documents', value: mockFiles.filter(f => f.type === 'document').length, type: 'document' },
    { label: 'Videos', value: mockFiles.filter(f => f.type === 'video').length, type: 'video' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Centralized storage for all your business assets
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={handleUpload}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === stat.type ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedType(stat.type)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search files, tags, or dates..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <Card key={file.id} className="group hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  <Icon className="w-16 h-16 text-primary/60" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => handleCopy(file)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 space-y-2">
                  <div className="font-medium text-sm truncate">{file.name}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Size</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Tags</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <tr key={file.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm">{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm capitalize">{file.type}</td>
                        <td className="p-4 text-sm text-muted-foreground">{file.size}</td>
                        <td className="p-4 text-sm text-muted-foreground">{file.date}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => handleCopy(file)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(file)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
