import { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Upload, Download, Filter, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomerDialog } from '@/components/CustomerDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234-567-8901',
    location: 'New York, NY',
    totalSpent: '$2,450',
    orders: 12,
    status: 'active',
    initials: 'JD'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234-567-8902',
    location: 'Los Angeles, CA',
    totalSpent: '$1,890',
    orders: 8,
    status: 'active',
    initials: 'JS'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 234-567-8903',
    location: 'Chicago, IL',
    totalSpent: '$3,240',
    orders: 15,
    status: 'vip',
    initials: 'BJ'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 234-567-8904',
    location: 'Houston, TX',
    totalSpent: '$890',
    orders: 4,
    status: 'active',
    initials: 'AB'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    phone: '+1 234-567-8905',
    location: 'Phoenix, AZ',
    totalSpent: '$4,120',
    orders: 18,
    status: 'vip',
    initials: 'CW'
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImport = () => {
    toast({ title: "Import customers", description: "Upload a CSV file to import customers." });
  };

  const handleExport = () => {
    toast({ title: "Exporting customers...", description: "Downloading customer data as CSV." });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your customer relationships
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleImport}
            className="hidden sm:flex"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            onClick={() => {
              setSelectedCustomer(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <Badge 
                            variant={customer.status === 'vip' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {customer.status === 'vip' ? '⭐ VIP' : 'Active'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="font-bold text-success">{customer.totalSpent}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{customer.location}</span>
                        </div>
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <span className="text-muted-foreground">{customer.orders} orders</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedCustomer(customer);
                                setDialogOpen(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Orders</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <CustomerDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
