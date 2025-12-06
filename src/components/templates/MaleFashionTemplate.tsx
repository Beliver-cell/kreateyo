import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEcommerceProducts } from '@/hooks/useEcommerceProducts';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { CheckoutDialog } from './CheckoutDialog';
import bagImg from '@/assets/products/bag.jpg';
import sneakersImg from '@/assets/products/sneakers.jpg';
import watchImg from '@/assets/products/watch.jpg';
import sunglassesImg from '@/assets/products/sunglasses.jpg';
import earbudsImg from '@/assets/products/earbuds.jpg';
import smartwatchImg from '@/assets/products/smartwatch.jpg';
import { FomoProvider } from '@/components/fomo';
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

export default function MaleFashionTemplate({ businessId, colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [fomoSettings, setFomoSettings] = useState<FomoSettings | null>(null);

  const { data, isLoading } = useEcommerceProducts({ category: selectedCategory, page, limit: 6 });
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

  const categories = [
    { name: "Men's", count: 358, image: sneakersImg },
    { name: "Women's", count: 273, image: bagImg },
    { name: 'Kids', count: 159, image: watchImg },
  ];

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
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Free shipping, 30-day return or refund guarantee.</span>
            <div className="flex gap-4 items-center">
              <button className="hover:text-primary transition-colors">SIGN IN</button>
              <button className="hover:text-primary transition-colors">FAQS</button>
              <div className="flex gap-2">
                <button className="hover:text-primary transition-colors">USD</button>
                <span className="text-muted-foreground">|</span>
                <button className="hover:text-primary transition-colors">ENG</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
              Male<span className="font-light">Fashion</span>
            </h1>
            
            <nav className="hidden lg:flex gap-10">
              <a href="#" className="text-sm font-medium transition-colors" style={{ color: primaryColor }}>Home</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Shop</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pages</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Blog</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contacts</a>
            </nav>

            <div className="flex items-center gap-4">
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

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px]" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}10)` }}>
        <div className="container mx-auto px-4 h-full">
          <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-wider" style={{ color: primaryColor }}>Summer Collection</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Fall - Winter<br />Collections 2030
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.
              </p>
              <Button size="lg" className="rounded-full px-8" style={{ backgroundColor: primaryColor }}>
                SHOP NOW
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative h-full hidden lg:block">
              <img src={bagImg} alt="Hero" className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Card key={idx} className="group cursor-pointer overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm">{category.count} items</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold">Product Overview</h3>
            <div className="flex gap-6 flex-wrap">
              <button 
                className="text-sm font-medium transition-colors"
                style={{ color: selectedCategory === 'all' ? primaryColor : 'hsl(var(--muted-foreground))' }}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('women')}
              >
                Women's
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('men')}
              >
                Men's
              </button>
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setSelectedCategory('kids')}
              >
                Kid's
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.products?.map((product: any) => (
                  <Card key={product._id} className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img 
                          src={product.images?.[0] || bagImg} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-5">
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3 h-3 ${idx < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                        <h4 className="font-medium mb-3 line-clamp-1">{product.name}</h4>
                        {fomoSettings?.stockUrgencyEnabled && (
                          <StockUrgency
                            enabled={fomoSettings.stockUrgencyEnabled}
                            currentStock={product.stock}
                            threshold={fomoSettings.stockUrgencyThreshold}
                            message={fomoSettings.stockUrgencyMessage}
                            color={fomoSettings.stockUrgencyColor}
                            businessId={businessId}
                          />
                        )}
                        {fomoSettings?.soldCounterEnabled && (
                          <SoldCounter
                            enabled={fomoSettings.soldCounterEnabled}
                            businessId={businessId}
                            productId={product._id}
                            timeWindow={fomoSettings.soldCounterTimeWindow}
                            minimum={fomoSettings.soldCounterMinimum}
                            message={fomoSettings.soldCounterMessage}
                            primaryColor={fomoSettings.primaryColor || primaryColor}
                          />
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold" style={{ color: primaryColor }}>
                            ${product.price.toFixed(2)}
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? 'OUT OF STOCK' : '+ ADD TO CART'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full px-8"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= data.totalPages}
                  >
                    {page >= data.totalPages ? 'NO MORE PRODUCTS' : 'LOAD MORE'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Instagram</h3>
            <p className="text-muted-foreground">
              Follow us on Instagram <a href="#" className="font-medium" style={{ color: primaryColor }}>@MaleFashion</a>
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[sneakersImg, watchImg, bagImg, sunglassesImg, earbudsImg, smartwatchImg].map((img, idx) => (
              <div key={idx} className="aspect-square bg-muted overflow-hidden rounded cursor-pointer group">
                <img 
                  src={img} 
                  alt={`Instagram ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-xl mb-4" style={{ color: primaryColor }}>Male<span className="font-light">Fashion</span></h4>
              <p className="text-sm text-muted-foreground mb-4">
                The customer is at the heart of our unique business model, which includes design.
              </p>
              <div className="flex gap-3">
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-xs">f</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-xs">in</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <span className="text-xs">t</span>
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">SHOPPING</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Clothing Store</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Trending Shoes</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Accessories</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Sale</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">SHOPPING</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Contact Us</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Payment Methods</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Delivary</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Return & Exchanges</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">NEWSLETTER</h5>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to know about new arrivals, look books, sales & promos!
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded border bg-background text-sm"
                />
                <Button size="sm" style={{ backgroundColor: primaryColor }}>→</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>Copyright ©2024 All rights reserved | This template is made with ♥ by Colorlib</p>
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
