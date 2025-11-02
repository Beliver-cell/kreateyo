import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockAppointments = [
  { id: 1, time: '09:00', client: 'John Doe', service: 'Personal Training', duration: '60 min', status: 'confirmed' },
  { id: 2, time: '10:30', client: 'Jane Smith', service: 'Yoga Class', duration: '90 min', status: 'confirmed' },
  { id: 3, time: '13:00', client: 'Bob Johnson', service: 'Nutrition Consultation', duration: '45 min', status: 'pending' },
  { id: 4, time: '15:00', client: 'Alice Brown', service: 'Massage Therapy', duration: '60 min', status: 'confirmed' },
  { id: 5, time: '16:30', client: 'Charlie Wilson', service: 'Boot Camp', duration: '45 min', status: 'confirmed' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [12, 13, 14, 15, 16, 17, 18];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(14);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Manage your bookings and appointments
            </p>
          </div>
          <Button className="bg-gradient-accent hover:opacity-90 w-full sm:w-auto h-9">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          <Card>
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">January 2024</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Today</Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dates[index])}
                    className={`
                      p-2 rounded-lg text-center transition-all text-xs
                      ${selectedDate === dates[index] 
                        ? 'bg-gradient-primary text-white shadow-md' 
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className="text-[10px] font-medium mb-0.5">{day}</div>
                    <div className="text-sm font-bold">{dates[index]}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold mb-2">Today's Schedule</h3>
                {mockAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-2">
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[50px]">
                          <div className="text-xs font-semibold">{appointment.time}</div>
                          <div className="text-[10px] text-muted-foreground">{appointment.duration}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold">{appointment.client}</h4>
                          <p className="text-[10px] text-muted-foreground">{appointment.service}</p>
                        </div>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px]">
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
