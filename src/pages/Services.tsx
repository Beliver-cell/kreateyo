import { useState } from 'react';
import { Plus, Search, Clock, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockServices = [
  {
    id: 1,
    name: 'Personal Training Session',
    duration: '60 min',
    price: '$75',
    bookings: 24,
    status: 'active',
    icon: '💪',
    description: 'One-on-one fitness coaching'
  },
  {
    id: 2,
    name: 'Yoga Class',
    duration: '90 min',
    price: '$45',
    bookings: 18,
    status: 'active',
    icon: '🧘',
    description: 'Group yoga session for all levels'
  },
  {
    id: 3,
    name: 'Nutrition Consultation',
    duration: '45 min',
    price: '$85',
    bookings: 12,
    status: 'active',
    icon: '🥗',
    description: 'Personalized diet planning'
  },
  {
    id: 4,
    name: 'Massage Therapy',
    duration: '60 min',
    price: '$95',
    bookings: 8,
    status: 'limited',
    icon: '💆',
    description: 'Relaxation and recovery massage'
  },
  {
    id: 5,
    name: 'Group Fitness Boot Camp',
    duration: '45 min',
    price: '$35',
    bookings: 32,
    status: 'active',
    icon: '🏃',
    description: 'High-intensity group workout'
  },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your service offerings and packages
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl">
                      {service.icon}
                    </div>
                    <Badge 
                      variant={service.status === 'active' ? 'default' : 'secondary'}
                    >
                      {service.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-success">
                        <DollarSign className="w-4 h-4" />
                        <span>{service.price.replace('$', '')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                      <Users className="w-4 h-4" />
                      <span>{service.bookings} bookings this month</span>
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
