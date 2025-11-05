import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Plus, Bell } from "lucide-react";

const AppointmentManager = () => {
  const appointments = [
    { id: 1, client: "John Doe", service: "Consultation", time: "10:00 AM", duration: "60 min", status: "confirmed" },
    { id: 2, client: "Jane Smith", service: "Follow-up", time: "11:30 AM", duration: "30 min", status: "pending" },
    { id: 3, client: "Bob Johnson", service: "Initial Meeting", time: "2:00 PM", duration: "90 min", status: "confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Manager</h1>
          <p className="text-muted-foreground">
            Manage bookings, schedules, and staff availability
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">8 confirmed, 4 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18.5</p>
            <p className="text-xs text-muted-foreground mt-1">Scheduled time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground mt-1">Available today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-green-500 mt-1">Auto-sent today</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Monday, January 6, 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-bold">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">{apt.duration}</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="font-medium">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">{apt.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Availability</CardTitle>
          <CardDescription>Manage team schedules and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Sarah Wilson", "Mike Chen", "Emily Brown"].map((staff) => (
              <div key={staff} className="p-4 border rounded-lg">
                <p className="font-medium mb-2">{staff}</p>
                <p className="text-sm text-muted-foreground mb-3">Available: 9 AM - 5 PM</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Booked</span>
                    <span className="font-medium">6 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span className="font-medium text-green-600">2 hours</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Automated Reminders
          </CardTitle>
          <CardDescription>
            Configure automatic appointment reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">24 Hours Before</p>
                <p className="text-sm text-muted-foreground">Email + SMS reminder</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">2 Hours Before</p>
                <p className="text-sm text-muted-foreground">SMS reminder</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Post-Appointment Follow-up</p>
                <p className="text-sm text-muted-foreground">Thank you email after 24h</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentManager;
