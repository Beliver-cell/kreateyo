import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/services/customerApi';
import MobileNav from '@/components/customer/MobileNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function ServicesDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['services-dashboard'],
    queryFn: () => servicesApi.getDashboard(),
  });

  const handleJoinZoom = async (appointmentId: string) => {
    try {
      const response = await servicesApi.joinZoomMeeting(appointmentId);
      window.open(response.data.joinUrl, '_blank');
    } catch (error) {
      console.error('Failed to join Zoom meeting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-sm p-4 sticky top-0 z-10 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">My Dashboard</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="text-2xl font-bold text-foreground">
              {data?.data?.upcomingAppointments?.length || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {data?.data?.stats?.totalAppointments || 0}
            </p>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Upcoming Appointments</h2>
          <div className="space-y-3">
            {data?.data?.upcomingAppointments?.length > 0 ? (
              data.data.upcomingAppointments.map((appointment: any) => (
                <Card key={appointment._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {appointment.service?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.assignedTo?.fullName}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(appointment.startTime), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(appointment.startTime), 'HH:mm')}
                    </div>
                  </div>

                  {appointment.zoomMeetingId && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleJoinZoom(appointment._id)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Zoom Meeting
                    </Button>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full">Book New</Button>
          <Button variant="outline" className="w-full">View All</Button>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
