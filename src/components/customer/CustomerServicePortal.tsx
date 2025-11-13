import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/services/customerApi';
import ServiceTemplate from '@/components/templates/ServiceTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Video, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerServicePortal() {
  const { businessId } = useParams();

  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['customer-appointments', businessId],
    queryFn: () => servicesApi.getDashboard(),
  });

  if (appointmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Service Template - Public facing view */}
      <ServiceTemplate />

      {/* Customer Dashboard Section - Only visible when logged in */}
      {upcomingAppointments?.data && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Your Appointments</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAppointments.data.upcomingAppointments?.map((appointment: any) => (
                <Card key={appointment._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.service?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        with {appointment.assignedTo?.fullName}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(appointment.startTime), 'MMMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(appointment.startTime), 'h:mm a')}
                    </div>
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {appointment.location}
                      </div>
                    )}
                  </div>

                  {appointment.zoomMeetingId && (
                    <Button className="w-full" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                </Card>
              ))}
            </div>

            {(!upcomingAppointments.data.upcomingAppointments || 
              upcomingAppointments.data.upcomingAppointments.length === 0) && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button className="mt-4">Book Your First Appointment</Button>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
