import { useState } from 'react';
import MobileNav from '@/components/customer/MobileNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Bookmark, Clock, Star } from 'lucide-react';

export default function BloggingReading() {
  const [continueReading] = useState([
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      excerpt: 'Learn the basics of React Hooks and how to use them in your projects...',
      readProgress: 45,
      readTime: '8 min',
      category: 'Web Development',
    },
    {
      id: '2',
      title: 'The Ultimate Guide to TypeScript',
      excerpt: 'Master TypeScript with this comprehensive guide for beginners...',
      readProgress: 20,
      readTime: '12 min',
      category: 'Programming',
    },
  ]);

  const [savedArticles] = useState([
    {
      id: '3',
      title: 'Advanced CSS Techniques',
      excerpt: 'Explore advanced CSS features and animations...',
      readTime: '6 min',
      category: 'CSS',
    },
    {
      id: '4',
      title: 'Building Scalable APIs',
      excerpt: 'Learn best practices for building scalable REST APIs...',
      readTime: '10 min',
      category: 'Backend',
    },
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-sm p-4 sticky top-0 z-10 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-foreground">Reading Hub</h1>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-1" />
            Premium
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Continue Reading */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Continue Reading</h2>
          <div className="space-y-3">
            {continueReading.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-primary font-medium">{post.category}</span>
                    <h3 className="font-semibold text-foreground mt-1 mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{post.readProgress}% complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${post.readProgress}%` }}
                    />
                  </div>
                </div>

                <Button size="sm" className="w-full mt-3">
                  Continue Reading
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Saved Articles */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-foreground">Saved Articles</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {savedArticles.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs text-primary font-medium">{post.category}</span>
                    <h3 className="font-semibold text-foreground mt-1 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Upgrade Prompt */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <Star className="h-12 w-12 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get unlimited access to all articles and exclusive content
            </p>
            <Button className="w-full">
              Upgrade Now
            </Button>
          </div>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
}
