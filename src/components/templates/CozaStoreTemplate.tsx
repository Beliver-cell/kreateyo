import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Loader2, Package, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcommerceProducts } from '@/hooks/useEcommerceProducts';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { CheckoutDialog } from './CheckoutDialog';
import { toast } from 'sonner';
import bagImg from '@/assets/products/bag.jpg';
import { FomoProvider } from '@/components/fomo';
import { ViewerCount } from '@/components/fomo/ViewerCount';
import { StockUrgency } from '@/components/fomo/StockUrgency';
import { CountdownTimer } from '@/components/fomo/CountdownTimer';
import { SoldCounter } from '@/components/fomo/SoldCounter';

interface TemplateProps {
  businessId: string;
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

interface FomoSettings {
  viewerCountEnabled: boolean;
  viewerCountMinimum: number;
  viewerCountMultiplier: string;
  viewerCountShowOnProduct: boolean;
  stockUrgencyEnabled: boolean;
  stockUrgencyThreshold: number;
  stockUrgencyMessage: string;
  stockUrgencyColor: string;
  countdownEnabled: boolean;
  countdownEndDate: string | null;
  countdownMessage: string;
  soldCounterEnabled: boolean;
  soldCounterTimeWindow: number;
  soldCounterMinimum: number;
  soldCounterMessage: string;
  primaryColor: string;
}

export default function CozaStoreTemplate({ businessId, colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fomoSettings, setFomoSettings] = useState<FomoSettings | null>(null);
  
  const { data, isLoading } = useEcommerceProducts({ category: selectedCategory, limit: 12 });
  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    if (businessId) {
      fetch(`/api/fomo/settings/${businessId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setFomoSettings(data))
        .catch(() => {});
    }
  }, [businessId]);

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || bagImg,
    });
  };

  return (
    <FomoProvider businessId={businessId}>
    <div className="min-h-screen bg-background">
      {/* Countdown Timer Banner */}
      {fomoSettings?.countdownEnabled && fomoSettings.countdownEndDate && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-3">
          <div className="container mx-auto px-4 flex justify-center">
            <CountdownTimer
              enabled={fomoSettings.countdownEnabled}
              endDate={fomoSettings.countdownEndDate}
              message={fomoSettings.countdownMessage}
              primaryColor={fomoSettings.primaryColor || primaryColor}
            />
          </div>
        </div>
      )}
      
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
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center" style={{ backgroundColor: primaryColor, color: 'white' }}>
                    {itemCount}
                  </span>
                )}
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
            <div className="flex justify-center gap-6 mt-6 flex-wrap">
              <button 
                className="text-sm font-medium transition-colors"
                style={{ color: selectedCategory === 'all' ? primaryColor : 'hsl(var(--muted-foreground))' }}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('women')}
              >
                Women
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('men')}
              >
                Men
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('accessories')}
              >
                Accessories
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data?.products?.map((product: any) => (
                <Card key={product._id} className="group cursor-pointer border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={product.images?.[0] || bagImg} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge className="absolute top-3 left-3" style={{ backgroundColor: primaryColor }}>
                          Low Stock
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          className="rounded-full" 
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium line-clamp-1 text-center">{product.name}</h4>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-semibold" style={{ color: primaryColor }}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      {fomoSettings && (
                        <div className="space-y-1">
                          <StockUrgency
                            enabled={fomoSettings.stockUrgencyEnabled}
                            threshold={fomoSettings.stockUrgencyThreshold}
                            message={fomoSettings.stockUrgencyMessage}
                            color={fomoSettings.stockUrgencyColor}
                            currentStock={product.stock || 0}
                            businessId={businessId}
                          />
                          <SoldCounter
                            businessId={businessId}
                            productId={product._id}
                            enabled={fomoSettings.soldCounterEnabled}
                            timeWindow={fomoSettings.soldCounterTimeWindow}
                            minimum={fomoSettings.soldCounterMinimum}
                            message={fomoSettings.soldCounterMessage}
                            primaryColor={fomoSettings.primaryColor || primaryColor}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

      <CartDrawer 
        open={cartOpen} 
        onOpenChange={setCartOpen}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        primaryColor={primaryColor}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        businessId={businessId}
        primaryColor={primaryColor}
      />
    </div>
    </FomoProvider>
  );
}
