import { useState } from 'react';
import { Plus, Search, MoreVertical, Sun, Star, Gift, Tag, Gem, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CollectionDialog } from '@/components/CollectionDialog';

const mockCollections = [
  { 
    id: 1, 
    name: 'Summer Collection', 
    products: 24, 
    status: 'active',
    icon: Sun,
    revenue: '$12,450'
  },
  { 
    id: 2, 
    name: 'Best Sellers', 
    products: 15, 
    status: 'active',
    icon: Star,
    revenue: '$24,890'
  },
  { 
    id: 3, 
    name: 'New Arrivals', 
    products: 8, 
    status: 'active',
    icon: Gift,
    revenue: '$5,230'
  },
  { 
    id: 4, 
    name: 'Clearance', 
    products: 32, 
    status: 'draft',
    icon: Tag,
    revenue: '$8,670'
  },
  { 
    id: 5, 
    name: 'Premium Line', 
    products: 12, 
    status: 'active',
    icon: Gem,
    revenue: '$18,340'
  },
];

export default function Collections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);

  const filteredCollections = mockCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Organize products into curated collections
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => {
            setSelectedCollection(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map((collection) => {
              const CollectionIcon = collection.icon;
              return (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <CollectionIcon className="w-6 h-6 text-primary" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCollection(collection);
                        setDialogOpen(true);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-2">{collection.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Products:</span>
                      <span className="font-medium">{collection.products}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium text-success">{collection.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={collection.status === 'active' ? 'default' : 'secondary'}>
                        {collection.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </CardContent>
      </Card>

      <CollectionDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        collection={selectedCollection}
      />
    </div>
  );
}
