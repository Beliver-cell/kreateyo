import { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your customer relationships
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
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
            <Button variant="outline" className="w-full sm:w-auto">Export</Button>
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
                        <div className="pt-2 border-t border-border">
                          <span className="text-muted-foreground">{customer.orders} orders</span>
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
    </div>
  );
}
