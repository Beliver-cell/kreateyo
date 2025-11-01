import { useState } from 'react';
import { Plus, Search, Mail, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const mockSubscribers = [
  {
    id: 1,
    name: 'Emily Johnson',
    email: 'emily@example.com',
    subscribed: 'Jan 15, 2024',
    status: 'active',
    engagement: 'high',
    initials: 'EJ'
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael@example.com',
    subscribed: 'Jan 12, 2024',
    status: 'active',
    engagement: 'medium',
    initials: 'MB'
  },
  {
    id: 3,
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    subscribed: 'Jan 10, 2024',
    status: 'active',
    engagement: 'high',
    initials: 'SD'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@example.com',
    subscribed: 'Jan 8, 2024',
    status: 'inactive',
    engagement: 'low',
    initials: 'DW'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    subscribed: 'Jan 5, 2024',
    status: 'active',
    engagement: 'medium',
    initials: 'LA'
  },
];

export default function Subscribers() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = mockSubscribers.filter((subscriber) =>
    subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: 1850,
    active: 1654,
    growth: '+25%',
    openRate: '42%'
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your email subscribers and campaigns
          </p>
        </div>
        <Button className="bg-gradient-accent hover:opacity-90 w-full sm:w-auto">
          <Mail className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-success mt-1">{stats.growth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Engaged subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}</div>
            <p className="text-xs text-success mt-1">Above industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div className="text-2xl font-bold">{stats.growth}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Monthly growth</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSubscribers.map((subscriber) => (
              <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {subscriber.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{subscriber.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{subscriber.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                          {subscriber.status}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={
                            subscriber.engagement === 'high' 
                              ? 'border-success text-success' 
                              : subscriber.engagement === 'medium'
                              ? 'border-primary text-primary'
                              : ''
                          }
                        >
                          {subscriber.engagement} engagement
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Subscribed {subscriber.subscribed}
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
