import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Package, MapPin, Clock, DollarSign, CheckCircle2, AlertCircle, TrendingUp, Phone, Navigation, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const logistics = [
  { id: 'gig', name: 'GIG Logistics', logo: '📦', status: 'connected', color: 'text-blue-600' },
  { id: 'kwik', name: 'Kwik Delivery', logo: '🚀', status: 'connected', color: 'text-green-600' },
  { id: 'dhl', name: 'DHL Africa', logo: '✈️', status: 'available', color: 'text-red-600' },
  { id: 'dispatch', name: 'Local Dispatch', logo: '🏍️', status: 'connected', color: 'text-purple-600' },
  { id: 'uber', name: 'Uber Delivery', logo: '🚗', status: 'available', color: 'text-gray-600' },
  { id: 'bolt', name: 'Bolt Delivery', logo: '⚡', status: 'available', color: 'text-yellow-600' },
];

const activeDeliveries = [
  {
    id: 'DEL-001',
    customer: 'John Doe',
    destination: 'Lagos Island, Lagos',
    courier: 'GIG Logistics',
    status: 'in_transit',
    tracking: 'GIG2024001',
    estimatedTime: '45 min',
    amount: 1500,
    cod: false,
  },
  {
    id: 'DEL-002',
    customer: 'Jane Smith',
    destination: 'Lekki Phase 1, Lagos',
    courier: 'Kwik Delivery',
    status: 'picked_up',
    tracking: 'KWK2024002',
    estimatedTime: '2 hours',
    amount: 2500,
    cod: true,
  },
  {
    id: 'DEL-003',
    customer: 'Bob Johnson',
    destination: 'Surulere, Lagos',
    courier: 'Local Dispatch',
    status: 'pending',
    tracking: 'LOC2024003',
    estimatedTime: '1 hour',
    amount: 1000,
    cod: false,
  },
];

const deliveryStats = [
  { label: 'Active Deliveries', value: '24', icon: Truck, change: '+12%', color: 'text-blue-600' },
  { label: 'Completed Today', value: '156', icon: CheckCircle2, change: '+8%', color: 'text-green-600' },
  { label: 'Avg Delivery Time', value: '42 min', icon: Clock, change: '-5%', color: 'text-purple-600' },
  { label: 'COD Collections', value: '₦245K', icon: DollarSign, change: '+15%', color: 'text-amber-600' },
];

const statusConfig = {
  pending: { label: 'Pending Pickup', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  picked_up: { label: 'Picked Up', color: 'bg-blue-100 text-blue-800', icon: Package },
  in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function Logistics() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const handleCalculateShipping = () => {
    if (!selectedProvider || !pickupAddress || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate shipping cost.",
        variant: "destructive",
      });
      return;
    }

    // Simulate shipping calculation
    const baseRate = 1000;
    const distance = Math.floor(Math.random() * 20) + 5;
    const cost = baseRate + (distance * 50);
    setEstimatedCost(cost);

    toast({
      title: "Shipping Cost Calculated",
      description: `Estimated cost: ₦${cost.toLocaleString()} for ${distance}km`,
    });
  };

  const handleBookDelivery = () => {
    toast({
      title: "Booking Delivery",
      description: "Connecting to dispatch rider...",
    });

    setTimeout(() => {
      toast({
        title: "Delivery Booked!",
        description: "Rider will arrive in 15 minutes for pickup.",
      });
    }, 1500);
  };

  const handleConnectProvider = (provider: string) => {
    toast({
      title: `Connecting to ${provider}`,
      description: "Redirecting to authentication...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Logistics & Delivery Hub</h1>
          <p className="text-muted-foreground mt-1">
            Unified delivery management across African logistics providers
          </p>
        </div>
        <Button variant="gradient" onClick={handleBookDelivery}>
          <Zap className="w-4 h-4 mr-2" />
          Quick Book Delivery
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deliveryStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} from yesterday
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="book">Book Delivery</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        {/* Active Deliveries */}
        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.map((delivery) => {
            const status = statusConfig[delivery.status as keyof typeof statusConfig];
            return (
              <Card key={delivery.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className={status.color}>
                          <status.icon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        {delivery.cod && (
                          <Badge variant="outline" className="border-amber-500 text-amber-600">
                            COD: ₦{delivery.amount.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-semibold">{delivery.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking ID</p>
                          <p className="font-mono font-semibold">{delivery.tracking}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Destination</p>
                          <p className="font-medium">{delivery.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span>{delivery.courier}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>ETA: {delivery.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Rider
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Book Delivery */}
        <TabsContent value="book">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Book New Delivery</CardTitle>
                <CardDescription>Calculate shipping cost and book a delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Select Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Choose logistics provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {logistics.filter(p => p.status === 'connected').map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <span className="flex items-center gap-2">
                            <span>{provider.logo}</span>
                            <span>{provider.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Address</Label>
                  <Input
                    id="pickup"
                    placeholder="Enter pickup location"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery Address</Label>
                  <Input
                    id="delivery"
                    placeholder="Enter delivery destination"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCalculateShipping}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Calculate Shipping Cost
                </Button>

                {estimatedCost && (
                  <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/20 animate-scale-in">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                    <p className="text-3xl font-bold text-primary">₦{estimatedCost.toLocaleString()}</p>
                  </div>
                )}

                <Button 
                  variant="gradient" 
                  className="w-full"
                  onClick={handleBookDelivery}
                  disabled={!estimatedCost}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Book Delivery Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Features</CardTitle>
                <CardDescription>What you get with our logistics integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Truck, title: 'Real-Time Tracking', desc: 'Track packages from pickup to delivery' },
                  { icon: DollarSign, title: 'Auto Fee Calculation', desc: 'Instant shipping cost estimates' },
                  { icon: Phone, title: 'Direct Rider Contact', desc: 'Call or message riders directly' },
                  { icon: CheckCircle2, title: 'COD Support', desc: 'Cash on delivery handling' },
                  { icon: Clock, title: 'Smart Routing', desc: 'Optimized delivery routes' },
                  { icon: Zap, title: 'Same-Day Delivery', desc: 'Express delivery options available' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Providers */}
        <TabsContent value="providers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logistics.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">{provider.logo}</div>
                    <div>
                      <h3 className="font-bold text-lg">{provider.name}</h3>
                      <Badge 
                        variant={provider.status === 'connected' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {provider.status === 'connected' ? 'Connected' : 'Available'}
                      </Badge>
                    </div>
                    <Button
                      variant={provider.status === 'connected' ? 'outline' : 'gradient'}
                      className="w-full"
                      onClick={() => handleConnectProvider(provider.name)}
                    >
                      {provider.status === 'connected' ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Why African Logistics Integration Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Local Expertise', desc: 'Providers understand African markets and logistics challenges' },
                  { title: 'Cost Effective', desc: 'Competitive rates for local and interstate deliveries' },
                  { title: 'Cash on Delivery', desc: 'Native COD support crucial for African e-commerce' },
                  { title: 'Flexible Delivery', desc: 'Same-day, next-day, and scheduled delivery options' },
                ].map((benefit, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <p className="font-semibold mb-1">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
