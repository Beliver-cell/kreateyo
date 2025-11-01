import { useState } from 'react';
import { Plus, Search, Eye, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with React Hooks',
    excerpt: 'Learn the fundamentals of React Hooks and how they can improve your code...',
    date: 'Jan 15, 2024',
    status: 'published',
    views: 1234,
    comments: 18,
    category: 'Tutorial'
  },
  {
    id: 2,
    title: '10 Tips for Better Code Quality',
    excerpt: 'Discover proven strategies to write cleaner, more maintainable code...',
    date: 'Jan 12, 2024',
    status: 'published',
    views: 890,
    comments: 12,
    category: 'Best Practices'
  },
  {
    id: 3,
    title: 'Understanding TypeScript Generics',
    excerpt: 'A deep dive into TypeScript generics and their practical applications...',
    date: 'Jan 10, 2024',
    status: 'draft',
    views: 0,
    comments: 0,
    category: 'Tutorial'
  },
  {
    id: 4,
    title: 'Building Scalable APIs',
    excerpt: 'Best practices for designing and implementing scalable backend APIs...',
    date: 'Jan 8, 2024',
    status: 'published',
    views: 1567,
    comments: 24,
    category: 'Architecture'
  },
];

export default function Posts() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Create and manage your blog content
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Write Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments} comments</span>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                    </div>
                    <div className="flex sm:flex-row flex-col gap-2 lg:flex-col">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
