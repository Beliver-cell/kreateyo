import { useState } from 'react';
import { Plus, Search, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const mockClients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234-567-8901',
    nextAppointment: 'Jan 15, 2024',
    totalBookings: 18,
    totalSpent: '$1,350',
    status: 'regular',
    initials: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 234-567-8902',
    nextAppointment: 'Jan 16, 2024',
    totalBookings: 8,
    totalSpent: '$600',
    status: 'active',
    initials: 'MC'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 234-567-8903',
    nextAppointment: 'Jan 14, 2024',
    totalBookings: 24,
    totalSpent: '$1,800',
    status: 'vip',
    initials: 'ED'
  },
  {
    id: 4,
    name: 'David Martinez',
    email: 'david@example.com',
    phone: '+1 234-567-8904',
    nextAppointment: 'Jan 18, 2024',
    totalBookings: 12,
    totalSpent: '$900',
    status: 'regular',
    initials: 'DM'
  },
];

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your client relationships and bookings
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Export</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-accent text-white">
                        {client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <Badge 
                            variant={client.status === 'vip' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {client.status === 'vip' ? '⭐ VIP' : client.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Next Visit</span>
                          </div>
                          <p className="text-sm font-medium">{client.nextAppointment}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>Total Spent</span>
                          </div>
                          <p className="text-sm font-medium text-success">{client.totalSpent}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{client.totalBookings} total bookings</span>
                          <Button variant="ghost" size="sm" className="h-8">
                            View Profile
                          </Button>
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
