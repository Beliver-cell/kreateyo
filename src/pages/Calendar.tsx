import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Settings, Printer, Download, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookingDialog } from '@/components/BookingDialog';
import { toast } from '@/hooks/use-toast';

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
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [viewMode, setViewMode] = useState('week');

  const handlePrintSchedule = () => {
    toast({ title: "Printing schedule...", description: "Your schedule is being prepared for printing." });
    window.print();
  };

  const handleExportCalendar = () => {
    toast({ title: "Exporting calendar...", description: "Downloading calendar.ics file." });
  };

  const handleReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setBookingDialogOpen(true);
  };

  const handleCancelBooking = (booking: any) => {
    toast({ title: "Booking cancelled", description: `${booking.client}'s appointment has been cancelled.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your bookings and appointments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handlePrintSchedule}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCalendar}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setSelectedBooking(null);
              setBookingDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>January 2024</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDate(dates[index])}
                className={`
                  p-3 rounded-lg text-center transition-all
                  ${selectedDate === dates[index] 
                    ? 'bg-gradient-primary text-white shadow-md' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="text-lg font-bold">{dates[index]}</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold mb-3">Today's Schedule</h3>
            {mockAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-semibold">{appointment.time}</div>
                      <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{appointment.client}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReschedule(appointment)}>
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCancelBooking(appointment)}>
                          Cancel Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <BookingDialog 
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        booking={selectedBooking}
      />
    </div>
  );
}
