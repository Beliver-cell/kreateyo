import { Search, Menu, Calendar, Clock, User, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TemplateProps {
  colors?: {
    primary: string;
    accent: string;
    background: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
}

export default function BlogTemplate({ colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';

  const posts = [
    { 
      id: 1, 
      title: 'Getting Started with Web Development in 2024', 
      excerpt: 'A comprehensive guide to modern web development tools and practices...',
      category: 'Technology',
      author: 'Sarah Johnson',
      date: 'Mar 15, 2024',
      readTime: '5 min read',
      image: '💻'
    },
    { 
      id: 2, 
      title: 'The Future of Artificial Intelligence', 
      excerpt: 'Exploring the latest trends and innovations in AI technology...',
      category: 'AI',
      author: 'Mike Chen',
      date: 'Mar 12, 2024',
      readTime: '8 min read',
      image: '🤖'
    },
    { 
      id: 3, 
      title: 'Healthy Living: A Complete Guide', 
      excerpt: 'Tips and strategies for maintaining a balanced lifestyle...',
      category: 'Lifestyle',
      author: 'Emma Davis',
      date: 'Mar 10, 2024',
      readTime: '6 min read',
      image: '🥗'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>MyBlog</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-sm hover:text-primary transition-colors">Latest</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">Technology</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">Lifestyle</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">About</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
              <Button style={{ backgroundColor: primaryColor }}>Subscribe</Button>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Featured Story</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Insights, Stories, and Ideas
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Exploring technology, lifestyle, and everything in between. Join our community of readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button size="lg" style={{ backgroundColor: primaryColor }}>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto bg-muted flex items-center justify-center text-8xl">
                💻
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4" style={{ backgroundColor: primaryColor }}>Featured</Badge>
                <h3 className="text-3xl font-bold mb-4">
                  The Ultimate Guide to Modern Web Development
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover the tools, frameworks, and best practices that are shaping the future of web development. From React to AI integration...
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>10 min read</span>
                  </div>
                </div>
                <Button style={{ backgroundColor: primaryColor }} className="w-fit">
                  Read Article <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">Recent Articles</h3>
            <Button variant="link">View All →</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center text-6xl relative overflow-hidden">
                  {post.image}
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                  <h4 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold" style={{ color: primaryColor }}>
                        {post.author[0]}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{post.author}</div>
                        <div className="text-xs text-muted-foreground">{post.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)` }}>
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get the latest articles and insights delivered straight to your inbox. Join 10,000+ subscribers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Your email address" className="flex-1" />
                <Button size="lg" style={{ backgroundColor: primaryColor }}>Subscribe Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: primaryColor }}>MyBlog</h4>
              <p className="text-sm text-muted-foreground">Sharing insights and stories that matter.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Technology</div>
                <div>Lifestyle</div>
                <div>Business</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">About</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Twitter</div>
                <div>LinkedIn</div>
                <div>Instagram</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
