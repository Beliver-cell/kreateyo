import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, MapPin, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Calendar } from '@/components/ui/calendar';

export default function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcomingBookings = [
    {
      id: 1,
      client: 'Sarah Johnson',
      service: 'Website Design Consultation',
      time: '10:00 AM',
      duration: 60,
      type: 'video',
      status: 'confirmed',
    },
    {
      id: 2,
      client: 'Michael Chen',
      service: 'SEO Strategy Session',
      time: '2:00 PM',
      duration: 45,
      type: 'in-person',
      status: 'pending',
    },
    {
      id: 3,
      client: 'Emma Williams',
      service: 'Brand Development',
      time: '4:30 PM',
      duration: 90,
      type: 'video',
      status: 'confirmed',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your appointments and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.map(booking => (
                <div
                  key={booking.id}
                  className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.client}</span>
                    </div>
                    <Badge
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{booking.service}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-1">
                      {booking.type === 'video' ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      {booking.duration} mins
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                day => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{day}</span>
                    <Button variant="outline" size="sm">
                      9:00 AM - 5:00 PM
                    </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
