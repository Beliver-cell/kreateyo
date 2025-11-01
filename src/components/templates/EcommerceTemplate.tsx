import { ShoppingCart, Star, Heart, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default function EcommerceTemplate({ colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';

  const products = [
    { id: 1, name: 'Premium Sneakers', price: 129.99, rating: 4.8, image: '👟' },
    { id: 2, name: 'Classic Watch', price: 249.99, rating: 4.9, image: '⌚' },
    { id: 3, name: 'Leather Bag', price: 89.99, rating: 4.7, image: '👜' },
    { id: 4, name: 'Sunglasses', price: 159.99, rating: 4.6, image: '🕶️' },
    { id: 5, name: 'Wireless Earbuds', price: 179.99, rating: 4.9, image: '🎧' },
    { id: 6, name: 'Smart Watch', price: 299.99, rating: 4.8, image: '⌚' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>ShopLogo</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-sm hover:text-primary transition-colors">New Arrivals</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">Men</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">Women</a>
                <a href="#" className="text-sm hover:text-primary transition-colors">Sale</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4">Summer Collection 2024</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Style
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Premium quality products at unbeatable prices. Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" style={{ backgroundColor: primaryColor }}>Shop Now</Button>
              <Button size="lg" variant="outline">View Collection</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">Featured Products</h3>
            <Button variant="link">View All →</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center text-6xl relative overflow-hidden">
                    {product.image}
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(128 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold" style={{ color: primaryColor }}>${product.price}</span>
                      <Button size="sm" style={{ backgroundColor: primaryColor }}>Add to Cart</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">What Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm mb-4">
                    "Amazing quality and fast shipping! Highly recommend this store to everyone."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold" style={{ color: primaryColor }}>
                      J
                    </div>
                    <div>
                      <div className="font-semibold text-sm">John Doe</div>
                      <div className="text-xs text-muted-foreground">Verified Buyer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: primaryColor }}>ShopLogo</h4>
              <p className="text-sm text-muted-foreground">Your trusted online shopping destination.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Shop</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>New Arrivals</div>
                <div>Best Sellers</div>
                <div>Sale</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Contact Us</div>
                <div>Shipping Info</div>
                <div>Returns</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Instagram</div>
                <div>Facebook</div>
                <div>Twitter</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
