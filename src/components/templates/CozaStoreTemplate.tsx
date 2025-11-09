import { ShoppingCart, Heart, Search, Menu, User, Star, TrendingUp, Package, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import sneakersImg from '@/assets/products/sneakers.jpg';
import watchImg from '@/assets/products/watch.jpg';
import bagImg from '@/assets/products/bag.jpg';
import sunglassesImg from '@/assets/products/sunglasses.jpg';
import earbudsImg from '@/assets/products/earbuds.jpg';
import smartwatchImg from '@/assets/products/smartwatch.jpg';

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

export default function CozaStoreTemplate({ colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';

  const products = [
    { id: 1, name: 'Esprit Ruffle Shirt', price: 16.64, oldPrice: 25.00, image: sneakersImg, badge: '-30%' },
    { id: 2, name: 'Herschel Supply Co.', price: 35.31, image: watchImg, badge: 'New' },
    { id: 3, name: 'Only Check Trouser', price: 25.50, image: bagImg },
    { id: 4, name: 'Classic Trench Coat', price: 75.00, oldPrice: 95.00, image: sunglassesImg, badge: 'Sale' },
    { id: 5, name: 'Front Pocket Jumper', price: 34.75, image: earbudsImg },
    { id: 6, name: 'Vintage Inspired Classic', price: 93.20, image: smartwatchImg, badge: 'Hot' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-muted-foreground">Free shipping for standard order over $100</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Help & FAQs</a>
              <a href="#" className="hover:text-primary transition-colors">My Account</a>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: primaryColor }}>COZA STORE</h1>
              <nav className="hidden lg:flex gap-8">
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Shop</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Blog</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">1</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center" style={{ backgroundColor: primaryColor, color: 'white' }}>2</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 lg:py-32" style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}08)` }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" style={{ backgroundColor: primaryColor }}>WOMEN COLLECTION 2024</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                NEW SEASON
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Explore the latest trends and styles in fashion. Discover your perfect look with our curated collection.
              </p>
              <Button size="lg" className="text-base" style={{ backgroundColor: primaryColor }}>
                SHOP NOW
              </Button>
            </div>
            <div className="relative h-96 lg:h-[500px] bg-muted rounded-lg overflow-hidden">
              <img src={bagImg} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10" style={{ color: primaryColor }}>
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">Free shipping on all US order or order above $100</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10" style={{ color: primaryColor }}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support 24/7</h3>
                <p className="text-sm text-muted-foreground">Contact us 24 hours a day, 7 days a week</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10" style={{ color: primaryColor }}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">30 Days Return</h3>
                <p className="text-sm text-muted-foreground">Simply return it within 30 days for an exchange</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">PRODUCT OVERVIEW</h3>
            <div className="flex justify-center gap-6 mt-6">
              <button className="text-sm font-medium hover:text-primary transition-colors" style={{ color: primaryColor }}>All Products</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Women</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Men</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Bag</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Shoes</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group cursor-pointer border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3" style={{ backgroundColor: primaryColor }}>
                        {product.badge}
                      </Badge>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full" style={{ backgroundColor: primaryColor }}>
                        Quick View
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium mb-2">{product.name}</h4>
                    <div className="flex items-center justify-center gap-2">
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>
                      )}
                      <span className="text-lg font-semibold" style={{ color: primaryColor }}>${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Subscribe Our Newsletter</h3>
            <p className="text-muted-foreground mb-8">Get E-mail updates about our latest shop and special offers.</p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border bg-background"
              />
              <Button size="lg" style={{ backgroundColor: primaryColor }}>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4" style={{ color: primaryColor }}>CATEGORIES</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Women</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Men</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Shoes</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Watches</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">HELP</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Track Order</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Returns</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Shipping</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">FAQs</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">GET IN TOUCH</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018</p>
                <p>or call us on (+1) 96 716 6879</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">NEWSLETTER</h4>
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 rounded border bg-background text-sm"
                />
                <Button className="w-full" style={{ backgroundColor: primaryColor }}>Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>Copyright ©2024 All rights reserved | Made with ♥ by Colorlib</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
