import { useState, useMemo } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CallCard } from '@/components/calls/CallCard';
import { VideoCallRoom } from '@/components/calls/VideoCallRoom';
import { ScheduleCallDialog } from '@/components/calls/ScheduleCallDialog';
import { VideoCall, CreateCallRequest, CALL_BILLING_RATE_PER_HOUR } from '@/types/calls';
import {
  Video,
  Phone,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  History,
  Play,
  PhoneCall,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const generateMockCalls = (): VideoCall[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: '1',
      channelName: 'call-1-abc123',
      tenantId: 'tenant-1',
      hostUserId: 'user-1',
      participantUserIds: ['client-1', 'client-2'],
      scheduledAt: tomorrow.toISOString(),
      status: 'scheduled',
      type: 'video',
      title: 'Strategy Consultation',
      description: 'Discuss Q1 marketing strategy with the team',
      isHd: true,
      screenShareEnabled: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '2',
      channelName: 'call-2-def456',
      tenantId: 'tenant-1',
      hostUserId: 'user-1',
      participantUserIds: ['client-3'],
      scheduledAt: new Date(now.getTime() + 3600000).toISOString(),
      startedAt: new Date().toISOString(),
      status: 'active',
      type: 'video',
      title: 'Client Onboarding Session',
      description: 'Welcome call for new client',
      isHd: true,
      screenShareEnabled: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '3',
      channelName: 'call-3-ghi789',
      tenantId: 'tenant-1',
      hostUserId: 'user-1',
      participantUserIds: ['client-4'],
      scheduledAt: yesterday.toISOString(),
      startedAt: yesterday.toISOString(),
      endedAt: new Date(yesterday.getTime() + 2700000).toISOString(),
      status: 'completed',
      type: 'video',
      title: 'Project Review Meeting',
      description: 'Review project milestones and deliverables',
      durationMinutes: 45,
      billedMinutes: 45,
      isHd: true,
      screenShareEnabled: true,
      recordingUrl: 'https://example.com/recording-3',
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
    },
    {
      id: '4',
      channelName: 'call-4-jkl012',
      tenantId: 'tenant-1',
      hostUserId: 'user-1',
      participantUserIds: ['client-5', 'client-6'],
      scheduledAt: lastWeek.toISOString(),
      startedAt: lastWeek.toISOString(),
      endedAt: new Date(lastWeek.getTime() + 3600000).toISOString(),
      status: 'completed',
      type: 'voice',
      title: 'Team Sync Call',
      description: 'Weekly team synchronization',
      durationMinutes: 60,
      billedMinutes: 60,
      isHd: false,
      screenShareEnabled: false,
      createdAt: lastWeek.toISOString(),
      updatedAt: lastWeek.toISOString(),
    },
  ];
};

export default function Calls() {
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const [calls, setCalls] = useState<VideoCall[]>(generateMockCalls());
  const [activeCall, setActiveCall] = useState<VideoCall | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (businessProfile.type !== 'services') {
    return <Navigate to="/dashboard" replace />;
  }

  const upcomingCalls = useMemo(() => 
    calls.filter(c => c.status === 'scheduled'),
    [calls]
  );

  const activeCalls = useMemo(() => 
    calls.filter(c => c.status === 'active'),
    [calls]
  );

  const historyCalls = useMemo(() => 
    calls.filter(c => ['completed', 'cancelled', 'no_show'].includes(c.status)),
    [calls]
  );

  const totalMinutesUsed = useMemo(() => 
    historyCalls.reduce((acc, call) => acc + (call.billedMinutes || 0), 0),
    [historyCalls]
  );

  const totalCost = useMemo(() => 
    (totalMinutesUsed / 60) * CALL_BILLING_RATE_PER_HOUR,
    [totalMinutesUsed]
  );

  const handleScheduleCall = async (data: CreateCallRequest) => {
    setIsLoading(true);
    try {
      const newCall: VideoCall = {
        id: `call-${Date.now()}`,
        channelName: `channel-${Date.now()}`,
        tenantId: 'tenant-1',
        hostUserId: 'user-1',
        participantUserIds: data.participantUserIds,
        scheduledAt: data.scheduledAt,
        status: 'scheduled',
        type: data.type,
        title: data.title,
        description: data.description,
        isHd: data.isHd ?? true,
        screenShareEnabled: data.screenShareEnabled ?? true,
        calendlyEventUri: data.calendlyEventUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCalls(prev => [newCall, ...prev]);
      setIsScheduleDialogOpen(false);
      toast({
        title: 'Call Scheduled',
        description: `Your call "${data.title}" has been scheduled.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule call. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCall = (call: VideoCall) => {
    if (call.status === 'scheduled') {
      setCalls(prev => prev.map(c => 
        c.id === call.id 
          ? { ...c, status: 'active' as const, startedAt: new Date().toISOString() }
          : c
      ));
    }
    setActiveCall(call);
  };

  const handleLeaveCall = () => {
    setActiveCall(null);
  };

  const handleCallEnded = (durationMinutes: number) => {
    if (!activeCall) return;

    setCalls(prev => prev.map(c =>
      c.id === activeCall.id
        ? {
            ...c,
            status: 'completed' as const,
            endedAt: new Date().toISOString(),
            durationMinutes,
            billedMinutes: durationMinutes,
          }
        : c
    ));

    toast({
      title: 'Call Ended',
      description: `Call duration: ${durationMinutes} minutes`,
    });
  };

  const handleCancelCall = (call: VideoCall) => {
    setCalls(prev => prev.map(c =>
      c.id === call.id
        ? { ...c, status: 'cancelled' as const }
        : c
    ));
    toast({
      title: 'Call Cancelled',
      description: `"${call.title}" has been cancelled.`,
    });
  };

  if (activeCall) {
    return (
      <div className="h-[calc(100vh-4rem)]">
        <VideoCallRoom
          call={activeCall}
          agoraConfig={{
            appId: import.meta.env.VITE_AGORA_APP_ID || 'demo-app-id',
            channel: activeCall.channelName,
            token: '',
            uid: Math.floor(Math.random() * 100000),
          }}
          onLeave={handleLeaveCall}
          onCallEnded={handleCallEnded}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="calls-page">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video Calls</h1>
          <p className="text-muted-foreground">
            Manage your video and voice calls with clients
          </p>
        </div>
        <Button onClick={() => setIsScheduleDialogOpen(true)} data-testid="button-schedule-call">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Call
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-upcoming-calls">
              {upcomingCalls.length}
            </div>
            <p className="text-xs text-muted-foreground">scheduled calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <PhoneCall className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-active-calls">
              {activeCalls.length}
            </div>
            <p className="text-xs text-muted-foreground">live calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Minutes Used</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-minutes-used">
              {totalMinutesUsed}
            </div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-cost">
              ${totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ${CALL_BILLING_RATE_PER_HOUR}/hr
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2" data-testid="tab-upcoming">
            <Calendar className="h-4 w-4" />
            Upcoming
            {upcomingCalls.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {upcomingCalls.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2" data-testid="tab-active">
            <Play className="h-4 w-4" />
            Active
            {activeCalls.length > 0 && (
              <Badge className="ml-1 bg-green-500">
                {activeCalls.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingCalls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Calls</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any scheduled calls. Schedule one to get started.
                </p>
                <Button onClick={() => setIsScheduleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule a Call
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingCalls.map(call => (
                <CallCard
                  key={call.id}
                  call={call}
                  onJoin={handleJoinCall}
                  onCancel={handleCancelCall}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeCalls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PhoneCall className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Calls</h3>
                <p className="text-muted-foreground text-center">
                  There are no calls in progress right now.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCalls.map(call => (
                <CallCard
                  key={call.id}
                  call={call}
                  onJoin={handleJoinCall}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyCalls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Call History</h3>
                <p className="text-muted-foreground text-center">
                  Your completed calls will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyCalls.map(call => (
                <CallCard
                  key={call.id}
                  call={call}
                  onViewRecording={(call) => {
                    if (call.recordingUrl) {
                      window.open(call.recordingUrl, '_blank');
                    }
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ScheduleCallDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        onSchedule={handleScheduleCall}
        isLoading={isLoading}
      />
    </div>
  );
}
