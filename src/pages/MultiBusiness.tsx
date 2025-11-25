import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, TrendingUp, Users, ShoppingCart, DollarSign, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  type: 'ecommerce' | 'services' | 'digital' | 'community';
  revenue: number;
  orders: number;
  customers: number;
  status: 'active' | 'inactive';
}

export default function MultiBusiness() {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Main Store',
      type: 'ecommerce',
      revenue: 45280,
      orders: 328,
      customers: 1243,
      status: 'active',
    },
    {
      id: '2',
      name: 'Consulting Services',
      type: 'services',
      revenue: 28900,
      orders: 52,
      customers: 89,
      status: 'active',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessType, setNewBusinessType] = useState<string>('');

  const handleCreateBusiness = () => {
    if (!newBusinessName || !newBusinessType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newBusiness: Business = {
      id: Date.now().toString(),
      name: newBusinessName,
      type: newBusinessType as any,
      revenue: 0,
      orders: 0,
      customers: 0,
      status: 'active',
    };

    setBusinesses([...businesses, newBusiness]);
    toast({
      title: "Business created",
      description: `${newBusinessName} has been added to your portfolio`,
    });
    setDialogOpen(false);
    setNewBusinessName('');
    setNewBusinessType('');
  };

  const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
  const totalOrders = businesses.reduce((sum, b) => sum + b.orders, 0);
  const totalCustomers = businesses.reduce((sum, b) => sum + b.customers, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Multi-Business Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage multiple businesses from one place</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Business</DialogTitle>
              <DialogDescription>
                Add a new business to your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Business Type</Label>
                <Select value={newBusinessType} onValueChange={setNewBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="digital">Digital/Creator</SelectItem>
                    <SelectItem value="community">Community/NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateBusiness} className="w-full">
                Create Business
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Combined from {businesses.length} businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Business List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Businesses</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {businesses.map((business) => (
            <Card key={business.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription className="capitalize">{business.type}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Switch to Dashboard</DropdownMenuItem>
                      <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Archive Business</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                    {business.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Open Dashboard
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-bold">${business.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-sm font-bold">{business.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Customers</p>
                    <p className="text-sm font-bold">{business.customers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
